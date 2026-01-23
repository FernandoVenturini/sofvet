import { useState, useEffect, useRef } from 'react';
import { Calendar, dateFnsLocalizer, Event, View } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addMinutes from 'date-fns/addMinutes';
import isValid from 'date-fns/isValid';
import ptBR from 'date-fns/locale/pt-BR';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription
} from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
	CalendarIcon,
	Clock,
	User,
	Filter,
	Search,
	Plus,
	ChevronLeft,
	ChevronRight,
	Menu,
	X,
	Download,
	Edit,
	Eye,
	AlertTriangle,
	CheckCircle,
	Users,
	PawPrint,
	Bell,
	BarChart3,
	Sparkles,
	RefreshCw,
	Zap,
	Activity,
	CalendarDays,
	Clock4,
	MapPin,
	Stethoscope
} from 'lucide-react';
import './AgendaCompleta.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
	'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales: { 'pt-BR': ptBR },
});

interface AgendaEvent extends Event {
	id: string;
	title: string;
	animal: string;
	proprietario: string;
	veterinario: string;
	tipo: 'consulta' | 'retorno_vacina' | 'bloqueado' | 'cirurgia' | 'exame';
	status: 'agendada' | 'atrasada' | 'concluida' | 'cancelada';
	observacoes?: string;
	animalId?: string;
	telefone?: string;
}

const veterinarios = [
	{ id: '1', nome: 'Dr. João Silva', cor: 'from-blue-600/20 to-cyan-600/20', especialidade: 'Clínica Geral' },
	{ id: '2', nome: 'Dra. Maria Oliveira', cor: 'from-purple-600/20 to-pink-600/20', especialidade: 'Cirurgia' },
	{ id: '3', nome: 'Dr. Pedro Santos', cor: 'from-emerald-600/20 to-green-600/20', especialidade: 'Dermatologia' },
	{ id: '4', nome: 'Dra. Ana Costa', cor: 'from-amber-600/20 to-orange-600/20', especialidade: 'Ortopedia' },
];

const tiposEvento = [
	{ value: 'consulta', label: 'Consulta', color: 'from-blue-600/20 to-cyan-600/20', textColor: 'text-blue-400' },
	{ value: 'retorno_vacina', label: 'Retorno/Vacina', color: 'from-emerald-600/20 to-green-600/20', textColor: 'text-emerald-400' },
	{ value: 'cirurgia', label: 'Cirurgia', color: 'from-red-600/20 to-pink-600/20', textColor: 'text-red-400' },
	{ value: 'exame', label: 'Exame', color: 'from-purple-600/20 to-violet-600/20', textColor: 'text-purple-400' },
	{ value: 'bloqueado', label: 'Horário Bloqueado', color: 'from-gray-600/20 to-gray-700/20', textColor: 'text-gray-400' },
];

const statusOptions = [
	{ value: 'agendada', label: 'Agendada', color: 'from-blue-600/20 to-cyan-600/20', textColor: 'text-blue-400' },
	{ value: 'atrasada', label: 'Atrasada', color: 'from-red-600/20 to-pink-600/20', textColor: 'text-red-400' },
	{ value: 'concluida', label: 'Concluída', color: 'from-emerald-600/20 to-green-600/20', textColor: 'text-emerald-400' },
	{ value: 'cancelada', label: 'Cancelada', color: 'from-gray-600/20 to-gray-700/20', textColor: 'text-gray-400' },
];

