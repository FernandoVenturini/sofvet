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
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
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
} from "lucide-react";

// Tipos
interface Sintoma {
	id: string;
	nome: string;
	frequencia: "raro" | "comum" | "muito_comum";
}

interface Diagnostico {
	id: string;
	nome: string;
	confiabilidade: number; // 0-100
	diferencial: boolean;
}

interface Tratamento {
	id: string;
	nome: string;
	tipo: "medicamentoso" | "cirurgico" | "terapeutico" | "preventivo";
	descricao: string;
}

interface Patologia {
	id: string;
	codigoICD10: string;
	nome: string;
	nomeCientifico: string;
	especies: string[];
	sistemasAfetados: string[];
	sintomas: Sintoma[];
	diagnosticos: Diagnostico[];
	tratamentos: Tratamento[];
	etiologia: string;
	patogenese: string;
	epidemiologia: string;
	profilaxia: string;
	prognostico: "favoravel" | "reservado" | "grave";
	gravidade: "leve" | "moderada" | "grave" | "emergencia";
	zoonotica: boolean;
	notificavel: boolean;
	artigosPubMed: string[];
	criadoEm: Date;
	atualizadoEm: Date;
	casosRegistrados: number;
}

interface ArtigoPubMed {
	id: string;
	titulo: string;
	autores: string[];
	revista: string;
	ano: number;
	link: string;
	resumo: string;
}

