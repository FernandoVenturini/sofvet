import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
	Plus,
	Search,
	Filter,
	Edit,
	Trash2,
	Pill,
	Calculator,
	Download,
	Upload,
	History,
	BarChart3,
	FlaskConical,
	AlertTriangle,
	CheckCircle,
	XCircle,
	Save,
	Copy,
	Eye,
	MoreVertical,
	Tag,
	Building,
	Weight,
	Activity,
	Loader2 // ← ADICIONE ESTA IMPORT AQUI
} from 'lucide-react';
import { medicamentoService } from '@/services/medicamentoService';
import { importarDadosIniciais } from '@/scripts/importarMedicamentosIniciais';

// Tipos
interface EspecieDosagem {
	codigo: string;
	descricao: string;
	dosePorKg: number;
	unidade: string;
}

interface Medicamento {
	id: string;
	nomeComercial: string;
	nomeQuimico: string;
	especies: EspecieDosagem[];
	atencao: string;
	apresentacao: string;
	indicacao: string;
	posologia: string;
	laboratorios: string[];
	observacoes: string;
	isVeterinario: boolean;
	dataCadastro: Date;
	dataAtualizacao: Date;
	usadoEmConsultas: number;
}

const MedicamentosPage = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [searchTerm, setSearchTerm] = useState('');
	const [filterType, setFilterType] = useState<'todos' | 'veterinarios' | 'humanos'>('todos');
	const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
	const [loading, setLoading] = useState(true);
	const [importing, setImporting] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isCalculadoraOpen, setIsCalculadoraOpen] = useState(false);
	const [selectedMedicamento, setSelectedMedicamento] = useState<Medicamento | null>(null);

	// Estados para novo/editar medicamento
	const [formData, setFormData] = useState({
		nomeComercial: '',
		nomeQuimico: '',
		atencao: '',
		apresentacao: '',
		indicacao: '',
		posologia: '',
		laboratorios: '',
		observacoes: '',
		isVeterinario: false,
	});

	const [especies, setEspecies] = useState<EspecieDosagem[]>([
		{ codigo: '001', descricao: 'Canino', dosePorKg: 0, unidade: 'mg' },
		{ codigo: '002', descricao: 'Felino', dosePorKg: 0, unidade: 'mg' },
		{ codigo: '003', descricao: 'Equino', dosePorKg: 0, unidade: 'mg' },
		{ codigo: '004', descricao: 'Bovino', dosePorKg: 0, unidade: 'mg' },
		{ codigo: '005', descricao: 'Ave', dosePorKg: 0, unidade: 'mg' },
	]);

	// Estados para calculadora
	const [pesoAnimal, setPesoAnimal] = useState('');
	const [especieCalculo, setEspecieCalculo] = useState('');
	const [doseCalculada, setDoseCalculada] = useState<number | null>(null);

	// Carregar medicamentos
	useEffect(() => {
		carregarMedicamentos();
	}, []);

	const carregarMedicamentos = async () => {
		try {
			setLoading(true);
			const data = await medicamentoService.getAll();
			setMedicamentos(data);
		} catch (error) {
			console.error('Erro ao carregar medicamentos:', error);
			toast({
				title: 'Erro',
				description: 'Não foi possível carregar os medicamentos',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	// Filtragem como no SISVET (busca por segmento de palavra)
	const filteredMedicamentos = medicamentos.filter(med => {
		const searchLower = searchTerm.toLowerCase();
		const matchesSearch =
			med.nomeComercial.toLowerCase().includes(searchLower) ||
			med.nomeQuimico.toLowerCase().includes(searchLower) ||
			med.indicacao.toLowerCase().includes(searchLower) ||
			med.laboratorios.some(lab => lab.toLowerCase().includes(searchLower)) ||
			med.apresentacao.toLowerCase().includes(searchLower) ||
			med.posologia.toLowerCase().includes(searchLower);

		const matchesFilter =
			filterType === 'todos' ||
			(filterType === 'veterinarios' && med.isVeterinario) ||
			(filterType === 'humanos' && !med.isVeterinario);

		return matchesSearch && matchesFilter;
	});

	// Importar dados iniciais
	const handleImportarBase = async () => {
		if (!confirm('Importar base inicial de medicamentos do SISVET? Esta ação adicionará medicamentos de exemplo.')) {
			return;
		}

		try {
			setImporting(true);
			await importarDadosIniciais();
			await carregarMedicamentos();
			toast({
				title: 'Sucesso',
				description: 'Base de medicamentos importada com sucesso',
			});
		} catch (error) {
			console.error('Erro na importação:', error);
			toast({
				title: 'Erro',
				description: 'Não foi possível importar a base de dados',
				variant: 'destructive',
			});
		} finally {
			setImporting(false);
		}
	};

	// Salvar medicamento
	const handleSaveMedicamento = async () => {
		if (!formData.nomeComercial || !formData.nomeQuimico) {
			toast({
				title: 'Atenção',
				description: 'Preencha pelo menos o nome comercial e nome químico',
				variant: 'destructive',
			});
			return;
		}

		try {
			const medicamentoData = {
				...formData,
				especies: especies.filter(e => e.dosePorKg > 0),
				laboratorios: formData.laboratorios.split(',').map(l => l.trim()).filter(l => l),
			};

			if (selectedMedicamento) {
				// Atualizar existente
				await medicamentoService.update(selectedMedicamento.id, medicamentoData);
				toast({
					title: 'Sucesso',
					description: 'Medicamento atualizado com sucesso',
				});
			} else {
				// Criar novo
				await medicamentoService.create(medicamentoData);
				toast({
					title: 'Sucesso',
					description: 'Medicamento cadastrado com sucesso',
				});
			}

			setIsDialogOpen(false);
			resetForm();
			await carregarMedicamentos();
		} catch (error) {
			console.error('Erro ao salvar medicamento:', error);
			toast({
				title: 'Erro',
				description: 'Não foi possível salvar o medicamento',
				variant: 'destructive',
			});
		}
	};

	// Deletar medicamento
	const handleDeleteMedicamento = async (id: string, nome: string) => {
		if (!confirm(`Tem certeza que deseja excluir o medicamento "${nome}"?`)) {
			return;
		}

		try {
			await medicamentoService.delete(id);
			await carregarMedicamentos();
			toast({
				title: 'Sucesso',
				description: 'Medicamento excluído com sucesso',
			});
		} catch (error) {
			console.error('Erro ao excluir medicamento:', error);
			toast({
				title: 'Erro',
				description: 'Não foi possível excluir o medicamento',
				variant: 'destructive',
			});
		}
	};

	// Calcular dose
	const calcularDose = () => {
		if (!selectedMedicamento || !pesoAnimal || !especieCalculo) {
			toast({
				title: 'Atenção',
				description: 'Selecione um medicamento, informe o peso e escolha a espécie',
				variant: 'destructive',
			});
			return;
		}

		const especie = selectedMedicamento.especies.find(e =>
			e.codigo === especieCalculo || e.descricao.toLowerCase().includes(especieCalculo.toLowerCase())
		);

		if (!especie) {
			toast({
				title: 'Atenção',
				description: 'Dose não definida para esta espécie',
				variant: 'destructive',
			});
			return;
		}

		if (especie.dosePorKg === 0) {
			toast({
				title: 'Contra-indicação!',
				description: selectedMedicamento.atencao || 'Não aplicar nesta espécie',
				variant: 'destructive',
			});
			setDoseCalculada(0);
			return;
		}

		const peso = parseFloat(pesoAnimal);
		const dose = peso * especie.dosePorKg;
		setDoseCalculada(dose);
	};

	// Reset form
	const resetForm = () => {
		setFormData({
			nomeComercial: '',
			nomeQuimico: '',
			atencao: '',
			apresentacao: '',
			indicacao: '',
			posologia: '',
			laboratorios: '',
			observacoes: '',
			isVeterinario: false,
		});
		setEspecies([
			{ codigo: '001', descricao: 'Canino', dosePorKg: 0, unidade: 'mg' },
			{ codigo: '002', descricao: 'Felino', dosePorKg: 0, unidade: 'mg' },
			{ codigo: '003', descricao: 'Equino', dosePorKg: 0, unidade: 'mg' },
			{ codigo: '004', descricao: 'Bovino', dosePorKg: 0, unidade: 'mg' },
			{ codigo: '005', descricao: 'Ave', dosePorKg: 0, unidade: 'mg' },
		]);
		setSelectedMedicamento(null);
	};

	// Abrir para edição
	const openEditDialog = (medicamento: Medicamento) => {
		setSelectedMedicamento(medicamento);
		setFormData({
			nomeComercial: medicamento.nomeComercial,
			nomeQuimico: medicamento.nomeQuimico,
			atencao: medicamento.atencao,
			apresentacao: medicamento.apresentacao,
			indicacao: medicamento.indicacao,
			posologia: medicamento.posologia,
			laboratorios: medicamento.laboratorios.join(', '),
			observacoes: medicamento.observacoes,
			isVeterinario: medicamento.isVeterinario,
		});
		setEspecies(medicamento.especies);
		setIsDialogOpen(true);
	};

	// Abrir calculadora
	const openCalculadora = (medicamento: Medicamento) => {
		setSelectedMedicamento(medicamento);
		setIsCalculadoraOpen(true);
	};

	// Estatísticas
	const estatisticas = {
		total: medicamentos.length,
		veterinarios: medicamentos.filter(m => m.isVeterinario).length,
		humanos: medicamentos.filter(m => !m.isVeterinario).length,
		comAtencao: medicamentos.filter(m => m.atencao).length,
		maisUsado: medicamentos.length > 0
			? medicamentos.reduce((prev, current) =>
				prev.usadoEmConsultas > current.usadoEmConsultas ? prev : current
			).nomeComercial
			: 'Nenhum',
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4 md:p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
					<div>
						<div className="flex items-center gap-3 mb-2">
							<Pill className="h-8 w-8 text-blue-600" />
							<div>
								<h1 className="text-3xl font-bold text-gray-900">Dicionário de Especialidades Farmacêuticas</h1>
								<p className="text-gray-600">DEF com mais de 1900 medicamentos humanos + medicamentos veterinários</p>
							</div>
						</div>
						<div className="flex items-center gap-2 mt-2">
							<Badge variant="outline" className="text-xs">
								Sistema SISVET
							</Badge>
							<span className="text-sm text-gray-500">• Busca por segmento de palavra • Cálculo automático de doses</span>
						</div>
					</div>

					<div className="flex flex-wrap gap-2">
						<Button
							variant="outline"
							onClick={() => navigate('/medicamentos/backup')}
						>
							<History className="mr-2 h-4 w-4" />
							Backup
						</Button>
						<Button
							variant="outline"
							onClick={() => navigate('/medicamentos/relatorios')}
						>
							<BarChart3 className="mr-2 h-4 w-4" />
							Relatórios
						</Button>
						<Button
							className="bg-blue-600 hover:bg-blue-700"
							onClick={() => {
								resetForm();
								setIsDialogOpen(true);
							}}
						>
							<Plus className="mr-2 h-4 w-4" />
							Novo Medicamento
						</Button>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-500">Total Medicamentos</p>
									<p className="text-2xl font-bold">{estatisticas.total}</p>
								</div>
								<Pill className="h-10 w-10 text-blue-100 bg-blue-600 p-2 rounded-lg" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-500">Veterinários</p>
									<p className="text-2xl font-bold text-green-600">{estatisticas.veterinarios}</p>
								</div>
								<FlaskConical className="h-10 w-10 text-green-100 bg-green-600 p-2 rounded-lg" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-500">Humanos</p>
									<p className="text-2xl font-bold text-purple-600">{estatisticas.humanos}</p>
								</div>
								<Building className="h-10 w-10 text-purple-100 bg-purple-600 p-2 rounded-lg" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-500">Com Atenção</p>
									<p className="text-2xl font-bold text-orange-600">{estatisticas.comAtencao}</p>
								</div>
								<AlertTriangle className="h-10 w-10 text-orange-100 bg-orange-600 p-2 rounded-lg" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-500">Mais Usado</p>
									<p className="text-lg font-bold truncate" title={estatisticas.maisUsado}>
										{estatisticas.maisUsado}
									</p>
								</div>
								<Activity className="h-10 w-10 text-red-100 bg-red-600 p-2 rounded-lg" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Ações rápidas */}
				{medicamentos.length === 0 && (
					<Card className="mb-6 border-dashed border-2">
						<CardContent className="pt-6 text-center">
							<FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum medicamento cadastrado</h3>
							<p className="text-gray-500 mb-4">Importe a base inicial do SISVET ou comece cadastrando manualmente</p>
							<div className="flex justify-center gap-4">
								<Button onClick={handleImportarBase} disabled={importing}>
									{importing ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Importando...
										</>
									) : (
										<>
											<Download className="mr-2 h-4 w-4" />
											Importar Base SISVET
										</>
									)}
								</Button>
								<Button
									variant="outline"
									onClick={() => {
										resetForm();
										setIsDialogOpen(true);
									}}
								>
									<Plus className="mr-2 h-4 w-4" />
									Cadastrar Manualmente
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Search and Filters */}
				<Card className="mb-6">
					<CardContent className="pt-6">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									placeholder="Buscar por segmento de palavra (Ex: INFLAMA, ANALGÉS, VERMI, AMOXI...)"
									className="pl-10"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
								<p className="text-sm text-gray-500 mt-2">
									<strong>Como no SISVET:</strong> Digite qualquer segmento de palavra para encontrar medicamentos
								</p>
							</div>
							<div className="flex flex-col sm:flex-row gap-2">
								<Select value={filterType} onValueChange={(value: 'todos' | 'veterinarios' | 'humanos') => setFilterType(value)}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Filtrar por" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="todos">Todos os tipos</SelectItem>
										<SelectItem value="veterinarios">Apenas veterinários</SelectItem>
										<SelectItem value="humanos">Apenas humanos</SelectItem>
									</SelectContent>
								</Select>
								<Button
									variant="outline"
									onClick={() => {
										setSearchTerm('');
										setFilterType('todos');
									}}
								>
									<Filter className="mr-2 h-4 w-4" />
									Limpar Filtros
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Table */}
				<Card>
					<CardHeader>
						<div className="flex justify-between items-center">
							<div>
								<CardTitle>Medicamentos Cadastrados</CardTitle>
								<CardDescription>
									{filteredMedicamentos.length} de {medicamentos.length} medicamentos
								</CardDescription>
							</div>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setIsCalculadoraOpen(true)}
								>
									<Calculator className="mr-2 h-4 w-4" />
									Calculadora
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="text-center py-12">
								<Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
								<p className="text-gray-500 mt-2">Carregando medicamentos...</p>
							</div>
						) : filteredMedicamentos.length === 0 ? (
							<div className="text-center py-12">
								<Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
								<h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum medicamento encontrado</h3>
								<p className="text-gray-500">
									{searchTerm
										? `Nenhum resultado para "${searchTerm}"`
										: "Comece cadastrando seu primeiro medicamento"}
								</p>
							</div>
						) : (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Nome Comercial</TableHead>
											<TableHead>Nome Químico</TableHead>
											<TableHead>Tipo</TableHead>
											<TableHead>Laboratórios</TableHead>
											<TableHead>Indicação</TableHead>
											<TableHead>Doses</TableHead>
											<TableHead>Usos</TableHead>
											<TableHead className="text-right">Ações</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredMedicamentos.map((med) => (
											<TableRow key={med.id} className="hover:bg-gray-50">
												<TableCell className="font-medium">
													<div className="flex items-center gap-2">
														{med.nomeComercial}
														{med.atencao && (
															<AlertTriangle className="h-4 w-4 text-amber-500" title="Possui atenção especial" />
														)}
													</div>
												</TableCell>
												<TableCell className="max-w-xs truncate" title={med.nomeQuimico}>
													{med.nomeQuimico}
												</TableCell>
												<TableCell>
													<Badge variant={med.isVeterinario ? "default" : "secondary"}>
														{med.isVeterinario ? 'Veterinário' : 'Humano'}
													</Badge>
												</TableCell>
												<TableCell>
													<div className="flex flex-wrap gap-1">
														{med.laboratorios.slice(0, 2).map((lab, idx) => (
															<Badge key={idx} variant="outline" className="text-xs">
																{lab}
															</Badge>
														))}
														{med.laboratorios.length > 2 && (
															<Badge variant="outline" className="text-xs">
																+{med.laboratorios.length - 2}
															</Badge>
														)}
													</div>
												</TableCell>
												<TableCell className="max-w-xs truncate" title={med.indicacao}>
													{med.indicacao}
												</TableCell>
												<TableCell>
													<div className="text-sm">
														{med.especies.filter(e => e.dosePorKg > 0).length} espécies
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center">
														<span className={med.usadoEmConsultas > 0 ? "font-semibold" : "text-gray-400"}>
															{med.usadoEmConsultas}
														</span>
													</div>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end gap-1">
														<Button
															variant="ghost"
															size="sm"
															onClick={() => openCalculadora(med)}
															title="Calculadora de doses"
														>
															<Calculator className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => openEditDialog(med)}
															title="Editar"
														>
															<Edit className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleDeleteMedicamento(med.id, med.nomeComercial)}
															title="Excluir"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Calculadora de Doses Dialog */}
				<Dialog open={isCalculadoraOpen} onOpenChange={setIsCalculadoraOpen}>
					<DialogContent className="max-w-md">
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								<Calculator className="h-5 w-5" />
								Calculadora de Doses
							</DialogTitle>
							<DialogDescription>
								Calcule a dose automaticamente baseado no peso e espécie
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-4 py-4">
							<div>
								<Label htmlFor="medicamentoCalc">Medicamento</Label>
								<Select onValueChange={(id) => {
									const med = medicamentos.find(m => m.id === id);
									setSelectedMedicamento(med || null);
								}}>
									<SelectTrigger>
										<SelectValue placeholder="Selecione um medicamento" />
									</SelectTrigger>
									<SelectContent>
										{medicamentos.map(med => (
											<SelectItem key={med.id} value={med.id}>
												{med.nomeComercial}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{selectedMedicamento && (
								<>
									<div>
										<Label htmlFor="especie">Espécie</Label>
										<Select onValueChange={setEspecieCalculo}>
											<SelectTrigger>
												<SelectValue placeholder="Selecione a espécie" />
											</SelectTrigger>
											<SelectContent>
												{selectedMedicamento.especies
													.filter(e => e.dosePorKg > 0)
													.map((esp) => (
														<SelectItem key={esp.codigo} value={esp.codigo}>
															{esp.descricao} ({esp.dosePorKg} {esp.unidade}/kg)
														</SelectItem>
													))}
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label htmlFor="peso">Peso do Animal (kg)</Label>
										<Input
											id="peso"
											type="number"
											step="0.1"
											placeholder="Ex: 5.5"
											value={pesoAnimal}
											onChange={(e) => setPesoAnimal(e.target.value)}
										/>
									</div>

									<Button onClick={calcularDose} className="w-full">
										Calcular Dose
									</Button>

									{doseCalculada !== null && (
										<Card className={doseCalculada === 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}>
											<CardContent className="pt-4">
												<div className="text-center">
													{doseCalculada === 0 ? (
														<div className="space-y-2">
															<AlertTriangle className="h-8 w-8 text-red-500 mx-auto" />
															<p className="font-semibold text-red-600">
																{selectedMedicamento.atencao || 'CONTRA-INDICADO'}
															</p>
														</div>
													) : (
														<div className="space-y-2">
															<CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
															<p className="text-2xl font-bold text-green-700">
																{doseCalculada.toFixed(2)} {selectedMedicamento.especies[0]?.unidade || 'mg'}
															</p>
															<p className="text-sm text-gray-600">
																Dose para {pesoAnimal}kg
															</p>
														</div>
													)}
												</div>
											</CardContent>
										</Card>
									)}
								</>
							)}
						</div>
					</DialogContent>
				</Dialog>

				{/* Dialog para novo/editar medicamento */}
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>
								{selectedMedicamento ? 'Editar Medicamento' : 'Novo Medicamento'}
							</DialogTitle>
							<DialogDescription>
								{selectedMedicamento
									? 'Atualize os dados do medicamento'
									: 'Cadastre um novo medicamento no DEF'}
							</DialogDescription>
						</DialogHeader>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
							{/* Coluna 1: Dados básicos */}
							<div className="space-y-4">
								<div>
									<Label htmlFor="nomeComercial">Nome Comercial *</Label>
									<Input
										id="nomeComercial"
										value={formData.nomeComercial}
										onChange={(e) => setFormData({ ...formData, nomeComercial: e.target.value })}
										placeholder="Ex: AAS, Ivermectina, Enrofloxacina"
									/>
								</div>

								<div>
									<Label htmlFor="nomeQuimico">Nome Químico *</Label>
									<Input
										id="nomeQuimico"
										value={formData.nomeQuimico}
										onChange={(e) => setFormData({ ...formData, nomeQuimico: e.target.value })}
										placeholder="Ex: Ácido Acetilsalicílico, Ivermectina"
									/>
								</div>

								<div>
									<Label htmlFor="laboratorios">Laboratórios (separados por vírgula)</Label>
									<Input
										id="laboratorios"
										value={formData.laboratorios}
										onChange={(e) => setFormData({ ...formData, laboratorios: e.target.value })}
										placeholder="Ex: Bayer, Merial, Zoetis, Ourofino"
									/>
								</div>

								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="isVeterinario"
										checked={formData.isVeterinario}
										onChange={(e) => setFormData({ ...formData, isVeterinario: e.target.checked })}
										className="rounded"
									/>
									<Label htmlFor="isVeterinario">Medicamento Veterinário</Label>
								</div>

								<div>
									<Label htmlFor="atencao">Atenções / Contra-indicações</Label>
									<Textarea
										id="atencao"
										value={formData.atencao}
										onChange={(e) => setFormData({ ...formData, atencao: e.target.value })}
										placeholder="Ex: NÃO APLICAR EM FELINOS!!! Cuidado com raças Collie"
										rows={2}
									/>
								</div>
							</div>

							{/* Coluna 2: Informações clínicas */}
							<div className="space-y-4">
								<div>
									<Label htmlFor="apresentacao">Apresentação</Label>
									<Textarea
										id="apresentacao"
										value={formData.apresentacao}
										onChange={(e) => setFormData({ ...formData, apresentacao: e.target.value })}
										placeholder="Ex: Comprimidos de 500mg, Injetável 1%, Solução oral"
										rows={3}
									/>
								</div>

								<div>
									<Label htmlFor="indicacao">Indicação</Label>
									<Textarea
										id="indicacao"
										value={formData.indicacao}
										onChange={(e) => setFormData({ ...formData, indicacao: e.target.value })}
										placeholder="Ex: Analgésico, Antitérmico, Antiparasitário de amplo espectro"
										rows={2}
									/>
								</div>

								<div>
									<Label htmlFor="posologia">Posologia</Label>
									<Textarea
										id="posologia"
										value={formData.posologia}
										onChange={(e) => setFormData({ ...formData, posologia: e.target.value })}
										placeholder="Ex: Caninos: 25mg/kg a cada 8-12h. Felinos: 15mg/kg a cada 12h."
										rows={3}
									/>
								</div>
							</div>

							{/* Coluna completa: Dosagens por espécie */}
							<div className="md:col-span-2">
								<Separator className="my-4" />
								<h3 className="text-lg font-semibold mb-4">Dosagens por Espécie</h3>
								<div className="space-y-4">
									{especies.map((especie, index) => (
										<div key={especie.codigo} className="flex items-center gap-4 p-3 border rounded-lg">
											<div className="flex-1">
												<Label>{especie.descricao}</Label>
											</div>
											<div className="w-32">
												<Input
													type="number"
													step="0.1"
													placeholder="Dose/kg"
													value={especie.dosePorKg || ''}
													onChange={(e) => {
														const novasEspecies = [...especies];
														novasEspecies[index].dosePorKg = parseFloat(e.target.value) || 0;
														setEspecies(novasEspecies);
													}}
												/>
											</div>
											<div className="w-24">
												<Select
													value={especie.unidade}
													onValueChange={(value) => {
														const novasEspecies = [...especies];
														novasEspecies[index].unidade = value;
														setEspecies(novasEspecies);
													}}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="mg">mg</SelectItem>
														<SelectItem value="ml">ml</SelectItem>
														<SelectItem value="UI">UI</SelectItem>
														<SelectItem value="g">g</SelectItem>
														<SelectItem value="mg/ml">mg/ml</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => {
													const novasEspecies = especies.filter((_, i) => i !== index);
													setEspecies(novasEspecies);
												}}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									))}

									<Button
										variant="outline"
										onClick={() => {
											setEspecies([...especies, {
												codigo: `00${especies.length + 1}`,
												descricao: 'Nova Espécie',
												dosePorKg: 0,
												unidade: 'mg'
											}]);
										}}
									>
										<Plus className="mr-2 h-4 w-4" />
										Adicionar Espécie
									</Button>
								</div>
							</div>

							{/* Coluna completa: Observações */}
							<div className="md:col-span-2">
								<Separator className="my-4" />
								<div>
									<Label htmlFor="observacoes">Observações</Label>
									<Textarea
										id="observacoes"
										value={formData.observacoes}
										onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
										placeholder="Outras informações relevantes sobre o medicamento"
										rows={3}
									/>
								</div>
							</div>
						</div>

						<DialogFooter>
							<Button variant="outline" onClick={() => {
								setIsDialogOpen(false);
								resetForm();
							}}>
								Cancelar
							</Button>
							<Button onClick={handleSaveMedicamento}>
								<Save className="mr-2 h-4 w-4" />
								{selectedMedicamento ? 'Atualizar' : 'Cadastrar'}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};

export default MedicamentosPage;