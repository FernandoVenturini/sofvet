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
			alert('Imagem atualizada com sucesso!');
		} catch (error) {
			console.error('Erro no upload da imagem:', error);
			alert('Erro ao atualizar a imagem.');
		} finally {
			setUploadingImage(false);
		}
	};

	// Função corrigida para programação automática
	const adicionarVacina = () => {
		if (!vacinaSelecionada || !dataDose) {
			alert('Selecione a vacina e a data da dose');
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
		alert('Dose aplicada e próximas programadas com sucesso!');
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
		return <div className="text-white text-center py-20">Carregando ficha...</div>;
	}

	return (
		<div className="max-w-6xl mx-auto py-8 px-4">
			<h1 className="text-4xl font-bold text-white text-center mb-10">Editar Ficha</h1>

			<Tabs defaultValue="dados" className="space-y-6">
				<TabsList className="grid grid-cols-4 w-full max-w-xl mx-auto">
					<TabsTrigger value="dados">Dados</TabsTrigger>
					<TabsTrigger value="vacinas">Vacinas</TabsTrigger>
					<TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
					<TabsTrigger value="observacoes">Observações</TabsTrigger>
				</TabsList>

				<form onSubmit={handleSubmit}>
					{/* Aba: Dados do Animal e Proprietário */}
					<TabsContent value="dados" className="space-y-6">
						{/* Foto do Animal */}
						<Card className="bg-black/50 border-red-600/30">
							<CardHeader>
								<CardTitle className="text-white">Foto do Animal</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col items-center space-y-4">
								{imagemUrl ? (
									<img src={imagemUrl} alt="Animal" className="h-64 w-64 object-cover rounded-lg" />
								) : (
									<div className="h-64 w-64 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
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
						<Card className="bg-black/50 border-red-600/30">
							<CardHeader>
								<CardTitle className="text-white">Dados do Animal</CardTitle>
							</CardHeader>
							<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<Label className="text-white">Nome do Animal *</Label>
									<Input
										name="nomeAnimal"
										value={formData.nomeAnimal}
										onChange={handleChange}
										required
										className="bg-black/50 border-red-600/50 text-white"
									/>
								</div>

								<div className="space-y-2">
									<Label className="text-white">Espécie</Label>
									<Select onValueChange={handleSelectChange('especie')} value={formData.especie}>
										<SelectTrigger className="bg-black/50 border-red-600/50 text-white">
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
									<Label className="text-white">Raça</Label>
									<Input
										name="raca"
										value={formData.raca}
										onChange={handleChange}
										className="bg-black/50 border-red-600/50 text-white"
									/>
								</div>

								<div className="space-y-2">
									<Label className="text-white">Pelagem</Label>
									<Input
										name="pelagem"
										value={formData.pelagem}
										onChange={handleChange}
										className="bg-black/50 border-red-600/50 text-white"
									/>
								</div>

								<div className="space-y-2">
									<Label className="text-white">Sexo</Label>
									<Select onValueChange={handleSelectChange('sexo')} value={formData.sexo}>
										<SelectTrigger className="bg-black/50 border-red-600/50 text-white">
											<SelectValue placeholder="Selecione" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="macho">Macho</SelectItem>
											<SelectItem value="femea">Fêmea</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label className="text-white">Data de Nascimento</Label>
									<Input
										type="date"
										name="dataNascimento"
										value={formData.dataNascimento}
										onChange={handleChange}
										className="bg-black/50 border-red-600/50 text-white"
									/>
								</div>

								<div className="space-y-2">
									<Label className="text-white">Cor</Label>
									<Input
										name="cor"
										value={formData.cor}
										onChange={handleChange}
										className="bg-black/50 border-red-600/50 text-white"
									/>
								</div>

								<div className="space-y-2">
									<Label className="text-white">Peso (kg) *</Label>
									<Input
										name="peso"
										type="number"
										step="0.1"
										value={formData.peso}
										onChange={handleChange}
										required
										className="bg-black/50 border-red-600/50 text-white"
										placeholder="Ex: 5.5"
									/>
								</div>
							</CardContent>
						</Card>

						{/* Dados do Proprietário */}
						<Card className="bg-black/50 border-red-600/30">
							<CardHeader>
								<CardTitle className="text-white">Dados do Proprietário</CardTitle>
							</CardHeader>
							<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<Label className="text-white">Nome *</Label>
									<Input
										name="nomeProprietario"
										value={formData.nomeProprietario}
										onChange={handleChange}
										required
										className="bg-black/50 border-red-600/50 text-white"
									/>
								</div>

								<div className="space-y-2">
									<Label className="text-white">Telefone</Label>
									<Input
										name="telefoneProprietario"
										value={formData.telefoneProprietario}
										onChange={handleChange}
										className="bg-black/50 border-red-600/50 text-white"
									/>
								</div>

								<div className="md:col-span-2 space-y-2">
									<Label className="text-white">Endereço</Label>
									<Textarea
										name="enderecoProprietario"
										value={formData.enderecoProprietario}
										onChange={handleChange}
										rows={3}
										className="bg-black/50 border-red-600/50 text-white"
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Aba: Vacinas */}
					<TabsContent value="vacinas">
						<Card className="bg-black/50 border-red-600/30">
							<CardHeader>
								<CardTitle className="text-white">Vacinas</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
									<div>
										<Label className="text-white">Vacina</Label>
										<Select onValueChange={(value) => setVacinaSelecionada(value)} value={vacinaSelecionada}>
											<SelectTrigger className="bg-black/50 border-red-600/50 text-white">
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
										<Label className="text-white">Dose Atual</Label>
										<Select onValueChange={(value) => setDoseAtual(Number(value))} value={doseAtual.toString()}>
											<SelectTrigger className="bg-black/50 border-red-600/50 text-white">
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
										<Label className="text-white">Data da Dose</Label>
										<Input
											type="date"
											value={dataDose}
											onChange={(e) => setDataDose(e.target.value)}
											className="bg-black/50 border-red-600/50 text-white"
										/>
									</div>
									<div className="flex items-end">
										<Button onClick={adicionarVacina} type="button" className="bg-red-600 hover:bg-red-700 w-full">
											Aplicar Dose
										</Button>
									</div>
								</div>

								{/* Lista de vacinas aplicadas e programadas */}
								{vacinasAplicadas.length > 0 && (
									<div>
										<h3 className="text-lg font-semibold text-white mb-4">Vacinas e Próximas Doses</h3>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="text-white">Vacina</TableHead>
													<TableHead className="text-white">Dose</TableHead>
													<TableHead className="text-white">Data Aplicação</TableHead>
													<TableHead className="text-white">Próxima Dose</TableHead>
													<TableHead className="text-white">Status</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{vacinasAplicadas.map((v, index) => (
													<TableRow key={index}>
														<TableCell className="text-white">{v.nomeVacina}</TableCell>
														<TableCell className="text-white">{v.dose}ª dose</TableCell>
														<TableCell className="text-white">{v.dataAplicacao || '-'}</TableCell>
														<TableCell className="text-white">{v.proximaData || '-'}</TableCell>
														<TableCell className={v.proximaData ? 'text-yellow-400' : 'text-green-400'}>
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
						<Card className="bg-black/50 border-red-600/30">
							<CardHeader>
								<div className="flex justify-between items-center">
									<CardTitle className="text-white">Medicamentos (DEF)</CardTitle>
									<Dialog open={isDEFDialogOpen} onOpenChange={setIsDEFDialogOpen}>
										<DialogTrigger asChild>
											<Button className="bg-blue-600 hover:bg-blue-700">
												<Pill className="mr-2 h-4 w-4" />
												Consultar DEF
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
											<DialogHeader>
												<DialogTitle>Dicionário de Especialidades Farmacêuticas</DialogTitle>
												<DialogDescription>
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
														/>
													</div>

													<div className="border rounded-lg p-4 max-h-[400px] overflow-y-auto">
														{medicamentos.length === 0 ? (
															<div className="text-center py-8 text-gray-500">
																Nenhum medicamento cadastrado
															</div>
														) : (
															<div className="space-y-2">
																{medicamentos.map(med => (
																	<Card
																		key={med.id}
																		className={`cursor-pointer hover:bg-gray-50 transition-colors ${selectedMedicamento?.id === med.id ? 'bg-blue-50 border-blue-200' : ''
																			}`}
																		onClick={() => setSelectedMedicamento(med)}
																	>
																		<CardContent className="p-4">
																			<div className="flex justify-between items-start">
																				<div>
																					<h4 className="font-semibold">{med.nomeComercial}</h4>
																					<p className="text-sm text-gray-600">{med.nomeQuimico}</p>
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
																			<p className="text-sm mt-2 text-gray-700 line-clamp-2">{med.indicacao}</p>
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
																<h3 className="font-semibold mb-2">Detalhes do Medicamento</h3>
																<div className="space-y-3">
																	<div>
																		<Label>Nome Comercial</Label>
																		<p className="font-medium">{selectedMedicamento.nomeComercial}</p>
																	</div>
																	<div>
																		<Label>Nome Químico</Label>
																		<p>{selectedMedicamento.nomeQuimico}</p>
																	</div>
																	<div>
																		<Label>Apresentação</Label>
																		<p className="text-sm">{selectedMedicamento.apresentacao}</p>
																	</div>
																	<div>
																		<Label>Posologia Geral</Label>
																		<p className="text-sm">{selectedMedicamento.posologia}</p>
																	</div>
																	{selectedMedicamento.atencao && (
																		<div className="bg-red-50 border border-red-200 rounded p-3">
																			<Label className="text-red-700">⚠️ Atenção</Label>
																			<p className="text-sm text-red-700">{selectedMedicamento.atencao}</p>
																		</div>
																	)}
																</div>
															</div>

															{/* Calculadora de doses */}
															<div className="border-t pt-4">
																<h3 className="font-semibold mb-3">Calculadora de Doses</h3>

																<div className="space-y-3">
																	<div>
																		<Label>Peso do Animal</Label>
																		<p className="font-medium">{formData.peso || 'Não informado'} kg</p>
																	</div>

																	<div>
																		<Label>Espécie para cálculo</Label>
																		<p className="font-medium">{formData.especie || 'Não informada'}</p>
																	</div>

																	<Button
																		onClick={calcularDose}
																		className="w-full gap-2"
																		disabled={!formData.peso || !formData.especie}
																	>
																		<Calculator className="h-4 w-4" />
																		Calcular Dose
																	</Button>

																	{doseCalculada !== null && (
																		<div className={`p-3 rounded ${doseCalculada === 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
																			<p className="font-semibold">
																				{doseCalculada === 0 ? (
																					<span className="text-red-600">⚠️ Contra-indicado</span>
																				) : (
																					<span className="text-green-700">
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
																		className="w-full"
																	>
																		Adicionar à Prescrição
																	</Button>
																</div>
															</div>
														</>
													) : (
														<div className="text-center py-8 text-gray-500">
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
											<h3 className="text-lg font-semibold text-white">Medicamentos Prescritos</h3>
											<span className="text-sm text-gray-400">
												{medicamentosPrescritos.length} medicamento(s)
											</span>
										</div>

										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="text-white">Medicamento</TableHead>
													<TableHead className="text-white">Dose</TableHead>
													<TableHead className="text-white">Peso Animal</TableHead>
													<TableHead className="text-white">Espécie</TableHead>
													<TableHead className="text-white">Data</TableHead>
													<TableHead className="text-white">Ações</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{medicamentosPrescritos.map((med, index) => (
													<TableRow key={index}>
														<TableCell>
															<div className="font-medium text-white">{med.medicamento.nomeComercial}</div>
															<div className="text-sm text-gray-400">{med.medicamento.nomeQuimico}</div>
														</TableCell>
														<TableCell className="text-white">
															{med.dose.toFixed(2)} {med.unidade}
														</TableCell>
														<TableCell className="text-white">{med.pesoAnimal} kg</TableCell>
														<TableCell className="text-white">{med.especieAnimal}</TableCell>
														<TableCell className="text-white">{med.data}</TableCell>
														<TableCell>
															<Button
																variant="ghost"
																size="sm"
																onClick={() => removerMedicamentoPrescrito(index)}
																className="text-red-400 hover:text-red-300"
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
										<Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
										<h3 className="text-lg font-semibold text-white mb-2">Nenhum medicamento prescrito</h3>
										<p className="text-gray-400">Consulte o DEF para adicionar medicamentos à prescrição</p>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Aba: Observações */}
					<TabsContent value="observacoes">
						<Card className="bg-black/50 border-red-600/30">
							<CardHeader>
								<CardTitle className="text-white">Observações</CardTitle>
							</CardHeader>
							<CardContent>
								<Textarea
									name="observacoes"
									value={formData.observacoes}
									onChange={handleChange}
									rows={10}
									placeholder="Informações adicionais sobre o animal, histórico clínico, tratamentos anteriores, comportamento, etc..."
									className="bg-black/50 border-red-600/50 text-white"
								/>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Botões de ação */}
					<div className="flex justify-between items-center pt-6 border-t border-gray-800">
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate('/fichas/lista')}
							className="text-white border-gray-600 hover:bg-gray-800"
						>
							Cancelar
						</Button>

						<div className="flex gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									// Gerar relatório/atestado (opcional)
									alert('Função de impressão em desenvolvimento');
								}}
								className="text-white border-gray-600 hover:bg-gray-800"
							>
								<FileText className="mr-2 h-4 w-4" />
								Imprimir Ficha
							</Button>

							<Button
								type="submit"
								disabled={loading}
								className="bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-12 text-lg"
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