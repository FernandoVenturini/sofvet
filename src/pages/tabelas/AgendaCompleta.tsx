import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  User,
  Home,
  Phone,
  Mail,
  MapPin,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  Printer,
  Bell,
  CalendarDays,
  Stethoscope,
  Pill,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageCircle
} from 'lucide-react';
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isToday,
  isTomorrow,
  parseISO,
  isSameMonth
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { agendaService, AgendamentoFirebase } from '@/services/agendaService';
import { collection, query, where, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Tipos
interface Paciente {
  id: string;
  nome: string;
  especie: string;
  raca: string;
  proprietario: string;
  telefone: string;
  email?: string;
  endereco?: string;
}

interface Veterinario {
  id: string;
  nome: string;
  especialidade: string;
  cor: string;
}

// Status com cores
const statusConfig = {
  agendado: { label: 'Agendado', color: 'bg-gray-500 text-white' },
  confirmado: { label: 'Confirmado', color: 'bg-green-500 text-white' },
  em_andamento: { label: 'Em Andamento', color: 'bg-blue-500 text-white' },
  concluido: { label: 'Concluído', color: 'bg-purple-500 text-white' },
  cancelado: { label: 'Cancelado', color: 'bg-red-500 text-white' },
  falta: { label: 'Falta', color: 'bg-orange-500 text-white' }
};

const AgendaCompleta = () => {
  const { toast } = useToast();

  // Estados principais
  const [date, setDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'dia' | 'semana' | 'mes'>('semana');
  const [selectedAgenda, setSelectedAgenda] = useState<AgendamentoFirebase | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVeterinario, setFilterVeterinario] = useState('todos');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');

  // Estados para modais
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para novo agendamento
  const [formData, setFormData] = useState({
    data: new Date(),
    hora: '09:00',
    pacienteId: '',
    veterinario: 'Dr. João Silva',
    tipo: 'consulta' as const,
    descricao: '',
    observacoes: '',
    duracao: 30,
    valor: 0
  });

  // Estados para dados
  const [pacientes, setPacientes] = useState<Paciente[]>([
    { id: '1', nome: 'Rex', especie: 'Canino', raca: 'Labrador', proprietario: 'Maria Santos', telefone: '(11) 99999-9999', email: 'maria@email.com', endereco: 'Rua A, 123' },
    { id: '2', nome: 'Mimi', especie: 'Felino', raca: 'Siamês', proprietario: 'João Oliveira', telefone: '(11) 98888-8888', email: 'joao@email.com', endereco: 'Rua B, 456' },
    { id: '3', nome: 'Thor', especie: 'Canino', raca: 'Pastor Alemão', proprietario: 'Carlos Souza', telefone: '(11) 97777-7777', email: 'carlos@email.com', endereco: 'Rua C, 789' },
    { id: '4', nome: 'Luna', especie: 'Felino', raca: 'Persa', proprietario: 'Ana Costa', telefone: '(11) 96666-6666', email: 'ana@email.com', endereco: 'Rua D, 101' },
    { id: '5', nome: 'Bob', especie: 'Canino', raca: 'Bulldog', proprietario: 'Pedro Lima', telefone: '(11) 95555-5555', email: 'pedro@email.com', endereco: 'Rua E, 202' },
  ]);

  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([
    { id: '1', nome: 'Dr. João Silva', especialidade: 'Clínica Geral', cor: 'bg-blue-500' },
    { id: '2', nome: 'Dra. Maria Santos', especialidade: 'Cirurgia', cor: 'bg-purple-500' },
    { id: '3', nome: 'Dr. Carlos Oliveira', especialidade: 'Dermatologia', cor: 'bg-green-500' },
    { id: '4', nome: 'Dra. Ana Costa', especialidade: 'Ortopedia', cor: 'bg-red-500' },
  ]);

  const [agendas, setAgendas] = useState<AgendamentoFirebase[]>([]);
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    hoje: 0,
    amanha: 0,
    confirmados: 0,
    agendados: 0,
    concluidos: 0,
    cancelados: 0,
    faturamentoDia: 0,
    faturamentoMes: 0
  });

  // Carregar dados
  useEffect(() => {
    carregarAgendas();

    // Configurar sincronização em tempo real
    const hoje = new Date();
    const inicioSemana = startOfWeek(hoje);
    const fimSemana = endOfWeek(hoje);
    fimSemana.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'agendamentos'),
      where('data', '>=', Timestamp.fromDate(inicioSemana)),
      where('data', '<=', Timestamp.fromDate(fimSemana))
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dados = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          data: data.data?.toDate() || new Date(),
          hora: data.hora || '',
          pacienteId: data.pacienteId || '',
          veterinario: data.veterinario || '',
          tipo: data.tipo || 'consulta',
          status: data.status || 'agendado',
          descricao: data.descricao || '',
          observacoes: data.observacoes || '',
          duracao: data.duracao || 30,
          valor: data.valor || 0,
          criadoEm: data.criadoEm?.toDate() || new Date(),
          atualizadoEm: data.atualizadoEm?.toDate() || new Date(),
          pacienteNome: data.pacienteNome || '',
          pacienteEspecie: data.pacienteEspecie || '',
          pacienteRaca: data.pacienteRaca || '',
          proprietarioNome: data.proprietarioNome || '',
          proprietarioTelefone: data.proprietarioTelefone || ''
        } as AgendamentoFirebase;
      });
      setAgendas(dados);
      calcularEstatisticas(dados);
    });

    return () => unsubscribe();
  }, [date, viewMode]);

  const carregarAgendas = async () => {
    setLoading(true);
    try {
      let dados: AgendamentoFirebase[] = [];

      if (viewMode === 'dia') {
        dados = await agendaService.buscarAgendamentosDoDia(date);
      } else if (viewMode === 'semana') {
        dados = await agendaService.buscarAgendamentosDaSemana(date);
      } else {
        dados = await agendaService.buscarAgendamentosDoMes(date);
      }

      setAgendas(dados);
      calcularEstatisticas(dados);

    } catch (error) {
      console.error('Erro ao carregar agendas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os agendamentos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = (dados: AgendamentoFirebase[]) => {
    const hoje = new Date();
    const agendamentosHoje = dados.filter(a =>
      a.data.getDate() === hoje.getDate() &&
      a.data.getMonth() === hoje.getMonth() &&
      a.data.getFullYear() === hoje.getFullYear()
    );

    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const agendamentosAmanha = dados.filter(a =>
      a.data.getDate() === amanha.getDate() &&
      a.data.getMonth() === amanha.getMonth() &&
      a.data.getFullYear() === amanha.getFullYear()
    );

    setEstatisticas({
      total: dados.length,
      hoje: agendamentosHoje.length,
      amanha: agendamentosAmanha.length,
      confirmados: dados.filter(a => a.status === 'confirmado').length,
      agendados: dados.filter(a => a.status === 'agendado').length,
      concluidos: dados.filter(a => a.status === 'concluido').length,
      cancelados: dados.filter(a => a.status === 'cancelado' || a.status === 'falta').length,
      faturamentoDia: agendamentosHoje
        .filter(a => a.status === 'concluido')
        .reduce((sum, a) => sum + a.valor, 0),
      faturamentoMes: dados
        .filter(a => a.data.getMonth() === hoje.getMonth() && a.status === 'concluido')
        .reduce((sum, a) => sum + a.valor, 0)
    });
  };

  // Filtrar agendas
  const filteredAgendas = agendas.filter(agenda => {
    const matchesSearch = !searchTerm ||
      agenda.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agenda.pacienteNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agenda.veterinario.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVeterinario = filterVeterinario === 'todos' || agenda.veterinario === filterVeterinario;
    const matchesTipo = filterTipo === 'todos' || agenda.tipo === filterTipo;
    const matchesStatus = filterStatus === 'todos' || agenda.status === filterStatus;

    // Filtro por data baseado na view mode
    let matchesDate = true;
    if (viewMode === 'dia') {
      matchesDate = format(agenda.data, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    } else if (viewMode === 'semana') {
      const weekStart = startOfWeek(date);
      const weekEnd = endOfWeek(date);
      matchesDate = agenda.data >= weekStart && agenda.data <= weekEnd;
    } else if (viewMode === 'mes') {
      matchesDate = isSameMonth(agenda.data, date);
    }

    return matchesSearch && matchesVeterinario && matchesTipo && matchesStatus && matchesDate;
  });

  // Agrupar por data para visualização
  const agendasPorData = filteredAgendas.reduce((acc, agenda) => {
    const dateKey = format(agenda.data, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(agenda);
    return acc;
  }, {} as Record<string, AgendamentoFirebase[]>);

  // Horários disponíveis
  const horariosDisponiveis = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  // Tipos de agendamento
  const tiposAgendamento = [
    { value: 'consulta', label: 'Consulta', icon: Stethoscope, color: 'bg-blue-500' },
    { value: 'retorno', label: 'Retorno', icon: CalendarDays, color: 'bg-green-500' },
    { value: 'cirurgia', label: 'Cirurgia', icon: Pill, color: 'bg-red-500' },
    { value: 'vacina', label: 'Vacina', icon: Bell, color: 'bg-yellow-500' },
    { value: 'exame', label: 'Exame', icon: Eye, color: 'bg-purple-500' },
    { value: 'banho', label: 'Banho', icon: User, color: 'bg-cyan-500' },
    { value: 'tosa', label: 'Tosa', icon: Users, color: 'bg-pink-500' },
  ];

  // Funções
  const handleSaveAgenda = async () => {
    if (!formData.pacienteId) {
      toast({
        title: 'Atenção',
        description: 'Selecione um paciente',
        variant: 'destructive',
      });
      return;
    }

    try {
      const pacienteSelecionado = pacientes.find(p => p.id === formData.pacienteId);

      if (selectedAgenda && selectedAgenda.id) {
        // Atualizar agendamento existente
        await agendaService.atualizarAgendamento(selectedAgenda.id, {
          ...formData,
          pacienteNome: pacienteSelecionado?.nome,
          pacienteEspecie: pacienteSelecionado?.especie,
          pacienteRaca: pacienteSelecionado?.raca,
          proprietarioNome: pacienteSelecionado?.proprietario,
          proprietarioTelefone: pacienteSelecionado?.telefone
        });

        toast({
          title: 'Sucesso',
          description: 'Agendamento atualizado com sucesso',
        });
      } else {
        // Criar novo agendamento
        await agendaService.criarAgendamento({
          ...formData,
          status: 'agendado',
          pacienteNome: pacienteSelecionado?.nome,
          pacienteEspecie: pacienteSelecionado?.especie,
          pacienteRaca: pacienteSelecionado?.raca,
          proprietarioNome: pacienteSelecionado?.proprietario,
          proprietarioTelefone: pacienteSelecionado?.telefone,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        });

        toast({
          title: 'Sucesso',
          description: 'Agendamento realizado com sucesso',
        });
      }

      setIsDialogOpen(false);
      resetForm();

    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o agendamento',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAgenda = async (id: string, descricao: string) => {
    if (!confirm(`Cancelar o agendamento "${descricao}"?`)) {
      return;
    }

    try {
      await agendaService.alterarStatus(id, 'cancelado');

      toast({
        title: 'Sucesso',
        description: 'Agendamento cancelado',
      });

    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cancelar o agendamento',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (id: string, novoStatus: AgendamentoFirebase['status']) => {
    try {
      await agendaService.alterarStatus(id, novoStatus);

      toast({
        title: 'Sucesso',
        description: `Status alterado para ${statusConfig[novoStatus].label}`,
      });

    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status',
        variant: 'destructive',
      });
    }
  };

  const enviarLembrete = async (agendamentoId: string) => {
    try {
      await agendaService.enviarLembrete(agendamentoId, 'whatsapp');

      toast({
        title: 'Lembrete enviado',
        description: 'Lembrete enviado via WhatsApp',
      });

    } catch (error) {
      console.error('Erro ao enviar lembrete:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar o lembrete',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      data: new Date(),
      hora: '09:00',
      pacienteId: '',
      veterinario: 'Dr. João Silva',
      tipo: 'consulta',
      descricao: '',
      observacoes: '',
      duracao: 30,
      valor: 0
    });
    setSelectedAgenda(null);
  };

  const openEditDialog = (agenda: AgendamentoFirebase) => {
    setSelectedAgenda(agenda);
    setFormData({
      data: agenda.data,
      hora: agenda.hora,
      pacienteId: agenda.pacienteId || '',
      veterinario: agenda.veterinario,
      tipo: agenda.tipo,
      descricao: agenda.descricao,
      observacoes: agenda.observacoes || '',
      duracao: agenda.duracao,
      valor: agenda.valor
    });
    setIsDialogOpen(true);
  };

  const openDetails = (agenda: AgendamentoFirebase) => {
    setSelectedAgenda(agenda);
    setIsDetailsOpen(true);
  };

  // Obter paciente por ID
  const getPacienteById = (id: string) => {
    return pacientes.find(p => p.id === id);
  };

  // Gerar agenda da semana
  const getWeekDays = () => {
    const start = startOfWeek(date);
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(start, i));
    }
    return days;
  };

  // Obter agendas por data e hora
  const getAgendasPorDataHora = (data: Date, hora: string) => {
    return filteredAgendas.filter(a =>
      format(a.data, 'yyyy-MM-dd') === format(data, 'yyyy-MM-dd') &&
      a.hora === hora
    );
  };

  // Exportar para Excel
  const exportarParaExcel = () => {
    const dadosParaExportar = filteredAgendas.map(agenda => ({
      Data: format(agenda.data, 'dd/MM/yyyy'),
      Hora: agenda.hora,
      Paciente: agenda.pacienteNome || '',
      Espécie: agenda.pacienteEspecie || '',
      Raça: agenda.pacienteRaca || '',
      Veterinário: agenda.veterinario,
      Tipo: agenda.tipo,
      Status: agenda.status,
      Descrição: agenda.descricao,
      'Duração (min)': agenda.duracao,
      Valor: agenda.valor
    }));

    // Aqui você implementaria a exportação real
    console.log('Dados para exportação:', dadosParaExportar);

    toast({
      title: 'Exportação',
      description: 'Dados preparados para exportação (ver console)',
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CalendarIcon className="h-8 w-8 text-red-500" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Agenda Completa</h1>
                <p className="text-gray-400 text-sm md:text-base">Controle completo de agendamentos do SofVet</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs bg-black/50 border-red-600/50 text-white">
                <CalendarDays className="h-3 w-3 mr-1" /> Agenda Inteligente
              </Badge>
              <span className="text-xs text-gray-500">• Multi-veterinários • Status em tempo real • Lembretes automáticos</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="border-red-600/50 text-white hover:bg-red-600/20"
              onClick={() => window.print()}
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button
              variant="outline"
              className="border-red-600/50 text-white hover:bg-red-600/20"
              onClick={exportarParaExcel}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Card className="bg-black/50 border-red-600/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Hoje</p>
                  <p className="text-xl font-bold text-white">{estatisticas.hoje}</p>
                  <p className="text-xs text-gray-500">R$ {estatisticas.faturamentoDia.toFixed(2)}</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-red-500 bg-red-500/20 p-1 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-red-600/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Confirmados</p>
                  <p className="text-xl font-bold text-green-500">{estatisticas.confirmados}</p>
                  <p className="text-xs text-gray-500">Próximos</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500 bg-green-500/20 p-1 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-red-600/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Agendados</p>
                  <p className="text-xl font-bold text-blue-500">{estatisticas.agendados}</p>
                  <p className="text-xs text-gray-500">Pendentes</p>
                </div>
                <Bell className="h-8 w-8 text-blue-500 bg-blue-500/20 p-1 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-red-600/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Faturamento Mês</p>
                  <p className="text-xl font-bold text-purple-500">R$ {estatisticas.faturamentoMes.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
                <CalendarDays className="h-8 w-8 text-purple-500 bg-purple-500/20 p-1 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles de Visualização */}
        <Card className="mb-6 bg-black/50 border-red-600/30">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Navegação de Data */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-600/50 text-white hover:bg-red-600/20"
                      onClick={() => setDate(addDays(date, -1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal border-red-600/50 text-white hover:bg-red-600/20"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-black border-red-600/30">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(date) => date && setDate(date)}
                          initialFocus
                          className="bg-black text-white"
                        />
                      </PopoverContent>
                    </Popover>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-600/50 text-white hover:bg-red-600/20"
                      onClick={() => setDate(addDays(date, 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-600/50 text-white hover:bg-red-600/20"
                      onClick={() => setDate(new Date())}
                    >
                      Hoje
                    </Button>
                  </div>

                  {/* Modos de Visualização */}
                  <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full sm:w-auto">
                    <TabsList className="bg-black/30 border border-red-600/30">
                      <TabsTrigger value="dia" className="text-white data-[state=active]:bg-red-600/50">Dia</TabsTrigger>
                      <TabsTrigger value="semana" className="text-white data-[state=active]:bg-red-600/50">Semana</TabsTrigger>
                      <TabsTrigger value="mes" className="text-white data-[state=active]:bg-red-600/50">Mês</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={filterVeterinario} onValueChange={setFilterVeterinario}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-black/30 border-red-600/50 text-white">
                    <SelectValue placeholder="Veterinário" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-600/30">
                    <SelectItem value="todos" className="text-white focus:bg-red-600/20">Todos</SelectItem>
                    {veterinarios.map(vet => (
                      <SelectItem key={vet.id} value={vet.nome} className="text-white focus:bg-red-600/20">
                        {vet.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterTipo} onValueChange={setFilterTipo}>
                  <SelectTrigger className="w-full sm:w-[150px] bg-black/30 border-red-600/50 text-white">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-600/30">
                    <SelectItem value="todos" className="text-white focus:bg-red-600/20">Todos</SelectItem>
                    {tiposAgendamento.map(tipo => (
                      <SelectItem key={tipo.value} value={tipo.value} className="text-white focus:bg-red-600/20">
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[150px] bg-black/30 border-red-600/50 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-600/30">
                    <SelectItem value="todos" className="text-white focus:bg-red-600/20">Todos</SelectItem>
                    {Object.entries(statusConfig).map(([value, config]) => (
                      <SelectItem key={value} value={value} className="text-white focus:bg-red-600/20">
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Busca */}
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por paciente, veterinário, descrição..."
                  className="pl-10 bg-black/30 border-red-600/50 text-white placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualização da Agenda */}
        <Card className="mb-6 bg-black/50 border-red-600/30 overflow-hidden">
          <CardHeader className="border-b border-red-600/30">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white">Agenda {viewMode === 'dia' ? 'do Dia' : viewMode === 'semana' ? 'da Semana' : 'do Mês'}</CardTitle>
                <CardDescription className="text-gray-400">
                  {viewMode === 'dia'
                    ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    : viewMode === 'semana'
                      ? `${format(startOfWeek(date), "dd/MM", { locale: ptBR })} a ${format(endOfWeek(date), "dd/MM/yyyy", { locale: ptBR })}`
                      : format(date, "MMMM 'de' yyyy", { locale: ptBR })}
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-red-600/50 text-red-300">
                {filteredAgendas.length} agendamentos
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-red-500" />
                <p className="text-gray-400 mt-2">Carregando agenda...</p>
              </div>
            ) : viewMode === 'semana' ? (
              /* Visualização Semanal */
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-8 border-b border-red-600/30">
                    <div className="p-3 border-r border-red-600/30 bg-black/30">
                      <p className="text-sm font-medium text-gray-400">Hora</p>
                    </div>
                    {getWeekDays().map((day, index) => (
                      <div
                        key={index}
                        className={`p-3 border-r border-red-600/30 text-center ${isToday(day) ? 'bg-red-900/20' : ''}`}
                      >
                        <p className="text-sm font-medium text-white">
                          {format(day, 'EEE', { locale: ptBR })}
                        </p>
                        <p className={`text-lg font-bold ${isToday(day) ? 'text-red-400' : 'text-gray-300'}`}>
                          {format(day, 'dd')}
                        </p>
                      </div>
                    ))}
                  </div>

                  {horariosDisponiveis.map((hora) => (
                    <div key={hora} className="grid grid-cols-8 border-b border-red-600/30 hover:bg-red-600/5">
                      <div className="p-3 border-r border-red-600/30 bg-black/30">
                        <p className="text-sm font-medium text-gray-300">{hora}</p>
                      </div>
                      {getWeekDays().map((day, index) => {
                        const agendasNoSlot = getAgendasPorDataHora(day, hora);
                        return (
                          <div
                            key={index}
                            className="p-2 border-r border-red-600/30 min-h-[80px] relative"
                          >
                            {agendasNoSlot.map((agenda) => {
                              const tipoConfig = tiposAgendamento.find(t => t.value === agenda.tipo);
                              const statusConfigItem = statusConfig[agenda.status];

                              return (
                                <div
                                  key={agenda.id}
                                  className={`mb-1 p-2 rounded text-xs cursor-pointer ${tipoConfig?.color || 'bg-gray-600'} ${statusConfigItem.color} border-l-4 ${statusConfigItem.color.split(' ')[0]}`}
                                  onClick={() => openDetails(agenda)}
                                  title={`${agenda.pacienteNome} - ${agenda.descricao}`}
                                >
                                  <div className="font-semibold truncate">{agenda.pacienteNome}</div>
                                  <div className="truncate">{agenda.descricao}</div>
                                  <div className="flex justify-between items-center mt-1">
                                    <span className="truncate">{agenda.veterinario.split(' ')[1]}</span>
                                    <Badge className="text-xs px-1 py-0">
                                      {agenda.duracao}min
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}

                            {agendasNoSlot.length === 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full h-full text-gray-500 hover:text-white hover:bg-red-600/10 opacity-0 hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  setFormData({ ...formData, data: day, hora });
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ) : viewMode === 'dia' ? (
              /* Visualização Diária */
              <div className="p-4">
                <div className="space-y-4">
                  {horariosDisponiveis.map((hora) => {
                    const agendasNoHorario = filteredAgendas.filter(a => a.hora === hora);
                    return (
                      <div key={hora} className="flex border-b border-red-600/30 pb-4">
                        <div className="w-20 flex-shrink-0">
                          <p className="text-sm font-medium text-gray-300">{hora}</p>
                        </div>
                        <div className="flex-1">
                          {agendasNoHorario.length > 0 ? (
                            agendasNoHorario.map((agenda) => {
                              const tipoConfig = tiposAgendamento.find(t => t.value === agenda.tipo);
                              const statusConfigItem = statusConfig[agenda.status];

                              return (
                                <Card
                                  key={agenda.id}
                                  className={`mb-2 border-l-4 ${statusConfigItem.color.split(' ')[0]} border-red-600/30`}
                                >
                                  <CardContent className="p-3">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <Badge className={`${statusConfigItem.color} text-xs`}>
                                            {statusConfigItem.label}
                                          </Badge>
                                          <Badge variant="outline" className="text-xs border-gray-600">
                                            {tipoConfig?.label || agenda.tipo}
                                          </Badge>
                                        </div>
                                        <h4 className="font-semibold text-white">{agenda.pacienteNome}</h4>
                                        <p className="text-sm text-gray-400">{agenda.descricao}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                          <span className="text-xs text-gray-500">
                                            <User className="inline h-3 w-3 mr-1" />
                                            {agenda.veterinario}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            <Clock className="inline h-3 w-3 mr-1" />
                                            {agenda.duracao} min
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            R$ {agenda.valor.toFixed(2)}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 text-blue-400 hover:bg-blue-600/20"
                                          onClick={() => openEditDialog(agenda)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 text-red-400 hover:bg-red-600/20"
                                          onClick={() => agenda.id && handleDeleteAgenda(agenda.id, agenda.descricao)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })
                          ) : (
                            <div className="text-center py-6 border border-dashed border-red-600/30 rounded-lg">
                              <p className="text-gray-500">Horário disponível</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2 text-red-400 hover:text-red-300"
                                onClick={() => {
                                  setFormData({ ...formData, hora });
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Agendar neste horário
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Visualização Mensal (Lista) */
              <div className="p-4">
                <div className="space-y-4">
                  {Object.entries(agendasPorData).map(([dateKey, agendasDaData]) => (
                    <div key={dateKey} className="border border-red-600/30 rounded-lg overflow-hidden">
                      <div className="bg-black/70 p-3 border-b border-red-600/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CalendarIcon className="h-5 w-5 text-red-500" />
                            <h3 className="font-semibold text-white">
                              {format(parseISO(dateKey), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                            </h3>
                            {isToday(parseISO(dateKey)) && (
                              <Badge className="bg-red-600">Hoje</Badge>
                            )}
                          </div>
                          <Badge variant="outline" className="border-red-600/50">
                            {agendasDaData.length} agendamentos
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-red-600/30">
                              <TableHead className="text-white">Hora</TableHead>
                              <TableHead className="text-white">Paciente</TableHead>
                              <TableHead className="text-white">Tipo</TableHead>
                              <TableHead className="text-white">Veterinário</TableHead>
                              <TableHead className="text-white">Status</TableHead>
                              <TableHead className="text-white">Valor</TableHead>
                              <TableHead className="text-right text-white">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {agendasDaData.map((agenda) => {
                              const tipoConfig = tiposAgendamento.find(t => t.value === agenda.tipo);
                              const statusConfigItem = statusConfig[agenda.status];

                              return (
                                <TableRow key={agenda.id} className="border-red-600/30">
                                  <TableCell className="font-medium text-white">
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                      {agenda.hora}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-white">
                                    <div>
                                      <div className="font-medium">{agenda.pacienteNome}</div>
                                      <div className="text-xs text-gray-400">{agenda.pacienteEspecie} • {agenda.pacienteRaca}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="text-xs border-gray-600 text-white">
                                      {tipoConfig?.label || agenda.tipo}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-white">
                                    {agenda.veterinario}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={`${statusConfigItem.color} text-xs`}>
                                      {statusConfigItem.label}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-white">
                                    R$ {agenda.valor.toFixed(2)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-blue-400 hover:bg-blue-600/20"
                                        onClick={() => openEditDialog(agenda)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-red-400 hover:bg-red-600/20"
                                        onClick={() => agenda.id && handleDeleteAgenda(agenda.id, agenda.descricao)}
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
                    </div>
                  ))}

                  {Object.keys(agendasPorData).length === 0 && (
                    <div className="text-center py-12">
                      <CalendarDays className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">Nenhum agendamento encontrado</h3>
                      <p className="text-gray-500">
                        {searchTerm
                          ? `Nenhum resultado para "${searchTerm}"`
                          : "Não há agendamentos para o período selecionado"}
                      </p>
                      <Button
                        className="mt-4 bg-red-600 hover:bg-red-700"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Agendamento
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal: Novo/Editar Agendamento */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl bg-black/90 border-red-600/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedAgenda ? 'Editar Agendamento' : 'Novo Agendamento'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {selectedAgenda
                  ? 'Atualize os dados do agendamento'
                  : 'Preencha os dados para agendar uma consulta'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data" className="text-white">Data *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-black/30 border-red-600/50 text-white hover:bg-red-600/20"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.data, "dd/MM/yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-black border-red-600/30">
                      <Calendar
                        mode="single"
                        selected={formData.data}
                        onSelect={(date) => date && setFormData({ ...formData, data: date })}
                        initialFocus
                        className="bg-black text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="hora" className="text-white">Hora *</Label>
                  <Select value={formData.hora} onValueChange={(value) => setFormData({ ...formData, hora: value })}>
                    <SelectTrigger className="bg-black/30 border-red-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-red-600/30">
                      {horariosDisponiveis.map(hora => (
                        <SelectItem key={hora} value={hora} className="text-white focus:bg-red-600/20">
                          {hora}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="pacienteId" className="text-white">Paciente *</Label>
                  <Select value={formData.pacienteId} onValueChange={(value) => setFormData({ ...formData, pacienteId: value })}>
                    <SelectTrigger className="bg-black/30 border-red-600/50 text-white">
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-red-600/30">
                      {pacientes.map(paciente => (
                        <SelectItem key={paciente.id} value={paciente.id} className="text-white focus:bg-red-600/20">
                          {paciente.nome} ({paciente.especie} - {paciente.raca})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="veterinario" className="text-white">Veterinário *</Label>
                  <Select value={formData.veterinario} onValueChange={(value) => setFormData({ ...formData, veterinario: value })}>
                    <SelectTrigger className="bg-black/30 border-red-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-red-600/30">
                      {veterinarios.map(vet => (
                        <SelectItem key={vet.id} value={vet.nome} className="text-white focus:bg-red-600/20">
                          {vet.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tipo" className="text-white">Tipo *</Label>
                  <Select value={formData.tipo} onValueChange={(value: any) => setFormData({ ...formData, tipo: value })}>
                    <SelectTrigger className="bg-black/30 border-red-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-red-600/30">
                      {tiposAgendamento.map(tipo => {
                        const Icon = tipo.icon;
                        return (
                          <SelectItem key={tipo.value} value={tipo.value} className="text-white focus:bg-red-600/20">
                            <div className="flex items-center">
                              <Icon className="h-4 w-4 mr-2" />
                              {tipo.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duracao" className="text-white">Duração (minutos) *</Label>
                  <Select value={formData.duracao.toString()} onValueChange={(value) => setFormData({ ...formData, duracao: parseInt(value) })}>
                    <SelectTrigger className="bg-black/30 border-red-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-red-600/30">
                      <SelectItem value="20" className="text-white focus:bg-red-600/20">20 minutos</SelectItem>
                      <SelectItem value="30" className="text-white focus:bg-red-600/20">30 minutos</SelectItem>
                      <SelectItem value="45" className="text-white focus:bg-red-600/20">45 minutos</SelectItem>
                      <SelectItem value="60" className="text-white focus:bg-red-600/20">1 hora</SelectItem>
                      <SelectItem value="90" className="text-white focus:bg-red-600/20">1 hora 30</SelectItem>
                      <SelectItem value="120" className="text-white focus:bg-red-600/20">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="valor" className="text-white">Valor (R$) *</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                    className="bg-black/30 border-red-600/50 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="descricao" className="text-white">Descrição *</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Ex: Consulta de rotina, Vacinação anual, Castração..."
                  className="bg-black/30 border-red-600/50 text-white"
                />
              </div>

              <div>
                <Label htmlFor="observacoes" className="text-white">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações importantes, instruções, etc."
                  rows={3}
                  className="bg-black/30 border-red-600/50 text-white"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="border-red-600/50 text-white hover:bg-red-600/20"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveAgenda}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                {selectedAgenda ? 'Atualizar' : 'Agendar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal: Detalhes do Agendamento */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl bg-black/90 border-red-600/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Detalhes do Agendamento</DialogTitle>
            </DialogHeader>

            {selectedAgenda && (
              <div className="space-y-6 py-4">
                {/* Cabeçalho */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={`${statusConfig[selectedAgenda.status].color}`}>
                        {statusConfig[selectedAgenda.status].label}
                      </Badge>
                      <Badge variant="outline" className="border-gray-600">
                        {tiposAgendamento.find(t => t.value === selectedAgenda.tipo)?.label || selectedAgenda.tipo}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-white">{selectedAgenda.descricao}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-400">R$ {selectedAgenda.valor.toFixed(2)}</p>
                    <p className="text-sm text-gray-400">{selectedAgenda.duracao} minutos</p>
                  </div>
                </div>

                <Separator className="bg-red-600/30" />

                {/* Informações */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Data e Hora</h4>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-red-500" />
                        <span className="text-white">
                          {format(selectedAgenda.data, "dd/MM/yyyy")} às {selectedAgenda.hora}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Veterinário</h4>
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-red-500" />
                        <span className="text-white">{selectedAgenda.veterinario}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Paciente</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-red-500" />
                          <span className="text-white">{selectedAgenda.pacienteNome}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Home className="h-5 w-5 text-red-500" />
                          <span className="text-white">{selectedAgenda.pacienteEspecie} • {selectedAgenda.pacienteRaca}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-red-500" />
                          <span className="text-white">{selectedAgenda.proprietarioTelefone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-red-500" />
                          <span className="text-white">{selectedAgenda.proprietarioNome}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedAgenda.observacoes && (
                  <>
                    <Separator className="bg-red-600/30" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Observações</h4>
                      <p className="text-white bg-black/30 p-3 rounded border border-red-600/30">
                        {selectedAgenda.observacoes}
                      </p>
                    </div>
                  </>
                )}

                <Separator className="bg-red-600/30" />

                {/* Ações */}
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Select
                      value={selectedAgenda.status}
                      onValueChange={(value: any) => selectedAgenda.id && handleStatusChange(selectedAgenda.id, value)}
                    >
                      <SelectTrigger className="w-[180px] bg-black/30 border-red-600/50 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-red-600/30">
                        {Object.entries(statusConfig).map(([value, config]) => (
                          <SelectItem key={value} value={value} className="text-white focus:bg-red-600/20">
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      className="border-red-600/50 text-white hover:bg-red-600/20"
                      onClick={() => {
                        setIsDetailsOpen(false);
                        openEditDialog(selectedAgenda);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>

                    <Button
                      variant="outline"
                      className="border-green-600/50 text-green-400 hover:bg-green-600/20"
                      onClick={() => selectedAgenda.id && enviarLembrete(selectedAgenda.id)}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Lembrete
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="border-red-600/50 text-red-400 hover:bg-red-600/20"
                    onClick={() => selectedAgenda.id && handleDeleteAgenda(selectedAgenda.id, selectedAgenda.descricao)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AgendaCompleta;