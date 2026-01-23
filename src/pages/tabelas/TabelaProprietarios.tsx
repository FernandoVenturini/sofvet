'use client';

import { useState, useEffect } from 'react';
import { Proprietario, FichaAnimal, LancamentoConta } from '@/types/proprietario';
import { proprietarioService } from '@/services/proprietarioService';
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
    DialogDescription,
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
    FileText,
    Mail,
    AlertTriangle,
    Ban,
    Plus,
    Search,
    ArrowLeft,
    User,
    PawPrint,
    DollarSign,
    Filter,
    Download,
    Printer,
    Sparkles,
    BarChart3,
    CheckCircle,
    Users,
    RefreshCw,
    Zap,
    Activity,
    Home,
    Phone,
    CreditCard,
    Calendar,
    Shield,
    Tag,
    Clock,
    TrendingUp,
    Database,
    FileBarChart,
    Bell,
    CheckSquare,
    XCircle,
    MapPin,
    Mailbox,
    PhoneCall,
    Briefcase,
    Package,
    Heart,
    Thermometer,
    Brain,
    ActivityIcon,
    Award
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TabelaProprietarios = () => {
    // Estados principais
    const [abaAtiva, setAbaAtiva] = useState<'lista' | 'detalhe' | 'cadastro'>('lista');
    const [abaDetalhe, setAbaDetalhe] = useState<'dados' | 'fichas' | 'conta'>('dados');
    const [proprietarios, setProprietarios] = useState<Proprietario[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');
    const [proprietarioSelecionado, setProprietarioSelecionado] = useState<Proprietario | null>(null);
    const [fichasAnimais, setFichasAnimais] = useState<FichaAnimal[]>([]);
    const [lancamentosConta, setLancamentosConta] = useState<LancamentoConta[]>([]);
    const [filtroRestricao, setFiltroRestricao] = useState<'todos' | 'com-restricao' | 'sem-restricao'>('todos');
    const [filtroSaldo, setFiltroSaldo] = useState<'todos' | 'devedores' | 'credores'>('todos');

    // Formulário de cadastro
    const [codigo, setCodigo] = useState('');
    const [nome, setNome] = useState('');
    const [endereco, setEndereco] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('SP');
    const [cep, setCep] = useState('');
    const [rg, setRg] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [ddd, setDdd] = useState('11');
    const [telefone1, setTelefone1] = useState('');
    const [telefone2, setTelefone2] = useState('');
    const [telefone3, setTelefone3] = useState('');
    const [complemento, setComplemento] = useState('');
    const [email, setEmail] = useState('');
    const [marcado, setMarcado] = useState(false);
    const [motivoMarcacao, setMotivoMarcacao] = useState('');
    const [restricao, setRestricao] = useState(false);
    const [motivoRestricao, setMotivoRestricao] = useState('');

    // Edição
    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState('');
    const [editCodigo, setEditCodigo] = useState('');
    const [editNome, setEditNome] = useState('');
    const [editEndereco, setEditEndereco] = useState('');
    const [editBairro, setEditBairro] = useState('');
    const [editCidade, setEditCidade] = useState('');
    const [editEstado, setEditEstado] = useState('SP');
    const [editCep, setEditCep] = useState('');
    const [editRg, setEditRg] = useState('');
    const [editCpf, setEditCpf] = useState('');
    const [editDataNascimento, setEditDataNascimento] = useState('');
    const [editDdd, setEditDdd] = useState('11');
    const [editTelefone1, setEditTelefone1] = useState('');
    const [editTelefone2, setEditTelefone2] = useState('');
    const [editTelefone3, setEditTelefone3] = useState('');
    const [editComplemento, setEditComplemento] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editMarcado, setEditMarcado] = useState(false);
    const [editMotivoMarcacao, setEditMotivoMarcacao] = useState('');
    const [editRestricao, setEditRestricao] = useState(false);
    const [editMotivoRestricao, setEditMotivoRestricao] = useState('');
    const [editAtivo, setEditAtivo] = useState(true);

    // Lançamento na conta corrente
    const [novoLancamentoOpen, setNovoLancamentoOpen] = useState(false);
    const [lancamentoTipo, setLancamentoTipo] = useState<'CREDITO' | 'DEBITO'>('CREDITO');
    const [lancamentoValor, setLancamentoValor] = useState('');
    const [lancamentoDescricao, setLancamentoDescricao] = useState('');

    // Opções para selects
    const restricaoOptions = [
        { value: 'todos', label: 'Todos', color: 'from-gray-600/20 to-gray-700/20', textColor: 'text-gray-400' },
        { value: 'com-restricao', label: 'Com Restrição', color: 'from-red-600/20 to-pink-600/20', textColor: 'text-red-400' },
        { value: 'sem-restricao', label: 'Sem Restrição', color: 'from-emerald-600/20 to-green-600/20', textColor: 'text-emerald-400' },
    ];

    const saldoOptions = [
        { value: 'todos', label: 'Todos', color: 'from-gray-600/20 to-gray-700/20', textColor: 'text-gray-400' },
        { value: 'devedores', label: 'Devedores', color: 'from-red-600/20 to-pink-600/20', textColor: 'text-red-400' },
        { value: 'credores', label: 'Credores', color: 'from-emerald-600/20 to-green-600/20', textColor: 'text-emerald-400' },
    ];

    const tipoLancamentoOptions = [
        { value: 'CREDITO', label: 'Crédito', color: 'from-emerald-600/20 to-green-600/20', textColor: 'text-emerald-400' },
        { value: 'DEBITO', label: 'Débito', color: 'from-red-600/20 to-pink-600/20', textColor: 'text-red-400' },
    ];

    useEffect(() => {
        carregarProprietarios();
    }, []);

    const carregarProprietarios = async () => {
        setLoading(true);
        try {
            const dados = await proprietarioService.buscarTodos();
            setProprietarios(dados);
        } catch (error) {
            console.error('Erro ao carregar proprietários:', error);
        } finally {
            setLoading(false);
        }
    };

    const carregarDetalhesProprietario = async (proprietario: Proprietario) => {
        setProprietarioSelecionado(proprietario);
        setAbaAtiva('detalhe');
        setAbaDetalhe('dados');

        try {
            const fichas = await proprietarioService.buscarFichas(proprietario.id);
            setFichasAnimais(fichas);

            const lancamentos = await proprietarioService.buscarLancamentosConta(proprietario.id);
            setLancamentosConta(lancamentos);
        } catch (error) {
            console.error('Erro ao carregar detalhes:', error);
        }
    };

    const gerarCodigoAutomatico = async () => {
        if (!codigo) {
            const novoCodigo = await proprietarioService.gerarCodigo();
            setCodigo(novoCodigo);
        }
    };

    const salvarProprietario = async () => {
        if (!nome.trim()) {
            alert('Nome é obrigatório');
            return;
        }

        try {
            const codigoFinal = codigo || await proprietarioService.gerarCodigo();

            await proprietarioService.criar({
                codigo: codigoFinal,
                nome: nome.trim(),
                endereco: endereco.trim(),
                bairro: bairro.trim(),
                cidade: cidade.trim(),
                estado: estado,
                cep: cep.trim(),
                rg: rg.trim(),
                cpf: cpf.trim(),
                dataNascimento: dataNascimento,
                ddd: ddd,
                telefone1: telefone1.trim(),
                telefone2: telefone2.trim(),
                telefone3: telefone3.trim(),
                complemento: complemento.trim(),
                email: email.trim(),
                marcado: marcado,
                motivoMarcacao: motivoMarcacao.trim(),
                restricao: restricao,
                motivoRestricao: motivoRestricao.trim(),
                saldo: 0,
                dataCadastro: new Date().toISOString(),
                ativo: true,
            });

            // Limpar formulário
            setCodigo('');
            setNome('');
            setEndereco('');
            setBairro('');
            setCidade('');
            setEstado('SP');
            setCep('');
            setRg('');
            setCpf('');
            setDataNascimento('');
            setDdd('11');
            setTelefone1('');
            setTelefone2('');
            setTelefone3('');
            setComplemento('');
            setEmail('');
            setMarcado(false);
            setMotivoMarcacao('');
            setRestricao(false);
            setMotivoRestricao('');

            alert('Proprietário salvo com sucesso!');
            carregarProprietarios();
            setAbaAtiva('lista');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar proprietário');
        }
    };

    const abrirEdicao = (p: Proprietario) => {
        setEditId(p.id);
        setEditCodigo(p.codigo);
        setEditNome(p.nome);
        setEditEndereco(p.endereco);
        setEditBairro(p.bairro);
        setEditCidade(p.cidade);
        setEditEstado(p.estado);
        setEditCep(p.cep);
        setEditRg(p.rg);
        setEditCpf(p.cpf);
        setEditDataNascimento(p.dataNascimento);
        setEditDdd(p.ddd);
        setEditTelefone1(p.telefone1);
        setEditTelefone2(p.telefone2);
        setEditTelefone3(p.telefone3);
        setEditComplemento(p.complemento);
        setEditEmail(p.email);
        setEditMarcado(p.marcado);
        setEditMotivoMarcacao(p.motivoMarcacao || '');
        setEditRestricao(p.restricao);
        setEditMotivoRestricao(p.motivoRestricao || '');
        setEditAtivo(p.ativo);
        setEditOpen(true);
    };

    const salvarEdicao = async () => {
        if (!editNome.trim()) {
            alert('Nome é obrigatório');
            return;
        }

        try {
            await proprietarioService.atualizar(editId, {
                codigo: editCodigo,
                nome: editNome.trim(),
                endereco: editEndereco.trim(),
                bairro: editBairro.trim(),
                cidade: editCidade.trim(),
                estado: editEstado,
                cep: editCep.trim(),
                rg: editRg.trim(),
                cpf: editCpf.trim(),
                dataNascimento: editDataNascimento,
                ddd: editDdd,
                telefone1: editTelefone1.trim(),
                telefone2: editTelefone2.trim(),
                telefone3: editTelefone3.trim(),
                complemento: editComplemento.trim(),
                email: editEmail.trim(),
                marcado: editMarcado,
                motivoMarcacao: editMotivoMarcacao.trim(),
                restricao: editRestricao,
                motivoRestricao: editMotivoRestricao.trim(),
                ativo: editAtivo,
            });

            setEditOpen(false);
            alert('Proprietário atualizado!');
            carregarProprietarios();

            if (proprietarioSelecionado?.id === editId) {
                const atualizado = await proprietarioService.buscarPorId(editId);
                if (atualizado) {
                    setProprietarioSelecionado(atualizado);
                }
            }
        } catch (error) {
            console.error('Erro ao editar:', error);
            alert('Erro ao atualizar proprietário');
        }
    };

    const excluirProprietario = async (id: string) => {
        if (!confirm('Excluir permanentemente este proprietário? Todos os dados serão perdidos.')) return;

        try {
            await proprietarioService.excluir(id);
            alert('Proprietário excluído com sucesso!');
            carregarProprietarios();

            if (proprietarioSelecionado?.id === id) {
                setAbaAtiva('lista');
                setProprietarioSelecionado(null);
            }
        } catch (error) {
            console.error('Erro ao excluir:', error);
            alert('Erro ao excluir proprietário');
        }
    };

    const adicionarLancamentoConta = async () => {
        if (!proprietarioSelecionado || !lancamentoValor || !lancamentoDescricao) {
            alert('Preencha todos os campos do lançamento');
            return;
        }

        try {
            await proprietarioService.adicionarLancamentoConta({
                proprietarioId: proprietarioSelecionado.id,
                tipo: lancamentoTipo,
                valor: parseFloat(lancamentoValor),
                descricao: lancamentoDescricao.trim(),
                operacao: 'LANÇAMENTO MANUAL',
                data: new Date().toISOString(),
            });

            const novoSaldo = proprietarioSelecionado.saldo +
                (lancamentoTipo === 'CREDITO' ? parseFloat(lancamentoValor) : -parseFloat(lancamentoValor));

            await proprietarioService.atualizar(proprietarioSelecionado.id, {
                saldo: novoSaldo
            });

            const lancamentos = await proprietarioService.buscarLancamentosConta(proprietarioSelecionado.id);
            setLancamentosConta(lancamentos);

            const proprietarioAtualizado = await proprietarioService.buscarPorId(proprietarioSelecionado.id);
            if (proprietarioAtualizado) {
                setProprietarioSelecionado(proprietarioAtualizado);
            }

            setLancamentoValor('');
            setLancamentoDescricao('');
            setNovoLancamentoOpen(false);

            alert('Lançamento adicionado com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar lançamento:', error);
            alert('Erro ao adicionar lançamento');
        }
    };

    const enviarCartaDevedor = async () => {
        if (!proprietarioSelecionado) return;

        if (proprietarioSelecionado.saldo >= 0) {
            alert('Este cliente não possui débitos!');
            return;
        }

        if (confirm(`Enviar carta de cobrança para ${proprietarioSelecionado.nome}?`)) {
            alert(`Carta de cobrança enviada para ${proprietarioSelecionado.nome}!\nEndereço: ${proprietarioSelecionado.endereco}, ${proprietarioSelecionado.cidade}`);
        }
    };

    const calcularSaldoTotal = () => {
        return lancamentosConta.reduce((total, lancamento) => {
            return total + (lancamento.tipo === 'DEBITO' ? -lancamento.valor : lancamento.valor);
        }, 0);
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

    const formatarTelefone = (ddd: string, telefone: string) => {
        return `(${ddd}) ${telefone}`;
    };

    // Filtrar proprietários
    const proprietariosFiltrados = proprietarios.filter(p => {
        const buscaMatch =
            p.nome.toLowerCase().includes(busca.toLowerCase()) ||
            p.cpf.toLowerCase().includes(busca.toLowerCase()) ||
            p.codigo.toLowerCase().includes(busca.toLowerCase()) ||
            p.telefone1.toLowerCase().includes(busca.toLowerCase());

        const restricaoMatch =
            filtroRestricao === 'todos' ||
            (filtroRestricao === 'com-restricao' && p.restricao) ||
            (filtroRestricao === 'sem-restricao' && !p.restricao);

        const saldoMatch =
            filtroSaldo === 'todos' ||
            (filtroSaldo === 'devedores' && p.saldo < 0) ||
            (filtroSaldo === 'credores' && p.saldo >= 0);

        return buscaMatch && restricaoMatch && saldoMatch;
    });

    // Estatísticas
    const totalProprietarios = proprietarios.length;
    const comRestricao = proprietarios.filter(p => p.restricao).length;
    const marcados = proprietarios.filter(p => p.marcado).length;
    const devedores = proprietarios.filter(p => p.saldo < 0).length;
    const credores = proprietarios.filter(p => p.saldo > 0).length;
    const totalDivida = proprietarios
        .filter(p => p.saldo < 0)
        .reduce((total, p) => total + Math.abs(p.saldo), 0);
    const totalCredito = proprietarios
        .filter(p => p.saldo > 0)
        .reduce((total, p) => total + p.saldo, 0);
    const ativos = proprietarios.filter(p => p.ativo).length;

    const resetarFiltros = () => {
        setBusca('');
        setFiltroRestricao('todos');
        setFiltroSaldo('todos');
    };

    if (loading && abaAtiva === 'lista') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <p className="text-gray-400">Carregando proprietários...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30">
                            <Users className="h-6 w-6 text-red-400" />
                        </div>
                        <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 border border-red-500/30">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Cadastro SofVet
                        </Badge>
                    </div>
                    <h1 className="text-4xl font-bold text-green-400">
                        Controle de Proprietários
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Gerencie proprietários de animais e suas informações completas
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                        onClick={() => {}}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                    </Button>
                    <Button
                        className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                        onClick={() => setAbaAtiva('cadastro')}
                    >
                        <Plus className="h-4 w-4" />
                        Novo Proprietário
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total de Proprietários</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-white">{totalProprietarios}</p>
                                <p className="text-sm text-gray-400">Cadastrados no sistema</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                                <Users className="h-5 w-5 text-red-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Proprietários Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-emerald-400">{ativos}</p>
                                <p className="text-sm text-gray-400">Disponíveis para atendimento</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20">
                                <CheckCircle className="h-5 w-5 text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Com Restrição</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-red-400">{comRestricao}</p>
                                <p className="text-sm text-gray-400">Com restrição de atendimento</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                                <Shield className="h-5 w-5 text-red-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Dívida Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-amber-400">{formatarMoeda(totalDivida)}</p>
                                <p className="text-sm text-gray-400">Em débitos pendentes</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-600/20 to-orange-600/20">
                                <AlertTriangle className="h-5 w-5 text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ABA: LISTA DE PROPRIETÁRIOS */}
            {abaAtiva === 'lista' && (
                <>
                    {/* Filtros e Busca */}
                    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                        <CardContent className="p-4">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            placeholder="Buscar por nome, CPF, código ou telefone..."
                                            value={busca}
                                            onChange={e => setBusca(e.target.value)}
                                            className="pl-10 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Select value={filtroRestricao} onValueChange={(value: any) => setFiltroRestricao(value)}>
                                        <SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-700/50 text-white">
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4" />
                                                <SelectValue placeholder="Restrição" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-800">
                                            {restricaoOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${option.color}`} />
                                                        {option.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select value={filtroSaldo} onValueChange={(value: any) => setFiltroSaldo(value)}>
                                        <SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-700/50 text-white">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4" />
                                                <SelectValue placeholder="Saldo" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-800">
                                            {saldoOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${option.color}`} />
                                                        {option.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={carregarProprietarios}
                                        className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={resetarFiltros}
                                        className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                                    >
                                        <Filter className="h-4 w-4 mr-2" />
                                        Limpar
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabela de Proprietários */}
                    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-red-400" />
                                    <span>Proprietários Cadastrados</span>
                                </div>
                                <div className="text-sm text-gray-400">
                                    Mostrando {proprietariosFiltrados.length} de {proprietarios.length} proprietários
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {proprietarios.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg">Nenhum proprietário cadastrado</p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Comece cadastrando seu primeiro proprietário
                                    </p>
                                    <Button
                                        className="mt-4 gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                        onClick={() => setAbaAtiva('cadastro')}
                                    >
                                        <Plus className="h-4 w-4" />
                                        Cadastrar Primeiro Proprietário
                                    </Button>
                                </div>
                            ) : proprietariosFiltrados.length === 0 ? (
                                <div className="text-center py-12">
                                    <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg">Nenhum proprietário encontrado</p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Tente ajustar os termos da busca ou os filtros
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-lg border border-gray-800/50">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-gray-800/50">
                                                <TableHead className="text-gray-400">Código</TableHead>
                                                <TableHead className="text-gray-400">Nome</TableHead>
                                                <TableHead className="text-gray-400 hidden md:table-cell">Cidade/UF</TableHead>
                                                <TableHead className="text-gray-400 hidden lg:table-cell">Telefone</TableHead>
                                                <TableHead className="text-gray-400">Saldo</TableHead>
                                                <TableHead className="text-gray-400 text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {proprietariosFiltrados.map(p => (
                                                <TableRow
                                                    key={p.id}
                                                    className={`border-gray-800/30 hover:bg-gray-800/20 ${p.restricao ? 'bg-red-900/10' : ''}`}
                                                >
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
                                                                <Tag className="h-4 w-4 text-blue-400" />
                                                            </div>
                                                            <span className="font-mono font-bold text-white">
                                                                {p.codigo}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="font-medium text-white">{p.nome}</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {p.marcado && (
                                                                    <Badge className="bg-gradient-to-r border from-amber-600/20 to-orange-600/20 text-amber-400 border-gray-700">
                                                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                                                        Marcado
                                                                    </Badge>
                                                                )}
                                                                {p.restricao && (
                                                                    <Badge className="bg-gradient-to-r border from-red-600/20 to-pink-600/20 text-red-400 border-gray-700">
                                                                        <Ban className="h-3 w-3 mr-1" />
                                                                        Restrito
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-white hidden md:table-cell">
                                                        {p.cidade}/{p.estado}
                                                    </TableCell>
                                                    <TableCell className="text-white hidden lg:table-cell">
                                                        {formatarTelefone(p.ddd, p.telefone1)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={`bg-gradient-to-r border ${
                                                            p.saldo < 0 
                                                                ? 'from-red-600/20 to-pink-600/20 text-red-400' 
                                                                : 'from-emerald-600/20 to-green-600/20 text-emerald-400'
                                                        } border-gray-700`}>
                                                            <DollarSign className="h-3 w-3 mr-1" />
                                                            {formatarMoeda(p.saldo)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => carregarDetalhesProprietario(p)}
                                                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => abrirEdicao(p)}
                                                                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => excluirProprietario(p.id)}
                                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}

            {/* ABA: CADASTRO DE NOVO PROPRIETÁRIO */}
            {abaAtiva === 'cadastro' && (
                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Plus className="h-5 w-5 text-red-400" />
                                    Novo Proprietário
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Preencha todos os campos conforme manual do SofVet
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setAbaAtiva('lista')}
                                className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar para Lista
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[70vh] pr-4">
                            <Tabs defaultValue="dados" className="space-y-6">
                                <TabsList className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50 p-1">
                                    <TabsTrigger value="dados" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                                        Dados Básicos
                                    </TabsTrigger>
                                    <TabsTrigger value="contato" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                                        Contato e Endereço
                                    </TabsTrigger>
                                    <TabsTrigger value="observacoes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                                        Observações
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="dados" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-white">Código *</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={codigo}
                                                    onChange={e => setCodigo(e.target.value)}
                                                    placeholder="Gerar automaticamente"
                                                    className="bg-gray-900/50 border-gray-700/50 text-white"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={gerarCodigoAutomatico}
                                                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 whitespace-nowrap"
                                                >
                                                    Gerar
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-white">Nome *</Label>
                                            <Input
                                                value={nome}
                                                onChange={e => setNome(e.target.value)}
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-white">CPF</Label>
                                            <Input
                                                value={cpf}
                                                onChange={e => setCpf(e.target.value)}
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                                placeholder="000.000.000-00"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-white">RG</Label>
                                            <Input
                                                value={rg}
                                                onChange={e => setRg(e.target.value)}
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-white">Data Nascimento</Label>
                                            <Input
                                                type="date"
                                                value={dataNascimento}
                                                onChange={e => setDataNascimento(e.target.value)}
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-white">E-mail</Label>
                                            <Input
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="contato" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 space-y-3">
                                            <Label className="text-white">Endereço</Label>
                                            <Input
                                                value={endereco}
                                                onChange={e => setEndereco(e.target.value)}
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-white">Bairro</Label>
                                            <Input
                                                value={bairro}
                                                onChange={e => setBairro(e.target.value)}
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-white">Cidade</Label>
                                            <Input
                                                value={cidade}
                                                onChange={e => setCidade(e.target.value)}
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-white">Estado</Label>
                                            <Select value={estado} onValueChange={setEstado}>
                                                <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-900 border-gray-800">
                                                    <SelectItem value="SP">São Paulo (SP)</SelectItem>
                                                    <SelectItem value="RJ">Rio de Janeiro (RJ)</SelectItem>
                                                    <SelectItem value="MG">Minas Gerais (MG)</SelectItem>
                                                    <SelectItem value="RS">Rio Grande do Sul (RS)</SelectItem>
                                                    <SelectItem value="PR">Paraná (PR)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-white">CEP</Label>
                                            <Input
                                                value={cep}
                                                onChange={e => setCep(e.target.value)}
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                                placeholder="00000-000"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-white">Complemento</Label>
                                            <Input
                                                value={complemento}
                                                onChange={e => setComplemento(e.target.value)}
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-white">Telefone 1 *</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={ddd}
                                                    onChange={e => setDdd(e.target.value)}
                                                    className="w-20 bg-gray-900/50 border-gray-700/50 text-white"
                                                    placeholder="DDD"
                                                    maxLength={2}
                                                />
                                                <Input
                                                    value={telefone1}
                                                    onChange={e => setTelefone1(e.target.value)}
                                                    className="flex-1 bg-gray-900/50 border-gray-700/50 text-white"
                                                    placeholder="99999-9999"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-white">Telefone 2</Label>
                                            <Input
                                                value={telefone2}
                                                onChange={e => setTelefone2(e.target.value)}
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-white">Telefone 3</Label>
                                            <Input
                                                value={telefone3}
                                                onChange={e => setTelefone3(e.target.value)}
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="observacoes" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="marcado"
                                                    checked={marcado}
                                                    onCheckedChange={(checked) => setMarcado(checked as boolean)}
                                                    className="border-red-600 data-[state=checked]:bg-red-600"
                                                />
                                                <Label htmlFor="marcado" className="text-white cursor-pointer">
                                                    <div className="flex items-center">
                                                        <AlertTriangle className="h-4 w-4 text-amber-400 mr-2" />
                                                        Marcado? (Observação especial)
                                                    </div>
                                                </Label>
                                            </div>
                                            {marcado && (
                                                <div className="space-y-3 ml-6">
                                                    <Label className="text-white">Motivo da Marcação</Label>
                                                    <Input
                                                        value={motivoMarcacao}
                                                        onChange={e => setMotivoMarcacao(e.target.value)}
                                                        className="bg-gray-900/50 border-gray-700/50 text-white"
                                                        placeholder="Ex: Cliente VIP, Alergias, etc."
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="restricao"
                                                    checked={restricao}
                                                    onCheckedChange={(checked) => setRestricao(checked as boolean)}
                                                    className="border-red-600 data-[state=checked]:bg-red-600"
                                                />
                                                <Label htmlFor="restricao" className="text-white cursor-pointer">
                                                    <div className="flex items-center">
                                                        <Ban className="h-4 w-4 text-red-400 mr-2" />
                                                        Restrição? (Bloqueia vendas)
                                                    </div>
                                                </Label>
                                            </div>
                                            {restricao && (
                                                <div className="space-y-3 ml-6">
                                                    <Label className="text-white">Motivo da Restrição</Label>
                                                    <Input
                                                        value={motivoRestricao}
                                                        onChange={e => setMotivoRestricao(e.target.value)}
                                                        className="bg-gray-900/50 border-gray-700/50 text-white"
                                                        placeholder="Ex: Inadimplente, Problemas anteriores, etc."
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            {/* Botões de ação */}
                            <div className="flex justify-end gap-4 pt-6 border-t border-gray-800/50 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setAbaAtiva('lista')}
                                    className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={salvarProprietario}
                                    className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    Salvar Proprietário
                                </Button>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}

            {/* ABA: DETALHES DO PROPRIETÁRIO */}
            {abaAtiva === 'detalhe' && proprietarioSelecionado && (
                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setAbaAtiva('lista')}
                                        className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Voltar
                                    </Button>
                                    <CardTitle className="text-white">
                                        {proprietarioSelecionado.nome}
                                    </CardTitle>
                                </div>
                                <CardDescription className="text-gray-400">
                                    <Badge className="mr-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30">
                                        Código: {proprietarioSelecionado.codigo}
                                    </Badge>
                                    {proprietarioSelecionado.endereco}, {proprietarioSelecionado.bairro} - {proprietarioSelecionado.cidade}/{proprietarioSelecionado.estado}
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => abrirEdicao(proprietarioSelecionado)}
                                    className="border-emerald-600/50 text-emerald-400 hover:bg-emerald-600/20"
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => excluirProprietario(proprietarioSelecionado.id)}
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
                            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50 p-1">
                                <TabsTrigger value="dados" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30 text-white">
                                    <User className="mr-2 h-4 w-4" />
                                    Dados Principais
                                </TabsTrigger>
                                <TabsTrigger value="fichas" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30 text-white">
                                    <PawPrint className="mr-2 h-4 w-4" />
                                    Fichas ({fichasAnimais.length})
                                </TabsTrigger>
                                <TabsTrigger value="conta" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30 text-white">
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Conta Corrente
                                </TabsTrigger>
                            </TabsList>

                            {/* Conteúdo: Dados Principais */}
                            <TabsContent value="dados" className="space-y-6 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-white">Informações Pessoais</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-400">CPF</p>
                                                <p className="text-white">{proprietarioSelecionado.cpf || 'Não informado'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">RG</p>
                                                <p className="text-white">{proprietarioSelecionado.rg || 'Não informado'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Data Nascimento</p>
                                                <p className="text-white">{formatarData(proprietarioSelecionado.dataNascimento) || 'Não informado'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Data Cadastro</p>
                                                <p className="text-white">{formatarData(proprietarioSelecionado.dataCadastro)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-white">Contatos</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-400">Telefone 1</p>
                                                <p className="text-white">{formatarTelefone(proprietarioSelecionado.ddd, proprietarioSelecionado.telefone1)}</p>
                                            </div>
                                            {proprietarioSelecionado.telefone2 && (
                                                <div>
                                                    <p className="text-sm text-gray-400">Telefone 2</p>
                                                    <p className="text-white">{proprietarioSelecionado.telefone2}</p>
                                                </div>
                                            )}
                                            {proprietarioSelecionado.telefone3 && (
                                                <div>
                                                    <p className="text-sm text-gray-400">Telefone 3</p>
                                                    <p className="text-white">{proprietarioSelecionado.telefone3}</p>
                                                </div>
                                            )}
                                            {proprietarioSelecionado.email && (
                                                <div>
                                                    <p className="text-sm text-gray-400">E-mail</p>
                                                    <p className="text-white">{proprietarioSelecionado.email}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-white">Status e Observações</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-400">Saldo Atual</p>
                                                <p className={`text-2xl font-bold ${proprietarioSelecionado.saldo < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                    {formatarMoeda(proprietarioSelecionado.saldo)}
                                                </p>
                                            </div>
                                            {proprietarioSelecionado.marcado && (
                                                <div className="p-3 bg-gradient-to-br from-amber-600/10 to-orange-600/10 rounded border border-amber-600/30">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                                                        <p className="text-sm font-medium text-amber-400">Marcado</p>
                                                    </div>
                                                    <p className="text-sm text-amber-300">{proprietarioSelecionado.motivoMarcacao}</p>
                                                </div>
                                            )}
                                            {proprietarioSelecionado.restricao && (
                                                <div className="p-3 bg-gradient-to-br from-red-600/10 to-pink-600/10 rounded border border-red-600/30">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Ban className="h-4 w-4 text-red-400" />
                                                        <p className="text-sm font-medium text-red-400">Com Restrição</p>
                                                    </div>
                                                    <p className="text-sm text-red-300">{proprietarioSelecionado.motivoRestricao}</p>
                                                    <p className="text-xs text-red-400 mt-1">Vendas bloqueadas para este cliente</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Conteúdo: Fichas dos Animais */}
                            <TabsContent value="fichas" className="space-y-6 pt-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-lg font-semibold text-white">Fichas dos Animais</h4>
                                        <p className="text-gray-400">Animais cadastrados para {proprietarioSelecionado.nome}</p>
                                    </div>
                                    <Badge className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30">
                                        {fichasAnimais.length} animal{fichasAnimais.length !== 1 ? 's' : ''}
                                    </Badge>
                                </div>

                                {fichasAnimais.length === 0 ? (
                                    <div className="text-center py-12 border border-dashed border-gray-800/50 rounded-lg">
                                        <PawPrint className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400 text-lg">Nenhum animal cadastrado</p>
                                        <p className="text-gray-500 text-sm mt-2">
                                            Cadastre animais para este proprietário
                                        </p>
                                        <Button variant="outline" className="mt-4 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Cadastrar Animal
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-lg border border-gray-800/50">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-gray-800/50">
                                                    <TableHead className="text-gray-400">Ficha</TableHead>
                                                    <TableHead className="text-gray-400">Nome</TableHead>
                                                    <TableHead className="text-gray-400">Espécie</TableHead>
                                                    <TableHead className="text-gray-400">Raça</TableHead>
                                                    <TableHead className="text-gray-400">Status</TableHead>
                                                    <TableHead className="text-gray-400">Ações</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {fichasAnimais.map(ficha => (
                                                    <TableRow key={ficha.id} className="border-gray-800/30 hover:bg-gray-800/20">
                                                        <TableCell className="text-white font-mono">{ficha.ficha}</TableCell>
                                                        <TableCell className="text-white font-medium">{ficha.nome}</TableCell>
                                                        <TableCell className="text-white">{ficha.especie}</TableCell>
                                                        <TableCell className="text-white">{ficha.raca}</TableCell>
                                                        <TableCell>
                                                            <Badge className={`bg-gradient-to-r border ${
                                                                ficha.vivo 
                                                                    ? 'from-emerald-600/20 to-green-600/20 text-emerald-400' 
                                                                    : 'from-red-600/20 to-pink-600/20 text-red-400'
                                                            } border-gray-700`}>
                                                                {ficha.vivo ? 'Vivo' : 'Falecido'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Conteúdo: Conta Corrente */}
                            <TabsContent value="conta" className="space-y-6 pt-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-lg font-semibold text-white">Conta Corrente</h4>
                                        <p className="text-gray-400">Saldo atual:
                                            <span className={`ml-2 font-bold ${proprietarioSelecionado.saldo < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {formatarMoeda(proprietarioSelecionado.saldo)}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={enviarCartaDevedor}
                                            disabled={proprietarioSelecionado.saldo >= 0}
                                            className="border-red-600/50 text-white hover:bg-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Mail className="mr-2 h-4 w-4" />
                                            Carta de Cobrança
                                        </Button>
                                        <Button
                                            onClick={() => setNovoLancamentoOpen(true)}
                                            className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Novo Lançamento
                                        </Button>
                                    </div>
                                </div>

                                {lancamentosConta.length === 0 ? (
                                    <div className="text-center py-12 border border-dashed border-gray-800/50 rounded-lg">
                                        <DollarSign className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400 text-lg">Nenhum lançamento na conta corrente</p>
                                        <p className="text-gray-500 text-sm mt-2">
                                            Adicione o primeiro lançamento para este proprietário
                                        </p>
                                        <Button
                                            onClick={() => setNovoLancamentoOpen(true)}
                                            className="mt-4 gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Adicionar Primeiro Lançamento
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-lg border border-gray-800/50">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-gray-800/50">
                                                    <TableHead className="text-gray-400">Data</TableHead>
                                                    <TableHead className="text-gray-400">Operação</TableHead>
                                                    <TableHead className="text-gray-400">Descrição</TableHead>
                                                    <TableHead className="text-gray-400">Tipo</TableHead>
                                                    <TableHead className="text-gray-400 text-right">Valor</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {lancamentosConta.map(lancamento => (
                                                    <TableRow key={lancamento.id} className="border-gray-800/30 hover:bg-gray-800/20">
                                                        <TableCell className="text-white">
                                                            {formatarData(lancamento.data)}
                                                        </TableCell>
                                                        <TableCell className="text-white">{lancamento.operacao}</TableCell>
                                                        <TableCell className="text-white">{lancamento.descricao}</TableCell>
                                                        <TableCell>
                                                            <Badge className={`bg-gradient-to-r border ${
                                                                lancamento.tipo === 'CREDITO'
                                                                    ? 'from-emerald-600/20 to-green-600/20 text-emerald-400'
                                                                    : 'from-red-600/20 to-pink-600/20 text-red-400'
                                                            } border-gray-700`}>
                                                                {lancamento.tipo === 'CREDITO' ? 'Crédito' : 'Débito'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className={`text-right font-bold ${lancamento.tipo === 'CREDITO' ? 'text-emerald-400' : 'text-red-400'
                                                            }`}>
                                                            {lancamento.tipo === 'CREDITO' ? '+' : '-'} {formatarMoeda(lancamento.valor)}
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
                <DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 text-white max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5 text-red-400" />
                            Editar Proprietário
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Atualize os dados do proprietário {editNome}
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="dados" className="space-y-4">
                        <TabsList className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50 p-1">
                            <TabsTrigger value="dados" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                                Dados Básicos
                            </TabsTrigger>
                            <TabsTrigger value="status" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                                Status
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="dados" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <Label className="text-white">Nome *</Label>
                                    <Input
                                        value={editNome}
                                        onChange={e => setEditNome(e.target.value)}
                                        className="bg-gray-900/50 border-gray-700/50 text-white"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-white">CPF</Label>
                                    <Input
                                        value={editCpf}
                                        onChange={e => setEditCpf(e.target.value)}
                                        className="bg-gray-900/50 border-gray-700/50 text-white"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-white">E-mail</Label>
                                    <Input
                                        value={editEmail}
                                        onChange={e => setEditEmail(e.target.value)}
                                        className="bg-gray-900/50 border-gray-700/50 text-white"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-white">Telefone 1</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={editDdd}
                                            onChange={e => setEditDdd(e.target.value)}
                                            className="w-20 bg-gray-900/50 border-gray-700/50 text-white"
                                            placeholder="DDD"
                                        />
                                        <Input
                                            value={editTelefone1}
                                            onChange={e => setEditTelefone1(e.target.value)}
                                            className="flex-1 bg-gray-900/50 border-gray-700/50 text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="status" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="edit-marcado"
                                            checked={editMarcado}
                                            onCheckedChange={(checked) => setEditMarcado(checked as boolean)}
                                            className="border-red-600 data-[state=checked]:bg-red-600"
                                        />
                                        <Label htmlFor="edit-marcado" className="text-white cursor-pointer">
                                            Marcado?
                                        </Label>
                                    </div>
                                    {editMarcado && (
                                        <div className="space-y-3 ml-6">
                                            <Label className="text-white">Motivo da Marcação</Label>
                                            <Input
                                                value={editMotivoMarcacao}
                                                onChange={e => setEditMotivoMarcacao(e.target.value)}
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="edit-restricao"
                                            checked={editRestricao}
                                            onCheckedChange={(checked) => setEditRestricao(checked as boolean)}
                                            className="border-red-600 data-[state=checked]:bg-red-600"
                                        />
                                        <Label htmlFor="edit-restricao" className="text-white cursor-pointer">
                                            Restrição? (Bloqueia vendas)
                                        </Label>
                                    </div>
                                    {editRestricao && (
                                        <div className="space-y-3 ml-6">
                                            <Label className="text-white">Motivo da Restrição</Label>
                                            <Input
                                                value={editMotivoRestricao}
                                                onChange={e => setEditMotivoRestricao(e.target.value)}
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-4">
                                <Checkbox
                                    id="edit-ativo"
                                    checked={editAtivo}
                                    onCheckedChange={(checked) => setEditAtivo(checked as boolean)}
                                    className="border-red-600 data-[state=checked]:bg-red-600"
                                />
                                <Label htmlFor="edit-ativo" className="text-white cursor-pointer">
                                    Ativo no sistema
                                </Label>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditOpen(false)} className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                            Cancelar
                        </Button>
                        <Button onClick={salvarEdicao} className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                            <Edit className="h-4 w-4" />
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL DE NOVO LANÇAMENTO */}
            <Dialog open={novoLancamentoOpen} onOpenChange={setNovoLancamentoOpen}>
                <DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5 text-red-400" />
                            Novo Lançamento
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            {proprietarioSelecionado?.nome} - Saldo atual: {formatarMoeda(proprietarioSelecionado?.saldo || 0)}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-3">
                            <Label className="text-white">Tipo de Lançamento</Label>
                            <Select value={lancamentoTipo} onValueChange={(value: any) => setLancamentoTipo(value)}>
                                <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-800">
                                    {tipoLancamentoOptions.map((tipo) => (
                                        <SelectItem key={tipo.value} value={tipo.value}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${tipo.color}`} />
                                                {tipo.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-white">Valor *</Label>
                            <Input
                                type="number"
                                value={lancamentoValor}
                                onChange={e => setLancamentoValor(e.target.value)}
                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                placeholder="0,00"
                                step="0.01"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-white">Descrição *</Label>
                            <Textarea
                                value={lancamentoDescricao}
                                onChange={e => setLancamentoDescricao(e.target.value)}
                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                placeholder="Ex: Pagamento em dinheiro, Compra de ração, etc."
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNovoLancamentoOpen(false)} className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                            Cancelar
                        </Button>
                        <Button onClick={adicionarLancamentoConta} className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                            <Plus className="h-4 w-4" />
                            Adicionar Lançamento
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TabelaProprietarios;