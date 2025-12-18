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
                        className="mx-auto h-34 w-auto object-contain drop-shadow-2xl filter brightness-110 contrast-125"
                    />
                    <p className="text-sm text-gray-400 mt-4">Software Veterinário</p>
                </div>

                <div className="p-4 space-y-2">
                    <Link to="/dashboard" className="flex items-center px-4 py-3 text-lg hover:bg-red-600/20 rounded">
                        <Home className="mr-3 h-5 w-5" />
                        Dashboard
                    </Link>

                    {/* Accordion para menus */}
                    <Accordion type="single" collapsible>
                        {/* Seus menus aqui */}
                    </Accordion>

                    {/* Itens simples */}
                    <Link to="/movimento" className="flex items-center px-4 py-3 text-lg hover:bg-red-600/20 rounded">
                        <ClipboardList className="mr-3 h-5 w-5" />
                        Movimento
                    </Link>
                    {/* Outros itens */}
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1 flex flex-col">
                <header className="flex items-center justify-between p-4 bg-black/80 border-b border-red-600/30">
                    {/* Logo no header esquerdo */}
                    <div className="flex items-center">
                        <img
                            src="/assets/logo-sofvet.png"
                            alt="SofVet Logo"
                            className="h-14 w-auto object-contain drop-shadow-2xl filter brightness-110 contrast-125"
                        />
                    </div>

                    {/* Hamburger Mobile */}
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
                                    className="mx-auto h-40 w-auto object-contain drop-shadow-2xl filter brightness-110 contrast-125"
                                />
                                <p className="text-sm text-gray-400 mt-4">Software Veterinário</p>
                            </div>
                            {/* Menu mobile */}
                        </SheetContent>
                    </Sheet>

                    {/* Avatar e Dropdown */}
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