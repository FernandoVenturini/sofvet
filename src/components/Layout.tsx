import { useContext, useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, User, Home, FileText, ClipboardList, Database, Settings, HelpCircle, Search } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Layout = () => {
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();

	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [animais, setAnimais] = useState<any[]>([]);
	const [consultas, setConsultas] = useState<any[]>([]);

	useEffect(() => {
		const carregarDadosParaBusca = async () => {
			const animaisSnap = await getDocs(collection(db, 'animais'));
			setAnimais(animaisSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'animal' })));

			const consultasSnap = await getDocs(collection(db, 'consultas'));
			setConsultas(consultasSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'consulta' })));
		};
		carregarDadosParaBusca();
	}, []);

	useEffect(() => {
		if (!searchQuery.trim()) {
			setSearchResults([]);
			return;
		}

		const lowerQuery = searchQuery.toLowerCase();

		const resultados = [
			...animais.filter(a =>
				a.nomeAnimal?.toLowerCase().includes(lowerQuery) ||
				a.nomeProprietario?.toLowerCase().includes(lowerQuery)
			),
			...consultas.filter(c =>
				c.animalNome?.toLowerCase().includes(lowerQuery) ||
				c.proprietarioNome?.toLowerCase().includes(lowerQuery)
			),
		];

		// Adicionar sugestões fixas para comandos
		if (lowerQuery.includes('relatorio') || lowerQuery.includes('faturamento')) {
			resultados.push({ type: 'relatorio', label: 'Ir para Relatórios', path: '/relatorios' });
		}
		if (lowerQuery.includes('movimento') || lowerQuery.includes('consulta')) {
			resultados.push({ type: 'movimento', label: 'Ir para Nova Consulta', path: '/movimento/nova' });
		}

		setSearchResults(resultados.slice(0, 10));
	}, [searchQuery, animais, consultas]);

	const handleSearchSelect = (result: any) => {
		setSearchQuery('');
		setSearchResults([]);
		if (result.type === 'animal') {
			navigate(`/fichas/editar/${result.id}`);
		} else if (result.type === 'consulta') {
			navigate(`/movimento/detalhe/${result.id}`);
		} else if (result.path) {
			navigate(result.path);
		}
	};

	return (
		<div className="flex h-screen bg-black text-white">
			{/* Sidebar Desktop */}
			<div className="hidden md:block w-64 bg-black/90 border-r border-red-600/30">
				<div className="p-6 border-b border-red-600/30 text-center">
					<img
						src="/assets/logo-sofvet.png"
						alt="SofVet Logo"
						className="mx-auto h-40 w-auto object-contain brightness-125 contrast-125 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]"
					/>
					<p className="text-sm text-gray-400 mt-4">Software Veterinário</p>
				</div>

				<div className="p-4 space-y-2">
					<Link to="/dashboard" className="flex items-center px-4 py-3 text-lg hover:bg-red-600/20 rounded">
						<Home className="mr-3 h-5 w-5" />
						Dashboard
					</Link>

					{/* Fichas (Pacientes) */}
					<Accordion type="single" collapsible>
						<AccordionItem value="fichas">
							<AccordionTrigger className="px-4 py-3 text-lg hover:bg-red-600/20 rounded">
								<FileText className="mr-3 h-5 w-5" />
								Fichas (Pacientes)
							</AccordionTrigger>
							<AccordionContent className="space-y-1 pl-6">
								<Link to="/fichas/nova" className="block py-2 text-gray-300 hover:text-white">
									Incluir Nova Ficha
								</Link>
								<Link to="/fichas/lista" className="block py-2 text-gray-300 hover:text-white">
									Lista / Busca de Fichas
								</Link>
								<Link to="/fichas/retorno" className="block py-2 text-gray-300 hover:text-white">
									Alterar / Consultar Retorno
								</Link>
								<Link to="/agenda/retornos" className="block py-2 text-gray-300 hover:text-white">
									Agenda de Retornos
								</Link>
							</AccordionContent>
						</AccordionItem>

						{/* Tabelas */}
						<AccordionItem value="tabelas">
							<AccordionTrigger className="px-4 py-3 text-lg hover:bg-red-600/20 rounded">
								<Database className="mr-3 h-5 w-5" />
								Tabelas
							</AccordionTrigger>
							<AccordionContent className="space-y-1 pl-6">
								<Link to="/tabelas/especie-raca" className="block py-2 text-gray-400 hover:text-white">
									Espécie, Raça e Pelagem
								</Link>
								<Link to="/tabelas/vacinas" className="block py-2 text-gray-400 hover:text-white">
									Vacinas
								</Link>
								<Link to="/tabelas/funcionarios" className="block py-2 text-gray-400 hover:text-white">
									Funcionários
								</Link>
								<Link to="/tabelas/produtos" className="block py-2 text-gray-400 hover:text-white">
									Produtos e Serviços
								</Link>
								<Link to="/tabelas/proprietarios" className="block py-2 text-gray-400 hover:text-white">
									Proprietários
								</Link>
								<Link to="/tabelas/fornecedores" className="block py-2 text-gray-400 hover:text-white">
									Fornecedores
								</Link>
								{/* CORREÇÃO AQUI: Mudado de /tabelas/def para /medicamentos */}
								<Link to="/medicamentos" className="block py-2 text-gray-400 hover:text-white">
									DEF (Medicamentos)
								</Link>
								<Link to="/tabelas/agendas" className="block py-2 text-gray-400 hover:text-white">
									Agendas
								</Link>
								<Link to="/tabelas/patologias" className="block py-2 text-gray-400 hover:text-white">
									Patologias
								</Link>
							</AccordionContent>
						</AccordionItem>

						{/* Diversos */}
						<AccordionItem value="diversos">
							<AccordionTrigger className="px-4 py-3 text-lg hover:bg-red-600/20 rounded">
								<Settings className="mr-3 h-5 w-5" />
								Diversos
							</AccordionTrigger>
							<AccordionContent className="space-y-1 pl-6">
								<Link to="/mensagens" className="block py-2 text-gray-400 hover:text-white">
									Mensagens
								</Link>
								<Link to="/diversos/backup" className="block py-2 text-gray-400 hover:text-white">
									Backup Diário
								</Link>
								<Link to="/diversos/usuarios" className="block py-2 text-gray-400 hover:text-white">
									Usuários e Senhas
								</Link>
								<Link to="/config" className="block py-2 text-gray-400 hover:text-white">
									Configurações
								</Link>
							</AccordionContent>
						</AccordionItem>

						{/* Movimento */}
						<AccordionItem value="movimento">
							<AccordionTrigger className="px-4 py-3 text-lg hover:bg-red-600/20 rounded">
								<ClipboardList className="mr-3 h-5 w-5" />
								Movimento
							</AccordionTrigger>
							<AccordionContent className="space-y-1 pl-6">
								<Link to="/movimento/nova" className="block py-2 text-gray-300 hover:text-white">
									Nova Consulta
								</Link>
								<Link to="/movimento/lista" className="block py-2 text-gray-300 hover:text-white">
									Lista de Consultas
								</Link>
							</AccordionContent>
						</AccordionItem>
					</Accordion>

					<Link to="/relatorios" className="flex items-center px-4 py-3 text-lg hover:bg-red-600/20 rounded">
						<FileText className="mr-3 h-5 w-5" />
						Relatórios
					</Link>

					<Link to="/utilitarios" className="flex items-center px-4 py-3 text-lg hover:bg-red-600/20 rounded">
						<Settings className="mr-3 h-5 w-5" />
						Utilitários
					</Link>

					<Link to="/ajuda" className="flex items-center px-4 py-3 text-lg hover:bg-red-600/20 rounded">
						<HelpCircle className="mr-3 h-5 w-5" />
						Ajuda
					</Link>
				</div>
			</div>

			{/* Conteúdo Principal */}
			<div className="flex-1 flex flex-col">
				<header className="flex items-center justify-between p-4 bg-black/80 border-b border-red-600/30">
					<div className="flex items-center w-full gap-4">
						<div className="relative flex-1 max-w-md">
							<Input
								placeholder="Buscar animais, consultas, relatórios..."
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
								className="bg-black/50 border-red-600/50 text-white pl-10"
							/>
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
							{searchResults.length > 0 && (
								<div className="absolute z-50 w-full bg-black/90 border border-red-600/30 mt-2 rounded-lg max-h-60 overflow-y-auto shadow-lg">
									{searchResults.map(result => (
										<div
											key={result.id || result.path}
											className="p-3 hover:bg-red-600/20 cursor-pointer text-white"
											onClick={() => handleSearchSelect(result)}
										>
											{result.type === 'animal' ? `Animal: ${result.nomeAnimal} (${result.nomeProprietario})` :
												result.type === 'consulta' ? `Consulta: ${result.animalNome} - R$ ${result.total?.toFixed(2) || '0.00'}` :
													result.label}
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					<Sheet>
						<SheetTrigger asChild className="md:hidden">
							<Button variant="ghost" size="icon">
								<Menu className="h-6 w-6" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-64 bg-black/90 p-0">
							<div className="p-6 border-b border-red-600/30 text-center">
								<img
									src="/assets/logo-sofvet.png"
									alt="SofVet Logo"
									className="mx-auto h-40 w-auto object-contain brightness-125 contrast-125 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]"
								/>
								<p className="text-sm text-gray-400 mt-4">Software Veterinário</p>
							</div>
						</SheetContent>
					</Sheet>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="flex items-center gap-3">
								<Avatar>
									<AvatarImage src={user?.photoURL || ''} />
									<AvatarFallback className="bg-red-600">
										{user?.displayName?.[0] || user?.email?.[0] || 'U'}
									</AvatarFallback>
								</Avatar>
								<div className="text-left hidden sm:block">
									<p className="font-medium">{user?.displayName || user?.email}</p>
									<p className="text-xs text-gray-400">Supervisor</p>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="bg-black border-red-600/30">
							<DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
							<DropdownMenuSeparator className="bg-red-600/30" />
							<DropdownMenuItem asChild>
								<Link to="/perfil" className="flex items-center">
									<User className="mr-2 h-4 w-4" />
									Meu Perfil
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={async () => { await logout(); navigate('/login'); }}>
								<LogOut className="mr-2 h-4 w-4" />
								Sair
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</header>

				<main className="flex-1 overflow-y-auto p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default Layout;