import React, { useState, useEffect } from 'react';
import { Pill, Calculator, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { medicamentoService } from '@/services/medicamentoService';

interface DEFButtonProps {
	animalId?: string;
	animalPeso?: number;
	animalEspecie?: string;
	onMedicamentoSelecionado?: (medicamento: any, dose: number) => void;
}

export default function DEFButton({
	animalId,
	animalPeso,
	animalEspecie,
	onMedicamentoSelecionado
}: DEFButtonProps) {
	const [open, setOpen] = useState(false);
	const [medicamentos, setMedicamentos] = useState<any[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedMedicamento, setSelectedMedicamento] = useState<any>(null);
	const [doseCalculada, setDoseCalculada] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		if (open) {
			carregarMedicamentos();
		}
	}, [open]);

	const carregarMedicamentos = async () => {
		try {
			setLoading(true);
			const data = await medicamentoService.getAll();
			setMedicamentos(data);
		} catch (error) {
			toast({
				title: 'Erro',
				description: 'Não foi possível carregar os medicamentos',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	const filtrarMedicamentos = medicamentos.filter(med =>
		med.nomeComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
		med.nomeQuimico.toLowerCase().includes(searchTerm.toLowerCase()) ||
		med.indicacao.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const calcularDose = () => {
		if (!selectedMedicamento || !animalPeso) {
			toast({
				title: 'Atenção',
				description: 'Selecione um medicamento e informe o peso do animal',
				variant: 'destructive',
			});
			return;
		}

		// Encontrar dosagem para a espécie do animal
		const especieDosagem = selectedMedicamento.especies.find((e: any) =>
			e.descricao.toLowerCase().includes(animalEspecie?.toLowerCase() || '') ||
			e.codigo === animalEspecie
		);

		if (!especieDosagem) {
			toast({
				title: 'Atenção',
				description: `Dose não definida para ${animalEspecie || 'esta espécie'}`,
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

		const dose = animalPeso * especieDosagem.dosePorKg;
		setDoseCalculada(dose);

		// Registrar uso
		if (selectedMedicamento.id) {
			medicamentoService.incrementarUso(selectedMedicamento.id);
		}
	};

	const handleSelecionar = () => {
		if (selectedMedicamento && doseCalculada !== null && doseCalculada > 0) {
			onMedicamentoSelecionado?.(selectedMedicamento, doseCalculada);
			setOpen(false);
			toast({
				title: 'Medicamento selecionado',
				description: `${selectedMedicamento.nomeComercial} - Dose: ${doseCalculada.toFixed(2)} ${selectedMedicamento.especies[0]?.unidade || 'mg'}`,
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2">
					<Pill className="h-4 w-4" />
					Consultar DEF
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Dicionário de Especialidades Farmacêuticas</DialogTitle>
				</DialogHeader>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Coluna 1: Busca e lista */}
					<div className="lg:col-span-2 space-y-4">
						<div className="relative">
							<Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Buscar por nome comercial, químico ou indicação..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>

						<div className="border rounded-lg p-4 max-h-[400px] overflow-y-auto">
							{loading ? (
								<div className="text-center py-8">Carregando medicamentos...</div>
							) : filtrarMedicamentos.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									Nenhum medicamento encontrado
								</div>
							) : (
								<div className="space-y-2">
									{filtrarMedicamentos.map(med => (
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
															{med.laboratorios.map((lab: string, idx: number) => (
																<Badge key={idx} variant="secondary" className="text-xs">
																	{lab}
																</Badge>
															))}
														</div>
													</div>
													<Badge variant={med.isVeterinario ? "default" : "outline"}>
														{med.isVeterinario ? 'Veterinário' : 'Humano'}
													</Badge>
												</div>
												<p className="text-sm mt-2 text-gray-700">{med.indicacao}</p>
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
											<Label>Posologia</Label>
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
										{animalPeso && (
											<div>
												<Label>Peso do Animal</Label>
												<p className="font-medium">{animalPeso} kg</p>
											</div>
										)}

										<div>
											<Label>Espécie para cálculo</Label>
											<Select>
												<SelectTrigger>
													<SelectValue placeholder="Selecione a espécie" />
												</SelectTrigger>
												<SelectContent>
													{selectedMedicamento.especies.map((esp: any, idx: number) => (
														<SelectItem key={idx} value={esp.codigo}>
															{esp.descricao} ({esp.dosePorKg} {esp.unidade}/kg)
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<Button onClick={calcularDose} className="w-full gap-2">
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
															Dose calculada: <strong>{doseCalculada.toFixed(2)} mg</strong>
														</span>
													)}
												</p>
											</div>
										)}

										<Button
											onClick={handleSelecionar}
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
	);
}