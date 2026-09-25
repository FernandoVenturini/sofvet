import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { doc, getDoc, updateDoc, serverTimestamp, getDocs, collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Pill, Calculator, Plus, Trash2, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { medicamentoService } from '@/services/medicamentoService';

const EditarFicha = () => {
	const { user } = useContext(AuthContext);
	const { id } = useParams<{ id: string; }>();
	const navigate = useNavigate();
	const { toast } = useToast();

	const [loading, setLoading] = useState(true);
	const [uploadingImage, setUploadingImage] = useState(false);
	const [imagemUrl, setImagemUrl] = useState('');
	const [isDEFDialogOpen, setIsDEFDialogOpen] = useState(false);
	const [medicamentos, setMedicamentos] = useState<any[]>([]);
	const [selectedMedicamento, setSelectedMedicamento] = useState<any>(null);
	const [medicamentosPrescritos, setMedicamentosPrescritos] = useState<any[]>([]);
	const [doseCalculada, setDoseCalculada] = useState<number | null>(null);

	const [formData, setFormData] = useState({
		nomeAnimal: '',
		especie: '',
		raca: '',
		pelagem: '',
		sexo: '',
		dataNascimento: '',
		cor: '',
		peso: '',
		nomeProprietario: '',
		telefoneProprietario: '',
		enderecoProprietario: '',
		observacoes: '',
	});

	// Estados para vacinas
	const [vacinasTabela, setVacinasTabela] = useState<Array<{ id: string, nome: string, doses: number, intervaloDias: number; }>>([]);
	const [vacinaSelecionada, setVacinaSelecionada] = useState('');
	const [doseAtual, setDoseAtual] = useState(1);
	const [dataDose, setDataDose] = useState('');
	const [vacinasAplicadas, setVacinasAplicadas] = useState<Array<{
		nomeVacina: string;
		dose: number;
		dataAplicacao: string;
		proximaData?: string;
	}>>([]);

	// Carrega ficha, vacinas da tabela e medicamentos
	useEffect(() => {
		const carregarDados = async () => {
			if (!id || !user) return;
			setLoading(true);
			try {
				// Carrega ficha
				const docRef = doc(db, 'animais', id);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const data = docSnap.data();
					setFormData({
						nomeAnimal: data.nomeAnimal || '',
						especie: data.especie || '',
						raca: data.raca || '',
						pelagem: data.pelagem || '',
						sexo: data.sexo || '',
						dataNascimento: data.dataNascimento || '',
						cor: data.cor || '',
						peso: data.peso || '',
						nomeProprietario: data.nomeProprietario || '',
						telefoneProprietario: data.telefoneProprietario || '',
						enderecoProprietario: data.enderecoProprietario || '',
						observacoes: data.observacoes || '',
					});
					setImagemUrl(data.imagemUrl || '');
					setVacinasAplicadas(data.vacinas || []);
					setMedicamentosPrescritos(data.medicamentosPrescritos || []);
				} else {
					alert('Ficha não encontrada');
					navigate('/fichas/lista');
				}

				// Carrega vacinas da tabela
				const snapshotVacinas = await getDocs(collection(db, 'vacinas'));
				const listaVacinas = snapshotVacinas.docs.map(doc => ({
					id: doc.id,
					...doc.data()
				})) as any;
				setVacinasTabela(listaVacinas);

				// Carrega medicamentos do DEF
				const medicamentosData = await medicamentoService.getAll();
				setMedicamentos(medicamentosData);
			} catch (error) {
				console.error('Erro ao carregar dados:', error);
				alert('Erro ao carregar a ficha.');
			} finally {
				setLoading(false);
			}
		};

		carregarDados();
	}, [id, user, navigate]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSelectChange = (field: keyof typeof formData) => (value: string) => {
		setFormData({
			...formData,
			[field]: value,
		});
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !user || !id) return;

		setUploadingImage(true);
		try {
			const storageRef = ref(storage, `animais/${user.uid}/${id}_${Date.now()}_${file.name}`);
			await uploadBytes(storageRef, file);
			const url = await getDownloadURL(storageRef);
			setImagemUrl(url);
			toast({
				title: 'Sucesso',
				description: 'Imagem atualizada com sucesso!',
			});
		} catch (error) {
			console.error('Erro no upload da imagem:', error);
			toast({
				title: 'Erro',
				description: 'Erro ao atualizar a imagem.',
				variant: 'destructive',
			});
		} finally {
			setUploadingImage(false);
		}
	};

	// Função corrigida para programação automática
	const adicionarVacina = () => {
		if (!vacinaSelecionada || !dataDose) {
			toast({
				title: 'Atenção',
				description: 'Selecione a vacina e a data da dose',
				variant: 'destructive',
			});
			return;
		}

		const vacina = vacinasTabela.find(v => v.id === vacinaSelecionada);
		if (!vacina) return;

		const novaLista = [...vacinasAplicadas];

		// Dose aplicada
		novaLista.push({
			nomeVacina: vacina.nome,
			dose: doseAtual,
			dataAplicacao: dataDose,
			proximaData: '',
		});

		// Programação automática das próximas doses
		if (doseAtual < vacina.doses) {
			let dataAtual = new Date(dataDose);
			for (let i = doseAtual + 1; i <= vacina.doses; i++) {
				dataAtual = new Date(dataAtual.getTime() + vacina.intervaloDias * 24 * 60 * 60 * 1000);
				const dataFormatada = dataAtual.toISOString().split('T')[0];

				novaLista.push({
					nomeVacina: vacina.nome,
					dose: i,
					dataAplicacao: '',
					proximaData: dataFormatada,
				});
			}
		}

		setVacinasAplicadas(novaLista);
		setVacinaSelecionada('');
		setDoseAtual(1);
		setDataDose('');
		toast({
			title: 'Sucesso',
			description: 'Dose aplicada e próximas programadas com sucesso!',
		});
	};

	// Funções para o DEF
	const calcularDose = () => {
		if (!selectedMedicamento || !formData.peso || !formData.especie) {
			toast({
				title: 'Atenção',
				description: 'Selecione um medicamento, informe o peso e a espécie do animal',
				variant: 'destructive',
			});
			return;
		}

		// Encontrar dosagem para a espécie do animal
		const especieDosagem = selectedMedicamento.especies.find((e: any) =>
			e.descricao.toLowerCase().includes(formData.especie.toLowerCase()) ||
			e.codigo === formData.especie
		);

		if (!especieDosagem) {
			toast({
				title: 'Atenção',
				description: `Dose não definida para ${formData.especie || 'esta espécie'}`,
				variant: 'destructive',
			});
			return;
		}

		if (especieDosagem.dosePorKg === 0) {
			toast({
				title: 'Contra-indicação!',
				description: selectedMedicamento.atencao || 'Não aplicar nesta espécie',
				variant: 'destructive',
			});
			setDoseCalculada(0);
			return;
		}

		const peso = parseFloat(formData.peso);
		const dose = peso * especieDosagem.dosePorKg;
		setDoseCalculada(dose);

		// Registrar uso do medicamento
		if (selectedMedicamento.id) {
			medicamentoService.incrementarUso(selectedMedicamento.id);
		}
	};

	const adicionarMedicamentoPrescrito = () => {
		if (!selectedMedicamento || !doseCalculada || doseCalculada === 0) {
			toast({
				title: 'Atenção',
				description: 'Calcule a dose primeiro',
				variant: 'destructive',
			});
			return;
		}

		const novaPrescricao = {
			id: Date.now(),
			medicamento: selectedMedicamento,
			dose: doseCalculada,
			unidade: selectedMedicamento.especies[0]?.unidade || 'mg',
			data: new Date().toISOString().split('T')[0],
			pesoAnimal: formData.peso,
			especieAnimal: formData.especie,
		};

		setMedicamentosPrescritos([...medicamentosPrescritos, novaPrescricao]);
		setSelectedMedicamento(null);
		setDoseCalculada(null);

		toast({
			title: 'Sucesso',
			description: 'Medicamento adicionado à prescrição',
		});
	};

	const removerMedicamentoPrescrito = (index: number) => {
		const novaLista = [...medicamentosPrescritos];
		novaLista.splice(index, 1);
		setMedicamentosPrescritos(novaLista);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id) return;

		setLoading(true);
		try {
			const docRef = doc(db, 'animais', id);
			await updateDoc(docRef, {
				...formData,
				imagemUrl,
				vacinas: vacinasAplicadas,
				medicamentosPrescritos,
				peso: formData.peso || 0,
				updatedAt: serverTimestamp(),
			});

			toast({
				title: 'Sucesso',
				description: 'Ficha atualizada com sucesso!',
			});
			navigate('/fichas/lista');
		} catch (error) {
			console.error('Erro ao atualizar ficha:', error);
			toast({
				title: 'Erro',
				description: 'Erro ao atualizar a ficha.',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-20">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
				<span className="ml-2 text-muted-foreground">Carregando ficha...</span>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto py-8 px-4 animate-fade-up">
			<h1 className="text-4xl font-bold text-gradient text-center mb-10">Editar Ficha</h1>

			<Tabs defaultValue="dados" className="space-y-6">
				<TabsList className="grid grid-cols-4 w-full max-w-xl mx-auto bg-muted border border-border">
					<TabsTrigger value="dados" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
						Dados
					</TabsTrigger>
					<TabsTrigger value="vacinas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
						Vacinas
					</TabsTrigger>
					<TabsTrigger value="medicamentos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
						Medicamentos
					</TabsTrigger>
					<TabsTrigger value="observacoes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
						Observações
					</TabsTrigger>
				</TabsList>

				<form onSubmit={handleSubmit}>
					{/* Aba: Dados do Animal e Proprietário */}
					<TabsContent value="dados" className="space-y-6">
						{/* Foto do Animal */}
						<Card className="bg-card border border-primary/20 shadow-md">
							<CardHeader>
								<CardTitle className="text-card-foreground">Foto do Animal</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col items-center space-y-4">
								{imagemUrl ? (
									<img src={imagemUrl} alt="Animal" className="h-64 w-64 object-cover rounded-lg shadow-md" />
								) : (
									<div className="h-64 w-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
										Sem imagem
									</div>
								)}
								<label className="cursor-pointer">
									<Button type="button" variant="outline" disabled={uploadingImage}>
										{uploadingImage ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Enviando...
											</>
										) : (
											'Trocar Foto'
										)}
									</Button>
									<input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
								</label>
							</CardContent>
						</Card>

						{/* Dados do Animal */}
						<Card className="bg-card border border-primary/20 shadow-md">
							<CardHeader>
								<CardTitle className="text-card-foreground">Dados do Animal</CardTitle>
							</CardHeader>
							<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<Label className="text-card-foreground">Nome do Animal *</Label>
									<Input
										name="nomeAnimal"
										value={formData.nomeAnimal}
										onChange={handleChange}
										required
										className="bg-background border-input focus:border-primary focus:ring-primary"
									/>
								</div>

								<div className="space-y-2">
									<Label className="text-card-foreground">Espécie</Label>
									<Select onValueChange={handleSelectChange('especie')} value={formData.especie}>
										<SelectTrigger className="bg-background border-input">
											<SelectValue placeholder="Selecione" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="canino">Canino</SelectItem>
											<SelectItem value="felino">Felino</SelectItem>
											<SelectItem value="equino">Equino</SelectItem>
											<SelectItem value="bovino">Bovino</SelectItem>
											<SelectItem value="ave">Ave</SelectItem>
											<SelectItem value="outro">Outro</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label className="text-card-foreground">Raça</Label>
									<Input
										name="raca"
										value={formData.raca}
										onChange={handleChange}
										className="bg-background border-input focus:border-primary focus:ring-primary"
									/>
								</div>

								<div className="space-y-2">
									<Label className="text-card-foreground">Pelagem</Label>
									<Input
										name="pelagem"
										value={formData.pelagem}
										onChange={handleChange}
										className="bg-background border-input focus:border-primary focus:ring-primary"
									/>
								</div>

								<div className="space-y-2">
									<Label className="text-card-foreground">Sexo</Label>
									<Select onValueChange={handleSelectChange('sexo')} value={formData.sexo}>
										<SelectTrigger className="bg-background border-input">
											<SelectValue placeholder="Selecione" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="macho">Macho</SelectItem>
											<SelectItem value="femea">Fêmea</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label className="text-card-foreground">Data de Nascimento</Label>
									<Input
										type="date"
										name="dataNascimento"
										value={formData.dataNascimento}
										onChange={handleChange}
										className="bg-background border-input focus:border-primary focus:ring-primary"
									/>
								</div>

								<div className="space-y-2">
									<Label className="text-card-foreground">Cor</Label>
									<Input
										name="cor"
										value={formData.cor}
										onChange={handleChange}
										className="bg-background border-input focus:border-primary focus:ring-primary"
									/>
								</div>

								<div className="space-y-2">
									<Label className="text-card-foreground">Peso (kg) *</Label>
									<Input
										name="peso"
										type="number"
										step="0.1"
										value={formData.peso}
										onChange={handleChange}
										required
										className="bg-background border-input focus:border-primary focus:ring-primary"
										placeholder="Ex: 5.5"
									/>
								</div>
							</CardContent>
						</Card>

						{/* Dados do Proprietário */}
						<Card className="bg-card border border-primary/20 shadow-md">
							<CardHeader>
								<CardTitle className="text-card-foreground">Dados do Proprietário</CardTitle>
							</CardHeader>
							<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<Label className="text-card-foreground">Nome *</Label>
									<Input
										name="nomeProprietario"
										value={formData.nomeProprietario}
										onChange={handleChange}
										required
										className="bg-background border-input focus:border-primary focus:ring-primary"
									/>
								</div>

								<div className="space-y-2">
									<Label className="text-card-foreground">Telefone</Label>
									<Input
										name="telefoneProprietario"
										value={formData.telefoneProprietario}
										onChange={handleChange}
										className="bg-background border-input focus:border-primary focus:ring-primary"
									/>
								</div>

								<div className="md:col-span-2 space-y-2">
									<Label className="text-card-foreground">Endereço</Label>
									<Textarea
										name="enderecoProprietario"
										value={formData.enderecoProprietario}
										onChange={handleChange}
										rows={3}
										className="bg-background border-input focus:border-primary focus:ring-primary"
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Aba: Vacinas */}
					<TabsContent value="vacinas">
						<Card className="bg-card border border-primary/20 shadow-md">
							<CardHeader>
								<CardTitle className="text-card-foreground">Vacinas</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
									<div>
										<Label className="text-card-foreground">Vacina</Label>
										<Select onValueChange={(value) => setVacinaSelecionada(value)} value={vacinaSelecionada}>
											<SelectTrigger className="bg-background border-input">
												<SelectValue placeholder="Selecione uma vacina" />
											</SelectTrigger>
											<SelectContent>
												{vacinasTabela.map((vacina) => (
													<SelectItem key={vacina.id} value={vacina.id}>
														{vacina.nome} ({vacina.doses} doses)
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label className="text-card-foreground">Dose Atual</Label>
										<Select onValueChange={(value) => setDoseAtual(Number(value))} value={doseAtual.toString()}>
											<SelectTrigger className="bg-background border-input">
												<SelectValue placeholder="Dose" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="1">1ª dose</SelectItem>
												<SelectItem value="2">2ª dose</SelectItem>
												<SelectItem value="3">3ª dose</SelectItem>
												<SelectItem value="4">Reforço</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label className="text-card-foreground">Data da Dose</Label>
										<Input
											type="date"
											value={dataDose}
											onChange={(e) => setDataDose(e.target.value)}
											className="bg-background border-input focus:border-primary focus:ring-primary"
										/>
									</div>
									<div className="flex items-end">
										<Button onClick={adicionarVacina} type="button" className="bg-primary hover:bg-primary/90 w-full">
											Aplicar Dose
										</Button>
									</div>
								</div>

								{/* Lista de vacinas aplicadas e programadas */}
								{vacinasAplicadas.length > 0 && (
									<div>
										<h3 className="text-lg font-semibold text-card-foreground mb-4">Vacinas e Próximas Doses</h3>
										<Table>
											<TableHeader>
												<TableRow className="border-border">
													<TableHead className="text-card-foreground">Vacina</TableHead>
													<TableHead className="text-card-foreground">Dose</TableHead>
													<TableHead className="text-card-foreground">Data Aplicação</TableHead>
													<TableHead className="text-card-foreground">Próxima Dose</TableHead>
													<TableHead className="text-card-foreground">Status</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{vacinasAplicadas.map((v, index) => (
													<TableRow key={index} className="border-border">
														<TableCell className="text-card-foreground">{v.nomeVacina}</TableCell>
														<TableCell className="text-card-foreground">{v.dose}ª dose</TableCell>
														<TableCell className="text-card-foreground">{v.dataAplicacao || '-'}</TableCell>
														<TableCell className="text-card-foreground">{v.proximaData || '-'}</TableCell>
														<TableCell className={v.proximaData ? 'text-amber-500' : 'text-emerald-500'}>
															{v.proximaData ? 'Programada' : 'Completa'}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Aba: Medicamentos (DEF) */}
					<TabsContent value="medicamentos">
						<Card className="bg-card border border-primary/20 shadow-md">
							<CardHeader>
								<div className="flex justify-between items-center">
									<CardTitle className="text-card-foreground">Medicamentos (DEF)</CardTitle>
									<Dialog open={isDEFDialogOpen} onOpenChange={setIsDEFDialogOpen}>
										<DialogTrigger asChild>
											<Button className="bg-accent hover:bg-accent/90">
												<Pill className="mr-2 h-4 w-4" />
												Consultar DEF
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-card border border-primary/20">
											<DialogHeader>
												<DialogTitle className="text-card-foreground">Dicionário de Especialidades Farmacêuticas</DialogTitle>
												<DialogDescription className="text-muted-foreground">
													Consulte medicamentos e calcule doses automaticamente
												</DialogDescription>
											</DialogHeader>

											<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
												{/* Coluna 1: Busca e lista */}
												<div className="lg:col-span-2 space-y-4">
													<div className="relative">
														<Input
															placeholder="Buscar medicamento..."
															value={selectedMedicamento?.nomeComercial || ''}
															onChange={(e) => {
																const term = e.target.value.toLowerCase();
																const found = medicamentos.find(m =>
																	m.nomeComercial.toLowerCase().includes(term) ||
																	m.nomeQuimico.toLowerCase().includes(term)
																);
																if (found) setSelectedMedicamento(found);
															}}
															className="bg-background border-input focus:border-primary focus:ring-primary"
														/>
													</div>

													<div className="border border-border rounded-lg p-4 max-h-[400px] overflow-y-auto bg-background">
														{medicamentos.length === 0 ? (
															<div className="text-center py-8 text-muted-foreground">
																Nenhum medicamento cadastrado
															</div>
														) : (
															<div className="space-y-2">
																{medicamentos.map(med => (
																	<Card
																		key={med.id}
																		className={`cursor-pointer hover:shadow-md transition-all duration-300 ${selectedMedicamento?.id === med.id ? 'border-primary bg-primary/5' : 'border-border'
																			}`}
																		onClick={() => setSelectedMedicamento(med)}
																	>
																		<CardContent className="p-4">
																			<div className="flex justify-between items-start">
																				<div>
																					<h4 className="font-semibold text-card-foreground">{med.nomeComercial}</h4>
																					<p className="text-sm text-muted-foreground">{med.nomeQuimico}</p>
																					<div className="flex flex-wrap gap-1 mt-2">
																						<Badge variant="secondary" className="text-xs">
																							{med.isVeterinario ? 'Veterinário' : 'Humano'}
																						</Badge>
																						{med.laboratorios.slice(0, 2).map((lab: string, idx: number) => (
																							<Badge key={idx} variant="outline" className="text-xs">
																								{lab}
																							</Badge>
																						))}
																					</div>
																				</div>
																				{med.atencao && (
																					<AlertTriangle className="h-4 w-4 text-amber-500" />
																				)}
																			</div>
																			<p className="text-sm mt-2 text-muted-foreground line-clamp-2">{med.indicacao}</p>
																		</CardContent>
																	</Card>
																))}
															</div>
														)}
													</div>
												</div>

												{/* Coluna 2: Detalhes e cálculo */}
												<div className="space-y-6">
													{selectedMedicamento ? (
														<>
															<div>
																<h3 className="font-semibold text-card-foreground mb-2">Detalhes do Medicamento</h3>
																<div className="space-y-3">
																	<div>
																		<Label className="text-card-foreground">Nome Comercial</Label>
																		<p className="font-medium text-card-foreground">{selectedMedicamento.nomeComercial}</p>
																	</div>
																	<div>
																		<Label className="text-card-foreground">Nome Químico</Label>
																		<p className="text-muted-foreground">{selectedMedicamento.nomeQuimico}</p>
																	</div>
																	<div>
																		<Label className="text-card-foreground">Apresentação</Label>
																		<p className="text-sm text-muted-foreground">{selectedMedicamento.apresentacao}</p>
																	</div>
																	<div>
																		<Label className="text-card-foreground">Posologia Geral</Label>
																		<p className="text-sm text-muted-foreground">{selectedMedicamento.posologia}</p>
																	</div>
																	{selectedMedicamento.atencao && (
																		<div className="bg-destructive/10 border border-destructive/20 rounded p-3">
																			<Label className="text-destructive">⚠️ Atenção</Label>
																			<p className="text-sm text-destructive">{selectedMedicamento.atencao}</p>
																		</div>
																	)}
																</div>
															</div>

															{/* Calculadora de doses */}
															<div className="border-t border-border pt-4">
																<h3 className="font-semibold text-card-foreground mb-3">Calculadora de Doses</h3>

																<div className="space-y-3">
																	<div>
																		<Label className="text-card-foreground">Peso do Animal</Label>
																		<p className="font-medium text-card-foreground">{formData.peso || 'Não informado'} kg</p>
																	</div>

																	<div>
																		<Label className="text-card-foreground">Espécie para cálculo</Label>
																		<p className="font-medium text-card-foreground">{formData.especie || 'Não informada'}</p>
																	</div>

																	<Button
																		onClick={calcularDose}
																		className="w-full gap-2 bg-primary hover:bg-primary/90"
																		disabled={!formData.peso || !formData.especie}
																	>
																		<Calculator className="h-4 w-4" />
																		Calcular Dose
																	</Button>

																	{doseCalculada !== null && (
																		<div className={`p-3 rounded ${doseCalculada === 0 ? 'bg-destructive/10 border border-destructive/20' : 'bg-emerald-100 border border-emerald-200'}`}>
																			<p className="font-semibold">
																				{doseCalculada === 0 ? (
																					<span className="text-destructive">⚠️ Contra-indicado</span>
																				) : (
																					<span className="text-emerald-700">
																						Dose calculada: <strong>{doseCalculada.toFixed(2)} {selectedMedicamento.especies[0]?.unidade || 'mg'}</strong>
																					</span>
																				)}
																			</p>
																		</div>
																	)}

																	<Button
																		onClick={() => {
																			adicionarMedicamentoPrescrito();
																			setIsDEFDialogOpen(false);
																		}}
																		disabled={!doseCalculada || doseCalculada === 0}
																		className="w-full bg-accent hover:bg-accent/90"
																	>
																		Adicionar à Prescrição
																	</Button>
																</div>
															</div>
														</>
													) : (
														<div className="text-center py-8 text-muted-foreground">
															Selecione um medicamento para ver os detalhes
														</div>
													)}
												</div>
											</div>
										</DialogContent>
									</Dialog>
								</div>
							</CardHeader>
							<CardContent>
								{/* Lista de medicamentos prescritos */}
								{medicamentosPrescritos.length > 0 ? (
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<h3 className="text-lg font-semibold text-card-foreground">Medicamentos Prescritos</h3>
											<span className="text-sm text-muted-foreground">
												{medicamentosPrescritos.length} medicamento(s)
											</span>
										</div>

										<Table>
											<TableHeader>
												<TableRow className="border-border">
													<TableHead className="text-card-foreground">Medicamento</TableHead>
													<TableHead className="text-card-foreground">Dose</TableHead>
													<TableHead className="text-card-foreground">Peso Animal</TableHead>
													<TableHead className="text-card-foreground">Espécie</TableHead>
													<TableHead className="text-card-foreground">Data</TableHead>
													<TableHead className="text-card-foreground">Ações</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{medicamentosPrescritos.map((med, index) => (
													<TableRow key={index} className="border-border">
														<TableCell>
															<div className="font-medium text-card-foreground">{med.medicamento.nomeComercial}</div>
															<div className="text-sm text-muted-foreground">{med.medicamento.nomeQuimico}</div>
														</TableCell>
														<TableCell className="text-card-foreground">
															{med.dose.toFixed(2)} {med.unidade}
														</TableCell>
														<TableCell className="text-card-foreground">{med.pesoAnimal} kg</TableCell>
														<TableCell className="text-card-foreground">{med.especieAnimal}</TableCell>
														<TableCell className="text-card-foreground">{med.data}</TableCell>
														<TableCell>
															<Button
																variant="ghost"
																size="sm"
																onClick={() => removerMedicamentoPrescrito(index)}
																className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								) : (
									<div className="text-center py-8">
										<Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
										<h3 className="text-lg font-semibold text-card-foreground mb-2">Nenhum medicamento prescrito</h3>
										<p className="text-muted-foreground">Consulte o DEF para adicionar medicamentos à prescrição</p>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Aba: Observações */}
					<TabsContent value="observacoes">
						<Card className="bg-card border border-primary/20 shadow-md">
							<CardHeader>
								<CardTitle className="text-card-foreground">Observações</CardTitle>
							</CardHeader>
							<CardContent>
								<Textarea
									name="observacoes"
									value={formData.observacoes}
									onChange={handleChange}
									rows={10}
									placeholder="Informações adicionais sobre o animal, histórico clínico, tratamentos anteriores, comportamento, etc..."
									className="bg-background border-input focus:border-primary focus:ring-primary"
								/>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Botões de ação */}
					<div className="flex justify-between items-center pt-6 border-t border-border">
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate('/fichas/lista')}
							className="border-border text-card-foreground hover:bg-muted"
						>
							Cancelar
						</Button>

						<div className="flex gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									toast({
										title: 'Em desenvolvimento',
										description: 'Função de impressão em breve disponível',
									});
								}}
								className="border-border text-card-foreground hover:bg-muted"
							>
								<FileText className="mr-2 h-4 w-4" />
								Imprimir Ficha
							</Button>

							<Button
								type="submit"
								disabled={loading}
								className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 px-12 text-lg"
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-6 w-6 animate-spin" />
										Atualizando...
									</>
								) : (
									'Salvar Alterações'
								)}
							</Button>
						</div>
					</div>
				</form>
			</Tabs>
		</div>
	);
};

export default EditarFicha;