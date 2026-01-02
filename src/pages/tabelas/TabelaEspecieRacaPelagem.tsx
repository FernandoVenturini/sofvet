import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, Edit, Plus, Search, Filter, Dog, Cat, Bird, Rabbit, 
  Turtle, Users, Layers, Sparkles, ChevronRight, SparklesIcon
} from 'lucide-react';

interface Especie {
    id: string;
    nome: string;
}

interface Raca {
    id: string;
    nome: string;
    especieId: string;
}

interface Pelagem {
    id: string;
    nome: string;
    racaId: string;
}

// Dados reais pré-definidos (expandidos para mais raças e pelagens)
const DADOS_INICIAIS = {
    especies: [
        { nome: 'Canino', icon: Dog, color: 'text-blue-500' },
        { nome: 'Felino', icon: Cat, color: 'text-purple-500' },
        { nome: 'Ave', icon: Bird, color: 'text-yellow-500' },
        { nome: 'Roedor', icon: Rabbit, color: 'text-green-500' },
        { nome: 'Réptil', icon: Turtle, color: 'text-emerald-500' },
        { nome: 'Equino', icon: Users, color: 'text-red-500' },
        { nome: 'Coelho', icon: Rabbit, color: 'text-pink-500' },
        { nome: 'Exótico', icon: Users, color: 'text-gray-500' },
    ],
    racas: {
        Canino: [
            'Labrador Retriever', 'Golden Retriever', 'Pastor Alemão', 'Bulldog Francês', 'Poodle', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer', 'Dachshund', 'Shih Tzu', 'SRD',
            'Bulldog Inglês', 'Pit Bull', 'Border Collie', 'Chihuahua', 'Siberian Husky', 'Doberman', 'Maltês', 'Cocker Spaniel', 'Jack Russell Terrier'
        ],
        Felino: [
            'Persa', 'Siamês', 'Maine Coon', 'Sphynx', 'Ragdoll', 'British Shorthair', 'Abissínio', 'Bengal', 'SRD',
            'Scottish Fold', 'Birman', 'Norueguês da Floresta', 'Devon Rex', 'Burmese', 'Exótico de Pelo Curto'
        ],
        Ave: [
            'Calopsita', 'Papagaio', 'Agapornis', 'Canário', 'Periquito', 'Arara', 'Cacatua', 'Pardal', 'Pintassilgo', 'Mandarim'
        ],
        Roedor: [
            'Hamster', 'Porquinho da Índia', 'Chinchila', 'Gerbil', 'Rato', 'Camundongo', 'Coelho Anão'
        ],
        Réptil: [
            'Jabuti', 'Iguana', 'Serpente', 'Camaleão', 'Tartaruga', 'Lagarto', 'Cobra do Milho'
        ],
        Equino: [
            'Quarto de Milha', 'Puro Sangue Inglês', 'Mangalarga Marchador', 'Árabe', 'Appaloosa', 'Paint Horse'
        ],
        Coelho: [
            'Mini Lop', 'Holland Lop', 'Netherland Dwarf', 'Flemish Giant', 'Rex', 'Angorá'
        ],
        Exótico: [
            'Furão', 'Primata', 'Hedgehog', 'Sugar Glider', 'Axolotl', 'Outros'
        ]
    },
    pelagens: [
        'Curta', 'Longa', 'Média', 'Sem pelo', 'Ondulada', 'Fios duros', 'Cacheada', 'Densa', 'Rala', 'Macia', 'Áspera', 'Brilhante', 'Opaca'
    ],
};

