// src/types/medicamento.ts
export interface Medicamento {
  id: string;
  nomeComercial: string;
  nomeQuimico: string;
  especies: {
    codigo: string;
    descricao: string;
    dosePorKg: number;
  }[];
  atencao: string;
  apresentacao: string;
  indicacao: string;
  posologia: string;
  laboratorios: string[];
  observacoes: string;
  isVeterinario: boolean;
  dataCadastro: Date;
  dataAtualizacao: Date;
}