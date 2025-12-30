export interface Fornecedor {
  id: string;
  codigo: string; // Código interno
  tipo: "PRODUTO" | "SERVICO" | "AMBOS"; // Tipo de fornecedor
  nome: string;
  nomeFantasia?: string;
  cnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  email: string;
  telefone: string;
  telefone2?: string;
  fax?: string;
  contato: string; // Pessoa para contato
  cargoContato?: string;

  // Endereço
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;

  // Dados bancários
  banco?: string;
  agencia?: string;
  conta?: string;
  tipoConta?: "CORRENTE" | "POUPANCA";
  favorecido?: string;
  cpfFavorecido?: string;

  // Produtos/Especialidade
  especialidade?: string; // Ex: "Medicamentos", "Rações", "Equipamentos"
  principaisProdutos?: string[];

  // Status
  ativo: boolean;
  preferencial: boolean; // Fornecedor preferencial
  observacoes?: string;

  // Datas
  dataCadastro: string;
  dataUltimaCompra?: string;
  valorUltimaCompra?: number;

  // Métricas
  totalCompras: number;
  quantidadeCompras: number;
  prazoEntrega?: number; // Dias
  condicaoPagamento?: string; // Ex: "30/60/90 dias"
}

export interface ProdutoFornecedor {
  id: string;
  fornecedorId: string;
  produtoId: string;
  codigoFornecedor: string; // Código do produto no fornecedor
  descricao: string;
  precoCusto: number;
  precoMinimo?: number;
  unidade: string;
  ativo: boolean;
  principal: boolean; // Produto principal deste fornecedor
  dataCadastro: string;
  dataAtualizacao: string;
}

export interface Cotacao {
  id: string;
  fornecedorId: string;
  produtoId: string;
  data: string;
  preco: number;
  prazoEntrega: number; // Dias
  validoAte: string;
  observacoes?: string;
  usuario: string; // Quem fez a cotação
};
