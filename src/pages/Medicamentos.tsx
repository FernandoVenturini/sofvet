import React, { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import {
	Search,
	Filter,
	Plus,
	Edit,
	Trash2,
	Download,
	Upload,
	BookOpen,
	Stethoscope,
	Pill,
	Thermometer,
	Heart,
	Brain,
	Eye,
	Bone,
	AlertTriangle,
	CheckCircle,
	XCircle,
	ExternalLink,
	FileText,
	Database,
	Cloud,
	BrainCircuit,
	Dna,
	Loader2,
	BarChart3,
	Share2,
	Bookmark,
	Printer,
	Copy,
	Star,
	Zap,
	Activity,
	AlertCircle,
	Biohazard,
	Skull,
	Package,
	Calendar,
	Tag,
	Archive,
	FileWarning,
	Bell,
	CheckSquare,
	XSquare,
	Clock,
	User,
	Building,
	MapPin,
	Phone,
	Mail,
	Globe,
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
	const { toast } = useToast();

	// Estados
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("todos");
	const [filterControlado, setFilterControlado] = useState("todos");
	const [filterReceituario, setFilterReceituario] = useState("todos");
	const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
	const [loading, setLoading] = useState(true);

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
		{ value: "ativo", label: "Ativo", color: "bg-green-500" },
		{ value: "inativo", label: "Inativo", color: "bg-gray-500" },
		{ value: "suspenso", label: "Suspenso", color: "bg-red-500" },
	];

	const receituarioOptions = [
		{ value: "A1", label: "Receita A1", color: "bg-red-600" },
		{ value: "A2", label: "Receita A2", color: "bg-orange-600" },
		{ value: "A3", label: "Receita A3", color: "bg-yellow-600" },
		{ value: "B1", label: "Receita B1", color: "bg-blue-600" },
		{ value: "B2", label: "Receita B2", color: "bg-indigo-600" },
		{ value: "C1", label: "Receita C1", color: "bg-purple-600" },
		{ value: "sem", label: "Sem receita", color: "bg-green-600" },
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
			toast({
				title: "Erro",
				description: "Não foi possível carregar os medicamentos",
				variant: "destructive",
			});
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
	};

	return (
		<div className="min-h-screen bg-black text-white p-4 md:p-6">
			<div className="max-w-full mx-auto">
				{/* Header */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
					<div>
						<div className="flex items-center gap-3 mb-2">
							<Pill className="h-8 w-8 text-red-500" />
							<div>
								<h1 className="text-2xl md:text-3xl font-bold text-white">
									Medicamentos (DEF)
								</h1>
								<p className="text-gray-400 text-sm md:text-base">
									Controle de medicamentos de uso veterinário
								</p>
							</div>
						</div>
						<div className="flex flex-wrap items-center gap-2 mt-2">
							<Badge
								variant="outline"
								className="text-xs bg-black/50 border-red-600/50 text-white"
							>
								<Database className="h-3 w-3 mr-1" /> Total: {estatisticas.total}
							</Badge>
							<Badge
								variant="outline"
								className="text-xs bg-black/50 border-orange-600/50 text-orange-300"
							>
								<AlertTriangle className="h-3 w-3 mr-1" /> Controlados: {estatisticas.controlados}
							</Badge>
							<Badge
								variant="outline"
								className="text-xs bg-black/50 border-red-600/50 text-red-300"
							>
								<Bell className="h-3 w-3 mr-1" /> Notificáveis: {estatisticas.notificaveis}
							</Badge>
						</div>
					</div>

					<div className="flex flex-wrap gap-2">
						<Button
							variant="outline"
							className="border-red-600/50 text-white hover:bg-red-600/20"
							onClick={() => {/* Exportar */ }}
						>
							<Download className="mr-2 h-4 w-4" />
							Exportar
						</Button>
						<Button
							className="bg-red-600 hover:bg-red-700 text-white"
							onClick={() => setIsDialogOpen(true)}
						>
							<Plus className="mr-2 h-4 w-4" />
							Novo Medicamento
						</Button>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
					<Card className="bg-black/50 border-red-600/30">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs text-gray-400">Total em Estoque</p>
									<p className="text-xl font-bold text-white">
										{medicamentos.reduce((sum, m) => sum + m.quantidadeEstoque, 0)}
									</p>
									<p className="text-xs text-gray-500">Unidades</p>
								</div>
								<Package className="h-8 w-8 text-red-500 bg-red-500/20 p-1 rounded-lg" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-black/50 border-red-600/30">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs text-gray-400">Baixo Estoque</p>
									<p className="text-xl font-bold text-amber-300">
										{estatisticas.baixoEstoque}
									</p>
									<p className="text-xs text-gray-500">Atenção</p>
								</div>
								<AlertTriangle className="h-8 w-8 text-amber-500 bg-amber-500/20 p-1 rounded-lg" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-black/50 border-red-600/30">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs text-gray-400">Valor Estoque</p>
									<p className="text-xl font-bold text-green-500">
										R$ {estatisticas.valorEstoque.toFixed(2)}
									</p>
									<p className="text-xs text-gray-500">Custo total</p>
								</div>
								<BarChart3 className="h-8 w-8 text-green-500 bg-green-500/20 p-1 rounded-lg" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-black/50 border-red-600/30">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs text-gray-400">Medicamentos Ativos</p>
									<p className="text-xl font-bold text-blue-500">
										{medicamentos.filter(m => m.status === 'ativo').length}
									</p>
									<p className="text-xs text-gray-500">Disponíveis</p>
								</div>
								<CheckSquare className="h-8 w-8 text-blue-500 bg-blue-500/20 p-1 rounded-lg" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filtros e Busca */}
				<Card className="mb-6 bg-black/50 border-red-600/30">
					<CardContent className="p-4 md:p-6">
						<div className="flex flex-col lg:flex-row gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									placeholder="Buscar por nome, princípio ativo, registro MS..."
									className="pl-10 bg-black/30 border-red-600/50 text-white placeholder-gray-500"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
							<div className="flex flex-wrap gap-2">
								<Select value={filterStatus} onValueChange={setFilterStatus}>
									<SelectTrigger className="w-full sm:w-[150px] bg-black/30 border-red-600/50 text-white">
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent className="bg-black border-red-600/30">
										<SelectItem value="todos" className="text-white focus:bg-red-600/20">
											Todos
										</SelectItem>
										{statusOptions.map((status) => (
											<SelectItem
												key={status.value}
												value={status.value}
												className="text-white focus:bg-red-600/20"
											>
												{status.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Select value={filterControlado} onValueChange={setFilterControlado}>
									<SelectTrigger className="w-full sm:w-[150px] bg-black/30 border-red-600/50 text-white">
										<SelectValue placeholder="Controlado" />
									</SelectTrigger>
									<SelectContent className="bg-black border-red-600/30">
										<SelectItem value="todos" className="text-white focus:bg-red-600/20">
											Todos
										</SelectItem>
										<SelectItem value="sim" className="text-white focus:bg-red-600/20">
											Sim
										</SelectItem>
										<SelectItem value="nao" className="text-white focus:bg-red-600/20">
											Não
										</SelectItem>
									</SelectContent>
								</Select>

								<Select value={filterReceituario} onValueChange={setFilterReceituario}>
									<SelectTrigger className="w-full sm:w-[180px] bg-black/30 border-red-600/50 text-white">
										<SelectValue placeholder="Receituário" />
									</SelectTrigger>
									<SelectContent className="bg-black border-red-600/30">
										<SelectItem value="todos" className="text-white focus:bg-red-600/20">
											Todos
										</SelectItem>
										{receituarioOptions.map((rec) => (
											<SelectItem
												key={rec.value}
												value={rec.value}
												className="text-white focus:bg-red-600/20"
											>
												{rec.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Button
									variant="outline"
									className="border-red-600/50 text-white hover:bg-red-600/20"
									onClick={() => {
										setSearchTerm("");
										setFilterStatus("todos");
										setFilterControlado("todos");
										setFilterReceituario("todos");
									}}
								>
									<Filter className="mr-2 h-4 w-4" />
									Limpar
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Tabela de Medicamentos */}
				<Card className="mb-6 bg-black/50 border-red-600/30 overflow-hidden">
					<CardHeader className="border-b border-red-600/30">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
							<div>
								<CardTitle className="text-white">
									Medicamentos Cadastrados
								</CardTitle>
								<CardDescription className="text-gray-400">
									{filteredMedicamentos.length} de {medicamentos.length} medicamentos
								</CardDescription>
							</div>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									className="border-red-600/50 text-white hover:bg-red-600/20"
									onClick={() => window.print()}
								>
									<Printer className="mr-2 h-4 w-4" />
									Imprimir
								</Button>
							</div>
						</div>
					</CardHeader>

					<CardContent className="p-0">
						{loading ? (
							<div className="text-center py-12">
								<Loader2 className="h-8 w-8 animate-spin mx-auto text-red-500" />
								<p className="text-gray-400 mt-2">Carregando medicamentos...</p>
							</div>
						) : filteredMedicamentos.length === 0 ? (
							<div className="text-center py-12">
								<Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
								<h3 className="text-lg font-semibold text-gray-300 mb-2">
									Nenhum medicamento encontrado
								</h3>
								<p className="text-gray-500 mb-4">
									{searchTerm
										? `Nenhum resultado para "${searchTerm}"`
										: "Cadastre seu primeiro medicamento"}
								</p>
								<Button
									className="bg-red-600 hover:bg-red-700"
									onClick={() => setIsDialogOpen(true)}
								>
									<Plus className="mr-2 h-4 w-4" />
									Novo Medicamento
								</Button>
							</div>
						) : (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="border-red-600/30">
											<TableHead className="text-white bg-black/30">Medicamento</TableHead>
											<TableHead className="text-white bg-black/30">Princípio Ativo</TableHead>
											<TableHead className="text-white bg-black/30">Concentração</TableHead>
											<TableHead className="text-white bg-black/30">Estoque</TableHead>
											<TableHead className="text-white bg-black/30">Status</TableHead>
											<TableHead className="text-white bg-black/30">Receita</TableHead>
											<TableHead className="text-right text-white bg-black/30">Ações</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredMedicamentos.map((medicamento) => {
											const statusConfig = statusOptions.find(s => s.value === medicamento.status);
											const receitaConfig = receituarioOptions.find(r => r.value === medicamento.receituario);
											const estoqueCritico = medicamento.quantidadeEstoque <= medicamento.quantidadeMinima;

											return (
												<TableRow 
													key={medicamento.id} 
													className="border-red-600/30 hover:bg-red-600/10 transition-colors"
												>
													<TableCell className="font-medium text-white">
														<div className="flex items-center gap-3">
															<div className="p-2 rounded-lg bg-red-600/20">
																<Pill className="h-5 w-5 text-red-500" />
															</div>
															<div>
																<div className="font-semibold">{medicamento.nome}</div>
																<div className="text-xs text-gray-400">{medicamento.formaFarmaceutica}</div>
															</div>
														</div>
													</TableCell>
													<TableCell className="text-white">
														{medicamento.principioAtivo}
													</TableCell>
													<TableCell className="text-white">
														{medicamento.concentracao}
													</TableCell>
													<TableCell className="text-white">
														<div className="flex items-center">
															<span className={estoqueCritico ? "font-semibold text-amber-300" : "text-gray-300"}>
																{medicamento.quantidadeEstoque}
															</span>
															{estoqueCritico && (
																<AlertTriangle className="h-4 w-4 text-amber-500 ml-2" />
															)}
														</div>
														<div className="text-xs text-gray-500">
															Mín: {medicamento.quantidadeMinima}
														</div>
													</TableCell>
													<TableCell>
														<Badge className={`${statusConfig?.color} text-xs`}>
															{statusConfig?.label}
														</Badge>
													</TableCell>
													<TableCell>
														<Badge 
															variant="outline" 
															className={`border-${receitaConfig?.color?.split('-')[1] || 'gray'}-600/50 text-xs`}
														>
															{receitaConfig?.label}
														</Badge>
													</TableCell>
													<TableCell className="text-right">
														<div className="flex justify-end gap-1">
															<Button
																variant="ghost"
																size="sm"
																className="h-8 w-8 p-0 text-blue-400 hover:bg-blue-600/20"
																title="Detalhes"
															>
																<Eye className="h-4 w-4" />
															</Button>
															<Button
																variant="ghost"
																size="sm"
																className="h-8 w-8 p-0 text-green-400 hover:bg-green-600/20"
																title="Editar"
															>
																<Edit className="h-4 w-4" />
															</Button>
															<Button
																variant="ghost"
																size="sm"
																className="h-8 w-8 p-0 text-red-400 hover:bg-red-600/20"
																title="Excluir"
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
					<DialogContent className="max-w-4xl bg-black/90 border-red-600/30 text-white">
						<DialogHeader>
							<DialogTitle className="text-white">Novo Medicamento</DialogTitle>
							<DialogDescription className="text-gray-400">
								Cadastre um novo medicamento no sistema
							</DialogDescription>
						</DialogHeader>
						
						<div className="space-y-4 py-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="nome" className="text-white">Nome Comercial *</Label>
									<Input
										id="nome"
										className="bg-black/30 border-red-600/50 text-white"
										placeholder="Ex: Carprofeno"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="principioAtivo" className="text-white">Princípio Ativo *</Label>
									<Input
										id="principioAtivo"
										className="bg-black/30 border-red-600/50 text-white"
										placeholder="Ex: Carprofeno"
									/>
								</div>
							</div>
							
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="space-y-2">
									<Label htmlFor="concentracao" className="text-white">Concentração</Label>
									<Input
										id="concentracao"
										className="bg-black/30 border-red-600/50 text-white"
										placeholder="Ex: 50 mg/mL"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="formaFarmaceutica" className="text-white">Forma Farmacêutica</Label>
									<Select>
										<SelectTrigger className="bg-black/30 border-red-600/50 text-white">
											<SelectValue placeholder="Selecione" />
										</SelectTrigger>
										<SelectContent className="bg-black border-red-600/30">
											{formasFarmaceuticas.map((forma) => (
												<SelectItem key={forma} value={forma} className="text-white focus:bg-red-600/20">
													{forma}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="classeTerapeutica" className="text-white">Classe Terapêutica</Label>
									<Select>
										<SelectTrigger className="bg-black/30 border-red-600/50 text-white">
											<SelectValue placeholder="Selecione" />
										</SelectTrigger>
										<SelectContent className="bg-black border-red-600/30">
											{classesTerapeuticas.map((classe) => (
												<SelectItem key={classe} value={classe} className="text-white focus:bg-red-600/20">
													{classe}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
							
							<Separator className="bg-red-600/30" />
							
							<div className="space-y-2">
								<Label className="text-white">Vias de Administração</Label>
								<div className="flex flex-wrap gap-2">
									{viasAdministracao.map((via) => (
										<Badge
											key={via}
											variant="outline"
											className="cursor-pointer border-red-600/30 text-white hover:bg-red-600/20"
										>
											{via}
										</Badge>
									))}
								</div>
							</div>
						</div>
						
						<DialogFooter>
							<Button
								variant="outline"
								className="border-red-600/50 text-white hover:bg-red-600/20"
								onClick={() => setIsDialogOpen(false)}
							>
								Cancelar
							</Button>
							<Button className="bg-red-600 hover:bg-red-700 text-white">
								Salvar Medicamento
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};

export default Medicamentos;