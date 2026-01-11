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
	UserCog,
	ShoppingBag,
	Pill,
	ClipboardList,
	Truck,
	TrendingUp,
	ChevronRight,
	Clock,
	MoreVertical,
	Heart,
	PawPrint,
	Activity,
	Shield,
	Zap,
	Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
	const navigate = useNavigate();

	const mainModules = [
		// Fichas - Tons de Azul/Ciano
		{
			title: "Nova Ficha",
			description: "Criar nova ficha",
			icon: <FilePlus className="h-6 w-6" />,
			href: "/fichas/nova",
			category: "Fichas",
			gradient: "from-cyan-600 via-blue-500 to-cyan-500",
			iconBg: "bg-gradient-to-br from-cyan-600 to-blue-500",
			textColor: "text-blue-300",
			borderColor: "border-cyan-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
		},
		{
			title: "Lista / Busca",
			description: "Buscar fichas existentes",
			icon: <Search className="h-6 w-6" />,
			href: "/fichas/lista",
			category: "Fichas",
			gradient: "from-indigo-600 via-purple-500 to-indigo-500",
			iconBg: "bg-gradient-to-br from-indigo-600 to-purple-500",
			textColor: "text-purple-300",
			borderColor: "border-indigo-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(129,140,248,0.3)]"
		},
		{
			title: "Alterar Retorno",
			description: "Modificar datas de retorno",
			icon: <CalendarDays className="h-6 w-6" />,
			href: "/fichas/retorno",
			category: "Fichas",
			gradient: "from-purple-600 via-pink-500 to-purple-500",
			iconBg: "bg-gradient-to-br from-purple-600 to-pink-500",
			textColor: "text-pink-300",
			borderColor: "border-purple-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(192,132,252,0.3)]"
		},
		{
			title: "Agenda de Retornos",
			description: "Visualizar retornos agendados",
			icon: <Calendar className="h-6 w-6" />,
			href: "/agenda/retornos",
			category: "Fichas",
			gradient: "from-violet-600 via-purple-500 to-violet-500",
			iconBg: "bg-gradient-to-br from-violet-600 to-purple-500",
			textColor: "text-violet-300",
			borderColor: "border-violet-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(167,139,250,0.3)]"
		},

		// Tabelas - Tons de Verde/Esmeralda
		{
			title: "Espécie/Raça",
			description: "Cadastro de espécies e raças",
			icon: <Dog className="h-6 w-6" />,
			href: "/tabelas/especie-raca",
			category: "Tabelas",
			gradient: "from-emerald-600 via-green-500 to-emerald-500",
			iconBg: "bg-gradient-to-br from-emerald-600 to-green-500",
			textColor: "text-emerald-300",
			borderColor: "border-emerald-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
		},
		{
			title: "Vacinas",
			description: "Cadastro de vacinas",
			icon: <Syringe className="h-6 w-6" />,
			href: "/tabelas/vacinas",
			category: "Tabelas",
			gradient: "from-green-600 via-teal-500 to-green-500",
			iconBg: "bg-gradient-to-br from-green-600 to-teal-500",
			textColor: "text-green-300",
			borderColor: "border-green-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]"
		},
		{
			title: "Funcionários",
			description: "Cadastro de funcionários",
			icon: <UserCog className="h-6 w-6" />,
			href: "/tabelas/funcionarios",
			category: "Tabelas",
			gradient: "from-teal-600 via-cyan-500 to-teal-500",
			iconBg: "bg-gradient-to-br from-teal-600 to-cyan-500",
			textColor: "text-teal-300",
			borderColor: "border-teal-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(45,212,191,0.3)]"
		},
		{
			title: "Produtos e Serviços",
			description: "Cadastro de produtos e serviços",
			icon: <ShoppingBag className="h-6 w-6" />,
			href: "/tabelas/produtos",
			category: "Tabelas",
			gradient: "from-lime-600 via-green-500 to-lime-500",
			iconBg: "bg-gradient-to-br from-lime-600 to-green-500",
			textColor: "text-lime-300",
			borderColor: "border-lime-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(132,204,22,0.3)]"
		},
		{
			title: "Medicamentos",
			description: "Cadastro de medicamentos",
			icon: <Pill className="h-6 w-6" />,
			href: "/medicamentos",
			category: "Tabelas",
			gradient: "from-sky-600 via-blue-500 to-sky-500",
			iconBg: "bg-gradient-to-br from-sky-600 to-blue-500",
			textColor: "text-sky-300",
			borderColor: "border-sky-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(14,165,233,0.3)]"
		},
		{
			title: "Agendas",
			description: "Gerenciar agendas",
			icon: <Calendar className="h-6 w-6" />,
			href: "/tabelas/agendas",
			category: "Tabelas",
			gradient: "from-fuchsia-600 via-pink-500 to-fuchsia-500",
			iconBg: "bg-gradient-to-br from-fuchsia-600 to-pink-500",
			textColor: "text-fuchsia-300",
			borderColor: "border-fuchsia-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(217,70,239,0.3)]"
		},
		{
			title: "Fornecedores",
			description: "Cadastro de fornecedores",
			icon: <Truck className="h-6 w-6" />,
			href: "/tabelas/fornecedores",
			category: "Tabelas",
			gradient: "from-amber-600 via-orange-500 to-amber-500",
			iconBg: "bg-gradient-to-br from-amber-600 to-orange-500",
			textColor: "text-amber-300",
			borderColor: "border-amber-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]"
		},
		{
			title: "Proprietários",
			description: "Cadastro de proprietários",
			icon: <Users className="h-6 w-6" />,
			href: "/tabelas/proprietarios",
			category: "Tabelas",
			gradient: "from-rose-600 via-pink-500 to-rose-500",
			iconBg: "bg-gradient-to-br from-rose-600 to-pink-500",
			textColor: "text-rose-300",
			borderColor: "border-rose-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]"
		},

		// Movimento - Tons de Laranja/Vermelho
		{
			title: "Nova Consulta",
			description: "Registrar nova consulta",
			icon: <Stethoscope className="h-6 w-6" />,
			href: "/fichas/nova",
			category: "Movimento",
			gradient: "from-orange-600 via-red-500 to-orange-500",
			iconBg: "bg-gradient-to-br from-orange-600 to-red-500",
			textColor: "text-orange-300",
			borderColor: "border-orange-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(251,146,60,0.3)]"
		},
		{
			title: "Lista de Consultas",
			description: "Visualizar todas as consultas",
			icon: <ClipboardList className="h-6 w-6" />,
			href: "/fichas/lista",
			category: "Movimento",
			gradient: "from-red-600 via-orange-500 to-red-500",
			iconBg: "bg-gradient-to-br from-red-600 to-orange-500",
			textColor: "text-red-300",
			borderColor: "border-red-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
		},
		{
			title: "Relatórios",
			description: "Gerar relatórios",
			icon: <TrendingUp className="h-6 w-6" />,
			href: "/relatorios",
			category: "Movimento",
			gradient: "from-pink-600 via-rose-500 to-pink-500",
			iconBg: "bg-gradient-to-br from-pink-600 to-rose-500",
			textColor: "text-pink-300",
			borderColor: "border-pink-500/30",
			hoverGlow: "hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]"
		}
	];

	const todayAppointments = [
		{
			id: 1,
			time: "09:00",
			patient: "Rex",
			owner: "Carlos Silva",
			type: "Consulta de rotina",
			status: "confirmado",
			animalType: "Cachorro"
		},
		{
			id: 2,
			time: "10:30",
			patient: "Luna",
			owner: "Ana Oliveira",
			type: "Vacinação anual",
			status: "confirmado",
			animalType: "Gato"
		},
		{
			id: 3,
			time: "14:00",
			patient: "Thor",
			owner: "Pedro Santos",
			type: "Retorno pós-cirúrgico",
			status: "pendente",
			animalType: "Cachorro"
		},
		{
			id: 4,
			time: "16:15",
			patient: "Mimi",
			owner: "Juliana Costa",
			type: "Exame de rotina",
			status: "cancelado",
			animalType: "Gato"
		},
		{
			id: 5,
			time: "17:30",
			patient: "Bob",
			owner: "Marcos Almeida",
			type: "Castração",
			status: "confirmado",
			animalType: "Cachorro"
		}
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

	// Cores para títulos de categoria
	const categoryColors = {
		"Fichas": {
			text: "text-cyan-400",
			bg: "bg-cyan-500/10",
			border: "border-cyan-500/30",
			icon: <Zap className="h-5 w-5 text-cyan-400" />
		},
		"Tabelas": {
			text: "text-emerald-400",
			bg: "bg-emerald-500/10",
			border: "border-emerald-500/30",
			icon: <Table className="h-5 w-5 text-emerald-400" />
		},
		"Movimento": {
			text: "text-orange-400",
			bg: "bg-orange-500/10",
			border: "border-orange-500/30",
			icon: <Activity className="h-5 w-5 text-orange-400" />
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
			{/* Header */}
			<div className="mb-10">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-4xl font-bold text-green-400">
							🏥 Dashboard Veterinário
						</h1>
						<p className="text-lg text-gray-300 mt-3 font-medium">
							Bem-vindo de volta, <span className="text-orange-400 font-bold">Dr. Veterinário</span>
						</p>
					</div>

					<div className="flex items-center space-x-4">
						<Button
							variant="default"
							className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 
hover:from-blue-700 hover:via-cyan-600 hover:to-blue-600 text-white px-7 py-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 border-0"
							onClick={() => navigate("/fichas/nova")}
						>
							<FilePlus className="mr-2 h-5 w-5" />
							Cadastrar Paciente
						</Button>

						<Button
							variant="default"
							className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500
hover:from-emerald-700 hover:via-teal-600 hover:to-cyan-600 text-white px-7 py-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 border-0"
							onClick={() => navigate("/tabelas/proprietarios")}
						>
							<FilePlus className="mr-2 h-5 w-5" />
							Cadastrar Proprietário
						</Button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-col gap-8">
				{/* Módulos Principais */}
				<Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
					<CardHeader className="pb-8">
						<div className="flex items-center gap-3 mb-3">
							<div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
								<Star className="h-6 w-6 text-white" />
							</div>
							<div>
								<CardTitle className="text-3xl text-white font-bold">
									Módulos Principais
								</CardTitle>
								<CardDescription className="text-lg text-gray-300 font-medium">
									Acesse todas as funcionalidades do sistema
								</CardDescription>
							</div>
						</div>
					</CardHeader>

					<CardContent className="space-y-12">
						{/* Categoria: Fichas */}
						<div>
							<div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl ${categoryColors["Fichas"].bg} ${categoryColors["Fichas"].border} border mb-6`}>
								{categoryColors["Fichas"].icon}
								<h3 className={`text-xl font-bold ${categoryColors["Fichas"].text}`}>
									Fichas
								</h3>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
								{mainModules.filter(m => m.category === "Fichas").map((module, index) => (
									<button
										key={index}
										className={`flex flex-col items-start p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border ${module.borderColor} shadow-lg hover:scale-[1.03] transition-all duration-300 group ${module.hoverGlow}`}
										onClick={() => navigate(module.href)}
									>
										<div className="flex items-center justify-between w-full mb-6">
											<div className={`p-4 rounded-xl ${module.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
												<div className="text-white">
													{module.icon}
												</div>
											</div>
											<ChevronRight className={`h-6 w-6 ${module.textColor} group-hover:translate-x-2 transition-transform duration-300`} />
										</div>

										<h3 className={`font-bold text-xl ${module.textColor} text-left mb-2`}>
											{module.title}
										</h3>
										<p className="text-gray-400 text-left font-medium">
											{module.description}
										</p>
									</button>
								))}
							</div>
						</div>

						{/* Categoria: Tabelas */}
						<div>
							<div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl ${categoryColors["Tabelas"].bg} ${categoryColors["Tabelas"].border} border mb-6`}>
								{categoryColors["Tabelas"].icon}
								<h3 className={`text-xl font-bold ${categoryColors["Tabelas"].text}`}>
									Tabelas
								</h3>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
								{mainModules.filter(m => m.category === "Tabelas").map((module, index) => (
									<button
										key={index}
										className={`flex flex-col items-start p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border ${module.borderColor} shadow-lg hover:scale-[1.03] transition-all duration-300 group ${module.hoverGlow}`}
										onClick={() => navigate(module.href)}
									>
										<div className="flex items-center justify-between w-full mb-6">
											<div className={`p-4 rounded-xl ${module.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
												<div className="text-white">
													{module.icon}
												</div>
											</div>
											<ChevronRight className={`h-6 w-6 ${module.textColor} group-hover:translate-x-2 transition-transform duration-300`} />
										</div>

										<h3 className={`font-bold text-xl ${module.textColor} text-left mb-2`}>
											{module.title}
										</h3>
										<p className="text-gray-400 text-left font-medium">
											{module.description}
										</p>
									</button>
								))}
							</div>
						</div>

						{/* Categoria: Movimento */}
						<div>
							<div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl ${categoryColors["Movimento"].bg} ${categoryColors["Movimento"].border} border mb-6`}>
								{categoryColors["Movimento"].icon}
								<h3 className={`text-xl font-bold ${categoryColors["Movimento"].text}`}>
									Movimento
								</h3>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
								{mainModules.filter(m => m.category === "Movimento").map((module, index) => (
									<button
										key={index}
										className={`flex flex-col items-start p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border ${module.borderColor} shadow-lg hover:scale-[1.03] transition-all duration-300 group ${module.hoverGlow}`}
										onClick={() => navigate(module.href)}
									>
										<div className="flex items-center justify-between w-full mb-6">
											<div className={`p-4 rounded-xl ${module.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
												<div className="text-white">
													{module.icon}
												</div>
											</div>
											<ChevronRight className={`h-6 w-6 ${module.textColor} group-hover:translate-x-2 transition-transform duration-300`} />
										</div>

										<h3 className={`font-bold text-xl ${module.textColor} text-left mb-2`}>
											{module.title}
										</h3>
										<p className="text-gray-400 text-left font-medium">
											{module.description}
										</p>
									</button>
								))}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Consultas de Hoje */}
				<Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
					<CardHeader className="pb-8">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="p-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl">
									<Calendar className="h-7 w-7 text-white" />
								</div>
								<div>
									<CardTitle className="text-3xl text-white font-bold">
										Consultas de Hoje
									</CardTitle>
									<CardDescription className="text-lg text-gray-300 font-medium">
										Agenda diária de consultas e procedimentos
									</CardDescription>
								</div>
							</div>
							<Badge className="text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white border-0 px-5 py-2 font-bold">
								{new Date().toLocaleDateString('pt-BR', {
									weekday: 'long',
									day: '2-digit',
									month: 'long',
									year: 'numeric'
								})}
							</Badge>
						</div>
					</CardHeader>

					<CardContent>
						<div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/50 shadow-lg">
							<div className="grid grid-cols-12 bg-gradient-to-r from-purple-600/20 to-pink-500/20 text-gray-300 text-sm font-bold py-5 px-7 border-b border-gray-700">
								<div className="col-span-2">Horário</div>
								<div className="col-span-3">Paciente</div>
								<div className="col-span-3">Proprietário</div>
								<div className="col-span-2">Tipo</div>
								<div className="col-span-2 text-right">Status</div>
							</div>

							<div className="divide-y divide-gray-700/50">
								{todayAppointments.map((appointment) => (
									<div
										key={appointment.id}
										className="grid grid-cols-12 items-center py-6 px-7 hover:bg-gray-700/30 transition-colors group"
									>
										<div className="col-span-2 flex items-center gap-4">
											<div className="p-2 bg-blue-500/20 rounded-lg">
												<Clock className="h-5 w-5 text-blue-400" />
											</div>
											<span className="font-bold text-blue-300 text-lg">{appointment.time}</span>
										</div>

										<div className="col-span-3">
											<div className="font-bold text-white text-lg flex items-center gap-3">
												<div className="p-1 bg-amber-500/20 rounded">
													<PawPrint className="h-4 w-4 text-amber-400" />
												</div>
												{appointment.patient}
											</div>
											<div className="text-sm text-gray-400 font-medium mt-1">{appointment.animalType}</div>
										</div>

										<div className="col-span-3">
											<div className="text-white font-semibold text-lg">{appointment.owner}</div>
										</div>

										<div className="col-span-2">
											<div className="text-gray-300 font-medium">{appointment.type}</div>
										</div>

										<div className="col-span-2 flex items-center justify-end gap-4">
											{getStatusBadge(appointment.status)}
											<button className="p-2 hover:bg-gray-600/50 rounded-lg text-gray-400 hover:text-white transition-colors">
												<MoreVertical className="h-5 w-5" />
											</button>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="mt-10 flex justify-between items-center bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700/50">
							<div className="flex items-center gap-4">
								<div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
									<Heart className="h-6 w-6 text-white" />
								</div>
								<div>
									<p className="text-xl text-white font-bold">
										Total de {todayAppointments.filter(a => a.status !== 'cancelado').length} consultas agendadas para hoje
									</p>
									<p className="text-sm text-gray-400">
										{todayAppointments.filter(a => a.status === 'confirmado').length} confirmadas • {todayAppointments.filter(a => a.status === 'pendente').length} pendentes
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

			{/* Stats Footer com gradientes */}
			<div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
				{/* Consultas Hoje */}
				<div className="relative overflow-hidden rounded-2xl p-6 shadow-2xl hover:scale-[1.03] transition-all duration-300 group">
					<div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
					<div className="relative z-10">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-blue-100">Consultas Hoje</p>
								<p className="text-4xl font-bold mt-2 text-white">
									{todayAppointments.filter(a => a.status !== 'cancelado').length}
								</p>
							</div>
							<div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
								<Stethoscope className="h-8 w-8 text-white" />
							</div>
						</div>
						<div className="mt-6 text-sm font-medium text-blue-100">
							🟢 {todayAppointments.filter(a => a.status === 'confirmado').length} confirmadas
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
								<p className="text-4xl font-bold mt-2 text-white">124</p>
							</div>
							<div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
								<Users className="h-8 w-8 text-white" />
							</div>
						</div>
						<div className="mt-6 text-sm font-medium text-emerald-100">
							🐶 89 cães • 🐱 35 gatos
						</div>
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
						<div className="mt-6 text-sm font-medium text-purple-100">
							👤 Com Rex (Carlos Silva)
						</div>
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
						<div className="mt-6 text-sm font-medium text-amber-100">
							📋 1 confirmação • 📄 2 laudos
						</div>
					</div>
				</div>
			</div>

			{/* Estilos CSS para animação de gradiente */}
			<style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
		</div>
	);
};

export default Dashboard;	