const TabelaEspecieRacaPelagem = () => {
    const [especies, setEspecies] = useState<Especie[]>([]);
    const [racas, setRacas] = useState<Raca[]>([]);
    const [pelagens, setPelagens] = useState<Pelagem[]>([]);
    const [loading, setLoading] = useState(true);

    const [novaEspecie, setNovaEspecie] = useState('');
    const [especieSelecionada, setEspecieSelecionada] = useState('');
    const [novaRaca, setNovaRaca] = useState('');
    const [racaSelecionada, setRacaSelecionada] = useState('');
    const [novaPelagem, setNovaPelagem] = useState('');

    const [editOpen, setEditOpen] = useState(false);
    const [editTipo, setEditTipo] = useState<'especie' | 'raca' | 'pelagem'>('especie');
    const [editId, setEditId] = useState('');
    const [editNome, setEditNome] = useState('');

    const [activeTab, setActiveTab] = useState('especies');
    const [busca, setBusca] = useState('');

    const carregarDados = async () => {
        setLoading(true);
        try {
            const especiesSnap = await getDocs(collection(db, 'especies'));
            let listaEspecies = especiesSnap.docs.map(doc => ({ id: doc.id, nome: doc.data().nome } as Especie));
            setEspecies(listaEspecies);

            const racasSnap = await getDocs(collection(db, 'racas'));
            setRacas(racasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Raca)));

            const pelagensSnap = await getDocs(collection(db, 'pelagens'));
            setPelagens(pelagensSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pelagem)));
        } catch (error) {
            console.error('Erro:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const inicializarDados = async () => {
            const especiesSnap = await getDocs(collection(db, 'especies'));
            if (especiesSnap.empty) {
                const especieMap: { [key: string]: string } = {};
                for (const especie of DADOS_INICIAIS.especies) {
                    const docRef = await addDoc(collection(db, 'especies'), { nome: especie.nome });
                    especieMap[especie.nome] = docRef.id;
                }

                // Pré-cadastra raças
                for (const [especieNome, racasLista] of Object.entries(DADOS_INICIAIS.racas)) {
                    const especieId = especieMap[especieNome];
                    if (especieId) {
                        for (const racaNome of racasLista) {
                            await addDoc(collection(db, 'racas'), { nome: racaNome, especieId });
                        }
                    }
                }

                // Pré-cadastra pelagens (associadas a uma raça padrão, ex: Labrador para Canino)
                const racasSnap = await getDocs(collection(db, 'racas'));
                const labrador = racasSnap.docs.find(doc => doc.data().nome === 'Labrador Retriever');
                if (labrador) {
                    const labradorId = labrador.id;
                    for (const nome of DADOS_INICIAIS.pelagens) {
                        await addDoc(collection(db, 'pelagens'), { nome, racaId: labradorId });
                    }
                }
            }
            carregarDados();
        };

        inicializarDados();
    }, []);

    const adicionarEspecie = async () => {
        if (!novaEspecie.trim()) return;
        await addDoc(collection(db, 'especies'), { nome: novaEspecie.trim() });
        setNovaEspecie('');
        carregarDados();
    };

    const adicionarRaca = async () => {
        if (!novaRaca.trim() || !especieSelecionada) return;
        await addDoc(collection(db, 'racas'), { nome: novaRaca.trim(), especieId: especieSelecionada });
        setNovaRaca('');
        setEspecieSelecionada('');
        carregarDados();
    };

    const adicionarPelagem = async () => {
        if (!novaPelagem.trim() || !racaSelecionada) return;
        await addDoc(collection(db, 'pelagens'), { nome: novaPelagem.trim(), racaId: racaSelecionada });
        setNovaPelagem('');
        setRacaSelecionada('');
        carregarDados();
    };

    const abrirEdicao = (tipo: 'especie' | 'raca' | 'pelagem', id: string, nome: string) => {
        setEditTipo(tipo);
        setEditId(id);
        setEditNome(nome);
        setEditOpen(true);
    };

    const salvarEdicao = async () => {
        if (!editNome.trim()) return;
        const ref = doc(db, editTipo === 'especie' ? 'especies' : editTipo === 'raca' ? 'racas' : 'pelagens', editId);
        await updateDoc(ref, { nome: editNome.trim() });
        setEditOpen(false);
        carregarDados();
    };

    const excluir = async (tipo: 'especie' | 'raca' | 'pelagem', id: string) => {
        if (!confirm('Excluir permanentemente?')) return;
        const ref = doc(db, tipo === 'especie' ? 'especies' : tipo === 'raca' ? 'racas' : 'pelagens', id);
        await deleteDoc(ref);
        carregarDados();
    };

    // Filtrar dados baseado na busca
    const especiesFiltradas = especies.filter(e =>
        e.nome.toLowerCase().includes(busca.toLowerCase())
    );

    const racasFiltradas = racas.filter(r =>
        r.nome.toLowerCase().includes(busca.toLowerCase()) ||
        especies.find(e => e.id === r.especieId)?.nome.toLowerCase().includes(busca.toLowerCase())
    );

    const pelagensFiltradas = pelagens.filter(p =>
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        racas.find(r => r.id === p.racaId)?.nome.toLowerCase().includes(busca.toLowerCase())
    );

    const getEspecieNome = (especieId: string) => {
        return especies.find(e => e.id === especieId)?.nome || '—';
    };

    const getRacaNome = (racaId: string) => {
        return racas.find(r => r.id === racaId)?.nome || '—';
    };

    const getIconeEspecie = (nome: string) => {
        const especieData = DADOS_INICIAIS.especies.find(e => e.nome === nome);
        return especieData ? especieData.icon : Users;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
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
                            <Layers className="h-6 w-6 text-red-400" />
                        </div>
                        <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 border border-red-500/30">
                            <SparklesIcon className="h-3 w-3 mr-1" />
                            Catálogo de Características
                        </Badge>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">
                        Espécies, Raças e Pelagens
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Gerencie o catálogo de características dos pacientes
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total de Espécies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-white">{especies.length}</p>
                                <p className="text-sm text-gray-400">Tipos cadastrados</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                                <Dog className="h-5 w-5 text-red-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total de Raças</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-blue-400">{racas.length}</p>
                                <p className="text-sm text-gray-400">Raças cadastradas</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
                                <Layers className="h-5 w-5 text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total de Pelagens</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-purple-400">{pelagens.length}</p>
                                <p className="text-sm text-gray-400">Tipos de pelagem</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                                <SparklesIcon className="h-5 w-5 text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Dados Iniciais</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-emerald-400">Pronto</p>
                                <p className="text-sm text-gray-400">Catálogo carregado</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20">
                                <ChevronRight className="h-5 w-5 text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Buscar por nome..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="pl-10 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={activeTab === 'especies' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('especies')}
                                className={activeTab === 'especies' 
                                    ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' 
                                    : 'border-gray-700 text-gray-400 hover:text-white'}
                            >
                                Espécies
                            </Button>
                            <Button
                                variant={activeTab === 'racas' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('racas')}
                                className={activeTab === 'racas' 
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700' 
                                    : 'border-gray-700 text-gray-400 hover:text-white'}
                            >
                                Raças
                            </Button>
                            <Button
                                variant={activeTab === 'pelagens' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('pelagens')}
                                className={activeTab === 'pelagens' 
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                                    : 'border-gray-700 text-gray-400 hover:text-white'}
                            >
                                Pelagens
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Conteúdo */}
            <div className="space-y-6">
                {/* Tab: Espécies */}
                {activeTab === 'especies' && (
                    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Dog className="h-5 w-5 text-red-400" />
                                Espécies Cadastradas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Formulário de Adição */}
                            <div className="p-4 rounded-lg bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50">
                                <div className="flex gap-2">
                                    <Input 
                                        placeholder="Nova espécie" 
                                        value={novaEspecie} 
                                        onChange={e => setNovaEspecie(e.target.value)}
                                        className="bg-gray-900/50 border-gray-700/50 text-white"
                                    />
                                    <Button 
                                        onClick={adicionarEspecie} 
                                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Adicionar
                                    </Button>
                                </div>
                            </div>

                            {/* Tabela */}
                            <div className="rounded-lg border border-gray-800/50 overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gray-800/50">
                                            <TableHead className="text-gray-400">Espécie</TableHead>
                                            <TableHead className="text-gray-400">ID</TableHead>
                                            <TableHead className="text-gray-400 text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {especiesFiltradas.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-8 text-gray-400">
                                                    {busca ? 'Nenhuma espécie encontrada' : 'Nenhuma espécie cadastrada'}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            especiesFiltradas.map(e => {
                                                const Icon = getIconeEspecie(e.nome);
                                                const especieData = DADOS_INICIAIS.especies.find(d => d.nome === e.nome);
                                                return (
                                                    <TableRow key={e.id} className="border-gray-800/30 hover:bg-gray-800/20">
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2 rounded-lg ${especieData?.color} bg-gray-900/50`}>
                                                                    <Icon className="h-4 w-4" />
                                                                </div>
                                                                <span className="text-white font-medium">{e.nome}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-gray-400 text-sm font-mono">
                                                            {e.id.substring(0, 8)}...
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => abrirEdicao('especie', e.id, e.nome)}
                                                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => excluir('especie', e.id)}
                                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Tab: Raças */}
                {activeTab === 'racas' && (
                    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Layers className="h-5 w-5 text-blue-400" />
                                Raças Cadastradas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Formulário de Adição */}
                            <div className="p-4 rounded-lg bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-white text-sm">Espécie</Label>
                                        <Select value={especieSelecionada} onValueChange={setEspecieSelecionada}>
                                            <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                                <SelectValue placeholder="Selecione a espécie" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-900 border-gray-800">
                                                {especies.map(e => (
                                                    <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-white text-sm">Nova Raça</Label>
                                        <Input 
                                            placeholder="Nome da raça" 
                                            value={novaRaca} 
                                            onChange={e => setNovaRaca(e.target.value)}
                                            disabled={!especieSelecionada}
                                            className="bg-gray-900/50 border-gray-700/50 text-white"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button 
                                            onClick={adicionarRaca} 
                                            disabled={!especieSelecionada || !novaRaca.trim()}
                                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Adicionar
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Tabela */}
                            <div className="rounded-lg border border-gray-800/50 overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gray-800/50">
                                            <TableHead className="text-gray-400">Raça</TableHead>
                                            <TableHead className="text-gray-400">Espécie</TableHead>
                                            <TableHead className="text-gray-400 text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {racasFiltradas.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-8 text-gray-400">
                                                    {busca ? 'Nenhuma raça encontrada' : 'Nenhuma raça cadastrada'}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            racasFiltradas.map(r => {
                                                const especieNome = getEspecieNome(r.especieId);
                                                const especieData = DADOS_INICIAIS.especies.find(d => d.nome === especieNome);
                                                return (
                                                    <TableRow key={r.id} className="border-gray-800/30 hover:bg-gray-800/20">
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2 rounded-lg ${especieData?.color || 'text-gray-500'} bg-gray-900/50`}>
                                                                    <ChevronRight className="h-4 w-4" />
                                                                </div>
                                                                <span className="text-white font-medium">{r.nome}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="border-gray-700 text-gray-400">
                                                                {especieNome}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => abrirEdicao('raca', r.id, r.nome)}
                                                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => excluir('raca', r.id)}
                                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Tab: Pelagens */}
                {activeTab === 'pelagens' && (
                    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <SparklesIcon className="h-5 w-5 text-purple-400" />
                                Pelagens Cadastradas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Formulário de Adição */}
                            <div className="p-4 rounded-lg bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-white text-sm">Raça</Label>
                                        <Select value={racaSelecionada} onValueChange={setRacaSelecionada}>
                                            <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                                <SelectValue placeholder="Selecione a raça" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-900 border-gray-800">
                                                {racas.map(r => (
                                                    <SelectItem key={r.id} value={r.id}>
                                                        {r.nome} ({getEspecieNome(r.especieId)})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-white text-sm">Nova Pelagem</Label>
                                        <Input 
                                            placeholder="Tipo de pelagem" 
                                            value={novaPelagem} 
                                            onChange={e => setNovaPelagem(e.target.value)}
                                            disabled={!racaSelecionada}
                                            className="bg-gray-900/50 border-gray-700/50 text-white"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button 
                                            onClick={adicionarPelagem} 
                                            disabled={!racaSelecionada || !novaPelagem.trim()}
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Adicionar
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Tabela */}
                            <div className="rounded-lg border border-gray-800/50 overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gray-800/50">
                                            <TableHead className="text-gray-400">Pelagem</TableHead>
                                            <TableHead className="text-gray-400">Raça</TableHead>
                                            <TableHead className="text-gray-400">Espécie</TableHead>
                                            <TableHead className="text-gray-400 text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pelagensFiltradas.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                                                    {busca ? 'Nenhuma pelagem encontrada' : 'Nenhuma pelagem cadastrada'}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            pelagensFiltradas.map(p => {
                                                const racaNome = getRacaNome(p.racaId);
                                                const raca = racas.find(r => r.id === p.racaId);
                                                const especieNome = raca ? getEspecieNome(raca.especieId) : '—';
                                                return (
                                                    <TableRow key={p.id} className="border-gray-800/30 hover:bg-gray-800/20">
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 rounded-lg text-purple-500 bg-gray-900/50">
                                                                    <SparklesIcon className="h-4 w-4" />
                                                                </div>
                                                                <span className="text-white font-medium">{p.nome}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="border-gray-700 text-gray-400">
                                                                {racaNome}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="border-gray-700 text-gray-400">
                                                                {especieNome}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => abrirEdicao('pelagem', p.id, p.nome)}
                                                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => excluir('pelagem', p.id)}
                                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Diálogo de Edição */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5 text-blue-400" />
                            Editar {editTipo}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input 
                            value={editNome} 
                            onChange={e => setEditNome(e.target.value)} 
                            className="bg-gray-900/50 border-gray-700/50 text-white"
                            placeholder={`Novo nome para ${editTipo}`}
                        />
                        <div className="flex justify-end gap-4">
                            <Button 
                                variant="outline" 
                                onClick={() => setEditOpen(false)}
                                className="border-gray-700 text-gray-400 hover:text-white"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                onClick={salvarEdicao} 
                                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                            >
                                Salvar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TabelaEspecieRacaPelagem;