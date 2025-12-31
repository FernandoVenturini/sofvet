import React, { useState, useEffect } from 'react';
import { Save, Upload, Download, History, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { medicamentoService } from '@/services/medicamentoService';

export default function BackupMedicamentos() {
	const [backups, setBackups] = useState<any[]>([]);
	const [descricaoBackup, setDescricaoBackup] = useState('');
	const [loading, setLoading] = useState(false);
	const [jsonData, setJsonData] = useState('');
	const { toast } = useToast();

	useEffect(() => {
		carregarBackups();
	}, []);

	const carregarBackups = async () => {
		try {
			const data = await medicamentoService.listarBackups();
			setBackups(data);
		} catch (error) {
			console.error('Erro ao carregar backups:', error);
		}
	};

	const handleCriarBackup = async () => {
		if (!descricaoBackup.trim()) {
			toast({
				title: 'Atenção',
				description: 'Informe uma descrição para o backup',
				variant: 'destructive',
			});
			return;
		}

		try {
			setLoading(true);
			await medicamentoService.criarBackup(descricaoBackup);
			await carregarBackups();
			setDescricaoBackup('');
			toast({
				title: 'Sucesso',
				description: 'Backup criado com sucesso',
			});
		} catch (error) {
			toast({
				title: 'Erro',
				description: 'Não foi possível criar o backup',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleRestaurarBackup = async (backupId: string) => {
		if (!confirm('Tem certeza que deseja restaurar este backup? Esta ação substituirá todos os medicamentos atuais.')) {
			return;
		}

		try {
			setLoading(true);
			await medicamentoService.restaurarBackup(backupId);
			toast({
				title: 'Sucesso',
				description: 'Backup restaurado com sucesso',
			});
		} catch (error) {
			toast({
				title: 'Erro',
				description: 'Não foi possível restaurar o backup',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleExportarJSON = async () => {
		try {
			const data = await medicamentoService.exportarParaJSON();
			const blob = new Blob([data], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `backup_medicamentos_${new Date().toISOString().split('T')[0]}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (error) {
			toast({
				title: 'Erro',
				description: 'Não foi possível exportar',
				variant: 'destructive',
			});
		}
	};

	const handleImportarJSON = async () => {
		if (!jsonData.trim()) {
			toast({
				title: 'Atenção',
				description: 'Cole o conteúdo JSON para importar',
				variant: 'destructive',
			});
			return;
		}

		if (!confirm('Esta ação adicionará os medicamentos do arquivo. Continuar?')) {
			return;
		}

		try {
			setLoading(true);
			await medicamentoService.importarDeJSON(jsonData);
			setJsonData('');
			toast({
				title: 'Sucesso',
				description: 'Medicamentos importados com sucesso',
			});
		} catch (error) {
			toast({
				title: 'Erro',
				description: 'Não foi possível importar o arquivo',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">Backup e Restauração - Medicamentos</h1>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Criar Backup */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Save className="h-5 w-5" />
							Criar Backup
						</CardTitle>
						<CardDescription>
							Crie um ponto de restauração dos medicamentos
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label htmlFor="descricao">Descrição do Backup</Label>
							<Input
								id="descricao"
								placeholder="Ex: Backup mensal, Pré-atualização, etc."
								value={descricaoBackup}
								onChange={(e) => setDescricaoBackup(e.target.value)}
							/>
						</div>
						<Button
							onClick={handleCriarBackup}
							disabled={loading || !descricaoBackup.trim()}
							className="w-full"
						>
							Criar Backup Agora
						</Button>
					</CardContent>
				</Card>

				{/* Exportar/Importar JSON */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Download className="h-5 w-5" />
							Exportar/Importar JSON
						</CardTitle>
						<CardDescription>
							Backup manual em formato JSON
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Button onClick={handleExportarJSON} className="w-full gap-2">
							<Download className="h-4 w-4" />
							Exportar para JSON
						</Button>

						<Dialog>
							<DialogTrigger asChild>
								<Button variant="outline" className="w-full gap-2">
									<Upload className="h-4 w-4" />
									Importar de JSON
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Importar Medicamentos</DialogTitle>
									<DialogDescription>
										Cole o conteúdo do arquivo JSON
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4">
									<Label>Conteúdo JSON</Label>
									<textarea
										className="w-full h-64 p-3 border rounded font-mono text-sm"
										value={jsonData}
										onChange={(e) => setJsonData(e.target.value)}
										placeholder="Cole o conteúdo do arquivo JSON aqui..."
									/>
									<Button onClick={handleImportarJSON} disabled={loading}>
										Importar
									</Button>
								</div>
							</DialogContent>
						</Dialog>
					</CardContent>
				</Card>
			</div>

			{/* Lista de Backups */}
			<Card className="mt-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<History className="h-5 w-5" />
						Histórico de Backups
					</CardTitle>
					<CardDescription>
						Backups automáticos criados pelo sistema
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Data</TableHead>
								<TableHead>Descrição</TableHead>
								<TableHead>Registros</TableHead>
								<TableHead className="text-right">Ações</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{backups.length === 0 ? (
								<TableRow>
									<TableCell colSpan={4} className="text-center py-8 text-gray-500">
										Nenhum backup encontrado
									</TableCell>
								</TableRow>
							) : (
								backups.map(backup => (
									<TableRow key={backup.id}>
										<TableCell>
											{new Date(backup.dataBackup).toLocaleDateString('pt-BR')}
											<br />
											<span className="text-sm text-gray-500">
												{new Date(backup.dataBackup).toLocaleTimeString('pt-BR')}
											</span>
										</TableCell>
										<TableCell>{backup.descricao || 'Sem descrição'}</TableCell>
										<TableCell>{backup.totalRegistros || 0}</TableCell>
										<TableCell className="text-right">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleRestaurarBackup(backup.id)}
											>
												Restaurar
											</Button>
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