import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar, Clock, AlertCircle, CheckCircle, Filter, 
  Search, Dog, User, Syringe, CalendarDays, Bell,
  Download, ChevronDown, ChevronUp, Eye, Phone, Mail,
  TrendingUp, CalendarCheck, ShieldAlert
} from 'lucide-react';
import { format, isToday, isPast, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Retorno {
  id: string;
  animalId: string;
  nomeAnimal: string;
  nomeProprietario: string;
  vacinaNome: string;
  dose: number;
  dataPrevista: string;
  especie?: string;
  telefone?: string;
  email?: string;
}

const AgendaRetornos = () => {
  const [retornos, setRetornos] = useState<Retorno[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'today' | 'overdue' | 'upcoming'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  useEffect(() => {
    const carregarRetornos = async () => {
      setLoading(true);
      try {
        const animaisSnapshot = await getDocs(collection(db, 'animais'));
        const listaRetornos: Retorno[] = [];

        animaisSnapshot.forEach((animalDoc) => {
          const data = animalDoc.data();
          const vacinas = data.vacinas || [];

          vacinas.forEach((v: any, index: number) => {
            if (v.proximaData && v.proximaData.trim() !== '') {
              listaRetornos.push({
                id: `${animalDoc.id}-${index}`,
                animalId: animalDoc.id,
                nomeAnimal: data.nomeAnimal || 'Animal sem nome',
                nomeProprietario: data.nomeProprietario || 'Proprietário não informado',
                vacinaNome: v.nomeVacina || 'Vacina desconhecida',
                dose: v.dose || 0,
                dataPrevista: v.proximaData,
                especie: data.especie || 'Não informada',
                telefone: data.telefone || 'Não informado',
                email: data.email || 'Não informado',
              });
            }
          });
        });

        // Ordena por data mais próxima
        listaRetornos.sort((a, b) => new Date(a.dataPrevista).getTime() - new Date(b.dataPrevista).getTime());
        setRetornos(listaRetornos);
      } catch (error) {
        console.error('Erro ao carregar agenda:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarRetornos();
  }, []);

  const getStatusBadge = (dataPrevista: string) => {
    const date = parseISO(dataPrevista);
    const daysDiff = differenceInDays(date, new Date());
    
    if (isPast(date) && !isToday(date)) {
      return {
        component: <Badge className="bg-gradient-to-r from-red-600/20 to-red-800/20 text-red-400 border border-red-500/30">
          <Clock className="h-3 w-3 mr-1" />
          Atrasado
        </Badge>,
        severity: 'high'
      };
    }
    if (isToday(date)) {
      return {
        component: <Badge className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-400 border border-amber-500/30">
          <Bell className="h-3 w-3 mr-1" />
          Hoje
        </Badge>,
        severity: 'medium'
      };
    }
    if (daysDiff <= 7) {
      return {
        component: <Badge className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400 border border-purple-500/30">
          <CalendarCheck className="h-3 w-3 mr-1" />
          Esta semana
        </Badge>,
        severity: 'low'
      };
    }
    return {
      component: <Badge className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-400 border border-emerald-500/30">
        <CheckCircle className="h-3 w-3 mr-1" />
        Agendado
      </Badge>,
      severity: 'none'
    };
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const filteredRetornos = retornos.filter(retorno => {
    const matchesSearch = 
      retorno.nomeAnimal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retorno.nomeProprietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retorno.vacinaNome.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    const status = getStatusBadge(retorno.dataPrevista);
    if (filterStatus === 'today' && status.severity !== 'medium') return false;
    if (filterStatus === 'overdue' && status.severity !== 'high') return false;
    if (filterStatus === 'upcoming' && status.severity !== 'low') return false;
    
    return true;
  });

  const sortedRetornos = [...filteredRetornos].sort((a, b) => {
    const dateA = parseISO(a.dataPrevista);
    const dateB = parseISO(b.dataPrevista);
    return sortOrder === 'asc' 
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });

  const stats = {
    total: retornos.length,
    overdue: retornos.filter(r => {
      const status = getStatusBadge(r.dataPrevista);
      return status.severity === 'high';
    }).length,
    today: retornos.filter(r => {
      const status = getStatusBadge(r.dataPrevista);
      return status.severity === 'medium';
    }).length,
    upcoming: retornos.filter(r => {
      const status = getStatusBadge(r.dataPrevista);
      return status.severity === 'low';
    }).length,
  };

  const exportToCSV = () => {
    const headers = ['Animal', 'Proprietário', 'Vacina', 'Dose', 'Data Prevista', 'Status', 'Espécie', 'Telefone'];
    const csvContent = [
      headers.join(','),
      ...sortedRetornos.map(retorno => {
        const status = getStatusBadge(retorno.dataPrevista);
        return [
          `"${retorno.nomeAnimal}"`,
          `"${retorno.nomeProprietario}"`,
          `"${retorno.vacinaNome}"`,
          `"${retorno.dose}ª dose"`,
          `"${format(parseISO(retorno.dataPrevista), 'dd/MM/yyyy')}"`,
          `"${status.severity === 'high' ? 'Atrasado' : status.severity === 'medium' ? 'Hoje' : 'Agendado'}"`,
          `"${retorno.especie || 'Não informada'}"`,
          `"${retorno.telefone || 'Não informado'}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agenda-retornos-${format(new Date(), 'dd-MM-yyyy')}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando agenda de retornos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30">
              <Calendar className="h-6 w-6 text-red-400" />
            </div>
            <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 border border-red-500/30">
              <ShieldAlert className="h-3 w-3 mr-1" />
              Agenda Ativa
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-green-400">
            Agenda de Retornos
          </h1>
          <p className="text-gray-400 mt-2">
            Controle de vacinações e retornos programados
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800/30 gap-2"
            onClick={exportToCSV}
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 gap-2">
            <Bell className="h-4 w-4" />
            Enviar Lembretes
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total de Retornos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-gray-400">Retornos programados</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                <Calendar className="h-5 w-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Atrasados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-red-400">{stats.overdue}</p>
                <p className="text-sm text-gray-400">Requerem atenção</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Para Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-400">{stats.today}</p>
                <p className="text-sm text-gray-400">Retornos agendados</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-600/20 to-orange-600/20">
                <Bell className="h-5 w-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Próxima Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-400">{stats.upcoming}</p>
                <p className="text-sm text-gray-400">Retornos programados</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                <TrendingUp className="h-5 w-5 text-purple-400" />
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
                  placeholder="Buscar animal, proprietário ou vacina..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                className={cn(
                  filterStatus === 'all' 
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                    : 'border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30'
                )}
                onClick={() => setFilterStatus('all')}
              >
                Todos
              </Button>
              <Button
                variant={filterStatus === 'overdue' ? 'default' : 'outline'}
                className={cn(
                  filterStatus === 'overdue' 
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                    : 'border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30'
                )}
                onClick={() => setFilterStatus('overdue')}
              >
                Atrasados
              </Button>
              <Button
                variant={filterStatus === 'today' ? 'default' : 'outline'}
                className={cn(
                  filterStatus === 'today' 
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                    : 'border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30'
                )}
                onClick={() => setFilterStatus('today')}
              >
                Hoje
              </Button>
              <Button
                variant={filterStatus === 'upcoming' ? 'default' : 'outline'}
                className={cn(
                  filterStatus === 'upcoming' 
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                    : 'border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30'
                )}
                onClick={() => setFilterStatus('upcoming')}
              >
                Esta semana
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-red-400" />
            Lista de Retornos ({sortedRetornos.length})
          </CardTitle>
          <CardDescription>
            Retornos e vacinações programadas, ordenadas por data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedRetornos.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Nenhum retorno encontrado</p>
              <p className="text-gray-500 text-sm mt-2">
                {searchTerm ? 'Tente ajustar os termos da busca' : 'Todos os retornos estão em dia!'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800/50">
                    <TableHead className="text-gray-400">Animal</TableHead>
                    <TableHead className="text-gray-400">Proprietário</TableHead>
                    <TableHead className="text-gray-400">Vacina</TableHead>
                    <TableHead className="text-gray-400">Data</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRetornos.map((retorno) => {
                    const status = getStatusBadge(retorno.dataPrevista);
                    const isExpanded = expandedRows.includes(retorno.id);
                    const date = parseISO(retorno.dataPrevista);
                    const daysDiff = differenceInDays(date, new Date());
                    
                    return (
                      <>
                        <TableRow 
                          key={retorno.id}
                          className={cn(
                            "border-gray-800/30 hover:bg-gray-800/20 cursor-pointer transition-colors",
                            status.severity === 'high' && 'border-l-4 border-l-red-500/50',
                            status.severity === 'medium' && 'border-l-4 border-l-amber-500/50',
                            status.severity === 'low' && 'border-l-4 border-l-purple-500/50'
                          )}
                          onClick={() => toggleRowExpansion(retorno.id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
                                <Dog className="h-4 w-4 text-blue-400" />
                              </div>
                              <div>
                                <p className="font-medium text-white">{retorno.nomeAnimal}</p>
                                <p className="text-xs text-gray-500">{retorno.especie}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-300">{retorno.nomeProprietario}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Syringe className="h-4 w-4 text-gray-500" />
                              <div>
                                <span className="text-white">{retorno.vacinaNome}</span>
                                <p className="text-xs text-gray-500">{retorno.dose}ª dose</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-white">
                                {format(date, "dd 'de' MMMM", { locale: ptBR })}
                              </span>
                              <span className="text-xs text-gray-500">
                                {format(date, 'HH:mm')} • {daysDiff > 0 ? `Em ${daysDiff} dias` : daysDiff < 0 ? `${Math.abs(daysDiff)} dias atrás` : 'Hoje'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{status.component}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-gray-400 hover:text-white hover:bg-gray-800/30"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        {isExpanded && (
                          <TableRow className="border-gray-800/30 bg-gray-900/30">
                            <TableCell colSpan={6}>
                              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <p className="text-sm text-gray-400">Informações de Contato</p>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm text-white">{retorno.telefone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm text-white">{retorno.email}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-sm text-gray-400">Ações Rápidas</p>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="text-xs border-gray-700 text-gray-400 hover:text-white">
                                      Registrar Aplicação
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-xs border-gray-700 text-gray-400 hover:text-white">
                                      Reagendar
                                    </Button>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-sm text-gray-400">Observações</p>
                                  <p className="text-sm text-gray-500">
                                    Próxima dose da vacina {retorno.vacinaNome} para {retorno.nomeAnimal}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {sortedRetornos.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-800/50">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Mostrando {sortedRetornos.length} de {retornos.length} retornos</span>
              <span>Ordenado por data {sortOrder === 'asc' ? 'crescente' : 'decrescente'}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AgendaRetornos;