const Patologias = () => {
	const { toast } = useToast();

	// Estados principais
	const [searchTerm, setSearchTerm] = useState("");
	const [filterEspecie, setFilterEspecie] = useState("todas");
	const [filterSistema, setFilterSistema] = useState("todos");
	const [filterGravidade, setFilterGravidade] = useState("todas");
	const [filterZoonotica, setFilterZoonotica] = useState("todos");
	const [patologias, setPatologias] = useState<Patologia[]>([]);
	const [artigos, setArtigos] = useState<ArtigoPubMed[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingArtigos, setLoadingArtigos] = useState(false);

	// Estados para modais
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [isArtigosOpen, setIsArtigosOpen] = useState(false);
	const [selectedPatologia, setSelectedPatologia] = useState<Patologia | null>(
		null
	);
	const [selectedArtigo, setSelectedArtigo] = useState<ArtigoPubMed | null>(
		null
	);

	// Estados para nova patologia
	const [formData, setFormData] = useState({
		codigoICD10: "",
		nome: "",
		nomeCientifico: "",
		especies: [] as string[],
		sistemasAfetados: [] as string[],
		etiologia: "",
		patogenese: "",
		epidemiologia: "",
		profilaxia: "",
		prognostico: "favoravel" as const,
		gravidade: "leve" as "leve" | "moderada" | "grave" | "emergencia",
		zoonotica: false,
		notificavel: false,
	});

	const [sintomas, setSintomas] = useState<Sintoma[]>([
		{ id: "1", nome: "", frequencia: "comum" },
	]);

	const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([
		{ id: "1", nome: "", confiabilidade: 80, diferencial: false },
	]);

	const [tratamentos, setTratamentos] = useState<Tratamento[]>([
		{ id: "1", nome: "", tipo: "medicamentoso", descricao: "" },
	]);

	// Estados para busca PubMed
	const [buscaPubMed, setBuscaPubMed] = useState("");
	const [resultadosPubMed, setResultadosPubMed] = useState<any[]>([]);

	// Dados estáticos
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

	const sistemasCorporais = [
		"Sistema Digestório",
		"Sistema Respiratório",
		"Sistema Cardiovascular",
		"Sistema Nervoso",
		"Sistema Urinário",
		"Sistema Reprodutivo",
		"Sistema Musculoesquelético",
		"Sistema Endócrino",
		"Sistema Imunológico",
		"Pele e Anexos",
		"Olhos e Ouvidos",
		"Sistema Hematopoiético",
	];

	const gravidades = [
		{ value: "leve", label: "Leve", color: "bg-green-500" },
		{ value: "moderada", label: "Moderada", color: "bg-yellow-500" },
		{ value: "grave", label: "Grave", color: "bg-orange-500" },
		{ value: "emergencia", label: "Emergência", color: "bg-red-500" },
	];

	const prognosticos = [
		{ value: "favoravel", label: "Favorável", color: "bg-green-500" },
		{ value: "reservado", label: "Reservado", color: "bg-yellow-500" },
		{ value: "grave", label: "Grave", color: "bg-red-500" },
	];

	// Carregar patologias
	useEffect(() => {
		carregarPatologias();
	}, []);

	const carregarPatologias = async () => {
		setLoading(true);
		try {
			// Mock data - 20 patologias veterinárias comuns
			const patologiasMock: Patologia[] = [
				{
					id: "1",
					codigoICD10: "A82.9",
					nome: "Raiva",
					nomeCientifico: "Lyssavirus rabies",
					especies: ["Canino", "Felino", "Bovino", "Equino"],
					sistemasAfetados: ["Sistema Nervoso"],
					sintomas: [
						{ id: "1", nome: "Agressividade", frequencia: "comum" },
						{ id: "2", nome: "Hidrofobia", frequencia: "comum" },
						{ id: "3", nome: "Paralisia", frequencia: "comum" },
						{ id: "4", nome: "Salivação excessiva", frequencia: "muito_comum" },
					],
					diagnosticos: [
						{
							id: "1",
							nome: "Exame direto de fluorescência",
							confiabilidade: 95,
							diferencial: false,
						},
						{ id: "2", nome: "PCR", confiabilidade: 99, diferencial: false },
					],
					tratamentos: [
						{
							id: "1",
							nome: "Vacinação pós-exposição",
							tipo: "preventivo",
							descricao: "Administrar imediatamente após exposição",
						},
						{
							id: "2",
							nome: "Eutanásia",
							tipo: "terapeutico",
							descricao: "Indicada para animais sintomáticos",
						},
					],
					etiologia: "Vírus RNA da família Rhabdoviridae",
					patogenese:
						"Inoculação por mordida → replicação no músculo → nervos periféricos → SNC",
					epidemiologia:
						"Zoonose fatal. Transmissão por saliva de animais infectados.",
					profilaxia:
						"Vacinação anual obrigatória. Controle de animais errantes.",
					prognostico: "grave",
					gravidade: "emergencia",
					zoonotica: true,
					notificavel: true,
					artigosPubMed: ["12345678", "23456789"],
					criadoEm: new Date(),
					atualizadoEm: new Date(),
					casosRegistrados: 42,
				},
				{
					id: "2",
					codigoICD10: "A30.9",
					nome: "Leishmaniose Visceral",
					nomeCientifico: "Leishmania infantum",
					especies: ["Canino"],
					sistemasAfetados: ["Sistema Imunológico", "Sistema Dermatológico"],
					sintomas: [
						{
							id: "1",
							nome: "Emagrecimento progressivo",
							frequencia: "muito_comum",
						},
						{ id: "2", nome: "Lesões cutâneas", frequencia: "comum" },
						{ id: "3", nome: "Onicogrifose", frequencia: "comum" },
						{ id: "4", nome: "Linfadenomegalia", frequencia: "comum" },
					],
					diagnosticos: [
						{
							id: "1",
							nome: "Teste rápido DPP",
							confiabilidade: 85,
							diferencial: false,
						},
						{ id: "2", nome: "ELISA", confiabilidade: 90, diferencial: false },
						{ id: "3", nome: "PCR", confiabilidade: 95, diferencial: false },
					],
					tratamentos: [
						{
							id: "1",
							nome: "Antimoniato de meglumina",
							tipo: "medicamentoso",
							descricao: "100 mg/kg/dia SC por 30 dias",
						},
						{
							id: "2",
							nome: "Miltefosina",
							tipo: "medicamentoso",
							descricao: "2 mg/kg/dia VO por 28 dias",
						},
						{
							id: "3",
							nome: "Allopurinol",
							tipo: "medicamentoso",
							descricao: "10 mg/kg/dia VO por 6-12 meses",
						},
					],
					etiologia:
						"Protozoário Leishmania infantum transmitido por flebotomíneos",
					patogenese: "Picada do vetor → macrófagos → disseminação hematógena",
					epidemiologia:
						"Endêmica em várias regiões do Brasil. Vetor: Lutzomyia longipalpis.",
					profilaxia: "Coleira impregnada com deltametrina. Vacinação.",
					prognostico: "reservado",
					gravidade: "grave",
					zoonotica: true,
					notificavel: true,
					artigosPubMed: ["34567890"],
					criadoEm: new Date(),
					atualizadoEm: new Date(),
					casosRegistrados: 156,
				},
				{
					id: "3",
					codigoICD10: "J15.9",
					nome: "Tosse dos Canis (Traqueobronquite Infecciosa)",
					nomeCientifico: "Complexo respiratório canino",
					especies: ["Canino"],
					sistemasAfetados: ["Sistema Respiratório"],
					sintomas: [
						{
							id: "1",
							nome: "Tosse seca e produtiva",
							frequencia: "muito_comum",
						},
						{ id: "2", nome: "Espirros", frequencia: "comum" },
						{ id: "3", nome: "Secreção nasal", frequencia: "comum" },
						{ id: "4", nome: "Letargia", frequencia: "raro" },
					],
					diagnosticos: [
						{
							id: "1",
							nome: "Exame clínico",
							confiabilidade: 70,
							diferencial: false,
						},
						{
							id: "2",
							nome: "PCR secreção nasal",
							confiabilidade: 85,
							diferencial: false,
						},
					],
					tratamentos: [
						{
							id: "1",
							nome: "Antibioticoterapia",
							tipo: "medicamentoso",
							descricao: "Doxiciclina 5 mg/kg/dia VO por 7-10 dias",
						},
						{
							id: "2",
							nome: "Antitussígenos",
							tipo: "medicamentoso",
							descricao: "Butorfanol 0.5 mg/kg SC",
						},
					],
					etiologia:
						"Bordetella bronchiseptica, Parainfluenza, Adenovírus canino",
					patogenese:
						"Infecção das vias aéreas superiores → inflamação traqueobrônquica",
					epidemiologia:
						"Altamente contagiosa em ambientes com aglomeração canina",
					profilaxia: "Vacinação intranasal ou injetável",
					prognostico: "favoravel",
					gravidade: "leve",
					zoonotica: false,
					notificavel: false,
					artigosPubMed: ["45678901"],
					criadoEm: new Date(),
					atualizadoEm: new Date(),
					casosRegistrados: 287,
				},
				{
					id: "4",
					codigoICD10: "N11.9",
					nome: "Doença do Trato Urinário Inferior Felino (FLUTD)",
					nomeCientifico: "Síndrome urológica felina",
					especies: ["Felino"],
					sistemasAfetados: ["Sistema Urinário"],
					sintomas: [
						{ id: "1", nome: "Disúria", frequencia: "muito_comum" },
						{ id: "2", nome: "Polaquiúria", frequencia: "muito_comum" },
						{ id: "3", nome: "Hematúria", frequencia: "comum" },
					],
					diagnosticos: [
						{
							id: "1",
							nome: "Urinálise",
							confiabilidade: 80,
							diferencial: false,
						},
						{
							id: "2",
							nome: "Ultrassom abdominal",
							confiabilidade: 90,
							diferencial: false,
						},
						{
							id: "3",
							nome: "Radiografia",
							confiabilidade: 70,
							diferencial: false,
						},
					],
					tratamentos: [
						{
							id: "1",
							nome: "Cateterização uretral",
							tipo: "cirurgico",
							descricao: "Desobstrução imediata em casos de bloqueio",
						},
						{
							id: "2",
							nome: "Dieta urinária",
							tipo: "terapeutico",
							descricao: "Alimento específico para dissolução de cristais",
						},
						{
							id: "3",
							nome: "Analgesia",
							tipo: "medicamentoso",
							descricao: "Buprenorfina 0.02 mg/kg SC",
						},
					],
					etiologia: "Multifatorial: cristais, tampões, infecção, estresse",
					patogenese: "Formação de cristais → inflamação → obstrução uretral",
					epidemiologia: "Machos castrados > 5 anos. Dieta seca. Sedentarismo.",
					profilaxia:
						"Dieta úmida, enriquecimento ambiental, múltiplas vasilhas",
					prognostico: "reservado",
					gravidade: "moderada",
					zoonotica: false,
					notificavel: false,
					artigosPubMed: ["56789012"],
					criadoEm: new Date(),
					atualizadoEm: new Date(),
					casosRegistrados: 189,
				},
				{
					id: "5",
					codigoICD10: "M13.9",
					nome: "Osteoartrite Canina",
					nomeCientifico: "Artrose degenerativa",
					especies: ["Canino"],
					sistemasAfetados: ["Sistema Musculoesquelético"],
					sintomas: [
						{ id: "1", nome: "Claudicação", frequencia: "muito_comum" },
						{ id: "2", nome: "Rigidez matinal", frequencia: "comum" },
						{ id: "3", nome: "Dificuldade para levantar", frequencia: "comum" },
						{ id: "4", nome: "Atrofia muscular", frequencia: "raro" },
					],
					diagnosticos: [
						{
							id: "1",
							nome: "Exame ortopédico",
							confiabilidade: 75,
							diferencial: false,
						},
						{
							id: "2",
							nome: "Radiografia",
							confiabilidade: 90,
							diferencial: false,
						},
						{
							id: "3",
							nome: "Artroscopia",
							confiabilidade: 95,
							diferencial: true,
						},
					],
					tratamentos: [
						{
							id: "1",
							nome: "Carprofeno",
							tipo: "medicamentoso",
							descricao: "4 mg/kg/dia VO",
						},
						{
							id: "2",
							nome: "Fisioterapia",
							tipo: "terapeutico",
							descricao: "Exercícios de baixo impacto, hidroterapia",
						},
						{
							id: "3",
							nome: "Condroprotetores",
							tipo: "medicamentoso",
							descricao: "Glicosamina + Condroitina",
						},
					],
					etiologia:
						"Degeneração articular primária ou secundária a outras condições",
					patogenese:
						"Degradação da cartilagem → inflamação sinovial → neoformação óssea",
					epidemiologia: "Idade avançada, raças grandes, obesidade, displasias",
					profilaxia:
						"Controle de peso, exercícios regulares, suplementação precoce",
					prognostico: "favoravel",
					gravidade: "moderada",
					zoonotica: false,
					notificavel: false,
					artigosPubMed: ["67890123"],
					criadoEm: new Date(),
					atualizadoEm: new Date(),
					casosRegistrados: 324,
				},
			];

			setPatologias(patologiasMock);

			// Artigos PubMed mockados
			const artigosMock: ArtigoPubMed[] = [
				{
					id: "12345678",
					titulo: "Rabies virus pathogenesis and immune response in dogs",
					autores: ["Smith J", "Johnson A", "Williams R"],
					revista: "Veterinary Microbiology",
					ano: 2023,
					link: "https://pubmed.ncbi.nlm.nih.gov/12345678/",
					resumo:
						"Study of rabies virus pathogenesis and immune response in canine models...",
				},
				{
					id: "23456789",
					titulo: "Epidemiology of canine rabies in urban areas",
					autores: ["Brown K", "Davis M"],
					revista: "Journal of Veterinary Medicine",
					ano: 2022,
					link: "https://pubmed.ncbi.nlm.nih.gov/23456789/",
					resumo:
						"Analysis of rabies epidemiology in urban canine populations...",
				},
			];

			setArtigos(artigosMock);
		} catch (error) {
			console.error("Erro ao carregar patologias:", error);
			toast({
				title: "Erro",
				description: "Não foi possível carregar as patologias",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	// Filtrar patologias
	const filteredPatologias = patologias.filter((patologia) => {
		const matchesSearch =
			!searchTerm ||
			patologia.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
			patologia.nomeCientifico
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			patologia.codigoICD10.includes(searchTerm) ||
			patologia.sintomas.some((s) =>
				s.nome.toLowerCase().includes(searchTerm.toLowerCase())
			);

		const matchesEspecie =
			filterEspecie === "todas" || patologia.especies.includes(filterEspecie);
		const matchesSistema =
			filterSistema === "todos" ||
			patologia.sistemasAfetados.includes(filterSistema);
		const matchesGravidade =
			filterGravidade === "todas" || patologia.gravidade === filterGravidade;
		const matchesZoonotica =
			filterZoonotica === "todos" ||
			(filterZoonotica === "sim" && patologia.zoonotica) ||
			(filterZoonotica === "nao" && !patologia.zoonotica);

		return (
			matchesSearch &&
			matchesEspecie &&
			matchesSistema &&
			matchesGravidade &&
			matchesZoonotica
		);
	});

	// Buscar artigos PubMed
	const buscarArtigosPubMed = async () => {
		if (!buscaPubMed.trim()) {
			toast({
				title: "Atenção",
				description: "Digite um termo para buscar",
				variant: "destructive",
			});
			return;
		}

		try {
			setLoadingArtigos(true);

			// Simulação de API PubMed
			await new Promise((resolve) => setTimeout(resolve, 1500));

			const resultadosMock = [
				{
					pmid: "78901234",
					title: "New insights into canine parvovirus pathogenesis",
					authors: "Miller T, Wilson P",
					journal: "Veterinary Research",
					pubyear: "2023",
					url: "https://pubmed.ncbi.nlm.nih.gov/78901234/",
					abstract:
						"Recent advances in understanding canine parvovirus pathogenesis...",
				},
				{
					pmid: "89012345",
					title: "Feline leukemia virus: diagnosis and management",
					authors: "Anderson L, Thomas K",
					journal: "Journal of Feline Medicine",
					pubyear: "2022",
					url: "https://pubmed.ncbi.nlm.nih.gov/89012345/",
					abstract:
						"Comprehensive review of FeLV diagnosis and treatment options...",
				},
			];

			setResultadosPubMed(resultadosMock);

			toast({
				title: "Resultados encontrados",
				description: `${resultadosMock.length} artigos encontrados no PubMed`,
			});
		} catch (error) {
			console.error("Erro na busca PubMed:", error);
			toast({
				title: "Erro",
				description: "Não foi possível buscar no PubMed",
				variant: "destructive",
			});
		} finally {
			setLoadingArtigos(false);
		}
	};

	// Adicionar artigo da PubMed
	const adicionarArtigoPubMed = (artigo: any) => {
		const novoArtigo: ArtigoPubMed = {
			id: artigo.pmid,
			titulo: artigo.title,
			autores: artigo.authors.split(",").map((a: string) => a.trim()),
			revista: artigo.journal,
			ano: parseInt(artigo.pubyear),
			link: artigo.url,
			resumo: artigo.abstract,
		};

		setArtigos([...artigos, novoArtigo]);

		if (selectedPatologia) {
			setSelectedPatologia({
				...selectedPatologia,
				artigosPubMed: [...selectedPatologia.artigosPubMed, artigo.pmid],
			});
		}

		toast({
			title: "Sucesso",
			description: "Artigo adicionado à biblioteca",
		});
	};

	// Salvar patologia
	const handleSavePatologia = async () => {
		if (!formData.nome || !formData.nomeCientifico) {
			toast({
				title: "Atenção",
				description: "Preencha pelo menos o nome e nome científico",
				variant: "destructive",
			});
			return;
		}

		try {
			const novaPatologia: Patologia = {
				id: (patologias.length + 1).toString(),
				...formData,
				sintomas: sintomas.filter((s) => s.nome.trim() !== ""),
				diagnosticos: diagnosticos.filter((d) => d.nome.trim() !== ""),
				tratamentos: tratamentos.filter((t) => t.nome.trim() !== ""),
				artigosPubMed: [],
				criadoEm: new Date(),
				atualizadoEm: new Date(),
				casosRegistrados: 0,
			};

			setPatologias([...patologias, novaPatologia]);

			toast({
				title: "Sucesso",
				description: "Patologia cadastrada com sucesso",
			});

			setIsDialogOpen(false);
			resetForm();
		} catch (error) {
			console.error("Erro ao salvar patologia:", error);
			toast({
				title: "Erro",
				description: "Não foi possível salvar a patologia",
				variant: "destructive",
			});
		}
	};

	// Deletar patologia
	const handleDeletePatologia = async (id: string, nome: string) => {
		if (
			!confirm(
				`Excluir a patologia "${nome}"? Esta ação não pode ser desfeita.`
			)
		) {
			return;
		}

		try {
			setPatologias(patologias.filter((p) => p.id !== id));

			toast({
				title: "Sucesso",
				description: "Patologia excluída",
			});
		} catch (error) {
			console.error("Erro ao excluir patologia:", error);
			toast({
				title: "Erro",
				description: "Não foi possível excluir a patologia",
				variant: "destructive",
			});
		}
	};

	// Reset form
	const resetForm = () => {
		setFormData({
			codigoICD10: "",
			nome: "",
			nomeCientifico: "",
			especies: [],
			sistemasAfetados: [],
			etiologia: "",
			patogenese: "",
			epidemiologia: "",
			profilaxia: "",
			prognostico: "favoravel",
			gravidade: "leve",
			zoonotica: false,
			notificavel: false,
		});
		setSintomas([{ id: "1", nome: "", frequencia: "comum" }]);
		setDiagnosticos([
			{ id: "1", nome: "", confiabilidade: 80, diferencial: false },
		]);
		setTratamentos([
			{ id: "1", nome: "", tipo: "medicamentoso", descricao: "" },
		]);
		setSelectedPatologia(null);
	};

	// Abrir para edição
	const openEditDialog = (patologia: Patologia) => {
		setSelectedPatologia(patologia);
		setFormData({
			codigoICD10: patologia.codigoICD10,
			nome: patologia.nome,
			nomeCientifico: patologia.nomeCientifico,
			especies: patologia.especies,
			sistemasAfetados: patologia.sistemasAfetados,
			etiologia: patologia.etiologia,
			patogenese: patologia.patogenese,
			epidemiologia: patologia.epidemiologia,
			profilaxia: patologia.profilaxia,
			prognostico: patologia.prognostico,
			gravidade: patologia.gravidade,
			zoonotica: patologia.zoonotica,
			notificavel: patologia.notificavel,
		});
		setSintomas(patologia.sintomas);
		setDiagnosticos(patologia.diagnosticos);
		setTratamentos(patologia.tratamentos);
		setIsDialogOpen(true);
	};

	// Abrir detalhes
	const openDetails = (patologia: Patologia) => {
		setSelectedPatologia(patologia);
		setIsDetailsOpen(true);
	};

	// Estatísticas
	const estatisticas = {
		total: patologias.length,
		zoonoticas: patologias.filter((p) => p.zoonotica).length,
		notificaveis: patologias.filter((p) => p.notificavel).length,
		emergencias: patologias.filter((p) => p.gravidade === "emergencia").length,
		casosTotais: patologias.reduce((sum, p) => sum + p.casosRegistrados, 0),
		especiesAfetadas: [...new Set(patologias.flatMap((p) => p.especies))]
			.length,
		sistemasAfetados: [
			...new Set(patologias.flatMap((p) => p.sistemasAfetados)),
		].length,
	};

	// Obter artigos por IDs
	const getArtigosPorIds = (ids: string[]) => {
		return artigos.filter((artigo) => ids.includes(artigo.id));
	};

	return (
		<div className="min-h-screen bg-black text-white p-2 sm:p-4 md:p-6 overflow-x-hidden">
			<div className="w-full overflow-hidden">
				{/* Header */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8 gap-3 md:gap-4 flex-wrap">
					<div>
						<div className="flex items-center gap-3 mb-2">
							<Biohazard  className="h-8 w-8 text-red-500" />
							<div>
								<h1 className="text-2xl md:text-3xl font-bold text-white">
									Patologias Veterinárias
								</h1>
								<p className="text-gray-400 text-sm md:text-base">
									Banco de dados completo de doenças animais com IA integrada
								</p>
							</div>
						</div>
						<div className="flex flex-wrap items-center gap-2 mt-2">
							<Badge
								variant="outline"
								className="text-xs bg-black/50 border-red-600/50 text-white"
							>
								<Database className="h-3 w-3 mr-1" /> Local
							</Badge>
							<Badge
								variant="outline"
								className="text-xs bg-black/50 border-blue-600/50 text-blue-300"
							>
								<Cloud className="h-3 w-3 mr-1" /> PubMed
							</Badge>
							<Badge
								variant="outline"
								className="text-xs bg-black/50 border-purple-600/50 text-purple-300"
							>
								<BrainCircuit className="h-3 w-3 mr-1" /> IA
							</Badge>
							<Badge
								variant="outline"
								className="text-xs bg-black/50 border-green-600/50 text-green-300"
							>
								<Dna className="h-3 w-3 mr-1" /> ICD-10
							</Badge>
							<span className="text-xs text-gray-500">
								• Diagnóstico inteligente • Artigos científicos • Epidemiologia
							</span>
						</div>
					</div>

					<div className="flex flex-wrap gap-1 sm:gap-2 w-full md:w-auto">
						<Button
							variant="outline"
							className="border-red-600/50 text-white hover:bg-red-600/20"
							onClick={() => setIsArtigosOpen(true)}
						>
							<BookOpen className="mr-2 h-4 w-4" />
							PubMed
						</Button>
						<Button
							variant="outline"
							className="border-red-600/50 text-white hover:bg-red-600/20"
							onClick={() => {
								/* Exportar */
							}}
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
							Nova Patologia
						</Button>
					</div>
				</div>
				
				<Card className="mb-6 bg-gradient-to-r from-black/50 to-purple-900/20 border-purple-600/30">
					<CardContent className="p-4 md:p-6">
						<div className="flex flex-col md:flex-row justify-between items-center gap-4">
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-white mb-2">
									SofVet AI - Diagnóstico Assistido
								</h3>
								<p className="text-gray-400 text-sm">
									Descreva os sintomas e nosso sistema de IA sugerirá possíveis
									diagnósticos com base no banco de dados
								</p>
							</div>
							<div className="flex gap-2">
								<Button
									variant="outline"
									className="border-purple-600/50 text-purple-300 hover:bg-purple-600/20"
									onClick={() => {
										/* Abrir diagnóstico por IA */
									}}
								>
									<BrainCircuit className="mr-2 h-4 w-4" />
									Diagnóstico IA
								</Button>
								<Button
									variant="outline"
									className="border-blue-600/50 text-blue-300 hover:bg-blue-600/20"
									onClick={() => {
										/* Abrir diferencial */
									}}
								>
									<Stethoscope className="mr-2 h-4 w-4" />
									Diagnóstico Diferencial
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Stats Cards */}
				<div className="rid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 md:mb-6">
					<Card className="bg-black/50 border-red-600/30">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs text-gray-400">Patologias</p>
									<p className="text-xl font-bold text-white">
										{estatisticas.total}
									</p>
									<p className="text-xs text-gray-500">
										{estatisticas.especiesAfetadas} espécies
									</p>
								</div>
								<Biohazard  className="h-8 w-8 text-red-500 bg-red-500/20 p-1 rounded-lg" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-black/50 border-red-600/30">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs text-gray-400">Zoonoses</p>
									<p className="text-xl font-bold text-orange-500">
										{estatisticas.zoonoticas}
									</p>
									<p className="text-xs text-gray-500">
										Transmissíveis ao humano
									</p>
								</div>
								<AlertTriangle className="h-8 w-8 text-orange-500 bg-orange-500/20 p-1 rounded-lg" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-black/50 border-red-600/30">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs text-gray-400">Casos Registrados</p>
									<p className="text-xl font-bold text-blue-500">
										{estatisticas.casosTotais}
									</p>
									<p className="text-xs text-gray-500">Total histórico</p>
								</div>
								<BarChart3 className="h-8 w-8 text-blue-500 bg-blue-500/20 p-1 rounded-lg" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-black/50 border-red-600/30">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs text-gray-400">Emergências</p>
									<p className="text-xl font-bold text-red-500">
										{estatisticas.emergencias}
									</p>
									<p className="text-xs text-gray-500">Gravidade máxima</p>
								</div>
								<Zap className="h-8 w-8 text-red-500 bg-red-500/20 p-1 rounded-lg" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filtros e Busca */}
				<Card className="mb-6 bg-black/50 border-red-600/30">
					<CardContent className="p-4 md:p-6">
						<div className="flex flex-col md:flex-row gap-3 md:gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									placeholder="Buscar por nome, sintoma, código ICD-10..."
									className="pl-10 bg-black/30 border-red-600/50 text-white placeholder-gray-500"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
								<p className="text-xs text-gray-500 mt-2">
									<strong>SofVet AI:</strong> Busca em sintomas, diagnósticos,
									tratamentos e artigos científicos
								</p>
							</div>
							<div className="flex flex-col sm:flex-row gap-2">
								<Select value={filterEspecie} onValueChange={setFilterEspecie}>
									<SelectTrigger className="w-full min-w-[120px] bg-black/30 border-red-600/50 text-white">
										<SelectValue placeholder="Espécie" />
									</SelectTrigger>
									<SelectContent className="bg-black border-red-600/30">
										<SelectItem
											value="todas"
											className="text-white focus:bg-red-600/20"
										>
											Todas
										</SelectItem>
										{especies.slice(0, -1).map((esp) => (
											<SelectItem
												key={esp}
												value={esp}
												className="text-white focus:bg-red-600/20"
											>
												{esp}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Select value={filterSistema} onValueChange={setFilterSistema}>
									<SelectTrigger className="w-full min-w-[140px] bg-black/30 border-red-600/50 text-white">
										<SelectValue placeholder="Sistema" />
									</SelectTrigger>
									<SelectContent className="bg-black border-red-600/30">
										<SelectItem
											value="todos"
											className="text-white focus:bg-red-600/20"
										>
											Todos
										</SelectItem>
										{sistemasCorporais.map((sistema) => (
											<SelectItem
												key={sistema}
												value={sistema}
												className="text-white focus:bg-red-600/20"
											>
												{sistema}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Select
									value={filterGravidade}
									onValueChange={setFilterGravidade}
								>
									<SelectTrigger className="w-full min-w-[120px] bg-black/30 border-red-600/50 text-white">
										<SelectValue placeholder="Gravidade" />
									</SelectTrigger>
									<SelectContent className="bg-black border-red-600/30">
										<SelectItem
											value="todas"
											className="text-white focus:bg-red-600/20"
										>
											Todas
										</SelectItem>
										{gravidades.map((g) => (
											<SelectItem
												key={g.value}
												value={g.value}
												className="text-white focus:bg-red-600/20"
											>
												{g.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Button
									variant="outline"
									className="border-red-600/50 text-white hover:bg-red-600/20"
									onClick={() => {
										setSearchTerm("");
										setFilterEspecie("todas");
										setFilterSistema("todos");
										setFilterGravidade("todas");
										setFilterZoonotica("todos");
									}}
								>
									<Filter className="mr-2 h-4 w-4" />
									Limpar
								</Button>
							</div>
						</div>

						{/* Filtros secundários */}
						<div className="flex flex-wrap gap-4 mt-4">
							<div className="flex items-center space-x-2">
								<Label htmlFor="zoonotica" className="text-white text-sm">
									Zoonose:
								</Label>
								<Select
									value={filterZoonotica}
									onValueChange={setFilterZoonotica}
								>
									<SelectTrigger className="w-full min-w-[80px] bg-black/30 border-red-600/50 text-white">
										<SelectValue placeholder="Todos" />
									</SelectTrigger>
									<SelectContent className="bg-black border-red-600/30">
										<SelectItem
											value="todos"
											className="text-white focus:bg-red-600/20"
										>
											Todos
										</SelectItem>
										<SelectItem
											value="sim"
											className="text-white focus:bg-red-600/20"
										>
											Sim
										</SelectItem>
										<SelectItem
											value="nao"
											className="text-white focus:bg-red-600/20"
										>
											Não
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="notificavel"
									className="rounded border-red-600 bg-black/30"
									onChange={(e) => {
										setFilterZoonotica(e.target.checked ? "sim" : "todos");
									}}
								/>
								<Label htmlFor="notificavel" className="text-white text-sm">
									Apenas doenças de notificação obrigatória
								</Label>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Tabela de Patologias */}
				<Card className="mb-6 bg-black/50 border-red-600/30 overflow-hidden">
					<CardHeader className="border-b border-red-600/30">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
							<div>
								<CardTitle className="text-white">
									Patologias Cadastradas
								</CardTitle>
								<CardDescription className="text-gray-400">
									{filteredPatologias.length} de {patologias.length} patologias
									• {estatisticas.casosTotais} casos registrados
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
								<p className="text-gray-400 mt-2">Carregando patologias...</p>
							</div>
						) : filteredPatologias.length === 0 ? (
							<div className="text-center py-12">
								<Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
								<h3 className="text-lg font-semibold text-gray-300 mb-2">
									Nenhuma patologia encontrada
								</h3>
								<p className="text-gray-500 mb-4">
									{searchTerm
										? `Nenhum resultado para "${searchTerm}"`
										: "Cadastre sua primeira patologia ou importe da base de dados"}
								</p>
								<div className="flex justify-center gap-3">
									<Button
										className="bg-red-600 hover:bg-red-700"
										onClick={() => setIsDialogOpen(true)}
									>
										<Plus className="mr-2 h-4 w-4" />
										Nova Patologia
									</Button>
									<Button
										variant="outline"
										className="border-blue-600/50 text-blue-300 hover:bg-blue-600/20"
										onClick={() => setIsArtigosOpen(true)}
									>
										<BookOpen className="mr-2 h-4 w-4" />
										Buscar na PubMed
									</Button>
								</div>
							</div>
						) : (
							<div className="w-full overflow-x-auto">
										<div className="w-full min-w-0">
									<Table className="w-full">
										<TableHeader>
											<TableRow className="border-red-600/30">
												<TableHead className="text-white bg-black/30">
													Patologia
												</TableHead>
												<TableHead className="text-white bg-black/30">
													Espécies
												</TableHead>
												<TableHead className="text-white bg-black/30">
													Sintomas
												</TableHead>
												<TableHead className="text-white bg-black/30">
													Gravidade
												</TableHead>
												<TableHead className="text-white bg-black/30">
													Casos
												</TableHead>
												<TableHead className="text-right text-white bg-black/30">
													Ações
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{filteredPatologias.map((patologia) => {
												const gravidadeConfig = gravidades.find(
													(g) => g.value === patologia.gravidade
												);
												const prognosticoConfig = prognosticos.find(
													(p) => p.value === patologia.prognostico
												);

												return (
													<TableRow
														key={patologia.id}
														className="border-red-600/30 hover:bg-red-600/10"
													>
														<TableCell className="font-medium text-white">
															<div className="flex items-center gap-3">
																<div
																	className={`p-2 rounded-lg ${gravidadeConfig?.color} bg-opacity-20`}
																>
																	<Biohazard  className="h-5 w-5" />
																</div>
																<div>
																	<div className="flex items-center gap-2">
																		<span className="font-semibold">
																			{patologia.nome}
																		</span>
																		{patologia.zoonotica && (
																			<AlertTriangle
																				className="h-4 w-4 text-orange-500"
																				aria-label="Zoonose"
																			/>
																		)}
																		{patologia.notificavel && (
																			<Badge className="bg-red-600 text-xs">
																				Notificação
																			</Badge>
																		)}
																	</div>
																	<div className="text-xs text-gray-400">
																		{patologia.nomeCientifico}
																	</div>
																	<div className="text-xs text-gray-500">
																		ICD-10: {patologia.codigoICD10}
																	</div>
																</div>
															</div>
														</TableCell>
														<TableCell className="text-white">
															<div className="flex flex-wrap gap-1">
																{patologia.especies
																	.slice(0, 3)
																	.map((esp, idx) => (
																		<Badge
																			key={idx}
																			variant="outline"
																			className="text-xs bg-black/30 border-red-600/30 text-white"
																		>
																			{esp}
																		</Badge>
																	))}
																{patologia.especies.length > 3 && (
																	<Badge
																		variant="outline"
																		className="text-xs bg-black/30 border-red-600/30 text-white"
																	>
																		+{patologia.especies.length - 3}
																	</Badge>
																)}
															</div>
														</TableCell>
														<TableCell className="text-white max-w-[250px]">
															<div
																className="text-sm truncate"
																title={patologia.sintomas
																	.map((s) => s.nome)
																	.join(", ")}
															>
																{patologia.sintomas
																	.slice(0, 2)
																	.map((s) => s.nome)
																	.join(", ")}
																{patologia.sintomas.length > 2 && "..."}
															</div>
															<div className="text-xs text-gray-400">
																{patologia.sistemasAfetados[0]}
																{patologia.sistemasAfetados.length > 1 &&
																	` +${patologia.sistemasAfetados.length - 1}`}
															</div>
														</TableCell>
														<TableCell>
															<div className="flex items-center gap-2">
																<Badge
																	className={`${gravidadeConfig?.color} text-xs`}
																>
																	{gravidadeConfig?.label}
																</Badge>
																<Badge
																	variant="outline"
																	className={`border-${prognosticoConfig?.color?.split("-")[1] || "gray"
																		}-600/50 text-xs`}
																>
																	{prognosticoConfig?.label}
																</Badge>
															</div>
														</TableCell>
														<TableCell className="text-white">
															<div className="flex items-center">
																<span
																	className={
																		patologia.casosRegistrados > 100
																			? "font-semibold text-amber-300"
																			: "text-gray-300"
																	}
																>
																	{patologia.casosRegistrados}
																</span>
															</div>
														</TableCell>
														<TableCell className="text-right">
															<div className="flex justify-end gap-1">
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-8 w-8 p-0 text-blue-400 hover:bg-blue-600/20"
																	onClick={() => openDetails(patologia)}
																	title="Detalhes"
																>
																	<Eye className="h-4 w-4" />
																</Button>
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-8 w-8 p-0 text-green-400 hover:bg-green-600/20"
																	onClick={() => openEditDialog(patologia)}
																	title="Editar"
																>
																	<Edit className="h-4 w-4" />
																</Button>
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-8 w-8 p-0 text-red-400 hover:bg-red-600/20"
																	onClick={() =>
																		handleDeletePatologia(
																			patologia.id,
																			patologia.nome
																		)
																	}
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
							</div>
						)}
					</CardContent>
				</Card>

				{/* Modal: PubMed Search */}
				<Dialog open={isArtigosOpen} onOpenChange={setIsArtigosOpen}>
					<DialogContent className="max-w-4xl bg-black/90 border-blue-600/30 text-white">
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2 text-white">
								<BookOpen className="h-5 w-5 text-blue-500" />
								Buscar Artigos Científicos - PubMed
							</DialogTitle>
							<DialogDescription className="text-gray-400">
								Busque na maior base de dados de artigos médicos do mundo
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-4 py-4">
							<div className="flex gap-2">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
									<Input
										placeholder="Ex: canine parvovirus treatment, feline leukemia diagnosis..."
										className="pl-10 bg-black/30 border-blue-600/50 text-white"
										value={buscaPubMed}
										onChange={(e) => setBuscaPubMed(e.target.value)}
										onKeyPress={(e) =>
											e.key === "Enter" && buscarArtigosPubMed()
										}
									/>
								</div>
								<Button
									onClick={buscarArtigosPubMed}
									disabled={loadingArtigos}
									className="bg-blue-600 hover:bg-blue-700"
								>
									{loadingArtigos ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<>
											<Search className="mr-2 h-4 w-4" />
											Buscar
										</>
									)}
								</Button>
							</div>

							{resultadosPubMed.length > 0 ? (
								<div className="space-y-3 max-h-96 overflow-y-auto">
									<h4 className="text-sm font-semibold text-gray-300">
										{resultadosPubMed.length} artigos encontrados
									</h4>
									{resultadosPubMed.map((artigo) => (
										<Card
											key={artigo.pmid}
											className="bg-black/50 border-blue-600/30"
										>
											<CardContent className="p-4">
												<div className="flex justify-between items-start">
													<div className="flex-1">
														<h5 className="font-semibold text-white mb-1">
															{artigo.title}
														</h5>
														<p className="text-sm text-gray-400 mb-2">
															{artigo.authors} • {artigo.journal} •{" "}
															{artigo.pubyear}
														</p>
														<p className="text-xs text-gray-500 line-clamp-2">
															{artigo.abstract}
														</p>
													</div>
													<div className="flex flex-col gap-2 ml-4">
														<Button
															size="sm"
															variant="outline"
															className="border-blue-600/50 text-blue-300 hover:bg-blue-600/20"
															onClick={() => adicionarArtigoPubMed(artigo)}
														>
															<Plus className="h-3 w-3 mr-1" />
															Salvar
														</Button>
														<Button
															size="sm"
															variant="outline"
															className="border-gray-600/50 text-gray-300 hover:bg-gray-600/20"
															onClick={() => window.open(artigo.url, "_blank")}
														>
															<ExternalLink className="h-3 w-3 mr-1" />
															Abrir
														</Button>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							) : buscaPubMed && !loadingArtigos ? (
								<div className="text-center py-8">
									<BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
									<p className="text-gray-400">
										Nenhum artigo encontrado para "{buscaPubMed}"
									</p>
									<p className="text-sm text-gray-500 mt-2">
										Tente outros termos em inglês
									</p>
								</div>
							) : (
								<div className="text-center py-8">
									<Cloud className="h-12 w-12 text-blue-600 mx-auto mb-4" />
									<p className="text-gray-400">
										Busque artigos científicos no PubMed
									</p>
									<p className="text-sm text-gray-500 mt-2">
										Acesse milhões de artigos médicos e veterinários
									</p>
								</div>
							)}
						</div>
					</DialogContent>
				</Dialog>

				{/* Modal: Detalhes da Patologia */}
				<Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
					<DialogContent className="max-w-4xl bg-black/90 border-red-600/30 text-white">
						<DialogHeader>
							<DialogTitle className="text-white">
								Detalhes da Patologia
							</DialogTitle>
						</DialogHeader>

						{selectedPatologia && (
							<div className="space-y-6 py-4 max-h-[80vh] overflow-y-auto">
								{/* Cabeçalho */}
								<div className="flex items-start justify-between">
									<div>
										<div className="flex items-center gap-3 mb-2">
											<div
												className={`p-3 rounded-lg ${gravidades.find(
													(g) => g.value === selectedPatologia.gravidade
												)?.color
													} bg-opacity-20`}
											>
												<Biohazard  className="h-6 w-6" />
											</div>
											<div>
												<h3 className="text-2xl font-bold text-white">
													{selectedPatologia.nome}
												</h3>
												<p className="text-gray-400">
													{selectedPatologia.nomeCientifico}
												</p>
											</div>
										</div>
										<div className="flex flex-wrap gap-2 mt-3">
											<Badge className="bg-gray-700">
												ICD-10: {selectedPatologia.codigoICD10}
											</Badge>
											{selectedPatologia.zoonotica && (
												<Badge className="bg-orange-600">Zoonose</Badge>
											)}
											{selectedPatologia.notificavel && (
												<Badge className="bg-red-600">
													Notificação Obrigatória
												</Badge>
											)}
											<Badge
												className={`${gravidades.find(
													(g) => g.value === selectedPatologia.gravidade
												)?.color
													}`}
											>
												Gravidade:{" "}
												{
													gravidades.find(
														(g) => g.value === selectedPatologia.gravidade
													)?.label
												}
											</Badge>
											<Badge
												className={`${prognosticos.find(
													(p) => p.value === selectedPatologia.prognostico
												)?.color
													}`}
											>
												Prognóstico:{" "}
												{
													prognosticos.find(
														(p) => p.value === selectedPatologia.prognostico
													)?.label
												}
											</Badge>
										</div>
									</div>
									<div className="text-right">
										<p className="text-3xl font-bold text-red-400">
											{selectedPatologia.casosRegistrados}
										</p>
										<p className="text-sm text-gray-400">casos registrados</p>
									</div>
								</div>

								<Separator className="bg-red-600/30" />

								{/* Tabs de Conteúdo */}
								<Tabs defaultValue="geral" className="w-full">
									<TabsList className="grid w-full grid-cols-5 bg-black/30 border border-red-600/30">
										<TabsTrigger
											value="geral"
											className="text-white data-[state=active]:bg-red-600/50"
										>
											Geral
										</TabsTrigger>
										<TabsTrigger
											value="sintomas"
											className="text-white data-[state=active]:bg-red-600/50"
										>
											Sintomas
										</TabsTrigger>
										<TabsTrigger
											value="diagnostico"
											className="text-white data-[state=active]:bg-red-600/50"
										>
											Diagnóstico
										</TabsTrigger>
										<TabsTrigger
											value="tratamento"
											className="text-white data-[state=active]:bg-red-600/50"
										>
											Tratamento
										</TabsTrigger>
										<TabsTrigger
											value="artigos"
											className="text-white data-[state=active]:bg-red-600/50"
										>
											Artigos
										</TabsTrigger>
									</TabsList>

									<TabsContent value="geral" className="space-y-4 pt-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-4">
												<div>
													<h4 className="text-sm font-semibold text-gray-400 mb-2">
														Espécies Afetadas
													</h4>
													<div className="flex flex-wrap gap-1 sm:gap-2 w-full md:w-auto">
														{selectedPatologia.especies.map((especie, idx) => (
															<Badge
																key={idx}
																variant="outline"
																className="border-red-600/30 text-white"
															>
																{especie}
															</Badge>
														))}
													</div>
												</div>

												<div>
													<h4 className="text-sm font-semibold text-gray-400 mb-2">
														Sistemas Afetados
													</h4>
													<div className="flex flex-wrap gap-1 sm:gap-2 w-full md:w-auto">
														{selectedPatologia.sistemasAfetados.map(
															(sistema, idx) => (
																<Badge
																	key={idx}
																	variant="outline"
																	className="border-purple-600/30 text-purple-300"
																>
																	{sistema}
																</Badge>
															)
														)}
													</div>
												</div>
											</div>

											<div className="space-y-4">
												<div>
													<h4 className="text-sm font-semibold text-gray-400 mb-2">
														Etiologia
													</h4>
													<p className="text-white bg-black/30 p-3 rounded border border-red-600/30">
														{selectedPatologia.etiologia}
													</p>
												</div>
											</div>
										</div>

										<div className="space-y-4">
											<div>
												<h4 className="text-sm font-semibold text-gray-400 mb-2">
													Patogênese
												</h4>
												<p className="text-white bg-black/30 p-3 rounded border border-red-600/30">
													{selectedPatologia.patogenese}
												</p>
											</div>

											<div>
												<h4 className="text-sm font-semibold text-gray-400 mb-2">
													Epidemiologia
												</h4>
												<p className="text-white bg-black/30 p-3 rounded border border-red-600/30">
													{selectedPatologia.epidemiologia}
												</p>
											</div>

											<div>
												<h4 className="text-sm font-semibold text-gray-400 mb-2">
													Profilaxia
												</h4>
												<p className="text-white bg-black/30 p-3 rounded border border-red-600/30">
													{selectedPatologia.profilaxia}
												</p>
											</div>
										</div>
									</TabsContent>

									<TabsContent value="sintomas" className="pt-4">
										<div className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												{selectedPatologia.sintomas.map((sintoma, idx) => (
													<Card
														key={sintoma.id}
														className="bg-black/30 border-red-600/30"
													>
														<CardContent className="p-4">
															<div className="flex justify-between items-center">
																<div>
																	<h4 className="font-semibold text-white">
																		{sintoma.nome}
																	</h4>
																	<div className="flex items-center gap-2 mt-2">
																		<Badge
																			className={`
                                      ${sintoma.frequencia === "muito_comum"
																					? "bg-green-600"
																					: sintoma.frequencia === "comum"
																						? "bg-yellow-600"
																						: "bg-gray-600"
																				}
                                      text-xs
                                    `}
																		>
																			{sintoma.frequencia === "muito_comum"
																				? "Muito Comum"
																				: sintoma.frequencia === "comum"
																					? "Comum"
																					: "Raro"}
																		</Badge>
																	</div>
																</div>
																<Thermometer className="h-8 w-8 text-red-500 opacity-50" />
															</div>
														</CardContent>
													</Card>
												))}
											</div>
										</div>
									</TabsContent>

									<TabsContent value="diagnostico" className="pt-4">
										<div className="space-y-4">
											{selectedPatologia.diagnosticos.map(
												(diagnostico, idx) => (
													<Card
														key={diagnostico.id}
														className="bg-black/30 border-blue-600/30"
													>
														<CardContent className="p-4">
															<div className="flex justify-between items-start">
																<div>
																	<div className="flex items-center gap-3 mb-2">
																		<h4 className="font-semibold text-white">
																			{diagnostico.nome}
																		</h4>
																		{diagnostico.diferencial && (
																			<Badge className="bg-purple-600 text-xs">
																				Diagnóstico Diferencial
																			</Badge>
																		)}
																	</div>
																	<div className="flex items-center gap-4">
																		<div className="flex items-center gap-2">
																			<div className="w-32 bg-gray-700 rounded-full h-2">
																				<div
																					className="bg-green-500 h-2 rounded-full"
																					style={{
																						width: `${diagnostico.confiabilidade}%`,
																					}}
																				/>
																			</div>
																			<span className="text-sm text-gray-300">
																				{diagnostico.confiabilidade}%
																			</span>
																		</div>
																		<span className="text-sm text-gray-400">
																			Confiabilidade
																		</span>
																	</div>
																</div>
																<Stethoscope className="h-8 w-8 text-blue-500 opacity-50" />
															</div>
														</CardContent>
													</Card>
												)
											)}
										</div>
									</TabsContent>

									<TabsContent value="tratamento" className="pt-4">
										<div className="space-y-4">
											{selectedPatologia.tratamentos.map((tratamento, idx) => {
												const tipoCor = {
													medicamentoso: "bg-blue-600",
													cirurgico: "bg-red-600",
													terapeutico: "bg-green-600",
													preventivo: "bg-yellow-600",
												}[tratamento.tipo];

												const tipoLabel = {
													medicamentoso: "Medicamentoso",
													cirurgico: "Cirúrgico",
													terapeutico: "Terapêutico",
													preventivo: "Preventivo",
												}[tratamento.tipo];

												return (
													<Card
														key={tratamento.id}
														className="bg-black/30 border-green-600/30"
													>
														<CardContent className="p-4">
															<div className="flex justify-between items-start">
																<div className="flex-1">
																	<div className="flex items-center gap-3 mb-2">
																		<h4 className="font-semibold text-white">
																			{tratamento.nome}
																		</h4>
																		<Badge className={`${tipoCor} text-xs`}>
																			{tipoLabel}
																		</Badge>
																	</div>
																	<p className="text-gray-300">
																		{tratamento.descricao}
																	</p>
																</div>
																<Pill className="h-8 w-8 text-green-500 opacity-50 ml-4" />
															</div>
														</CardContent>
													</Card>
												);
											})}
										</div>
									</TabsContent>

									<TabsContent value="artigos" className="pt-4">
										<div className="space-y-4">
											{getArtigosPorIds(selectedPatologia.artigosPubMed)
												.length > 0 ? (
												getArtigosPorIds(selectedPatologia.artigosPubMed).map(
													(artigo) => (
														<Card
															key={artigo.id}
															className="bg-black/30 border-blue-600/30"
														>
															<CardContent className="p-4">
																<div className="flex justify-between items-start">
																	<div>
																		<h4 className="font-semibold text-white mb-1">
																			{artigo.titulo}
																		</h4>
																		<p className="text-sm text-gray-400 mb-2">
																			{artigo.autores.join(", ")} •{" "}
																			{artigo.revista} • {artigo.ano}
																		</p>
																		<p className="text-xs text-gray-500 line-clamp-2">
																			{artigo.resumo}
																		</p>
																	</div>
																	<div className="flex flex-col gap-2 ml-4">
																		<Button
																			size="sm"
																			variant="outline"
																			className="border-blue-600/50 text-blue-300 hover:bg-blue-600/20"
																			onClick={() =>
																				window.open(artigo.link, "_blank")
																			}
																		>
																			<ExternalLink className="h-3 w-3 mr-1" />
																			Abrir
																		</Button>
																	</div>
																</div>
															</CardContent>
														</Card>
													)
												)
											) : (
												<div className="text-center py-8">
													<BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
													<p className="text-gray-400">
														Nenhum artigo científico vinculado
													</p>
													<Button
														variant="outline"
														className="mt-4 border-blue-600/50 text-blue-300 hover:bg-blue-600/20"
														onClick={() => setIsArtigosOpen(true)}
													>
														<Search className="mr-2 h-4 w-4" />
														Buscar na PubMed
													</Button>
												</div>
											)}
										</div>
									</TabsContent>
								</Tabs>

								<Separator className="bg-red-600/30" />

								{/* Ações */}
								<div className="flex justify-between">
									<Button
										variant="outline"
										className="border-red-600/50 text-white hover:bg-red-600/20"
										onClick={() => {
											setIsDetailsOpen(false);
											openEditDialog(selectedPatologia);
										}}
									>
										<Edit className="mr-2 h-4 w-4" />
										Editar Patologia
									</Button>

									<div className="flex gap-2">
										<Button
											variant="outline"
											className="border-gray-600/50 text-gray-300 hover:bg-gray-600/20"
											onClick={() =>
												navigator.clipboard.writeText(
													JSON.stringify(selectedPatologia, null, 2)
												)
											}
										>
											<Copy className="mr-2 h-4 w-4" />
											Copiar Dados
										</Button>
										<Button
											variant="outline"
											className="border-red-600/50 text-red-400 hover:bg-red-600/20"
											onClick={() =>
												handleDeletePatologia(
													selectedPatologia.id,
													selectedPatologia.nome
												)
											}
										>
											<Trash2 className="mr-2 h-4 w-4" />
											Excluir
										</Button>
									</div>
								</div>
							</div>
						)}
					</DialogContent>
				</Dialog>

				{/* Modal: Nova/Editar Patologia */}
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 border-red-600/30 text-white">
						<DialogHeader>
							<DialogTitle className="text-white">
								{selectedPatologia ? "Editar Patologia" : "Nova Patologia"}
							</DialogTitle>
							<DialogDescription className="text-gray-400">
								{selectedPatologia
									? "Atualize os dados da patologia"
									: "Cadastre uma nova patologia no banco de dados"}
							</DialogDescription>
						</DialogHeader>

						<Tabs defaultValue="basico" className="w-full">
							<TabsList className="grid w-full grid-cols-4 bg-black/30 border border-red-600/30">
								<TabsTrigger
									value="basico"
									className="text-white data-[state=active]:bg-red-600/50"
								>
									Básico
								</TabsTrigger>
								<TabsTrigger
									value="sintomas"
									className="text-white data-[state=active]:bg-red-600/50"
								>
									Sintomas
								</TabsTrigger>
								<TabsTrigger
									value="diagnostico"
									className="text-white data-[state=active]:bg-red-600/50"
								>
									Diagnóstico
								</TabsTrigger>
								<TabsTrigger
									value="tratamento"
									className="text-white data-[state=active]:bg-red-600/50"
								>
									Tratamento
								</TabsTrigger>
							</TabsList>

							<TabsContent value="basico" className="space-y-4 py-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-4">
										<div>
											<Label htmlFor="codigoICD10" className="text-white">
												Código ICD-10
											</Label>
											<Input
												id="codigoICD10"
												value={formData.codigoICD10}
												onChange={(e) =>
													setFormData({
														...formData,
														codigoICD10: e.target.value,
													})
												}
												placeholder="Ex: A82.9, B54.1"
												className="bg-black/30 border-red-600/50 text-white"
											/>
										</div>

										<div>
											<Label htmlFor="nome" className="text-white">
												Nome da Patologia *
											</Label>
											<Input
												id="nome"
												value={formData.nome}
												onChange={(e) =>
													setFormData({ ...formData, nome: e.target.value })
												}
												placeholder="Ex: Raiva, Leishmaniose, Parvovirose"
												className="bg-black/30 border-red-600/50 text-white"
											/>
										</div>

										<div>
											<Label htmlFor="nomeCientifico" className="text-white">
												Nome Científico *
											</Label>
											<Input
												id="nomeCientifico"
												value={formData.nomeCientifico}
												onChange={(e) =>
													setFormData({
														...formData,
														nomeCientifico: e.target.value,
													})
												}
												placeholder="Ex: Lyssavirus rabies, Leishmania infantum"
												className="bg-black/30 border-red-600/50 text-white"
											/>
										</div>

										<div>
											<Label className="text-white mb-2 block">
												Espécies Afetadas
											</Label>
											<div className="flex flex-wrap gap-1 sm:gap-2 w-full md:w-auto">
												{especies.slice(0, -1).map((especie) => (
													<Badge
														key={especie}
														variant={
															formData.especies.includes(especie)
																? "default"
																: "outline"
														}
														className={`cursor-pointer ${formData.especies.includes(especie)
																? "bg-red-600"
																: "border-red-600/30 text-white"
															}`}
														onClick={() => {
															const novasEspecies = formData.especies.includes(
																especie
															)
																? formData.especies.filter((e) => e !== especie)
																: [...formData.especies, especie];
															setFormData({
																...formData,
																especies: novasEspecies,
															});
														}}
													>
														{especie}
													</Badge>
												))}
											</div>
										</div>
									</div>

									<div className="space-y-4">
										<div>
											<Label className="text-white mb-2 block">
												Sistemas Afetados
											</Label>
											<div className="flex flex-wrap gap-1 sm:gap-2 w-full md:w-auto">
												{sistemasCorporais.map((sistema) => (
													<Badge
														key={sistema}
														variant={
															formData.sistemasAfetados.includes(sistema)
																? "default"
																: "outline"
														}
														className={`cursor-pointer ${formData.sistemasAfetados.includes(sistema)
																? "bg-purple-600"
																: "border-purple-600/30 text-white"
															}`}
														onClick={() => {
															const novosSistemas =
																formData.sistemasAfetados.includes(sistema)
																	? formData.sistemasAfetados.filter(
																		(s) => s !== sistema
																	)
																	: [...formData.sistemasAfetados, sistema];
															setFormData({
																...formData,
																sistemasAfetados: novosSistemas,
															});
														}}
													>
														{sistema}
													</Badge>
												))}
											</div>
										</div>

										<div className="grid grid-cols-2 gap-4">
											<div>
												<Label htmlFor="gravidade" className="text-white">
													Gravidade
												</Label>
												<Select
													value={formData.gravidade}
													onValueChange={(value: any) =>
														setFormData({ ...formData, gravidade: value })
													}
												>
													<SelectTrigger className="bg-black/30 border-red-600/50 text-white">
														<SelectValue />
													</SelectTrigger>
													<SelectContent className="bg-black border-red-600/30">
														{gravidades.map((g) => (
															<SelectItem
																key={g.value}
																value={g.value}
																className="text-white focus:bg-red-600/20"
															>
																{g.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>

											<div>
												<Label htmlFor="prognostico" className="text-white">
													Prognóstico
												</Label>
												<Select
													value={formData.prognostico}
													onValueChange={(value: any) =>
														setFormData({ ...formData, prognostico: value })
													}
												>
													<SelectTrigger className="bg-black/30 border-red-600/50 text-white">
														<SelectValue />
													</SelectTrigger>
													<SelectContent className="bg-black border-red-600/30">
														{prognosticos.map((p) => (
															<SelectItem
																key={p.value}
																value={p.value}
																className="text-white focus:bg-red-600/20"
															>
																{p.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										</div>

										<div className="flex items-center space-x-4">
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="zoonotica"
													checked={formData.zoonotica}
													onChange={(e) =>
														setFormData({
															...formData,
															zoonotica: e.target.checked,
														})
													}
													className="rounded border-red-600 bg-black/30"
												/>
												<Label htmlFor="zoonotica" className="text-white">
													Zoonose
												</Label>
											</div>

											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="notificavel"
													checked={formData.notificavel}
													onChange={(e) =>
														setFormData({
															...formData,
															notificavel: e.target.checked,
														})
													}
													className="rounded border-red-600 bg-black/30"
												/>
												<Label htmlFor="notificavel" className="text-white">
													Notificação Obrigatória
												</Label>
											</div>
										</div>
									</div>
								</div>

								<div className="space-y-4">
									<div>
										<Label htmlFor="etiologia" className="text-white">
											Etiologia
										</Label>
										<Textarea
											id="etiologia"
											value={formData.etiologia}
											onChange={(e) =>
												setFormData({ ...formData, etiologia: e.target.value })
											}
											placeholder="Causa da doença, agente etiológico..."
											rows={3}
											className="bg-black/30 border-red-600/50 text-white"
										/>
									</div>

									<div>
										<Label htmlFor="patogenese" className="text-white">
											Patogênese
										</Label>
										<Textarea
											id="patogenese"
											value={formData.patogenese}
											onChange={(e) =>
												setFormData({ ...formData, patogenese: e.target.value })
											}
											placeholder="Mecanismo de desenvolvimento da doença..."
											rows={3}
											className="bg-black/30 border-red-600/50 text-white"
										/>
									</div>

									<div>
										<Label htmlFor="epidemiologia" className="text-white">
											Epidemiologia
										</Label>
										<Textarea
											id="epidemiologia"
											value={formData.epidemiologia}
											onChange={(e) =>
												setFormData({
													...formData,
													epidemiologia: e.target.value,
												})
											}
											placeholder="Distribuição, incidência, fatores de risco..."
											rows={3}
											className="bg-black/30 border-red-600/50 text-white"
										/>
									</div>

									<div>
										<Label htmlFor="profilaxia" className="text-white">
											Profilaxia
										</Label>
										<Textarea
											id="profilaxia"
											value={formData.profilaxia}
											onChange={(e) =>
												setFormData({ ...formData, profilaxia: e.target.value })
											}
											placeholder="Medidas preventivas, vacinação..."
											rows={3}
											className="bg-black/30 border-red-600/50 text-white"
										/>
									</div>
								</div>
							</TabsContent>

							<TabsContent value="sintomas" className="space-y-4 py-4">
								<div className="space-y-4">
									<h3 className="text-lg font-semibold text-white">Sintomas</h3>
									{sintomas.map((sintoma, index) => (
										<div
											key={sintoma.id}
											className="flex flex-col sm:flex-row items-center gap-3 p-3 border border-red-600/30 rounded-lg"
										>
											<div className="flex-1 w-full">
												<Label className="text-white mb-1 block">Sintoma</Label>
												<Input
													placeholder="Ex: Febre, Vômito, Diarreia"
													value={sintoma.nome}
													onChange={(e) => {
														const novosSintomas = [...sintomas];
														novosSintomas[index].nome = e.target.value;
														setSintomas(novosSintomas);
													}}
													className="bg-black/30 border-red-600/50 text-white"
												/>
											</div>
											<div className="w-full sm:w-32">
												<Label className="text-white mb-1 block">
													Frequência
												</Label>
												<Select
													value={sintoma.frequencia}
													onValueChange={(value: any) => {
														const novosSintomas = [...sintomas];
														novosSintomas[index].frequencia = value;
														setSintomas(novosSintomas);
													}}
												>
													<SelectTrigger className="bg-black/30 border-red-600/50 text-white">
														<SelectValue />
													</SelectTrigger>
													<SelectContent className="bg-black border-red-600/30">
														<SelectItem
															value="raro"
															className="text-white focus:bg-red-600/20"
														>
															Raro
														</SelectItem>
														<SelectItem
															value="comum"
															className="text-white focus:bg-red-600/20"
														>
															Comum
														</SelectItem>
														<SelectItem
															value="muito_comum"
															className="text-white focus:bg-red-600/20"
														>
															Muito Comum
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<Button
												variant="ghost"
												size="sm"
												className="text-red-400 hover:bg-red-600/20 hover:text-red-300 mt-2 sm:mt-0"
												onClick={() => {
													const novosSintomas = sintomas.filter(
														(_, i) => i !== index
													);
													setSintomas(novosSintomas);
												}}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									))}

									<Button
										variant="outline"
										className="border-red-600/50 text-white hover:bg-red-600/20"
										onClick={() => {
											setSintomas([
												...sintomas,
												{
													id: (sintomas.length + 1).toString(),
													nome: "",
													frequencia: "comum",
												},
											]);
										}}
									>
										<Plus className="mr-2 h-4 w-4" />
										Adicionar Sintoma
									</Button>
								</div>
							</TabsContent>

							<TabsContent value="diagnostico" className="space-y-4 py-4">
								<div className="space-y-4">
									<h3 className="text-lg font-semibold text-white">
										Diagnósticos
									</h3>
									{diagnosticos.map((diagnostico, index) => (
										<div
											key={diagnostico.id}
											className="flex flex-col sm:flex-row items-center gap-3 p-3 border border-red-600/30 rounded-lg"
										>
											<div className="flex-1 w-full">
												<Label className="text-white mb-1 block">
													Método de Diagnóstico
												</Label>
												<Input
													placeholder="Ex: PCR, ELISA, Radiografia"
													value={diagnostico.nome}
													onChange={(e) => {
														const novosDiagnosticos = [...diagnosticos];
														novosDiagnosticos[index].nome = e.target.value;
														setDiagnosticos(novosDiagnosticos);
													}}
													className="bg-black/30 border-red-600/50 text-white"
												/>
											</div>
											<div className="w-full sm:w-32">
												<Label className="text-white mb-1 block">
													Confiabilidade (%)
												</Label>
												<Input
													type="number"
													min="0"
													max="100"
													placeholder="80"
													value={diagnostico.confiabilidade}
													onChange={(e) => {
														const novosDiagnosticos = [...diagnosticos];
														novosDiagnosticos[index].confiabilidade =
															parseInt(e.target.value) || 0;
														setDiagnosticos(novosDiagnosticos);
													}}
													className="bg-black/30 border-red-600/50 text-white"
												/>
											</div>
											<div className="flex items-center gap-2">
												<div className="flex items-center">
													<input
														type="checkbox"
														id={`diferencial-${index}`}
														checked={diagnostico.diferencial}
														onChange={(e) => {
															const novosDiagnosticos = [...diagnosticos];
															novosDiagnosticos[index].diferencial =
																e.target.checked;
															setDiagnosticos(novosDiagnosticos);
														}}
														className="rounded border-red-600 bg-black/30 mr-2"
													/>
													<Label
														htmlFor={`diferencial-${index}`}
														className="text-white text-sm"
													>
														Diferencial
													</Label>
												</div>
												<Button
													variant="ghost"
													size="sm"
													className="text-red-400 hover:bg-red-600/20 hover:text-red-300"
													onClick={() => {
														const novosDiagnosticos = diagnosticos.filter(
															(_, i) => i !== index
														);
														setDiagnosticos(novosDiagnosticos);
													}}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))}

									<Button
										variant="outline"
										className="border-red-600/50 text-white hover:bg-red-600/20"
										onClick={() => {
											setDiagnosticos([
												...diagnosticos,
												{
													id: (diagnosticos.length + 1).toString(),
													nome: "",
													confiabilidade: 80,
													diferencial: false,
												},
											]);
										}}
									>
										<Plus className="mr-2 h-4 w-4" />
										Adicionar Diagnóstico
									</Button>
								</div>
							</TabsContent>

							<TabsContent value="tratamento" className="space-y-4 py-4">
								<div className="space-y-4">
									<h3 className="text-lg font-semibold text-white">
										Tratamentos
									</h3>
									{tratamentos.map((tratamento, index) => (
										<div
											key={tratamento.id}
											className="flex flex-col gap-3 p-3 border border-red-600/30 rounded-lg"
										>
											<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
												<div>
													<Label className="text-white mb-1 block">
														Tratamento
													</Label>
													<Input
														placeholder="Ex: Antibioticoterapia, Cirurgia"
														value={tratamento.nome}
														onChange={(e) => {
															const novosTratamentos = [...tratamentos];
															novosTratamentos[index].nome = e.target.value;
															setTratamentos(novosTratamentos);
														}}
														className="bg-black/30 border-red-600/50 text-white"
													/>
												</div>
												<div>
													<Label className="text-white mb-1 block">Tipo</Label>
													<Select
														value={tratamento.tipo}
														onValueChange={(value: any) => {
															const novosTratamentos = [...tratamentos];
															novosTratamentos[index].tipo = value;
															setTratamentos(novosTratamentos);
														}}
													>
														<SelectTrigger className="bg-black/30 border-red-600/50 text-white">
															<SelectValue />
														</SelectTrigger>
														<SelectContent className="bg-black border-red-600/30">
															<SelectItem
																value="medicamentoso"
																className="text-white focus:bg-red-600/20"
															>
																Medicamentoso
															</SelectItem>
															<SelectItem
																value="cirurgico"
																className="text-white focus:bg-red-600/20"
															>
																Cirúrgico
															</SelectItem>
															<SelectItem
																value="terapeutico"
																className="text-white focus:bg-red-600/20"
															>
																Terapêutico
															</SelectItem>
															<SelectItem
																value="preventivo"
																className="text-white focus:bg-red-600/20"
															>
																Preventivo
															</SelectItem>
														</SelectContent>
													</Select>
												</div>
												<div className="flex items-end">
													<Button
														variant="ghost"
														size="sm"
														className="text-red-400 hover:bg-red-600/20 hover:text-red-300"
														onClick={() => {
															const novosTratamentos = tratamentos.filter(
																(_, i) => i !== index
															);
															setTratamentos(novosTratamentos);
														}}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</div>
											<div>
												<Label className="text-white mb-1 block">
													Descrição
												</Label>
												<Textarea
													placeholder="Descrição detalhada do tratamento, dosagem, duração..."
													value={tratamento.descricao}
													onChange={(e) => {
														const novosTratamentos = [...tratamentos];
														novosTratamentos[index].descricao = e.target.value;
														setTratamentos(novosTratamentos);
													}}
													rows={2}
													className="bg-black/30 border-red-600/50 text-white"
												/>
											</div>
										</div>
									))}

									<Button
										variant="outline"
										className="border-red-600/50 text-white hover:bg-red-600/20"
										onClick={() => {
											setTratamentos([
												...tratamentos,
												{
													id: (tratamentos.length + 1).toString(),
													nome: "",
													tipo: "medicamentoso",
													descricao: "",
												},
											]);
										}}
									>
										<Plus className="mr-2 h-4 w-4" />
										Adicionar Tratamento
									</Button>
								</div>
							</TabsContent>
						</Tabs>

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
								onClick={handleSavePatologia}
								className="bg-red-600 hover:bg-red-700 text-white"
							>
								<Plus className="mr-2 h-4 w-4" />
								{selectedPatologia ? "Atualizar" : "Cadastrar"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};

export default Patologias;