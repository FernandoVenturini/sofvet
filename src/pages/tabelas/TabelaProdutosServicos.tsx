import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { 
  Trash2, Edit, Search, Plus, Package, Settings, DollarSign, 
  ShoppingBag, Stethoscope, Sparkles, Filter, RefreshCw, TrendingUp,
  Activity, Zap, Tag, ChevronRight, Star
} from 'lucide-react';
import { toast } from 'sonner';

interface Produto {
    id: string;
    nome: string;
    tipo: 'servico' | 'produto';
    preco: number;
    createdAt?: string;
}

const TabelaProdutosServicos = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');
    const [filtroTipo, setFiltroTipo] = useState<'todos' | 'servico' | 'produto'>('todos');
    const [activeTab, setActiveTab] = useState('cadastrar');

    // Formulário
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState<'servico' | 'produto'>('servico');
    const [preco, setPreco] = useState('');

    // Edição
    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState('');
    const [editNome, setEditNome] = useState('');
    const [editTipo, setEditTipo] = useState<'servico' | 'produto'>('servico');
    const [editPreco, setEditPreco] = useState('');

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, 'produtos'));
            const lista = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    nome: data.nome || 'Sem nome',
                    tipo: data.tipo || 'servico',
                    preco: data.preco || 0,
                    createdAt: data.createdAt,
                };
            });
            setProdutos(lista);
        } catch (error) {
            console.error('Erro ao carregar:', error);
            toast.error('Erro ao carregar produtos e serviços');
        } finally {
            setLoading(false);
        }
    };

    const salvarProduto = async () => {
        if (!nome.trim()) {
            toast.error('Digite um nome para o item');
            return;
        }

        if (!preco || Number(preco) <= 0) {
            toast.error('Digite um preço válido');
            return;
        }

        try {
            await addDoc(collection(db, 'produtos'), {
                nome: nome.trim(),
                tipo,
                preco: Number(preco),
                createdAt: new Date().toISOString(),
            });
            
            setNome('');
            setPreco('');
            setTipo('servico');
            
            toast.success('Item cadastrado com sucesso!');
            carregarProdutos();
            setActiveTab('listar');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            toast.error('Erro ao salvar item');
        }
    };

    const abrirEdicao = (p: Produto) => {
        setEditId(p.id);
        setEditNome(p.nome);
        setEditTipo(p.tipo);
        setEditPreco(p.preco.toString());
        setEditOpen(true);
    };

    const salvarEdicao = async () => {
        if (!editNome.trim()) {
            toast.error('Digite um nome para o item');
            return;
        }

        if (!editPreco || Number(editPreco) <= 0) {
            toast.error('Digite um preço válido');
            return;
        }

        try {
            await updateDoc(doc(db, 'produtos', editId), {
                nome: editNome.trim(),
                tipo: editTipo,
                preco: Number(editPreco),
                updatedAt: new Date().toISOString(),
            });
            
            setEditOpen(false);
            toast.success('Item atualizado com sucesso!');
            carregarProdutos();
        } catch (error) {
            console.error('Erro ao editar:', error);
            toast.error('Erro ao atualizar item');
        }
    };

    const excluir = async (id: string, nome: string) => {
        if (!confirm(`Tem certeza que deseja excluir "${nome}"?`)) return;
        
        try {
            await deleteDoc(doc(db, 'produtos', id));
            toast.success('Item excluído com sucesso!');
            carregarProdutos();
        } catch (error) {
            console.error('Erro ao excluir:', error);
            toast.error('Erro ao excluir item');
        }
    };

    const resetarFormulario = () => {
        setNome('');
        setPreco('');
        setTipo('servico');
    };

    const produtosFiltrados = produtos.filter(p => {
        const matchesSearch = p.nome.toLowerCase().includes(busca.toLowerCase());
        const matchesType = filtroTipo === 'todos' || p.tipo === filtroTipo;
        return matchesSearch && matchesType;
    });

    const estatisticas = {
        total: produtos.length,
        servicos: produtos.filter(p => p.tipo === 'servico').length,
        produtos: produtos.filter(p => p.tipo === 'produto').length,
        valorTotalServicos: produtos.filter(p => p.tipo === 'servico').reduce((acc, p) => acc + p.preco, 0),
        valorTotalProdutos: produtos.filter(p => p.tipo === 'produto').reduce((acc, p) => acc + p.preco, 0),
        mediaPreco: produtos.length > 0 ? 
            produtos.reduce((acc, p) => acc + p.preco, 0) / produtos.length : 0,
        maisCaro: produtos.length > 0 ? 
            Math.max(...produtos.map(p => p.preco)) : 0,
    };

    const preencherExemplos = async () => {
        try {
            const exemplos = [
                { nome: 'Consulta Geral', tipo: 'servico' as const, preco: 120.00 },
                { nome: 'Vacina V10', tipo: 'produto' as const, preco: 80.00 },
                { nome: 'Banho e Tosa', tipo: 'servico' as const, preco: 60.00 },
                { nome: 'Cirurgia Castração', tipo: 'servico' as const, preco: 350.00 },
                { nome: 'Ração Premium 15kg', tipo: 'produto' as const, preco: 180.00 },
                { nome: 'Exame de Sangue', tipo: 'servico' as const, preco: 95.00 },
                { nome: 'Antipulgas', tipo: 'produto' as const, preco: 45.00 },
                { nome: 'Raio-X', tipo: 'servico' as const, preco: 150.00 },
            ];

            for (const exemplo of exemplos) {
                await addDoc(collection(db, 'produtos'), {
                    ...exemplo,
                    createdAt: new Date().toISOString(),
                });
            }

            toast.success('Exemplos adicionados com sucesso!');
            carregarProdutos();
        } catch (error) {
            console.error('Erro ao preencher exemplos:', error);
            toast.error('Erro ao adicionar exemplos');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <p className="text-gray-400">Carregando produtos e serviços...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30">
                            <ShoppingBag className="h-6 w-6 text-red-400" />
                        </div>
                        <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 border border-red-500/30">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Catálogo de Produtos e Serviços
                        </Badge>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">
                        Produtos e Serviços
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Gerencie o catálogo de produtos e serviços da clínica
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total de Itens</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-white">{estatisticas.total}</p>
                                <p className="text-sm text-gray-400">Itens cadastrados</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                                <Package className="h-5 w-5 text-red-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Serviços</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-blue-400">{estatisticas.servicos}</p>
                                <p className="text-sm text-gray-400">Serviços cadastrados</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
                                <Stethoscope className="h-5 w-5 text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Produtos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-purple-400">{estatisticas.produtos}</p>
                                <p className="text-sm text-gray-400">Produtos cadastrados</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                                <ShoppingBag className="h-5 w-5 text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Média de Preço</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-emerald-400">
                                    R$ {estatisticas.mediaPreco.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-400">Valor médio</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20">
                                <TrendingUp className="h-5 w-5 text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros e Busca */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Buscar por nome do item..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="pl-10 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Select value={filtroTipo} onValueChange={(v: 'todos' | 'servico' | 'produto') => setFiltroTipo(v)}>
                                <SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-700/50 text-white">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        <SelectValue placeholder="Filtrar por tipo" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-800">
                                    <SelectItem value="todos">Todos os tipos</SelectItem>
                                    <SelectItem value="servico">Apenas serviços</SelectItem>
                                    <SelectItem value="produto">Apenas produtos</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={carregarProdutos}
                                className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50 p-1">
                    <TabsTrigger value="cadastrar" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                        <Plus className="h-4 w-4 mr-2" />
                        Cadastrar Item
                    </TabsTrigger>
                    <TabsTrigger value="listar" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                        <Package className="h-4 w-4 mr-2" />
                        Listar Itens
                    </TabsTrigger>
                    <TabsTrigger value="exemplos" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                        <Star className="h-4 w-4 mr-2" />
                        Exemplos
                    </TabsTrigger>
                </TabsList>

                {/* Tab: Cadastrar */}
                <TabsContent value="cadastrar" className="mt-6">
                    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Plus className="h-5 w-5 text-red-400" />
                                Cadastrar Novo Item
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Adicione novos produtos ou serviços ao catálogo
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-white flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-red-400" />
                                        Nome do Item *
                                    </Label>
                                    <Input
                                        value={nome}
                                        onChange={e => setNome(e.target.value)}
                                        placeholder="Ex: Consulta Geral, Vacina V10, Ração Premium..."
                                        className="bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-white flex items-center gap-2">
                                        <Settings className="h-4 w-4 text-blue-400" />
                                        Tipo *
                                    </Label>
                                    <div className="flex gap-4 p-2 rounded-lg bg-gray-900/30 border border-gray-700/50">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <div className={`w-4 h-4 rounded-full border-2 ${tipo === 'servico' ? 'border-blue-500' : 'border-gray-600'}`}>
                                                {tipo === 'servico' && <div className="w-2 h-2 bg-blue-500 rounded-full m-auto"></div>}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Stethoscope className="h-4 w-4 text-blue-400" />
                                                <span className={`${tipo === 'servico' ? 'text-blue-400' : 'text-gray-400'}`}>
                                                    Serviço
                                                </span>
                                            </div>
                                            <input
                                                type="radio"
                                                value="servico"
                                                checked={tipo === 'servico'}
                                                onChange={() => setTipo('servico')}
                                                className="sr-only"
                                            />
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <div className={`w-4 h-4 rounded-full border-2 ${tipo === 'produto' ? 'border-purple-500' : 'border-gray-600'}`}>
                                                {tipo === 'produto' && <div className="w-2 h-2 bg-purple-500 rounded-full m-auto"></div>}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-purple-400" />
                                                <span className={`${tipo === 'produto' ? 'text-purple-400' : 'text-gray-400'}`}>
                                                    Produto
                                                </span>
                                            </div>
                                            <input
                                                type="radio"
                                                value="produto"
                                                checked={tipo === 'produto'}
                                                onChange={() => setTipo('produto')}
                                                className="sr-only"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-white flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-emerald-400" />
                                        Preço (R$) *
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={preco}
                                        onChange={e => setPreco(e.target.value)}
                                        placeholder="99.90"
                                        className="bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <Separator className="bg-gray-800/50" />

                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={resetarFormulario}
                                    className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Limpar
                                </Button>
                                <Button
                                    onClick={salvarProduto}
                                    className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                    disabled={!nome.trim() || !preco}
                                >
                                    <Plus className="h-4 w-4" />
                                    Cadastrar Item
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Listar */}
                <TabsContent value="listar" className="mt-6">
                    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-blue-400" />
                                    <span>Itens Cadastrados</span>
                                </div>
                                <div className="text-sm text-gray-400">
                                    Mostrando {produtosFiltrados.length} de {produtos.length} itens
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {produtos.length === 0 ? (
                                <div className="text-center py-12">
                                    <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg">Nenhum item cadastrado</p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Comece cadastrando seu primeiro item
                                    </p>
                                    <Button
                                        className="mt-4 gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                        onClick={() => setActiveTab('cadastrar')}
                                    >
                                        <Plus className="h-4 w-4" />
                                        Cadastrar Primeiro Item
                                    </Button>
                                </div>
                            ) : produtosFiltrados.length === 0 ? (
                                <div className="text-center py-12">
                                    <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg">Nenhum item encontrado</p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Tente ajustar os termos da busca ou os filtros
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-lg border border-gray-800/50">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-gray-800/50">
                                                <TableHead className="text-gray-400">Item</TableHead>
                                                <TableHead className="text-gray-400">Tipo</TableHead>
                                                <TableHead className="text-gray-400">Preço</TableHead>
                                                <TableHead className="text-gray-400">Categoria</TableHead>
                                                <TableHead className="text-gray-400 text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {produtosFiltrados.map(p => {
                                                const isServico = p.tipo === 'servico';
                                                return (
                                                    <TableRow key={p.id} className="border-gray-800/30 hover:bg-gray-800/20">
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2 rounded-lg ${isServico ? 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20' : 'bg-gradient-to-br from-purple-600/20 to-pink-600/20'}`}>
                                                                    {isServico ? 
                                                                        <Stethoscope className="h-4 w-4 text-blue-400" /> : 
                                                                        <Package className="h-4 w-4 text-purple-400" />
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-white">{p.nome}</p>
                                                                    <p className="text-xs text-gray-500">ID: {p.id.substring(0, 8)}...</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className={`border ${isServico ? 'border-blue-500/30 text-blue-400' : 'border-purple-500/30 text-purple-400'}`}>
                                                                {isServico ? 'Serviço' : 'Produto'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <DollarSign className="h-4 w-4 text-emerald-400" />
                                                                <span className="font-medium text-white">R$ {p.preco.toFixed(2)}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={
                                                                p.preco > 100 
                                                                    ? "bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-400 border-amber-500/30"
                                                                    : "bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-400 border-emerald-500/30"
                                                            }>
                                                                {p.preco > 100 ? (
                                                                    <>
                                                                        <Zap className="h-3 w-3 mr-1" />
                                                                        Premium
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Activity className="h-3 w-3 mr-1" />
                                                                        Padrão
                                                                    </>
                                                                )}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => abrirEdicao(p)}
                                                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => excluir(p.id, p.nome)}
                                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Exemplos */}
                <TabsContent value="exemplos" className="mt-6">
                    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Star className="h-5 w-5 text-amber-400" />
                                Exemplos de Itens
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Adicione exemplos pré-definidos para iniciar seu catálogo
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 rounded-lg bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50">
                                <h3 className="text-lg font-semibold text-white mb-3">Exemplos disponíveis:</h3>
                                <ul className="space-y-2 text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <ChevronRight className="h-3 w-3 text-blue-400" />
                                        <span>Consulta Geral (Serviço) - R$ 120,00</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ChevronRight className="h-3 w-3 text-blue-400" />
                                        <span>Banho e Tosa (Serviço) - R$ 60,00</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ChevronRight className="h-3 w-3 text-blue-400" />
                                        <span>Vacina V10 (Produto) - R$ 80,00</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ChevronRight className="h-3 w-3 text-blue-400" />
                                        <span>Ração Premium 15kg (Produto) - R$ 180,00</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ChevronRight className="h-3 w-3 text-blue-400" />
                                        <span>Cirurgia Castração (Serviço) - R$ 350,00</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/30">
                                <div className="flex items-center gap-3">
                                    <Star className="h-5 w-5 text-amber-400" />
                                    <div>
                                        <p className="font-medium text-white">Adicionar exemplos ao catálogo</p>
                                        <p className="text-sm text-amber-400/80">
                                            Isso adicionará 8 itens de exemplo (4 serviços e 4 produtos)
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={preencherExemplos}
                                    className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                                >
                                    <Star className="h-4 w-4" />
                                    Adicionar Exemplos
                                </Button>
                            </div>

                            <Separator className="bg-gray-800/50" />

                            <div className="text-sm text-gray-400">
                                <p className="mb-2">💡 Dicas para seu catálogo:</p>
                                <ul className="space-y-1 ml-4">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                        <span>Organize os serviços por categoria (consultas, cirurgias, exames)</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                        <span>Inclua tanto produtos físicos quanto serviços</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                        <span>Atualize os preços regularmente</span>
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modal de Edição */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5 text-blue-400" />
                            Editar Item
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-white">Nome do Item</Label>
                            <Input 
                                value={editNome} 
                                onChange={e => setEditNome(e.target.value)} 
                                className="bg-gray-900/50 border-gray-700/50 text-white" 
                                placeholder="Nome do item"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-white">Tipo</Label>
                            <div className="flex gap-4 p-2 rounded-lg bg-gray-900/30 border border-gray-700/50">
                                <label className="flex items-center gap-2 cursor-pointer flex-1">
                                    <div className={`w-4 h-4 rounded-full border-2 ${editTipo === 'servico' ? 'border-blue-500' : 'border-gray-600'}`}>
                                        {editTipo === 'servico' && <div className="w-2 h-2 bg-blue-500 rounded-full m-auto"></div>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Stethoscope className="h-4 w-4 text-blue-400" />
                                        <span className={`${editTipo === 'servico' ? 'text-blue-400' : 'text-gray-400'}`}>
                                            Serviço
                                        </span>
                                    </div>
                                    <input
                                        type="radio"
                                        value="servico"
                                        checked={editTipo === 'servico'}
                                        onChange={() => setEditTipo('servico')}
                                        className="sr-only"
                                    />
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer flex-1">
                                    <div className={`w-4 h-4 rounded-full border-2 ${editTipo === 'produto' ? 'border-purple-500' : 'border-gray-600'}`}>
                                        {editTipo === 'produto' && <div className="w-2 h-2 bg-purple-500 rounded-full m-auto"></div>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-purple-400" />
                                        <span className={`${editTipo === 'produto' ? 'text-purple-400' : 'text-gray-400'}`}>
                                            Produto
                                        </span>
                                    </div>
                                    <input
                                        type="radio"
                                        value="produto"
                                        checked={editTipo === 'produto'}
                                        onChange={() => setEditTipo('produto')}
                                        className="sr-only"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white">Preço (R$)</Label>
                            <Input 
                                type="number" 
                                step="0.01" 
                                min="0.01"
                                value={editPreco} 
                                onChange={e => setEditPreco(e.target.value)} 
                                className="bg-gray-900/50 border-gray-700/50 text-white" 
                                placeholder="99.90"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setEditOpen(false)}
                            className="border-gray-700 text-gray-400 hover:text-white"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={salvarEdicao} 
                            className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                        >
                            <Edit className="h-4 w-4" />
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TabelaProdutosServicos;