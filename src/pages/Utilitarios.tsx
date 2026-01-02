// src/pages/Utilitarios.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
    Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
        { id: 1, nome: 'SUPERVISOR', cargo: 'Administrador', entrada: '09:00:00', terminal: 'Servidor' },
        { id: 2, nome: 'Recepcionista', cargo: 'Recepção', entrada: '09:15:00', terminal: 'Terminal 1' },
        { id: 3, nome: 'Veterinário', cargo: 'Médico Veterinário', entrada: '08:45:00', terminal: 'Terminal 2' },
        { id: 4, nome: 'Auxiliar', cargo: 'Auxiliar Técnico', entrada: '09:30:00', terminal: 'Terminal 3' },
    ]);
    const [cdPlayer, setCdPlayer] = useState({
        playing: false,
        track: 1,
        totalTracks: 12,
        time: '00:00',
        totalTime: '45:30'
    });
    const [puzzleProgress, setPuzzleProgress] = useState(0);

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
                        description: 'Arquivo Excel gerado com sucesso'
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
            toast.error('Preencha todos os campos para calcular');
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
            description: `${diffDays} dias • R$ ${valorPorDia.toFixed(2)} por dia`
        });
    };

    // CD Player controls
    const toggleCdPlayer = () => {
        setCdPlayer({ ...cdPlayer, playing: !cdPlayer.playing });
        toast.info(cdPlayer.playing ? 'CD pausado' : 'CD em reprodução');
    };

    const nextTrack = () => {
        if (cdPlayer.track < cdPlayer.totalTracks) {
            setCdPlayer({ ...cdPlayer, track: cdPlayer.track + 1, time: '00:00' });
            toast.info(`Faixa ${cdPlayer.track + 1}: Música ${cdPlayer.track + 1}`);
        }
    };

    const prevTrack = () => {
        if (cdPlayer.track > 1) {
            setCdPlayer({ ...cdPlayer, track: cdPlayer.track - 1, time: '00:00' });
            toast.info(`Faixa ${cdPlayer.track - 1}: Música ${cdPlayer.track - 1}`);
        }
    };

    // Puzzle game
    const playPuzzle = () => {
        setPuzzleProgress(0);
        const interval = setInterval(() => {
            setPuzzleProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    toast.success('Puzzle completado! 🎉');
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    // Auto dial
    const autoDial = (number: string) => {
        toast.info(`Discando: ${number}`, {
            description: 'Conectando...'
        });
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Settings className="h-8 w-8" />
                            Utilitários
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Ferramentas e utilitários do sistema SofVet
                        </p>
                    </div>
                    <Badge variant="outline" className="gap-2">
                        <Clock className="h-4 w-4" />
                        {connectedUsers.length} usuários conectados
                    </Badge>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline" className="gap-1">
                        <FileSpreadsheet className="h-3 w-3" />
                        Conversor Excel
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                        <Calculator className="h-3 w-3" />
                        Cálculos
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                        <Users className="h-3 w-3" />
                        Usuários
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                        <Tag className="h-3 w-3" />
                        Etiquetas
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                        <Phone className="h-3 w-3" />
                        Discagem
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                        <Music className="h-3 w-3" />
                        CD Player
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                        <Gamepad2 className="h-3 w-3" />
                        Jogo Puzzle
                    </Badge>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-8">
                    <TabsTrigger value="conversor" className="gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Conversor Excel
                    </TabsTrigger>
                    <TabsTrigger value="calculos" className="gap-2">
                        <Calculator className="h-4 w-4" />
                        Cálculos
                    </TabsTrigger>
                    <TabsTrigger value="usuarios" className="gap-2">
                        <Users className="h-4 w-4" />
                        Usuários
                    </TabsTrigger>
                    <TabsTrigger value="outros" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Outros Utilitários
                    </TabsTrigger>
                </TabsList>

                {/* ABA 1: CONVERSOR EXCEL (Baseado no manual) */}
                <TabsContent value="conversor">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileSpreadsheet className="h-5 w-5" />
                                    Conversor para Excel
                                </CardTitle>
                                <CardDescription>
                                    Converta as tabelas do sistema para arquivos Excel (.xls)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                                    <div className="flex items-start">
                                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-800">Baseado no manual do SofVet</p>
                                            <p className="text-blue-700 text-sm mt-1">
                                                Converta suas tabelas para um arquivo de Excel. Esta função permite exportar dados para análise externa.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Proprietários */}
                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-blue-100 p-2 rounded">
                                                    <User className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">Proprietários</h3>
                                                    <p className="text-sm text-muted-foreground">Clientes e tutores</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span>Registros:</span>
                                                    <Badge variant="outline">1.248</Badge>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Última exportação:</span>
                                                    <span className="text-muted-foreground">01/01/2024</span>
                                                </div>
                                                <Button
                                                    onClick={() => startConversion('Proprietários')}
                                                    className="w-full gap-2"
                                                    disabled={isConverting}
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Converter para Excel
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Animais */}
                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-green-100 p-2 rounded">
                                                    <Database className="h-6 w-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">Animais</h3>
                                                    <p className="text-sm text-muted-foreground">Pacientes e fichas</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span>Registros:</span>
                                                    <Badge variant="outline">2.567</Badge>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Última exportação:</span>
                                                    <span className="text-muted-foreground">28/12/2023</span>
                                                </div>
                                                <Button
                                                    onClick={() => startConversion('Animais')}
                                                    className="w-full gap-2"
                                                    disabled={isConverting}
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Converter para Excel
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Fornecedores */}
                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-orange-100 p-2 rounded">
                                                    <Truck className="h-6 w-6 text-orange-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">Fornecedores</h3>
                                                    <p className="text-sm text-muted-foreground">Parceiros e distribuidores</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span>Registros:</span>
                                                    <Badge variant="outline">87</Badge>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Última exportação:</span>
                                                    <span className="text-muted-foreground">15/12/2023</span>
                                                </div>
                                                <Button
                                                    onClick={() => startConversion('Fornecedores')}
                                                    className="w-full gap-2"
                                                    disabled={isConverting}
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Converter para Excel
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Produtos */}
                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-purple-100 p-2 rounded">
                                                    <Package className="h-6 w-6 text-purple-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">Produtos</h3>
                                                    <p className="text-sm text-muted-foreground">Itens do estoque</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span>Registros:</span>
                                                    <Badge variant="outline">456</Badge>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Última exportação:</span>
                                                    <span className="text-muted-foreground">20/12/2023</span>
                                                </div>
                                                <Button
                                                    onClick={() => startConversion('Produtos')}
                                                    className="w-full gap-2"
                                                    disabled={isConverting}
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Converter para Excel
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Total Movimento */}
                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-red-100 p-2 rounded">
                                                    <BarChart3 className="h-6 w-6 text-red-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">Total Movimento</h3>
                                                    <p className="text-sm text-muted-foreground">Vendas e transações</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span>Registros:</span>
                                                    <Badge variant="outline">12.845</Badge>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Última exportação:</span>
                                                    <span className="text-muted-foreground">Hoje</span>
                                                </div>
                                                <Button
                                                    onClick={() => startConversion('Movimento')}
                                                    className="w-full gap-2"
                                                    disabled={isConverting}
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Converter para Excel
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Todos os dados */}
                                    <Card className="hover:shadow-md transition-shadow border-2 border-primary/20">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-primary/10 p-2 rounded">
                                                    <Database className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">Backup Completo</h3>
                                                    <p className="text-sm text-muted-foreground">Todos os dados do sistema</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span>Tamanho estimado:</span>
                                                    <Badge variant="outline">45 MB</Badge>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Último backup:</span>
                                                    <span className="text-muted-foreground">01/01/2024</span>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="w-full gap-2"
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
                                        <Card>
                                            <CardContent className="pt-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-medium">Conversão em andamento</h3>
                                                        <Badge variant="secondary">
                                                            {conversionProgress}%
                                                        </Badge>
                                                    </div>
                                                    <Progress value={conversionProgress} className="h-2" />
                                                    <div className="grid grid-cols-3 gap-4 text-center">
                                                        <div className="p-3 border rounded">
                                                            <p className="text-2xl font-bold">1.248</p>
                                                            <p className="text-xs text-muted-foreground">Registros</p>
                                                        </div>
                                                        <div className="p-3 border rounded">
                                                            <p className="text-2xl font-bold">45 MB</p>
                                                            <p className="text-xs text-muted-foreground">Tamanho</p>
                                                        </div>
                                                        <div className="p-3 border rounded">
                                                            <p className="text-2xl font-bold">
                                                                {conversionProgress < 50 ? '00:15' : '00:05'}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">Restante</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-center text-muted-foreground">
                                                        Não feche o sistema durante a conversão
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                <Separator className="my-6" />

                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Opções de Exportação</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label className="font-medium">Incluir dados excluídos</Label>
                                                    <p className="text-sm text-muted-foreground">Registros inativos</p>
                                                </div>
                                                <Switch />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label className="font-medium">Comprimir arquivo</Label>
                                                    <p className="text-sm text-muted-foreground">ZIP com senha</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <Label>Formato de saída</Label>
                                                <Select defaultValue="xlsx">
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                                                        <SelectItem value="xls">Excel 97-2003 (.xls)</SelectItem>
                                                        <SelectItem value="csv">CSV (.csv)</SelectItem>
                                                        <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Delimitador CSV</Label>
                                                <Select defaultValue="semicolon">
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
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
                    </div>
                </TabsContent>

                {/* ABA 2: CÁLCULOS (Pro-Rata do manual) */}
                <TabsContent value="calculos">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calculator className="h-5 w-5" />
                                    Cálculo Dias / Pro-Rata
                                </CardTitle>
                                <CardDescription>
                                    Calcule valores proporcionais por período
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start">
                                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-800">Utilitário do manual</p>
                                            <p className="text-blue-700 text-sm mt-1">
                                                Calcule valores proporcionais (pro-rata) para contratos, serviços ou qualquer cobrança por período.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Data Inicial *</Label>
                                            <Input
                                                type="date"
                                                value={proRataData.dataInicial}
                                                onChange={(e) => setProRataData({ ...proRataData, dataInicial: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Data Final *</Label>
                                            <Input
                                                type="date"
                                                value={proRataData.dataFinal}
                                                onChange={(e) => setProRataData({ ...proRataData, dataFinal: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Valor Total (R$) *</Label>
                                        <Input
                                            type="number"
                                            placeholder="0,00"
                                            value={proRataData.valorTotal}
                                            onChange={(e) => setProRataData({ ...proRataData, valorTotal: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Dias do Período</Label>
                                        <Input
                                            type="number"
                                            placeholder="Calculado automaticamente"
                                            value={proRataData.diasTotais}
                                            readOnly
                                            className="bg-gray-50"
                                        />
                                    </div>

                                    <Button onClick={calculateProRata} className="w-full gap-2">
                                        <Calculator className="h-4 w-4" />
                                        Calcular Pro-Rata
                                    </Button>
                                </div>

                                {proRataData.diasTotais && (
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="space-y-3">
                                                <h3 className="font-medium text-lg">Resultado do Cálculo</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-3 border rounded text-center">
                                                        <p className="text-2xl font-bold text-primary">{proRataData.diasTotais}</p>
                                                        <p className="text-sm text-muted-foreground">Dias totais</p>
                                                    </div>
                                                    <div className="p-3 border rounded text-center">
                                                        <p className="text-2xl font-bold text-green-600">
                                                            R$ {(parseFloat(proRataData.valorTotal) / parseInt(proRataData.diasTotais)).toFixed(2)}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">Valor por dia</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-green-50 border border-green-200 rounded">
                                                    <p className="text-sm text-green-800">
                                                        <strong>Valor proporcional:</strong> R$ {proRataData.valorTotal} ÷ {proRataData.diasTotais} dias = R$ {(parseFloat(proRataData.valorTotal) / parseInt(proRataData.diasTotais)).toFixed(2)} por dia
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Exemplos de Uso</h3>
                                    <div className="space-y-2">
                                        <div className="p-3 border rounded">
                                            <p className="font-medium">Contrato de serviço</p>
                                            <p className="text-sm text-muted-foreground">Calcular valor proporcional para serviço interrompido</p>
                                        </div>
                                        <div className="p-3 border rounded">
                                            <p className="font-medium">Hospedagem animal</p>
                                            <p className="text-sm text-muted-foreground">Cálculo diário de internação</p>
                                        </div>
                                        <div className="p-3 border rounded">
                                            <p className="font-medium">Plano de saúde</p>
                                            <p className="text-sm text-muted-foreground">Valor proporcional para adesão no meio do mês</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Tag className="h-5 w-5" />
                                    Etiquetas Avulsas
                                </CardTitle>
                                <CardDescription>
                                    Gere etiquetas individuais sem cadastro
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start">
                                        <Tag className="h-5 w-5 text-blue-600 mt=0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-800">Utilitário do manual</p>
                                            <p className="text-blue-700 text-sm mt-1">
                                                Imprima etiquetas avulsas para produtos, pastas, arquivos ou qualquer necessidade de identificação.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Modelo de Etiqueta</Label>
                                            <Select defaultValue="pimaco6180">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pimaco6180">PIMACO 6180 (Produtos)</SelectItem>
                                                    <SelectItem value="pimaco6182">PIMACO 6182 (Mala Direta)</SelectItem>
                                                    <SelectItem value="pimaco6181">PIMACO 6181</SelectItem>
                                                    <SelectItem value="personalizada">Personalizada</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Quantidade</Label>
                                            <Input type="number" defaultValue="1" min="1" max="100" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Texto da Etiqueta</Label>
                                        <Textarea
                                            placeholder="Digite o texto que aparecerá na etiqueta..."
                                            rows={4}
                                            defaultValue="CONSULTA VETERINÁRIA
R$ 120,00
Cód: 001.001"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Código de Barras (opcional)</Label>
                                        <Input placeholder="7891000315507" />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label className="font-medium">Incluir borda</Label>
                                            <p className="text-sm text-muted-foreground">Margem de corte</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Button variant="outline" className="gap-2">
                                            <Eye className="h-4 w-4" />
                                            Visualizar
                                        </Button>
                                        <Button className="gap-2">
                                            <Printer className="h-4 w-4" />
                                            Imprimir Etiquetas
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Modelos Prontos</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" size="sm" className="justify-start">
                                            EM TRATAMENTO
                                        </Button>
                                        <Button variant="outline" size="sm" className="justify-start">
                                            AGUARDANDO RETIRADA
                                        </Button>
                                        <Button variant="outline" size="sm" className="justify-start">
                                            VACINA PENDENTE
                                        </Button>
                                        <Button variant="outline" size="sm" className="justify-start">
                                            EXAME SOLICITADO
                                        </Button>
                                        <Button variant="outline" size="sm" className="justify-start">
                                            CONSULTA RETORNO
                                        </Button>
                                        <Button variant="outline" size="sm" className="justify-start">
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
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Lista de Usuários Conectados
                                </CardTitle>
                                <CardDescription>
                                    Monitoramento em tempo real dos usuários no sistema
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                                    <div className="flex items-start">
                                        <Users className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-800">Utilitário do manual</p>
                                            <p className="text-blue-700 text-sm mt-1">
                                                Visualize todos os usuários conectados ao sistema, com informações de terminal e tempo de sessão.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Usuário</TableHead>
                                            <TableHead>Cargo</TableHead>
                                            <TableHead>Entrada</TableHead>
                                            <TableHead>Terminal</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {connectedUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${user.nome === 'SUPERVISOR' ? 'bg-green-500' : 'bg-blue-500'}`} />
                                                        <span className={user.nome === 'SUPERVISOR' ? 'font-bold' : ''}>
                                                            {user.nome}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{user.cargo}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                                        {user.entrada}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{user.terminal}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="success">Online</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm">Mensagem</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className="mt-6 grid grid-cols-3 gap-4">
                                    <div className="p-4 border rounded text-center">
                                        <p className="text-2xl font-bold">{connectedUsers.length}</p>
                                        <p className="text-sm text-muted-foreground">Conectados</p>
                                    </div>
                                    <div className="p-4 border rounded text-center">
                                        <p className="text-2xl font-bold">10</p>
                                        <p className="text-sm text-muted-foreground">Limite</p>
                                    </div>
                                    <div className="p-4 border rounded text-center">
                                        <p className="text-2xl font-bold">4</p>
                                        <p className="text-sm text-muted-foreground">Disponíveis</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Painel de Controle
                                </CardTitle>
                                <CardDescription>
                                    Controle rápido do sistema
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start">
                                        <Settings className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-800">Utilitário do manual</p>
                                            <p className="text-blue-700 text-sm mt-1">
                                                Acesso rápido às configurações do sistema operacional.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Users className="h-4 w-4" />
                                        Contas de Usuário
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Printer className="h-4 w-4" />
                                        Impressoras e Dispositivos
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Smartphone className="h-4 w-4" />
                                        Rede e Internet
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <BarChart3 className="h-4 w-4" />
                                        Sistema e Segurança
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Clock className="h-4 w-4" />
                                        Data e Hora
                                    </Button>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <h3 className="font-medium">Ações Rápidas</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button size="sm" variant="outline">
                                            Backup
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            Limpar Cache
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            Reiniciar
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            Logs
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* ABA 4: OUTROS UTILITÁRIOS (do manual) */}
                <TabsContent value="outros">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Discagem Automática */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="h-5 w-5" />
                                    Discagem Automática
                                </CardTitle>
                                <CardDescription>
                                    Disque números automaticamente
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start">
                                        <Phone className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-800">Utilitário do manual</p>
                                            <p className="text-blue-700 text-sm mt-1">
                                                Disque números de telefone automaticamente através do modem.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <Label>Número de Telefone</Label>
                                        <Input placeholder="(11) 99999-9999" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Contatos Frequentes</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button variant="outline" size="sm" onClick={() => autoDial('(11) 3230-8742')}>
                                                Suporte SofVet
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => autoDial('(11) 99999-9999')}>
                                                Clínica Central
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => autoDial('190')}>
                                                Emergência
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => autoDial('192')}>
                                                SAMU
                                            </Button>
                                        </div>
                                    </div>
                                    <Button className="w-full gap-2" onClick={() => autoDial('(11) 99999-9999')}>
                                        <Phone className="h-4 w-4" />
                                        Discar Número
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tocar CD-Player */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Music className="h-5 w-5" />
                                    Tocar CD-Player
                                </CardTitle>
                                <CardDescription>
                                    Reprodutor de CD integrado
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start">
                                        <Music className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-800">Utilitário do manual</p>
                                            <p className="text-blue-700 text-sm mt-1">
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
                                        <p className="font-medium">CD de Música</p>
                                        <p className="text-sm text-muted-foreground">
                                            Faixa {cdPlayer.track} de {cdPlayer.totalTracks}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>{cdPlayer.time}</span>
                                            <span>{cdPlayer.totalTime}</span>
                                        </div>
                                        <Progress value={(cdPlayer.track / cdPlayer.totalTracks) * 100} className="h-1" />
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        <Button variant="outline" size="icon" onClick={prevTrack}>
                                            <Music className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" onClick={toggleCdPlayer}>
                                            {cdPlayer.playing ? (
                                                <Clock className="h-4 w-4" />
                                            ) : (
                                                <Music className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={nextTrack}>
                                            <Music className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="text-center text-sm text-muted-foreground">
                                        {cdPlayer.playing ? 'Reproduzindo...' : 'Pausado'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Jogo Puzzle */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Gamepad2 className="h-5 w-5" />
                                    Jogo Puzzle
                                </CardTitle>
                                <CardDescription>
                                    Quebra-cabeça para descontração
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start">
                                        <Gamepad2 className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-800">Utilitário do manual</p>
                                            <p className="text-blue-700 text-sm mt-1">
                                                Jogo de puzzle integrado para momentos de descontração.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                        <div className="grid grid-cols-3 gap-1 mb-4 mx-auto max-w-[200px]">
                                            {Array.from({ length: 9 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`aspect-square ${i < puzzleProgress / 11 ? 'bg-primary' : 'bg-gray-200'} rounded`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Complete o quebra-cabeça
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Progresso</span>
                                            <span>{puzzleProgress}%</span>
                                        </div>
                                        <Progress value={puzzleProgress} className="h-2" />
                                    </div>

                                    <Button
                                        onClick={playPuzzle}
                                        className="w-full gap-2"
                                        disabled={puzzleProgress > 0 && puzzleProgress < 100}
                                    >
                                        <Gamepad2 className="h-4 w-4" />
                                        {puzzleProgress === 0 ? 'Iniciar Jogo' :
                                            puzzleProgress === 100 ? 'Jogar Novamente' : 'Jogando...'}
                                    </Button>

                                    {puzzleProgress === 100 && (
                                        <div className="p-3 bg-green-50 border border-green-200 rounded text-center">
                                            <p className="font-medium text-green-800">Parabéns! 🎉</p>
                                            <p className="text-sm text-green-700">Puzzle completado com sucesso!</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Conversão DOS para Windows */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <RefreshCw className="h-5 w-5" />
                                    Conversão DOS para Windows
                                </CardTitle>
                                <CardDescription>
                                    Migre dados da versão DOS
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start">
                                        <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-800">Utilitário do manual</p>
                                            <p className="text-blue-700 text-sm mt-1">
                                                Converta dados da versão DOS do SOFVET para a versão Windows.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 border rounded-lg">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="bg-gray-100 p-2 rounded">
                                                <Database className="h-6 w-6 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Dados da versão DOS</p>
                                                <p className="text-sm text-muted-foreground">Arquivos .DBF e .DBT</p>
                                            </div>
                                        </div>
                                        <div className="text-sm space-y-1">
                                            <p>• Fichas de animais</p>
                                            <p>• Tabelas do sistema</p>
                                            <p>• Movimento financeiro</p>
                                            <p>• Configurações</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Pasta dos arquivos DOS</Label>
                                        <Input placeholder="C:\SOFVET\" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Destino Windows</Label>
                                        <Input placeholder="C:\SOFVETW\" defaultValue="C:\SOFVETW\" />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label className="font-medium">Manter backup DOS</Label>
                                            <p className="text-sm text-muted-foreground">Preservar arquivos originais</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <Button className="w-full gap-2">
                                        <RefreshCw className="h-4 w-4" />
                                        Iniciar Conversão
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Informações do Sistema
                            </CardTitle>
                            <CardDescription>
                                Detalhes técnicos e versões
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 border rounded">
                                    <p className="text-sm text-muted-foreground">Versão SofVet</p>
                                    <p className="font-bold">2.0.0</p>
                                </div>
                                <div className="p-4 border rounded">
                                    <p className="text-sm text-muted-foreground">Última atualização</p>
                                    <p className="font-bold">01/01/2024</p>
                                </div>
                                <div className="p-4 border rounded">
                                    <p className="text-sm text-muted-foreground">Total de utilitários</p>
                                    <p className="font-bold">9</p>
                                </div>
                                <div className="p-4 border rounded">
                                    <p className="text-sm text-muted-foreground">Compatibilidade</p>
                                    <p className="font-bold">Windows 7+</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Rodapé */}
            <div className="mt-8 pt-6 border-t">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        <p>Utilitários baseados no manual do SofVet</p>
                        <p className="text-xs">Conversão Excel • Cálculos • Usuários • Entretenimento</p>
                    </div>
                    <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        Sistema: {connectedUsers.length}/10 conectados
                    </Badge>
                </div>
            </div>
        </div>
    );
}