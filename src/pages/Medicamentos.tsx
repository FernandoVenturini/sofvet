import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
	Search,
	Filter,
	Plus,
	Edit,
	Trash2,
	Download,
	Package,
	Pill,
	AlertTriangle,
	CheckCircle,
	BarChart3,
	Calendar,
	Tag,
	Archive,
	FileWarning,
	Bell,
	CheckSquare,
	Clock,
	Database,
	Eye,
	RefreshCw,
	Sparkles,
	ChevronRight,
	Users,
	Thermometer,
	Heart,
	Brain,
	Syringe,
	Shield,
	Activity,
	Zap,
} from "lucide-react";

interface Medicamento {
	id: string;
	nome: string;
	principioAtivo: string;
	concentracao: string;
	formaFarmaceutica: string;
	fabricante: string;
	registroMS: string;
	classeTerapeutica: string;
	viaAdministracao: string[];
	especiesDestinadas: string[];
	indicacoes: string[];
	contraindicacoes: string[];
	efeitosAdversos: string[];
	dosagem: string;
	periodoCarneia: number;
	periodoLeite: number;
	armazenamento: string;
	validade: string;
	lote: string;
	quantidadeEstoque: number;
	quantidadeMinima: number;
	precoCusto: number;
	precoVenda: number;
	notificavel: boolean;
	controlado: boolean;
	receituario: "A1" | "A2" | "A3" | "B1" | "B2" | "C1" | "sem";
	status: "ativo" | "inativo" | "suspenso";
	criadoEm: Date;
	atualizadoEm: Date;
}

