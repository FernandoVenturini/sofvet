import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Calendar,
	Users,
	Stethoscope,
	FileText,
	FilePlus,
	Search,
	CalendarDays,
	Table,
	Dog,
	Syringe,
	ShoppingBag,
	Pill,
	ClipboardList,
	TrendingUp,
	ChevronRight,
	Clock,
	MoreVertical,
	Heart,
	PawPrint,
	Activity,
	Shield,
	Zap,
	Star,
} from "lucide-react";

const Dashboard = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	const [stats] = useState({
		totalPatients: 124,
		totalConsultations: 342,
		monthlyRevenue: 45280.5,
		pendingConsultations: 8,
		vaccinationRate: 87,
		satisfactionRate: 94,
	});

	const mainModules = [
		{
			title: "Nova Ficha",
			description: "Criar nova ficha",
			icon: <FilePlus className="h-6 w-6" />,
			href: "/fichas/nova",
			category: "Fichas",
			iconBg: "bg-gradient-to-br from-cyan-600 to-blue-500",
			textColor: "text-blue-300",
			borderColor: "border-cyan-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]",
		},
		{
			title: "Lista / Busca",
			description: "Buscar fichas existentes",
			icon: <Search className="h-6 w-6" />,
			href: "/fichas/lista",
			category: "Fichas",
			iconBg: "bg-gradient-to-br from-indigo-600 to-purple-500",
			textColor: "text-purple-300",
			borderColor: "border-indigo-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(129,140,248,0.3)]",
		},
		{
			title: "Alterar Retorno",
			description: "Modificar datas de retorno",
			icon: <CalendarDays className="h-6 w-6" />,
			href: "/fichas/retorno",
			category: "Fichas",
			iconBg: "bg-gradient-to-br from-purple-600 to-pink-500",
			textColor: "text-pink-300",
			borderColor: "border-purple-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(192,132,252,0.3)]",
		},
		{
			title: "Agenda de Retornos",
			description: "Visualizar retornos agendados",
			icon: <Calendar className="h-6 w-6" />,
			href: "/agenda/retornos",
			category: "Fichas",
			iconBg: "bg-gradient-to-br from-violet-600 to-purple-500",
			textColor: "text-violet-300",
			borderColor: "border-violet-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(167,139,250,0.3)]",
		},
		{
			title: "Espécie/Raça",
			description: "Cadastro de espécies e raças",
			icon: <Dog className="h-6 w-6" />,
			href: "/tabelas/especie-raca",
			category: "Tabelas",
			iconBg: "bg-gradient-to-br from-emerald-600 to-green-500",
			textColor: "text-emerald-300",
			borderColor: "border-emerald-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]",
		},
		{
			title: "Vacinas",
			description: "Cadastro de vacinas",
			icon: <Syringe className="h-6 w-6" />,
			href: "/tabelas/vacinas",
			category: "Tabelas",
			iconBg: "bg-gradient-to-br from-green-600 to-teal-500",
			textColor: "text-green-300",
			borderColor: "border-green-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]",
		},
		{
			title: "Produtos e Serviços",
			description: "Cadastro de produtos e serviços",
			icon: <ShoppingBag className="h-6 w-6" />,
			href: "/tabelas/produtos",
			category: "Tabelas",
			iconBg: "bg-gradient-to-br from-lime-600 to-green-500",
			textColor: "text-lime-300",
			borderColor: "border-lime-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(132,204,22,0.3)]",
		},
		{
			title: "Medicamentos",
			description: "Cadastro de medicamentos",
			icon: <Pill className="h-6 w-6" />,
			href: "/medicamentos",
			category: "Tabelas",
			iconBg: "bg-gradient-to-br from-sky-600 to-blue-500",
			textColor: "text-sky-300",
			borderColor: "border-sky-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(14,165,233,0.3)]",
		},
		{
			title: "Agendas",
			description: "Gerenciar agendas",
			icon: <Calendar className="h-6 w-6" />,
			href: "/tabelas/agendas",
			category: "Tabelas",
			iconBg: "bg-gradient-to-br from-fuchsia-600 to-pink-500",
			textColor: "text-fuchsia-300",
			borderColor: "border-fuchsia-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(217,70,239,0.3)]",
		},
		{
			title: "Proprietários",
			description: "Cadastro de proprietários",
			icon: <Users className="h-6 w-6" />,
			href: "/tabelas/proprietarios",
			category: "Tabelas",
			iconBg: "bg-gradient-to-br from-rose-600 to-pink-500",
			textColor: "text-rose-300",
			borderColor: "border-rose-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]",
		},
		{
			title: "Nova Consulta",
			description: "Registrar nova consulta",
			icon: <Stethoscope className="h-6 w-6" />,
			href: "/fichas/nova",
			category: "Movimento",
			iconBg: "bg-gradient-to-br from-orange-600 to-red-500",
			textColor: "text-orange-300",
			borderColor: "border-orange-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(251,146,60,0.3)]",
		},
		{
			title: "Lista de Consultas",
			description: "Visualizar todas as consultas",
			icon: <ClipboardList className="h-6 w-6" />,
			href: "/fichas/lista",
			category: "Movimento",
			iconBg: "bg-gradient-to-br from-red-600 to-orange-500",
			textColor: "text-red-300",
			borderColor: "border-red-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]",
		},
		{
			title: "Relatórios",
			description: "Gerar relatórios",
			icon: <TrendingUp className="h-6 w-6" />,
			href: "/relatorios",
			category: "Movimento",
			iconBg: "bg-gradient-to-br from-pink-600 to-rose-500",
			textColor: "text-pink-300",
			borderColor: "border-pink-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]",
		},
	];

	const todayAppointments = [
		{ id: 1, time: "09:00", patient: "Rex", owner: "Carlos Silva", type: "Consulta de rotina", status: "confirmado", animalType: "Cachorro" },
		{ id: 2, time: "10:30", patient: "Luna", owner: "Ana Oliveira", type: "Vacinação anual", status: "confirmado", animalType: "Gato" },
		{ id: 3, time: "14:00", patient: "Thor", owner: "Pedro Santos", type: "Retorno pós-cirúrgico", status: "pendente", animalType: "Cachorro" },
		{ id: 4, time: "16:15", patient: "Mimi", owner: "Juliana Costa", type: "Exame de rotina", status: "cancelado", animalType: "Gato" },
		{ id: 5, time: "17:30", patient: "Bob", owner: "Marcos Almeida", type: "Castração", status: "confirmado", animalType: "Cachorro" },
	];

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "confirmado":
				return <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Confirmado</Badge>;
			case "pendente":
				return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">Pendente</Badge>;
			case "cancelado":
				return <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30">Cancelado</Badge>;
			default:
				return <Badge>Agendado</Badge>;
		}
	};

	const quickActions = [
		{ title: "Nova Consulta", icon: Stethoscope, path: "/movimento/nova", color: "from-teal-500 to-emerald-500" },
		{ title: "Nova Ficha", icon: FileText, path: "/fichas/nova", color: "from-blue-500 to-indigo-500" },
		{ title: "Agendar Retorno", icon: Calendar, path: "/agenda/retornos", color: "from-orange-500 to-amber-500" },
		{ title: "Ver Relatórios", icon: TrendingUp, path: "/relatorios", color: "from-purple-500 to-pink-500" },
	];

	return (
		<div className="min-h-screen bg-background p-6">
			{/* Header */}
			<div className="mb-10">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-4xl font-bold text-green-500 dark:text-green-400">🏥 Dashboard Veterinário</h1>
						<p className="text-lg text-muted-foreground mt-3 font-medium">
							Bem-vindo de volta, <span className="text-orange-500 dark:text-orange-400 font-bold">{user?.displayName || "Dr. Veterinário"}</span>
						</p>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-col gap-8">
				{/* Módulos Principais */}
				<Card className="bg-card border border-border shadow-2xl">
					<CardHeader className="pb-8">
						<div className="flex items-center gap-3 mb-3">
							<div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
								<Star className="h-6 w-6 text-white" />
							</div>
							<div>
								<CardTitle className="text-3xl text-foreground font-bold">Módulos Principais</CardTitle>
								<CardDescription className="text-lg text-muted-foreground font-medium">
									Acesse todas as funcionalidades do sistema
								</CardDescription>
							</div>
						</div>
					</CardHeader>

					<CardContent className="space-y-12">
						{/* Categoria: Fichas */}
						<div>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
								{mainModules
									.filter((m) => m.category === "Fichas")
									.map((module, index) => (
										<button
											key={index}
											className={`flex flex-col items-start p-6 rounded-2xl bg-secondary border ${module.borderColor} shadow-lg hover:scale-[1.03] transition-all duration-300 group ${module.hoverGlow}`}
											onClick={() => navigate(module.href)}
										>
											<div className="flex items-center justify-between w-full mb-6">
												<div className={`p-4 rounded-xl ${module.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
													<div className="text-white">{module.icon}</div>
												</div>
												<ChevronRight className={`h-6 w-6 ${module.textColor} group-hover:translate-x-2 transition-transform duration-300`} />
											</div>
											<h3 className={`font-bold text-xl ${module.textColor} text-left mb-2`}>{module.title}</h3>
											<p className="text-muted-foreground text-left font-medium">{module.description}</p>
										</button>
									))}
							</div>
						</div>

						{/* Categoria: Tabelas */}
						<div>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
								{mainModules
									.filter((m) => m.category === "Tabelas")
									.map((module, index) => (
										<button
											key={index}
											className={`flex flex-col items-start p-6 rounded-2xl bg-secondary border ${module.borderColor} shadow-lg hover:scale-[1.03] transition-all duration-300 group ${module.hoverGlow}`}
											onClick={() => navigate(module.href)}
										>
											<div className="flex items-center justify-between w-full mb-6">
												<div className={`p-4 rounded-xl ${module.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
													<div className="text-white">{module.icon}</div>
												</div>
												<ChevronRight className={`h-6 w-6 ${module.textColor} group-hover:translate-x-2 transition-transform duration-300`} />
											</div>
											<h3 className={`font-bold text-xl ${module.textColor} text-left mb-2`}>{module.title}</h3>
											<p className="text-muted-foreground text-left font-medium">{module.description}</p>
										</button>
									))}
							</div>

							{/* Categoria: Movimento */}
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 mt-3">
								{mainModules
									.filter((m) => m.category === "Movimento")
									.map((module, index) => (
										<button
											key={index}
											className={`flex flex-col items-start p-6 rounded-2xl bg-secondary border ${module.borderColor} shadow-lg hover:scale-[1.03] transition-all duration-300 group ${module.hoverGlow}`}
											onClick={() => navigate(module.href)}
										>
											<div className="flex items-center justify-between w-full mb-6">
												<div className={`p-4 rounded-xl ${module.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
													<div className="text-white">{module.icon}</div>
												</div>
												<ChevronRight className={`h-6 w-6 ${module.textColor} group-hover:translate-x-2 transition-transform duration-300`} />
											</div>
											<h3 className={`font-bold text-xl ${module.textColor} text-left mb-2`}>{module.title}</h3>
											<p className="text-muted-foreground text-left font-medium">{module.description}</p>
										</button>
									))}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Consultas de Hoje */}
				<Card className="bg-card border border-border shadow-2xl">
					<CardHeader className="pb-8">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="p-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl">
									<Calendar className="h-7 w-7 text-white" />
								</div>
								<div>
									<CardTitle className="text-3xl text-foreground font-bold">Consultas de Hoje</CardTitle>
									<CardDescription className="text-lg text-muted-foreground font-medium">
										Agenda diária de consultas e procedimentos
									</CardDescription>
								</div>
							</div>
							<Badge className="text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white border-0 px-5 py-2 font-bold">
								{new Date().toLocaleDateString("pt-BR", {
									weekday: "long",
									day: "2-digit",
									month: "long",
									year: "numeric",
								})}
							</Badge>
						</div>
					</CardHeader>

					<CardContent>
						<div className="overflow-hidden rounded-2xl border border-border bg-secondary/50 shadow-lg">
							<div className="grid grid-cols-12 bg-gradient-to-r from-purple-600/20 to-pink-500/20 text-muted-foreground text-sm font-bold py-5 px-7 border-b border-border">
								<div className="col-span-2">Horário</div>
								<div className="col-span-3">Paciente</div>
								<div className="col-span-3">Proprietário</div>
								<div className="col-span-2">Tipo</div>
								<div className="col-span-2 text-right">Status</div>
							</div>

							<div className="divide-y divide-border">
								{todayAppointments.map((appointment) => (
									<div
										key={appointment.id}
										className="grid grid-cols-12 items-center py-6 px-7 hover:bg-accent transition-colors group"
									>
										<div className="col-span-2 flex items-center gap-4">
											<div className="p-2 bg-blue-500/20 rounded-lg">
												<Clock className="h-5 w-5 text-blue-400" />
											</div>
											<span className="font-bold text-blue-500 dark:text-blue-300 text-lg">{appointment.time}</span>
										</div>

										<div className="col-span-3">
											<div className="font-bold text-foreground text-lg flex items-center gap-3">
												<div className="p-1 bg-amber-500/20 rounded">
													<PawPrint className="h-4 w-4 text-amber-500 dark:text-amber-400" />
												</div>
												{appointment.patient}
											</div>
											<div className="text-sm text-muted-foreground font-medium mt-1">{appointment.animalType}</div>
										</div>

										<div className="col-span-3">
											<div className="text-foreground font-semibold text-lg">{appointment.owner}</div>
										</div>

										<div className="col-span-2">
											<div className="text-muted-foreground font-medium">{appointment.type}</div>
										</div>

										<div className="col-span-2 flex items-center justify-end gap-4">
											{getStatusBadge(appointment.status)}
											<button className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-colors">
												<MoreVertical className="h-5 w-5" />
											</button>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="mt-10 flex justify-between items-center bg-secondary/50 p-6 rounded-2xl border border-border">
							<div className="flex items-center gap-4">
								<div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
									<Heart className="h-6 w-6 text-white" />
								</div>
								<div>
									<p className="text-xl text-foreground font-bold">
										Total de {todayAppointments.filter((a) => a.status !== "cancelado").length} consultas agendadas para hoje
									</p>
									<p className="text-sm text-muted-foreground">
										{todayAppointments.filter((a) => a.status === "confirmado").length} confirmadas •{" "}
										{todayAppointments.filter((a) => a.status === "pendente").length} pendentes
									</p>
								</div>
							</div>
							<Button
								onClick={() => navigate("/agenda")}
								className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold px-8 py-4 gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
							>
								<Calendar className="h-5 w-5" />
								Ver agenda completa
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Stats Footer */}
			<div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
				{/* Consultas Hoje */}
				<div className="relative overflow-hidden rounded-2xl p-6 shadow-2xl hover:scale-[1.03] transition-all duration-300 group">
					<div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
					<div className="relative z-10">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-blue-100">Consultas Hoje</p>
								<p className="text-4xl font-bold mt-2 text-white">
									{todayAppointments.filter((a) => a.status !== "cancelado").length}
								</p>
							</div>
							<div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
								<Stethoscope className="h-8 w-8 text-white" />
							</div>
						</div>
						<div className="mt-6 text-sm font-medium text-blue-100">
							🟢 {todayAppointments.filter((a) => a.status === "confirmado").length} confirmadas
						</div>
					</div>
				</div>

				{/* Pacientes Ativos */}
				<div className="relative overflow-hidden rounded-2xl p-6 shadow-2xl hover:scale-[1.03] transition-all duration-300 group">
					<div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-500 to-emerald-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
					<div className="relative z-10">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-emerald-100">Pacientes Ativos</p>
								<p className="text-4xl font-bold mt-2 text-white">{stats.totalPatients}</p>
							</div>
							<div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
								<Users className="h-8 w-8 text-white" />
							</div>
						</div>
						<div className="mt-6 text-sm font-medium text-emerald-100">🐶 89 cães • 🐱 35 gatos</div>
					</div>
				</div>

				{/* Próxima Consulta */}
				<div className="relative overflow-hidden rounded-2xl p-6 shadow-2xl hover:scale-[1.03] transition-all duration-300 group">
					<div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-purple-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
					<div className="relative z-10">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-purple-100">Próxima Consulta</p>
								<p className="text-4xl font-bold mt-2 text-white">09:00</p>
							</div>
							<div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
								<Clock className="h-8 w-8 text-white" />
							</div>
						</div>
						<div className="mt-6 text-sm font-medium text-purple-100">👤 Com Rex (Carlos Silva)</div>
					</div>
				</div>

				{/* Pendências */}
				<div className="relative overflow-hidden rounded-2xl p-6 shadow-2xl hover:scale-[1.03] transition-all duration-300 group">
					<div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-500 to-amber-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
					<div className="relative z-10">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-amber-100">Pendências</p>
								<p className="text-4xl font-bold mt-2 text-white">3</p>
							</div>
							<div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
								<Shield className="h-8 w-8 text-white" />
							</div>
						</div>
						<div className="mt-6 text-sm font-medium text-amber-100">📋 1 confirmação • 📄 2 laudos</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;