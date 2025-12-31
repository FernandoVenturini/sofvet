import { medicamentoService } from '@/services/medicamentoService';

const medicamentosIniciais = [
	{
		nomeComercial: "AAS",
		nomeQuimico: "Ácido Acetilsalicílico",
		especies: [
			{ codigo: "001", descricao: "Canino", dosePorKg: 10.0, unidade: "mg" },
			{ codigo: "002", descricao: "Felino", dosePorKg: 0.0, unidade: "mg" },
		],
		atencao: "NÃO APLICAR EM FELINOS!!! Pode causar úlceras gástricas.",
		apresentacao: "Comprimidos de 500mg. Uso infantil: Comprimidos de 100mg.",
		indicacao: "Analgésico, Antitérmico, Antirreumático",
		posologia: "Adulto: 1 a 2 comprimidos 3 a 4 vezes ao dia. Crianças: 80 a 120 mg/kg/dia.",
		laboratorios: ["Wintherp", "Bayer"],
		observacoes: "Analgésico de uso humano, adaptar doses para veterinária. Monitorar função renal.",
		isVeterinario: false,
	},
	{
		nomeComercial: "Ivermectina",
		nomeQuimico: "Ivermectina",
		especies: [
			{ codigo: "001", descricao: "Canino", dosePorKg: 0.2, unidade: "mg" },
			{ codigo: "003", descricao: "Bovino", dosePorKg: 0.5, unidade: "mg" },
			{ codigo: "004", descricao: "Equino", dosePorKg: 0.4, unidade: "mg" },
		],
		atencao: "CUIDADO COM RAÇAS COLLIE, PASTOR AUSTRALIANO E SHELTIE. Pode causar neurotoxicidade.",
		apresentacao: "Injetável 1%, Comprimidos 6mg, Solução oral, Pomada",
		indicacao: "Antiparasitário de amplo espectro (ácaros, piolhos, vermes redondos)",
		posologia: "Caninos: 0.2mg/kg SC a cada 15 dias. Bovinos: 0.5mg/kg SC. Equinos: 0.4mg/kg.",
		laboratorios: ["Merial", "Ourofino", "Zoetis"],
		observacoes: "Eficaz contra sarna, piolhos, verminoses. Não usar em filhotes com menos de 6 semanas.",
		isVeterinario: true,
	},
	{
		nomeComercial: "Dipirona",
		nomeQuimico: "Metamizol Sódico",
		especies: [
			{ codigo: "001", descricao: "Canino", dosePorKg: 25.0, unidade: "mg" },
			{ codigo: "002", descricao: "Felino", dosePorKg: 15.0, unidade: "mg" },
		],
		atencao: "Usar com cautela em felinos. Monitorar função hepática.",
		apresentacao: "Comprimidos 500mg, Solução oral, Injetável",
		indicacao: "Analgésico e Antitérmico",
		posologia: "Caninos: 25mg/kg a cada 8-12h. Felinos: 15mg/kg a cada 12h.",
		laboratorios: ["Hoechst", "Sanofi"],
		observacoes: "Analgésico não-opióide. Efeito antipirético potente.",
		isVeterinario: false,
	},
	{
		nomeComercial: "Enrofloxacina",
		nomeQuimico: "Enrofloxacina",
		especies: [
			{ codigo: "001", descricao: "Canino", dosePorKg: 5.0, unidade: "mg" },
			{ codigo: "002", descricao: "Felino", dosePorKg: 5.0, unidade: "mg" },
		],
		atencao: "Não usar em animais em crescimento (pode causar artropatia).",
		apresentacao: "Comprimidos 50mg/150mg, Injetável 2.5% e 10%",
		indicacao: "Antibiótico de amplo espectro (infecções bacterianas)",
		posologia: "5mg/kg a cada 24h por 5-10 dias. Em infecções graves: 10mg/kg.",
		laboratorios: ["Bayer", "Zoetis"],
		observacoes: "Fluoroquinolona de 2ª geração. Eficaz contra bactérias Gram-negativas.",
		isVeterinario: true,
	},
	{
		nomeComercial: "Prednisona",
		nomeQuimico: "Prednisona",
		especies: [
			{ codigo: "001", descricao: "Canino", dosePorKg: 0.5, unidade: "mg" },
			{ codigo: "002", descricao: "Felino", dosePorKg: 0.5, unidade: "mg" },
		],
		atencao: "Usar com cautela em animais com infecções. Desmame gradual.",
		apresentacao: "Comprimidos 5mg/20mg, Solução oral",
		indicacao: "Anti-inflamatório esteroidal, Imunossupressor",
		posologia: "0.5-1mg/kg a cada 12-24h. Reduzir gradualmente após controle.",
		laboratorios: ["Pfizer", "Merck"],
		observacoes: "Corticoide de média potência. Monitorar efeitos colaterais.",
		isVeterinario: true,
	},
];

export async function importarDadosIniciais() {
	try {
		console.log('Iniciando importação de medicamentos...');

		for (const medicamento of medicamentosIniciais) {
			await medicamentoService.create(medicamento);
			console.log(`Importado: ${medicamento.nomeComercial}`);
		}

		console.log('Importação concluída com sucesso!');
		return true;
	} catch (error) {
		console.error('Erro na importação:', error);
		return false;
	}
}