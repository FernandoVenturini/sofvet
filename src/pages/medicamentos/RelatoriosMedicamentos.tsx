import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Filter, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { medicamentoService } from '@/services/medicamentoService';

export default function RelatoriosMedicamentos() {
	const [periodo, setPeriodo] = useState('30'); // últimos 30 dias
	const [medicamentosMaisUsados, setMedicamentosMaisUsados] = useState<any[]>([]);
	const [relatorioUso, setRelatorioUso] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		carregarRelatorios();
	}, [periodo]);

	const carregarRelatorios = async () => {
		try {
			setLoading(true);

			// Calcula datas
			const fim = new Date();
			const inicio = new Date();
			inicio.setDate(inicio.getDate() - parseInt(periodo));

			// Carrega mais usados
			const maisUsados = await medicamentoService.getMedicamentosMaisUsados(20);
			setMedicamentosMaisUsados(maisUsados);

			// Carrega relatório por período
			const relatorio = await medicamentoService.getRelatorioUso(inicio, fim);
			setRelatorioUso(relatorio);
		} catch (error) {
			console.error('Erro ao carregar relatórios:', error);
		} finally {
			setLoading(false);
		}
	};

	const getEstatisticas = () => {
		const totalUsos = medicamentosMaisUsados.reduce((sum, med) => sum + med.uso, 0);
		const medicamentosVeterinarios = medicamentosMaisUsados.filter(med => med.tipo === 'Veterinário').length;
		const medicamentosHumanos = medicamentosMaisUsados.filter(med => med.tipo === 'Humano').length;

		return {
			totalUsos,
			medicamentosVeterinarios,
			medicamentosHumanos,
			mediaUsos: totalUsos > 0 ? (totalUsos / medicamentosMaisUsados.length).toFixed(1) : 0,
		};
	};

	const estatisticas = getEstatisticas();

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">Relatórios de Medicamentos</h1>

			{/* Filtros */}
			<Card className="mb-6">
				<CardContent className="pt-6">
					<div className="flex flex-col md:flex-row gap-4 items-end">
						<div>
							<Label>Período</Label>
							<Select value={periodo} onValueChange={setPeriodo}>
								<SelectTrigger className="w-[180px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="7">Últimos 7 dias</SelectItem>
									<SelectItem value="30">Últimos 30 dias</SelectItem>
									<SelectItem value="90">Últimos 90 dias</SelectItem>
									<SelectItem value="180">Últimos 6 meses</SelectItem>
									<SelectItem value="365">Último ano</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex-1">
							<Label>Data específica (opcional)</Label>
							<div className="flex gap-2">
								<Input type="date" placeholder="De" />
								<Input type="date" placeholder="Até" />
							</div>
						</div>
						<Button onClick={carregarRelatorios} className="gap-2">
							<Filter className="h-4 w-4" />
							Aplicar Filtros
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Estatísticas */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<Card>
					<CardContent className="pt-6">
						<div className="text-center">
							<div className="text-3xl font-bold text-blue-600">
								{estatisticas.totalUsos}
							</div>
							<p className="text-sm text-gray-600">Total de Usos</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="text-center">
							<div className="text-3xl font-bold text-green-600">
								{estatisticas.medicamentosVeterinarios}
							</div>
							<p className="text-sm text-gray-600">Med. Veterinários</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="text-center">
							<div className="text-3xl font-bold text-purple-600">
								{estatisticas.medicamentosHumanos}
							</div>
							<p className="text-sm text-gray-600">Med. Humanos</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="text-center">
							<div className="text-3xl font-bold text-orange-600">
								{estatisticas.mediaUsos}
							</div>
							<p className="text-sm text-gray-600">Média de Usos</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Tabela de medicamentos mais usados */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						Medicamentos Mais Utilizados
					</CardTitle>
					<CardDescription>
						Ranking dos medicamentos mais prescritos
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Posição</TableHead>
								<TableHead>Medicamento</TableHead>
								<TableHead>Tipo</TableHead>
								<TableHead>Total de Usos</TableHead>
								<TableHead>Frequência</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center py-8">
										<Loader2 className="h-6 w-6 animate-spin mx-auto" />
									</TableCell>
								</TableRow>
							) : medicamentosMaisUsados.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center py-8 text-gray-500">
										Nenhum dado disponível
									</TableCell>
								</TableRow>
							) : (
								medicamentosMaisUsados.map((med, index) => (
									<TableRow key={med.id}>
										<TableCell>
											<div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-100 text-yellow-800' :
													index === 1 ? 'bg-gray-100 text-gray-800' :
														index === 2 ? 'bg-orange-100 text-orange-800' :
															'bg-blue-50 text-blue-800'
												}`}>
												{index + 1}
											</div>
										</TableCell>
										<TableCell className="font-medium">{med.nome}</TableCell>
										<TableCell>
											<Badge variant={med.tipo === 'Veterinário' ? 'default' : 'outline'}>
												{med.tipo}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="flex items-center">
												<div className="w-full bg-gray-200 rounded-full h-2.5">
													<div
														className="bg-blue-600 h-2.5 rounded-full"
														style={{ width: `${(med.uso / estatisticas.totalUsos) * 100}%` }}
													></div>
												</div>
												<span className="ml-2">{med.uso}</span>
											</div>
										</TableCell>
										<TableCell>
											{((med.uso / estatisticas.totalUsos) * 100).toFixed(1)}%
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Relatório por período */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Relatório por Período
					</CardTitle>
					<CardDescription>
						Uso de medicamentos no período selecionado
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Medicamento</TableHead>
								<TableHead>Tipo</TableHead>
								<TableHead>Usos no Período</TableHead>
								<TableHead>Último Uso</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{relatorioUso.length === 0 ? (
								<TableRow>
									<TableCell colSpan={4} className="text-center py-8 text-gray-500">
										Nenhum uso registrado no período
									</TableCell>
								</TableRow>
							) : (
								relatorioUso.map((item, index) => (
									<TableRow key={index}>
										<TableCell className="font-medium">{item.nome}</TableCell>
										<TableCell>
											<Badge variant={item.tipo === 'Veterinário' ? 'default' : 'outline'}>
												{item.tipo}
											</Badge>
										</TableCell>
										<TableCell>{item.uso}</TableCell>
										<TableCell>
											{item.ultimoUso ? new Date(item.ultimoUso).toLocaleDateString('pt-BR') : 'N/A'}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}