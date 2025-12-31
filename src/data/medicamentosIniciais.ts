export const medicamentosIniciais = [
	{
		nomeComercial: "AAS",
		nomeQuimico: "Ácido Acetilsalicílico",
		especies: [
			{ codigo: "001", descricao: "Canino", dosePorKg: 10.0 },
			{ codigo: "002", descricao: "Felino", dosePorKg: 0.0 },
		],
		atencao: "NÃO APLICAR EM FELINOS!!!",
		apresentacao: "Comprimidos de 500mg. Uso infantil: Comprimidos de 100mg.",
		indicacao: "Analgésico, Antitérmico, Antirreumático",
		posologia: "Adulto: 1 a 2 comprimidos 3 a 4 vezes ao dia. Crianças: 80 a 120 mg/kg/dia.",
		laboratorios: ["Wintherp"],
		observacoes: "Analgésico de uso humano, adaptar doses para veterinária",
		isVeterinario: false,
	},
	{
		nomeComercial: "Ivermectina",
		nomeQuimico: "Ivermectina",
		especies: [
			{ codigo: "001", descricao: "Canino", dosePorKg: 0.2 },
			{ codigo: "003", descricao: "Bovino", dosePorKg: 0.5 },
		],
		atencao: "CUIDADO COM RAÇAS COLLIE E PASTOR AUSTRALIANO",
		apresentacao: "Injetável 1%, Comprimidos 6mg, Solução oral",
		indicacao: "Antiparasitário de amplo espectro",
		posologia: "Caninos: 0.2mg/kg SC. Bovinos: 0.5mg/kg SC.",
		laboratorios: ["Merial", "Ourofino"],
		observacoes: "Eficaz contra ácaros, piolhos, vermes redondos",
		isVeterinario: true,
	},
	// Adicione mais medicamentos conforme necessário
];