
export interface Proprietario {
  id: string;
  codigo: string; 
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  rg: string;
  cpf: string;
  dataNascimento: string;
  ddd: string;
  telefone1: string;
  telefone2: string;
  telefone3: string;
  complemento: string;
  email: string;
  marcado: boolean;
  motivoMarcacao?: string;
  restricao: boolean;
  motivoRestricao?: string;
  saldo: number; // Saldo devedor/credor
  dataCadastro: string;
  dataUltimaCompra?: string;
  valorMaiorCompra?: number;
  dataMaiorCompra?: string;
  ativo: boolean;
}

export interface FichaAnimal {
  id: string;
  ficha: string;
  vivo: boolean;
  nome: string;
  sexo: "M" | "F";
  especie: string;
  raca: string;
  pelagem: string;
  proprietarioId: string;
}

export interface LancamentoConta {
  id: string;
  data: string;
  operacao: string;
  descricao: string;
  valor: number;
  tipo: "DEBITO" | "CREDITO";
  proprietarioId: string;
}
