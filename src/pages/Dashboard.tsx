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
	Database, CalendarDays, Syringe, ClipboardList, Gift
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

	// Verificar se o usuário é administrador
	const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

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
		{ title: 'Nova Consulta', icon: PlusCircle, path: '/movimento/nova', color: 'from-teal-500 to-emerald-500' },
		{ title: 'Nova Ficha', icon: FileText, path: '/fichas/nova', color: 'from-blue-500 to-indigo-500' },
		{ title: 'Agendar Retorno', icon: Calendar, path: '/agenda/retornos', color: 'from-orange-500 to-amber-500' },
		{ title: 'Ver Relatórios', icon: BarChart3, path: '/relatorios', color: 'from-purple-500 to-pink-500' },
	];

	// Dados para o card de Próximos Aniversariantes
	const upcomingBirthdays = [
		{ id: 1, animal: 'Luna', owner: 'Ana Santos', date: 'Hoje', age: 3, species: 'Cachorro' },
		{ id: 2, animal: 'Bob', owner: 'Carlos Souza', date: 'Amanhã', age: 5, species: 'Gato' },
		{ id: 3, animal: 'Mel', owner: 'Fernanda Lima', date: '10/Jan', age: 2, species: 'Cachorro' },
		{ id: 4, animal: 'Thor', owner: 'Ricardo Alves', date: '15/Jan', age: 4, species: 'Cachorro' },
	];

	// Dados para lembretes de medicação
	const medicationReminders = [
		{ id: 1, animal: 'Rex', medication: 'Vermífugo', nextDose: 'Hoje', time: '20:00', status: 'urgent' },
		{ id: 2, animal: 'Nina', medication: 'Antipulgas', nextDose: 'Amanhã', time: '09:00', status: 'pending' },
		{ id: 3, animal: 'Max', medication: 'Antibiótico', nextDose: '12/Jan', time: '14:00', status: 'upcoming' },
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
			{/* Header com Saudação - Gradiente suave azul/verde */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gradient-to-r from-teal-600 to-emerald-600 p-6 rounded-xl shadow-lg">
				<div>
					<div className="flex items-center gap-3 mb-2">
						<div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
							<Sparkles className="h-6 w-6 text-white" />
						</div>

						<Badge className="bg-white/20 text-white border-white/30">
							<Coffee className="h-3 w-3 mr-1" />
							Bem-vindo de volta!
						</Badge>
					</div>
					<h1 className="text-3xl lg:text-4xl font-bold text-white">
						Olá, {user?.displayName?.split(' ')[0] || 'Veterinário'}!
					</h1>
					<p className="text-teal-100 mt-2">
						Gerencie sua <span className="text-white font-medium">{clinicName || 'SofVet'}</span> com eficiência
					</p>
				</div>

				<div className="flex items-center gap-3">
					<Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white gap-2">
						<Download className="h-4 w-4" />
						Backup
					</Button>

					<Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 gap-2 shadow-lg text-white">
						<Link to="/movimento/nova" className="flex items-center gap-2">
							<PlusCircle className="h-4 w-4" />
							Nova Consulta
						</Link>
					</Button>
					<Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 gap-2 shadow-lg text-white">
						<Link to="/fichas/nova" className="flex items-center gap-2">
							<PlusCircle className="h-4 w-4" />
							Nova Ficha
						</Link>
					</Button>
				</div>
			</div>

			{/* Cards de Estatísticas - Cores suaves e elegantes */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200 shadow-md hover:shadow-xl transition-all duration-300">
					<CardHeader className="pb-2">
						<div className="flex justify-between items-center">
							<CardTitle className="text-sm font-medium text-teal-700">Pacientes Totais</CardTitle>
							<div className="p-2 rounded-lg bg-gradient-to-br from-teal-100 to-emerald-100">
								<Users className="h-4 w-4 text-teal-600" />
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-teal-900">{stats.totalPatients}</p>
								<p className="text-sm text-teal-600">Animais cadastrados</p>
							</div>
							<Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
								<ArrowUpRight className="h-3 w-3 mr-1" />
								+12%
							</Badge>
						</div>
						<Progress value={75} className="mt-4 bg-teal-200 [&>div]:bg-gradient-to-r [&>div]:from-teal-500 [&>div]:to-emerald-500" />
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md hover:shadow-xl transition-all duration-300">
					<CardHeader className="pb-2">
						<div className="flex justify-between items-center">
							<CardTitle className="text-sm font-medium text-blue-700">Consultas/Mês</CardTitle>
							<div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
								<Stethoscope className="h-4 w-4 text-blue-600" />
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-blue-900">{stats.totalConsultations}</p>
								<p className="text-sm text-blue-600">Este mês</p>
							</div>
							<Badge className="bg-amber-100 text-amber-700 border-amber-200">
								<TrendingUp className="h-3 w-3 mr-1" />
								+8%
							</Badge>
						</div>
						<Progress value={65} className="mt-4 bg-blue-200 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-500" />
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-md hover:shadow-xl transition-all duration-300">
					<CardHeader className="pb-2">
						<div className="flex justify-between items-center">
							<CardTitle className="text-sm font-medium text-purple-700">Taxa de Vacinação</CardTitle>
							<div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
								<Shield className="h-4 w-4 text-purple-600" />
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-purple-900">{stats.vaccinationRate}%</p>
								<p className="text-sm text-purple-600">Animais vacinados</p>
							</div>
							<div className="flex items-center gap-2">
								<Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
									{stats.vaccinationRate >= 80 ? 'Excelente' : 'Bom'}
								</Badge>
							</div>
						</div>
						<Progress value={stats.vaccinationRate} className="mt-4 bg-purple-200 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500" />
					</CardContent>
				</Card>
			</div>

			{/* Grid Principal - Uma única coluna com largura total */}
			<div className="space-y-6">
				{/* Consultas Hoje */}
				<Tabs defaultValue="consultas" className="w-full">
					<TabsList className="grid grid-cols-2 bg-gray-100 border border-gray-200 p-1 rounded-lg">
						<TabsTrigger value="consultas" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-md">
							<Activity className="h-4 w-4 mr-2" />
							Consultas Hoje
						</TabsTrigger>
						<TabsTrigger value="pendentes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-md">
							<AlertCircle className="h-4 w-4 mr-2" />
							Pendentes ({stats.pendingConsultations})
						</TabsTrigger>
					</TabsList>

					<TabsContent value="consultas" className="mt-4">
						<Card className="bg-white border border-teal-200 shadow-md">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-teal-700">
									<Calendar className="h-5 w-5" />
									Agenda do Dia
								</CardTitle>
								<CardDescription className="text-gray-600">Consultas e procedimentos agendados para hoje</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{recentConsultations.map((consult) => (
										<div key={consult.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300">
											<div className="flex items-center gap-3">
												<div className={`p-2 rounded-lg ${consult.status === 'Concluída' ? 'bg-emerald-100' :
													consult.status === 'Em andamento' ? 'bg-amber-100' :
														'bg-gray-200'
													}`}>
													{consult.status === 'Concluída' ? <CheckCircle className="h-4 w-4 text-emerald-600" /> :
														consult.status === 'Em andamento' ? <Clock className="h-4 w-4 text-amber-600" /> :
															<AlertCircle className="h-4 w-4 text-gray-500" />}
												</div>
												<div>
													<p className="font-medium text-gray-900">{consult.animal}</p>
													<p className="text-sm text-gray-500">{consult.owner}</p>
												</div>
											</div>
											<div className="text-right">
												<p className="font-medium text-gray-900">{consult.time}</p>
												<div className="flex items-center gap-2">
													<Badge className={`text-xs ${consult.status === 'Concluída' ? 'bg-emerald-100 text-emerald-700' :
														consult.status === 'Em andamento' ? 'bg-amber-100 text-amber-700' :
															'bg-gray-200 text-gray-600'
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
								<Button variant="ghost" className="w-full text-teal-600 hover:text-teal-700 hover:bg-teal-50">
									Ver agenda completa
								</Button>
							</CardFooter>
						</Card>
					</TabsContent>

					<TabsContent value="pendentes" className="mt-4">
						<Card className="bg-white border border-amber-200 shadow-md">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-amber-700">
									<AlertCircle className="h-5 w-5" />
									Consultas Pendentes
								</CardTitle>
								<CardDescription className="text-gray-600">Ações que requerem sua atenção</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="text-center py-8">
									<AlertCircle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
									<p className="text-gray-600">Todas as consultas estão em dia!</p>
									<p className="text-sm text-gray-500 mt-2">Nenhuma ação pendente no momento</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{/* Vacinações Pendentes */}
				<Card className="bg-white border border-cyan-200 shadow-md">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-cyan-700">
							<Shield className="h-5 w-5" />
							Vacinações Pendentes
						</CardTitle>
						<CardDescription className="text-gray-600">Retornos e revacinações agendadas</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{upcomingVaccinations.map((vaccine) => (
								<div key={vaccine.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300">
									<div className="flex items-center gap-3">
										<div className={`p-2 rounded-lg ${vaccine.status === 'urgent' ? 'bg-rose-100' :
											vaccine.status === 'pending' ? 'bg-amber-100' :
												'bg-cyan-100'
											}`}>
											<Pill className={`h-4 w-4 ${vaccine.status === 'urgent' ? 'text-rose-600' :
												vaccine.status === 'pending' ? 'text-amber-600' :
													'text-cyan-600'
												}`} />
										</div>
										<div>
											<p className="font-medium text-gray-900">{vaccine.animal}</p>
											<p className="text-sm text-gray-500">{vaccine.vaccine}</p>
										</div>
									</div>
									<div className="text-right">
										<p className={`font-medium ${vaccine.status === 'urgent' ? 'text-rose-600' :
											vaccine.status === 'pending' ? 'text-amber-600' :
												'text-cyan-600'
											}`}>
											{vaccine.date}
										</p>
										<Badge className={`text-xs ${vaccine.status === 'urgent' ? 'bg-rose-100 text-rose-700' :
											vaccine.status === 'pending' ? 'bg-amber-100 text-amber-700' :
												'bg-cyan-100 text-cyan-700'
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
						<Button variant="ghost" className="w-full text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 gap-2">
							<Calendar className="h-4 w-4" />
							Agendar todas as vacinações
						</Button>
					</CardFooter>
				</Card>

				{/* Lembretes de Medicação */}
				<Card className="bg-white border border-rose-200 shadow-md">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-rose-700">
							<Syringe className="h-5 w-5" />
							Lembretes de Medicação
						</CardTitle>
						<CardDescription className="text-gray-600">Medicações programadas para hoje e próximos dias</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{medicationReminders.map((med) => (
								<div key={med.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300">
									<div className="flex items-center gap-3">
										<div className={`p-2 rounded-lg ${med.status === 'urgent' ? 'bg-rose-100' :
											med.status === 'pending' ? 'bg-amber-100' :
												'bg-blue-100'
											}`}>
											<Pill className={`h-4 w-4 ${med.status === 'urgent' ? 'text-rose-600' :
												med.status === 'pending' ? 'text-amber-600' :
													'text-blue-600'
												}`} />
										</div>
										<div>
											<p className="font-medium text-gray-900">{med.animal}</p>
											<p className="text-sm text-gray-500">{med.medication}</p>
										</div>
									</div>
									<div className="text-right">
										<p className={`font-medium ${med.status === 'urgent' ? 'text-rose-600' :
											med.status === 'pending' ? 'text-amber-600' :
												'text-blue-600'
											}`}>
											{med.nextDose}
										</p>
										<p className="text-xs text-gray-500">{med.time}</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
					<CardFooter>
						<Button variant="ghost" className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-2">
							<Bell className="h-4 w-4" />
							Gerenciar lembretes
						</Button>
					</CardFooter>
				</Card>

				{/* Próximos Aniversariantes */}
				<Card className="bg-white border border-pink-200 shadow-md">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-pink-700">
							<Gift className="h-5 w-5" />
							Aniversariantes do Mês
						</CardTitle>
						<CardDescription className="text-gray-600">Celebre o aniversário dos seus pacientes!</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{upcomingBirthdays.map((birthday) => (
								<div key={birthday.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300">
									<div className="flex items-center gap-3">
										<div className="p-2 rounded-lg bg-pink-100">
											<Heart className="h-4 w-4 text-pink-600" />
										</div>
										<div>
											<p className="font-medium text-gray-900">{birthday.animal}</p>
											<p className="text-sm text-gray-500">{birthday.species} • {birthday.age} anos</p>
										</div>
									</div>
									<div className="text-right">
										<Badge className={`text-xs ${birthday.date === 'Hoje' ? 'bg-pink-100 text-pink-700' :
											birthday.date === 'Amanhã' ? 'bg-purple-100 text-purple-700' :
												'bg-blue-100 text-blue-700'
											}`}>
											{birthday.date === 'Hoje' ? '🎉 Hoje!' : birthday.date === 'Amanhã' ? 'Amanhã' : birthday.date}
										</Badge>
										<p className="text-xs text-gray-500 mt-1">Tutor: {birthday.owner}</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
					<CardFooter>
						<Button variant="ghost" className="w-full text-pink-600 hover:text-pink-700 hover:bg-pink-50 gap-2">
							<CalendarDays className="h-4 w-4" />
							Ver todos os aniversários
						</Button>
					</CardFooter>
				</Card>

				{/* Ações Rápidas */}
				<Card className="bg-white border border-amber-200 shadow-md">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-amber-700">
							<Zap className="h-5 w-5" />
							Ações Rápidas
						</CardTitle>
						<CardDescription className="text-gray-600">Acesso rápido às principais funções</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
							{quickActions.map((action) => (
								<Button
									key={action.title}
									asChild
									className="w-full h-auto p-4 flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-300"
								>
									<Link to={action.path} className="flex flex-col items-center gap-2">
										<div className={`p-3 rounded-lg bg-gradient-to-br ${action.color} shadow-md`}>
											<action.icon className="h-6 w-6 text-white" />
										</div>
										<span className="text-sm font-medium text-gray-700">{action.title}</span>
									</Link>
								</Button>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Status do Sistema */}
				<Card className="bg-white border border-emerald-200 shadow-md">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-emerald-700">
							<Target className="h-5 w-5" />
							Status do Sistema
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-emerald-100">
									<CheckCircle className="h-4 w-4 text-emerald-600" />
								</div>
								<div>
									<p className="font-medium text-gray-900">Sistema Principal</p>
									<p className="text-sm text-gray-500">Online</p>
								</div>
							</div>
							<Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
								<div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
								Estável
							</Badge>
						</div>

						<Separator className="bg-gray-200" />

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-blue-100">
									<Database className="h-4 w-4 text-blue-600" />
								</div>
								<div>
									<p className="font-medium text-gray-900">Banco de Dados</p>
									<p className="text-sm text-gray-500">Sincronizado</p>
								</div>
							</div>
							<Badge className="bg-blue-100 text-blue-700 border-blue-200">
								100%
							</Badge>
						</div>

						<Separator className="bg-gray-200" />

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-amber-100">
									<Bell className="h-4 w-4 text-amber-600" />
								</div>
								<div>
									<p className="font-medium text-gray-900">Notificações</p>
									<p className="text-sm text-gray-500">3 pendentes</p>
								</div>
							</div>
							<Button size="sm" variant="outline" className="border-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-50">
								Ver
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Métricas de Sucesso - Performance */}
				<Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-md">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-indigo-700">
							<Award className="h-5 w-5" />
							Sua Performance
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<div className="flex justify-between mb-1">
								<span className="text-sm text-gray-600">Satisfação do Cliente</span>
								<span className="text-sm font-medium text-gray-900">{stats.satisfactionRate}%</span>
							</div>
							<Progress value={stats.satisfactionRate} className="bg-indigo-200 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-purple-500" />
						</div>

						<div>
							<div className="flex justify-between mb-1">
								<span className="text-sm text-gray-600">Consultas Concluídas</span>
								<span className="text-sm font-medium text-gray-900">98%</span>
							</div>
							<Progress value={98} className="bg-blue-200 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-cyan-500" />
						</div>

						<div>
							<div className="flex justify-between mb-1">
								<span className="text-sm text-gray-600">Tempo Médio de Atendimento</span>
								<span className="text-sm font-medium text-gray-900">24 min</span>
							</div>
							<Progress value={80} className="bg-emerald-200 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-500" />
						</div>
					</CardContent>
					<CardFooter>
						<div className="flex items-center justify-center w-full gap-2">
							<Star className="h-5 w-5 text-amber-400 fill-amber-400" />
							<Star className="h-5 w-5 text-amber-400 fill-amber-400" />
							<Star className="h-5 w-5 text-amber-400 fill-amber-400" />
							<Star className="h-5 w-5 text-amber-400 fill-amber-400" />
							<Star className="h-5 w-5 text-amber-400 fill-amber-400" />
							<span className="ml-2 text-lg font-bold text-gray-900">5.0</span>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default Dashboard;