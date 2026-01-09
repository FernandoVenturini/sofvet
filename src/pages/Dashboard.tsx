import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import {
	FileText, Table, Activity, CalendarCheck,
	ClipboardList, BarChart3, File,
	Users, Stethoscope, Bell, Settings,
	ChevronRight, Sparkles, Clock, TrendingUp,
	CheckCircle, AlertCircle, Package, Database,
	Shield, Heart, Calendar, DollarSign, AlertTriangle,
	UserCheck, Pill, Thermometer, Smartphone, MessageSquare,
	HelpCircle, Syringe, Download, Cloud, Home, BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const Dashboard = () => {
	const { user, clinicName: contextClinicName } = useContext(AuthContext);
	const navigate = useNavigate();
	const [clinicName, setClinicName] = useState(contextClinicName);

	// Estatísticas
	const [stats, setStats] = useState({
		totalPatients: 124,
		consultationsToday: 8,
		pendingConsultations: 3,
		monthlyRevenue: 45280.50,
		satisfactionRate: 94,
		vaccinationRate: 87,
		openAppointments: 12,
		monthlyGrowth: 15
	});

	// CARDS DO DASHBOARD COM ROTAS REAIS
	const dashboardCards = [
		{
			id: 1,
			title: 'Fichas',
			description: 'Gerenciar fichas dos pacientes',
			icon: FileText,
			color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
			iconBg: 'bg-blue-500/20',
			iconColor: 'text-blue-400',
			// Rotas reais das fichas
			link: '/fichas/lista',
			badge: '24 novas',
			badgeColor: 'bg-blue-500/20 text-blue-400'
		},
		{
			id: 2,
			title: 'Tabelas',
			description: 'Tabelas e configurações',
			icon: Table,
			color: 'bg-gradient-to-br from-emerald-500 to-green-500',
			iconBg: 'bg-emerald-500/20',
			iconColor: 'text-emerald-400',
			// Redireciona para tabelas de vacinas (página inicial das tabelas)
			link: '/tabelas/vacinas',
			badge: 'Atualizado',
			badgeColor: 'bg-emerald-500/20 text-emerald-400'
		},
		{
			id: 3,
			title: 'Movimento',
			description: 'Controle financeiro e consultas',
			icon: Activity,
			color: 'bg-gradient-to-br from-purple-500 to-pink-500',
			iconBg: 'bg-purple-500/20',
			iconColor: 'text-purple-400',
			link: '/movimento',
			badge: 'R$ 2.850,00',
			badgeColor: 'bg-purple-500/20 text-purple-400'
		},
		{
			id: 4,
			title: 'Nova Consulta',
			description: 'Agendar nova consulta',
			icon: CalendarCheck,
			color: 'bg-gradient-to-br from-amber-500 to-orange-500',
			iconBg: 'bg-amber-500/20',
			iconColor: 'text-amber-400',
			link: '/movimento/nova',
			badge: 'Rápido',
			badgeColor: 'bg-amber-500/20 text-amber-400'
		},
		{
			id: 5,
			title: 'Lista de Consultas',
			description: 'Ver todas as consultas',
			icon: ClipboardList,
			color: 'bg-gradient-to-br from-red-500 to-rose-500',
			iconBg: 'bg-red-500/20',
			iconColor: 'text-red-400',
			link: '/movimento/lista',
			badge: `${stats.consultationsToday} hoje`,
			badgeColor: 'bg-red-500/20 text-red-400'
		},
		{
			id: 6,
			title: 'Relatórios',
			description: 'Relatórios e estatísticas',
			icon: BarChart3,
			color: 'bg-gradient-to-br from-indigo-500 to-violet-500',
			iconBg: 'bg-indigo-500/20',
			iconColor: 'text-indigo-400',
			link: '/relatorios',
			badge: '5 novos',
			badgeColor: 'bg-indigo-500/20 text-indigo-400'
		},
		{
			id: 7,
			title: 'Prontuário',
			description: 'Prontuários eletrônicos',
			icon: File,
			color: 'bg-gradient-to-br from-teal-500 to-emerald-500',
			iconBg: 'bg-teal-500/20',
			iconColor: 'text-teal-400',
			// Usando retorno como prontuário
			link: '/fichas/retorno',
			badge: '12 atualizações',
			badgeColor: 'bg-teal-500/20 text-teal-400'
		},
		{
			id: 8,
			title: 'Medicamentos',
			description: 'Controle de medicamentos',
			icon: Pill,
			color: 'bg-gradient-to-br from-cyan-500 to-blue-500',
			iconBg: 'bg-cyan-500/20',
			iconColor: 'text-cyan-400',
			link: '/medicamentos',
			badge: 'Estoque OK',
			badgeColor: 'bg-cyan-500/20 text-cyan-400'
		}
	];

	// CARDS ADICIONAIS - OUTRAS FUNCIONALIDADES
	const additionalCards = [
		{
			id: 9,
			title: 'Agenda',
			description: 'Agenda completa e retornos',
			icon: Calendar,
			color: 'bg-gradient-to-br from-pink-500 to-rose-500',
			iconBg: 'bg-pink-500/20',
			iconColor: 'text-pink-400',
			link: '/agenda/completa',
			badge: '12 agend.',
			badgeColor: 'bg-pink-500/20 text-pink-400'
		},
		{
			id: 10,
			title: 'Utilitários',
			description: 'Ferramentas e utilitários',
			icon: Settings,
			color: 'bg-gradient-to-br from-gray-500 to-gray-700',
			iconBg: 'bg-gray-500/20',
			iconColor: 'text-gray-400',
			link: '/utilitarios',
			badge: 'Tools',
			badgeColor: 'bg-gray-500/20 text-gray-400'
		},
		{
			id: 11,
			title: 'Backup',
			description: 'Backup do sistema',
			icon: Cloud, // Usando Cloud no lugar de Backup
			color: 'bg-gradient-to-br from-amber-500 to-yellow-500',
			iconBg: 'bg-amber-500/20',
			iconColor: 'text-amber-400',
			link: '/diversos/backup',
			badge: 'Diário',
			badgeColor: 'bg-amber-500/20 text-amber-400'
		},
		{
			id: 12,
			title: 'Ajuda',
			description: 'Central de ajuda',
			icon: HelpCircle,
			color: 'bg-gradient-to-br from-violet-500 to-purple-500',
			iconBg: 'bg-violet-500/20',
			iconColor: 'text-violet-400',
			link: '/ajuda',
			badge: 'Suporte',
			badgeColor: 'bg-violet-500/20 text-violet-400'
		}
	];

	// Estatísticas em cards
	const statCards = [
		{
			id: 1,
			title: 'Pacientes Ativos',
			value: stats.totalPatients,
			icon: Users,
			color: 'from-blue-500 to-cyan-500',
			change: '+12%',
			changeColor: 'text-emerald-400',
			link: '/fichas/lista'
		},
		{
			id: 2,
			title: 'Consultas Hoje',
			value: stats.consultationsToday,
			icon: Calendar,
			color: 'from-purple-500 to-pink-500',
			change: `${stats.pendingConsultations} pendentes`,
			changeColor: 'text-amber-400',
			link: '/movimento/lista'
		},
		{
			id: 3,
			title: 'Faturamento Mensal',
			value: `R$ ${stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(',')[0]}`,
			icon: DollarSign,
			color: 'from-emerald-500 to-green-500',
			change: '+24%',
			changeColor: 'text-emerald-400',
			link: '/movimento'
		},
		{
			id: 4,
			title: 'Vacinação',
			value: `${stats.vaccinationRate}%`,
			icon: Syringe,
			color: 'from-rose-500 to-red-500',
			change: 'Em dia',
			changeColor: 'text-emerald-400',
			link: '/tabelas/vacinas'
		}
	];

	// Ações rápidas com rotas reais
	const quickActions = [
		{
			title: 'Nova Ficha',
			icon: FileText,
			color: 'text-blue-400',
			bg: 'bg-blue-500/20',
			link: '/fichas/nova',
			description: 'Cadastrar novo paciente'
		},
		{
			title: 'Agendar Consulta',
			icon: CalendarCheck,
			color: 'text-amber-400',
			bg: 'bg-amber-500/20',
			link: '/movimento/nova',
			description: 'Nova consulta'
		},
		{
			title: 'Ver Agenda',
			icon: Calendar,
			color: 'text-red-400',
			bg: 'bg-red-500/20',
			link: '/agenda/completa',
			description: 'Agenda completa'
		},
		{
			title: 'Enviar Mensagem',
			icon: MessageSquare,
			color: 'text-purple-400',
			bg: 'bg-purple-500/20',
			link: '/diversos/mensagens',
			description: 'Contatar clientes'
		}
	];

	// Consultas recentes
	const recentConsultations = [
		{ id: 1, animal: 'Rex', owner: 'Carlos Silva', type: 'Consulta', time: '10:30', status: 'concluída' },
		{ id: 2, animal: 'Luna', owner: 'Ana Santos', type: 'Vacinação', time: '14:00', status: 'agendada' },
		{ id: 3, animal: 'Thor', owner: 'Pedro Costa', type: 'Cirurgia', time: '11:45', status: 'andamento' },
		{ id: 4, animal: 'Mel', owner: 'Mariana Lima', type: 'Check-up', time: '16:30', status: 'pendente' },
	];

	// Alertas importantes
	const alerts = [
		{
			id: 1,
			title: 'Vacinas vencendo',
			description: '3 vacinas vencem esta semana',
			icon: AlertTriangle,
			color: 'text-amber-400',
			bg: 'bg-amber-500/20',
			link: '/tabelas/vacinas'
		},
		{
			id: 2,
			title: 'Estoque baixo',
			description: '5 medicamentos com estoque crítico',
			icon: Package,
			color: 'text-red-400',
			bg: 'bg-red-500/20',
			link: '/medicamentos'
		},
		{
			id: 3,
			title: 'Retornos pendentes',
			description: '8 pacientes aguardam retorno',
			icon: Clock,
			color: 'text-blue-400',
			bg: 'bg-blue-500/20',
			link: '/agenda/retornos'
		},
	];

	useEffect(() => {
		setClinicName(contextClinicName || localStorage.getItem('clinic-name') || '');
	}, [contextClinicName]);

	const getStatusColor = (status) => {
		switch (status) {
			case 'concluída': return 'bg-emerald-500/20 text-emerald-400';
			case 'agendada': return 'bg-blue-500/20 text-blue-400';
			case 'andamento': return 'bg-amber-500/20 text-amber-400';
			case 'pendente': return 'bg-gray-500/20 text-gray-400';
			default: return 'bg-gray-500/20 text-gray-400';
		}
	};

	// Função para navegação - DEBUG
	const handleNavigation = (link) => {
		console.log('Navegando para:', link);
		navigate(link);
	};

	return (
		<div className="flex flex-col space-y-6 p-4 md:p-6">
			{/* Header */}
			<div className="flex flex-col space-y-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="flex flex-col space-y-2">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-xl bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30">
								<Sparkles className="h-6 w-6 text-red-400" />
							</div>
							<Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-100 border border-red-500/30">
								<Heart className="h-3 w-3 mr-1" />
								Dashboard Principal
							</Badge>
						</div>
						<h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
							Olá, {user?.displayName?.split(' ')[0] || 'Veterinário'}!
						</h1>
						<p className="text-gray-400">
							Bem-vindo ao sistema da <span className="text-red-400 font-medium">{clinicName || 'Clínica Veterinária'}</span>
						</p>
					</div>

					<div className="flex items-center gap-3">
						<Button
							variant="outline"
							className="border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800/30 gap-2"
							onClick={() => handleNavigation('/diversos/mensagens')}
						>
							<Bell className="h-4 w-4" />
							Notificações
						</Button>
						<Button
							className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 gap-2"
							onClick={() => handleNavigation('/config')}
						>
							<Settings className="h-4 w-4" />
							Configurações
						</Button>
					</div>
				</div>
			</div>

			{/* Estatísticas em linha - Também clicáveis */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{statCards.map((stat) => (
					<div
						key={stat.id}
						className="cursor-pointer group"
						onClick={() => handleNavigation(stat.link)}
					>
						<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 hover:border-gray-700/50 transition-colors">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-400 mb-1">{stat.title}</p>
										<p className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
											{stat.value}
										</p>
										<p className={`text-sm mt-2 ${stat.changeColor}`}>
											{stat.change}
										</p>
									</div>
									<div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20`}>
										<stat.icon className="h-6 w-6 text-white" />
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				))}
			</div>

			{/* Conteúdo Principal - Layout Flex Column */}
			<div className="flex flex-col space-y-6">

				{/* Seção 1: Módulos do Sistema (Principais) */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-bold text-white">Módulos Principais</h2>
						<Badge className="bg-gradient-to-r from-gray-800/50 to-black/50 text-gray-400 border border-gray-700">
							{dashboardCards.length} módulos
						</Badge>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{dashboardCards.map((card) => (
							<div
								key={card.id}
								className="group cursor-pointer"
								onClick={() => handleNavigation(card.link)}
							>
								<Card className="h-full bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 hover:border-opacity-50 hover:scale-[1.02] transition-all duration-300">
									<CardHeader className="pb-3">
										<div className="flex justify-between items-start">
											<div className={`p-3 rounded-xl ${card.color} ${card.iconBg}`}>
												<card.icon className={`h-6 w-6 ${card.iconColor}`} />
											</div>
											<Badge className={card.badgeColor}>
												{card.badge}
											</Badge>
										</div>
										<CardTitle className="text-lg font-semibold text-white mt-4 group-hover:text-blue-400 transition-colors">
											{card.title}
										</CardTitle>
										<CardDescription className="text-gray-400 text-sm">
											{card.description}
										</CardDescription>
									</CardHeader>
									<CardFooter className="pt-0">
										<div className="flex items-center justify-between w-full">
											<span className="text-sm text-gray-500">Clique para acessar</span>
											<ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
										</div>
									</CardFooter>
								</Card>
							</div>
						))}
					</div>
				</div>

				{/* Seção 2: Outras Funcionalidades */}
				<div className="space-y-4">
					<h2 className="text-xl font-bold text-white">Outras Funcionalidades</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{additionalCards.map((card) => (
							<div
								key={card.id}
								className="group cursor-pointer"
								onClick={() => handleNavigation(card.link)}
							>
								<Card className="h-full bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 hover:border-opacity-50 hover:scale-[1.02] transition-all duration-300">
									<CardHeader className="pb-3">
										<div className="flex justify-between items-start">
											<div className={`p-3 rounded-xl ${card.color} ${card.iconBg}`}>
												<card.icon className={`h-6 w-6 ${card.iconColor}`} />
											</div>
											<Badge className={card.badgeColor}>
												{card.badge}
											</Badge>
										</div>
										<CardTitle className="text-lg font-semibold text-white mt-4 group-hover:text-blue-400 transition-colors">
											{card.title}
										</CardTitle>
										<CardDescription className="text-gray-400 text-sm">
											{card.description}
										</CardDescription>
									</CardHeader>
									<CardFooter className="pt-0">
										<div className="flex items-center justify-between w-full">
											<span className="text-sm text-gray-500">Clique para acessar</span>
											<ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
										</div>
									</CardFooter>
								</Card>
							</div>
						))}
					</div>
				</div>

				{/* Seção 3: Ações Rápidas e Alertas */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Ações Rápidas */}
					<div className="lg:col-span-2">
						<Card className="h-full bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Activity className="h-5 w-5 text-amber-400" />
									Ações Rápidas
								</CardTitle>
								<CardDescription>Atalhos para tarefas frequentes</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{quickActions.map((action, index) => (
										<div
											key={index}
											className="group cursor-pointer"
											onClick={() => handleNavigation(action.link)}
										>
											<div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-gray-800/30 to-transparent hover:from-gray-800/50 border border-gray-800/50 hover:border-gray-700/50 transition-all">
												<div className={`p-3 rounded-lg ${action.bg}`}>
													<action.icon className={`h-5 w-5 ${action.color}`} />
												</div>
												<div className="flex-1">
													<p className="font-medium text-white group-hover:text-blue-400 transition-colors">
														{action.title}
													</p>
													<p className="text-sm text-gray-400">{action.description}</p>
												</div>
												<ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Alertas - Também clicáveis */}
					<div>
						<Card className="h-full bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<AlertTriangle className="h-5 w-5 text-amber-400" />
									Alertas Importantes
								</CardTitle>
								<CardDescription>Atenção necessária</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{alerts.map((alert) => (
									<div
										key={alert.id}
										className="group cursor-pointer"
										onClick={() => handleNavigation(alert.link)}
									>
										<div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-800/30 to-transparent hover:from-gray-800/50 border border-gray-800/50 hover:border-gray-700/50 transition-all">
											<div className={`p-2 rounded-lg ${alert.bg}`}>
												<alert.icon className={`h-4 w-4 ${alert.color}`} />
											</div>
											<div className="flex-1">
												<p className="font-medium text-white group-hover:text-blue-400 transition-colors">
													{alert.title}
												</p>
												<p className="text-sm text-gray-400">{alert.description}</p>
											</div>
											<ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Seção 4: Consultas Recentes */}
				<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Clock className="h-5 w-5 text-red-400" />
							Consultas de Hoje
						</CardTitle>
						<CardDescription>Atendimentos agendados para hoje</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{recentConsultations.map((consult) => (
								<div key={consult.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-800/30 to-transparent hover:from-gray-800/50 transition-colors">
									<div className="flex items-center gap-4">
										<div className={`p-3 rounded-lg ${getStatusColor(consult.status)}`}>
											{consult.status === 'concluída' ? <CheckCircle className="h-5 w-5" /> :
												consult.status === 'andamento' ? <Clock className="h-5 w-5" /> :
													<AlertCircle className="h-5 w-5" />}
										</div>
										<div>
											<p className="font-medium text-white">{consult.animal}</p>
											<div className="flex items-center gap-3 mt-1">
												<p className="text-sm text-gray-400">{consult.owner}</p>
												<span className="text-xs text-gray-500">•</span>
												<p className="text-sm text-gray-400">{consult.type}</p>
											</div>
										</div>
									</div>
									<div className="text-right">
										<p className="text-lg font-semibold text-white">{consult.time}</p>
										<Badge className={`mt-1 ${getStatusColor(consult.status)}`}>
											{consult.status}
										</Badge>
									</div>
								</div>
							))}
						</div>
					</CardContent>
					<CardFooter>
						<Button
							variant="ghost"
							className="w-full text-gray-400 hover:text-white hover:bg-gray-800/30"
							onClick={() => handleNavigation('/movimento/lista')}
						>
							Ver todas as consultas
						</Button>
					</CardFooter>
				</Card>
			</div>

			{/* Botão de Debug para testar navegação */}
			<div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-gray-400">Problemas com navegação?</p>
						<p className="text-xs text-gray-500">Verifique o console (F12) para logs de navegação</p>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							console.log('=== TESTE DE ROTAS ===');
							dashboardCards.forEach(card => {
								console.log(`Card "${card.title}": ${card.link}`);
							});
							alert('Rotas listadas no console. Verifique (F12)');
						}}
					>
						Testar Rotas
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;