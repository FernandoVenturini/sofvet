export interface EspecieDosagem {
	codigo: string;
	descricao: string;
	dosePorKg: number;
	unidade: string;
}

export interface Medicamento {
	id: string;
	nomeComercial: string;
	nomeQuimico: string;
	especies: EspecieDosagem[];
	atencao: string;
	apresentacao: string;
	indicacao: string;
	posologia: string;
	laboratorios: string[];
	observacoes: string;
	isVeterinario: boolean;
	dataCadastro: Date;
	dataAtualizacao: Date;
	usadoEmConsultas: number;
}