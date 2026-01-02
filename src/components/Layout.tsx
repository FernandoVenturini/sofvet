import { useContext, useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
import {
  Menu, LogOut, User, Home, FileText, ClipboardList,
  Database, Settings, HelpCircle, Search, Calendar,
  Users, Pill, Activity, Bell, ChevronDown,
  BarChart3, Calculator, Heart, Shield, Zap,
  LayoutDashboard, Stethoscope, Dog, Cat, Plus,
  X, Filter, AlertCircle, Clock, CheckCircle, BellRing
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [animais, setAnimais] = useState<any[]>([]);
  const [consultas, setConsultas] = useState<any[]>([]);
  const [notifications, setNotifications] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      resultados.push({ type: 'relatorio', label: 'Ir para Relatórios', path: '/relatorios', icon: BarChart3 });
    }
    if (lowerQuery.includes('movimento') || lowerQuery.includes('consulta')) {
      resultados.push({ type: 'movimento', label: 'Ir para Nova Consulta', path: '/movimento/nova', icon: Stethoscope });
    }
    if (lowerQuery.includes('medicamento') || lowerQuery.includes('remedio')) {
      resultados.push({ type: 'medicamento', label: 'Ir para Medicamentos', path: '/medicamentos', icon: Pill });
    }
    if (lowerQuery.includes('vacina') || lowerQuery.includes('vacin')) {
      resultados.push({ type: 'vacina', label: 'Ir para Vacinas', path: '/tabelas/vacinas', icon: Shield });
    }

    setSearchResults(resultados.slice(0, 8));
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

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      color: 'text-blue-400',
    },
    {
      title: 'Fichas',
      icon: FileText,
      path: '/fichas',
      color: 'text-emerald-400',
      subItems: [
        { title: 'Nova Ficha', path: '/fichas/nova' },
        { title: 'Lista / Busca', path: '/fichas/lista' },
        { title: 'Alterar Retorno', path: '/fichas/retorno' },
        { title: 'Agenda de Retornos', path: '/agenda/retornos' },
      ],
    },
    {
      title: 'Tabelas',
      icon: Database,
      path: '/tabelas',
      color: 'text-amber-400',
      subItems: [
        { title: 'Espécie/Raça', path: '/tabelas/especie-raca' },
        { title: 'Vacinas', path: '/tabelas/vacinas' },
        { title: 'Funcionários', path: '/tabelas/funcionarios' },
        { title: 'Produtos', path: '/tabelas/produtos' },
        { title: 'Medicamentos', path: '/medicamentos' },
        { title: 'Agendas', path: '/tabelas/agendas' },
        { title: 'Fornecedores', path: '/tabelas/fornecedores' },
        { title: 'Proprietários', path: '/tabelas/proprietarios' },
      ],
    },
    {
      title: 'Movimento',
      icon: ClipboardList,
      path: '/movimento',
      color: 'text-purple-400',
      subItems: [
        { title: 'Nova Consulta', path: '/movimento/nova' },
        { title: 'Lista de Consultas', path: '/movimento/lista' },
      ],
    },
    {
      title: 'Relatórios',
      icon: BarChart3,
      path: '/relatorios',
      color: 'text-rose-400',
    },
    {
      title: 'Utilitários',
      icon: Calculator,
      path: '/utilitarios',
      color: 'text-cyan-400',
    },
    {
      title: 'Ajuda',
      icon: HelpCircle,
      path: '/ajuda',
      color: 'text-gray-400',
    },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex flex-col w-64 bg-gray-900 border-r border-gray-800">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">
                SofVet
              </h1>
              <p className="text-xs text-gray-400">Sistema Veterinário</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 p-4 overflow-y-auto">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <div key={item.title}>
                  {item.subItems ? (
                    <Accordion type="single" collapsible>
                      <AccordionItem value={item.title} className="border-none">
                        <AccordionTrigger
                          className={cn(
                            "flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors",
                            active && "bg-gray-800"
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className={cn("h-5 w-5", item.color)} />
                            <span className="font-medium">{item.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2">
                          <div className="ml-9 space-y-1">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                className="block py-2 px-3 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors",
                        active && "bg-gray-800"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5", item.color)} />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-gray-800/50 rounded-xl">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Resumo</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <p className="text-2xl font-bold text-white">{animais.length}</p>
                <p className="text-xs text-gray-400">Pacientes</p>
              </div>
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <p className="text-2xl font-bold text-white">{consultas.length}</p>
                <p className="text-xs text-gray-400">Consultas</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-gray-700">
              <AvatarImage src={user?.photoURL || ''} />
              <AvatarFallback className="bg-gray-700">
                {user?.displayName?.[0] || user?.email?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.displayName || user?.email}</p>
              <p className="text-xs text-gray-400 truncate">Veterinário</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => { await logout(); navigate('/login'); }}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left: Menu toggle and title */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden md:block">
                <h2 className="text-lg font-semibold text-white">
                  {menuItems.find(item => isActive(item.path))?.title || 'Dashboard'}
                </h2>
              </div>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar pacientes, consultas, medicamentos..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
                    {searchResults.map((result, index) => (
                      <div
                        key={result.id || result.path || index}
                        className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-0"
                        onClick={() => handleSearchSelect(result)}
                      >
                        <div className="flex items-center space-x-3">
                          {result.type === 'animal' ? (
                            <>
                              <Dog className="h-4 w-4 text-blue-400" />
                              <div>
                                <p className="font-medium">{result.nomeAnimal}</p>
                                <p className="text-sm text-gray-400">{result.nomeProprietario}</p>
                              </div>
                            </>
                          ) : result.type === 'consulta' ? (
                            <>
                              <Activity className="h-4 w-4 text-green-400" />
                              <div>
                                <p className="font-medium">Consulta: {result.animalNome}</p>
                                <p className="text-sm text-gray-400">R$ {result.total?.toFixed(2) || '0.00'}</p>
                              </div>
                            </>
                          ) : (
                            <>
                              {result.icon && <result.icon className="h-4 w-4 text-red-400" />}
                              <p className="font-medium">{result.label}</p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Notifications and User */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white hover:bg-gray-800">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex items-center space-x-2 hover:bg-gray-800">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL || ''} />
                      <AvatarFallback className="bg-gray-700">
                        {user?.displayName?.[0] || user?.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium">{user?.displayName?.split(' ')[0] || 'Usuário'}</p>
                      <p className="text-xs text-gray-400">Veterinário</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                  <DropdownMenuLabel className="text-white">Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem asChild className="text-white hover:bg-gray-700 cursor-pointer">
                    <Link to="/perfil" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={async () => { await logout(); navigate('/login'); }}
                    className="text-red-400 hover:text-red-300 hover:bg-gray-700 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-950 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 p-4 bg-gray-900">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="flex items-center space-x-4 mb-2 md:mb-0">
              <span>© 2024 SofVet - Sistema Veterinário</span>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Online</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="link" size="sm" className="text-gray-400 hover:text-white">
                Termos
              </Button>
              <Button variant="link" size="sm" className="text-gray-400 hover:text-white">
                Privacidade
              </Button>
              <Button variant="link" size="sm" className="text-gray-400 hover:text-white">
                Suporte
              </Button>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-gray-900 border-r border-gray-800">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">
                  SofVet
                </h1>
                <p className="text-xs text-gray-400">Sistema Veterinário</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="ml-auto text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="p-4">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <div key={item.title}>
                    {item.subItems ? (
                      <Accordion type="single" collapsible>
                        <AccordionItem value={item.title} className="border-none">
                          <AccordionTrigger
                            className={cn(
                              "flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors",
                              active && "bg-gray-800"
                            )}
                          >
                            <div className="flex items-center space-x-3">
                              <item.icon className={cn("h-5 w-5", item.color)} />
                              <span className="font-medium">{item.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2">
                            <div className="ml-9 space-y-1">
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.path}
                                  to={subItem.path}
                                  onClick={() => setSidebarOpen(false)}
                                  className="block py-2 px-3 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                                >
                                  {subItem.title}
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors",
                          active && "bg-gray-800"
                        )}
                      >
                        <item.icon className={cn("h-5 w-5", item.color)} />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Layout;