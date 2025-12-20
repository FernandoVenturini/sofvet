import { useContext } from 'react';
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
import { Menu, LogOut, User, Home, FileText, ClipboardList, Database, Settings, HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Layout = () => {
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();

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

					{/* Fichas (Pacientes) - SEPARADO */}
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

						{/* Tabelas - SEPARADO */}
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
								<Link to="/tabelas/def" className="block py-2 text-gray-400 hover:text-white">
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
								Diversos
							</AccordionTrigger>
							<AccordionContent className="space-y-1 pl-6">
								<Link to="/mensagens" className="block py-2 text-gray-400 hover:text-white">Mensagens</Link>
								<Link to="/diversos/backup" className="block py-2 text-gray-400 hover:text-white">Backup Diário</Link>
								<Link to="/diversos/usuarios" className="block py-2 text-gray-400 hover:text-white">Usuários e Senhas</Link>
								<Link to="/config" className="block py-2 text-gray-400 hover:text-white">Configurações</Link>
							</AccordionContent>
						</AccordionItem>
					</Accordion>

					<Link to="/movimento" className="flex items-center px-4 py-3 text-lg hover:bg-red-600/20 rounded">
						<ClipboardList className="mr-3 h-5 w-5" />
						Movimento
					</Link>

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
					<div className="flex items-center">
						<img
							src="/assets/logo-sofvet.png"
							alt="SofVet Logo"
							className="h-14 w-auto object-contain brightness-125 contrast-125 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]"
						/>
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
							{/* Menu mobile - você pode repetir o menu aqui se quiser */}
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