const AgendaCompleta = () => {
	const { toast } = useToast();
	const calendarRef = useRef<any>(null);

	// Estado para responsividade
	const [isMobile, setIsMobile] = useState(false);
	const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

	const [events, setEvents] = useState<AgendaEvent[]>([]);
	const [currentView, setCurrentView] = useState<View>('week');
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedSlot, setSelectedSlot] = useState<any>(null);
	const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);
	const [showFilters, setShowFilters] = useState(true);
	const [showMobileMenu, setShowMobileMenu] = useState(false);

	const [animalBusca, setAnimalBusca] = useState('');
	const [animalSelecionado, setAnimalSelecionado] = useState<any>(null);
	const [veterinario, setVeterinario] = useState(veterinarios[0].nome);
	const [observacoes, setObservacoes] = useState('');
	const [filterStatus, setFilterStatus] = useState('todos');
	const [filterTipo, setFilterTipo] = useState('todos');
	const [filterVeterinario, setFilterVeterinario] = useState('todos');

	const [animais, setAnimais] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	// Detectar tamanho da tela
	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			setWindowWidth(width);
			setIsMobile(width < 768);

			if (width < 768 && currentView !== 'agenda') {
				setCurrentView('agenda');
				setShowFilters(false);
			} else if (width >= 768 && currentView === 'agenda') {
				setCurrentView('week');
				setShowFilters(true);
			}
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, [currentView]);

	// Ajustar view baseado no tamanho da tela
	useEffect(() => {
		if (windowWidth < 768 && currentView !== 'agenda') {
			setCurrentView('agenda');
		} else if (windowWidth >= 768 && currentView === 'agenda') {
			setCurrentView('week');
		}
	}, [windowWidth, currentView]);

	// Carregar dados
	useEffect(() => {
		carregarDados();
	}, []);

	const carregarDados = async () => {
		setLoading(true);
		const novosEvents: AgendaEvent[] = [];

		try {
			const animaisSnap = await getDocs(collection(db, 'animais'));
			const listaAnimais = animaisSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
			setAnimais(listaAnimais);

			// Mock data para demonstração
			const hoje = new Date();

			// Eventos de exemplo
			novosEvents.push({
				id: '1',
				title: 'Rex - Consulta de Rotina',
				start: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 9, 0),
				end: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 9, 30),
				animal: 'Rex',
				proprietario: 'Carlos Silva',
				veterinario: 'Dr. João Silva',
				tipo: 'consulta',
				status: 'agendada',
				observacoes: 'Animal apresenta coceira persistente',
			});

			novosEvents.push({
				id: '2',
				title: 'Luna - Vacina V10',
				start: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1, 10, 0),
				end: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1, 10, 30),
				animal: 'Luna',
				proprietario: 'Ana Oliveira',
				veterinario: 'Dra. Maria Oliveira',
				tipo: 'retorno_vacina',
				status: 'agendada',
			});

			novosEvents.push({
				id: '3',
				title: 'Thor - Castração',
				start: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 2, 8, 0),
				end: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 2, 10, 0),
				animal: 'Thor',
				proprietario: 'Pedro Santos',
				veterinario: 'Dr. Pedro Santos',
				tipo: 'cirurgia',
				status: 'agendada',
			});

			// Horários bloqueados (almoço)
			for (let i = 0; i < 7; i++) {
				const dia = new Date(hoje);
				dia.setDate(dia.getDate() + i);
				const inicio = new Date(dia);
				inicio.setHours(12, 0, 0, 0);
				const fim = new Date(dia);
				fim.setHours(13, 0, 0, 0);

				novosEvents.push({
					id: `bloqueado-${i}`,
					title: 'Almoço',
					start: inicio,
					end: fim,
					animal: '',
					proprietario: '',
					veterinario: '',
					tipo: 'bloqueado',
					status: 'agendada',
				});
			}

			setEvents(novosEvents);
		} catch (error) {
			console.error('Erro ao carregar dados:', error);
			toast({
				title: 'Erro',
				description: 'Não foi possível carregar os agendamentos',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	// Filtrar eventos
	const filteredEvents = events.filter(event => {
		if (filterStatus !== 'todos' && event.status !== filterStatus) return false;
		if (filterTipo !== 'todos' && event.tipo !== filterTipo) return false;
		if (filterVeterinario !== 'todos' && event.veterinario !== filterVeterinario) return false;
		if (animalBusca && !event.animal.toLowerCase().includes(animalBusca.toLowerCase())) return false;
		return true;
	});

	// Estatísticas
	const estatisticas = {
		total: filteredEvents.length,
		hoje: filteredEvents.filter(e =>
			format(e.start, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
		).length,
		atrasados: filteredEvents.filter(e => e.status === 'atrasada').length,
		proximos7Dias: filteredEvents.filter(e => {
			const hoje = new Date();
			const seteDias = new Date();
			seteDias.setDate(hoje.getDate() + 7);
			return e.start >= hoje && e.start <= seteDias;
		}).length,
		valorTotal: filteredEvents.filter(e => e.tipo !== 'bloqueado').length * 150, // Valor médio de R$150
		veterinariosAtivos: new Set(filteredEvents.map(e => e.veterinario)).size,
	};

	// Estilos dos eventos
	const eventStyleGetter = (event: AgendaEvent) => {
		let backgroundColor = '';
		let color = 'white';
		let border = 'none';

		const tipoConfig = tiposEvento.find(t => t.value === event.tipo);
		const statusConfig = statusOptions.find(s => s.value === event.status);

		if (tipoConfig) {
			switch (event.tipo) {
				case 'consulta':
					backgroundColor = event.status === 'atrasada' ? '#dc2626' : '#2563eb';
					break;
				case 'retorno_vacina':
					backgroundColor = event.status === 'atrasada' ? '#d97706' : '#059669';
					break;
				case 'cirurgia':
					backgroundColor = event.status === 'atrasada' ? '#b91c1c' : '#7c3aed';
					break;
				case 'exame':
					backgroundColor = event.status === 'atrasada' ? '#c2410c' : '#9333ea';
					break;
				case 'bloqueado':
					backgroundColor = '#4b5563';
					color = '#9ca3af';
					break;
			}
		}

		return {
			style: {
				backgroundColor,
				color,
				border,
				borderRadius: '4px',
				fontSize: isMobile ? '0.75rem' : '0.875rem',
				padding: isMobile ? '2px 4px' : '4px 8px',
			},
		};
	};

	// Navegação
	const navigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
		if (calendarRef.current) {
			calendarRef.current[action]();
		}
	};

	const resetarFiltros = () => {
		setAnimalBusca('');
		setFilterStatus('todos');
		setFilterTipo('todos');
		setFilterVeterinario('todos');
	};

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
				<p className="text-gray-400">Carregando agendamentos...</p>
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
							<CalendarDays className="h-6 w-6 text-red-400" />
						</div>
						<Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 border border-red-500/30">
							<Sparkles className="h-3 w-3 mr-1" />
							Agenda Inteligente
						</Badge>
					</div>
					<h1 className="text-4xl font-bold text-green-400">
						Agenda Veterinária
					</h1>
					<p className="text-gray-400 mt-2">
						Gerencie todos os agendamentos e consultas da clínica
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Button
						variant="outline"
						className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
						onClick={() => { }}
					>
						<Download className="h-4 w-4 mr-2" />
						Exportar
					</Button>
					<Button
						className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
						onClick={() => setSelectedSlot({ start: new Date(), end: addMinutes(new Date(), 30) })}
					>
						<Plus className="h-4 w-4" />
						Novo Agendamento
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-gray-400">Agendamentos Hoje</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-white">{estatisticas.hoje}</p>
								<p className="text-sm text-gray-400">{format(new Date(), 'dd/MM/yyyy')}</p>
							</div>
							<div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
								<CalendarIcon className="h-5 w-5 text-red-400" />
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
								<p className="text-3xl font-bold text-amber-400">{estatisticas.atrasados}</p>
								<p className="text-sm text-gray-400">Necessitam atenção</p>
							</div>
							<div className="p-2 rounded-lg bg-gradient-to-br from-amber-600/20 to-orange-600/20">
								<AlertTriangle className="h-5 w-5 text-amber-400" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-gray-400">Próximos 7 Dias</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-emerald-400">{estatisticas.proximos7Dias}</p>
								<p className="text-sm text-gray-400">Agendamentos previstos</p>
							</div>
							<div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20">
								<Clock4 className="h-5 w-5 text-emerald-400" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-gray-400">Veterinários Ativos</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-blue-400">{estatisticas.veterinariosAtivos}</p>
								<p className="text-sm text-gray-400">Em atendimento</p>
							</div>
							<div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
								<Stethoscope className="h-5 w-5 text-blue-400" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filtros e Busca */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Filtros */}
				{(showFilters || !isMobile) && (
					<div className={`lg:col-span-1 ${isMobile ? 'fixed inset-0 z-50 bg-gray-900/95 p-6 overflow-y-auto' : ''}`}>
						{isMobile && (
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-xl font-semibold text-white">Filtros</h2>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setShowFilters(false)}
									className="text-white hover:bg-red-600/20"
								>
									<X className="h-5 w-5" />
								</Button>
							</div>
						)}

						<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
							<CardHeader>
								<CardTitle className="text-lg flex items-center gap-2 text-white">
									<Filter className="h-5 w-5 text-red-400" />
									Filtros e Busca
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label htmlFor="search" className="text-white mb-2 block">Buscar Animal</Label>
									<div className="relative">
										<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
										<Input
											id="search"
											placeholder="Nome do animal..."
											className="pl-10 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
											value={animalBusca}
											onChange={(e) => setAnimalBusca(e.target.value)}
										/>
									</div>
								</div>

								<div>
									<Label htmlFor="status" className="text-white mb-2 block">Status</Label>
									<Select value={filterStatus} onValueChange={setFilterStatus}>
										<SelectTrigger id="status" className="bg-gray-900/50 border-gray-700/50 text-white">
											<div className="flex items-center gap-2">
												<Activity className="h-4 w-4" />
												<SelectValue placeholder="Selecione o status" />
											</div>
										</SelectTrigger>
										<SelectContent className="bg-gray-900 border-gray-800">
											<SelectItem value="todos">Todos os status</SelectItem>
											{statusOptions.map((status) => (
												<SelectItem key={status.value} value={status.value}>
													<div className="flex items-center gap-2">
														<div className={`w-2 h-2 rounded-full ${status.textColor} bg-gradient-to-r ${status.color}`} />
														{status.label}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor="tipo" className="text-white mb-2 block">Tipo de Serviço</Label>
									<Select value={filterTipo} onValueChange={setFilterTipo}>
										<SelectTrigger id="tipo" className="bg-gray-900/50 border-gray-700/50 text-white">
											<div className="flex items-center gap-2">
												<Zap className="h-4 w-4" />
												<SelectValue placeholder="Selecione o tipo" />
											</div>
										</SelectTrigger>
										<SelectContent className="bg-gray-900 border-gray-800">
											<SelectItem value="todos">Todos os tipos</SelectItem>
											{tiposEvento.map((tipo) => (
												<SelectItem key={tipo.value} value={tipo.value}>
													<div className="flex items-center gap-2">
														<div className={`w-2 h-2 rounded-full ${tipo.textColor} bg-gradient-to-r ${tipo.color}`} />
														{tipo.label}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor="veterinario" className="text-white mb-2 block">Veterinário</Label>
									<Select value={filterVeterinario} onValueChange={setFilterVeterinario}>
										<SelectTrigger id="veterinario" className="bg-gray-900/50 border-gray-700/50 text-white">
											<div className="flex items-center gap-2">
												<Users className="h-4 w-4" />
												<SelectValue placeholder="Selecione o veterinário" />
											</div>
										</SelectTrigger>
										<SelectContent className="bg-gray-900 border-gray-800">
											<SelectItem value="todos">Todos os veterinários</SelectItem>
											{veterinarios.map((vet) => (
												<SelectItem key={vet.id} value={vet.nome}>
													<div className="flex items-center gap-2">
														<div className={`w-2 h-2 rounded-full bg-gradient-to-r ${vet.cor}`} />
														{vet.nome}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<Separator className="bg-gray-800/50" />

								<div className="flex gap-2 pt-2">
									<Button
										variant="outline"
										onClick={resetarFiltros}
										className="flex-1 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
									>
										Limpar Filtros
									</Button>
									<Button
										variant="outline"
										size="icon"
										onClick={carregarDados}
										className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
									>
										<RefreshCw className="h-4 w-4" />
									</Button>
								</div>

								{isMobile && (
									<Button
										className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white mt-4"
										onClick={() => setShowFilters(false)}
									>
										Aplicar Filtros
									</Button>
								)}
							</CardContent>
						</Card>

						{/* Estatísticas rápidas */}
						{!isMobile && (
							<Card className="mt-4 bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
								<CardHeader>
									<CardTitle className="text-lg flex items-center gap-2 text-white">
										<BarChart3 className="h-5 w-5 text-red-400" />
										Resumo
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex justify-between items-center">
										<span className="text-gray-400">Total</span>
										<span className="font-medium text-white">{estatisticas.total}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-400">Valor Estimado</span>
										<span className="font-medium text-emerald-400">R$ {estatisticas.valorTotal.toFixed(2)}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-400">Animais Únicos</span>
										<span className="font-medium text-blue-400">
											{new Set(filteredEvents.map(e => e.animal)).size}
										</span>
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				)}

				{/* Calendário */}
				<div className={`${showFilters && !isMobile ? 'lg:col-span-3' : 'col-span-full'}`}>
					<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
						<CardHeader className="pb-3">
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
								<div className="flex items-center gap-2">
									{isMobile && (
										<Button
											variant="outline"
											size="icon"
											onClick={() => setShowFilters(true)}
											className="md:hidden border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
										>
											<Filter className="h-4 w-4" />
										</Button>
									)}
									<div>
										<CardTitle className="text-white flex items-center gap-2">
											<CalendarDays className="h-5 w-5 text-red-400" />
											Calendário de Agendamentos
										</CardTitle>
										<CardDescription className="text-gray-400">
											{format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
										</CardDescription>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<div className="flex items-center gap-1">
										<Button
											variant="outline"
											size="icon"
											onClick={() => navigate('PREV')}
											className="h-9 w-9 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
										>
											<ChevronLeft className="h-4 w-4" />
										</Button>

										<Button
											variant="outline"
											className="h-9 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
											onClick={() => navigate('TODAY')}
										>
											Hoje
										</Button>

										<Button
											variant="outline"
											size="icon"
											onClick={() => navigate('NEXT')}
											className="h-9 w-9 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
										>
											<ChevronRight className="h-4 w-4" />
										</Button>
									</div>

									{!isMobile ? (
										<Tabs value={currentView} onValueChange={(v) => setCurrentView(v as View)} className="ml-2">
											<TabsList className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50 p-1">
												<TabsTrigger value="agenda" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30 text-white">
													Lista
												</TabsTrigger>
												<TabsTrigger value="day" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30 text-white">
													Dia
												</TabsTrigger>
												<TabsTrigger value="week" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30 text-white">
													Semana
												</TabsTrigger>
												<TabsTrigger value="month" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30 text-white">
													Mês
												</TabsTrigger>
											</TabsList>
										</Tabs>
									) : (
										<Select value={currentView} onValueChange={(v) => setCurrentView(v as View)}>
											<SelectTrigger className="w-[120px] bg-gray-900/50 border-gray-700/50 text-white">
												<SelectValue />
											</SelectTrigger>
											<SelectContent className="bg-gray-900 border-gray-800">
												<SelectItem value="agenda">Lista</SelectItem>
												<SelectItem value="day">Dia</SelectItem>
												<SelectItem value="week">Semana</SelectItem>
												<SelectItem value="month">Mês</SelectItem>
											</SelectContent>
										</Select>
									)}
								</div>
							</div>
						</CardHeader>

						<CardContent className="p-0 sm:p-2">
							<div className="h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden">
								<Calendar
									ref={calendarRef}
									localizer={localizer}
									events={filteredEvents}
									startAccessor="start"
									endAccessor="end"
									style={{ height: '100%' }}
									view={currentView}
									onView={(view) => setCurrentView(view)}
									date={currentDate}
									onNavigate={(date) => setCurrentDate(date)}
									onSelectEvent={(event) => setSelectedEvent(event as AgendaEvent)}
									onSelectSlot={(slotInfo) => setSelectedSlot(slotInfo)}
									selectable
									eventPropGetter={eventStyleGetter}
									messages={{
										today: 'Hoje',
										previous: 'Anterior',
										next: 'Próximo',
										month: 'Mês',
										week: 'Semana',
										day: 'Dia',
										agenda: 'Lista',
										date: 'Data',
										time: 'Hora',
										event: 'Evento',
										noEventsInRange: 'Nenhum agendamento neste período',
									}}
									components={{
										toolbar: () => null,
									}}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Legenda */}
					{!isMobile && (
						<Card className="mt-4 bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
							<CardContent className="p-4">
								<div className="flex flex-wrap gap-4 items-center">
									<span className="text-gray-400 text-sm">Legenda:</span>
									{tiposEvento.map((tipo) => (
										<div key={tipo.value} className="flex items-center gap-2">
											<div className={`w-3 h-3 rounded-sm bg-gradient-to-r ${tipo.color}`} />
											<span className={`text-sm ${tipo.textColor}`}>{tipo.label}</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			{/* Modal de detalhes do evento */}
			<Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
				<DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 text-white max-w-md sm:max-w-lg">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-white">
							<CalendarIcon className="h-5 w-5 text-red-400" />
							Detalhes do Agendamento
						</DialogTitle>
						<DialogDescription className="text-gray-400">
							Informações completas do agendamento
						</DialogDescription>
					</DialogHeader>

					{selectedEvent && (
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label className="text-gray-400 text-sm">Animal</Label>
									<p className="font-medium text-white flex items-center gap-2 mt-1">
										<PawPrint className="h-4 w-4 text-blue-400" />
										{selectedEvent.animal}
									</p>
								</div>

								<div>
									<Label className="text-gray-400 text-sm">Proprietário</Label>
									<p className="font-medium text-white flex items-center gap-2 mt-1">
										<User className="h-4 w-4 text-emerald-400" />
										{selectedEvent.proprietario}
									</p>
								</div>
							</div>

							<div>
								<Label className="text-gray-400 text-sm">Data e Hora</Label>
								<p className="font-medium text-white flex items-center gap-2 mt-1">
									<Clock className="h-4 w-4 text-amber-400" />
									{format(selectedEvent.start, "dd/MM/yyyy 'às' HH:mm")}
								</p>
							</div>

							<div>
								<Label className="text-gray-400 text-sm">Veterinário</Label>
								<p className="font-medium text-white flex items-center gap-2 mt-1">
									<Stethoscope className="h-4 w-4 text-purple-400" />
									{selectedEvent.veterinario}
								</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label className="text-gray-400 text-sm">Tipo</Label>
									<div className="mt-1">
										<Badge className={`bg-gradient-to-r border ${tiposEvento.find(t => t.value === selectedEvent.tipo)?.color || 'from-gray-600/20 to-gray-700/20'
											} ${tiposEvento.find(t => t.value === selectedEvent.tipo)?.textColor || 'text-gray-400'
											} border-gray-700`}>
											{tiposEvento.find(t => t.value === selectedEvent.tipo)?.label || selectedEvent.tipo}
										</Badge>
									</div>
								</div>

								<div>
									<Label className="text-gray-400 text-sm">Status</Label>
									<div className="mt-1">
										<Badge className={`bg-gradient-to-r border ${statusOptions.find(s => s.value === selectedEvent.status)?.color || 'from-gray-600/20 to-gray-700/20'
											} ${statusOptions.find(s => s.value === selectedEvent.status)?.textColor || 'text-gray-400'
											} border-gray-700`}>
											{statusOptions.find(s => s.value === selectedEvent.status)?.label || selectedEvent.status}
										</Badge>
									</div>
								</div>
							</div>

							{selectedEvent.observacoes && (
								<div>
									<Label className="text-gray-400 text-sm">Observações</Label>
									<div className="mt-2 p-3 bg-gray-900/50 rounded-lg border border-gray-800/50">
										<p className="text-gray-300 text-sm">{selectedEvent.observacoes}</p>
									</div>
								</div>
							)}

							<DialogFooter className="pt-4">
								<Button
									variant="outline"
									className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
									onClick={() => setSelectedEvent(null)}
								>
									Fechar
								</Button>
								<Button
									className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
								>
									<Edit className="h-4 w-4" />
									Editar Agendamento
								</Button>
							</DialogFooter>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Modal de novo agendamento */}
			<Dialog open={!!selectedSlot} onOpenChange={() => setSelectedSlot(null)}>
				<DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 text-white max-w-md sm:max-w-lg">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-white">
							<Plus className="h-5 w-5 text-red-400" />
							Novo Agendamento
						</DialogTitle>
						<DialogDescription className="text-gray-400">
							Preencha os dados para agendar uma nova consulta
						</DialogDescription>
					</DialogHeader>

					<Tabs defaultValue="informacoes" className="space-y-4">
						<TabsList className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50 p-1">
							<TabsTrigger value="informacoes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30 text-white">
								Informações
							</TabsTrigger>
							<TabsTrigger value="detalhes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30 text-white">
								Detalhes
							</TabsTrigger>
						</TabsList>

						<TabsContent value="informacoes" className="space-y-4">
							<div className="space-y-3">
								<Label htmlFor="animal" className="text-white">Animal *</Label>
								<Select value={animalSelecionado?.id || ''} onValueChange={(id) => {
									const animal = animais.find(a => a.id === id);
									setAnimalSelecionado(animal);
								}}>
									<SelectTrigger id="animal" className="bg-gray-900/50 border-gray-700/50 text-white">
										<div className="flex items-center gap-2">
											<PawPrint className="h-4 w-4" />
											<SelectValue placeholder="Selecione um animal" />
										</div>
									</SelectTrigger>
									<SelectContent className="bg-gray-900 border-gray-800">
										{animais.map(animal => (
											<SelectItem
												key={animal.id}
												value={animal.id}
												className="text-white focus:bg-red-600/20"
											>
												{animal.nomeAnimal} - {animal.nomeProprietario}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-3">
								<Label htmlFor="veterinario" className="text-white">Veterinário *</Label>
								<Select value={veterinario} onValueChange={setVeterinario}>
									<SelectTrigger id="veterinario" className="bg-gray-900/50 border-gray-700/50 text-white">
										<div className="flex items-center gap-2">
											<Stethoscope className="h-4 w-4" />
											<SelectValue />
										</div>
									</SelectTrigger>
									<SelectContent className="bg-gray-900 border-gray-800">
										{veterinarios.map((vet) => (
											<SelectItem
												key={vet.id}
												value={vet.nome}
												className="text-white focus:bg-red-600/20"
											>
												{vet.nome}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-3">
									<Label htmlFor="tipo" className="text-white">Tipo</Label>
									<Select value="consulta">
										<SelectTrigger id="tipo" className="bg-gray-900/50 border-gray-700/50 text-white">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="bg-gray-900 border-gray-800">
											{tiposEvento.filter(t => t.value !== 'bloqueado').map((tipo) => (
												<SelectItem key={tipo.value} value={tipo.value}>
													{tipo.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-3">
									<Label htmlFor="status" className="text-white">Status</Label>
									<Select value="agendada">
										<SelectTrigger id="status" className="bg-gray-900/50 border-gray-700/50 text-white">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="bg-gray-900 border-gray-800">
											{statusOptions.map((status) => (
												<SelectItem key={status.value} value={status.value}>
													{status.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="detalhes" className="space-y-4">
							<div className="space-y-3">
								<Label htmlFor="observacoes" className="text-white">Observações</Label>
								<Textarea
									id="observacoes"
									placeholder="Observações importantes sobre o atendimento..."
									value={observacoes}
									onChange={(e) => setObservacoes(e.target.value)}
									rows={4}
									className="bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
								/>
							</div>
						</TabsContent>
					</Tabs>

					<DialogFooter>
						<Button
							variant="outline"
							className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
							onClick={() => setSelectedSlot(null)}
						>
							Cancelar
						</Button>
						<Button
							className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
						>
							<Plus className="h-4 w-4" />
							Confirmar Agendamento
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AgendaCompleta;