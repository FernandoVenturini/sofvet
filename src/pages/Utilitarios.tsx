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
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
    Settings,
    Download,
    Upload,
    Users,
    Calculator,
    Tag,
    Phone,
    Music,
    Gamepad2,
    RefreshCw,
    FileSpreadsheet,
    Database,
    User,
    Package,
    Truck,
    Calendar,
    Printer,
    CheckCircle,
    AlertCircle,
    Clock,
    BarChart3,
    Smartphone,
    Disc,
    Eye,
    Sparkles,
    DollarSign,
    FileText,
    TrendingUp,
    Activity,
    Zap,
    Shield,
    Lock,
    Unlock,
    Terminal,
    Cpu,
    HardDrive,
    Network,
    Volume2,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Grid3x3,
    Puzzle,
    Coffee,
    Bot,
    Mail,
    Home,
    MapPin,
    Award,
    ChevronRight,
    MoreVertical,
    ExternalLink,
    Filter,
    Search,
    Plus,
    Minus,
    X,
    Check,
    AlertTriangle,
    Brain,
    Heart,
    Thermometer,
    Stethoscope,
    Syringe,
    Scissors
} from 'lucide-react';

export default function Utilitarios() {
    const [activeTab, setActiveTab] = useState('conversor');
    const [conversionProgress, setConversionProgress] = useState(0);
    const [isConverting, setIsConverting] = useState(false);
    const [proRataData, setProRataData] = useState({
        dataInicial: '',
        dataFinal: '',
        valorTotal: '',
        diasTotais: ''
    });
    const [connectedUsers, setConnectedUsers] = useState([
        { id: 1, nome: 'SUPERVISOR', cargo: 'Administrador', entrada: '09:00:00', terminal: 'Servidor', status: 'ativo', ip: '192.168.1.1' },
        { id: 2, nome: 'Recepcionista', cargo: 'Recepção', entrada: '09:15:00', terminal: 'Terminal 1', status: 'ativo', ip: '192.168.1.2' },
        { id: 3, nome: 'Veterinário', cargo: 'Médico Veterinário', entrada: '08:45:00', terminal: 'Terminal 2', status: 'ativo', ip: '192.168.1.3' },
        { id: 4, nome: 'Auxiliar', cargo: 'Auxiliar Técnico', entrada: '09:30:00', terminal: 'Terminal 3', status: 'inativo', ip: '192.168.1.4' },
    ]);
    const [cdPlayer, setCdPlayer] = useState({
        playing: false,
        track: 1,
        totalTracks: 12,
        time: '00:00',
        totalTime: '45:30',
        title: 'Música Relaxante',
        artist: 'CD de Demonstração'
    });
    const [puzzleProgress, setPuzzleProgress] = useState(0);
    const [systemInfo, setSystemInfo] = useState({
        version: '2.0.0',
        lastUpdate: '01/01/2024',
        databaseSize: '2.4 GB',
        uptime: '15 dias',
        memoryUsage: '65%',
        cpuUsage: '42%'
    });

    // Conversão para Excel
    const startConversion = (type: string) => {
        setIsConverting(true);
        setConversionProgress(0);

        const interval = setInterval(() => {
            setConversionProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsConverting(false);
                    toast.success(`Conversão de ${type} concluída!`, {
                        description: 'Arquivo Excel gerado com sucesso',
                        icon: <CheckCircle className="h-5 w-5 text-emerald-400" />
                    });
                    return 100;
                }
                return prev + 20;
            });
        }, 300);
    };

    // Cálculo Pro-Rata
    const calculateProRata = () => {
        if (!proRataData.dataInicial || !proRataData.dataFinal || !proRataData.valorTotal) {
            toast.error('Preencha todos os campos para calcular', {
                icon: <AlertCircle className="h-5 w-5 text-red-400" />
            });
            return;
        }

        const inicio = new Date(proRataData.dataInicial);
        const fim = new Date(proRataData.dataFinal);
        const valor = parseFloat(proRataData.valorTotal);

        const diffTime = Math.abs(fim.getTime() - inicio.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setProRataData({ ...proRataData, diasTotais: diffDays.toString() });

        const valorPorDia = valor / diffDays;

        toast.success('Cálculo concluído!', {
            description: `${diffDays} dias • R$ ${valorPorDia.toFixed(2)} por dia`,
            icon: <Calculator className="h-5 w-5 text-emerald-400" />
        });
    };

    // CD Player controls
    const toggleCdPlayer = () => {
        setCdPlayer({ ...cdPlayer, playing: !cdPlayer.playing });
        toast.info(cdPlayer.playing ? 'CD pausado' : 'CD em reprodução', {
            icon: cdPlayer.playing ? <Pause className="h-5 w-5 text-amber-400" /> : <Play className="h-5 w-5 text-emerald-400" />
        });
    };

    const nextTrack = () => {
        if (cdPlayer.track < cdPlayer.totalTracks) {
            setCdPlayer({ ...cdPlayer, track: cdPlayer.track + 1, time: '00:00' });
            toast.info(`Faixa ${cdPlayer.track + 1}: Música ${cdPlayer.track + 1}`, {
                icon: <SkipForward className="h-5 w-5 text-blue-400" />
            });
        }
    };

    const prevTrack = () => {
        if (cdPlayer.track > 1) {
            setCdPlayer({ ...cdPlayer, track: cdPlayer.track - 1, time: '00:00' });
            toast.info(`Faixa ${cdPlayer.track - 1}: Música ${cdPlayer.track - 1}`, {
                icon: <SkipBack className="h-5 w-5 text-blue-400" />
            });
        }
    };

    // Puzzle game
    const playPuzzle = () => {
        setPuzzleProgress(0);
        const interval = setInterval(() => {
            setPuzzleProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    toast.success('Puzzle completado! 🎉', {
                        description: 'Parabéns! Você completou o puzzle!',
                        icon: <Award className="h-5 w-5 text-amber-400" />
                    });
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    // Auto dial
    const autoDial = (number: string) => {
        toast.info(`Discando: ${number}`, {
            description: 'Conectando via modem...',
            icon: <Phone className="h-5 w-5 text-blue-400" />
        });
    };

    // Format currency
    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30">
                            <Settings className="h-6 w-6 text-red-400" />
                        </div>
                        <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 border border-red-500/30">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Utilitários SofVet
                        </Badge>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">
                        Utilitários do Sistema
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Ferramentas avançadas e utilitários do sistema veterinário
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                        onClick={() => {}}
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Atualizar Sistema
                    </Button>
                    <Badge className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30">
                        <Users className="h-3 w-3 mr-1" />
                        {connectedUsers.filter(u => u.status === 'ativo').length} usuários ativos
                    </Badge>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Versão do Sistema</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-white">2.0.0</p>
                                <p className="text-sm text-gray-400">SofVet Professional</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
                                <Cpu className="h-5 w-5 text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Tempo Ativo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-emerald-400">15 dias</p>
                                <p className="text-sm text-gray-400">Uptime do sistema</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20">
                                <Activity className="h-5 w-5 text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Banco de Dados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-amber-400">2.4 GB</p>
                                <p className="text-sm text-gray-400">Tamanho total</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-600/20 to-orange-600/20">
                                <Database className="h-5 w-5 text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">CPU / Memória</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-2xl font-bold text-white">42% / 65%</p>
                                <p className="text-sm text-gray-400">Uso do sistema</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                                <BarChart3 className="h-5 w-5 text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid grid-cols-4 bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50 p-1">
                    <TabsTrigger value="conversor" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Conversor Excel
                    </TabsTrigger>
                    <TabsTrigger value="calculos" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                        <Calculator className="h-4 w-4 mr-2" />
                        Cálculos
                    </TabsTrigger>
                    <TabsTrigger value="usuarios" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                        <Users className="h-4 w-4 mr-2" />
                        Usuários
                    </TabsTrigger>
                    <TabsTrigger value="outros" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                        <Settings className="h-4 w-4 mr-2" />
                        Outros Utilitários
                    </TabsTrigger>
                </TabsList>

                {/* ABA 1: CONVERSOR EXCEL */}
                <TabsContent value="conversor">
                    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <FileSpreadsheet className="h-5 w-5 text-red-400" />
                                Conversor para Excel
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Converta as tabelas do sistema para arquivos Excel (.xls)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30 mb-6">
                                <div className="flex items-start">
                                    <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                                    <div>
                                        <p className="font-medium text-blue-300">Baseado no manual do SofVet</p>
                                        <p className="text-blue-400 text-sm mt-1">
                                            Converta suas tabelas para um arquivo de Excel. Esta função permite exportar dados para análise externa.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Proprietários */}
                                <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50 hover:border-blue-500/30 transition-all">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
                                                <User className="h-6 w-6 text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">Proprietários</h3>
                                                <p className="text-sm text-gray-400">Clientes e tutores</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Registros:</span>
                                                <Badge className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30">1.248</Badge>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Última exportação:</span>
                                                <span className="text-gray-300">01/01/2024</span>
                                            </div>
                                            <Button
                                                onClick={() => startConversion('Proprietários')}
                                                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                                                disabled={isConverting}
                                            >
                                                <Download className="h-4 w-4" />
                                                Converter para Excel
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Animais */}
                                <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50 hover:border-emerald-500/30 transition-all">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20">
                                                <Database className="h-6 w-6 text-emerald-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">Animais</h3>
                                                <p className="text-sm text-gray-400">Pacientes e fichas</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Registros:</span>
                                                <Badge className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-400 border border-emerald-500/30">2.567</Badge>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Última exportação:</span>
                                                <span className="text-gray-300">28/12/2023</span>
                                            </div>
                                            <Button
                                                onClick={() => startConversion('Animais')}
                                                className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                                                disabled={isConverting}
                                            >
                                                <Download className="h-4 w-4" />
                                                Converter para Excel
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Fornecedores */}
                                <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50 hover:border-amber-500/30 transition-all">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-600/20 to-orange-600/20">
                                                <Truck className="h-6 w-6 text-amber-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">Fornecedores</h3>
                                                <p className="text-sm text-gray-400">Parceiros e distribuidores</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Registros:</span>
                                                <Badge className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-400 border border-amber-500/30">87</Badge>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Última exportação:</span>
                                                <span className="text-gray-300">15/12/2023</span>
                                            </div>
                                            <Button
                                                onClick={() => startConversion('Fornecedores')}
                                                className="w-full gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                                                disabled={isConverting}
                                            >
                                                <Download className="h-4 w-4" />
                                                Converter para Excel
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Produtos */}
                                <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50 hover:border-purple-500/30 transition-all">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                                                <Package className="h-6 w-6 text-purple-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">Produtos</h3>
                                                <p className="text-sm text-gray-400">Itens do estoque</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Registros:</span>
                                                <Badge className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400 border border-purple-500/30">456</Badge>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Última exportação:</span>
                                                <span className="text-gray-300">20/12/2023</span>
                                            </div>
                                            <Button
                                                onClick={() => startConversion('Produtos')}
                                                className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                                disabled={isConverting}
                                            >
                                                <Download className="h-4 w-4" />
                                                Converter para Excel
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Total Movimento */}
                                <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50 hover:border-red-500/30 transition-all">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                                                <BarChart3 className="h-6 w-6 text-red-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">Total Movimento</h3>
                                                <p className="text-sm text-gray-400">Vendas e transações</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Registros:</span>
                                                <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400 border border-red-500/30">12.845</Badge>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Última exportação:</span>
                                                <span className="text-gray-300">Hoje</span>
                                            </div>
                                            <Button
                                                onClick={() => startConversion('Movimento')}
                                                className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                                disabled={isConverting}
                                            >
                                                <Download className="h-4 w-4" />
                                                Converter para Excel
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Backup Completo */}
                                <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-2 border-red-500/30 hover:border-red-500/50 transition-all">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                                                <Database className="h-6 w-6 text-red-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">Backup Completo</h3>
                                                <p className="text-sm text-gray-400">Todos os dados do sistema</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Tamanho estimado:</span>
                                                <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400 border border-red-500/30">45 MB</Badge>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Último backup:</span>
                                                <span className="text-gray-300">01/01/2024</span>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="w-full gap-2 border-red-600/50 text-red-400 hover:bg-red-600/20"
                                                disabled={isConverting}
                                            >
                                                <Download className="h-4 w-4" />
                                                Exportar Tudo
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {isConverting && (
                                <div className="mt-6">
                                    <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                        <CardContent className="pt-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium text-white">Conversão em andamento</h3>
                                                    <Badge className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30">
                                                        {conversionProgress}%
                                                    </Badge>
                                                </div>
                                                <Progress value={conversionProgress} className="h-2 bg-gray-800" />
                                                <div className="grid grid-cols-3 gap-4 text-center">
                                                    <div className="p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                                        <p className="text-2xl font-bold text-white">1.248</p>
                                                        <p className="text-xs text-gray-400">Registros</p>
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                                        <p className="text-2xl font-bold text-white">45 MB</p>
                                                        <p className="text-xs text-gray-400">Tamanho</p>
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                                        <p className="text-2xl font-bold text-white">
                                                            {conversionProgress < 50 ? '00:15' : '00:05'}
                                                        </p>
                                                        <p className="text-xs text-gray-400">Restante</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-center text-gray-400">
                                                    Não feche o sistema durante a conversão
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            <Separator className="my-6 bg-gray-800/50" />

                            <div className="space-y-4">
                                <h3 className="font-medium text-lg text-white">Opções de Exportação</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                            <div>
                                                <Label className="font-medium text-white">Incluir dados excluídos</Label>
                                                <p className="text-sm text-gray-400">Registros inativos</p>
                                            </div>
                                            <Switch className="data-[state=checked]:bg-red-600" />
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                            <div>
                                                <Label className="font-medium text-white">Comprimir arquivo</Label>
                                                <p className="text-sm text-gray-400">ZIP com senha</p>
                                            </div>
                                            <Switch className="data-[state=checked]:bg-red-600" defaultChecked />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-3">
                                            <Label className="text-white">Formato de saída</Label>
                                            <Select defaultValue="xlsx">
                                                <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-900 border-gray-800">
                                                    <SelectItem value="xlsx">
                                                        <div className="flex items-center gap-2">
                                                            <FileSpreadsheet className="h-4 w-4 text-blue-400" />
                                                            Excel (.xlsx)
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="xls">
                                                        <div className="flex items-center gap-2">
                                                            <FileSpreadsheet className="h-4 w-4 text-green-400" />
                                                            Excel 97-2003 (.xls)
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="csv">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-amber-400" />
                                                            CSV (.csv)
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="pdf">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-red-400" />
                                                            PDF (.pdf)
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-white">Delimitador CSV</Label>
                                            <Select defaultValue="semicolon">
                                                <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-900 border-gray-800">
                                                    <SelectItem value="semicolon">Ponto e vírgula (;)</SelectItem>
                                                    <SelectItem value="comma">Vírgula (,)</SelectItem>
                                                    <SelectItem value="tab">Tabulação</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ABA 2: CÁLCULOS */}
                <TabsContent value="calculos">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Calculator className="h-5 w-5 text-red-400" />
                                    Cálculo Dias / Pro-Rata
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Calcule valores proporcionais por período
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30">
                                    <div className="flex items-start">
                                        <Calculator className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-300">Utilitário do manual</p>
                                            <p className="text-blue-400 text-sm mt-1">
                                                Calcule valores proporcionais (pro-rata) para contratos, serviços ou qualquer cobrança por período.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <Label className="text-white">Data Inicial *</Label>
                                            <Input
                                                type="date"
                                                value={proRataData.dataInicial}
                                                onChange={(e) => setProRataData({ ...proRataData, dataInicial: e.target.value })}
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-white">Data Final *</Label>
                                            <Input
                                                type="date"
                                                value={proRataData.dataFinal}
                                                onChange={(e) => setProRataData({ ...proRataData, dataFinal: e.target.value })}
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-white">Valor Total (R$) *</Label>
                                        <Input
                                            type="number"
                                            placeholder="0,00"
                                            value={proRataData.valorTotal}
                                            onChange={(e) => setProRataData({ ...proRataData, valorTotal: e.target.value })}
                                            className="bg-gray-900/50 border-gray-700/50 text-white"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-white">Dias do Período</Label>
                                        <Input
                                            type="number"
                                            placeholder="Calculado automaticamente"
                                            value={proRataData.diasTotais}
                                            readOnly
                                            className="bg-gray-900/30 border-gray-700/50 text-gray-400"
                                        />
                                    </div>

                                    <Button 
                                        onClick={calculateProRata} 
                                        className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                    >
                                        <Calculator className="h-4 w-4" />
                                        Calcular Pro-Rata
                                    </Button>
                                </div>

                                {proRataData.diasTotais && (
                                    <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                        <CardContent className="pt-6">
                                            <div className="space-y-3">
                                                <h3 className="font-medium text-lg text-white">Resultado do Cálculo</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30 text-center">
                                                        <p className="text-2xl font-bold text-white">{proRataData.diasTotais}</p>
                                                        <p className="text-sm text-gray-400">Dias totais</p>
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-600/10 to-green-600/10 border border-emerald-500/30 text-center">
                                                        <p className="text-2xl font-bold text-emerald-400">
                                                            {formatarMoeda(parseFloat(proRataData.valorTotal) / parseInt(proRataData.diasTotais))}
                                                        </p>
                                                        <p className="text-sm text-gray-400">Valor por dia</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-600/10 to-green-600/10 border border-emerald-500/30">
                                                    <p className="text-sm text-emerald-300">
                                                        <strong>Valor proporcional:</strong> R$ {proRataData.valorTotal} ÷ {proRataData.diasTotais} dias = {formatarMoeda(parseFloat(proRataData.valorTotal) / parseInt(proRataData.diasTotais))} por dia
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <Separator className="bg-gray-800/50" />

                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg text-white">Exemplos de Uso</h3>
                                    <div className="space-y-2">
                                        <div className="p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                            <p className="font-medium text-white">Contrato de serviço</p>
                                            <p className="text-sm text-gray-400">Calcular valor proporcional para serviço interrompido</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                            <p className="font-medium text-white">Hospedagem animal</p>
                                            <p className="text-sm text-gray-400">Cálculo diário de internação</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                            <p className="font-medium text-white">Plano de saúde</p>
                                            <p className="text-sm text-gray-400">Valor proporcional para adesão no meio do mês</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Tag className="h-5 w-5 text-red-400" />
                                    Etiquetas Avulsas
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Gere etiquetas individuais sem cadastro
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30">
                                    <div className="flex items-start">
                                        <Tag className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-300">Utilitário do manual</p>
                                            <p className="text-blue-400 text-sm mt-1">
                                                Imprima etiquetas avulsas para produtos, pastas, arquivos ou qualquer necessidade de identificação.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <Label className="text-white">Modelo de Etiqueta</Label>
                                            <Select defaultValue="pimaco6180">
                                                <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-900 border-gray-800">
                                                    <SelectItem value="pimaco6180">PIMACO 6180 (Produtos)</SelectItem>
                                                    <SelectItem value="pimaco6182">PIMACO 6182 (Mala Direta)</SelectItem>
                                                    <SelectItem value="pimaco6181">PIMACO 6181</SelectItem>
                                                    <SelectItem value="personalizada">Personalizada</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-white">Quantidade</Label>
                                            <Input type="number" defaultValue="1" min="1" max="100" className="bg-gray-900/50 border-gray-700/50 text-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-white">Texto da Etiqueta</Label>
                                        <Textarea
                                            placeholder="Digite o texto que aparecerá na etiqueta..."
                                            rows={4}
                                            defaultValue="CONSULTA VETERINÁRIA
R$ 120,00
Cód: 001.001"
                                            className="bg-gray-900/50 border-gray-700/50 text-white"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-white">Código de Barras (opcional)</Label>
                                        <Input placeholder="7891000315507" className="bg-gray-900/50 border-gray-700/50 text-white" />
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                        <div>
                                            <Label className="font-medium text-white">Incluir borda</Label>
                                            <p className="text-sm text-gray-400">Margem de corte</p>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-red-600" defaultChecked />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Button variant="outline" className="gap-2 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                            <Eye className="h-4 w-4" />
                                            Visualizar
                                        </Button>
                                        <Button className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                                            <Printer className="h-4 w-4" />
                                            Imprimir Etiquetas
                                        </Button>
                                    </div>
                                </div>

                                <Separator className="bg-gray-800/50" />

                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg text-white">Modelos Prontos</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" size="sm" className="justify-start border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                            EM TRATAMENTO
                                        </Button>
                                        <Button variant="outline" size="sm" className="justify-start border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                            AGUARDANDO RETIRADA
                                        </Button>
                                        <Button variant="outline" size="sm" className="justify-start border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                            VACINA PENDENTE
                                        </Button>
                                        <Button variant="outline" size="sm" className="justify-start border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                            EXAME SOLICITADO
                                        </Button>
                                        <Button variant="outline" size="sm" className="justify-start border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                            CONSULTA RETORNO
                                        </Button>
                                        <Button variant="outline" size="sm" className="justify-start border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                            CIRURGIA AGENDADA
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* ABA 3: USUÁRIOS CONECTADOS */}
                <TabsContent value="usuarios">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Users className="h-5 w-5 text-red-400" />
                                    Lista de Usuários Conectados
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Monitoramento em tempo real dos usuários no sistema
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30 mb-6">
                                    <div className="flex items-start">
                                        <Users className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-300">Utilitário do manual</p>
                                            <p className="text-blue-400 text-sm mt-1">
                                                Visualize todos os usuários conectados ao sistema, com informações de terminal e tempo de sessão.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-x-auto rounded-lg border border-gray-800/50">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-gray-800/50">
                                                <TableHead className="text-gray-400">Usuário</TableHead>
                                                <TableHead className="text-gray-400">Cargo</TableHead>
                                                <TableHead className="text-gray-400">Entrada</TableHead>
                                                <TableHead className="text-gray-400">Terminal</TableHead>
                                                <TableHead className="text-gray-400">IP</TableHead>
                                                <TableHead className="text-gray-400">Status</TableHead>
                                                <TableHead className="text-gray-400 text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {connectedUsers.map((user) => (
                                                <TableRow key={user.id} className="border-gray-800/30 hover:bg-gray-800/20">
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${user.status === 'ativo' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                            <span className={`font-medium ${user.nome === 'SUPERVISOR' ? 'text-white' : 'text-gray-300'}`}>
                                                                {user.nome}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-gray-300">{user.cargo}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3 text-gray-400" />
                                                            <span className="text-gray-300">{user.entrada}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30">
                                                            {user.terminal}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-gray-300 font-mono text-sm">{user.ip}</TableCell>
                                                    <TableCell>
                                                        <Badge className={`${
                                                            user.status === 'ativo'
                                                                ? 'bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-400 border border-emerald-500/30'
                                                                : 'bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400 border border-red-500/30'
                                                        }`}>
                                                            {user.status === 'ativo' ? 'Online' : 'Offline'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                        >
                                                            Mensagem
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="mt-6 grid grid-cols-3 gap-4">
                                    <div className="p-4 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50 text-center">
                                        <p className="text-3xl font-bold text-white">{connectedUsers.filter(u => u.status === 'ativo').length}</p>
                                        <p className="text-sm text-gray-400">Conectados</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50 text-center">
                                        <p className="text-3xl font-bold text-white">10</p>
                                        <p className="text-sm text-gray-400">Limite</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50 text-center">
                                        <p className="text-3xl font-bold text-white">4</p>
                                        <p className="text-sm text-gray-400">Disponíveis</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-red-400" />
                                    Painel de Controle
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Controle rápido do sistema
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30">
                                    <div className="flex items-start">
                                        <Settings className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-300">Utilitário do manual</p>
                                            <p className="text-blue-400 text-sm mt-1">
                                                Acesso rápido às configurações do sistema operacional.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start gap-2 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                        <Users className="h-4 w-4" />
                                        Contas de Usuário
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                        <Printer className="h-4 w-4" />
                                        Impressoras e Dispositivos
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                        <Smartphone className="h-4 w-4" />
                                        Rede e Internet
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                        <BarChart3 className="h-4 w-4" />
                                        Sistema e Segurança
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                        <Clock className="h-4 w-4" />
                                        Data e Hora
                                    </Button>
                                </div>

                                <Separator className="bg-gray-800/50" />

                                <div className="space-y-3">
                                    <h3 className="font-medium text-white">Ações Rápidas</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button size="sm" variant="outline" className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                            Backup
                                        </Button>
                                        <Button size="sm" variant="outline" className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                            Limpar Cache
                                        </Button>
                                        <Button size="sm" variant="outline" className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                            Reiniciar
                                        </Button>
                                        <Button size="sm" variant="outline" className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                            Logs
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* ABA 4: OUTROS UTILITÁRIOS */}
                <TabsContent value="outros">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Discagem Automática */}
                        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Phone className="h-5 w-5 text-red-400" />
                                    Discagem Automática
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Disque números automaticamente
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30">
                                    <div className="flex items-start">
                                        <Phone className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-300">Utilitário do manual</p>
                                            <p className="text-blue-400 text-sm mt-1">
                                                Disque números de telefone automaticamente através do modem.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-white">Número de Telefone</Label>
                                        <Input placeholder="(11) 99999-9999" className="bg-gray-900/50 border-gray-700/50 text-white" />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-white">Contatos Frequentes</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button variant="outline" size="sm" onClick={() => autoDial('(11) 3230-8742')} className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                                Suporte SofVet
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => autoDial('(11) 99999-9999')} className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                                Clínica Central
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => autoDial('190')} className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                                Emergência
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => autoDial('192')} className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30">
                                                SAMU
                                            </Button>
                                        </div>
                                    </div>
                                    <Button 
                                        className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700" 
                                        onClick={() => autoDial('(11) 99999-9999')}
                                    >
                                        <Phone className="h-4 w-4" />
                                        Discar Número
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tocar CD-Player */}
                        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Music className="h-5 w-5 text-red-400" />
                                    Tocar CD-Player
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Reprodutor de CD integrado
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30">
                                    <div className="flex items-start">
                                        <Music className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-300">Utilitário do manual</p>
                                            <p className="text-blue-400 text-sm mt-1">
                                                Reproduza CDs de áudio diretamente pelo sistema.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-center">
                                        <div className="relative">
                                            <Disc className="h-24 w-24 text-gray-400" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <p className="font-medium text-white">{cdPlayer.title}</p>
                                        <p className="text-sm text-gray-400">
                                            {cdPlayer.artist} • Faixa {cdPlayer.track} de {cdPlayer.totalTracks}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">{cdPlayer.time}</span>
                                            <span className="text-gray-400">{cdPlayer.totalTime}</span>
                                        </div>
                                        <Progress value={(cdPlayer.track / cdPlayer.totalTracks) * 100} className="h-1 bg-gray-800" />
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            onClick={prevTrack}
                                            className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                                        >
                                            <SkipBack className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            size="icon" 
                                            onClick={toggleCdPlayer}
                                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                        >
                                            {cdPlayer.playing ? (
                                                <Pause className="h-4 w-4" />
                                            ) : (
                                                <Play className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            onClick={nextTrack}
                                            className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                                        >
                                            <SkipForward className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="text-center text-sm text-gray-400">
                                        {cdPlayer.playing ? 'Reproduzindo...' : 'Pausado'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Jogo Puzzle */}
                        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Gamepad2 className="h-5 w-5 text-red-400" />
                                    Jogo Puzzle
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Quebra-cabeça para descontração
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30">
                                    <div className="flex items-start">
                                        <Gamepad2 className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-300">Utilitário do manual</p>
                                            <p className="text-blue-400 text-sm mt-1">
                                                Jogo de puzzle integrado para momentos de descontração.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-800 rounded-lg p-8 text-center bg-gradient-to-br from-gray-900/50 to-black/50">
                                        <div className="grid grid-cols-3 gap-1 mb-4 mx-auto max-w-[200px]">
                                            {Array.from({ length: 9 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`aspect-square ${i < puzzleProgress / 11 ? 'bg-gradient-to-br from-red-600 to-pink-600' : 'bg-gray-800'} rounded`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-400 mb-2">
                                            Complete o quebra-cabeça
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Progresso</span>
                                            <span className="text-white">{puzzleProgress}%</span>
                                        </div>
                                        <Progress value={puzzleProgress} className="h-2 bg-gray-800" />
                                    </div>

                                    <Button
                                        onClick={playPuzzle}
                                        className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                        disabled={puzzleProgress > 0 && puzzleProgress < 100}
                                    >
                                        <Gamepad2 className="h-4 w-4" />
                                        {puzzleProgress === 0 ? 'Iniciar Jogo' :
                                            puzzleProgress === 100 ? 'Jogar Novamente' : 'Jogando...'}
                                    </Button>

                                    {puzzleProgress === 100 && (
                                        <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-600/10 to-green-600/10 border border-emerald-500/30 text-center">
                                            <p className="font-medium text-emerald-300">Parabéns! 🎉</p>
                                            <p className="text-sm text-emerald-400">Puzzle completado com sucesso!</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Conversão DOS para Windows */}
                        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <RefreshCw className="h-5 w-5 text-red-400" />
                                    Conversão DOS para Windows
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Migre dados da versão DOS
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30">
                                    <div className="flex items-start">
                                        <RefreshCw className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-300">Utilitário do manual</p>
                                            <p className="text-blue-400 text-sm mt-1">
                                                Converta dados da versão DOS do SOFVET para a versão Windows.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 rounded-lg bg-gradient-to-br from-gray-800/50 to-black/50">
                                                <Database className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">Dados da versão DOS</p>
                                                <p className="text-sm text-gray-400">Arquivos .DBF e .DBT</p>
                                            </div>
                                        </div>
                                        <div className="text-sm space-y-1 text-gray-300">
                                            <p>• Fichas de animais</p>
                                            <p>• Tabelas do sistema</p>
                                            <p>• Movimento financeiro</p>
                                            <p>• Configurações</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-white">Pasta dos arquivos DOS</Label>
                                        <Input placeholder="C:\SOFVET\" className="bg-gray-900/50 border-gray-700/50 text-white" />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-white">Destino Windows</Label>
                                        <Input placeholder="C:\SOFVETW\" defaultValue="C:\SOFVETW\" className="bg-gray-900/50 border-gray-700/50 text-white" />
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                        <div>
                                            <Label className="font-medium text-white">Manter backup DOS</Label>
                                            <p className="text-sm text-gray-400">Preservar arquivos originais</p>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-red-600" defaultChecked />
                                    </div>

                                    <Button className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                                        <RefreshCw className="h-4 w-4" />
                                        Iniciar Conversão
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mt-6 bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Settings className="h-5 w-5 text-red-400" />
                                Informações do Sistema
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Detalhes técnicos e versões
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                    <p className="text-sm text-gray-400">Versão SofVet</p>
                                    <p className="font-bold text-white text-xl">2.0.0</p>
                                </div>
                                <div className="p-4 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                    <p className="text-sm text-gray-400">Última atualização</p>
                                    <p className="font-bold text-white text-xl">01/01/2024</p>
                                </div>
                                <div className="p-4 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                    <p className="text-sm text-gray-400">Total de utilitários</p>
                                    <p className="font-bold text-white text-xl">9</p>
                                </div>
                                <div className="p-4 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                    <p className="text-sm text-gray-400">Compatibilidade</p>
                                    <p className="font-bold text-white text-xl">Windows 7+</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Rodapé */}
            <div className="mt-8 pt-6 border-t border-gray-800/50">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-400">
                        <p>Utilitários baseados no manual do SofVet</p>
                        <p className="text-xs mt-1">Conversão Excel • Cálculos • Usuários • Entretenimento</p>
                    </div>
                    <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400 border border-red-500/30">
                        <Clock className="h-3 w-3 mr-1" />
                        Sistema: {connectedUsers.filter(u => u.status === 'ativo').length}/10 conectados
                    </Badge>
                </div>
            </div>
        </div>
    );
}