const Medicamentos = () => {
	// Estados
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("todos");
	const [filterControlado, setFilterControlado] = useState("todos");
	const [filterReceituario, setFilterReceituario] = useState("todos");
	const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("lista");

	// Estados para modais
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [selectedMedicamento, setSelectedMedicamento] = useState<Medicamento | null>(null);

	// Form data
	const [formData, setFormData] = useState({
		nome: "",
		principioAtivo: "",
		concentracao: "",
		formaFarmaceutica: "",
		fabricante: "",
		registroMS: "",
		classeTerapeutica: "",
		viaAdministracao: [] as string[],
		especiesDestinadas: [] as string[],
		indicacoes: [] as string[],
		contraindicacoes: [] as string[],
		efeitosAdversos: [] as string[],
		dosagem: "",
		periodoCarneia: 0,
		periodoLeite: 0,
		armazenamento: "",
		validade: "",
		lote: "",
		quantidadeEstoque: 0,
		quantidadeMinima: 10,
		precoCusto: 0,
		precoVenda: 0,
		notificavel: false,
		controlado: false,
		receituario: "sem" as "A1" | "A2" | "A3" | "B1" | "B2" | "C1" | "sem",
		status: "ativo" as "ativo" | "inativo" | "suspenso",
	});

	// Dados estáticos
	const formasFarmaceuticas = [
		"Comprimido",
		"Cápsula",
		"Solução Oral",
		"Suspensão",
		"Pó",
		"Injetável",
		"Pomada",
		"Creme",
		"Loção",
		"Spray",
		"Shampoo",
		"Coleira",
		"Pipeta",
	];

	const viasAdministracao = [
		"Oral",
		"Intramuscular",
		"Subcutânea",
		"Intravenosa",
		"Tópica",
		"Oftálmica",
		"Ótica",
		"Intranasal",
		"Retal",
		"Vaginal",
	];

	const especies = [
		"Canino",
		"Felino",
		"Equino",
		"Bovino",
		"Suíno",
		"Ovino",
		"Caprino",
		"Aves",
		"Exóticos",
		"Todos",
	];

	const classesTerapeuticas = [
		"Antibiótico",
		"Anti-inflamatório",
		"Analgésico",
		"Antiparasitário",
		"Vacina",
		"Hormonal",
		"Antifúngico",
		"Antiviral",
		"Cardiovascular",
		"Neurológico",
		"Dermatológico",
		"Oftálmico",
		"Nutracêutico",
		"Suplemento",
	];

	const statusOptions = [
		{ value: "ativo", label: "Ativo", color: "from-emerald-600/20 to-green-600/20", textColor: "text-emerald-400" },
		{ value: "inativo", label: "Inativo", color: "from-gray-600/20 to-gray-700/20", textColor: "text-gray-400" },
		{ value: "suspenso", label: "Suspenso", color: "from-red-600/20 to-pink-600/20", textColor: "text-red-400" },
	];

	const receituarioOptions = [
		{ value: "A1", label: "Receita A1", color: "from-red-600/20 to-pink-600/20", textColor: "text-red-400" },
		{ value: "A2", label: "Receita A2", color: "from-amber-600/20 to-orange-600/20", textColor: "text-amber-400" },
		{ value: "A3", label: "Receita A3", color: "from-yellow-600/20 to-amber-600/20", textColor: "text-yellow-400" },
		{ value: "B1", label: "Receita B1", color: "from-blue-600/20 to-cyan-600/20", textColor: "text-blue-400" },
		{ value: "B2", label: "Receita B2", color: "from-indigo-600/20 to-purple-600/20", textColor: "text-indigo-400" },
		{ value: "C1", label: "Receita C1", color: "from-purple-600/20 to-pink-600/20", textColor: "text-purple-400" },
		{ value: "sem", label: "Sem receita", color: "from-emerald-600/20 to-green-600/20", textColor: "text-emerald-400" },
	];

	// Carregar medicamentos
	useEffect(() => {
		carregarMedicamentos();
	}, []);

	const carregarMedicamentos = async () => {
		setLoading(true);
		try {
			// Mock data
			const medicamentosMock: Medicamento[] = [
				{
					id: "1",
					nome: "Carprofeno",
					principioAtivo: "Carprofeno",
					concentracao: "50 mg/mL",
					formaFarmaceutica: "Injetável",
					fabricante: "Zoetis",
					registroMS: "SP-1.1234.0001.001-2",
					classeTerapeutica: "Anti-inflamatório",
					viaAdministracao: ["Intravenosa", "Subcutânea"],
					especiesDestinadas: ["Canino"],
					indicacoes: ["Dor pós-operatória", "Osteoartrite"],
					contraindicacoes: ["Hipersensibilidade", "Úlcera gastrintestinal"],
					efeitosAdversos: ["Vômito", "Diarreia"],
					dosagem: "4 mg/kg/dia",
					periodoCarneia: 7,
					periodoLeite: 3,
					armazenamento: "15-30°C, protegido da luz",
					validade: "2025-12-31",
					lote: "L12345",
					quantidadeEstoque: 42,
					quantidadeMinima: 10,
					precoCusto: 45.90,
					precoVenda: 89.90,
					notificavel: false,
					controlado: false,
					receituario: "B2",
					status: "ativo",
					criadoEm: new Date(),
					atualizadoEm: new Date(),
				},
				{
					id: "2",
					nome: "Doxiciclina",
					principioAtivo: "Doxiciclina",
					concentracao: "100 mg",
					formaFarmaceutica: "Comprimido",
					fabricante: "Ourofino",
					registroMS: "SP-1.2345.0001.001-3",
					classeTerapeutica: "Antibiótico",
					viaAdministracao: ["Oral"],
					especiesDestinadas: ["Canino", "Felino"],
					indicacoes: ["Infecções bacterianas", "Erliquiose"],
					contraindicacoes: ["Gestação", "Alergia a tetraciclinas"],
					efeitosAdversos: ["Náusea", "Fotossensibilidade"],
					dosagem: "5 mg/kg/dia",
					periodoCarneia: 5,
					periodoLeite: 2,
					armazenamento: "Temperatura ambiente",
					validade: "2024-08-15",
					lote: "L23456",
					quantidadeEstoque: 18,
					quantidadeMinima: 20,
					precoCusto: 12.50,
					precoVenda: 25.00,
					notificavel: false,
					controlado: false,
					receituario: "sem",
					status: "ativo",
					criadoEm: new Date(),
					atualizadoEm: new Date(),
				},
				{
					id: "3",
					nome: "Ketamina",
					principioAtivo: "Cloridrato de Ketamina",
					concentracao: "100 mg/mL",
					formaFarmaceutica: "Injetável",
					fabricante: "Cristália",
					registroMS: "SP-1.3456.0001.001-4",
					classeTerapeutica: "Anestésico",
					viaAdministracao: ["Intravenosa", "Intramuscular"],
					especiesDestinadas: ["Canino", "Felino", "Equino"],
					indicacoes: ["Anestesia geral", "Sedação"],
					contraindicacoes: ["Glaucoma", "Hipertensão"],
					efeitosAdversos: ["Taquicardia", "Hipertensão"],
					dosagem: "10-20 mg/kg IM",
					periodoCarneia: 14,
					periodoLeite: 7,
					armazenamento: "2-8°C, protegido da luz",
					validade: "2025-06-30",
					lote: "L34567",
					quantidadeEstoque: 8,
					quantidadeMinima: 5,
					precoCusto: 28.90,
					precoVenda: 65.00,
					notificavel: true,
					controlado: true,
					receituario: "A1",
					status: "ativo",
					criadoEm: new Date(),
					atualizadoEm: new Date(),
				},
			];

			setMedicamentos(medicamentosMock);
		} catch (error) {
			console.error("Erro ao carregar medicamentos:", error);
			toast.error("Não foi possível carregar os medicamentos");
		} finally {
			setLoading(false);
		}
	};

	// Filtrar medicamentos
	const filteredMedicamentos = medicamentos.filter((med) => {
		const matchesSearch =
			!searchTerm ||
			med.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
			med.principioAtivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
			med.registroMS.includes(searchTerm);

		const matchesStatus = filterStatus === "todos" || med.status === filterStatus;
		const matchesControlado =
			filterControlado === "todos" ||
			(filterControlado === "sim" && med.controlado) ||
			(filterControlado === "nao" && !med.controlado);
		const matchesReceituario =
			filterReceituario === "todos" || med.receituario === filterReceituario;

		return matchesSearch && matchesStatus && matchesControlado && matchesReceituario;
	});

	// Estatísticas
	const estatisticas = {
		total: medicamentos.length,
		controlados: medicamentos.filter((m) => m.controlado).length,
		notificaveis: medicamentos.filter((m) => m.notificavel).length,
		baixoEstoque: medicamentos.filter((m) => m.quantidadeEstoque <= m.quantidadeMinima).length,
		valorEstoque: medicamentos.reduce((sum, m) => sum + (m.quantidadeEstoque * m.precoCusto), 0),
		totalEstoque: medicamentos.reduce((sum, m) => sum + m.quantidadeEstoque, 0),
		ativos: medicamentos.filter(m => m.status === 'ativo').length,
	};

	const resetarFiltros = () => {
		setSearchTerm("");
		setFilterStatus("todos");
		setFilterControlado("todos");
		setFilterReceituario("todos");
	};

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
				<p className="text-gray-400">Carregando medicamentos...</p>
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
							<Pill className="h-6 w-6 text-red-400" />
						</div>
						<Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 border border-red-500/30">
							<Sparkles className="h-3 w-3 mr-1" />
							Farmácia Veterinária
						</Badge>
					</div>
					<h1 className="text-4xl font-bold text-green-400">
						Controle de Medicamentos
					</h1>
					<p className="text-gray-400 mt-2">
						Gerencie o estoque de medicamentos e substâncias controladas
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Button
						variant="outline"
						className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
						onClick={() => {}}
					>
						<Download className="h-4 w-4 mr-2" />
						Exportar
					</Button>
					<Button
						className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
						onClick={() => setIsDialogOpen(true)}
					>
						<Plus className="h-4 w-4" />
						Novo Medicamento
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-gray-400">Total em Estoque</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-white">{estatisticas.totalEstoque}</p>
								<p className="text-sm text-gray-400">Unidades disponíveis</p>
							</div>
							<div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
								<Package className="h-5 w-5 text-red-400" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-gray-400">Baixo Estoque</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-amber-400">{estatisticas.baixoEstoque}</p>
								<p className="text-sm text-gray-400">Necessitam reposição</p>
							</div>
							<div className="p-2 rounded-lg bg-gradient-to-br from-amber-600/20 to-orange-600/20">
								<AlertTriangle className="h-5 w-5 text-amber-400" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-gray-400">Valor do Estoque</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-emerald-400">R$ {estatisticas.valorEstoque.toFixed(2)}</p>
								<p className="text-sm text-gray-400">Custo total</p>
							</div>
							<div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20">
								<BarChart3 className="h-5 w-5 text-emerald-400" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-gray-400">Medicamentos Ativos</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-blue-400">{estatisticas.ativos}</p>
								<p className="text-sm text-gray-400">Disponíveis para uso</p>
							</div>
							<div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
								<CheckSquare className="h-5 w-5 text-blue-400" />
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
									placeholder="Buscar por nome, princípio ativo, registro MS..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
								/>
							</div>
						</div>
						<div className="flex gap-2">
							<Select value={filterStatus} onValueChange={setFilterStatus}>
								<SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-700/50 text-white">
									<div className="flex items-center gap-2">
										<Filter className="h-4 w-4" />
										<SelectValue placeholder="Status" />
									</div>
								</SelectTrigger>
								<SelectContent className="bg-gray-900 border-gray-800">
									<SelectItem value="todos">Todos os status</SelectItem>
									{statusOptions.map((status) => (
										<SelectItem key={status.value} value={status.value}>
											{status.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select value={filterControlado} onValueChange={setFilterControlado}>
								<SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-700/50 text-white">
									<div className="flex items-center gap-2">
										<Shield className="h-4 w-4" />
										<SelectValue placeholder="Controlado" />
									</div>
								</SelectTrigger>
								<SelectContent className="bg-gray-900 border-gray-800">
									<SelectItem value="todos">Todos</SelectItem>
									<SelectItem value="sim">Controlados</SelectItem>
									<SelectItem value="nao">Não controlados</SelectItem>
								</SelectContent>
							</Select>

							<Select value={filterReceituario} onValueChange={setFilterReceituario}>
								<SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-700/50 text-white">
									<div className="flex items-center gap-2">
										<FileWarning className="h-4 w-4" />
										<SelectValue placeholder="Receituário" />
									</div>
								</SelectTrigger>
								<SelectContent className="bg-gray-900 border-gray-800">
									<SelectItem value="todos">Todos</SelectItem>
									{receituarioOptions.map((rec) => (
										<SelectItem key={rec.value} value={rec.value}>
											{rec.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Button
								variant="outline"
								size="icon"
								onClick={carregarMedicamentos}
								className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
							>
								<RefreshCw className="h-4 w-4" />
							</Button>

							<Button
								variant="outline"
								onClick={resetarFiltros}
								className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
							>
								<Filter className="h-4 w-4 mr-2" />
								Limpar
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tabela de Medicamentos */}
			<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
				<CardHeader>
					<CardTitle className="text-white flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Pill className="h-5 w-5 text-red-400" />
							<span>Medicamentos Cadastrados</span>
						</div>
						<div className="text-sm text-gray-400">
							Mostrando {filteredMedicamentos.length} de {medicamentos.length} medicamentos
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{medicamentos.length === 0 ? (
						<div className="text-center py-12">
							<Pill className="h-16 w-16 text-gray-600 mx-auto mb-4" />
							<p className="text-gray-400 text-lg">Nenhum medicamento cadastrado</p>
							<p className="text-gray-500 text-sm mt-2">
								Comece cadastrando seu primeiro medicamento
							</p>
							<Button
								className="mt-4 gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
								onClick={() => setIsDialogOpen(true)}
							>
								<Plus className="h-4 w-4" />
								Cadastrar Primeiro Medicamento
							</Button>
						</div>
					) : filteredMedicamentos.length === 0 ? (
						<div className="text-center py-12">
							<Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
							<p className="text-gray-400 text-lg">Nenhum medicamento encontrado</p>
							<p className="text-gray-500 text-sm mt-2">
								Tente ajustar os termos da busca ou os filtros
							</p>
						</div>
					) : (
						<div className="overflow-x-auto rounded-lg border border-gray-800/50">
							<Table>
								<TableHeader>
									<TableRow className="border-gray-800/50">
										<TableHead className="text-gray-400">Medicamento</TableHead>
										<TableHead className="text-gray-400">Princípio Ativo</TableHead>
										<TableHead className="text-gray-400">Concentração</TableHead>
										<TableHead className="text-gray-400">Estoque</TableHead>
										<TableHead className="text-gray-400">Status</TableHead>
										<TableHead className="text-gray-400">Receita</TableHead>
										<TableHead className="text-gray-400 text-right">Ações</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredMedicamentos.map((medicamento) => {
										const statusConfig = statusOptions.find(s => s.value === medicamento.status);
										const receitaConfig = receituarioOptions.find(r => r.value === medicamento.receituario);
										const estoqueCritico = medicamento.quantidadeEstoque <= medicamento.quantidadeMinima;
										const isControlado = medicamento.controlado;

										return (
											<TableRow key={medicamento.id} className="border-gray-800/30 hover:bg-gray-800/20">
												<TableCell>
													<div className="flex items-center gap-3">
														<div className={`p-2 rounded-lg ${isControlado ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/20' : 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20'}`}>
															<Pill className={`h-4 w-4 ${isControlado ? 'text-amber-400' : 'text-blue-400'}`} />
														</div>
														<div>
															<p className="font-medium text-white">{medicamento.nome}</p>
															<p className="text-xs text-gray-500">{medicamento.formaFarmaceutica}</p>
														</div>
													</div>
												</TableCell>
												<TableCell className="text-white">
													{medicamento.principioAtivo}
												</TableCell>
												<TableCell className="text-white">
													{medicamento.concentracao}
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<span className={`font-medium ${estoqueCritico ? 'text-amber-400' : 'text-emerald-400'}`}>
															{medicamento.quantidadeEstoque}
														</span>
														{estoqueCritico && (
															<AlertTriangle className="h-4 w-4 text-amber-400" />
														)}
													</div>
													<div className="text-xs text-gray-500">
														Mín: {medicamento.quantidadeMinima}
													</div>
												</TableCell>
												<TableCell>
													<Badge className={`bg-gradient-to-r border ${statusConfig?.color} ${statusConfig?.textColor} border-gray-700`}>
														{statusConfig?.label}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge className={`bg-gradient-to-r border ${receitaConfig?.color} ${receitaConfig?.textColor} border-gray-700`}>
														{receitaConfig?.label}
													</Badge>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex items-center justify-end gap-2">
														<Button
															size="sm"
															variant="ghost"
															onClick={() => {
																setSelectedMedicamento(medicamento);
																setIsDetailsOpen(true);
															}}
															className="text-gray-400 hover:text-white hover:bg-gray-800/30"
														>
															<Eye className="h-4 w-4" />
														</Button>
														<Button
															size="sm"
															variant="ghost"
															onClick={() => {}}
															className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
														>
															<Edit className="h-4 w-4" />
														</Button>
														<Button
															size="sm"
															variant="ghost"
															onClick={() => {}}
															className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
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
					)}
				</CardContent>
			</Card>

			{/* Modal: Novo Medicamento */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 text-white max-w-4xl">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Plus className="h-5 w-5 text-red-400" />
							Novo Medicamento
						</DialogTitle>
						<DialogDescription className="text-gray-400">
							Cadastre um novo medicamento no sistema
						</DialogDescription>
					</DialogHeader>
					
					<Tabs defaultValue="basico" className="space-y-4">
						<TabsList className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50 p-1">
							<TabsTrigger value="basico" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
								Informações Básicas
							</TabsTrigger>
							<TabsTrigger value="estoque" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
								Estoque e Preço
							</TabsTrigger>
							<TabsTrigger value="regulamentacao" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
								Regulamentação
							</TabsTrigger>
						</TabsList>

						<TabsContent value="basico" className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-3">
									<Label className="text-white">Nome Comercial *</Label>
									<Input
										className="bg-gray-900/50 border-gray-700/50 text-white"
										placeholder="Ex: Carprofeno"
									/>
								</div>
								<div className="space-y-3">
									<Label className="text-white">Princípio Ativo *</Label>
									<Input
										className="bg-gray-900/50 border-gray-700/50 text-white"
										placeholder="Ex: Carprofeno"
									/>
								</div>
							</div>
							
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="space-y-3">
									<Label className="text-white">Concentração</Label>
									<Input
										className="bg-gray-900/50 border-gray-700/50 text-white"
										placeholder="Ex: 50 mg/mL"
									/>
								</div>
								<div className="space-y-3">
									<Label className="text-white">Forma Farmacêutica</Label>
									<Select>
										<SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
											<SelectValue placeholder="Selecione" />
										</SelectTrigger>
										<SelectContent className="bg-gray-900 border-gray-800">
											{formasFarmaceuticas.map((forma) => (
												<SelectItem key={forma} value={forma}>
													{forma}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-3">
									<Label className="text-white">Classe Terapêutica</Label>
									<Select>
										<SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
											<SelectValue placeholder="Selecione" />
										</SelectTrigger>
										<SelectContent className="bg-gray-900 border-gray-800">
											{classesTerapeuticas.map((classe) => (
												<SelectItem key={classe} value={classe}>
													{classe}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="estoque" className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="space-y-3">
									<Label className="text-white">Quantidade em Estoque</Label>
									<Input
										type="number"
										className="bg-gray-900/50 border-gray-700/50 text-white"
										placeholder="0"
									/>
								</div>
								<div className="space-y-3">
									<Label className="text-white">Quantidade Mínima</Label>
									<Input
										type="number"
										className="bg-gray-900/50 border-gray-700/50 text-white"
										placeholder="10"
									/>
								</div>
								<div className="space-y-3">
									<Label className="text-white">Preço de Custo (R$)</Label>
									<Input
										type="number"
										step="0.01"
										className="bg-gray-900/50 border-gray-700/50 text-white"
										placeholder="0.00"
									/>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="regulamentacao" className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-3">
									<Label className="text-white">Receituário</Label>
									<Select>
										<SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
											<SelectValue placeholder="Selecione" />
										</SelectTrigger>
										<SelectContent className="bg-gray-900 border-gray-800">
											{receituarioOptions.map((rec) => (
												<SelectItem key={rec.value} value={rec.value}>
													{rec.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-3">
									<Label className="text-white">Status</Label>
									<Select>
										<SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
											<SelectValue placeholder="Selecione" />
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
					</Tabs>
					
					<DialogFooter>
						<Button
							variant="outline"
							className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
							onClick={() => setIsDialogOpen(false)}
						>
							Cancelar
						</Button>
						<Button 
							className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
						>
							<Plus className="h-4 w-4" />
							Salvar Medicamento
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Medicamentos;