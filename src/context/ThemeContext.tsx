// Importa funções do React:
// - createContext: cria um "contexto", um jeito de compartilhar dados
//   entre componentes sem precisar passar props manualmente em cada nível.
// - useContext: hook pra "consumir" esse contexto em qualquer componente.
// - useEffect: hook pra rodar efeitos colaterais (tipo mexer no DOM, ler localStorage).
// - useState: hook pra guardar estado local.
// - ReactNode: tipo do TypeScript pra representar "qualquer coisa que o React pode renderizar".
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Define os dois valores possíveis pro tema: só pode ser "light" ou "dark".
type Theme = "light" | "dark";

// Define o "formato" do que o contexto vai disponibilizar pros componentes:
// o tema atual, e uma função pra alternar entre os dois.
type ThemeContextType = {
	theme: Theme;
	toggleTheme: () => void;
};

// Cria o contexto de fato. Começa como "undefined" porque, fora do Provider,
// ele não tem valor nenhum ainda — isso ajuda a gente a detectar erro
// caso alguém tente usar o hook fora do Provider (ver mais abaixo).
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Componente "Provider": ele que vai ENVOLVER toda a aplicação (lá no App.tsx)
// e disponibilizar o tema pra qualquer componente filho que precisar.
export function ThemeProvider({ children }: { children: ReactNode }) {
	// Estado que guarda o tema atual.
	// A função dentro do useState só roda UMA VEZ, na primeira renderização,
	// pra decidir qual é o tema inicial:
	const [theme, setTheme] = useState<Theme>(() => {
		// Tenta ler o tema salvo no localStorage (de uma visita anterior).
		const savedTheme = localStorage.getItem("theme") as Theme | null;

		// Se já tiver um tema salvo, usa ele.
		if (savedTheme) return savedTheme;

		// Se não tiver nada salvo (primeira visita), verifica a preferência
		// do sistema operacional do usuário (Windows/Mac tem opção de tema escuro).
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

		// Define o tema inicial com base nisso.
		return prefersDark ? "dark" : "light";
	});

	// Esse efeito roda toda vez que "theme" mudar.
	useEffect(() => {
		// Pega a referência da tag <html> do documento.
		const root = window.document.documentElement;

		// Remove as duas classes primeiro, pra garantir que não fiquem
		// as duas juntas por engano (ex: "light dark" ao mesmo tempo).
		root.classList.remove("light", "dark");

		// Adiciona a classe correspondente ao tema atual.
		// É essa classe "dark" que o Tailwind procura pra aplicar
		// as variáveis definidas em ".dark" no seu CSS.
		root.classList.add(theme);

		// Salva a escolha no localStorage, pra lembrar na próxima visita.
		localStorage.setItem("theme", theme);
	}, [theme]); // O array [theme] diz: "roda esse efeito de novo só quando 'theme' mudar".

	// Função que alterna entre os dois temas.
	function toggleTheme() {
		// Usa a forma de callback do setState pra garantir que estamos
		// sempre partindo do valor mais atual do tema.
		setTheme((prev) => (prev === "light" ? "dark" : "light"));
	}

	// Retorna o Provider do contexto, passando o tema atual e a função
	// de alternância como "value". Tudo que estiver dentro de <ThemeProvider>
	// (ou seja, "children") vai poder acessar esses dados.
	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

// Hook customizado pra facilitar o uso do contexto nos componentes.
// Em vez de importar "useContext" e "ThemeContext" em todo lugar,
// os componentes só vão chamar "useTheme()".
export function useTheme() {
	const context = useContext(ThemeContext);

	// Se alguém tentar usar esse hook fora do <ThemeProvider>,
	// o "context" vai ser "undefined" — aí a gente lança um erro
	// explicando o problema, em vez de deixar um bug silencioso acontecer.
	if (context === undefined) {
		throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
	}

	return context;
}