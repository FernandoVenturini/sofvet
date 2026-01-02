import { useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AuthContext } from '@/context/AuthContext';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Calendar, Clock, AlertCircle, CheckCircle, 
  User, Phone, MapPin, Plus, ChevronDown, ChevronUp, 
  FileText, Shield, Thermometer, Heart, Sparkles,
  Syringe, Stethoscope, CalendarCheck, History, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Animal {
  id: string;
  nomeAnimal: string;
  especie: string;
  raca: string;
  nomeProprietario: string;
  telefoneProprietario: string;
  dataNascimento: string;
  vacinas: Array<{
    nomeVacina: string;
    dose: number;
    dataAplicacao: string;
    proximaData: string;
    status?: string;
  }>;
  imagemUrl?: string;
  peso?: string;
  cor?: string;
  status?: string;
}

interface RetornoRegistro {
  id?: string;
  animalId: string;
  animalNome: string;
  proprietarioNome: string;
  tipo: 'vacina' | 'consulta';
  vacina?: string;
  dataRetorno: string;
  observacoes: string;
  dataRegistro: string;
  status: 'agendado' | 'realizado' | 'cancelado';
}

const Retorno = () => {
  const { user } = useContext(AuthContext);
  const [busca, setBusca] = useState('');
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [animalSelecionado, setAnimalSelecionado] = useState<Animal | null>(null);
  const [tipoRetorno, setTipoRetorno] = useState<'vacina' | 'consulta'>('vacina');
  const [vacinaSelecionada, setVacinaSelecionada] = useState('');
  const [dataRetorno, setDataRetorno] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(true);
  const [retornos, setRetornos] = useState<RetornoRegistro[]>([]);
  const [activeTab, setActiveTab] = useState('agendar');

  useEffect(() => {
    const carregarAnimais = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(collection(db, 'animais'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const lista = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Animal[];
        
        // Adicionar status às vacinas
        const listaComStatus = lista.map(animal => ({
          ...animal,
          vacinas: animal.vacinas?.map(vacina => ({
            ...vacina,
            status: new Date(vacina.proximaData) < new Date() ? 'atrasada' : 'pendente'
          })) || []
        }));
        
        setAnimais(listaComStatus);
      } catch (error) {
        console.error('Erro ao carregar animais:', error);
        toast.error('Erro ao carregar os dados');
      } finally {
        setLoading(false);
      }
    };
    carregarAnimais();
  }, [user]);

  const carregarRetornos = async () => {
    if (!animalSelecionado) return;
    try {
      const q = query(collection(db, 'retornos'), where('animalId', '==', animalSelecionado.id));
      const snap = await getDocs(q);
      const lista = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as RetornoRegistro[];
      setRetornos(lista);
    } catch (error) {
      console.error('Erro ao carregar retornos:', error);
    }
  };

  useEffect(() => {
    if (animalSelecionado) {
      carregarRetornos();
    }
  }, [animalSelecionado]);

  const animaisFiltrados = animais.filter(a =>
    a.nomeAnimal.toLowerCase().includes(busca.toLowerCase()) ||
    a.nomeProprietario.toLowerCase().includes(busca.toLowerCase()) ||
    a.raca.toLowerCase().includes(busca.toLowerCase())
  );

  const vacinasUnicas = Array.from(
    new Set(animalSelecionado?.vacinas?.map(v => v.nomeVacina) || [])
  );

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

  const estatisticas = {
    totalAnimais: animais.length,
    retornosAgendados: retornos.filter(r => r.status === 'agendado').length,
    retornosRealizados: retornos.filter(r => r.status === 'realizado').length,
    vacinasAtrasadas: animais.reduce((acc, animal) => 
      acc + (animal.vacinas?.filter(v => new Date(v.proximaData) < new Date()).length || 0), 0
    ),
  };

  const salvarRetorno = async () => {
    if (!animalSelecionado) {
      toast.error('Selecione um animal primeiro');
      return;
    }

    if (!dataRetorno) {
      toast.error('Selecione uma data para o retorno');
      return;
    }

    try {
      await addDoc(collection(db, 'retornos'), {
        animalId: animalSelecionado.id,
        animalNome: animalSelecionado.nomeAnimal,
        proprietarioNome: animalSelecionado.nomeProprietario,
        tipo: tipoRetorno,
        vacina: tipoRetorno === 'vacina' ? vacinaSelecionada : null,
        dataRetorno,
        observacoes,
        dataRegistro: new Date().toISOString(),
        status: 'agendado',
        userId: user?.uid,
      });

      toast.success('Retorno agendado com sucesso!');
      setDataRetorno('');
      setObservacoes('');
      setVacinaSelecionada('');
      carregarRetornos();
      setActiveTab('historico');
    } catch (error) {
      console.error('Erro ao salvar retorno:', error);
      toast.error('Erro ao agendar retorno');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="text-gray-400">Carregando animais...</p>
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
              <CalendarCheck className="h-6 w-6 text-red-400" />
            </div>
            <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 border border-red-500/30">
              <Sparkles className="h-3 w-3 mr-1" />
              Gerenciamento de Retornos
            </Badge>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Agendamento de Retornos
          </h1>
          <p className="text-gray-400 mt-2">
            Agende retornos para vacinação e consultas de acompanhamento
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{estatisticas.totalAnimais}</p>
                <p className="text-sm text-gray-400">Animais cadastrados</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                <User className="h-5 w-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Retornos Agendados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-400">{estatisticas.retornosAgendados}</p>
                <p className="text-sm text-gray-400">Agendamentos ativos</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
                <Calendar className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Vacinas Atrasadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-400">{estatisticas.vacinasAtrasadas}</p>
                <p className="text-sm text-gray-400">Retornos pendentes</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-600/20 to-orange-600/20">
                <AlertCircle className="h-5 w-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Retornos Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-400">{estatisticas.retornosRealizados}</p>
                <p className="text-sm text-gray-400">Consultas concluídas</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Busca de Animal */}
      <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="h-5 w-5 text-red-400" />
            Buscar Paciente
          </CardTitle>
          <CardDescription className="text-gray-400">
            Digite o nome do animal ou proprietário para selecionar um paciente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por nome do animal, proprietário ou raça..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
            />
          </div>

          {busca && animaisFiltrados.length > 0 && (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {animaisFiltrados.map(animal => (
                <div
                  key={animal.id}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02]",
                    animalSelecionado?.id === animal.id
                      ? "bg-gradient-to-r from-red-600/10 to-pink-600/10 border-red-500/30"
                      : "bg-gray-900/30 border-gray-700/50 hover:border-red-500/30"
                  )}
                  onClick={() => {
                    setAnimalSelecionado(animal);
                    setBusca('');
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {animal.imagemUrl ? (
                        <img
                          src={animal.imagemUrl}
                          alt={animal.nomeAnimal}
                          className="h-14 w-14 rounded-lg object-cover border border-gray-800/50"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-800/50 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                      <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-gray-900 ${
                        animal.especie === 'canino' ? 'bg-blue-500' :
                        animal.especie === 'felino' ? 'bg-purple-500' :
                        'bg-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{animal.nomeAnimal}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="border-gray-700 text-xs">
                              {animal.especie || 'Não informada'}
                            </Badge>
                            <span className="text-sm text-gray-400">{animal.raca || 'Raça não informada'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Proprietário</p>
                          <p className="text-white font-medium">{animal.nomeProprietario}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{animal.telefoneProprietario || 'Não informado'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{calcularIdade(animal.dataNascimento)}</span>
                        </div>
                        {animal.peso && (
                          <div className="flex items-center gap-1">
                            <span>⚖️</span>
                            <span>{animal.peso} kg</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {busca && animaisFiltrados.length === 0 && (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Nenhum animal encontrado</p>
              <p className="text-gray-500 text-sm mt-1">Tente buscar com outros termos</p>
            </div>
          )}

          {!busca && animalSelecionado && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-red-600/10 to-pink-600/10 border border-red-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {animalSelecionado.imagemUrl ? (
                      <img
                        src={animalSelecionado.imagemUrl}
                        alt={animalSelecionado.nomeAnimal}
                        className="h-16 w-16 rounded-lg object-cover border border-gray-800/50"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-800/50 flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-500" />
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-gray-900 ${
                      animalSelecionado.especie === 'canino' ? 'bg-blue-500' :
                      animalSelecionado.especie === 'felino' ? 'bg-purple-500' :
                      'bg-gray-600'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-white">{animalSelecionado.nomeAnimal}</h3>
                      <Badge className={cn(
                        "bg-gradient-to-r border",
                        animalSelecionado.vacinas?.some(v => v.status === 'atrasada')
                          ? "from-amber-600/20 to-orange-600/20 text-amber-400 border-amber-500/30"
                          : "from-emerald-600/20 to-green-600/20 text-emerald-400 border-emerald-500/30"
                      )}>
                        {animalSelecionado.vacinas?.some(v => v.status === 'atrasada') ? (
                          <>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Vacinas Atrasadas
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Em Dia
                          </>
                        )}
                      </Badge>
                    </div>
                    <p className="text-gray-400">{animalSelecionado.raca} • {animalSelecionado.especie}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1 text-gray-400">
                        <User className="h-3 w-3" />
                        <span>{animalSelecionado.nomeProprietario}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Phone className="h-3 w-3" />
                        <span>{animalSelecionado.telefoneProprietario || 'Não informado'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>{calcularIdade(animalSelecionado.dataNascimento)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-400 hover:text-white"
                  onClick={() => setAnimalSelecionado(null)}
                >
                  Alterar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conteúdo Principal quando Animal Selecionado */}
      {animalSelecionado && (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50 p-1">
              <TabsTrigger value="agendar" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                <Plus className="h-4 w-4 mr-2" />
                Agendar Retorno
              </TabsTrigger>
              <TabsTrigger value="vacinas" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                <Syringe className="h-4 w-4 mr-2" />
                Histórico de Vacinas
              </TabsTrigger>
              <TabsTrigger value="historico" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                <History className="h-4 w-4 mr-2" />
                Histórico de Retornos
              </TabsTrigger>
            </TabsList>

            {/* Agendar Retorno */}
            <TabsContent value="agendar" className="mt-6">
              <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5 text-red-400" />
                    Agendar Novo Retorno
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Preencha os dados para agendar um retorno para {animalSelecionado.nomeAnimal}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-white flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-red-400" />
                        Tipo de Retorno
                      </Label>
                      <Select value={tipoRetorno} onValueChange={v => setTipoRetorno(v as 'vacina' | 'consulta')}>
                        <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-800">
                          <SelectItem value="vacina" className="hover:bg-gray-800 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Syringe className="h-4 w-4" />
                              Revacinação
                            </div>
                          </SelectItem>
                          <SelectItem value="consulta" className="hover:bg-gray-800 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4" />
                              Consulta de Retorno
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {tipoRetorno === 'vacina' && (
                      <div className="space-y-3">
                        <Label className="text-white flex items-center gap-2">
                          <Syringe className="h-4 w-4 text-red-400" />
                          Vacina
                        </Label>
                        <Select value={vacinaSelecionada} onValueChange={setVacinaSelecionada}>
                          <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                            <SelectValue placeholder="Selecione a vacina" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-800">
                            {vacinasUnicas.map(vacina => (
                              <SelectItem key={vacina} value={vacina} className="hover:bg-gray-800 cursor-pointer">
                                {vacina}
                              </SelectItem>
                            ))}
                            {animalSelecionado.vacinas?.length === 0 && (
                              <div className="p-2 text-center text-gray-400 text-sm">
                                Nenhuma vacina registrada
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-red-400" />
                      Data do Retorno
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        type="date"
                        value={dataRetorno}
                        onChange={e => setDataRetorno(e.target.value)}
                        className="pl-10 bg-gray-900/50 border-gray-700/50 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-400" />
                      Observações
                    </Label>
                    <Textarea
                      placeholder="Detalhes do retorno, sintomas observados, recomendações..."
                      value={observacoes}
                      onChange={e => setObservacoes(e.target.value)}
                      rows={5}
                      className="bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <Separator className="bg-gray-800/50" />

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      className="border-gray-700 text-gray-400 hover:text-white"
                      onClick={() => {
                        setDataRetorno('');
                        setObservacoes('');
                        setVacinaSelecionada('');
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Limpar
                    </Button>
                    <Button
                      onClick={salvarRetorno}
                      className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                      disabled={!dataRetorno}
                    >
                      <CalendarCheck className="h-4 w-4" />
                      Agendar Retorno
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Histórico de Vacinas */}
            <TabsContent value="vacinas" className="mt-6">
              <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Syringe className="h-5 w-5 text-red-400" />
                    Histórico de Vacinas - {animalSelecionado.nomeAnimal}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Controle de vacinações aplicadas e próximos retornos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {animalSelecionado.vacinas?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-800/50">
                            <TableHead className="text-gray-400">Vacina</TableHead>
                            <TableHead className="text-gray-400">Dose</TableHead>
                            <TableHead className="text-gray-400">Data de Aplicação</TableHead>
                            <TableHead className="text-gray-400">Próxima Dose</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {animalSelecionado.vacinas.map((vacina, index) => {
                            const isAtrasada = new Date(vacina.proximaData) < new Date();
                            return (
                              <TableRow key={index} className="border-gray-800/30 hover:bg-gray-800/20">
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isAtrasada ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/20' : 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20'}`}>
                                      <Syringe className={`h-4 w-4 ${isAtrasada ? 'text-amber-400' : 'text-blue-400'}`} />
                                    </div>
                                    <span className="text-white">{vacina.nomeVacina}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="border-gray-700">
                                    {vacina.dose}ª dose
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-white">
                                  {vacina.dataAplicacao ? format(new Date(vacina.dataAplicacao), 'dd/MM/yyyy') : '-'}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Calendar className={`h-4 w-4 ${isAtrasada ? 'text-amber-400' : 'text-emerald-400'}`} />
                                    <span className={cn(
                                      "font-medium",
                                      isAtrasada ? "text-amber-400" : "text-emerald-400"
                                    )}>
                                      {vacina.proximaData ? format(new Date(vacina.proximaData), 'dd/MM/yyyy') : '-'}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={cn(
                                    "bg-gradient-to-r border",
                                    isAtrasada
                                      ? "from-amber-600/20 to-orange-600/20 text-amber-400 border-amber-500/30"
                                      : "from-emerald-600/20 to-green-600/20 text-emerald-400 border-emerald-500/30"
                                  )}>
                                    {isAtrasada ? (
                                      <>
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        Atrasada
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Em Dia
                                      </>
                                    )}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Syringe className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">Nenhuma vacina registrada</p>
                      <p className="text-gray-500 text-sm mt-2">
                        Este animal ainda não possui histórico de vacinação
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Histórico de Retornos */}
            <TabsContent value="historico" className="mt-6">
              <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <History className="h-5 w-5 text-red-400" />
                    Histórico de Retornos - {animalSelecionado.nomeAnimal}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Registro de todos os retornos agendados e realizados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {retornos.length > 0 ? (
                    <div className="space-y-4">
                      {retornos.map((retorno) => {
                        const isRealizado = retorno.status === 'realizado';
                        return (
                          <div
                            key={retorno.id}
                            className="p-4 rounded-lg border border-gray-800/50 hover:border-red-500/30 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${isRealizado ? 'bg-gradient-to-br from-emerald-600/20 to-green-600/20' : 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20'}`}>
                                  {retorno.tipo === 'vacina' ? (
                                    <Syringe className={`h-5 w-5 ${isRealizado ? 'text-emerald-400' : 'text-blue-400'}`} />
                                  ) : (
                                    <Stethoscope className={`h-5 w-5 ${isRealizado ? 'text-emerald-400' : 'text-blue-400'}`} />
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-3">
                                    <h4 className="font-bold text-white">
                                      {retorno.tipo === 'vacina' ? 'Revacinação' : 'Consulta de Retorno'}
                                    </h4>
                                    <Badge className={cn(
                                      "bg-gradient-to-r border text-xs",
                                      isRealizado
                                        ? "from-emerald-600/20 to-green-600/20 text-emerald-400 border-emerald-500/30"
                                        : retorno.status === 'cancelado'
                                        ? "from-gray-600/20 to-gray-700/20 text-gray-400 border-gray-500/30"
                                        : "from-blue-600/20 to-cyan-600/20 text-blue-400 border-blue-500/30"
                                    )}>
                                      {retorno.status === 'realizado' ? 'Realizado' : 
                                       retorno.status === 'cancelado' ? 'Cancelado' : 'Agendado'}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-400 text-sm mt-1">
                                    {retorno.tipo === 'vacina' && retorno.vacina && (
                                      <>Vacina: {retorno.vacina} • </>
                                    )}
                                    Data: {format(new Date(retorno.dataRetorno), 'dd/MM/yyyy')}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-400">Agendado em</p>
                                <p className="text-white">
                                  {format(new Date(retorno.dataRegistro), 'dd/MM/yyyy')}
                                </p>
                              </div>
                            </div>
                            {retorno.observacoes && (
                              <>
                                <Separator className="my-3 bg-gray-800/50" />
                                <p className="text-gray-400 text-sm">
                                  <span className="font-medium text-gray-300">Observações:</span> {retorno.observacoes}
                                </p>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CalendarCheck className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">Nenhum retorno registrado</p>
                      <p className="text-gray-500 text-sm mt-2">
                        Este animal ainda não possui retornos agendados
                      </p>
                      <Button
                        className="mt-4 gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                        onClick={() => setActiveTab('agendar')}
                      >
                        <Plus className="h-4 w-4" />
                        Agendar Primeiro Retorno
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Retorno;