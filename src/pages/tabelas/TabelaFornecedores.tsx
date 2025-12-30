'use client';


import { useState, useEffect } from 'react';
import { Fornecedor, ProdutoFornecedor, Cotacao } from '@/types/fornecedor';
import { fornecedorService } from '@/services/fornecedorService';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Trash2, 
  Edit, 
  Eye, 
  Mail, 
  Phone,
  Building,
  Package,
  DollarSign,
  Truck,
  Star,
  Search,
  Plus,
  Filter,
  Download,
  Printer,
  ArrowLeft,
  User,
  CreditCard,
  MapPin,
  FileText
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TabelaFornecedores = () => {
  // Estados principais
  const [abaAtiva, setAbaAtiva] = useState<'lista' | 'detalhe' | 'cadastro'>('lista');
  const [abaDetalhe, setAbaDetalhe] = useState<'dados' | 'produtos' | 'cotacoes'>('dados');
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedor | null>(null);
  const [produtosFornecedor, setProdutosFornecedor] = useState<ProdutoFornecedor[]>([]);
  const [cotacoesFornecedor, setCotacoesFornecedor] = useState<Cotacao[]>([]);
  
  // Filtros
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'PRODUTO' | 'SERVICO' | 'AMBOS'>('todos');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativos' | 'inativos'>('ativos');
  const [filtroPreferencial, setFiltroPreferencial] = useState<'todos' | 'preferenciais' | 'nao-preferenciais'>('todos');

  // Formulário de cadastro
  const [codigo, setCodigo] = useState('');
  const [tipo, setTipo] = useState<'PRODUTO' | 'SERVICO' | 'AMBOS'>('PRODUTO');
  const [nome, setNome] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [inscricaoEstadual, setInscricaoEstadual] = useState('');
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [telefone2, setTelefone2] = useState('');
  const [fax, setFax] = useState('');
  const [contato, setContato] = useState('');
  const [cargoContato, setCargoContato] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('SP');
  const [cep, setCep] = useState('');
  const [banco, setBanco] = useState('');
  const [agencia, setAgencia] = useState('');
  const [conta, setConta] = useState('');
  const [tipoConta, setTipoConta] = useState<'CORRENTE' | 'POUPANCA'>('CORRENTE');
  const [favorecido, setFavorecido] = useState('');
  const [cpfFavorecido, setCpfFavorecido] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [principaisProdutos, setPrincipaisProdutos] = useState('');
  const [preferencial, setPreferencial] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [prazoEntrega, setPrazoEntrega] = useState('');
  const [condicaoPagamento, setCondicaoPagamento] = useState('');

  // Edição
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState('');
  const [editCodigo, setEditCodigo] = useState('');
  const [editTipo, setEditTipo] = useState<'PRODUTO' | 'SERVICO' | 'AMBOS'>('PRODUTO');
  const [editNome, setEditNome] = useState('');
  const [editNomeFantasia, setEditNomeFantasia] = useState('');
  const [editCnpj, setEditCnpj] = useState('');
  const [editInscricaoEstadual, setEditInscricaoEstadual] = useState('');
  const [editInscricaoMunicipal, setEditInscricaoMunicipal] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [editTelefone2, setEditTelefone2] = useState('');
  const [editFax, setEditFax] = useState('');
  const [editContato, setEditContato] = useState('');
  const [editCargoContato, setEditCargoContato] = useState('');
  const [editEndereco, setEditEndereco] = useState('');
  const [editNumero, setEditNumero] = useState('');
  const [editComplemento, setEditComplemento] = useState('');
  const [editBairro, setEditBairro] = useState('');
  const [editCidade, setEditCidade] = useState('');
  const [editEstado, setEditEstado] = useState('SP');
  const [editCep, setEditCep] = useState('');
  const [editBanco, setEditBanco] = useState('');
  const [editAgencia, setEditAgencia] = useState('');
  const [editConta, setEditConta] = useState('');
  const [editTipoConta, setEditTipoConta] = useState<'CORRENTE' | 'POUPANCA'>('CORRENTE');
  const [editFavorecido, setEditFavorecido] = useState('');
  const [editCpfFavorecido, setEditCpfFavorecido] = useState('');
  const [editEspecialidade, setEditEspecialidade] = useState('');
  const [editPrincipaisProdutos, setEditPrincipaisProdutos] = useState('');
  const [editPreferencial, setEditPreferencial] = useState(false);
  const [editObservacoes, setEditObservacoes] = useState('');
  const [editPrazoEntrega, setEditPrazoEntrega] = useState('');
  const [editCondicaoPagamento, setEditCondicaoPagamento] = useState('');
  const [editAtivo, setEditAtivo] = useState(true);

  // Produto do fornecedor
  const [produtoOpen, setProdutoOpen] = useState(false);
  const [produtoCodigoFornecedor, setProdutoCodigoFornecedor] = useState('');
  const [produtoDescricao, setProdutoDescricao] = useState('');
  const [produtoPrecoCusto, setProdutoPrecoCusto] = useState('');
  const [produtoPrecoMinimo, setProdutoPrecoMinimo] = useState('');
  const [produtoUnidade, setProdutoUnidade] = useState('UN');
  const [produtoPrincipal, setProdutoPrincipal] = useState(false);

  // Cotação
  const [cotacaoOpen, setCotacaoOpen] = useState(false);
  const [cotacaoProdutoId, setCotacaoProdutoId] = useState('');
  const [cotacaoPreco, setCotacaoPreco] = useState('');
  const [cotacaoPrazoEntrega, setCotacaoPrazoEntrega] = useState('');
  const [cotacaoValidoAte, setCotacaoValidoAte] = useState('');
  const [cotacaoObservacoes, setCotacaoObservacoes] = useState('');

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const carregarFornecedores = async () => {
    setLoading(true);
    try {
      const dados = await fornecedorService.buscarTodos();
      setFornecedores(dados);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarDetalhesFornecedor = async (fornecedor: Fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setAbaAtiva('detalhe');
    setAbaDetalhe('dados');
    
    try {
      const produtos = await fornecedorService.buscarProdutos(fornecedor.id);
      setProdutosFornecedor(produtos);
      
      const cotacoes = await fornecedorService.buscarCotacoes(fornecedor.id);
      setCotacoesFornecedor(cotacoes);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    }
  };

  const gerarCodigoAutomatico = async () => {
    if (!codigo) {
      const novoCodigo = await fornecedorService.gerarCodigo();
      setCodigo(novoCodigo);
    }
  };

  const salvarFornecedor = async () => {
    if (!nome.trim() || !cnpj.trim()) {
      alert('Nome e CNPJ são obrigatórios');
      return;
    }

    try {
      const codigoFinal = codigo || await fornecedorService.gerarCodigo();
      
      await fornecedorService.criar({
        codigo: codigoFinal,
        tipo,
        nome: nome.trim(),
        nomeFantasia: nomeFantasia.trim(),
        cnpj: cnpj.trim(),
        inscricaoEstadual: inscricaoEstadual.trim(),
        inscricaoMunicipal: inscricaoMunicipal.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        telefone2: telefone2.trim(),
        fax: fax.trim(),
        contato: contato.trim(),
        cargoContato: cargoContato.trim(),
        endereco: endereco.trim(),
        numero: numero.trim(),
        complemento: complemento.trim(),
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        estado,
        cep: cep.trim(),
        banco: banco.trim(),
        agencia: agencia.trim(),
        conta: conta.trim(),
        tipoConta,
        favorecido: favorecido.trim(),
        cpfFavorecido: cpfFavorecido.trim(),
        especialidade: especialidade.trim(),
        principaisProdutos: principaisProdutos.split(',').map(p => p.trim()).filter(p => p),
        preferencial,
        observacoes: observacoes.trim(),
        prazoEntrega: prazoEntrega ? parseInt(prazoEntrega) : undefined,
        condicaoPagamento: condicaoPagamento.trim(),
        ativo: true,
        dataCadastro: new Date().toISOString(),
        totalCompras: 0,
        quantidadeCompras: 0,
      });

      // Limpar formulário
      setCodigo('');
      setTipo('PRODUTO');
      setNome('');
      setNomeFantasia('');
      setCnpj('');
      setInscricaoEstadual('');
      setInscricaoMunicipal('');
      setEmail('');
      setTelefone('');
      setTelefone2('');
      setFax('');
      setContato('');
      setCargoContato('');
      setEndereco('');
      setNumero('');
      setComplemento('');
      setBairro('');
      setCidade('');
      setEstado('SP');
      setCep('');
      setBanco('');
      setAgencia('');
      setConta('');
      setTipoConta('CORRENTE');
      setFavorecido('');
      setCpfFavorecido('');
      setEspecialidade('');
      setPrincipaisProdutos('');
      setPreferencial(false);
      setObservacoes('');
      setPrazoEntrega('');
      setCondicaoPagamento('');

      alert('Fornecedor salvo com sucesso!');
      carregarFornecedores();
      setAbaAtiva('lista');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar fornecedor');
    }
  };

  const abrirEdicao = (f: Fornecedor) => {
    setEditId(f.id);
    setEditCodigo(f.codigo);
    setEditTipo(f.tipo);
    setEditNome(f.nome);
    setEditNomeFantasia(f.nomeFantasia || '');
    setEditCnpj(f.cnpj);
    setEditInscricaoEstadual(f.inscricaoEstadual || '');
    setEditInscricaoMunicipal(f.inscricaoMunicipal || '');
    setEditEmail(f.email);
    setEditTelefone(f.telefone);
    setEditTelefone2(f.telefone2 || '');
    setEditFax(f.fax || '');
    setEditContato(f.contato);
    setEditCargoContato(f.cargoContato || '');
    setEditEndereco(f.endereco);
    setEditNumero(f.numero);
    setEditComplemento(f.complemento || '');
    setEditBairro(f.bairro);
    setEditCidade(f.cidade);
    setEditEstado(f.estado);
    setEditCep(f.cep);
    setEditBanco(f.banco || '');
    setEditAgencia(f.agencia || '');
    setEditConta(f.conta || '');
    setEditTipoConta(f.tipoConta || 'CORRENTE');
    setEditFavorecido(f.favorecido || '');
    setEditCpfFavorecido(f.cpfFavorecido || '');
    setEditEspecialidade(f.especialidade || '');
    setEditPrincipaisProdutos(f.principaisProdutos?.join(', ') || '');
    setEditPreferencial(f.preferencial);
    setEditObservacoes(f.observacoes || '');
    setEditPrazoEntrega(f.prazoEntrega?.toString() || '');
    setEditCondicaoPagamento(f.condicaoPagamento || '');
    setEditAtivo(f.ativo);
    setEditOpen(true);
  };

  const salvarEdicao = async () => {
    if (!editNome.trim() || !editCnpj.trim()) {
      alert('Nome e CNPJ são obrigatórios');
      return;
    }

    try {
      await fornecedorService.atualizar(editId, {
        codigo: editCodigo,
        tipo: editTipo,
        nome: editNome.trim(),
        nomeFantasia: editNomeFantasia.trim(),
        cnpj: editCnpj.trim(),
        inscricaoEstadual: editInscricaoEstadual.trim(),
        inscricaoMunicipal: editInscricaoMunicipal.trim(),
        email: editEmail.trim(),
        telefone: editTelefone.trim(),
        telefone2: editTelefone2.trim(),
        fax: editFax.trim(),
        contato: editContato.trim(),
        cargoContato: editCargoContato.trim(),
        endereco: editEndereco.trim(),
        numero: editNumero.trim(),
        complemento: editComplemento.trim(),
        bairro: editBairro.trim(),
        cidade: editCidade.trim(),
        estado: editEstado,
        cep: editCep.trim(),
        banco: editBanco.trim(),
        agencia: editAgencia.trim(),
        conta: editConta.trim(),
        tipoConta: editTipoConta,
        favorecido: editFavorecido.trim(),
        cpfFavorecido: editCpfFavorecido.trim(),
        especialidade: editEspecialidade.trim(),
        principaisProdutos: editPrincipaisProdutos.split(',').map(p => p.trim()).filter(p => p),
        preferencial: editPreferencial,
        observacoes: editObservacoes.trim(),
        prazoEntrega: editPrazoEntrega ? parseInt(editPrazoEntrega) : undefined,
        condicaoPagamento: editCondicaoPagamento.trim(),
        ativo: editAtivo,
      });
      
      setEditOpen(false);
      alert('Fornecedor atualizado!');
      carregarFornecedores();
      
      if (fornecedorSelecionado?.id === editId) {
        const atualizado = await fornecedorService.buscarPorId(editId);
        if (atualizado) {
          setFornecedorSelecionado(atualizado);
        }
      }
    } catch (error) {
      console.error('Erro ao editar:', error);
      alert('Erro ao atualizar fornecedor');
    }
  };

  const excluirFornecedor = async (id: string) => {
    if (!confirm('Excluir permanentemente este fornecedor?')) return;
    
    try {
      await fornecedorService.excluir(id);
      alert('Fornecedor excluído com sucesso!');
      carregarFornecedores();
      
      if (fornecedorSelecionado?.id === id) {
        setAbaAtiva('lista');
        setFornecedorSelecionado(null);
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir fornecedor');
    }
  };

  const adicionarProduto = async () => {
    if (!fornecedorSelecionado || !produtoCodigoFornecedor || !produtoDescricao || !produtoPrecoCusto) {
      alert('Preencha todos os campos obrigatórios do produto');
      return;
    }

    try {
      await fornecedorService.adicionarProduto({
        fornecedorId: fornecedorSelecionado.id,
        produtoId: '', // Será vinculado depois
        codigoFornecedor: produtoCodigoFornecedor.trim(),
        descricao: produtoDescricao.trim(),
        precoCusto: parseFloat(produtoPrecoCusto),
        precoMinimo: produtoPrecoMinimo ? parseFloat(produtoPrecoMinimo) : undefined,
        unidade: produtoUnidade,
        ativo: true,
        principal: produtoPrincipal,
        dataCadastro: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
      });

      const produtos = await fornecedorService.buscarProdutos(fornecedorSelecionado.id);
      setProdutosFornecedor(produtos);
      
      setProdutoCodigoFornecedor('');
      setProdutoDescricao('');
      setProdutoPrecoCusto('');
      setProdutoPrecoMinimo('');
      setProdutoUnidade('UN');
      setProdutoPrincipal(false);
      setProdutoOpen(false);
      
      alert('Produto adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      alert('Erro ao adicionar produto');
    }
  };

  const adicionarCotacao = async () => {
    if (!fornecedorSelecionado || !cotacaoProdutoId || !cotacaoPreco || !cotacaoValidoAte) {
      alert('Preencha todos os campos obrigatórios da cotação');
      return;
    }

    try {
      await fornecedorService.adicionarCotacao({
        fornecedorId: fornecedorSelecionado.id,
        produtoId: cotacaoProdutoId,
        data: new Date().toISOString(),
        preco: parseFloat(cotacaoPreco),
        prazoEntrega: cotacaoPrazoEntrega ? parseInt(cotacaoPrazoEntrega) : 0,
        validoAte: cotacaoValidoAte,
        observacoes: cotacaoObservacoes.trim(),
        usuario: 'Usuário atual', // Substituir por usuário real
      });

      const cotacoes = await fornecedorService.buscarCotacoes(fornecedorSelecionado.id);
      setCotacoesFornecedor(cotacoes);
      
      setCotacaoProdutoId('');
      setCotacaoPreco('');
      setCotacaoPrazoEntrega('');
      setCotacaoValidoAte('');
      setCotacaoObservacoes('');
      setCotacaoOpen(false);
      
      alert('Cotação adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar cotação:', error);
      alert('Erro ao adicionar cotação');
    }
  };

  const formatarData = (data: string) => {
    try {
      return new Date(data).toLocaleDateString('pt-BR');
    } catch {
      return data;
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  const formatarTelefone = (telefone: string) => {
    return telefone.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  // Filtrar fornecedores
  const fornecedoresFiltrados = fornecedores.filter(f => {
    // Filtro de busca
    const buscaMatch = 
      f.nome.toLowerCase().includes(busca.toLowerCase()) ||
      f.cnpj.toLowerCase().includes(busca.toLowerCase()) ||
      f.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      f.especialidade?.toLowerCase().includes(busca.toLowerCase()) ||
      f.contato.toLowerCase().includes(busca.toLowerCase());

    // Filtro de tipo
    const tipoMatch = 
      filtroTipo === 'todos' || f.tipo === filtroTipo;

    // Filtro de status
    const statusMatch = 
      filtroStatus === 'todos' ||
      (filtroStatus === 'ativos' && f.ativo) ||
      (filtroStatus === 'inativos' && !f.ativo);

    // Filtro de preferencial
    const preferencialMatch = 
      filtroPreferencial === 'todos' ||
      (filtroPreferencial === 'preferenciais' && f.preferencial) ||
      (filtroPreferencial === 'nao-preferenciais' && !f.preferencial);

    return buscaMatch && tipoMatch && statusMatch && preferencialMatch;
  });

  // Estatísticas
  const totalFornecedores = fornecedores.length;
  const ativos = fornecedores.filter(f => f.ativo).length;
  const preferenciais = fornecedores.filter(f => f.preferencial).length;
  const fornecedoresProdutos = fornecedores.filter(f => f.tipo === 'PRODUTO' || f.tipo === 'AMBOS').length;
  const totalCompras = fornecedores.reduce((total, f) => total + f.totalCompras, 0);

  if (loading && abaAtiva === 'lista') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Carregando fornecedores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-white text-center mb-2">
        Tabela de Fornecedores - SofVet
      </h1>
      <p className="text-gray-400 text-center mb-10">
        Gerencie os fornecedores de produtos e serviços conforme manual SofVet
      </p>

      {/* ABA: LISTA DE FORNECEDORES */}
      {abaAtiva === 'lista' && (
        <>
          {/* Botões de ação e busca */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button
              onClick={() => setAbaAtiva('cadastro')}
              className="bg-red-600 hover:bg-red-700 py-6 text-lg flex-1 min-w-[200px]"
            >
              <Plus className="mr-2 h-5 w-5" />
              Novo Fornecedor
            </Button>
            
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar por nome, CNPJ, especialidade..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="bg-black/50 border-red-600/50 text-white py-6 text-lg pl-10"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-black/50 border-red-600/30">
              <CardContent className="pt-6">
                <Label className="text-white mb-2 block">Tipo de Fornecedor</Label>
                <Select value={filtroTipo} onValueChange={(value: any) => setFiltroTipo(value)}>
                  <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-600/50">
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="PRODUTO">Produtos</SelectItem>
                    <SelectItem value="SERVICO">Serviços</SelectItem>
                    <SelectItem value="AMBOS">Produtos e Serviços</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-red-600/30">
              <CardContent className="pt-6">
                <Label className="text-white mb-2 block">Status</Label>
                <Select value={filtroStatus} onValueChange={(value: any) => setFiltroStatus(value)}>
                  <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                    <SelectValue placeholder="Ativos" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-600/50">
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ativos">Ativos</SelectItem>
                    <SelectItem value="inativos">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-red-600/30">
              <CardContent className="pt-6">
                <Label className="text-white mb-2 block">Preferencial</Label>
                <Select value={filtroPreferencial} onValueChange={(value: any) => setFiltroPreferencial(value)}>
                  <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-600/50">
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="preferenciais">Preferenciais</SelectItem>
                    <SelectItem value="nao-preferenciais">Não Preferenciais</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-black/50 border-red-600/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{totalFornecedores}</p>
                  <p className="text-gray-400">Total</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border-red-600/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">{ativos}</p>
                  <p className="text-gray-400">Ativos</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border-red-600/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">{preferenciais}</p>
                  <p className="text-gray-400">Preferenciais</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border-red-600/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-400">{fornecedoresProdutos}</p>
                  <p className="text-gray-400">Fornecem Produtos</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Fornecedores */}
          <Card className="bg-black/50 border-red-600/30">
            <CardHeader>
              <CardTitle className="text-white flex justify-between items-center">
                <span>Fornecedores Cadastrados ({fornecedoresFiltrados.length})</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-red-600/50 text-white hover:bg-red-600/20">
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-600/50 text-white hover:bg-red-600/20">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Código</TableHead>
                      <TableHead className="text-white">Fornecedor</TableHead>
                      <TableHead className="text-white hidden md:table-cell">CNPJ</TableHead>
                      <TableHead className="text-white hidden lg:table-cell">Especialidade</TableHead>
                      <TableHead className="text-white">Contato</TableHead>
                      <TableHead className="text-white text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fornecedoresFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                          Nenhum fornecedor encontrado com os filtros atuais
                        </TableCell>
                      </TableRow>
                    ) : (
                      fornecedoresFiltrados.map(f => (
                        <TableRow 
                          key={f.id} 
                          className={`hover:bg-red-900/10 transition-colors ${!f.ativo ? 'opacity-60' : ''}`}
                        >
                          <TableCell className="text-white font-mono font-bold">
                            {f.codigo}
                          </TableCell>
                          <TableCell className="text-white font-medium">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              {f.nome}
                              {f.preferencial && (
                                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                  <Star className="h-3 w-3 mr-1" />
                                  Preferencial
                                </Badge>
                              )}
                              {!f.ativo && (
                                <Badge variant="outline" className="text-gray-400 border-gray-400">
                                  Inativo
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-blue-400 border-blue-400">
                                {f.tipo}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-white hidden md:table-cell">
                            {formatarCNPJ(f.cnpj)}
                          </TableCell>
                          <TableCell className="text-white hidden lg:table-cell">
                            {f.especialidade || 'Não informado'}
                          </TableCell>
                          <TableCell className="text-white">
                            <div className="flex flex-col">
                              <span>{f.contato}</span>
                              <span className="text-sm text-gray-400">{formatarTelefone(f.telefone)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => carregarDetalhesFornecedor(f)}
                                title="Visualizar"
                                className="hover:bg-blue-900/30"
                              >
                                <Eye className="h-4 w-4 text-blue-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => abrirEdicao(f)}
                                title="Editar"
                                className="hover:bg-green-900/30"
                              >
                                <Edit className="h-4 w-4 text-green-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => excluirFornecedor(f.id)}
                                title="Excluir"
                                className="hover:bg-red-900/30"
                              >
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ABA: CADASTRO DE NOVO FORNECEDOR */}
      {abaAtiva === 'cadastro' && (
        <Card className="bg-black/50 border-red-600/30">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white">Cadastrar Novo Fornecedor</CardTitle>
                <CardDescription className="text-gray-400">
                  Preencha os dados do fornecedor conforme manual SofVet
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setAbaAtiva('lista')}
                className="border-red-600/50 text-white hover:bg-red-600/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Lista
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-8">
                {/* Dados Básicos */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-red-600/30">
                    Dados Básicos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Código *</Label>
                      <div className="flex gap-2">
                        <Input
                          value={codigo}
                          onChange={e => setCodigo(e.target.value)}
                          placeholder="Gerar automaticamente"
                          className="bg-black/50 border-red-600/50 text-white"
                        />
                        <Button
                          type="button"
                          onClick={gerarCodigoAutomatico}
                          className="bg-red-600 hover:bg-red-700 whitespace-nowrap"
                        >
                          Gerar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Tipo *</Label>
                      <Select value={tipo} onValueChange={(value: any) => setTipo(value)}>
                        <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-red-600/50">
                          <SelectItem value="PRODUTO">Produtos</SelectItem>
                          <SelectItem value="SERVICO">Serviços</SelectItem>
                          <SelectItem value="AMBOS">Produtos e Serviços</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Nome/Razão Social *</Label>
                      <Input
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Nome Fantasia</Label>
                      <Input
                        value={nomeFantasia}
                        onChange={e => setNomeFantasia(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">CNPJ *</Label>
                      <Input
                        value={cnpj}
                        onChange={e => setCnpj(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Inscrição Estadual</Label>
                      <Input
                        value={inscricaoEstadual}
                        onChange={e => setInscricaoEstadual(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Contato */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-red-600/30">
                    Contato
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">E-mail *</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Telefone *</Label>
                      <Input
                        value={telefone}
                        onChange={e => setTelefone(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Telefone 2</Label>
                      <Input
                        value={telefone2}
                        onChange={e => setTelefone2(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Fax</Label>
                      <Input
                        value={fax}
                        onChange={e => setFax(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Pessoa para Contato *</Label>
                      <Input
                        value={contato}
                        onChange={e => setContato(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Cargo do Contato</Label>
                      <Input
                        value={cargoContato}
                        onChange={e => setCargoContato(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-red-600/30">
                    Endereço
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-white">Endereço *</Label>
                      <Input
                        value={endereco}
                        onChange={e => setEndereco(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Número *</Label>
                      <Input
                        value={numero}
                        onChange={e => setNumero(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Complemento</Label>
                      <Input
                        value={complemento}
                        onChange={e => setComplemento(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Bairro *</Label>
                      <Input
                        value={bairro}
                        onChange={e => setBairro(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Cidade *</Label>
                      <Input
                        value={cidade}
                        onChange={e => setCidade(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Estado *</Label>
                      <Select value={estado} onValueChange={setEstado}>
                        <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-red-600/50">
                          <SelectItem value="SP">São Paulo (SP)</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro (RJ)</SelectItem>
                          <SelectItem value="MG">Minas Gerais (MG)</SelectItem>
                          <SelectItem value="RS">Rio Grande do Sul (RS)</SelectItem>
                          <SelectItem value="PR">Paraná (PR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">CEP *</Label>
                      <Input
                        value={cep}
                        onChange={e => setCep(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                        placeholder="00000-000"
                      />
                    </div>
                  </div>
                </div>

                {/* Especialidade e Produtos */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-red-600/30">
                    Especialidade e Produtos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Especialidade</Label>
                      <Input
                        value={especialidade}
                        onChange={e => setEspecialidade(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                        placeholder="Ex: Medicamentos, Rações, Equipamentos"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Principais Produtos</Label>
                      <Textarea
                        value={principaisProdutos}
                        onChange={e => setPrincipaisProdutos(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                        placeholder="Separar por vírgula"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Condições Comerciais */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-red-600/30">
                    Condições Comerciais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Prazo de Entrega (dias)</Label>
                      <Input
                        type="number"
                        value={prazoEntrega}
                        onChange={e => setPrazoEntrega(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Condição de Pagamento</Label>
                      <Input
                        value={condicaoPagamento}
                        onChange={e => setCondicaoPagamento(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                        placeholder="Ex: 30/60/90 dias"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="preferencial" 
                        checked={preferencial}
                        onCheckedChange={(checked) => setPreferencial(checked as boolean)}
                        className="border-red-600 data-[state=checked]:bg-red-600"
                      />
                      <Label htmlFor="preferencial" className="text-white cursor-pointer">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-2" />
                          Fornecedor Preferencial
                        </div>
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-red-600/30">
                    Observações
                  </h3>
                  <Textarea
                    value={observacoes}
                    onChange={e => setObservacoes(e.target.value)}
                    className="bg-black/50 border-red-600/50 text-white"
                    placeholder="Informações adicionais sobre o fornecedor..."
                    rows={4}
                  />
                </div>

                {/* Botões de ação */}
                <div className="flex justify-end gap-4 pt-6 border-t border-red-600/30">
                  <Button
                    variant="outline"
                    onClick={() => setAbaAtiva('lista')}
                    className="border-red-600/50 text-white hover:bg-red-600/20"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={salvarFornecedor}
                    className="bg-red-600 hover:bg-red-700 py-6 text-lg px-8"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Salvar Fornecedor
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* ABA: DETALHES DO FORNECEDOR */}
      {abaAtiva === 'detalhe' && fornecedorSelecionado && (
        <Card className="bg-black/50 border-red-600/30">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAbaAtiva('lista')}
                    className="border-red-600/50 text-white hover:bg-red-600/20"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <CardTitle className="text-white">
                    {fornecedorSelecionado.nome} 
                    <span className="text-gray-400 font-mono ml-4">Cód: {fornecedorSelecionado.codigo}</span>
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  {fornecedorSelecionado.especialidade || 'Sem especialidade definida'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => abrirEdicao(fornecedorSelecionado)}
                  className="border-green-600/50 text-green-400 hover:bg-green-600/20"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => excluirFornecedor(fornecedorSelecionado.id)}
                  className="border-red-600/50 text-red-400 hover:bg-red-600/20"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Abas de detalhes */}
            <Tabs value={abaDetalhe} onValueChange={(value: any) => setAbaDetalhe(value)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-red-600/30">
                <TabsTrigger value="dados" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  <Building className="mr-2 h-4 w-4" />
                  Dados
                </TabsTrigger>
                <TabsTrigger value="produtos" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  <Package className="mr-2 h-4 w-4" />
                  Produtos ({produtosFornecedor.length})
                </TabsTrigger>
                <TabsTrigger value="cotacoes" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  <FileText className="mr-2 h-4 w-4" />
                  Cotações ({cotacoesFornecedor.length})
                </TabsTrigger>
              </TabsList>

              {/* Conteúdo: Dados */}
              <TabsContent value="dados" className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Informações Empresariais</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">CNPJ</p>
                        <p className="text-white">{formatarCNPJ(fornecedorSelecionado.cnpj)}</p>
                      </div>
                      {fornecedorSelecionado.nomeFantasia && (
                        <div>
                          <p className="text-sm text-gray-400">Nome Fantasia</p>
                          <p className="text-white">{fornecedorSelecionado.nomeFantasia}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-400">Tipo</p>
                        <Badge className="bg-blue-900/50 text-blue-300">
                          {fornecedorSelecionado.tipo}
                        </Badge>
                      </div>
                      {fornecedorSelecionado.inscricaoEstadual && (
                        <div>
                          <p className="text-sm text-gray-400">Inscrição Estadual</p>
                          <p className="text-white">{fornecedorSelecionado.inscricaoEstadual}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Contatos</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Contato Principal</p>
                        <p className="text-white">{fornecedorSelecionado.contato}</p>
                        {fornecedorSelecionado.cargoContato && (
                          <p className="text-sm text-gray-400">{fornecedorSelecionado.cargoContato}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Telefone</p>
                        <p className="text-white">{formatarTelefone(fornecedorSelecionado.telefone)}</p>
                      </div>
                      {fornecedorSelecionado.telefone2 && (
                        <div>
                          <p className="text-sm text-gray-400">Telefone 2</p>
                          <p className="text-white">{formatarTelefone(fornecedorSelecionado.telefone2)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-400">E-mail</p>
                        <p className="text-white">{fornecedorSelecionado.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Endereço</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Endereço</p>
                        <p className="text-white">
                          {fornecedorSelecionado.endereco}, {fornecedorSelecionado.numero}
                          {fornecedorSelecionado.complemento && ` - ${fornecedorSelecionado.complemento}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Bairro</p>
                        <p className="text-white">{fornecedorSelecionado.bairro}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Cidade/UF</p>
                        <p className="text-white">{fornecedorSelecionado.cidade}/{fornecedorSelecionado.estado}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">CEP</p>
                        <p className="text-white">{fornecedorSelecionado.cep}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status e Métricas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-red-600/30">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${fornecedorSelecionado.ativo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-white">{fornecedorSelecionado.ativo ? 'Ativo' : 'Inativo'}</span>
                      </div>
                      {fornecedorSelecionado.preferencial && (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-yellow-300">Fornecedor Preferencial</span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-400">Data Cadastro</p>
                        <p className="text-white">{formatarData(fornecedorSelecionado.dataCadastro)}</p>
                      </div>
                      {fornecedorSelecionado.dataUltimaCompra && (
                        <div>
                          <p className="text-sm text-gray-400">Última Compra</p>
                          <p className="text-white">{formatarData(fornecedorSelecionado.dataUltimaCompra)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Métricas</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Total de Compras</p>
                        <p className="text-2xl font-bold text-green-400">
                          {formatarMoeda(fornecedorSelecionado.totalCompras)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Quantidade de Compras</p>
                        <p className="text-2xl font-bold text-white">
                          {fornecedorSelecionado.quantidadeCompras}
                        </p>
                      </div>
                      {fornecedorSelecionado.prazoEntrega && (
                        <div>
                          <p className="text-sm text-gray-400">Prazo de Entrega</p>
                          <p className="text-white">{fornecedorSelecionado.prazoEntrega} dias</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Condições</h4>
                    <div className="space-y-3">
                      {fornecedorSelecionado.condicaoPagamento && (
                        <div>
                          <p className="text-sm text-gray-400">Pagamento</p>
                          <p className="text-white">{fornecedorSelecionado.condicaoPagamento}</p>
                        </div>
                      )}
                      {fornecedorSelecionado.especialidade && (
                        <div>
                          <p className="text-sm text-gray-400">Especialidade</p>
                          <p className="text-white">{fornecedorSelecionado.especialidade}</p>
                        </div>
                      )}
                      {fornecedorSelecionado.observacoes && (
                        <div>
                          <p className="text-sm text-gray-400">Observações</p>
                          <p className="text-white text-sm">{fornecedorSelecionado.observacoes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Conteúdo: Produtos */}
              <TabsContent value="produtos" className="space-y-6 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-white">Produtos do Fornecedor</h4>
                    <p className="text-gray-400">Produtos cadastrados para {fornecedorSelecionado.nome}</p>
                  </div>
                  <Button
                    onClick={() => setProdutoOpen(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Produto
                  </Button>
                </div>
                
                {produtosFornecedor.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-red-600/30 rounded-lg">
                    <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Nenhum produto cadastrado para este fornecedor</p>
                    <Button 
                      onClick={() => setProdutoOpen(true)}
                      className="mt-4 bg-red-600 hover:bg-red-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Primeiro Produto
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-white">Código</TableHead>
                          <TableHead className="text-white">Descrição</TableHead>
                          <TableHead className="text-white">Unidade</TableHead>
                          <TableHead className="text-white">Preço Custo</TableHead>
                          <TableHead className="text-white">Preço Mínimo</TableHead>
                          <TableHead className="text-white">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {produtosFornecedor.map(produto => (
                          <TableRow key={produto.id}>
                            <TableCell className="text-white font-mono">
                              {produto.codigoFornecedor}
                            </TableCell>
                            <TableCell className="text-white">
                              {produto.descricao}
                              {produto.principal && (
                                <Badge className="ml-2 bg-yellow-900/50 text-yellow-300">
                                  Principal
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-white">{produto.unidade}</TableCell>
                            <TableCell className="text-white font-bold">
                              {formatarMoeda(produto.precoCusto)}
                            </TableCell>
                            <TableCell className="text-white">
                              {produto.precoMinimo ? formatarMoeda(produto.precoMinimo) : '-'}
                            </TableCell>
                            <TableCell className="text-white">
                              <Badge className={produto.ativo ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}>
                                {produto.ativo ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* Conteúdo: Cotações */}
              <TabsContent value="cotacoes" className="space-y-6 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-white">Cotações do Fornecedor</h4>
                    <p className="text-gray-400">Histórico de cotações com {fornecedorSelecionado.nome}</p>
                  </div>
                  <Button
                    onClick={() => setCotacaoOpen(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Cotação
                  </Button>
                </div>
                
                {cotacoesFornecedor.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-red-600/30 rounded-lg">
                    <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Nenhuma cotação registrada para este fornecedor</p>
                    <Button 
                      onClick={() => setCotacaoOpen(true)}
                      className="mt-4 bg-red-600 hover:bg-red-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Registrar Primeira Cotação
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-white">Data</TableHead>
                          <TableHead className="text-white">Produto</TableHead>
                          <TableHead className="text-white">Preço</TableHead>
                          <TableHead className="text-white">Prazo (dias)</TableHead>
                          <TableHead className="text-white">Válido até</TableHead>
                          <TableHead className="text-white">Usuário</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cotacoesFornecedor.map(cotacao => (
                          <TableRow key={cotacao.id}>
                            <TableCell className="text-white">
                              {formatarData(cotacao.data)}
                            </TableCell>
                            <TableCell className="text-white">
                              {cotacao.produtoId || 'Produto não especificado'}
                            </TableCell>
                            <TableCell className="text-white font-bold text-green-400">
                              {formatarMoeda(cotacao.preco)}
                            </TableCell>
                            <TableCell className="text-white">
                              {cotacao.prazoEntrega}
                            </TableCell>
                            <TableCell className="text-white">
                              {formatarData(cotacao.validoAte)}
                            </TableCell>
                            <TableCell className="text-white">
                              {cotacao.usuario}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* MODAL DE EDIÇÃO */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-black/95 border-red-600/30 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Fornecedor - {editNome}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Conteúdo do modal de edição - similar ao formulário de cadastro */}
              <div className="space-y-2">
                <Label className="text-white">Código</Label>
                <Input 
                  value={editCodigo} 
                  onChange={e => setEditCodigo(e.target.value)} 
                  className="bg-black/50 border-red-600/50 text-white" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Nome *</Label>
                <Input 
                  value={editNome} 
                  onChange={e => setEditNome(e.target.value)} 
                  className="bg-black/50 border-red-600/50 text-white" 
                />
              </div>
              {/* ... outros campos de edição */}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="border-red-600/50 text-white">
              Cancelar
            </Button>
            <Button onClick={salvarEdicao} className="bg-red-600 hover:bg-red-700">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL DE PRODUTO */}
      <Dialog open={produtoOpen} onOpenChange={setProdutoOpen}>
        <DialogContent className="bg-black/95 border-red-600/30 text-white">
          <DialogHeader>
            <DialogTitle>Adicionar Produto ao Fornecedor</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Código do Fornecedor *</Label>
              <Input
                value={produtoCodigoFornecedor}
                onChange={e => setProdutoCodigoFornecedor(e.target.value)}
                className="bg-black/50 border-red-600/50 text-white"
                placeholder="Código do produto no fornecedor"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Descrição *</Label>
              <Textarea
                value={produtoDescricao}
                onChange={e => setProdutoDescricao(e.target.value)}
                className="bg-black/50 border-red-600/50 text-white"
                placeholder="Descrição detalhada do produto"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Preço Custo *</Label>
                <Input
                  type="number"
                  value={produtoPrecoCusto}
                  onChange={e => setProdutoPrecoCusto(e.target.value)}
                  className="bg-black/50 border-red-600/50 text-white"
                  placeholder="0,00"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Preço Mínimo</Label>
                <Input
                  type="number"
                  value={produtoPrecoMinimo}
                  onChange={e => setProdutoPrecoMinimo(e.target.value)}
                  className="bg-black/50 border-red-600/50 text-white"
                  placeholder="Opcional"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Unidade</Label>
                <Select value={produtoUnidade} onValueChange={setProdutoUnidade}>
                  <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-600/50">
                    <SelectItem value="UN">Unidade (UN)</SelectItem>
                    <SelectItem value="CX">Caixa (CX)</SelectItem>
                    <SelectItem value="KG">Quilo (KG)</SelectItem>
                    <SelectItem value="L">Litro (L)</SelectItem>
                    <SelectItem value="M">Metro (M)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox 
                  id="produto-principal" 
                  checked={produtoPrincipal}
                  onCheckedChange={(checked) => setProdutoPrincipal(checked as boolean)}
                  className="border-red-600 data-[state=checked]:bg-red-600"
                />
                <Label htmlFor="produto-principal" className="text-white cursor-pointer">
                  Produto Principal
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setProdutoOpen(false)} className="border-red-600/50 text-white">
              Cancelar
            </Button>
            <Button onClick={adicionarProduto} className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Produto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL DE COTAÇÃO */}
      <Dialog open={cotacaoOpen} onOpenChange={setCotacaoOpen}>
        <DialogContent className="bg-black/95 border-red-600/30 text-white">
          <DialogHeader>
            <DialogTitle>Nova Cotação</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Produto *</Label>
              <Select value={cotacaoProdutoId} onValueChange={setCotacaoProdutoId}>
                <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent className="bg-black border-red-600/50">
                  {produtosFornecedor.map(produto => (
                    <SelectItem key={produto.id} value={produto.id}>
                      {produto.codigoFornecedor} - {produto.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Preço *</Label>
                <Input
                  type="number"
                  value={cotacaoPreco}
                  onChange={e => setCotacaoPreco(e.target.value)}
                  className="bg-black/50 border-red-600/50 text-white"
                  placeholder="0,00"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Prazo de Entrega (dias)</Label>
                <Input
                  type="number"
                  value={cotacaoPrazoEntrega}
                  onChange={e => setCotacaoPrazoEntrega(e.target.value)}
                  className="bg-black/50 border-red-600/50 text-white"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Válido até *</Label>
              <Input
                type="date"
                value={cotacaoValidoAte}
                onChange={e => setCotacaoValidoAte(e.target.value)}
                className="bg-black/50 border-red-600/50 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Observações</Label>
              <Textarea
                value={cotacaoObservacoes}
                onChange={e => setCotacaoObservacoes(e.target.value)}
                className="bg-black/50 border-red-600/50 text-white"
                placeholder="Observações sobre a cotação..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCotacaoOpen(false)} className="border-red-600/50 text-white">
              Cancelar
            </Button>
            <Button onClick={adicionarCotacao} className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              Salvar Cotação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TabelaFornecedores;