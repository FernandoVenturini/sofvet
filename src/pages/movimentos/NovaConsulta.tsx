'use client';

import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Plus,
    Search,
    ArrowLeft,
    PawPrint,
    User,
    DollarSign,
    ShoppingCart,
    FileText,
    CreditCard,
    Calendar,
    Tag,
    Trash2,
    Edit,
    Eye,
    Download,
    Printer,
    CheckCircle,
    AlertTriangle,
    Clock,
    Activity,
    Zap,
    Brain,
    Heart,
    Thermometer,
    Package,
    Briefcase,
    Stethoscope,
    Pill,
    Syringe,
    Scissors,
    FlaskConical,
    MapPin,
    Phone,
    Mail,
    Home,
    Sparkles,
    RefreshCw,
    Filter,
    ChevronRight,
    Calculator,
    Percent,
    Clipboard,
    FileEdit,
    Microscope,
    HeartPulse,
    Droplets,
    ActivitySquare,
    Syringe as VaccineIcon,
    Shield,
    FileCheck,
    Receipt,
    Users,
    Building,
    Wallet,
    BarChart3,
    TrendingUp,
    BadgeCheck,
    ScanBarcode,
    ClipboardCheck,
    FileBarChart,
    ListChecks,
    Scale,
    Calculator as CalcIcon,
    AlertCircle
} from 'lucide-react';

