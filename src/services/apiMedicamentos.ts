import { medicamentosVeterinarios } from "@/data/medicamentosVeterinarios";

// Buscar medicamentos na ANVISA (API pública)
export const buscarMedicamentosANVISA = async (
  termo: string
): Promise<any[]> => {
  try {
    // API ANVISA - dados públicos
    const response = await fetch(
      `https://consultas.anvisa.gov.br/api/consulta/medicamentos/termo?nome=${encodeURIComponent(
        termo
      )}&pagina=1`
    );

    if (!response.ok) {
      throw new Error("Erro na API ANVISA");
    }

    const data = await response.json();
    return data.content || [];
  } catch (error) {
    console.warn("API ANVISA indisponível, usando dados locais:", error);
    // Fallback para dados locais
    return medicamentosVeterinarios.filter(
      (med) =>
        med.nomeComercial.toLowerCase().includes(termo.toLowerCase()) ||
        med.nomeQuimico.toLowerCase().includes(termo.toLowerCase())
    );
  }
};

// Buscar Bulário Eletrônico
export const buscarMedicamentosBulario = async (
  principioAtivo: string
): Promise<any[]> => {
  try {
    const response = await fetch(
      `https://bulario-api.vercel.app/api/medicamentos?search=${encodeURIComponent(
        principioAtivo
      )}`
    );

    if (!response.ok) {
      throw new Error("Erro na API Bulário");
    }

    return await response.json();
  } catch (error) {
    console.warn("API Bulário indisponível:", error);
    return [];
  }
};

// Buscar medicamentos veterinários (local + API)
export const buscarMedicamentosCompletos = async (
  termo: string,
  filtroEspecie?: string,
  filtroCategoria?: string
): Promise<any[]> => {
  // Primeiro busca nos dados locais
  let resultados = [...medicamentosVeterinarios];

  // Aplicar filtros
  if (termo) {
    const termoLower = termo.toLowerCase();
    resultados = resultados.filter(
      (med) =>
        med.nomeComercial.toLowerCase().includes(termoLower) ||
        med.nomeQuimico.toLowerCase().includes(termoLower) ||
        med.indicacao.toLowerCase().includes(termoLower) ||
        med.laboratorios.some((lab) => lab.toLowerCase().includes(termoLower))
    );
  }

  if (filtroEspecie && filtroEspecie !== "TODAS") {
    resultados = resultados.filter((med) =>
      med.especies.some(
        (esp) => esp.codigo === filtroEspecie && esp.dosePorKg > 0
      )
    );
  }

  if (filtroCategoria && filtroCategoria !== "Todos") {
    resultados = resultados.filter((med) => med.categoria === filtroCategoria);
  }

  // Se não encontrar localmente, tenta API
  if (resultados.length === 0 && termo.length > 3) {
    try {
      const daANVISA = await buscarMedicamentosANVISA(termo);
      resultados = [...resultados, ...daANVISA.slice(0, 10)]; // Limita a 10 resultados da API
    } catch (error) {
      console.warn("Busca na API falhou:", error);
    }
  }

  return resultados;
};

// Estatísticas
export const getEstatisticasMedicamentos = () => {
  const total = medicamentosVeterinarios.length;
  const veterinarios = medicamentosVeterinarios.filter(
    (m) => m.isVeterinario
  ).length;
  const humanos = medicamentosVeterinarios.filter(
    (m) => !m.isVeterinario
  ).length;
  const comAtencao = medicamentosVeterinarios.filter((m) => m.atencao).length;

  // Medicamento mais usado
  const maisUsado = medicamentosVeterinarios.reduce((prev, current) =>
    prev.usadoEmConsultas > current.usadoEmConsultas ? prev : current
  );

  // Distribuição por categoria
  const categoriasCount: Record<string, number> = {};
  medicamentosVeterinarios.forEach((med) => {
    categoriasCount[med.categoria] = (categoriasCount[med.categoria] || 0) + 1;
  });

  return {
    total,
    veterinarios,
    humanos,
    comAtencao,
    maisUsado: maisUsado.nomeComercial,
    totalUsos: medicamentosVeterinarios.reduce(
      (sum, med) => sum + med.usadoEmConsultas,
      0
    ),
    categorias: categoriasCount,
  };
};
