'use client';

import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
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
    Percent
} from 'lucide-react';

const NovaConsulta = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Estados principais
    const [animais, setAnimais] = useState<any[]>([]);
    const [produtos, setProdutos] = useState<any[]>([]);
    const [servicos, setServicos] = useState<any[]>([]);
    const [buscaAnimal, setBuscaAnimal] = useState('');
    const [animalSelecionado, setAnimalSelecionado] = useState<any>(null);
    const [itens, setItens] = useState<Array<{
        id: string;
        tipo: 'produto' | 'servico';
        nome: string;
        quantidade: number;
        preco: number;
        desconto: number;
        subtotal: number;
    }>>([]);
    const [itemSelecionado, setItemSelecionado] = useState('');
    const [tipoItem, setTipoItem] = useState<'produto' | 'servico'>('produto');
    const [quantidade, setQuantidade] = useState(1);
    const [formaPagamento, setFormaPagamento] = useState('dinheiro');
    const [parcelas, setParcelas] = useState(1);
    const [observacoes, setObservacoes] = useState('');
    const [veterinario, setVeterinario] = useState('');
    const [tipoConsulta, setTipoConsulta] = useState('rotina');
    const [abaAtiva, setAbaAtiva] = useState<'animal' | 'itens' | 'pagamento' | 'resumo'>('animal');
    const [descontoGeral, setDescontoGeral] = useState(0);
    const [acrescimoGeral, setAcrescimoGeral] = useState(0);

    // Opções para selects
    const formaPagamentoOptions = [
        { value: 'dinheiro', label: 'Dinheiro', icon: DollarSign, color: 'from-emerald-600/20 to-green-600/20', textColor: 'text-emerald-400' },
        { value: 'cartao_debito', label: 'Cartão Débito', icon: CreditCard, color: 'from-blue-600/20 to-cyan-600/20', textColor: 'text-blue-400' },
        { value: 'cartao_credito', label: 'Cartão Crédito', icon: CreditCard, color: 'from-purple-600/20 to-pink-600/20', textColor: 'text-purple-400' },
        { value: 'pix', label: 'PIX', icon: Zap, color: 'from-amber-600/20 to-orange-600/20', textColor: 'text-amber-400' },
        { value: 'parcelado', label: 'Parcelado', icon: Calendar, color: 'from-red-600/20 to-pink-600/20', textColor: 'text-red-400' },
    ];

    const tipoConsultaOptions = [
        { value: 'rotina', label: 'Rotina', icon: Stethoscope, color: 'from-blue-600/20 to-cyan-600/20', textColor: 'text-blue-400' },
        { value: 'emergencia', label: 'Emergência', icon: AlertTriangle, color: 'from-red-600/20 to-pink-600/20', textColor: 'text-red-400' },
        { value: 'cirurgia', label: 'Cirurgia', icon: Scissors, color: 'from-purple-600/20 to-pink-600/20', textColor: 'text-purple-400' },
        { value: 'vacina', label: 'Vacinação', icon: Syringe, color: 'from-emerald-600/20 to-green-600/20', textColor: 'text-emerald-400' },
        { value: 'exame', label: 'Exame', icon: FlaskConical, color: 'from-amber-600/20 to-orange-600/20', textColor: 'text-amber-400' },
    ];

    useEffect(() => {
        const carregarDados = async () => {
            // Carregar animais do usuário
            const animaisSnap = await getDocs(query(collection(db, 'animais'), where('userId', '==', user?.uid)));
            setAnimais(animaisSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            // Carregar produtos
            const produtosSnap = await getDocs(collection(db, 'produtos'));
            setProdutos(produtosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            // Carregar serviços (se existir coleção)
            const servicosSnap = await getDocs(collection(db, 'servicos'));
            setServicos(servicosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        if (user) carregarDados();
    }, [user]);

    const animaisFiltrados = animais.filter(a =>
        a.nomeAnimal?.toLowerCase().includes(buscaAnimal.toLowerCase()) ||
        a.nomeProprietario?.toLowerCase().includes(buscaAnimal.toLowerCase()) ||
        a.raca?.toLowerCase().includes(buscaAnimal.toLowerCase())
    );

    const adicionarItem = () => {
        if (!itemSelecionado) return;
        
        let item;
        if (tipoItem === 'produto') {
            item = produtos.find(p => p.id === itemSelecionado);
        } else {
            item = servicos.find(s => s.id === itemSelecionado);
        }
        
        if (!item) return;

        const subtotal = item.preco * quantidade;

        setItens([...itens, {
            id: item.id,
            tipo: tipoItem,
            nome: item.nome,
            quantidade,
            preco: item.preco,
            desconto: 0,
            subtotal
        }]);
        
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
        
        // Recalcular subtotal se quantidade, preco ou desconto mudar
        if (campo === 'quantidade' || campo === 'preco' || campo === 'desconto') {
            const item = novosItens[index];
            const descontoDecimal = item.desconto / 100;
            novosItens[index].subtotal = item.quantidade * item.preco * (1 - descontoDecimal);
        }
        
        setItens(novosItens);
    };

    const calcularSubtotal = () => {
        return itens.reduce((sum, item) => sum + item.subtotal, 0);
    };

    const calcularTotal = () => {
        const subtotal = calcularSubtotal();
        const descontoValor = subtotal * (descontoGeral / 100);
        const acrescimoValor = subtotal * (acrescimoGeral / 100);
        return subtotal - descontoValor + acrescimoValor;
    };

    const salvarConsulta = async () => {
        if (!animalSelecionado || itens.length === 0) {
            alert('Selecione um animal e adicione itens à consulta');
            return;
        }

        try {
            await addDoc(collection(db, 'consultas'), {
                animalId: animalSelecionado.id,
                animalNome: animalSelecionado.nomeAnimal,
                proprietarioNome: animalSelecionado.nomeProprietario,
                itens,
                subtotal: calcularSubtotal(),
                desconto: descontoGeral,
                acrescimo: acrescimoGeral,
                total: calcularTotal(),
                formaPagamento,
                parcelas,
                observacoes,
                veterinario,
                tipoConsulta,
                data: new Date().toISOString(),
                dataFormatada: new Date().toLocaleDateString('pt-BR'),
                hora: new Date().toLocaleTimeString('pt-BR'),
                userId: user?.uid,
                createdAt: serverTimestamp(),
                status: 'finalizada'
            });

            alert('Consulta salva com sucesso!');
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
        setItens([]);
        setBuscaAnimal('');
        setObservacoes('');
        setDescontoGeral(0);
        setAcrescimoGeral(0);
        setAbaAtiva('animal');
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
                            Nova Consulta
                        </Badge>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">
                        Registrar Nova Consulta
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Registre uma nova consulta ou procedimento veterinário
                    </p>
                </div>
                <div className="flex items-center gap-3">
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
                        Limpar Tudo
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
                                <FileText className="h-4 w-4 mr-2" />
                                4. Resumo
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Conteúdo das Tabs */}
            <div className="space-y-6">
                {/* TAB: ANIMAL */}
                {abaAtiva === 'animal' && (
                    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <PawPrint className="h-5 w-5 text-red-400" />
                                Selecionar Animal
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Busque o animal pelo nome, proprietário ou raça
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <Label className="text-white">Buscar Animal</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            placeholder="Digite nome do animal, proprietário ou raça..."
                                            value={buscaAnimal}
                                            onChange={e => setBuscaAnimal(e.target.value)}
                                            className="pl-10 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                        />
                                    </div>

                                    {buscaAnimal && animaisFiltrados.length > 0 && (
                                        <ScrollArea className="h-60 rounded-lg border border-gray-800/50">
                                            <div className="p-2">
                                                {animaisFiltrados.map(animal => (
                                                    <div
                                                        key={animal.id}
                                                        className={`p-4 rounded-lg mb-2 cursor-pointer transition-all ${
                                                            animalSelecionado?.id === animal.id
                                                                ? 'bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30'
                                                                : 'bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800/30'
                                                        }`}
                                                        onClick={() => setAnimalSelecionado(animal)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <PawPrint className="h-4 w-4 text-blue-400" />
                                                                    <p className="font-medium text-white">{animal.nomeAnimal}</p>
                                                                    <Badge className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30">
                                                                        {animal.especie || 'Não informado'}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <User className="h-3 w-3 text-gray-400" />
                                                                    <span className="text-gray-400">Proprietário:</span>
                                                                    <span className="text-white">{animal.nomeProprietario}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <Tag className="h-3 w-3 text-gray-400" />
                                                                    <span className="text-gray-400">Raça:</span>
                                                                    <span className="text-white">{animal.raca || 'Não informado'}</span>
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    )}

                                    {buscaAnimal && animaisFiltrados.length === 0 && (
                                        <div className="text-center py-8 border border-dashed border-gray-800/50 rounded-lg">
                                            <PawPrint className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                            <p className="text-gray-400">Nenhum animal encontrado</p>
                                            <p className="text-gray-500 text-sm mt-2">
                                                Tente buscar com outros termos
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {animalSelecionado && (
                                    <div className="p-6 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                                                    <PawPrint className="h-6 w-6 text-red-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">{animalSelecionado.nomeAnimal}</h3>
                                                    <p className="text-gray-400">Animal selecionado para atendimento</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setAnimalSelecionado(null)}
                                                className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Trocar Animal
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-400">Proprietário</span>
                                                </div>
                                                <p className="text-lg font-medium text-white">{animalSelecionado.nomeProprietario}</p>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-400">Espécie/Raça</span>
                                                </div>
                                                <p className="text-lg font-medium text-white">
                                                    {animalSelecionado.especie || 'Não informado'} / {animalSelecionado.raca || 'Não informado'}
                                                </p>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-400">Data Nascimento</span>
                                                </div>
                                                <p className="text-lg font-medium text-white">
                                                    {animalSelecionado.dataNascimento ? new Date(animalSelecionado.dataNascimento).toLocaleDateString('pt-BR') : 'Não informado'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-gray-800/50">
                                            <div className="flex justify-end">
                                                <Button
                                                    onClick={() => setAbaAtiva('itens')}
                                                    className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                                >
                                                    Prosseguir para Itens
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* TAB: ITENS */}
                {abaAtiva === 'itens' && (
                    <>
                        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5 text-red-400" />
                                    Adicionar Itens
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Selecione produtos e serviços para a consulta
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Formulário para adicionar item */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-3">
                                                <Label className="text-white">Tipo de Item</Label>
                                                <Select value={tipoItem} onValueChange={(value: any) => setTipoItem(value)}>
                                                    <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-900 border-gray-800">
                                                        <SelectItem value="produto">
                                                            <div className="flex items-center gap-2">
                                                                <Package className="h-4 w-4 text-blue-400" />
                                                                Produto
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="servico">
                                                            <div className="flex items-center gap-2">
                                                                <Briefcase className="h-4 w-4 text-emerald-400" />
                                                                Serviço
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-white">Item</Label>
                                                <Select value={itemSelecionado} onValueChange={setItemSelecionado}>
                                                    <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                                        <SelectValue placeholder="Selecione um item" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-900 border-gray-800 max-h-60">
                                                        {(tipoItem === 'produto' ? produtos : servicos).map(item => (
                                                            <SelectItem key={item.id} value={item.id}>
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        {tipoItem === 'produto' ? (
                                                                            <Package className="h-4 w-4 text-blue-400" />
                                                                        ) : (
                                                                            <Briefcase className="h-4 w-4 text-emerald-400" />
                                                                        )}
                                                                        <span>{item.nome}</span>
                                                                    </div>
                                                                    <Badge className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 text-gray-300">
                                                                        {formatarMoeda(item.preco)}
                                                                    </Badge>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-white">Quantidade</Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={quantidade}
                                                    onChange={e => setQuantidade(Number(e.target.value))}
                                                    className="bg-gray-900/50 border-gray-700/50 text-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={adicionarItem}
                                                disabled={!itemSelecionado}
                                                className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 flex-1"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Adicionar Item
                                            </Button>
                                        </div>

                                        {/* Tabela de Itens */}
                                        {itens.length > 0 && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-lg font-semibold text-white">Itens Adicionados</h4>
                                                    <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400 border border-red-500/30">
                                                        {itens.length} item{itens.length !== 1 ? 's' : ''}
                                                    </Badge>
                                                </div>
                                                <div className="overflow-x-auto rounded-lg border border-gray-800/50">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="border-gray-800/50">
                                                                <TableHead className="text-gray-400">Item</TableHead>
                                                                <TableHead className="text-gray-400">Tipo</TableHead>
                                                                <TableHead className="text-gray-400">Qtd</TableHead>
                                                                <TableHead className="text-gray-400">Preço Unit.</TableHead>
                                                                <TableHead className="text-gray-400">Desconto %</TableHead>
                                                                <TableHead className="text-gray-400">Subtotal</TableHead>
                                                                <TableHead className="text-gray-400 text-right">Ações</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {itens.map((item, index) => (
                                                                <TableRow key={index} className="border-gray-800/30 hover:bg-gray-800/20">
                                                                    <TableCell className="text-white font-medium">{item.nome}</TableCell>
                                                                    <TableCell>
                                                                        <Badge className={`bg-gradient-to-r border ${
                                                                            item.tipo === 'produto'
                                                                                ? 'from-blue-600/20 to-cyan-600/20 text-blue-400'
                                                                                : 'from-emerald-600/20 to-green-600/20 text-emerald-400'
                                                                        } border-gray-700`}>
                                                                            {item.tipo === 'produto' ? 'Produto' : 'Serviço'}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Input
                                                                            type="number"
                                                                            min="1"
                                                                            value={item.quantidade}
                                                                            onChange={e => atualizarItem(index, 'quantidade', Number(e.target.value))}
                                                                            className="w-20 bg-gray-900/50 border-gray-700/50 text-white"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Input
                                                                            type="number"
                                                                            step="0.01"
                                                                            value={item.preco}
                                                                            onChange={e => atualizarItem(index, 'preco', Number(e.target.value))}
                                                                            className="w-28 bg-gray-900/50 border-gray-700/50 text-white"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Input
                                                                            type="number"
                                                                            min="0"
                                                                            max="100"
                                                                            value={item.desconto}
                                                                            onChange={e => atualizarItem(index, 'desconto', Number(e.target.value))}
                                                                            className="w-20 bg-gray-900/50 border-gray-700/50 text-white"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell className="text-white font-bold">
                                                                        {formatarMoeda(item.subtotal)}
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => removerItem(index)}
                                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Resumo e Configurações */}
                                    <div className="space-y-6">
                                        <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-sm font-medium text-gray-400">Tipo de Consulta</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Select value={tipoConsulta} onValueChange={setTipoConsulta}>
                                                    <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-900 border-gray-800">
                                                        {tipoConsultaOptions.map((tipo) => (
                                                            <SelectItem key={tipo.value} value={tipo.value}>
                                                                <div className="flex items-center gap-2">
                                                                    <tipo.icon className={`h-4 w-4 ${tipo.textColor}`} />
                                                                    {tipo.label}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-sm font-medium text-gray-400">Veterinário</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Input
                                                    value={veterinario}
                                                    onChange={e => setVeterinario(e.target.value)}
                                                    placeholder="Nome do veterinário"
                                                    className="bg-gray-900/50 border-gray-700/50 text-white"
                                                />
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-sm font-medium text-gray-400">Observações</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Textarea
                                                    value={observacoes}
                                                    onChange={e => setObservacoes(e.target.value)}
                                                    placeholder="Anotações sobre a consulta..."
                                                    className="bg-gray-900/50 border-gray-700/50 text-white min-h-[120px]"
                                                    rows={4}
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card de Resumo Financeiro */}
                        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-400">Subtotal</p>
                                        <p className="text-2xl font-bold text-white">{formatarMoeda(calcularSubtotal())}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-400">Desconto Geral</p>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={descontoGeral}
                                                onChange={e => setDescontoGeral(Number(e.target.value))}
                                                className="w-24 bg-gray-900/50 border-gray-700/50 text-white"
                                            />
                                            <span className="text-gray-400">%</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-400">Acréscimo Geral</p>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                min="0"
                                                value={acrescimoGeral}
                                                onChange={e => setAcrescimoGeral(Number(e.target.value))}
                                                className="w-24 bg-gray-900/50 border-gray-700/50 text-white"
                                            />
                                            <span className="text-gray-400">%</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-400">Total</p>
                                        <p className="text-3xl font-bold text-emerald-400">{formatarMoeda(calcularTotal())}</p>
                                    </div>
                                </div>

                                <Separator className="my-6 bg-gray-800/50" />

                                <div className="flex justify-between items-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => setAbaAtiva('animal')}
                                        className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Voltar para Animal
                                    </Button>
                                    <Button
                                        onClick={() => setAbaAtiva('pagamento')}
                                        disabled={itens.length === 0}
                                        className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                    >
                                        Prosseguir para Pagamento
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* TAB: PAGAMENTO */}
                {abaAtiva === 'pagamento' && (
                    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-red-400" />
                                Forma de Pagamento
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Selecione a forma de pagamento para esta consulta
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {formaPagamentoOptions.map((forma) => (
                                            <button
                                                key={forma.value}
                                                onClick={() => setFormaPagamento(forma.value)}
                                                className={`p-4 rounded-lg border-2 transition-all ${
                                                    formaPagamento === forma.value
                                                        ? `bg-gradient-to-br ${forma.color} border-${forma.textColor.split('text-')[1]}/50`
                                                        : 'bg-gray-900/50 border-gray-800/50 hover:border-gray-700/50'
                                                }`}
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className={`p-2 rounded-lg ${forma.color}`}>
                                                        <forma.icon className={`h-5 w-5 ${forma.textColor}`} />
                                                    </div>
                                                    <span className={`font-medium ${
                                                        formaPagamento === forma.value ? 'text-white' : 'text-gray-400'
                                                    }`}>
                                                        {forma.label}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {formaPagamento === 'parcelado' && (
                                        <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-sm font-medium text-white">Configuração de Parcelas</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-white">Número de Parcelas</Label>
                                                        <Select value={parcelas.toString()} onValueChange={(value) => setParcelas(Number(value))}>
                                                            <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-gray-900 border-gray-800">
                                                                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                                                                    <SelectItem key={num} value={num.toString()}>
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

                                {/* Resumo do Pagamento */}
                                <div className="space-y-6">
                                    <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-sm font-medium text-gray-400">Resumo Financeiro</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Subtotal:</span>
                                                <span className="text-white">{formatarMoeda(calcularSubtotal())}</span>
                                            </div>
                                            {descontoGeral > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Desconto ({descontoGeral}%):</span>
                                                    <span className="text-emerald-400">-{formatarMoeda(calcularSubtotal() * (descontoGeral / 100))}</span>
                                                </div>
                                            )}
                                            {acrescimoGeral > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Acréscimo ({acrescimoGeral}%):</span>
                                                    <span className="text-red-400">+{formatarMoeda(calcularSubtotal() * (acrescimoGeral / 100))}</span>
                                                </div>
                                            )}
                                            <Separator className="bg-gray-800/50" />
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Total:</span>
                                                <span className="text-2xl font-bold text-emerald-400">{formatarMoeda(calcularTotal())}</span>
                                            </div>
                                            {formaPagamento === 'parcelado' && (
                                                <div className="pt-2 border-t border-gray-800/50">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Parcelas:</span>
                                                        <span className="text-white">{parcelas}x de {formatarMoeda(calcularTotal() / parcelas)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <div className="space-y-4">
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
                        </CardContent>
                    </Card>
                )}

                {/* TAB: RESUMO */}
                {abaAtiva === 'resumo' && (
                    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <FileText className="h-5 w-5 text-red-400" />
                                Resumo Final da Consulta
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Revise todas as informações antes de finalizar
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Informações do Animal e Consulta */}
                                <div className="lg:col-span-2 space-y-6">
                                    <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                        <CardHeader>
                                            <CardTitle className="text-white text-lg">Informações da Consulta</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-400">Animal</p>
                                                    <p className="text-white font-medium">{animalSelecionado?.nomeAnimal}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-400">Proprietário</p>
                                                    <p className="text-white font-medium">{animalSelecionado?.nomeProprietario}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-400">Tipo de Consulta</p>
                                                    <Badge className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30">
                                                        {tipoConsultaOptions.find(t => t.value === tipoConsulta)?.label || 'Rotina'}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-400">Veterinário</p>
                                                    <p className="text-white font-medium">{veterinario || 'Não informado'}</p>
                                                </div>
                                            </div>
                                            {observacoes && (
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-400">Observações</p>
                                                    <p className="text-white bg-gray-900/30 p-3 rounded">{observacoes}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Lista de Itens */}
                                    <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                        <CardHeader>
                                            <CardTitle className="text-white text-lg">Itens da Consulta</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {itens.map((item, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-900/30 rounded">
                                                        <div className="flex items-center gap-3">
                                                            {item.tipo === 'produto' ? (
                                                                <Package className="h-5 w-5 text-blue-400" />
                                                            ) : (
                                                                <Briefcase className="h-5 w-5 text-emerald-400" />
                                                            )}
                                                            <div>
                                                                <p className="text-white font-medium">{item.nome}</p>
                                                                <p className="text-sm text-gray-400">
                                                                    {item.quantidade}x {formatarMoeda(item.preco)} cada
                                                                    {item.desconto > 0 && ` • ${item.desconto}% desc.`}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className="text-white font-bold">{formatarMoeda(item.subtotal)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Resumo Financeiro Final */}
                                <div className="space-y-6">
                                    <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                        <CardHeader>
                                            <CardTitle className="text-white text-lg">Resumo Financeiro</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Subtotal</span>
                                                    <span className="text-white">{formatarMoeda(calcularSubtotal())}</span>
                                                </div>
                                                {descontoGeral > 0 && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Desconto Geral</span>
                                                        <span className="text-emerald-400">-{formatarMoeda(calcularSubtotal() * (descontoGeral / 100))}</span>
                                                    </div>
                                                )}
                                                {acrescimoGeral > 0 && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Acréscimo Geral</span>
                                                        <span className="text-red-400">+{formatarMoeda(calcularSubtotal() * (acrescimoGeral / 100))}</span>
                                                    </div>
                                                )}
                                                <Separator className="bg-gray-800/50" />
                                                <div className="flex justify-between">
                                                    <span className="text-lg font-medium text-white">Total</span>
                                                    <span className="text-2xl font-bold text-emerald-400">{formatarMoeda(calcularTotal())}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2 pt-4 border-t border-gray-800/50">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Forma de Pagamento</span>
                                                    <Badge className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400 border border-purple-500/30">
                                                        {formaPagamentoOptions.find(f => f.value === formaPagamento)?.label}
                                                    </Badge>
                                                </div>
                                                {formaPagamento === 'parcelado' && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Parcelas</span>
                                                        <span className="text-white">{parcelas}x de {formatarMoeda(calcularTotal() / parcelas)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="space-y-4">
                                        <Button
                                            onClick={() => setAbaAtiva('pagamento')}
                                            variant="outline"
                                            className="w-full border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Voltar para Pagamento
                                        </Button>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                variant="outline"
                                                className="border-emerald-600/50 text-emerald-400 hover:bg-emerald-600/20"
                                                onClick={() => {
                                                    // Lógica para impressão
                                                    window.print();
                                                }}
                                            >
                                                <Printer className="h-4 w-4 mr-2" />
                                                Imprimir
                                            </Button>
                                            <Button
                                                onClick={salvarConsulta}
                                                className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                Finalizar Consulta
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default NovaConsulta;