const NovaConsulta = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Estados principais
    const [animais, setAnimais] = useState<any[]>([]);
    const [produtosServicos, setProdutosServicos] = useState<any[]>([]);
    const [buscaAnimal, setBuscaAnimal] = useState('');
    const [animalSelecionado, setAnimalSelecionado] = useState<any>(null);
    const [proprietario, setProprietario] = useState<any>(null);
    const [itens, setItens] = useState<Array<{
        id: string;
        tipo: string;
        descricao: string;
        codigo: string;
        quantidade: number;
        precoUnitario: number;
        desconto: number;
        subtotal: number;
        estoqueAtual?: number;
    }>>([]);
    const [itemSelecionado, setItemSelecionado] = useState('');
    const [codigoBarras, setCodigoBarras] = useState('');
    const [quantidade, setQuantidade] = useState(1);
    const [precoSelecionado, setPrecoSelecionado] = useState<'preco1' | 'preco2' | 'preco3'>('preco1');
    const [formaPagamento, setFormaPagamento] = useState('dinheiro');
    const [parcelas, setParcelas] = useState(1);
    const [observacoes, setObservacoes] = useState('');
    const [veterinario, setVeterinario] = useState('');
    const [tipoConsulta, setTipoConsulta] = useState('rotina');
    const [abaAtiva, setAbaAtiva] = useState<'animal' | 'itens' | 'pagamento' | 'resumo'>('animal');
    const [descontoGeral, setDescontoGeral] = useState(0);
    const [descontoValor, setDescontoValor] = useState(0);
    const [valorPago, setValorPago] = useState({
        dinheiro: 0,
        cheque: 0,
        cartao: 0,
        outros: 0
    });
    const [operacaoNumero, setOperacaoNumero] = useState<string>('');
    const [dataRetorno, setDataRetorno] = useState('');
    const [motivoRetorno, setMotivoRetorno] = useState('');
    const [funcionarios, setFuncionarios] = useState<any[]>([]);
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState('');
    const [saldoDevedor, setSaldoDevedor] = useState(0);
    const [saldoCredor, setSaldoCredor] = useState(0);
    const [gruposProdutos, setGruposProdutos] = useState<any[]>([]);
    const [grupoSelecionado, setGrupoSelecionado] = useState('');
    const [emiteNotaFiscal, setEmiteNotaFiscal] = useState(false);
    const [ncm, setNcm] = useState('');
    const [tributacao, setTributacao] = useState({
        aliquota: 0,
        substituicao: 0
    });

    // Opções para selects
    const formaPagamentoOptions = [
        { value: 'dinheiro', label: 'Dinheiro', icon: DollarSign, color: 'from-emerald-600/20 to-green-600/20', textColor: 'text-emerald-400' },
        { value: 'cheque', label: 'Cheque', icon: FileEdit, color: 'from-blue-600/20 to-cyan-600/20', textColor: 'text-blue-400' },
        { value: 'cartao_debito', label: 'Cartão Débito', icon: CreditCard, color: 'from-purple-600/20 to-pink-600/20', textColor: 'text-purple-400' },
        { value: 'cartao_credito', label: 'Cartão Crédito', icon: CreditCard, color: 'from-red-600/20 to-pink-600/20', textColor: 'text-red-400' },
        { value: 'pix', label: 'PIX', icon: Zap, color: 'from-amber-600/20 to-orange-600/20', textColor: 'text-amber-400' },
        { value: 'parcelado', label: 'Parcelado', icon: Calendar, color: 'from-indigo-600/20 to-violet-600/20', textColor: 'text-indigo-400' },
    ];

    const tipoConsultaOptions = [
        { value: 'rotina', label: 'Rotina', icon: Stethoscope, color: 'from-blue-600/20 to-cyan-600/20', textColor: 'text-blue-400' },
        { value: 'emergencia', label: 'Emergência', icon: AlertTriangle, color: 'from-red-600/20 to-pink-600/20', textColor: 'text-red-400' },
        { value: 'cirurgia', label: 'Cirurgia', icon: Scissors, color: 'from-purple-600/20 to-pink-600/20', textColor: 'text-purple-400' },
        { value: 'vacina', label: 'Vacinação', icon: VaccineIcon, color: 'from-emerald-600/20 to-green-600/20', textColor: 'text-emerald-400' },
        { value: 'exame', label: 'Exame', icon: FlaskConical, color: 'from-amber-600/20 to-orange-600/20', textColor: 'text-amber-400' },
        { value: 'internacao', label: 'Internação', icon: HeartPulse, color: 'from-pink-600/20 to-rose-600/20', textColor: 'text-pink-400' },
        { value: 'banho', label: 'Banho', icon: Droplets, color: 'from-cyan-600/20 to-blue-600/20', textColor: 'text-cyan-400' },
        { value: 'tosa', label: 'Tosa', icon: Scissors, color: 'from-violet-600/20 to-purple-600/20', textColor: 'text-violet-400' },
    ];

    const precoOptions = [
        { value: 'preco1', label: 'Tabela 1', color: 'from-gray-600/20 to-gray-700/20', textColor: 'text-gray-400' },
        { value: 'preco2', label: 'Tabela 2', color: 'from-blue-600/20 to-cyan-600/20', textColor: 'text-blue-400' },
        { value: 'preco3', label: 'Tabela 3', color: 'from-emerald-600/20 to-green-600/20', textColor: 'text-emerald-400' },
    ];

    useEffect(() => {
        const carregarDados = async () => {
            if (!user) return;

            try {
                // Carregar animais do usuário
                const animaisSnap = await getDocs(query(collection(db, 'animais'), where('userId', '==', user.uid)));
                const animaisData = animaisSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAnimais(animaisData);

                // Carregar produtos/serviços
                const produtosSnap = await getDocs(collection(db, 'produtosServicos'));
                setProdutosServicos(produtosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                // Carregar funcionários
                const funcionariosSnap = await getDocs(collection(db, 'funcionarios'));
                setFuncionarios(funcionariosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                // Carregar grupos de produtos
                const gruposSnap = await getDocs(collection(db, 'gruposProdutos'));
                setGruposProdutos(gruposSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                // Gerar número da operação
                const dataAtual = new Date();
                const ano = dataAtual.getFullYear().toString().slice(-2);
                const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
                const dia = dataAtual.getDate().toString().padStart(2, '0');
                const random = Math.random().toString(36).substr(2, 4).toUpperCase();
                setOperacaoNumero(`${ano}${mes}${dia}${random}`);

            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };

        carregarDados();
    }, [user]);

    // Carregar proprietário quando animal for selecionado
    useEffect(() => {
        const carregarProprietario = async () => {
            if (animalSelecionado?.proprietarioId) {
                try {
                    const proprietarioRef = doc(db, 'proprietarios', animalSelecionado.proprietarioId);
                    const proprietarioSnap = await getDoc(proprietarioRef);
                    if (proprietarioSnap.exists()) {
                        const proprietarioData = proprietarioSnap.data();
                        setProprietario({ id: proprietarioSnap.id, ...proprietarioData });
                        // Carregar saldo da conta corrente
                        setSaldoDevedor(proprietarioData.saldoDevedor || 0);
                        setSaldoCredor(proprietarioData.saldoCredor || 0);
                    }
                } catch (error) {
                    console.error('Erro ao carregar proprietário:', error);
                }
            }
        };

        carregarProprietario();
    }, [animalSelecionado]);

    const animaisFiltrados = animais.filter(a =>
        a.nomeAnimal?.toLowerCase().includes(buscaAnimal.toLowerCase()) ||
        a.nomeProprietario?.toLowerCase().includes(buscaAnimal.toLowerCase()) ||
        a.raca?.toLowerCase().includes(buscaAnimal.toLowerCase()) ||
        a.microchip?.toLowerCase().includes(buscaAnimal.toLowerCase())
    );

    const produtosFiltrados = grupoSelecionado
        ? produtosServicos.filter(p => p.grupoId === grupoSelecionado)
        : produtosServicos;

    const adicionarItem = () => {
        if (!itemSelecionado && !codigoBarras) return;

        let item;

        if (codigoBarras) {
            // Buscar por código de barras
            item = produtosServicos.find(p => p.codigoBarras === codigoBarras);
            setCodigoBarras('');
        } else {
            item = produtosServicos.find(p => p.id === itemSelecionado);
        }

        if (!item) {
            alert('Produto/serviço não encontrado!');
            return;
        }

        // Verificar se é serviço (não controla estoque)
        const isServico = item.tipo === 'servico';
        const precoAtual = item[precoSelecionado] || item.preco1 || 0;
        const estoqueAtual = item.estoqueAtual || 0;

        if (!isServico && estoqueAtual < quantidade) {
            alert(`Estoque insuficiente! Disponível: ${estoqueAtual}`);
            return;
        }

        const subtotal = precoAtual * quantidade;

        const novoItem = {
            id: item.id,
            tipo: item.tipo,
            descricao: item.descricao,
            codigo: item.codigo,
            quantidade,
            precoUnitario: precoAtual,
            desconto: 0,
            subtotal,
            estoqueAtual
        };

        setItens([...itens, novoItem]);

        setItemSelecionado('');
        setQuantidade(1);
    };

    const removerItem = (index: number) => {
        const novosItens = [...itens];
        novosItens.splice(index, 1);
        setItens(novosItens);
    };

    const atualizarItem = (index: number, campo: string, valor: any) => {
        const novosItens = [...itens];
        novosItens[index] = { ...novosItens[index], [campo]: valor };

        // Recalcular subtotal se quantidade, precoUnitario ou desconto mudar
        if (campo === 'quantidade' || campo === 'precoUnitario' || campo === 'desconto') {
            const item = novosItens[index];
            const descontoDecimal = item.desconto / 100;
            novosItens[index].subtotal = item.quantidade * item.precoUnitario * (1 - descontoDecimal);
        }

        setItens(novosItens);
    };

    const calcularSubtotal = () => {
        return itens.reduce((sum, item) => sum + item.subtotal, 0);
    };

    const calcularDescontoValor = () => {
        const subtotal = calcularSubtotal();
        return subtotal * (descontoGeral / 100);
    };

    const calcularTotal = () => {
        const subtotal = calcularSubtotal();
        const desconto = calcularDescontoValor();
        return subtotal - desconto;
    };

    const calcularTroco = () => {
        const totalPago = valorPago.dinheiro + valorPago.cheque + valorPago.cartao + valorPago.outros;
        const total = calcularTotal();
        return totalPago > total ? totalPago - total : 0;
    };

    const calcularSaldoRestante = () => {
        const totalPago = valorPago.dinheiro + valorPago.cheque + valorPago.cartao + valorPago.outros;
        const total = calcularTotal();
        return total > totalPago ? total - totalPago : 0;
    };

    const baixarEstoque = async () => {
        // Baixar estoque dos produtos
        for (const item of itens) {
            if (item.tipo !== 'servico') {
                try {
                    const produtoRef = doc(db, 'produtosServicos', item.id);
                    const produtoSnap = await getDoc(produtoRef);
                    if (produtoSnap.exists()) {
                        const produto = produtoSnap.data();
                        const novoEstoque = (produto.estoqueAtual || 0) - item.quantidade;

                        await updateDoc(produtoRef, {
                            estoqueAtual: novoEstoque
                        });
                    }
                } catch (error) {
                    console.error(`Erro ao baixar estoque do produto ${item.descricao}:`, error);
                }
            }
        }
    };

    const salvarConsulta = async () => {
        if (!animalSelecionado || itens.length === 0) {
            alert('Selecione um animal e adicione itens à consulta');
            return;
        }

        try {
            const total = calcularTotal();
            const totalPago = valorPago.dinheiro + valorPago.cheque + valorPago.cartao + valorPago.outros;
            const saldoDevedorAtual = total > totalPago ? total - totalPago : 0;
            const saldoCredorAtual = totalPago > total ? totalPago - total : 0;

            await addDoc(collection(db, 'consultas'), {
                operacaoNumero,
                animalId: animalSelecionado.id,
                animalNome: animalSelecionado.nomeAnimal,
                proprietarioId: proprietario?.id,
                proprietarioNome: proprietario?.nome || animalSelecionado.nomeProprietario,
                itens,
                subtotal: calcularSubtotal(),
                descontoGeral,
                descontoValor: calcularDescontoValor(),
                total,
                formaPagamento,
                valorPago,
                saldoDevedor: saldoDevedorAtual,
                saldoCredor: saldoCredorAtual,
                parcelas,
                observacoes,
                veterinario,
                funcionarioId: funcionarioSelecionado,
                tipoConsulta,
                dataRetorno,
                motivoRetorno,
                data: new Date().toISOString(),
                dataFormatada: new Date().toLocaleDateString('pt-BR'),
                hora: new Date().toLocaleTimeString('pt-BR'),
                userId: user?.uid,
                createdAt: serverTimestamp(),
                status: 'finalizada',
                emitidaNotaFiscal: emiteNotaFiscal,
                ncm: ncm || undefined,
                tributacao: emiteNotaFiscal ? tributacao : undefined
            });

            // Atualizar saldo na conta corrente do proprietário
            if (proprietario?.id && saldoDevedorAtual > 0) {
                const proprietarioRef = doc(db, 'proprietarios', proprietario.id);
                await updateDoc(proprietarioRef, {
                    saldoDevedor: (proprietario.saldoDevedor || 0) + saldoDevedorAtual,
                    ultimaCompra: new Date().toISOString(),
                    valorUltimaCompra: total
                });
            }

            alert('Consulta salva com sucesso!');
            limparFormulario();
            navigate('/movimento/lista');
        } catch (error) {
            console.error('Erro ao salvar consulta:', error);
            alert('Erro ao salvar consulta');
        }
    };

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const limparFormulario = () => {
        setAnimalSelecionado(null);
        setProprietario(null);
        setItens([]);
        setBuscaAnimal('');
        setObservacoes('');
        setDescontoGeral(0);
        setDescontoValor(0);
        setValorPago({ dinheiro: 0, cheque: 0, cartao: 0, outros: 0 });
        setDataRetorno('');
        setMotivoRetorno('');
        setAbaAtiva('animal');
        setSaldoDevedor(0);
        setSaldoCredor(0);
        setEmiteNotaFiscal(false);
        setNcm('');
        setTributacao({ aliquota: 0, substituicao: 0 });
    };

    const imprimirRecibo = () => {
        window.print();
    };

    const imprimirCupomFiscal = () => {
        // Lógica para impressão de cupom fiscal
        alert('Cupom fiscal impresso (implementação da impressora fiscal)');
    };

    const enviarCartaDevedor = () => {
        if (proprietario && calcularSaldoRestante() > 0) {
            alert(`Carta de cobrança enviada para ${proprietario.nome}`);
        }
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30">
                            <Stethoscope className="h-6 w-6 text-red-400" />
                        </div>
                        <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 border border-red-500/30">
                            <Sparkles className="h-3 w-3 mr-1" />
                            NOVA CONSULTA - SofVet
                        </Badge>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">
                        Manutenção de Operações
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Sistema completo para gestão de consultas e procedimentos veterinários
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400 border border-purple-500/30">
                        <ClipboardCheck className="h-3 w-3 mr-1" />
                        Operação: {operacaoNumero}
                    </Badge>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/movimento/lista')}
                        className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar para Lista
                    </Button>
                    <Button
                        variant="outline"
                        className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                        onClick={limparFormulario}
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Nova Operação
                    </Button>
                </div>
            </div>

            {/* Tabs de Navegação */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                <CardContent className="p-4">
                    <Tabs value={abaAtiva} onValueChange={(value: any) => setAbaAtiva(value)} className="w-full">
                        <TabsList className="grid grid-cols-4 bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50 p-1">
                            <TabsTrigger
                                value="animal"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30"
                                disabled={!user}
                            >
                                <PawPrint className="h-4 w-4 mr-2" />
                                1. Animal
                            </TabsTrigger>
                            <TabsTrigger
                                value="itens"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30"
                                disabled={!animalSelecionado}
                            >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                2. Itens
                            </TabsTrigger>
                            <TabsTrigger
                                value="pagamento"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30"
                                disabled={itens.length === 0}
                            >
                                <CreditCard className="h-4 w-4 mr-2" />
                                3. Pagamento
                            </TabsTrigger>
                            <TabsTrigger
                                value="resumo"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30"
                                disabled={!formaPagamento}
                            >
                                <FileCheck className="h-4 w-4 mr-2" />
                                4. Finalizar
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Conteúdo das Tabs */}
            <div className="space-y-6">
                {/* TAB: ANIMAL */}
                {abaAtiva === 'animal' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Busca de Animal */}
                        <Card className="lg:col-span-2 bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Search className="h-5 w-5 text-red-400" />
                                    Localizar Ficha do Animal
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Busque por nome do animal, proprietário, raça, microchip ou CCI
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-white">Buscar por:</Label>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                    <Input
                                                        placeholder="Nome do animal, proprietário, raça..."
                                                        value={buscaAnimal}
                                                        onChange={e => setBuscaAnimal(e.target.value)}
                                                        className="pl-10 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-white">Microchip / CCI:</Label>
                                                <Input
                                                    placeholder="Código de identificação"
                                                    className="bg-gray-900/50 border-gray-700/50 text-white"
                                                />
                                            </div>
                                        </div>

                                        {buscaAnimal && animaisFiltrados.length > 0 && (
                                            <ScrollArea className="h-80 rounded-lg border border-gray-800/50">
                                                <div className="p-2">
                                                    {animaisFiltrados.map(animal => (
                                                        <div
                                                            key={animal.id}
                                                            className={`p-4 rounded-lg mb-2 cursor-pointer transition-all ${animalSelecionado?.id === animal.id
                                                                    ? 'bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30'
                                                                    : 'bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800/30'
                                                                }`}
                                                            onClick={() => setAnimalSelecionado(animal)}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <PawPrint className="h-5 w-5 text-blue-400" />
                                                                        <div>
                                                                            <p className="font-bold text-white text-lg">{animal.nomeAnimal}</p>
                                                                            <div className="flex items-center gap-4 text-sm">
                                                                                <span className="text-gray-400">Ficha: <span className="text-white font-mono">{animal.codigo || animal.id.slice(0, 8)}</span></span>
                                                                                <span className="text-gray-400">Espécie: <span className="text-white">{animal.especie || 'Não informado'}</span></span>
                                                                                <span className="text-gray-400">Raça: <span className="text-white">{animal.raca || 'Não informado'}</span></span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-4 text-sm">
                                                                        <div className="flex items-center gap-2">
                                                                            <User className="h-3 w-3 text-gray-400" />
                                                                            <span className="text-gray-400">Proprietário:</span>
                                                                            <span className="text-white">{animal.nomeProprietario}</span>
                                                                        </div>
                                                                        {animal.telefoneProprietario && (
                                                                            <div className="flex items-center gap-2">
                                                                                <Phone className="h-3 w-3 text-gray-400" />
                                                                                <span className="text-white">{animal.telefoneProprietario}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col items-end gap-2">
                                                                    <Badge className={`bg-gradient-to-r ${animal.sexo === 'femea'
                                                                            ? 'from-pink-600/20 to-rose-600/20 text-pink-400'
                                                                            : 'from-blue-600/20 to-cyan-600/20 text-blue-400'
                                                                        } border border-gray-700`}>
                                                                        {animal.sexo === 'femea' ? 'Fêmea' : 'Macho'}
                                                                    </Badge>
                                                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        )}

                                        {buscaAnimal && animaisFiltrados.length === 0 && (
                                            <div className="text-center py-8 border border-dashed border-gray-800/50 rounded-lg">
                                                <AlertCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                                <p className="text-gray-400">Nenhum animal encontrado</p>
                                                <p className="text-gray-500 text-sm mt-2">
                                                    Cadastre um novo animal ou tente outros termos de busca
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    className="mt-4 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                                                    onClick={() => navigate('/fichas/nova')}
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Cadastrar Novo Animal
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Info do Animal Selecionado */}
                        <div className="space-y-6">
                            {animalSelecionado ? (
                                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <PawPrint className="h-5 w-5 text-red-400" />
                                                Animal Selecionado
                                            </span>
                                            <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400">
                                                Ficha: {animalSelecionado.codigo || animalSelecionado.id.slice(0, 8)}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Nome:</span>
                                                <span className="text-white font-bold">{animalSelecionado.nomeAnimal}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Espécie/Raça:</span>
                                                <span className="text-white">{animalSelecionado.especie} / {animalSelecionado.raca}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Idade:</span>
                                                <span className="text-white">
                                                    {animalSelecionado.dataNascimento
                                                        ? `${Math.floor((new Date().getTime() - new Date(animalSelecionado.dataNascimento).getTime()) / (1000 * 60 * 60 * 24 * 365.25))} anos`
                                                        : 'Não informada'
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Peso:</span>
                                                <span className="text-white">{animalSelecionado.peso || 'Não informado'} kg</span>
                                            </div>
                                        </div>

                                        <Separator className="bg-gray-800/50" />

                                        <div className="space-y-3">
                                            <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                Proprietário
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-400">Nome:</span>
                                                    <span className="text-white">{animalSelecionado.nomeProprietario}</span>
                                                </div>
                                                {animalSelecionado.telefoneProprietario && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-400">Telefone:</span>
                                                        <span className="text-white">{animalSelecionado.telefoneProprietario}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {proprietario && (
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                                    <Wallet className="h-4 w-4" />
                                                    Conta Corrente
                                                </h4>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-400">Saldo Devedor:</span>
                                                        <span className={`font-bold ${saldoDevedor > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                                            {formatarMoeda(saldoDevedor)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-400">Saldo Credor:</span>
                                                        <span className={`font-bold ${saldoCredor > 0 ? 'text-emerald-400' : 'text-gray-400'}`}>
                                                            {formatarMoeda(saldoCredor)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <Button
                                            onClick={() => setAbaAtiva('itens')}
                                            className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                            Continuar para Itens
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                                    <CardContent className="p-8 text-center">
                                        <PawPrint className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400">Nenhum animal selecionado</p>
                                        <p className="text-gray-500 text-sm mt-2">
                                            Selecione um animal para iniciar a consulta
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Configurações da Consulta */}
                            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                                <CardHeader>
                                    <CardTitle className="text-white text-sm font-medium">Configurações</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-white text-xs">Tipo de Consulta</Label>
                                        <Select value={tipoConsulta} onValueChange={setTipoConsulta}>
                                            <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white text-sm h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-900 border-gray-800">
                                                {tipoConsultaOptions.map((tipo) => (
                                                    <SelectItem key={tipo.value} value={tipo.value} className="text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <tipo.icon className={`h-3 w-3 ${tipo.textColor}`} />
                                                            {tipo.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-white text-xs">Veterinário Responsável</Label>
                                        <Input
                                            value={veterinario}
                                            onChange={e => setVeterinario(e.target.value)}
                                            placeholder="Nome do veterinário"
                                            className="bg-gray-900/50 border-gray-700/50 text-white text-sm h-8"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-white text-xs">Funcionário</Label>
                                        <Select value={funcionarioSelecionado} onValueChange={setFuncionarioSelecionado}>
                                            <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white text-sm h-8">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-900 border-gray-800">
                                                {funcionarios.map(func => (
                                                    <SelectItem key={func.id} value={func.id} className="text-sm">
                                                        {func.nome}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* TAB: ITENS */}
                {abaAtiva === 'itens' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Formulário de Itens */}
                            <Card className="lg:col-span-2 bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <ShoppingCart className="h-5 w-5 text-red-400" />
                                        Adicionar Produtos/Serviços
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Utilize código, descrição ou leitor de código de barras
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Filtros e Seleção */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-white text-sm">Grupo</Label>
                                            <Select value={grupoSelecionado} onValueChange={setGrupoSelecionado}>
                                                <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white text-sm h-9">
                                                    <SelectValue placeholder="Todos os grupos" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-900 border-gray-800">
                                                    <SelectItem value="">Todos os grupos</SelectItem>
                                                    {gruposProdutos.map(grupo => (
                                                        <SelectItem key={grupo.id} value={grupo.id} className="text-sm">
                                                            {grupo.codigo} - {grupo.descricao}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-white text-sm">Produto/Serviço</Label>
                                            <Select value={itemSelecionado} onValueChange={setItemSelecionado}>
                                                <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white text-sm h-9">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-900 border-gray-800 max-h-60">
                                                    {produtosFiltrados.map(item => (
                                                        <SelectItem key={item.id} value={item.id} className="text-sm">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    {item.tipo === 'servico' ? (
                                                                        <Briefcase className="h-3 w-3 text-emerald-400" />
                                                                    ) : (
                                                                        <Package className="h-3 w-3 text-blue-400" />
                                                                    )}
                                                                    <span>{item.codigo} - {item.descricao}</span>
                                                                </div>
                                                                <Badge className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 text-gray-300 text-xs">
                                                                    {formatarMoeda(item.preco1 || 0)}
                                                                </Badge>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-white text-sm">Código de Barras</Label>
                                            <div className="relative">
                                                <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500" />
                                                <Input
                                                    placeholder="Passe o código"
                                                    value={codigoBarras}
                                                    onChange={e => setCodigoBarras(e.target.value)}
                                                    className="pl-9 bg-gray-900/50 border-gray-700/50 text-white text-sm h-9"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            adicionarItem();
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-white text-sm">Quantidade</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={quantidade}
                                                onChange={e => setQuantidade(Number(e.target.value))}
                                                className="bg-gray-900/50 border-gray-700/50 text-white text-sm h-9"
                                            />
                                        </div>
                                    </div>

                                    {/* Tabela de Preços */}
                                    <div className="space-y-2">
                                        <Label className="text-white text-sm">Tabela de Preços</Label>
                                        <div className="flex gap-2">
                                            {precoOptions.map((preco) => (
                                                <Button
                                                    key={preco.value}
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setPrecoSelecionado(preco.value as any)}
                                                    className={`flex-1 h-8 ${precoSelecionado === preco.value
                                                            ? `bg-gradient-to-br ${preco.color} border-${preco.textColor.split('text-')[1]}/50 ${preco.textColor}`
                                                            : 'border-gray-700 text-gray-400'
                                                        }`}
                                                >
                                                    {preco.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Botões de Ação */}
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={adicionarItem}
                                            disabled={!itemSelecionado && !codigoBarras}
                                            className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 flex-1"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Adicionar Item
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                                            onClick={() => {
                                                // Lógica para consulta rápida
                                            }}
                                        >
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Tabela de Itens */}
                                    {itens.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-lg font-semibold text-white">Itens da Venda</h4>
                                                <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400 border border-red-500/30">
                                                    {itens.length} item{itens.length !== 1 ? 's' : ''}
                                                </Badge>
                                            </div>
                                            <div className="overflow-x-auto rounded-lg border border-gray-800/50">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="border-gray-800/50">
                                                            <TableHead className="text-gray-400 text-xs">Código</TableHead>
                                                            <TableHead className="text-gray-400 text-xs">Descrição</TableHead>
                                                            <TableHead className="text-gray-400 text-xs text-center">Qtd</TableHead>
                                                            <TableHead className="text-gray-400 text-xs text-right">Preço Unit.</TableHead>
                                                            <TableHead className="text-gray-400 text-xs text-center">Desc. %</TableHead>
                                                            <TableHead className="text-gray-400 text-xs text-right">Subtotal</TableHead>
                                                            <TableHead className="text-gray-400 text-xs text-center">Ações</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {itens.map((item, index) => (
                                                            <TableRow key={index} className="border-gray-800/30 hover:bg-gray-800/20">
                                                                <TableCell className="text-white font-mono text-xs">{item.codigo}</TableCell>
                                                                <TableCell className="text-white text-sm">
                                                                    <div className="flex items-center gap-2">
                                                                        {item.tipo === 'servico' ? (
                                                                            <Briefcase className="h-3 w-3 text-emerald-400" />
                                                                        ) : (
                                                                            <Package className="h-3 w-3 text-blue-400" />
                                                                        )}
                                                                        {item.descricao}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    <Input
                                                                        type="number"
                                                                        min="1"
                                                                        value={item.quantidade}
                                                                        onChange={e => atualizarItem(index, 'quantidade', Number(e.target.value))}
                                                                        className="w-16 bg-gray-900/50 border-gray-700/50 text-white text-center text-sm h-6"
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <Input
                                                                        type="number"
                                                                        step="0.01"
                                                                        value={item.precoUnitario}
                                                                        onChange={e => atualizarItem(index, 'precoUnitario', Number(e.target.value))}
                                                                        className="w-24 bg-gray-900/50 border-gray-700/50 text-white text-right text-sm h-6"
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    <Input
                                                                        type="number"
                                                                        min="0"
                                                                        max="100"
                                                                        value={item.desconto}
                                                                        onChange={e => atualizarItem(index, 'desconto', Number(e.target.value))}
                                                                        className="w-16 bg-gray-900/50 border-gray-700/50 text-white text-center text-sm h-6"
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="text-right text-white font-bold text-sm">
                                                                    {formatarMoeda(item.subtotal)}
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => removerItem(index)}
                                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-6 w-6 p-0"
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Painel Direito - Resumo e Configurações */}
                            <div className="space-y-6">
                                {/* Resumo Financeiro */}
                                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-white text-sm font-medium">Resumo da Venda</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400 text-sm">Subtotal:</span>
                                                <span className="text-white font-medium">{formatarMoeda(calcularSubtotal())}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400 text-sm">Desconto Geral:</span>
                                                <div className="flex items-center gap-1">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={descontoGeral}
                                                        onChange={e => setDescontoGeral(Number(e.target.value))}
                                                        className="w-16 bg-gray-900/50 border-gray-700/50 text-white text-center text-xs h-6"
                                                    />
                                                    <span className="text-gray-400 text-xs">%</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400 text-sm">Valor Desconto:</span>
                                                <span className="text-emerald-400 text-sm">{formatarMoeda(calcularDescontoValor())}</span>
                                            </div>
                                            <Separator className="bg-gray-800/50" />
                                            <div className="flex justify-between items-center">
                                                <span className="text-white font-bold">TOTAL:</span>
                                                <span className="text-2xl font-bold text-emerald-400">{formatarMoeda(calcularTotal())}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Retorno e Observações */}
                                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-white text-sm font-medium">Programar Retorno</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="space-y-2">
                                            <Label className="text-white text-xs">Data do Retorno</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500" />
                                                <Input
                                                    type="date"
                                                    value={dataRetorno}
                                                    onChange={e => setDataRetorno(e.target.value)}
                                                    className="pl-9 bg-gray-900/50 border-gray-700/50 text-white text-xs h-8"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-white text-xs">Motivo do Retorno</Label>
                                            <Input
                                                value={motivoRetorno}
                                                onChange={e => setMotivoRetorno(e.target.value)}
                                                placeholder="Revacinação, reavaliação, etc."
                                                className="bg-gray-900/50 border-gray-700/50 text-white text-xs h-8"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Observações da Consulta */}
                                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-white text-sm font-medium">Observações</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Textarea
                                            value={observacoes}
                                            onChange={e => setObservacoes(e.target.value)}
                                            placeholder="Anotações sobre a consulta, exames, prescrições..."
                                            className="bg-gray-900/50 border-gray-700/50 text-white text-sm min-h-[100px]"
                                            rows={4}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Navegação */}
                                <div className="space-y-2">
                                    <Button
                                        onClick={() => setAbaAtiva('animal')}
                                        variant="outline"
                                        className="w-full border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Voltar para Animal
                                    </Button>
                                    <Button
                                        onClick={() => setAbaAtiva('pagamento')}
                                        disabled={itens.length === 0}
                                        className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                        Prosseguir para Pagamento
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Nota Fiscal - Opcional */}
                        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-sm font-medium">Emissão de Nota Fiscal</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="emitir-nf"
                                            checked={emiteNotaFiscal}
                                            onChange={e => setEmiteNotaFiscal(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-red-600 focus:ring-red-600"
                                        />
                                        <Label htmlFor="emitir-nf" className="text-white text-sm cursor-pointer">
                                            Emitir Nota Fiscal
                                        </Label>
                                    </div>

                                    {emiteNotaFiscal && (
                                        <div className="flex-1 grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-white text-xs">NCM</Label>
                                                <Input
                                                    value={ncm}
                                                    onChange={e => setNcm(e.target.value)}
                                                    placeholder="Código NCM"
                                                    className="bg-gray-900/50 border-gray-700/50 text-white text-sm h-8"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-white text-xs">Alíquota (%)</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={tributacao.aliquota}
                                                    onChange={e => setTributacao({ ...tributacao, aliquota: Number(e.target.value) })}
                                                    className="bg-gray-900/50 border-gray-700/50 text-white text-sm h-8"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-white text-xs">Subst. Trib. (%)</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={tributacao.substituicao}
                                                    onChange={e => setTributacao({ ...tributacao, substituicao: Number(e.target.value) })}
                                                    className="bg-gray-900/50 border-gray-700/50 text-white text-sm h-8"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* TAB: PAGAMENTO */}
                {abaAtiva === 'pagamento' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Formas de Pagamento */}
                            <Card className="lg:col-span-2 bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-red-400" />
                                        Recebimento
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Informe os valores recebidos em cada forma de pagamento
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {/* Formas de Pagamento */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {formaPagamentoOptions.map((forma) => (
                                                <div
                                                    key={forma.value}
                                                    className={`p-4 rounded-lg border-2 transition-all ${formaPagamento === forma.value
                                                            ? `bg-gradient-to-br ${forma.color} border-${forma.textColor.split('text-')[1]}/50`
                                                            : 'bg-gray-900/50 border-gray-800/50'
                                                        }`}
                                                    onClick={() => setFormaPagamento(forma.value)}
                                                >
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className={`p-2 rounded-lg ${forma.color}`}>
                                                            <forma.icon className={`h-5 w-5 ${forma.textColor}`} />
                                                        </div>
                                                        <span className={`font-medium ${formaPagamento === forma.value ? 'text-white' : 'text-gray-400'
                                                            }`}>
                                                            {forma.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Campos de Valores */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-white text-sm">Dinheiro</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={valorPago.dinheiro}
                                                    onChange={e => setValorPago({ ...valorPago, dinheiro: Number(e.target.value) })}
                                                    className="bg-gray-900/50 border-gray-700/50 text-white text-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-white text-sm">Cheque</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={valorPago.cheque}
                                                    onChange={e => setValorPago({ ...valorPago, cheque: Number(e.target.value) })}
                                                    className="bg-gray-900/50 border-gray-700/50 text-white text-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-white text-sm">Cartão</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={valorPago.cartao}
                                                    onChange={e => setValorPago({ ...valorPago, cartao: Number(e.target.value) })}
                                                    className="bg-gray-900/50 border-gray-700/50 text-white text-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-white text-sm">Outros</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={valorPago.outros}
                                                    onChange={e => setValorPago({ ...valorPago, outros: Number(e.target.value) })}
                                                    className="bg-gray-900/50 border-gray-700/50 text-white text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Parcelamento */}
                                        {formaPagamento === 'parcelado' && (
                                            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-white text-sm font-medium">Configuração de Parcelas</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label className="text-white text-sm">Número de Parcelas</Label>
                                                            <Select value={parcelas.toString()} onValueChange={(value) => setParcelas(Number(value))}>
                                                                <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white text-sm">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-gray-900 border-gray-800">
                                                                    {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                                                                        <SelectItem key={num} value={num.toString()} className="text-sm">
                                                                            {num}x de {formatarMoeda(calcularTotal() / num)}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Resumo do Pagamento */}
                            <div className="space-y-6">
                                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-white text-sm font-medium">Resumo Financeiro</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400 text-sm">Subtotal:</span>
                                                <span className="text-white text-sm">{formatarMoeda(calcularSubtotal())}</span>
                                            </div>
                                            {descontoGeral > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400 text-sm">Desconto ({descontoGeral}%):</span>
                                                    <span className="text-emerald-400 text-sm">-{formatarMoeda(calcularDescontoValor())}</span>
                                                </div>
                                            )}
                                            <Separator className="bg-gray-800/50" />
                                            <div className="flex justify-between">
                                                <span className="text-white font-bold">TOTAL:</span>
                                                <span className="text-2xl font-bold text-emerald-400">{formatarMoeda(calcularTotal())}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-4 border-t border-gray-800/50">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400 text-sm">Total Pago:</span>
                                                <span className="text-white font-bold">{formatarMoeda(valorPago.dinheiro + valorPago.cheque + valorPago.cartao + valorPago.outros)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400 text-sm">Saldo Restante:</span>
                                                <span className={`font-bold ${calcularSaldoRestante() > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                                    {formatarMoeda(calcularSaldoRestante())}
                                                </span>
                                            </div>
                                            {calcularTroco() > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400 text-sm">Troco:</span>
                                                    <span className="text-amber-400 font-bold">{formatarMoeda(calcularTroco())}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Carta de Devedor */}
                                        {proprietario && calcularSaldoRestante() > 0 && (
                                            <div className="pt-4 border-t border-gray-800/50">
                                                <Button
                                                    variant="outline"
                                                    onClick={enviarCartaDevedor}
                                                    className="w-full border-red-600/50 text-red-400 hover:bg-red-600/20 text-sm"
                                                >
                                                    <Mail className="h-4 w-4 mr-2" />
                                                    Enviar Carta de Cobrança
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Navegação */}
                                <div className="space-y-2">
                                    <Button
                                        onClick={() => setAbaAtiva('itens')}
                                        variant="outline"
                                        className="w-full border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Voltar para Itens
                                    </Button>
                                    <Button
                                        onClick={() => setAbaAtiva('resumo')}
                                        className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                        Ver Resumo Final
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: RESUMO */}
                {abaAtiva === 'resumo' && (
                    <div className="space-y-6">
                        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <FileCheck className="h-5 w-5 text-red-400" />
                                    Finalizar Operação
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Revise todas as informações e finalize a operação
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Informações da Operação */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-white text-sm font-medium">Informações da Operação</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400 text-sm">Operação Nº:</span>
                                                        <span className="text-white font-mono">{operacaoNumero}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400 text-sm">Data/Hora:</span>
                                                        <span className="text-white">{new Date().toLocaleDateString('pt-BR')} {new Date().toLocaleTimeString('pt-BR')}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400 text-sm">Tipo:</span>
                                                        <Badge className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 text-xs">
                                                            {tipoConsultaOptions.find(t => t.value === tipoConsulta)?.label || 'Rotina'}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400 text-sm">Veterinário:</span>
                                                        <span className="text-white">{veterinario || 'Não informado'}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400 text-sm">Funcionário:</span>
                                                        <span className="text-white">
                                                            {funcionarios.find(f => f.id === funcionarioSelecionado)?.nome || 'Não selecionado'}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-white text-sm font-medium">Informações do Cliente</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400 text-sm">Animal:</span>
                                                        <span className="text-white font-medium">{animalSelecionado?.nomeAnimal}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400 text-sm">Proprietário:</span>
                                                        <span className="text-white">{proprietario?.nome || animalSelecionado?.nomeProprietario}</span>
                                                    </div>
                                                    {proprietario?.telefone && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400 text-sm">Telefone:</span>
                                                            <span className="text-white">{proprietario.telefone}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400 text-sm">Saldo Anterior:</span>
                                                        <span className={`font-bold ${saldoDevedor > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                                            {formatarMoeda(saldoDevedor)}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Lista de Itens */}
                                        <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-white text-sm font-medium">Itens da Operação</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {itens.map((item, index) => (
                                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-900/30 rounded">
                                                            <div className="flex items-center gap-3">
                                                                {item.tipo === 'servico' ? (
                                                                    <Briefcase className="h-4 w-4 text-emerald-400" />
                                                                ) : (
                                                                    <Package className="h-4 w-4 text-blue-400" />
                                                                )}
                                                                <div>
                                                                    <p className="text-white text-sm font-medium">{item.descricao}</p>
                                                                    <p className="text-xs text-gray-400">
                                                                        {item.quantidade}x {formatarMoeda(item.precoUnitario)} cada
                                                                        {item.desconto > 0 && ` • ${item.desconto}% desc.`}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <p className="text-white font-bold text-sm">{formatarMoeda(item.subtotal)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Observações e Retorno */}
                                        {(observacoes || dataRetorno) && (
                                            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-white text-sm font-medium">Observações e Retorno</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    {observacoes && (
                                                        <div className="space-y-1">
                                                            <p className="text-gray-400 text-xs">Observações:</p>
                                                            <p className="text-white text-sm bg-gray-900/30 p-2 rounded">{observacoes}</p>
                                                        </div>
                                                    )}
                                                    {dataRetorno && (
                                                        <div className="space-y-1">
                                                            <p className="text-gray-400 text-xs">Retorno Programado:</p>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-amber-400" />
                                                                <span className="text-white text-sm">{new Date(dataRetorno).toLocaleDateString('pt-BR')}</span>
                                                                {motivoRetorno && (
                                                                    <span className="text-gray-400 text-sm">• {motivoRetorno}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>

                                    {/* Resumo Final e Ações */}
                                    <div className="space-y-6">
                                        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-white text-sm font-medium">Resumo Financeiro Final</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400 text-sm">Subtotal:</span>
                                                        <span className="text-white text-sm">{formatarMoeda(calcularSubtotal())}</span>
                                                    </div>
                                                    {descontoGeral > 0 && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400 text-sm">Desconto Geral:</span>
                                                            <span className="text-emerald-400 text-sm">-{formatarMoeda(calcularDescontoValor())}</span>
                                                        </div>
                                                    )}
                                                    <Separator className="bg-gray-800/50" />
                                                    <div className="flex justify-between">
                                                        <span className="text-lg font-medium text-white">TOTAL:</span>
                                                        <span className="text-2xl font-bold text-emerald-400">{formatarMoeda(calcularTotal())}</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 pt-4 border-t border-gray-800/50">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400 text-sm">Forma de Pagamento:</span>
                                                        <Badge className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400 text-xs">
                                                            {formaPagamentoOptions.find(f => f.value === formaPagamento)?.label}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400 text-sm">Total Pago:</span>
                                                        <span className="text-white font-bold">{formatarMoeda(valorPago.dinheiro + valorPago.cheque + valorPago.cartao + valorPago.outros)}</span>
                                                    </div>
                                                    {calcularSaldoRestante() > 0 && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400 text-sm">Saldo Devedor:</span>
                                                            <span className="text-red-400 font-bold">{formatarMoeda(calcularSaldoRestante())}</span>
                                                        </div>
                                                    )}
                                                    {calcularTroco() > 0 && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400 text-sm">Troco:</span>
                                                            <span className="text-amber-400 font-bold">{formatarMoeda(calcularTroco())}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Ações Finais */}
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    variant="outline"
                                                    className="border-emerald-600/50 text-emerald-400 hover:bg-emerald-600/20"
                                                    onClick={imprimirRecibo}
                                                >
                                                    <Printer className="h-4 w-4 mr-2" />
                                                    Recibo
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="border-blue-600/50 text-blue-400 hover:bg-blue-600/20"
                                                    onClick={imprimirCupomFiscal}
                                                >
                                                    <Receipt className="h-4 w-4 mr-2" />
                                                    Cupom Fiscal
                                                </Button>
                                            </div>

                                            <div className="space-y-2">
                                                <Button
                                                    onClick={() => setAbaAtiva('pagamento')}
                                                    variant="outline"
                                                    className="w-full border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                                                >
                                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                                    Voltar para Pagamento
                                                </Button>
                                                <Button
                                                    onClick={async () => {
                                                        await baixarEstoque();
                                                        await salvarConsulta();
                                                    }}
                                                    className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    Finalizar e Baixar Operação
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NovaConsulta;