import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Trash2, Edit, Eye, Filter, Download, MoreVertical, 
  Users, Dog, Cat, Calendar, AlertCircle, CheckCircle, Clock,
  User, Phone, MapPin, Plus, ChevronDown, ChevronUp, 
  FileText, Shield, Thermometer, Heart, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Ficha {
  id: string;
  nomeAnimal: string;
  especie: string;
  raca: string;
  nomeProprietario: string;
  telefoneProprietario: string;
  dataNascimento: string;
  vacinas: any[];
  imagemUrl?: string;
  createdAt: any;
  peso?: string;
  cor?: string;
  status?: string;
}

const ListaFichas = () => {
  const { user } = useContext(AuthContext);
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterEspecie, setFilterEspecie] = useState('todos');
  const [sortField, setSortField] = useState('nomeAnimal');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedFichas, setSelectedFichas] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    carregarFichas();
  }, [user]);

  const carregarFichas = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'animais'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const lista: Ficha[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        lista.push({
          id: docSnap.id,
          nomeAnimal: data.nomeAnimal || '',
          especie: data.especie || '',
          raca: data.raca || '',
          nomeProprietario: data.nomeProprietario || '',
          telefoneProprietario: data.telefoneProprietario || '',
          dataNascimento: data.dataNascimento || '',
          vacinas: data.vacinas || [],
          imagemUrl: data.imagemUrl || '',
          createdAt: data.createdAt,
          peso: data.peso || '',
          cor: data.cor || '',
          status: calcularStatusVacina(data.vacinas || []),
        });
      });
      setFichas(lista);
    } catch (error) {
      console.error('Erro ao carregar fichas:', error);
      toast.error('Erro ao carregar as fichas');
    } finally {
      setLoading(false);
    }
  };

  const calcularStatusVacina = (vacinas: any[]) => {
    const hoje = new Date();
    const vacinasPendentes = vacinas.filter(v => {
      if (v.proximaData) {
        const dataProxima = new Date(v.proximaData);
        return dataProxima <= hoje;
      }
      return false;
    });
    return vacinasPendentes.length > 0 ? 'pendente' : 'em-dia';
  };

  const calcularIdade = (dataNascimento: string) => {
    if (!dataNascimento) return 'Não informada';
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let anos = hoje.getFullYear() - nascimento.getFullYear();
    let meses = hoje.getMonth() - nascimento.getMonth();
    
    if (meses < 0) {
      anos--;
      meses += 12;
    }
    
    if (anos > 0) return `${anos} ano${anos > 1 ? 's' : ''}`;
    return `${meses} mês${meses > 1 ? 'es' : ''}`;
  };

  const fichasFiltradas = fichas
    .filter((ficha) => {
      const matchesSearch = 
        ficha.nomeAnimal.toLowerCase().includes(busca.toLowerCase()) ||
        ficha.nomeProprietario.toLowerCase().includes(busca.toLowerCase()) ||
        ficha.raca.toLowerCase().includes(busca.toLowerCase());
      
      const matchesEspecie = filterEspecie === 'todos' || ficha.especie === filterEspecie;
      
      return matchesSearch && matchesEspecie;
    })
    .sort((a, b) => {
      let aValue = a[sortField as keyof Ficha];
      let bValue = b[sortField as keyof Ficha];
      
      if (sortField === 'createdAt') {
        aValue = a.createdAt?.toDate()?.getTime() || 0;
        bValue = b.createdAt?.toDate()?.getTime() || 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const excluirFicha = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'animais', id));
      setFichas(fichas.filter((f) => f.id !== id));
      setSelectedFichas(selectedFichas.filter(fId => fId !== id));
      toast.success('Ficha excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast.error('Erro ao excluir a ficha');
    }
  };

  const excluirMultiplasFichas = async () => {
    if (!confirm(`Tem certeza que deseja excluir ${selectedFichas.length} fichas?`)) return;
    
    try {
      await Promise.all(selectedFichas.map(id => deleteDoc(doc(db, 'animais', id))));
      setFichas(fichas.filter((f) => !selectedFichas.includes(f.id)));
      setSelectedFichas([]);
      toast.success(`${selectedFichas.length} fichas excluídas com sucesso!`);
    } catch (error) {
      console.error('Erro ao excluir fichas:', error);
      toast.error('Erro ao excluir as fichas');
    }
  };

  const toggleSelectFicha = (id: string) => {
    setSelectedFichas(prev => 
      prev.includes(id) 
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFichas.length === fichasFiltradas.length) {
      setSelectedFichas([]);
    } else {
      setSelectedFichas(fichasFiltradas.map(f => f.id));
    }
  };

  const estatisticas = {
    total: fichas.length,
    caninos: fichas.filter(f => f.especie === 'canino').length,
    felinos: fichas.filter(f => f.especie === 'felino').length,
    emDia: fichas.filter(f => f.status === 'em-dia').length,
    pendentes: fichas.filter(f => f.status === 'pendente').length,
  };

  const especies = [
    { value: 'canino', label: 'Caninos', icon: Dog, color: 'from-blue-600/20 to-cyan-600/20' },
    { value: 'felino', label: 'Felinos', icon: Cat, color: 'from-purple-600/20 to-pink-600/20' },
    { value: 'ave', label: 'Aves', icon: Thermometer, color: 'from-amber-600/20 to-orange-600/20' },
    { value: 'roedor', label: 'Roedores', icon: Heart, color: 'from-emerald-600/20 to-green-600/20' },
    { value: 'outro', label: 'Outros', icon: Users, color: 'from-gray-600/20 to-gray-700/20' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="text-gray-400">Carregando fichas...</p>
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
              <Users className="h-6 w-6 text-red-400" />
            </div>
            <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 border border-red-500/30">
              <Sparkles className="h-3 w-3 mr-1" />
              Gerenciamento de Pacientes
            </Badge>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Lista de Pacientes
          </h1>
          <p className="text-gray-400 mt-2">
            Gerencie todas as fichas de pacientes cadastradas
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/fichas/nova">
            <Button className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
              <Plus className="h-4 w-4" />
              Novo Paciente
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{estatisticas.total}</p>
                <p className="text-sm text-gray-400">Animais cadastrados</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                <Users className="h-5 w-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Caninos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-400">{estatisticas.caninos}</p>
                <p className="text-sm text-gray-400">Cães cadastrados</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
                <Dog className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Felinos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-400">{estatisticas.felinos}</p>
                <p className="text-sm text-gray-400">Gatos cadastrados</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                <Cat className="h-5 w-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Em Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-400">{estatisticas.emDia}</p>
                <p className="text-sm text-gray-400">Vacinação atualizada</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-400">{estatisticas.pendentes}</p>
                <p className="text-sm text-gray-400">Vacinação atrasada</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-600/20 to-orange-600/20">
                <AlertCircle className="h-5 w-5 text-amber-400" />
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
                  placeholder="Buscar por nome do animal, proprietário ou raça..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterEspecie} onValueChange={setFilterEspecie}>
                <SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-700/50 text-white">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filtrar por espécie" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="todos">Todas as espécies</SelectItem>
                  {especies.map((especie) => (
                    <SelectItem key={especie.value} value={especie.value}>
                      {especie.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-700/50 text-white">
                  <div className="flex items-center gap-2">
                    {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    <SelectValue placeholder="Ordenar por" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="nomeAnimal">Nome do Animal</SelectItem>
                  <SelectItem value="nomeProprietario">Proprietário</SelectItem>
                  <SelectItem value="especie">Espécie</SelectItem>
                  <SelectItem value="createdAt">Data de Cadastro</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
              >
                {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações em Lote */}
      {selectedFichas.length > 0 && (
        <Card className="bg-gradient-to-br from-red-600/10 to-pink-600/10 border border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-red-400" />
                <div>
                  <p className="font-medium text-white">
                    {selectedFichas.length} fich{selectedFichas.length === 1 ? 'a' : 'as'} selecionada{selectedFichas.length === 1 ? '' : 's'}
                  </p>
                  <p className="text-sm text-red-400/80">Ações em lote disponíveis</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => setSelectedFichas([])}
                >
                  Desmarcar todas
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-gradient-to-r from-red-600 to-pink-600"
                  onClick={excluirMultiplasFichas}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Selecionadas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'table' | 'grid')}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50 p-1">
            <TabsTrigger value="table" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
              <FileText className="h-4 w-4 mr-2" />
              Tabela
            </TabsTrigger>
            <TabsTrigger value="grid" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
              <Eye className="h-4 w-4 mr-2" />
              Grade
            </TabsTrigger>
          </TabsList>
          
          <div className="text-sm text-gray-400">
            Mostrando {fichasFiltradas.length} de {fichas.length} fichas
          </div>
        </div>

        <TabsContent value="table" className="mt-0">
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
            <CardContent className="p-0">
              {fichasFiltradas.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    {busca ? 'Nenhuma ficha encontrada' : 'Nenhuma ficha cadastrada'}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    {busca ? 'Tente ajustar os termos da busca' : 'Comece cadastrando seu primeiro paciente'}
                  </p>
                  {!busca && (
                    <Link to="/fichas/nova" className="inline-block mt-4">
                      <Button className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                        <Plus className="h-4 w-4" />
                        Cadastrar Primeiro Paciente
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800/50">
                        <TableHead className="w-12">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={selectedFichas.length === fichasFiltradas.length && fichasFiltradas.length > 0}
                              onChange={toggleSelectAll}
                              className="rounded border-gray-600 bg-gray-900/50 text-red-500 focus:ring-red-500/30"
                            />
                          </div>
                        </TableHead>
                        <TableHead className="text-gray-400">Paciente</TableHead>
                        <TableHead className="text-gray-400">Espécie / Raça</TableHead>
                        <TableHead className="text-gray-400">Proprietário</TableHead>
                        <TableHead className="text-gray-400">Idade</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400 text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fichasFiltradas.map((ficha) => (
                        <TableRow key={ficha.id} className="border-gray-800/30 hover:bg-gray-800/20">
                          <TableCell>
                            <div className="flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={selectedFichas.includes(ficha.id)}
                                onChange={() => toggleSelectFicha(ficha.id)}
                                className="rounded border-gray-600 bg-gray-900/50 text-red-500 focus:ring-red-500/30"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                {ficha.imagemUrl ? (
                                  <img
                                    src={ficha.imagemUrl}
                                    alt={ficha.nomeAnimal}
                                    className="h-12 w-12 rounded-lg object-cover border border-gray-800/50"
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-800/50 flex items-center justify-center">
                                    <Dog className="h-6 w-6 text-gray-500" />
                                  </div>
                                )}
                                <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-gray-900 ${
                                  ficha.especie === 'canino' ? 'bg-blue-500' :
                                  ficha.especie === 'felino' ? 'bg-purple-500' :
                                  'bg-gray-600'
                                }`} />
                              </div>
                              <div>
                                <p className="font-medium text-white">{ficha.nomeAnimal}</p>
                                <p className="text-xs text-gray-500">{ficha.cor || 'Cor não informada'}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {ficha.especie === 'canino' ? (
                                <Dog className="h-4 w-4 text-blue-400" />
                              ) : ficha.especie === 'felino' ? (
                                <Cat className="h-4 w-4 text-purple-400" />
                              ) : (
                                <Users className="h-4 w-4 text-gray-400" />
                              )}
                              <div>
                                <p className="text-white capitalize">{ficha.especie || 'Não informada'}</p>
                                <p className="text-xs text-gray-500">{ficha.raca || 'Raça não informada'}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-white">{ficha.nomeProprietario}</p>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Phone className="h-3 w-3" />
                                {ficha.telefoneProprietario || 'Não informado'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-white">{calcularIdade(ficha.dataNascimento)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn(
                              "bg-gradient-to-r border",
                              ficha.status === 'pendente'
                                ? "from-amber-600/20 to-orange-600/20 text-amber-400 border-amber-500/30"
                                : "from-emerald-600/20 to-green-600/20 text-emerald-400 border-emerald-500/30"
                            )}>
                              {ficha.status === 'pendente' ? (
                                <>
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Vacina Atrasada
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Em Dia
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link to={`/fichas/detalhe/${ficha.id}`}>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-gray-400 hover:text-white hover:bg-gray-800/30"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link to={`/fichas/editar/${ficha.id}`}>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => excluirFicha(ficha.id)}
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
        </TabsContent>

        <TabsContent value="grid" className="mt-0">
          {fichasFiltradas.length === 0 ? (
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
              <CardContent className="text-center py-12">
                <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  {busca ? 'Nenhuma ficha encontrada' : 'Nenhuma ficha cadastrada'}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {busca ? 'Tente ajustar os termos da busca' : 'Comece cadastrando seu primeiro paciente'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fichasFiltradas.map((ficha) => (
                <Card key={ficha.id} className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 hover:border-red-500/30 transition-colors group">
                  <CardContent className="p-0">
                    {/* Header com imagem */}
                    <div className="relative">
                      {ficha.imagemUrl ? (
                        <img
                          src={ficha.imagemUrl}
                          alt={ficha.nomeAnimal}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-t-lg flex items-center justify-center">
                          <Dog className="h-20 w-20 text-gray-600" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge className={cn(
                          "bg-gradient-to-r border",
                          ficha.status === 'pendente'
                            ? "from-amber-600/20 to-orange-600/20 text-amber-400 border-amber-500/30"
                            : "from-emerald-600/20 to-green-600/20 text-emerald-400 border-emerald-500/30"
                        )}>
                          {ficha.status === 'pendente' ? (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Atrasado
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Em Dia
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="flex items-center gap-2">
                          {ficha.especie === 'canino' ? (
                            <Dog className="h-5 w-5 text-blue-400" />
                          ) : ficha.especie === 'felino' ? (
                            <Cat className="h-5 w-5 text-purple-400" />
                          ) : (
                            <Users className="h-5 w-5 text-gray-400" />
                          )}
                          <span className="text-white font-medium capitalize">{ficha.especie}</span>
                        </div>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">{ficha.nomeAnimal}</h3>
                          <p className="text-sm text-gray-400">{ficha.raca || 'Raça não informada'}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Link to={`/fichas/detalhe/${ficha.id}`}>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-400">Proprietário</p>
                            <p className="text-white">{ficha.nomeProprietario}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-400">Idade</p>
                            <p className="text-white">{calcularIdade(ficha.dataNascimento)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-400">Telefone</p>
                            <p className="text-white">{ficha.telefoneProprietario || 'Não informado'}</p>
                          </div>
                        </div>

                        {ficha.peso && (
                          <div className="flex items-center gap-3">
                            <Scale className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-400">Peso</p>
                              <p className="text-white">{ficha.peso} kg</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <Separator className="my-4 bg-gray-800/50" />

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {ficha.vacinas?.length || 0} vacina{ficha.vacinas?.length !== 1 ? 's' : ''} cadastrada{ficha.vacinas?.length !== 1 ? 's' : ''}
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/fichas/editar/${ficha.id}`}>
                            <Button size="sm" variant="outline" className="border-gray-700 text-gray-400 hover:text-white">
                              <Edit className="h-3 w-3 mr-2" />
                              Editar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ListaFichas;