'use client';

import React, { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
	HelpCircle,
	BookOpen,
	Phone,
	Mail,
	MessageSquare,
	Download,
	RefreshCw,
	AlertTriangle,
	CheckCircle,
	Info,
	FileText,
	Video,
	Settings,
	User,
	Shield,
	Database,
	Globe,
	Clock,
	Award,
	Users,
	LifeBuoy,
	Sparkles,
	Search,
	Eye,
	ExternalLink,
	ChevronRight,
	Home,
	MapPin,
	Tag,
	Zap,
	Activity,
	TrendingUp,
	BarChart3,
	Bell,
	Cpu,
	HardDrive,
	Network,
	FileBarChart,
	Calendar,
	ThumbsUp,
	ThumbsDown,
	Plus,
	Minus,
	X,
	Check,
	Brain,
	Heart,
	Thermometer,
	Stethoscope,
	Syringe,
	Scissors
} from 'lucide-react';

export default function Ajuda() {
	const [contactForm, setContactForm] = useState({
		nome: '',
		email: '',
		telefone: '',
		assunto: '',
		mensagem: ''
	});
	const [searchTerm, setSearchTerm] = useState('');
	const [activeCategory, setActiveCategory] = useState('todos');

	const handleSubmitContact = () => {
		if (!contactForm.nome || !contactForm.email || !contactForm.mensagem) {
			toast.error('Preencha todos os campos obrigatórios', {
				icon: <AlertTriangle className="h-5 w-5 text-red-400" />
			});
			return;
		}

		toast.success('Mensagem enviada com sucesso!', {
			description: 'Nossa equipe entrará em contato em breve.',
			icon: <CheckCircle className="h-5 w-5 text-emerald-400" />
		});

		setContactForm({
			nome: '',
			email: '',
			telefone: '',
			assunto: '',
			mensagem: ''
		});
	};

	const faqItems = [
		{
			question: 'Como fazer backup do sistema?',
			answer: 'Acesse Diversos → Backup Diário. Para versões Windows 10 ou superior, copie a pasta SOFVETW para um pendrive. Para Windows 98 ou inferior, use a rotina interna de backup.',
			category: 'backup',
			views: 1248,
			helpful: 95
		},
		{
			question: 'Como cadastrar uma nova vacina?',
			answer: 'Vá para Tabelas → Vacinas. Clique no botão de adicionar (+) e preencha: nome da vacina, número de doses e periodicidade. Use pelo menos 2 doses para vacinas anuais.',
			category: 'tabelas',
			views: 892,
			helpful: 87
		},
		{
			question: 'Como emitir um atestado de saúde?',
			answer: 'Na ficha do animal, clique na aba "Impressos" e selecione "Atestado de Saúde". Os dados do animal serão preenchidos automaticamente.',
			category: 'impressos',
			views: 745,
			helpful: 92
		},
		{
			question: 'O que fazer se aparecer "VOCÊ PRECISA INSTALAR OS FONTES"?',
			answer: 'Acesse o menu Iniciar → Configurações → Painel de Controle → Fontes → Arquivo → Instalar Fontes Novas. Selecione a pasta SOFVETW e instale as fontes FOXFONT, FOXPRINT e 3OF9.',
			category: 'problemas',
			views: 2103,
			helpful: 98
		},
		{
			question: 'Como trabalhar em rede com o SofVet?',
			answer: '1. Compartilhe a pasta SOFVET no servidor. 2. Nos terminais, instale apenas as fontes. 3. Mapeie a unidade de rede. 4. Crie um atalho para SOFVETW.EXE na pasta compartilhada.',
			category: 'rede',
			views: 567,
			helpful: 84
		},
		{
			question: 'Como calcular dose de medicamento no DEF?',
			answer: 'Na ficha do animal, clique no ícone do DEF. Cadastre primeiro o peso do animal. Clique em "Dosagem" para calcular automaticamente baseado no peso e espécie.',
			category: 'def',
			views: 432,
			helpful: 91
		},
		{
			question: 'Como enviar mensagens para outros usuários?',
			answer: 'Acesse Diversos → Mensagens. Clique em "Enviar Mensagem", selecione o destinatário (ou "Todos") e escreva sua mensagem.',
			category: 'mensagens',
			views: 321,
			helpful: 79
		},
		{
			question: 'O que é o ponteiro de última mensagem lida?',
			answer: 'É um controle que mostra qual foi a última mensagem que você leu. Útil para não perder mensagens importantes.',
			category: 'mensagens',
			views: 298,
			helpful: 76
		}
	];

	const commonProblems = [
		{
			problema: 'Não consigo utilizar o SOFVET em rede!',
			solucao: 'Verifique se o HD do servidor está compartilhado e se a pasta SOFVETW tem permissão completa. Nos terminais, instale apenas as fontes e mapeie a unidade de rede.',
			gravidade: 'alta',
			ocorrencias: 45
		},
		{
			problema: 'Quando entro no SOFVET, aparece: "O SUPERVISOR BLOQUEOU SUA ENTRADA"',
			solucao: 'Apague o arquivo DISABLE.SYS na pasta SOFVETW. Este arquivo é criado durante o backup e às vezes não é removido automaticamente.',
			gravidade: 'media',
			ocorrencias: 32
		},
		{
			problema: 'Erro de biblioteca na Agenda',
			solucao: 'Execute como administrador: C:\\SOFVETW\\REGSVR32.EXE MSCAL.OCX /U /S e depois C:\\SOFVETW\\REGSVR32.EXE MSCAL.OCX /S',
			gravidade: 'baixa',
			ocorrencias: 18
		},
		{
			problema: 'Perdi todos os dados. O que fazer?',
			solucao: 'Se você faz backup regularmente, reinstale o SOFVET e restaure o último backup. Caso contrário, entre em contato com o suporte técnico.',
			gravidade: 'alta',
			ocorrencias: 12
		},
		{
			problema: 'Impressão de etiquetas fora do alinhamento',
			solucao: 'Ajuste as configurações de cabeçalho e tabulação em Diversos → Configurações → Impressão. Faça uma impressão de teste após cada ajuste.',
			gravidade: 'baixa',
			ocorrencias: 67
		}
	];

	const updates = [
		{
			version: '2.0.0',
			date: '01/01/2024',
			changes: ['Versão inicial do SofVet', 'Interface moderna', 'Todas funcionalidades do SofVet'],
			type: 'major'
		},
		{
			version: '1.9.5',
			date: '15/12/2023',
			changes: ['Correção de bugs no movimento', 'Melhorias no backup'],
			type: 'patch'
		},
		{
			version: '1.9.0',
			date: '01/12/2023',
			changes: ['Novo módulo de mensagens', 'Utilitários adicionados'],
			type: 'minor'
		},
		{
			version: '1.8.0',
			date: '15/11/2023',
			changes: ['Sistema de backup automático', 'Exportação para Excel'],
			type: 'minor'
		},
	];

	const categories = [
		{ id: 'todos', label: 'Todos', color: 'from-gray-600/20 to-gray-700/20', textColor: 'text-gray-400' },
		{ id: 'backup', label: 'Backup', color: 'from-blue-600/20 to-cyan-600/20', textColor: 'text-blue-400' },
		{ id: 'tabelas', label: 'Tabelas', color: 'from-emerald-600/20 to-green-600/20', textColor: 'text-emerald-400' },
		{ id: 'problemas', label: 'Problemas', color: 'from-red-600/20 to-pink-600/20', textColor: 'text-red-400' },
		{ id: 'mensagens', label: 'Mensagens', color: 'from-purple-600/20 to-pink-600/20', textColor: 'text-purple-400' },
		{ id: 'def', label: 'DEF', color: 'from-amber-600/20 to-orange-600/20', textColor: 'text-amber-400' },
	];

	const filteredFaq = faqItems.filter(item => {
		const searchMatch = searchTerm ?
			item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.answer.toLowerCase().includes(searchTerm.toLowerCase()) : true;

		const categoryMatch = activeCategory === 'todos' || item.category === activeCategory;

		return searchMatch && categoryMatch;
	});

	const stats = {
		totalArticles: faqItems.length,
		totalViews: faqItems.reduce((sum, item) => sum + item.views, 0),
		solvedProblems: 95, // porcentagem
		responseTime: '2h', // tempo médio de resposta
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
			{/* Header */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
				<div>
					<div className="flex items-center gap-3 mb-5">
						<div className="p-2 rounded-xl bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30">
							<HelpCircle className="h-6 w-6 text-red-400" />
						</div>
						<Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-white-300 border border-red-500/30">
							<Sparkles className="h-3 w-3 mr-1" />
							Central de Ajuda SofVet
						</Badge>
					</div>
					<h1 className="text-4xl font-bold text-green-400">
						Central de Ajuda e Suporte
					</h1>
					<p className="text-gray-400 mt-2 mb-5">
						Encontre respostas, tutoriais e suporte para o SofVet
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Button
						variant="outline"
						className="border-gray-700 text-gray-400 hover:text-white hover:bg-green-800/30 hover:border-green-600"
						onClick={() => { }}
					>
						<Download className="h-4 w-4 mr-2" />
						Baixar Manual
					</Button>
					<Badge className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30">
						<Award className="h-3 w-3 mr-1" />
						Versão 2.0.0
					</Badge>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
				<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-gray-400">Artigos de Ajuda</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-white">{stats.totalArticles}</p>
								<p className="text-sm text-gray-400">Perguntas respondidas</p>
							</div>
							<div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
								<BookOpen className="h-5 w-5 text-red-400" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-gray-400">Visualizações</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-emerald-400">{stats.totalViews.toLocaleString()}</p>
								<p className="text-sm text-gray-400">Total de visualizações</p>
							</div>
							<div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20">
								<Eye className="h-5 w-5 text-emerald-400" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-gray-400">Problemas Resolvidos</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-blue-400">{stats.solvedProblems}%</p>
								<p className="text-sm text-gray-400">Taxa de solução</p>
							</div>
							<div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
								<CheckCircle className="h-5 w-5 text-blue-400" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-gray-400">Tempo de Resposta</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-end justify-between">
							<div>
								<p className="text-3xl font-bold text-amber-400">{stats.responseTime}</p>
								<p className="text-sm text-gray-400">Média de resposta</p>
							</div>
							<div className="p-2 rounded-lg bg-gradient-to-br from-amber-600/20 to-orange-600/20">
								<Clock className="h-5 w-5 text-amber-400" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Busca Rápida */}
			<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 mb-5">
				<CardContent className="p-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
						<Input
							placeholder="Buscar na ajuda (digite sua dúvida, problema ou funcionalidade)..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-12 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500 py-6 text-lg"
						/>
					</div>

					{/* Filtros por categoria */}
					<div className="mt-4 flex flex-wrap gap-2">
						{categories.map((cat) => (
							<Button
								key={cat.id}
								variant={activeCategory === cat.id ? "default" : "outline"}
								size="sm"
								onClick={() => setActiveCategory(cat.id)}
								className={`${activeCategory === cat.id
										? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
										: 'border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30'
									}`}
							>
								<div className="flex items-center gap-2">
									<div className={`w-2 h-2 rounded-full bg-gradient-to-r ${cat.color}`} />
									{cat.label}
								</div>
							</Button>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Tabs */}
			<Tabs defaultValue="sobre" className="space-y-6">
				<TabsList className="grid grid-cols-5 bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50 p-1">
					<TabsTrigger value="sobre" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
						<Info className="h-4 w-4 mr-2" />
						Sobre
					</TabsTrigger>
					<TabsTrigger value="faq" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
						<HelpCircle className="h-4 w-4 mr-2" />
						FAQ
					</TabsTrigger>
					<TabsTrigger value="suporte" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
						<LifeBuoy className="h-4 w-4 mr-2" />
						Suporte
					</TabsTrigger>
					<TabsTrigger value="problemas" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
						<AlertTriangle className="h-4 w-4 mr-2" />
						Problemas
					</TabsTrigger>
					<TabsTrigger value="atualizacoes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
						<RefreshCw className="h-4 w-4 mr-2" />
						Atualizações
					</TabsTrigger>
				</TabsList>

				{/* ABA 1: SOBRE O SISTEMA */}
				<TabsContent value="sobre">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<Card className="lg:col-span-2 bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
							<CardHeader>
								<CardTitle className="text-white flex items-center gap-2">
									<Info className="h-5 w-5 text-red-400" />
									Sobre o SofVet
								</CardTitle>
								<CardDescription className="text-gray-400">
									Informações do sistema, licença e créditos
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30">
									<div className="flex items-start">
										<BookOpen className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
										<div>
											<p className="font-medium text-blue-300">Baseado no manual do SofVet</p>
											<p className="text-blue-400 text-sm mt-1">
												O SofVet é uma evolução moderna do tradicional SofVet, mantendo todas as funcionalidades com uma interface atualizada.
											</p>
										</div>
									</div>
								</div>

								<div className="space-y-4">
									<h3 className="font-medium text-lg text-white">Informações do Sistema</h3>
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-3">
											<Label className="text-white">Nome do Sistema</Label>
											<div className="p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
												<p className="font-medium text-white">SofVet - Software Veterinário</p>
											</div>
										</div>
										<div className="space-y-3">
											<Label className="text-white">Versão</Label>
											<div className="p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
												<p className="font-medium text-white">2.0.0 (Baseado no SofVet)</p>
											</div>
										</div>
										<div className="space-y-3">
											<Label className="text-white">Data da Versão</Label>
											<div className="p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
												<p className="font-medium text-white">01 de Janeiro de 2026</p>
											</div>
										</div>
										<div className="space-y-3">
											<Label className="text-white">Licenciado para</Label>
											<div className="p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
												<p className="font-medium text-white">Clínica Veterinária Golfinho</p>
											</div>
										</div>
									</div>
								</div>

								<Separator className="bg-gray-800/50" />

								<div className="space-y-4">
									<h3 className="font-medium text-lg text-white">Características do Sistema</h3>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
										<div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30 text-center">
											<Database className="h-8 w-8 mx-auto mb-2 text-blue-400" />
											<p className="font-medium text-white">Gestão Completa</p>
											<p className="text-xs text-gray-400">Clínica + Pet Shop</p>
										</div>
										<div className="p-4 rounded-lg bg-gradient-to-br from-emerald-600/10 to-green-600/10 border border-emerald-500/30 text-center">
											<Users className="h-8 w-8 mx-auto mb-2 text-emerald-400" />
											<p className="font-medium text-white">Multi-usuário</p>
											<p className="text-xs text-gray-400">Até 10 terminais</p>
										</div>
										<div className="p-4 rounded-lg bg-gradient-to-br from-red-600/10 to-pink-600/10 border border-red-500/30 text-center">
											<Shield className="h-8 w-8 mx-auto mb-2 text-red-400" />
											<p className="font-medium text-white">Backup Automático</p>
											<p className="text-xs text-gray-400">Proteção de dados</p>
										</div>
										<div className="p-4 rounded-lg bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/30 text-center">
											<FileText className="h-8 w-8 mx-auto mb-2 text-purple-400" />
											<p className="font-medium text-white">Relatórios</p>
											<p className="text-xs text-gray-400">Completos</p>
										</div>
										<div className="p-4 rounded-lg bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/30 text-center">
											<MessageSquare className="h-8 w-8 mx-auto mb-2 text-amber-400" />
											<p className="font-medium text-white">Mensagens</p>
											<p className="text-xs text-gray-400">Comunicação interna</p>
										</div>
										<div className="p-4 rounded-lg bg-gradient-to-br from-gray-600/10 to-gray-700/10 border border-gray-500/30 text-center">
											<Settings className="h-8 w-8 mx-auto mb-2 text-gray-400" />
											<p className="font-medium text-white">Utilitários</p>
											<p className="text-xs text-gray-400">Ferramentas extras</p>
										</div>
									</div>
								</div>

								<Separator className="bg-gray-800/50" />

								<div className="space-y-4">
									<h3 className="font-medium text-lg text-white">Requisitos do Sistema</h3>
									<div className="space-y-3">
										<div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
											<div className="flex items-center gap-3">
												<Settings className="h-5 w-5 text-gray-400" />
												<div>
													<p className="font-medium text-white">Sistema Operacional</p>
													<p className="text-sm text-gray-400">Windows 10 ou superior</p>
												</div>
											</div>
											<Badge className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-400 border border-emerald-500/30">Recomendado</Badge>
										</div>
										<div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
											<div className="flex items-center gap-3">
												<Database className="h-5 w-5 text-gray-400" />
												<div>
													<p className="font-medium text-white">Memória RAM</p>
													<p className="text-sm text-gray-400">4 GB mínimo</p>
												</div>
											</div>
											<Badge className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30">Mínimo</Badge>
										</div>
										<div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
											<div className="flex items-center gap-3">
												<HardDrive className="h-5 w-5 text-gray-400" />
												<div>
													<p className="font-medium text-white">Espaço em Disco</p>
													<p className="text-sm text-gray-400">2 GB livres</p>
												</div>
											</div>
											<Badge className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-400 border border-emerald-500/30">Recomendado</Badge>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
							<CardHeader>
								<CardTitle className="text-white flex items-center gap-2">
									<Download className="h-5 w-5 text-red-400" />
									Recursos
								</CardTitle>
								<CardDescription className="text-gray-400">
									Downloads e documentação
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<Button variant="outline" className="w-full justify-start gap-2 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30" onClick={() => window.open('/manual_sofvet.pdf', '_blank')}>
										<BookOpen className="h-4 w-4" />
										Manual do Usuário (PDF)
									</Button>
									<Button variant="outline" className="w-full justify-start gap-2 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
										<Video className="h-4 w-4" />
										Vídeo Tutoriais
									</Button>
									<Button asChild variant="outline" className="w-full justify-start gap-2 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
										<a href="#" target="_blank" rel="noopener noreferrer">
											<FileText className="h-4 w-4" />
											Guia Rápido</a>
									</Button>
									<Button variant="outline" className="w-full justify-start gap-2 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
										<Download className="h-4 w-4" />
										Atualizações
									</Button>
								</div>

								<Separator className="bg-gray-800/50" />

								<div className="space-y-3">
									<h3 className="font-medium text-white">Links Úteis</h3>
									<div className="space-y-2">
										<a href="https://sofvet.netlify.app" target='_blank' className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 hover:underline">
											<Globe className="h-4 w-4" />
											Site Oficial
										</a>
										<a href="#" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 hover:underline">
											<MessageSquare className="h-4 w-4" />
											Fórum da Comunidade
										</a>
										<a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 hover:underline">
											<BookOpen className="h-4 w-4" />
											Base de Conhecimento
										</a>
									</div>
								</div>
								

								<Separator className="bg-gray-800/50" />

								<div className="space-y-3">
									<h3 className="font-medium text-white">Estatísticas</h3>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-sm text-gray-400">Versão atual:</span>
											<Badge className="bg-gradient-to-r from-white-600/20 to-pink-600/20 text-red-400 border border-red-500/30">2.0.0</Badge>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-gray-400">Última atualização:</span>
											<span className="text-sm text-white">01/01/2026</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-gray-400">Usuários ativos:</span>
											<span className="text-sm text-white">1.248</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-gray-400">Animais cadastrados:</span>
											<span className="text-sm text-white">2.567</span>
										</div>
									</div>
								</div>

								<Separator className="bg-gray-800/50" />

								<div className="text-center">
									<p className="text-sm text-gray-400">
										Desenvolvido com ❤️ para a comunidade veterinária
									</p>
									<p className="text-xs text-gray-500 mt-1">
										Baseado no tradicional SofVet
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* ABA 2: FAQ - PERGUNTAS FREQUENTES */}
				<TabsContent value="faq">
					<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
						<CardHeader>
							<CardTitle className="text-white flex items-center gap-2">
								<HelpCircle className="h-5 w-5 text-red-400" />
								Perguntas Frequentes (FAQ)
							</CardTitle>
							<CardDescription className="text-gray-400">
								Encontre respostas para as dúvidas mais comuns
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="mb-6">
								<div className="flex flex-wrap gap-2 mb-4">
									{categories.map((cat) => (
										<Button
											key={cat.id}
											variant={activeCategory === cat.id ? "default" : "outline"}
											size="sm"
											onClick={() => setActiveCategory(cat.id)}
											className={activeCategory === cat.id
												? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
												: 'border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30'
											}
										>
											{cat.label}
										</Button>
									))}
								</div>

								{filteredFaq.length === 0 ? (
									<div className="text-center py-12 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
										<HelpCircle className="h-16 w-16 mx-auto text-gray-600 mb-4" />
										<p className="text-gray-400 text-lg">Nenhuma pergunta encontrada</p>
										<p className="text-gray-500 text-sm mt-2">
											Tente buscar com outros termos ou selecione outra categoria
										</p>
									</div>
								) : (
									<Accordion type="single" collapsible className="w-full space-y-3">
										{filteredFaq.map((item, index) => (
											<AccordionItem
												key={index}
												value={`item-${index}`}
												className="border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-lg overflow-hidden"
											>
												<AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-800/30">
													<div className="flex items-center justify-between w-full">
														<div className="flex items-center gap-3">
															<Badge className={`bg-gradient-to-r border ${item.category === 'backup' ? 'from-blue-600/20 to-cyan-600/20 text-blue-400 border-blue-500/30' :
																	item.category === 'tabelas' ? 'from-emerald-600/20 to-green-600/20 text-emerald-400 border-emerald-500/30' :
																		item.category === 'problemas' ? 'from-red-600/20 to-pink-600/20 text-red-400 border-red-500/30' :
																			item.category === 'mensagens' ? 'from-purple-600/20 to-pink-600/20 text-purple-400 border-purple-500/30' :
																				'from-amber-600/20 to-orange-600/20 text-amber-400 border-amber-500/30'
																}`}>
																{item.category}
															</Badge>
															<span className="text-white font-medium text-left">{item.question}</span>
														</div>
														<div className="flex items-center gap-4 text-sm text-gray-400">
															<span className="flex items-center gap-1">
																<Eye className="h-3 w-3" />
																{item.views.toLocaleString()}
															</span>
															<span className="flex items-center gap-1">
																<ThumbsUp className="h-3 w-3" />
																{item.helpful}%
															</span>
														</div>
													</div>
												</AccordionTrigger>
												<AccordionContent className="px-4 pb-4">
													<div className="p-4 rounded-lg bg-gradient-to-br from-gray-900/30 to-black/30 border border-gray-800/50">
														<p className="text-gray-300 mb-4">{item.answer}</p>
														<div className="flex justify-between items-center">
															<div className="text-sm text-gray-400">
																Esta resposta foi útil?
															</div>
															<div className="flex gap-2">
																<Button variant="outline" size="sm" className="border-emerald-600/50 text-emerald-400 hover:bg-emerald-600/20">
																	<ThumbsUp className="h-4 w-4 mr-1" />
																	Sim
																</Button>
																<Button variant="outline" size="sm" className="border-red-600/50 text-red-400 hover:bg-red-600/20">
																	<ThumbsDown className="h-4 w-4 mr-1" />
																	Não
																</Button>
															</div>
														</div>
													</div>
												</AccordionContent>
											</AccordionItem>
										))}
									</Accordion>
								)}
							</div>

							<Separator className="my-6 bg-gray-800/50" />

							<div className="space-y-4">
								<h3 className="font-medium text-lg text-white">Não encontrou sua dúvida?</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<Button 
										asChild
										variant="outline" 
										className="gap-2 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
									>
										<a 
											href="https://wa.me/447747843073"
											target='_blank'
											rel="noopener noreferrer"
										>
										<MessageSquare className="h-4 w-4" />
										Chat Online
										</a>
									</Button>
									<Button className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
										<Mail className="h-4 w-4" />
										Enviar Dúvida
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* ABA 3: SUPORTE TÉCNICO */}
				<TabsContent value="suporte">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
							<CardHeader>
								<CardTitle className="text-white flex items-center gap-2">
									<LifeBuoy className="h-5 w-5 text-red-400" />
									Contato de Suporte
								</CardTitle>
								<CardDescription className="text-gray-400">
									Entre em contato com nossa equipe técnica
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30">
									<div className="flex items-start">
										<Phone className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
										<div>
											<p className="font-medium text-blue-300">Suporte Técnico SofVet</p>
											<p className="text-blue-400 text-sm mt-1">
												Baseado nas informações de contato do manual original.
											</p>
										</div>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-6">
									<div className="space-y-4">
										<div className="p-4 rounded-lg bg-gradient-to-br from-emerald-600/10 to-green-600/10 border border-emerald-500/30">
											<div className="flex items-center gap-3 mb-2">
												<Phone className="h-6 w-6 text-emerald-400" />
												<div>
													<p className="font-medium text-white">Telefone</p>
													<p className="text-sm text-gray-400">Suporte técnico prioritário</p>
												</div>
											</div>
											<p className="text-2xl font-bold text-white">+44 7747843073</p>
											<p className="text-sm text-gray-400 mt-2">
												Horário: Segunda a Sexta, 8h às 18h (GMT)
											</p>
										</div>

										<div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30">
											<div className="flex items-center gap-3 mb-2">
												<Mail className="h-6 w-6 text-blue-400" />
												<div>
													<p className="font-medium text-white">Email</p>
													<p className="text-sm text-gray-400">Suporte por email</p>
												</div>
											</div>
											<p className="text-xl font-bold text-white">contatosofvet@gmail.com</p>
											<p className="text-sm text-gray-400 mt-2">
												Resposta em até 24 horas úteis
											</p>
										</div>

										<div className="p-4 rounded-lg bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/30">
											<div className="flex items-center gap-3 mb-2">
												<Globe className="h-6 w-6 text-purple-400" />
												<div>
													<p className="font-medium text-white">Site Oficial</p>
													<p className="text-sm text-gray-400">Informações e downloads</p>
												</div>
											</div>
											<a href="http://www.sofvet.com.br" className="text-xl font-bold text-white hover:text-purple-300 hover:underline">
												http://www.sofvet.com.br
											</a>
										</div>
									</div>
								</div>

								<Separator className="bg-gray-800/50" />

								<div className="space-y-4">
									<h3 className="font-medium text-lg text-white">Informações da Empresa</h3>
									<div className="p-4 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
										<div className="space-y-3">
											<div className="flex items-center gap-3">
												<Home className="h-5 w-5 text-gray-400" />
												<div>
													<p className="font-medium text-white">&lt;LVF_Code/&gt; Sistemas e Automação</p>
													<p className="text-sm text-gray-400">Rua Benjamin Rodrigues, 203</p>
													<p className="text-sm text-gray-400">Jd. Eldorado - SP - 07500-000</p>
												</div>
											</div>
											<div className="flex items-center gap-3 pt-3 border-t border-gray-800/50">
												<Award className="h-5 w-5 text-amber-400" />
												<div>
													<p className="font-medium text-white">Tempo no mercado</p>
													<p className="text-lg font-bold text-amber-400">Mais de 25 anos</p>
													<p className="text-sm text-gray-400">
														Especializada em software veterinário
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
							<CardHeader>
								<CardTitle className="text-white flex items-center gap-2">
									<Mail className="h-5 w-5 text-red-400" />
									Formulário de Contato
								</CardTitle>
								<CardDescription className="text-gray-400">
									Preencha o formulário para solicitar suporte
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-3">
											<Label className="text-white">Nome *</Label>
											<Input
												placeholder="Seu nome completo"
												value={contactForm.nome}
												onChange={(e) => setContactForm({ ...contactForm, nome: e.target.value })}
												className="bg-gray-900/50 border-gray-700/50 text-white"
											/>
										</div>
										<div className="space-y-3">
											<Label className="text-white">Email *</Label>
											<Input
												type="email"
												placeholder="seu@email.com"
												value={contactForm.email}
												onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
												className="bg-gray-900/50 border-gray-700/50 text-white"
											/>
										</div>
									</div>

									<div className="space-y-3">
										<Label className="text-white">Telefone</Label>
										<Input
											placeholder="(11) 99999-9999"
											value={contactForm.telefone}
											onChange={(e) => setContactForm({ ...contactForm, telefone: e.target.value })}
											className="bg-gray-900/50 border-gray-700/50 text-white"
										/>
									</div>

									<div className="space-y-3">
										<Label className="text-white">Assunto</Label>
										<Select
											value={contactForm.assunto}
											onValueChange={(value) => setContactForm({ ...contactForm, assunto: value })}
										>
											<SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
												<SelectValue placeholder="Selecione o assunto" />
											</SelectTrigger>
											<SelectContent className="bg-gray-900 border-gray-800">
												<SelectItem value="suporte">Suporte Técnico</SelectItem>
												<SelectItem value="venda">Vendas e Licenças</SelectItem>
												<SelectItem value="sugestao">Sugestões</SelectItem>
												<SelectItem value="treinamento">Treinamento</SelectItem>
												<SelectItem value="outro">Outro</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-3">
										<Label className="text-white">Mensagem *</Label>
										<Textarea
											placeholder="Descreva seu problema ou dúvida..."
											rows={6}
											value={contactForm.mensagem}
											onChange={(e) => setContactForm({ ...contactForm, mensagem: e.target.value })}
											className="bg-gray-900/50 border-gray-700/50 text-white"
										/>
									</div>

									<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
										<div className="text-sm text-gray-400">
											Campos com * são obrigatórios
										</div>
										<Button
											onClick={handleSubmitContact}
											className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
										>
											<Mail className="h-4 w-4" />
											Enviar Mensagem
										</Button>
									</div>
								</div>

								<Separator className="bg-gray-800/50" />

								<div className="space-y-4">
									<h3 className="font-medium text-lg text-white">Antes de enviar</h3>

									<div className="space-y-3">
										<div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-emerald-600/10 to-green-600/10 border border-emerald-500/30">
											<CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
											<div>
												<p className="font-medium text-white">Verifique o manual</p>
												<p className="text-sm text-gray-400">
													Muitas dúvidas já estão respondidas na documentação
												</p>
											</div>
										</div>
										<div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-emerald-600/10 to-green-600/10 border border-emerald-500/30">
											<CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
											<div>
												<p className="font-medium text-white">Descreva detalhadamente</p>
												<p className="text-sm text-gray-400">
													Inclua versão do sistema, sistema operacional e passo a passo do problema
												</p>
											</div>
										</div>
										<div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-emerald-600/10 to-green-600/10 border border-emerald-500/30">
											<CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
											<div>
												<p className="font-medium text-white">Anexe prints se necessário</p>
												<p className="text-sm text-gray-400">
													Imagens ajudam a entender o problema rapidamente
												</p>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* ABA 4: PROBLEMAS COMUNS */}
				<TabsContent value="problemas">
					<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
						<CardHeader>
							<CardTitle className="text-white flex items-center gap-2">
								<AlertTriangle className="h-5 w-5 text-red-400" />
								Problemas Comuns e Soluções
							</CardTitle>
							<CardDescription className="text-gray-400">
								Soluções para os problemas mais frequentes do sistema
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30 mb-6">
								<div className="flex items-start">
									<AlertTriangle className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
									<div>
										<p className="font-medium text-blue-300">Baseado no manual do SofVet</p>
										<p className="text-blue-400 text-sm mt-1">
											Estas são soluções para problemas documentados no manual original do SofVet.
										</p>
									</div>
								</div>
							</div>

							<div className="overflow-x-auto rounded-lg border border-gray-800/50">
								<Table>
									<TableHeader>
										<TableRow className="border-gray-800/50">
											<TableHead className="text-gray-400">Problema</TableHead>
											<TableHead className="text-gray-400">Solução</TableHead>
											<TableHead className="text-gray-400">Gravidade</TableHead>
											<TableHead className="text-gray-400">Ocorrências</TableHead>
											<TableHead className="text-gray-400 text-right">Ações</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{commonProblems.map((problema, index) => (
											<TableRow key={index} className="border-gray-800/30 hover:bg-gray-800/20">
												<TableCell>
													<div className="flex items-start gap-2">
														<AlertTriangle className={`h-5 w-5 mt-0.5 ${problema.gravidade === 'alta' ? 'text-red-400' :
																problema.gravidade === 'media' ? 'text-amber-400' : 'text-emerald-400'
															}`} />
														<div>
															<p className="font-medium text-white">{problema.problema}</p>
															<p className="text-xs text-gray-400">
																{problema.gravidade === 'alta' ? 'Crítico - Resolver imediatamente' :
																	problema.gravidade === 'media' ? 'Importante - Resolver em breve' :
																		'Baixa - Pode aguardar'}
															</p>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<p className="text-sm text-gray-300">{problema.solucao}</p>
												</TableCell>
												<TableCell>
													<Badge className={`${problema.gravidade === 'alta'
															? 'bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400 border border-red-500/30'
															: problema.gravidade === 'media'
																? 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-400 border border-amber-500/30'
																: 'bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-400 border border-emerald-500/30'
														}`}>
														{problema.gravidade === 'alta' ? 'Alta' :
															problema.gravidade === 'media' ? 'Média' : 'Baixa'}
													</Badge>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<div className="w-full bg-gray-800 rounded-full h-2">
															<div
																className={`h-2 rounded-full ${problema.ocorrencias > 50
																		? 'bg-gradient-to-r from-red-600 to-pink-600'
																		: problema.ocorrencias > 30
																			? 'bg-gradient-to-r from-amber-600 to-orange-600'
																			: 'bg-gradient-to-r from-blue-600 to-cyan-600'
																	}`}
																style={{ width: `${Math.min(problema.ocorrencias, 100)}%` }}
															/>
														</div>
														<span className="text-sm text-gray-400">{problema.ocorrencias}</span>
													</div>
												</TableCell>
												<TableCell className="text-right">
													<Button
														variant="ghost"
														size="sm"
														className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
													>
														Copiar Solução
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>

							<Separator className="my-6 bg-gray-800/50" />

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
									<CardHeader>
										<CardTitle className="text-white flex items-center gap-2">
											<Settings className="h-5 w-5 text-red-400" />
											Problemas Técnicos
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<Accordion type="single" collapsible>
											<AccordionItem value="fonts" className="border-gray-800/50">
												<AccordionTrigger className="text-white hover:text-gray-300">
													<div className="flex items-center gap-2">
														<AlertTriangle className="h-4 w-4 text-red-400" />
														Erro: "VOCÊ PRECISA INSTALAR OS FONTES"
													</div>
												</AccordionTrigger>
												<AccordionContent>
													<div className="space-y-3 p-3 rounded-lg bg-gradient-to-br from-gray-900/30 to-black/30">
														<p className="font-medium text-white">Para Windows XP:</p>
														<ol className="list-decimal pl-5 space-y-1 text-sm text-gray-300">
															<li>Menu Iniciar → Configurações → Painel de Controle</li>
															<li>Fontes → Arquivo → Instalar Fontes Novas</li>
															<li>Selecione diretório SOFVETW</li>
															<li>Selecione Tudo → OK</li>
														</ol>
														<p className="font-medium text-white mt-4">Para Windows 10 ou superior:</p>
														<ol className="list-decimal pl-5 space-y-1 text-sm text-gray-300">
															<li>Abra o disco local (C:)</li>
															<li>Localize a pasta sofvetw</li>
															<li>Localize FOXFONT, FOXPRINT e 3OF9</li>
															<li>Clique com botão direito em cada um e selecione INSTALAR</li>
														</ol>
													</div>
												</AccordionContent>
											</AccordionItem>

											<AccordionItem value="disable" className="border-gray-800/50">
												<AccordionTrigger className="text-white hover:text-gray-300">
													<div className="flex items-center gap-2">
														<AlertTriangle className="h-4 w-4 text-amber-400" />
														Erro: "O SUPERVISOR BLOQUEOU SUA ENTRADA"
													</div>
												</AccordionTrigger>
												<AccordionContent>
													<div className="space-y-3 p-3 rounded-lg bg-gradient-to-br from-gray-900/30 to-black/30">
														<p className="text-gray-300">Este erro ocorre quando o arquivo DISABLE.SYS não foi removido após um backup.</p>
														<p className="font-medium text-white">Solução:</p>
														<ol className="list-decimal pl-5 space-y-1 text-sm text-gray-300">
															<li>Vá em INICIAR → LOCALIZAR → ARQUIVOS OU PASTAS</li>
															<li>Busque por DISABLE.SYS</li>
															<li>Localize o arquivo na pasta SOFVETW</li>
															<li>Exclua o arquivo DISABLE.SYS</li>
														</ol>
													</div>
												</AccordionContent>
											</AccordionItem>
										</Accordion>
									</CardContent>
								</Card>

								<Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
									<CardHeader>
										<CardTitle className="text-white flex items-center gap-2">
											<Database className="h-5 w-5 text-red-400" />
											Problemas de Dados
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<Accordion type="single" collapsible>
											<AccordionItem value="rede" className="border-gray-800/50">
												<AccordionTrigger className="text-white hover:text-gray-300">
													<div className="flex items-center gap-2">
														<Network className="h-4 w-4 text-blue-400" />
														Não consigo usar em rede
													</div>
												</AccordionTrigger>
												<AccordionContent>
													<div className="space-y-3 p-3 rounded-lg bg-gradient-to-br from-gray-900/30 to-black/30">
														<p className="font-medium text-white">Passos para configurar rede:</p>
														<ol className="list-decimal pl-5 space-y-1 text-sm text-gray-300">
															<li>Verifique se o micro SERVIDOR tem o HD compartilhado</li>
															<li>Nos TERMINAIS, instale apenas os arquivos de fonte</li>
															<li>Nos TERMINAIS, mapeie a unidade de rede</li>
															<li>Crie atalho para y:\SOFVETW\SOFVETW.EXE (y = letra do mapeamento)</li>
														</ol>
													</div>
												</AccordionContent>
											</AccordionItem>

											<AccordionItem value="backup" className="border-gray-800/50">
												<AccordionTrigger className="text-white hover:text-gray-300">
													<div className="flex items-center gap-2">
														<AlertTriangle className="h-4 w-4 text-red-400" />
														Perdi todos os dados
													</div>
												</AccordionTrigger>
												<AccordionContent>
													<div className="space-y-3 p-3 rounded-lg bg-gradient-to-br from-gray-900/30 to-black/30">
														<p className="font-medium text-white">Se você tem backup:</p>
														<ol className="list-decimal pl-5 space-y-1 text-sm text-gray-300">
															<li>Reinstale o SofVet</li>
															<li>Atualize com o último CD enviado</li>
															<li>Siga as instruções para restaurar seu backup</li>
														</ol>
														<p className="font-medium text-white mt-4">Se não tem backup:</p>
														<p className="text-sm text-red-400">
															Entre em contato imediatamente com o suporte técnico.
															Os dados podem ser irrecuperáveis.
														</p>
													</div>
												</AccordionContent>
											</AccordionItem>
										</Accordion>
									</CardContent>
								</Card>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* ABA 5: ATUALIZAÇÕES */}
				<TabsContent value="atualizacoes">
					<Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
						<CardHeader>
							<CardTitle className="text-white flex items-center gap-2">
								<RefreshCw className="h-5 w-5 text-red-400" />
								Histórico de Atualizações
							</CardTitle>
							<CardDescription className="text-gray-400">
								Acompanhe as mudanças e melhorias do SofVet
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								{updates.map((update, index) => (
									<div key={index} className="relative pl-8 pb-6 border-l-2 border-red-500/50 last:border-l-0 last:pb-0">
										<div className={`absolute -left-2.5 top-0 w-5 h-5 rounded-full ${update.type === 'major' ? 'bg-gradient-to-br from-red-600 to-pink-600' :
												update.type === 'minor' ? 'bg-gradient-to-br from-blue-600 to-cyan-600' :
													'bg-gradient-to-br from-emerald-600 to-green-600'
											}`} />

										<div className="ml-4">
											<div className="flex items-center gap-3 mb-3">
												<Badge className={`${update.type === 'major'
														? 'bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400 border border-red-500/30'
														: update.type === 'minor'
															? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30'
															: 'bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-400 border border-emerald-500/30'
													}`}>
													{update.version}
												</Badge>
												<span className="text-sm text-gray-400">{update.date}</span>
												{index === 0 && (
													<Badge className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-400 border border-emerald-500/30 gap-1">
														<CheckCircle className="h-3 w-3" />
														Atual
													</Badge>
												)}
											</div>

											<div className="space-y-2 p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
												{update.changes.map((change, changeIndex) => (
													<div key={changeIndex} className="flex items-start gap-2">
														<CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5" />
														<span className="text-gray-300">{change}</span>
													</div>
												))}
											</div>
										</div>
									</div>
								))}
							</div>

							<Separator className="my-6 bg-gray-800/50" />

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
									<CardHeader>
										<CardTitle className="text-white">Verificar Atualizações</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<p className="text-sm text-gray-400">
											Verifique se há novas versões disponíveis do SofVet.
										</p>
										<Button className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
											<RefreshCw className="h-4 w-4" />
											Verificar Atualizações
										</Button>
										<div className="p-3 rounded-lg bg-gradient-to-br from-emerald-600/10 to-green-600/10 border border-emerald-500/30">
											<div className="flex items-center gap-2">
												<CheckCircle className="h-5 w-5 text-emerald-400" />
												<div>
													<p className="font-medium text-white">Sistema atualizado</p>
													<p className="text-sm text-emerald-400">Você está usando a versão mais recente</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
									<CardHeader>
										<CardTitle className="text-white">Próximas Atualizações</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<Clock className="h-4 w-4 text-blue-400" />
												<span className="font-medium text-white">Em desenvolvimento</span>
											</div>
											<ul className="space-y-1 text-sm pl-6 text-gray-300">
												<li>• Integração com sistemas de pagamento</li>
												<li>• App móvel para clientes</li>
												<li>• Relatórios avançados em tempo real</li>
												<li>• Backup automático na nuvem</li>
											</ul>
										</div>
										<div className="text-xs text-gray-500">
											Estas funcionalidades estão planejadas para versões futuras.
										</div>
									</CardContent>
								</Card>
							</div>

							<div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30">
								<div className="flex items-start">
									<Info className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
									<div>
										<p className="font-medium text-blue-300">Sobre as atualizações</p>
										<p className="text-blue-400 text-sm mt-1">
											O SofVet é baseado no SofVet, que está há mais de 15 anos no mercado.
											Mantemos compatibilidade com todas as funcionalidades enquanto modernizamos a interface.
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Rodapé */}
			<div className="mt-8 pt-6 border-t border-gray-800/50">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<h3 className="font-medium text-white mb-2">Ajuda Rápida</h3>
						<div className="space-y-1 text-sm">
							<a href="#" className="block text-blue-400 hover:text-blue-300 hover:underline">Manual do Usuário</a>
							<a href="#" className="block text-blue-400 hover:text-blue-300 hover:underline">Vídeo Tutoriais</a>
							<a href="#" className="block text-blue-400 hover:text-blue-300 hover:underline">FAQ Completo</a>
							<a href="#" className="block text-blue-400 hover:text-blue-300 hover:underline">Treinamentos</a>
						</div>
					</div>

					<div>
						<h3 className="font-medium text-white mb-2">Suporte</h3>
						<div className="space-y-1 text-sm">
							<p className="text-gray-400">Telefone: +44 7747843073</p>
							<p className="text-gray-400">Email: contatosofvet@gmail.com</p>
							<p className="text-gray-400">Site: www.sofvet.com.br</p>
							<p className="text-gray-400">Horário: 8h às 18h (segunda a sexta)</p>
						</div>
					</div>

					<div>
						<h3 className="font-medium text-white mb-2">Informações</h3>
						<div className="space-y-1 text-sm">
							<p className="text-gray-400">Versão: 2.0.0</p>
							<p className="text-gray-400">Licença: Clínica Veterinária Golfinho</p>
							<p className="text-gray-400">Desenvolvido por: &lt;LVF_Code/&gt; Sistemas e Automação</p>
							<p className="text-gray-400">Baseado no: SofVet.</p>
						</div>
					</div>
				</div>

				<div className="mt-6 text-center">
					<p className="text-sm text-gray-400">
						© 2026 SofVet - Software Veterinário. Todos os direitos reservados.
					</p>
					<p className="text-xs text-gray-500 mt-1">
						Baseado no manual do SofVet.
					</p>
				</div>
			</div>
		</div>
	);
}