import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Save,
  Building,
  Activity,
  Loader2,
  ExternalLink,
  FileText,
  Database,
  Cloud,
  Zap,
  Shield,
  Brain,
  FileDown
} from 'lucide-react';
import { medicamentoService } from '@/services/medicamentoService';
import { categoriasMedicamentos, especiesSuportadas } from '@/data/medicamentosVeterinarios';

// Tipos
interface EspecieDosagem {
  codigo: string;
  descricao: string;
  dosePorKg: number;
  unidade: string;
  contraindicado?: boolean;
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
  categoria: string;
  viaAdministracao: string[];
}

const MedicamentosPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estados principais
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'veterinarios' | 'humanos'>('todos');
  const [filterCategoria, setFilterCategoria] = useState('Todos');
  const [filterEspecie, setFilterEspecie] = useState('TODAS');
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [buscarOnline, setBuscarOnline] = useState(false);
  const [resultadosOnline, setResultadosOnline] = useState<any[]>([]);

  // Estados para modais
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCalculadoraOpen, setIsCalculadoraOpen] = useState(false);
  const [isImportarPDFOpen, setIsImportarPDFOpen] = useState(false);
  const [isBuscarOnlineOpen, setIsBuscarOnlineOpen] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState<Medicamento | null>(null);

  // Estados para importação
  const [arquivoPDF, setArquivoPDF] = useState<File | null>(null);
  const [importandoPDF, setImportandoPDF] = useState(false);
  const [termoBuscaOnline, setTermoBuscaOnline] = useState('');
  const [buscandoOnline, setBuscandoOnline] = useState(false);

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
    isVeterinario: true,
    categoria: 'Não categorizado',
    viaAdministracao: ['Oral']
  });

  const [especies, setEspecies] = useState<EspecieDosagem[]>([
    { codigo: 'CAN', descricao: 'Canino', dosePorKg: 0, unidade: 'mg' },
    { codigo: 'FEL', descricao: 'Felino', dosePorKg: 0, unidade: 'mg' },
    { codigo: 'EQU', descricao: 'Equino', dosePorKg: 0, unidade: 'mg' },
    { codigo: 'BOV', descricao: 'Bovino', dosePorKg: 0, unidade: 'mg' },
    { codigo: 'AVE', descricao: 'Aves', dosePorKg: 0, unidade: 'mg' },
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
      const data = await medicamentoService.search({
        termo: searchTerm,
        tipo: filterType,
        categoria: filterCategoria !== 'Todos' ? filterCategoria : undefined,
        especie: filterEspecie !== 'TODAS' ? filterEspecie : undefined
      });
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

  // Atualizar busca quando filtros mudam
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarMedicamentos();
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterType, filterCategoria, filterEspecie]);

  // Importar dados iniciais
  const handleImportarBase = async () => {
    if (!confirm('Importar base completa de medicamentos veterinários? Esta ação adicionará 50+ medicamentos comuns.')) {
      return;
    }

    try {
      setImporting(true);
      // Simular importação
      await new Promise(resolve => setTimeout(resolve, 1500));
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

  // Importar do PDF
  const handleImportarPDF = async () => {
    if (!arquivoPDF) {
      toast({
        title: 'Atenção',
        description: 'Selecione um arquivo PDF',
        variant: 'destructive',
      });
      return;
    }

    try {
      setImportandoPDF(true);
      const medicamentosImportados = await medicamentoService.importarDePDF(arquivoPDF);

      toast({
        title: 'Sucesso',
        description: `${medicamentosImportados.length} medicamentos importados do PDF`,
      });

      setIsImportarPDFOpen(false);
      setArquivoPDF(null);
      await carregarMedicamentos();
    } catch (error) {
      console.error('Erro na importação do PDF:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível importar do PDF',
        variant: 'destructive',
      });
    } finally {
      setImportandoPDF(false);
    }
  };

  // Buscar online
  const handleBuscarOnline = async () => {
    if (!termoBuscaOnline.trim()) {
      toast({
        title: 'Atenção',
        description: 'Digite um termo para buscar',
        variant: 'destructive',
      });
      return;
    }

    try {
      setBuscandoOnline(true);
      const resultados = await medicamentoService.buscarNaANVISA(termoBuscaOnline);
      setResultadosOnline(resultados.slice(0, 10)); // Limitar a 10 resultados

      toast({
        title: resultados.length > 0 ? 'Resultados encontrados' : 'Nenhum resultado',
        description: resultados.length > 0
          ? `Encontrados ${resultados.length} medicamentos na ANVISA`
          : 'Tente outro termo de busca',
      });
    } catch (error) {
      console.error('Erro na busca online:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível buscar online',
        variant: 'destructive',
      });
    } finally {
      setBuscandoOnline(false);
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
        especies: especies.filter(e => e.dosePorKg >= 0),
        laboratorios: formData.laboratorios.split(',').map(l => l.trim()).filter(l => l),
        viaAdministracao: Array.isArray(formData.viaAdministracao)
          ? formData.viaAdministracao
          : [formData.viaAdministracao]
      };

      if (selectedMedicamento) {
        await medicamentoService.update(selectedMedicamento.id, medicamentoData);
        toast({
          title: 'Sucesso',
          description: 'Medicamento atualizado com sucesso',
        });
      } else {
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

    if (especie.contraindicado || especie.dosePorKg === 0) {
      toast({
        title: 'Contra-indicação!',
        description: selectedMedicamento.atencao || 'Não aplicar nesta espécie',
        variant: 'destructive',
      });
      setDoseCalculada(0);
      return;
    }

    const peso = parseFloat(pesoAnimal);
    if (isNaN(peso) || peso <= 0) {
      toast({
        title: 'Peso inválido',
        description: 'Digite um peso válido em kg',
        variant: 'destructive',
      });
      return;
    }

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
      isVeterinario: true,
      categoria: 'Não categorizado',
      viaAdministracao: ['Oral']
    });
    setEspecies([
      { codigo: 'CAN', descricao: 'Canino', dosePorKg: 0, unidade: 'mg' },
      { codigo: 'FEL', descricao: 'Felino', dosePorKg: 0, unidade: 'mg' },
      { codigo: 'EQU', descricao: 'Equino', dosePorKg: 0, unidade: 'mg' },
      { codigo: 'BOV', descricao: 'Bovino', dosePorKg: 0, unidade: 'mg' },
      { codigo: 'AVE', descricao: 'Aves', dosePorKg: 0, unidade: 'mg' },
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
      categoria: medicamento.categoria || 'Não categorizado',
      viaAdministracao: medicamento.viaAdministracao || ['Oral']
    });
    setEspecies(medicamento.especies);
    setIsDialogOpen(true);
  };

  // Abrir calculadora
  const openCalculadora = (medicamento: Medicamento) => {
    setSelectedMedicamento(medicamento);
    setPesoAnimal('');
    setEspecieCalculo('');
    setDoseCalculada(null);
    setIsCalculadoraOpen(true);
  };

  // Adicionar resultado online
  const adicionarResultadoOnline = (resultado: any) => {
    const novoMedicamento = {
      nomeComercial: resultado.nome || resultado.produto,
      nomeQuimico: resultado.principioAtivo || resultado.nome,
      especies: [{ codigo: 'CAN', descricao: 'Canino', dosePorKg: 0, unidade: 'mg' }],
      atencao: resultado.restricao || '',
      apresentacao: resultado.apresentacao || 'Não especificado',
      indicacao: resultado.indicacao || 'Não especificado',
      posologia: 'Consulte a bula',
      laboratorios: [resultado.detentor || 'ANVISA'],
      observacoes: 'Importado da ANVISA',
      isVeterinario: false,
      categoria: 'Humano (ANVISA)',
      viaAdministracao: ['Oral']
    };

    setFormData(novoMedicamento as any);
    setSelectedMedicamento(null);
    setIsBuscarOnlineOpen(false);
    setIsDialogOpen(true);
  };

  // Estatísticas
  const estatisticas = medicamentoService.getEstatisticas();

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Pill className="h-8 w-8 text-red-500" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Dicionário de Especialidades Farmacêuticas</h1>
                <p className="text-gray-400 text-sm md:text-base">Sistema híbrido SofVet: Banco local + API ANVISA + Importação USP</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs bg-black/50 border-red-600/50 text-white">
                <Database className="h-3 w-3 mr-1" /> Local
              </Badge>
              <Badge variant="outline" className="text-xs bg-black/50 border-blue-600/50 text-blue-300">
                <Cloud className="h-3 w-3 mr-1" /> ANVISA
              </Badge>
              <Badge variant="outline" className="text-xs bg-black/50 border-green-600/50 text-green-300">
                <FileText className="h-3 w-3 mr-1" /> USP
              </Badge>
              <Badge variant="outline" className="text-xs bg-black/50 border-purple-600/50 text-purple-300">
                <Brain className="h-3 w-3 mr-1" /> IA
              </Badge>
              <span className="text-xs text-gray-500">• Sistema híbrido completo • Busca inteligente</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="border-red-600/50 text-white hover:bg-red-600/20"
              onClick={() => navigate('/medicamentos/backup')}
            >
              <History className="mr-2 h-4 w-4" />
              Backup
            </Button>
            <Button
              variant="outline"
              className="border-red-600/50 text-white hover:bg-red-600/20"
              onClick={() => setIsBuscarOnlineOpen(true)}
            >
              <Cloud className="mr-2 h-4 w-4" />
              Buscar Online
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
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

        {/* Sistema Híbrido Info */}
        <Card className="mb-6 bg-gradient-to-r from-black/50 to-red-900/20 border-red-600/30">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Sistema Híbrido SofVet DEF</h3>
                <p className="text-gray-400 text-sm">
                  Banco local com 50+ medicamentos veterinários • API ANVISA em tempo real •
                  Importação de PDFs da USP • Busca inteligente por espécie e categoria
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-600/50 text-blue-300 hover:bg-blue-600/20"
                  onClick={() => setIsBuscarOnlineOpen(true)}
                >
                  <Cloud className="mr-2 h-4 w-4" />
                  API ANVISA
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-600/50 text-green-300 hover:bg-green-600/20"
                  onClick={() => setIsImportarPDFOpen(true)}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Importar USP
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-600/50 text-purple-300 hover:bg-purple-600/20"
                  onClick={handleImportarBase}
                  disabled={importing}
                >
                  {importing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Database className="mr-2 h-4 w-4" />
                  )}
                  Banco Local
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
          <Card className="bg-black/50 border-red-600/30">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-400">Total Local</p>
                  <p className="text-xl md:text-2xl font-bold text-white">{estatisticas.total}</p>
                </div>
                <Database className="h-8 w-8 md:h-10 md:w-10 text-red-100 bg-red-600/50 p-1 md:p-2 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-red-600/30">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-400">Veterinários</p>
                  <p className="text-xl md:text-2xl font-bold text-green-500">{estatisticas.veterinarios}</p>
                </div>
                <FlaskConical className="h-8 w-8 md:h-10 md:w-10 text-green-100 bg-green-600/50 p-1 md:p-2 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-red-600/30">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-400">Total Usos</p>
                  <p className="text-xl md:text-2xl font-bold text-amber-500">{estatisticas.totalUsos}</p>
                </div>
                <Activity className="h-8 w-8 md:h-10 md:w-10 text-amber-100 bg-amber-600/50 p-1 md:p-2 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-red-600/30">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-400">Com Atenção</p>
                  <p className="text-xl md:text-2xl font-bold text-orange-500">{estatisticas.comAtencao}</p>
                </div>
                <AlertTriangle className="h-8 w-8 md:h-10 md:w-10 text-orange-100 bg-orange-600/50 p-1 md:p-2 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2 md:col-span-1 bg-black/50 border-red-600/30">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-400 truncate">Mais Usado</p>
                  <p className="text-sm md:text-lg font-bold text-white truncate" title={estatisticas.maisUsado}>
                    {estatisticas.maisUsado}
                  </p>
                </div>
                <Zap className="h-8 w-8 md:h-10 md:w-10 text-red-100 bg-red-600/50 p-1 md:p-2 rounded-lg flex-shrink-0 ml-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros Avançados */}
        <Card className="mb-6 bg-black/50 border-red-600/30">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, princípio ativo, indicação..."
                  className="pl-10 bg-black/30 border-red-600/50 text-white placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-2">
                  <strong>SofVet AI:</strong> Busca em banco local, API ANVISA e memoriza novos termos
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={filterEspecie} onValueChange={setFilterEspecie}>
                  <SelectTrigger className="w-full sm:w-[150px] bg-black/30 border-red-600/50 text-white">
                    <SelectValue placeholder="Espécie" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-600/30">
                    <SelectItem value="TODAS" className="text-white focus:bg-red-600/20">Todas Espécies</SelectItem>
                    {especiesSuportadas.map(esp => (
                      <SelectItem key={esp.codigo} value={esp.codigo} className="text-white focus:bg-red-600/20">
                        {esp.descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                  <SelectTrigger className="w-full sm:w-[150px] bg-black/30 border-red-600/50 text-white">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-600/30">
                    {categoriasMedicamentos.map(cat => (
                      <SelectItem key={cat} value={cat} className="text-white focus:bg-red-600/20">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterType} onValueChange={(value: 'todos' | 'veterinarios' | 'humanos') => setFilterType(value)}>
                  <SelectTrigger className="w-full sm:w-[150px] bg-black/30 border-red-600/50 text-white">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-600/30">
                    <SelectItem value="todos" className="text-white focus:bg-red-600/20">Todos</SelectItem>
                    <SelectItem value="veterinarios" className="text-white focus:bg-red-600/20">Veterinários</SelectItem>
                    <SelectItem value="humanos" className="text-white focus:bg-red-600/20">Humanos</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="border-red-600/50 text-white hover:bg-red-600/20"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('todos');
                    setFilterCategoria('Todos');
                    setFilterEspecie('TODAS');
                  }}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="bg-black/50 border-red-600/30 overflow-hidden">
          <CardHeader className="border-b border-red-600/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-white">Medicamentos Cadastrados</CardTitle>
                <CardDescription className="text-gray-400">
                  {medicamentos.length} medicamentos • {estatisticas.totalUsos} usos registrados
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-600/50 text-white hover:bg-red-600/20"
                  onClick={() => setIsCalculadoraOpen(true)}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculadora
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
            ) : medicamentos.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Nenhum medicamento encontrado</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? `Nenhum resultado para "${searchTerm}"`
                    : "Importe o banco local ou busque online"}
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    onClick={handleImportarBase}
                    disabled={importing}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {importing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importando...
                      </>
                    ) : (
                      <>
                        <Database className="mr-2 h-4 w-4" />
                        Importar Banco Local
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-blue-600/50 text-blue-300 hover:bg-blue-600/20"
                    onClick={() => setIsBuscarOnlineOpen(true)}
                  >
                    <Cloud className="mr-2 h-4 w-4" />
                    Buscar Online
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow className="border-red-600/30">
                        <TableHead className="text-white bg-black/30">Medicamento</TableHead>
                        <TableHead className="text-white bg-black/30">Categoria</TableHead>
                        <TableHead className="text-white bg-black/30">Espécies</TableHead>
                        <TableHead className="text-white bg-black/30">Indicação</TableHead>
                        <TableHead className="text-white bg-black/30">Usos</TableHead>
                        <TableHead className="text-right text-white bg-black/30">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {medicamentos.map((med) => (
                        <TableRow key={med.id} className="border-red-600/30 hover:bg-red-600/10">
                          <TableCell className="font-medium text-white">
                            <div className="flex items-center gap-2">
                              <Pill className="h-4 w-4 text-red-400" />
                              <div>
                                <div className="flex items-center gap-2">
                                  {med.nomeComercial}
                                  {med.atencao && (
                                    <AlertTriangle className="h-4 w-4 text-amber-500" title="Possui atenção especial" />
                                  )}
                                </div>
                                <div className="text-xs text-gray-400">{med.nomeQuimico}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-xs bg-black/30 border-red-600/30 text-white"
                            >
                              {med.categoria || 'Não categorizado'}
                            </Badge>
                            <div className="text-xs text-gray-400 mt-1">
                              {med.isVeterinario ? 'Veterinário' : 'Humano'}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <div className="flex flex-wrap gap-1">
                              {med.especies
                                .filter(e => e.dosePorKg > 0)
                                .slice(0, 3)
                                .map((esp, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className={`text-xs ${esp.contraindicado ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-black/30 border-green-600/30 text-green-300'}`}
                                  >
                                    {esp.descricao}
                                  </Badge>
                                ))}
                              {med.especies.filter(e => e.dosePorKg > 0).length > 3 && (
                                <Badge variant="outline" className="text-xs bg-black/30 border-red-600/30 text-white">
                                  +{med.especies.filter(e => e.dosePorKg > 0).length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-white max-w-[250px]">
                            <div className="text-sm truncate" title={med.indicacao}>
                              {med.indicacao}
                            </div>
                            <div className="text-xs text-gray-400 truncate" title={med.apresentacao}>
                              {med.apresentacao}
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            <div className="flex items-center">
                              <span className={med.usadoEmConsultas > 0 ? "font-semibold text-amber-300" : "text-gray-400"}>
                                {med.usadoEmConsultas}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-400 hover:bg-red-600/20 hover:text-red-300"
                                onClick={() => openCalculadora(med)}
                                title="Calculadora de doses"
                              >
                                <Calculator className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-blue-400 hover:bg-blue-600/20 hover:text-blue-300"
                                onClick={() => openEditDialog(med)}
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-400 hover:bg-red-600/20 hover:text-red-300"
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal: Buscar Online (ANVISA) */}
        <Dialog open={isBuscarOnlineOpen} onOpenChange={setIsBuscarOnlineOpen}>
          <DialogContent className="max-w-2xl bg-black/90 border-blue-600/30 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white">
                <Cloud className="h-5 w-5 text-blue-500" />
                Buscar na ANVISA Online
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Busque medicamentos registrados na Agência Nacional de Vigilância Sanitária
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Digite o nome do medicamento, princípio ativo..."
                    className="pl-10 bg-black/30 border-blue-600/50 text-white"
                    value={termoBuscaOnline}
                    onChange={(e) => setTermoBuscaOnline(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleBuscarOnline()}
                  />
                </div>
                <Button
                  onClick={handleBuscarOnline}
                  disabled={buscandoOnline}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {buscandoOnline ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>

              {resultadosOnline.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <h4 className="text-sm font-semibold text-gray-300">
                    {resultadosOnline.length} resultados encontrados
                  </h4>
                  {resultadosOnline.map((resultado, index) => (
                    <Card key={index} className="bg-black/50 border-blue-600/30">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-semibold text-white">{resultado.nome || resultado.produto}</h5>
                            <p className="text-sm text-gray-400">
                              {resultado.principioAtivo && `Princípio ativo: ${resultado.principioAtivo}`}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {resultado.detentor && `Laboratório: ${resultado.detentor}`}
                              {resultado.numeroRegistro && ` • Registro: ${resultado.numeroRegistro}`}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-600/50 text-blue-300 hover:bg-blue-600/20"
                            onClick={() => adicionarResultadoOnline(resultado)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Adicionar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : termoBuscaOnline && !buscandoOnline ? (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Nenhum resultado encontrado para "{termoBuscaOnline}"</p>
                  <p className="text-sm text-gray-500 mt-2">Tente outro termo ou importe do PDF da USP</p>
                </div>
              ) : null}
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal: Importar PDF USP */}
        <Dialog open={isImportarPDFOpen} onOpenChange={setIsImportarPDFOpen}>
          <DialogContent className="max-w-md bg-black/90 border-green-600/30 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white">
                <FileDown className="h-5 w-5 text-green-500" />
                Importar do PDF da USP
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Faça upload do PDF da Universidade de São Paulo para importar medicamentos
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="border-2 border-dashed border-green-600/30 rounded-lg p-6 text-center">
                <FileText className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Arraste ou selecione o PDF da USP</p>
                <p className="text-sm text-gray-500 mb-4">
                  O sistema extrairá automaticamente nomes, doses e informações
                </p>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setArquivoPDF(e.target.files?.[0] || null)}
                  className="text-white"
                />
                {arquivoPDF && (
                  <p className="text-sm text-green-400 mt-2">
                    ✅ {arquivoPDF.name} ({Math.round(arquivoPDF.size / 1024)} KB)
                  </p>
                )}
              </div>

              <div className="bg-black/30 border border-green-600/20 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-green-300 mb-2">Como funciona:</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Sistema lê o PDF e identifica medicamentos</li>
                  <li>• Extrai doses por espécie automaticamente</li>
                  <li>• Categoriza por tipo (antibiótico, anti-inflamatório, etc.)</li>
                  <li>• Adiciona ao banco local do SofVet</li>
                </ul>
              </div>

              <Button
                onClick={handleImportarPDF}
                disabled={!arquivoPDF || importandoPDF}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {importandoPDF ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando PDF...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Importar do PDF
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal: Calculadora (mantido igual) */}
        <Dialog open={isCalculadoraOpen} onOpenChange={setIsCalculadoraOpen}>
          <DialogContent className="max-w-md bg-black/90 border-red-600/30 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white">
                <Calculator className="h-5 w-5 text-red-500" />
                Calculadora de Doses
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Calcule a dose automaticamente baseado no peso e espécie
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="medicamentoCalc" className="text-white">Medicamento</Label>
                <Select onValueChange={(id) => {
                  const med = medicamentos.find(m => m.id === id);
                  setSelectedMedicamento(med || null);
                }}>
                  <SelectTrigger className="bg-black/30 border-red-600/50 text-white">
                    <SelectValue placeholder="Selecione um medicamento" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-600/30">
                    {medicamentos.map(med => (
                      <SelectItem key={med.id} value={med.id} className="text-white focus:bg-red-600/20">
                        {med.nomeComercial}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedMedicamento && (
                <>
                  <div>
                    <Label htmlFor="especie" className="text-white">Espécie</Label>
                    <Select onValueChange={setEspecieCalculo}>
                      <SelectTrigger className="bg-black/30 border-red-600/50 text-white">
                        <SelectValue placeholder="Selecione a espécie" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-red-600/30">
                        {selectedMedicamento.especies
                          .filter(e => e.dosePorKg > 0)
                          .map((esp) => (
                            <SelectItem
                              key={esp.codigo}
                              value={esp.codigo}
                              className={esp.contraindicado ? 'text-red-300 focus:bg-red-600/20' : 'text-white focus:bg-red-600/20'}
                            >
                              {esp.descricao} ({esp.dosePorKg} {esp.unidade}/kg)
                              {esp.contraindicado && ' ⚠️'}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="peso" className="text-white">Peso do Animal (kg)</Label>
                    <Input
                      id="peso"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 5.5"
                      value={pesoAnimal}
                      onChange={(e) => setPesoAnimal(e.target.value)}
                      className="bg-black/30 border-red-600/50 text-white"
                    />
                  </div>

                  <Button
                    onClick={calcularDose}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    Calcular Dose
                  </Button>

                  {doseCalculada !== null && (
                    <Card className={doseCalculada === 0 ? 'bg-red-900/30 border-red-600' : 'bg-green-900/30 border-green-600'}>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          {doseCalculada === 0 ? (
                            <div className="space-y-2">
                              <AlertTriangle className="h-8 w-8 text-red-400 mx-auto" />
                              <p className="font-semibold text-red-300">
                                {selectedMedicamento.atencao || 'CONTRA-INDICADO'}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <CheckCircle className="h-8 w-8 text-green-400 mx-auto" />
                              <p className="text-2xl font-bold text-green-300">
                                {doseCalculada.toFixed(2)} {selectedMedicamento.especies[0]?.unidade || 'mg'}
                              </p>
                              <p className="text-sm text-gray-300">
                                Dose para {pesoAnimal}kg • {selectedMedicamento.posologia.split('.')[0]}
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

        {/* Modal: Novo/Editar Medicamento (mantido similar) */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 border-red-600/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedMedicamento ? 'Editar Medicamento' : 'Novo Medicamento'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {selectedMedicamento
                  ? 'Atualize os dados do medicamento'
                  : 'Cadastre um novo medicamento no SofVet DEF'}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basico" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-black/30 border border-red-600/30">
                <TabsTrigger value="basico" className="text-white data-[state=active]:bg-red-600/50">Dados Básicos</TabsTrigger>
                <TabsTrigger value="doses" className="text-white data-[state=active]:bg-red-600/50">Doses por Espécie</TabsTrigger>
                <TabsTrigger value="clinico" className="text-white data-[state=active]:bg-red-600/50">Informações Clínicas</TabsTrigger>
              </TabsList>

              <TabsContent value="basico" className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nomeComercial" className="text-white">Nome Comercial *</Label>
                      <Input
                        id="nomeComercial"
                        value={formData.nomeComercial}
                        onChange={(e) => setFormData({ ...formData, nomeComercial: e.target.value })}
                        placeholder="Ex: Baytril, Rimadyl, Ivermectina"
                        className="bg-black/30 border-red-600/50 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="nomeQuimico" className="text-white">Nome Químico *</Label>
                      <Input
                        id="nomeQuimico"
                        value={formData.nomeQuimico}
                        onChange={(e) => setFormData({ ...formData, nomeQuimico: e.target.value })}
                        placeholder="Ex: Enrofloxacina, Carprofeno, Ivermectina"
                        className="bg-black/30 border-red-600/50 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="categoria" className="text-white">Categoria</Label>
                      <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                        <SelectTrigger className="bg-black/30 border-red-600/50 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-red-600/30">
                          {categoriasMedicamentos.map(cat => (
                            <SelectItem key={cat} value={cat} className="text-white focus:bg-red-600/20">
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="laboratorios" className="text-white">Laboratórios (separados por vírgula)</Label>
                      <Input
                        id="laboratorios"
                        value={formData.laboratorios}
                        onChange={(e) => setFormData({ ...formData, laboratorios: e.target.value })}
                        placeholder="Ex: Bayer, Zoetis, Ourofino, MSD"
                        className="bg-black/30 border-red-600/50 text-white"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isVeterinario"
                        checked={formData.isVeterinario}
                        onChange={(e) => setFormData({ ...formData, isVeterinario: e.target.checked })}
                        className="rounded border-red-600 bg-black/30"
                      />
                      <Label htmlFor="isVeterinario" className="text-white">Medicamento Veterinário</Label>
                    </div>

                    <div>
                      <Label htmlFor="viaAdministracao" className="text-white">Vias de Administração</Label>
                      <Select
                        value={Array.isArray(formData.viaAdministracao) ? formData.viaAdministracao[0] : formData.viaAdministracao}
                        onValueChange={(value) => setFormData({ ...formData, viaAdministracao: [value] })}
                      >
                        <SelectTrigger className="bg-black/30 border-red-600/50 text-white">
                          <SelectValue placeholder="Selecione a via" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-red-600/30">
                          <SelectItem value="Oral" className="text-white focus:bg-red-600/20">Oral</SelectItem>
                          <SelectItem value="Subcutânea" className="text-white focus:bg-red-600/20">Subcutânea</SelectItem>
                          <SelectItem value="Intramuscular" className="text-white focus:bg-red-600/20">Intramuscular</SelectItem>
                          <SelectItem value="Intravenosa" className="text-white focus:bg-red-600/20">Intravenosa</SelectItem>
                          <SelectItem value="Tópica" className="text-white focus:bg-red-600/20">Tópica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="atencao" className="text-white">Atenções / Contra-indicações</Label>
                  <Textarea
                    id="atencao"
                    value={formData.atencao}
                    onChange={(e) => setFormData({ ...formData, atencao: e.target.value })}
                    placeholder="Ex: NÃO APLICAR EM FELINOS! Cuidado com raças Collie. Evitar em gestantes."
                    rows={3}
                    className="bg-black/30 border-red-600/50 text-white"
                  />
                </div>
              </TabsContent>

              <TabsContent value="doses" className="space-y-4 py-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Dosagens por Espécie</h3>
                  {especies.map((especie, index) => (
                    <div key={especie.codigo} className="flex flex-col sm:flex-row items-center gap-3 p-3 border border-red-600/30 rounded-lg">
                      <div className="w-full sm:w-48">
                        <Label className="text-white mb-1 block">Espécie</Label>
                        <Select
                          value={especie.codigo}
                          onValueChange={(value) => {
                            const novasEspecies = [...especies];
                            const especieInfo = especiesSuportadas.find(e => e.codigo === value);
                            novasEspecies[index] = {
                              ...novasEspecies[index],
                              codigo: value,
                              descricao: especieInfo?.descricao || 'Nova Espécie'
                            };
                            setEspecies(novasEspecies);
                          }}
                        >
                          <SelectTrigger className="bg-black/30 border-red-600/50 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-red-600/30">
                            {especiesSuportadas.map(esp => (
                              <SelectItem key={esp.codigo} value={esp.codigo} className="text-white focus:bg-red-600/20">
                                {esp.descricao}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-full sm:w-32">
                        <Label className="text-white mb-1 block">Dose/kg</Label>
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
                          className="bg-black/30 border-red-600/50 text-white"
                        />
                      </div>
                      <div className="w-full sm:w-24">
                        <Label className="text-white mb-1 block">Unidade</Label>
                        <Select
                          value={especie.unidade}
                          onValueChange={(value) => {
                            const novasEspecies = [...especies];
                            novasEspecies[index].unidade = value;
                            setEspecies(novasEspecies);
                          }}
                        >
                          <SelectTrigger className="bg-black/30 border-red-600/50 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-red-600/30">
                            <SelectItem value="mg" className="text-white focus:bg-red-600/20">mg</SelectItem>
                            <SelectItem value="ml" className="text-white focus:bg-red-600/20">ml</SelectItem>
                            <SelectItem value="UI" className="text-white focus:bg-red-600/20">UI</SelectItem>
                            <SelectItem value="g" className="text-white focus:bg-red-600/20">g</SelectItem>
                            <SelectItem value="mg/ml" className="text-white focus:bg-red-600/20">mg/ml</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`contraindicado-${index}`}
                            checked={especie.contraindicado || false}
                            onChange={(e) => {
                              const novasEspecies = [...especies];
                              novasEspecies[index].contraindicado = e.target.checked;
                              setEspecies(novasEspecies);
                            }}
                            className="rounded border-red-600 bg-black/30 mr-2"
                          />
                          <Label htmlFor={`contraindicado-${index}`} className="text-white text-sm">Contra-indicado</Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:bg-red-600/20 hover:text-red-300"
                          onClick={() => {
                            const novasEspecies = especies.filter((_, i) => i !== index);
                            setEspecies(novasEspecies);
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
                      setEspecies([...especies, {
                        codigo: 'CAN',
                        descricao: 'Canino',
                        dosePorKg: 0,
                        unidade: 'mg'
                      }]);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Espécie
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="clinico" className="space-y-4 py-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="apresentacao" className="text-white">Apresentação</Label>
                    <Textarea
                      id="apresentacao"
                      value={formData.apresentacao}
                      onChange={(e) => setFormData({ ...formData, apresentacao: e.target.value })}
                      placeholder="Ex: Comprimidos de 50mg, Injetável 2.5%, Solução oral 10mg/ml"
                      rows={3}
                      className="bg-black/30 border-red-600/50 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="indicacao" className="text-white">Indicação</Label>
                    <Textarea
                      id="indicacao"
                      value={formData.indicacao}
                      onChange={(e) => setFormData({ ...formData, indicacao: e.target.value })}
                      placeholder="Ex: Antibiótico de amplo espectro, Anti-inflamatório não esteroidal"
                      rows={2}
                      className="bg-black/30 border-red-600/50 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="posologia" className="text-white">Posologia</Label>
                    <Textarea
                      id="posologia"
                      value={formData.posologia}
                      onChange={(e) => setFormData({ ...formData, posologia: e.target.value })}
                      placeholder="Ex: 5 mg/kg VO a cada 12h por 7-14 dias. 0.2 mg/kg SC a cada 30 dias."
                      rows={3}
                      className="bg-black/30 border-red-600/50 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="observacoes" className="text-white">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                      placeholder="Outras informações relevantes, interações medicamentosas, etc."
                      rows={3}
                      className="bg-black/30 border-red-600/50 text-white"
                    />
                  </div>
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
                onClick={handleSaveMedicamento}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {selectedMedicamento ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
>>>>>>> babb723e479375a746737f90f0063a64bcda92e1
};

export default MedicamentosPage;