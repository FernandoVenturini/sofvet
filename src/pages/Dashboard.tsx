import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import {
	Dog, Users, FileText, Calendar, Activity,
	TrendingUp, DollarSign, AlertCircle, CheckCircle,
	Clock, BarChart3, Pill, Shield, Zap, Heart,
	Bell, Download, Settings, HelpCircle, PlusCircle,
	ArrowUpRight, ArrowDownRight, Thermometer, Stethoscope,
	Sparkles, Target, Crown, Star, Award, Coffee,
	Database, Package // CORREÇÃO AQUI: Adicionando Database e Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
	const { user, clinicName: contextClinicName } = useContext(AuthContext);
	const [clinicName, setClinicName] = useState(contextClinicName);
	const [stats, setStats] = useState({
		totalPatients: 124,
		totalConsultations: 342,
		monthlyRevenue: 45280.50,
		pendingConsultations: 8,
		vaccinationRate: 87,
		satisfactionRate: 94
	});

	// Dados simulados para gráficos e listas
	const recentConsultations = [
		{ id: 1, animal: 'Rex', owner: 'Carlos Silva', type: 'Consulta', status: 'Concluída', time: '10:30', vet: 'Dra. Maria' },
		{ id: 2, animal: 'Luna', owner: 'Ana Santos', type: 'Vacinação', status: 'Agendada', time: '14:00', vet: 'Dr. João' },
		{ id: 3, animal: 'Thor', owner: 'Pedro Costa', type: 'Cirurgia', status: 'Em andamento', time: '11:45', vet: 'Dra. Sofia' },
		{ id: 4, animal: 'Mel', owner: 'Mariana Lima', type: 'Check-up', status: 'Pendente', time: '16:30', vet: 'Dr. Pedro' },
	];

	const upcomingVaccinations = [
		{ id: 1, animal: 'Bobby', vaccine: 'V8', date: 'Hoje', status: 'urgent' },
		{ id: 2, animal: 'Nina', vaccine: 'Antirrábica', date: 'Amanhã', status: 'pending' },
		{ id: 3, animal: 'Max', vaccine: 'Giárdia', date: '15/Jan', status: 'upcoming' },
		{ id: 4, animal: 'Lola', vaccine: 'V8', date: '18/Jan', status: 'upcoming' },
	];

	const quickActions = [
		{ title: 'Nova Consulta', icon: PlusCircle, path: '/movimento/nova', color: 'from-purple-600 to-pink-600' },
		{ title: 'Nova Ficha', icon: FileText, path: '/fichas/nova', color: 'from-blue-600 to-cyan-600' },
		{ title: 'Agendar Retorno', icon: Calendar, path: '/agenda/retornos', color: 'from-emerald-600 to-green-600' },
		{ title: 'Ver Relatórios', icon: BarChart3, path: '/relatorios', color: 'from-amber-600 to-orange-600' },
	];

	useEffect(() => {
		setClinicName(contextClinicName || localStorage.getItem('sofvet-clinic-name') || '');
	}, [contextClinicName]);

	useEffect(() => {
		const handler = () => {
			setClinicName(localStorage.getItem('sofvet-clinic-name') || '');
		};
		window.addEventListener('clinicNameUpdated', handler);
		return () => window.removeEventListener('clinicNameUpdated', handler);
	}, []);

	return (
		<div className="space-y-6">
			{/* Header com Saudação */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
				<div>
					<div className="flex items-center gap-3 mb-2">
						<div className="p-2 rounded-xl bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30">
							<Sparkles className="h-6 w-6 text-red-400" />
						</div>
						<Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 border border-red-500/30">
							<Coffee className="h-3 w-3 mr-1" />
							Bem-vindo de volta!
						</Badge>
					</div>
					<h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
						Olá, {user?.displayName?.split(' ')[0] || 'Veterinário'}!
					</h1>
					<p className="text-gray-400 mt-2">
						Gerencie sua <span className="text-red-400 font-medium">{clinicName || 'SofVet'}</span> com eficiência
					</p>
				</div>

				<div className="flex items-center gap-3">
					<Button variant="outline" className="border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800/30 gap-2">
						<Download className="h-4 w-4" />
						Backup
					</Button>
					<Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 gap-2">
						<PlusCircle className="h-4 w-4" />
						Nova Consulta
					</Button>
				</div>
			</div>

			{/* Cards de Estatísticas */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 hover:border-red-500/30 transition-all duration-300 group">
					<CardHeader className="pb-2">
						<div className="flex justify-between items-center">
							<CardTitle className="text-sm font-medium text-gray-400">Pacientes Totais</CardTitle>
							<div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20 group-hover:scale-110 transition-transform">
								<Users className="h-4 w-4 text-blue-400" />
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-white">{stats.totalPatients}</p>
								<p className="text-sm text-gray-400">Animais cadastrados</p>
							</div>
							<Badge className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-400 border border-green-500/30">
								<ArrowUpRight className="h-3 w-3 mr-1" />
								+12%
							</Badge>
						</div>
						<Progress value={75} className="mt-4 bg-gray-800/50 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-cyan-500" />
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 hover:border-red-500/30 transition-all duration-300 group">
					<CardHeader className="pb-2">
						<div className="flex justify-between items-center">
							<CardTitle className="text-sm font-medium text-gray-400">Consultas/Mês</CardTitle>
							<div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 group-hover:scale-110 transition-transform">
								<Stethoscope className="h-4 w-4 text-purple-400" />
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-white">{stats.totalConsultations}</p>
								<p className="text-sm text-gray-400">Este mês</p>
							</div>
							<Badge className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-400 border border-amber-500/30">
								<TrendingUp className="h-3 w-3 mr-1" />
								+8%
							</Badge>
						</div>
						<Progress value={65} className="mt-4 bg-gray-800/50 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500" />
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 hover:border-red-500/30 transition-all duration-300 group">
					<CardHeader className="pb-2">
						<div className="flex justify-between items-center">
							<CardTitle className="text-sm font-medium text-gray-400">Faturamento</CardTitle>
							<div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20 group-hover:scale-110 transition-transform">
								<DollarSign className="h-4 w-4 text-emerald-400" />
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-white">
									R$ {stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</p>
								<p className="text-sm text-gray-400">Receita mensal</p>
							</div>
							<Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400 border border-red-500/30">
								<ArrowUpRight className="h-3 w-3 mr-1" />
								+24%
							</Badge>
						</div>
						<Progress value={85} className="mt-4 bg-gray-800/50 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-green-500" />
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 hover:border-red-500/30 transition-all duration-300 group">
					<CardHeader className="pb-2">
						<div className="flex justify-between items-center">
							<CardTitle className="text-sm font-medium text-gray-400">Taxa de Vacinação</CardTitle>
							<div className="p-2 rounded-lg bg-gradient-to-br from-cyan-600/20 to-blue-600/20 group-hover:scale-110 transition-transform">
								<Shield className="h-4 w-4 text-cyan-400" />
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-white">{stats.vaccinationRate}%</p>
								<p className="text-sm text-gray-400">Animais vacinados</p>
							</div>
							<div className="flex items-center gap-2">
								<Badge className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30">
									{stats.vaccinationRate >= 80 ? 'Excelente' : 'Bom'}
								</Badge>
							</div>
						</div>
						<Progress value={stats.vaccinationRate} className="mt-4 bg-gray-800/50 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500" />
					</CardContent>
				</Card>
			</div>

			{/* Grid Principal */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Coluna 1: Consultas Recentes e Vacinações */}
				<div className="lg:col-span-2 space-y-6">
					{/* Tabs para Consultas */}
					<Tabs defaultValue="consultas" className="w-full">
						<TabsList className="grid grid-cols-2 bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50 p-1">
							<TabsTrigger value="consultas" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
								<Activity className="h-4 w-4 mr-2" />
								Consultas Hoje
							</TabsTrigger>
							<TabsTrigger value="pendentes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
								<AlertCircle className="h-4 w-4 mr-2" />
								Pendentes ({stats.pendingConsultations})
							</TabsTrigger>
						</TabsList>

						<TabsContent value="consultas" className="mt-0">
							<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Calendar className="h-5 w-5 text-red-400" />
										Agenda do Dia
									</CardTitle>
									<CardDescription>Consultas e procedimentos agendados para hoje</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{recentConsultations.map((consult) => (
											<div key={consult.id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-800/30 to-transparent hover:from-gray-800/50 transition-colors group">
												<div className="flex items-center gap-3">
													<div className={`p-2 rounded-lg ${consult.status === 'Concluída' ? 'bg-gradient-to-br from-emerald-600/20 to-green-600/20' :
															consult.status === 'Em andamento' ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/20' :
																'bg-gradient-to-br from-gray-600/20 to-gray-700/20'
														}`}>
														{consult.status === 'Concluída' ? <CheckCircle className="h-4 w-4 text-emerald-400" /> :
															consult.status === 'Em andamento' ? <Clock className="h-4 w-4 text-amber-400" /> :
																<AlertCircle className="h-4 w-4 text-gray-400" />}
													</div>
													<div>
														<p className="font-medium text-white">{consult.animal}</p>
														<p className="text-sm text-gray-400">{consult.owner}</p>
													</div>
												</div>
												<div className="text-right">
													<p className="font-medium text-white">{consult.time}</p>
													<div className="flex items-center gap-2">
														<Badge className={`text-xs ${consult.status === 'Concluída' ? 'bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-400' :
																consult.status === 'Em andamento' ? 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-400' :
																	'bg-gradient-to-r from-gray-600/20 to-gray-700/20 text-gray-400'
															}`}>
															{consult.status}
														</Badge>
														<p className="text-xs text-gray-500">{consult.vet}</p>
													</div>
												</div>
											</div>
										))}
									</div>
								</CardContent>
								<CardFooter>
									<Button variant="ghost" className="w-full text-gray-400 hover:text-white hover:bg-gray-800/30">
										Ver agenda completa
									</Button>
								</CardFooter>
							</Card>
						</TabsContent>

						<TabsContent value="pendentes" className="mt-0">
							<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-amber-400">
										<AlertCircle className="h-5 w-5" />
										Consultas Pendentes
									</CardTitle>
									<CardDescription>Ações que requerem sua atenção</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="text-center py-8">
										<AlertCircle className="h-12 w-12 text-amber-500/50 mx-auto mb-4" />
										<p className="text-gray-400">Todas as consultas estão em dia!</p>
										<p className="text-sm text-gray-500 mt-2">Nenhuma ação pendente no momento</p>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>

					{/* Vacinações Pendentes */}
					<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Shield className="h-5 w-5 text-cyan-400" />
								Vacinações Pendentes
							</CardTitle>
							<CardDescription>Retornos e revacinações agendadas</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{upcomingVaccinations.map((vaccine) => (
									<div key={vaccine.id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-800/30 to-transparent hover:from-gray-800/50 transition-colors">
										<div className="flex items-center gap-3">
											<div className={`p-2 rounded-lg ${vaccine.status === 'urgent' ? 'bg-gradient-to-br from-red-600/20 to-pink-600/20' :
													vaccine.status === 'pending' ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/20' :
														'bg-gradient-to-br from-cyan-600/20 to-blue-600/20'
												}`}>
												<Pill className={`h-4 w-4 ${vaccine.status === 'urgent' ? 'text-red-400' :
														vaccine.status === 'pending' ? 'text-amber-400' :
															'text-cyan-400'
													}`} />
											</div>
											<div>
												<p className="font-medium text-white">{vaccine.animal}</p>
												<p className="text-sm text-gray-400">{vaccine.vaccine}</p>
											</div>
										</div>
										<div className="text-right">
											<p className={`font-medium ${vaccine.status === 'urgent' ? 'text-red-400' :
													vaccine.status === 'pending' ? 'text-amber-400' :
														'text-cyan-400'
												}`}>
												{vaccine.date}
											</p>
											<Badge className={`text-xs ${vaccine.status === 'urgent' ? 'bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400' :
													vaccine.status === 'pending' ? 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-400' :
														'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-400'
												}`}>
												{vaccine.status === 'urgent' ? 'Urgente' :
													vaccine.status === 'pending' ? 'Amanhã' : 'Agendado'}
											</Badge>
										</div>
									</div>
								))}
							</div>
						</CardContent>
						<CardFooter>
							<Button variant="ghost" className="w-full text-gray-400 hover:text-white hover:bg-gray-800/30 gap-2">
								<Calendar className="h-4 w-4" />
								Agendar todas as vacinações
							</Button>
						</CardFooter>
					</Card>
				</div>

				{/* Coluna 2: Ações Rápidas e Stats */}
				<div className="space-y-6">
					{/* Ações Rápidas */}
					<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Zap className="h-5 w-5 text-amber-400" />
								Ações Rápidas
							</CardTitle>
							<CardDescription>Acesso rápido às principais funções</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-3">
								{quickActions.map((action) => (
									<Link key={action.title} to={action.path}>
										<Button className="w-full h-auto p-4 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:from-gray-800/50 hover:to-gray-900/50 border border-gray-800/50 hover:border-red-500/30 transition-all duration-300">
											<div className={`p-3 rounded-lg bg-gradient-to-br ${action.color}`}>
												<action.icon className="h-6 w-6 text-white" />
											</div>
											<span className="text-sm font-medium text-white">{action.title}</span>
										</Button>
									</Link>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Sistema Status */}
					<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Target className="h-5 w-5 text-emerald-400" />
								Status do Sistema
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20">
										<CheckCircle className="h-4 w-4 text-emerald-400" />
									</div>
									<div>
										<p className="font-medium text-white">Sistema Principal</p>
										<p className="text-sm text-gray-400">Online</p>
									</div>
								</div>
								<Badge className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-400 border border-emerald-500/30">
									<div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
									Estável
								</Badge>
							</div>

							<Separator className="bg-gray-800/50" />

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
										<Database className="h-4 w-4 text-blue-400" />
									</div>
									<div>
										<p className="font-medium text-white">Banco de Dados</p>
										<p className="text-sm text-gray-400">Sincronizado</p>
									</div>
								</div>
								<Badge className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30">
									100%
								</Badge>
							</div>

							<Separator className="bg-gray-800/50" />

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-lg bg-gradient-to-br from-amber-600/20 to-orange-600/20">
										<Bell className="h-4 w-4 text-amber-400" />
									</div>
									<div>
										<p className="font-medium text-white">Notificações</p>
										<p className="text-sm text-gray-400">3 pendentes</p>
									</div>
								</div>
								<Button size="sm" variant="outline" className="border-gray-700 text-gray-400 hover:text-white hover:border-gray-600">
									Ver
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Métricas de Sucesso */}
					<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Award className="h-5 w-5 text-purple-400" />
								Sua Performance
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<div className="flex justify-between mb-1">
									<span className="text-sm text-gray-400">Satisfação do Cliente</span>
									<span className="text-sm font-medium text-white">{stats.satisfactionRate}%</span>
								</div>
								<Progress value={stats.satisfactionRate} className="bg-gray-800/50 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500" />
							</div>

							<div>
								<div className="flex justify-between mb-1">
									<span className="text-sm text-gray-400">Consultas Concluídas</span>
									<span className="text-sm font-medium text-white">98%</span>
								</div>
								<Progress value={98} className="bg-gray-800/50 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-cyan-500" />
							</div>

							<div>
								<div className="flex justify-between mb-1">
									<span className="text-sm text-gray-400">Tempo Médio de Atendimento</span>
									<span className="text-sm font-medium text-white">24 min</span>
								</div>
								<Progress value={80} className="bg-gray-800/50 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-green-500" />
							</div>
						</CardContent>
						<CardFooter>
							<div className="flex items-center justify-center w-full gap-2 text-gray-400">
								<Star className="h-4 w-4 text-amber-500 fill-amber-500" />
								<Star className="h-4 w-4 text-amber-500 fill-amber-500" />
								<Star className="h-4 w-4 text-amber-500 fill-amber-500" />
								<Star className="h-4 w-4 text-amber-500 fill-amber-500" />
								<Star className="h-4 w-4 text-amber-500 fill-amber-500" />
								<span className="ml-2 text-sm">5.0</span>
							</div>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;