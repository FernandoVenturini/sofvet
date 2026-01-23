'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Printer,
    Search,
    Eye,
    FileText,
    Calendar,
    DollarSign,
    Filter,
    Download,
    RefreshCw,
    ArrowLeft,
    User,
    PawPrint,
    CreditCard,
    Clock,
    Activity,
    Stethoscope,
    Package,
    Briefcase,
    TrendingUp,
    BarChart3,
    Sparkles,
    FileBarChart,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ChevronRight,
    MoreVertical,
    ExternalLink,
    Mail,
    Phone,
    Home,
    MapPin,
    Tag,
    Award,
    Zap
} from 'lucide-react';

interface Consulta {
    id: string;
    animalId: string;
    animalNome: string;
    proprietarioNome: string;
    data: string;
    dataFormatada?: string;
    hora?: string;
    total: number;
    subtotal?: number;
    desconto?: number;
    acrescimo?: number;
    formaPagamento: string;
    parcelas?: number;
    itens: Array<{
        id: string;
        tipo: 'produto' | 'servico';
        nome: string;
        quantidade: number;
        preco: number;
        desconto: number;
        subtotal: number;
    }>;
    veterinario?: string;
    tipoConsulta?: string;
    observacoes?: string;
    status?: string;
    userId: string;
    createdAt?: any;
}

const ListaConsultas = () => {
    const [consultas, setConsultas] = useState<Consulta[]>([]);
    const [busca, setBusca] = useState('');
    const [loading, setLoading] = useState(true);
    const [consultaSelecionada, setConsultaSelecionada] = useState<Consulta | null>(null);
    const [detalheOpen, setDetalheOpen] = useState(false);
    const [filtroStatus, setFiltroStatus] = useState<'todos' | 'finalizada' | 'cancelada' | 'pendente'>('todos');
    const [filtroPagamento, setFiltroPagamento] = useState<'todos' | 'dinheiro' | 'cartao' | 'pix' | 'parcelado'>('todos');
    const [filtroData, setFiltroData] = useState<'todos' | 'hoje' | 'semana' | 'mes'>('todos');

    useEffect(() => {
        carregarConsultas();
    }, []);

    const carregarConsultas = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'consultas'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const lista = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Consulta[];
            setConsultas(lista);
        } catch (error) {
            console.error('Erro ao carregar consultas:', error);
        } finally {
            setLoading(false);
        }
    };

    const consultasFiltradas = consultas.filter(c => {
        const buscaMatch =
            c.animalNome.toLowerCase().includes(busca.toLowerCase()) ||
            c.proprietarioNome.toLowerCase().includes(busca.toLowerCase()) ||
            (c.veterinario?.toLowerCase() || '').includes(busca.toLowerCase());

        const statusMatch =
            filtroStatus === 'todos' ||
            (filtroStatus === 'finalizada' && c.status === 'finalizada') ||
            (filtroStatus === 'cancelada' && c.status === 'cancelada') ||
            (filtroStatus === 'pendente' && c.status === 'pendente');

        const pagamentoMatch =
            filtroPagamento === 'todos' ||
            c.formaPagamento.includes(filtroPagamento);

        const dataMatch =
            filtroData === 'todos' ||
            (filtroData === 'hoje' && isHoje(new Date(c.data))) ||
            (filtroData === 'semana' && isEstaSemana(new Date(c.data))) ||
            (filtroData === 'mes' && isEsteMes(new Date(c.data)));

        return buscaMatch && statusMatch && pagamentoMatch && dataMatch;
    });

    const isHoje = (data: Date) => {
        const hoje = new Date();
        return data.getDate() === hoje.getDate() &&
               data.getMonth() === hoje.getMonth() &&
               data.getFullYear() === hoje.getFullYear();
    };

    const isEstaSemana = (data: Date) => {
        const hoje = new Date();
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - hoje.getDay());
        const fimSemana = new Date(hoje);
        fimSemana.setDate(hoje.getDate() + (6 - hoje.getDay()));
        return data >= inicioSemana && data <= fimSemana;
    };

    const isEsteMes = (data: Date) => {
        const hoje = new Date();
        return data.getMonth() === hoje.getMonth() &&
               data.getFullYear() === hoje.getFullYear();
    };

    const formatarData = (data: string) => {
        try {
            return new Date(data).toLocaleDateString('pt-BR');
        } catch {
            return data;
        }
    };

    const formatarHora = (data: string) => {
        try {
            return new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch {
            return '';
        }
    };

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const getStatusBadge = (status: string = 'finalizada') => {
        switch (status) {
            case 'finalizada':
                return { color: 'from-emerald-600/20 to-green-600/20', textColor: 'text-emerald-400', icon: CheckCircle, label: 'Finalizada' };
            case 'cancelada':
                return { color: 'from-red-600/20 to-pink-600/20', textColor: 'text-red-400', icon: XCircle, label: 'Cancelada' };
            case 'pendente':
                return { color: 'from-amber-600/20 to-orange-600/20', textColor: 'text-amber-400', icon: Clock, label: 'Pendente' };
            default:
                return { color: 'from-gray-600/20 to-gray-700/20', textColor: 'text-gray-400', icon: Clock, label: 'Pendente' };
        }
    };

    const getPagamentoBadge = (formaPagamento: string) => {
        switch (formaPagamento) {
            case 'dinheiro':
                return { color: 'from-emerald-600/20 to-green-600/20', textColor: 'text-emerald-400', icon: DollarSign, label: 'Dinheiro' };
            case 'cartao_debito':
            case 'cartao_credito':
                return { color: 'from-blue-600/20 to-cyan-600/20', textColor: 'text-blue-400', icon: CreditCard, label: 'Cartão' };
            case 'pix':
                return { color: 'from-amber-600/20 to-orange-600/20', textColor: 'text-amber-400', icon: Zap, label: 'PIX' };
            case 'parcelado':
                return { color: 'from-purple-600/20 to-pink-600/20', textColor: 'text-purple-400', icon: Calendar, label: 'Parcelado' };
            default:
                return { color: 'from-gray-600/20 to-gray-700/20', textColor: 'text-gray-400', icon: DollarSign, label: formaPagamento };
        }
    };

    const abrirDetalhes = (consulta: Consulta) => {
        setConsultaSelecionada(consulta);
        setDetalheOpen(true);
    };

    const imprimirRecibo = (consulta: Consulta) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const itensHTML = consulta.itens.map(item => `
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px; text-align: left;">${item.nome}</td>
                <td style="padding: 8px; text-align: center;">${item.quantidade}</td>
                <td style="padding: 8px; text-align: right;">${formatarMoeda(item.preco)}</td>
                <td style="padding: 8px; text-align: right;">${item.desconto}%</td>
                <td style="padding: 8px; text-align: right; font-weight: bold;">${formatarMoeda(item.subtotal)}</td>
            </tr>
        `).join('');

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Recibo - SofVet</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 40px;
                            color: #000;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .logo {
                            font-size: 28px;
                            font-weight: bold;
                            color: #dc2626;
                            margin-bottom: 10px;
                        }
                        .info {
                            margin-bottom: 20px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 20px 0;
                        }
                        th {
                            background-color: #f3f4f6;
                            padding: 12px;
                            text-align: left;
                            font-weight: bold;
                            border-bottom: 2px solid #d1d5db;
                        }
                        .total {
                            text-align: right;
                            font-size: 20px;
                            font-weight: bold;
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 2px solid #d1d5db;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 50px;
                            color: #6b7280;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">SofVet - Sistema Veterinário</div>
                        <div style="font-size: 18px; margin-bottom: 5px;">Recibo de Consulta</div>
                        <div style="color: #6b7280;">${formatarData(consulta.data)} às ${formatarHora(consulta.data)}</div>
                    </div>
                    
                    <div class="info">
                        <div><strong>Animal:</strong> ${consulta.animalNome}</div>
                        <div><strong>Proprietário:</strong> ${consulta.proprietarioNome}</div>
                        <div><strong>Veterinário:</strong> ${consulta.veterinario || 'Não informado'}</div>
                        <div><strong>Tipo de Consulta:</strong> ${consulta.tipoConsulta || 'Rotina'}</div>
                        <div><strong>Forma de Pagamento:</strong> ${getPagamentoBadge(consulta.formaPagamento).label}</div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th style="text-align: center;">Qtd</th>
                                <th style="text-align: right;">Preço Unit.</th>
                                <th style="text-align: right;">Desc.</th>
                                <th style="text-align: right;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itensHTML}
                        </tbody>
                    </table>
                    
                    <div style="text-align: right; margin-top: 20px;">
                        <div>Subtotal: ${formatarMoeda(consulta.subtotal || consulta.total)}</div>
                        ${consulta.desconto ? `<div>Desconto (${consulta.desconto}%): -${formatarMoeda((consulta.subtotal || consulta.total) * (consulta.desconto / 100))}</div>` : ''}
                        ${consulta.acrescimo ? `<div>Acréscimo (${consulta.acrescimo}%): +${formatarMoeda((consulta.subtotal || consulta.total) * (consulta.acrescimo / 100))}</div>` : ''}
                        <div class="total">Total: ${formatarMoeda(consulta.total)}</div>
                    </div>
                    
                    ${consulta.observacoes ? `
                        <div style="margin-top: 30px; padding: 15px; background-color: #f9fafb; border-left: 4px solid #dc2626;">
                            <strong>Observações:</strong> ${consulta.observacoes}
                        </div>
                    ` : ''}
                    
                    <div class="footer">
                        Obrigado pela preferência!<br>
                        SofVet - Sistema de Gestão Veterinária
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    // Estatísticas
    const totalConsultas = consultas.length;
    const consultasHoje = consultas.filter(c => isHoje(new Date(c.data))).length;
    const totalFaturamento = consultas.reduce((sum, c) => sum + c.total, 0);
    const faturamentoMes = consultas
        .filter(c => isEsteMes(new Date(c.data)))
        .reduce((sum, c) => sum + c.total, 0);
    const consultasFinalizadas = consultas.filter(c => c.status === 'finalizada').length;
    const consultasCanceladas = consultas.filter(c => c.status === 'cancelada').length;

    if (loading && consultas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <p className="text-gray-400">Carregando consultas...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30">
                            <FileText className="h-6 w-6 text-red-400" />
                        </div>
                        <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-white-100 border border-red-500/30">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Lista de Consultas - Historico
                        </Badge>
                    </div>
                    <h1 className="text-4xl font-bold text-green-400">
                        Consultas Realizadas
                    </h1>
                    <p className="text-gray-400 mt-2 mb-5">
                        Histórico completo de todos os atendimentos realizados
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="border-gray-700 text-gray-400 hover:text-white hover:bg-green-800/30 hover:border-green-300"
                        onClick={carregarConsultas}
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Atualizar
                    </Button>
                    <Button
                        className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                        onClick={() => window.print()}
                    >
                        <Printer className="h-4 w-4" />
                        Imprimir Relatório
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total de Consultas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-white">{totalConsultas}</p>
                                <p className="text-sm text-gray-400">Atendimentos realizados</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                                <Stethoscope className="h-5 w-5 text-red-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Consultas Hoje</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-emerald-400">{consultasHoje}</p>
                                <p className="text-sm text-gray-400">Atendimentos hoje</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20">
                                <Activity className="h-5 w-5 text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Faturamento Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-amber-400">{formatarMoeda(totalFaturamento)}</p>
                                <p className="text-sm text-gray-400">Total recebido</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-600/20 to-orange-600/20">
                                <DollarSign className="h-5 w-5 text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Faturamento Mês</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-blue-400">{formatarMoeda(faturamentoMes)}</p>
                                <p className="text-sm text-gray-400">Receita deste mês</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
                                <TrendingUp className="h-5 w-5 text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros e Busca */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 mb-5">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Buscar por animal, proprietário ou veterinário..."
                                    value={busca}
                                    onChange={e => setBusca(e.target.value)}
                                    className="pl-10 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Select value={filtroStatus} onValueChange={(value: any) => setFiltroStatus(value)}>
                                <SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-700/50 text-white">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        <SelectValue placeholder="Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-800">
                                    <SelectItem value="todos">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-gray-600/20 to-gray-700/20" />
                                            Todos
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="finalizada">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-600/20 to-green-600/20" />
                                            Finalizadas
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="cancelada">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-600/20 to-pink-600/20" />
                                            Canceladas
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="pendente">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-600/20 to-orange-600/20" />
                                            Pendentes
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filtroPagamento} onValueChange={(value: any) => setFiltroPagamento(value)}>
                                <SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-700/50 text-white">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        <SelectValue placeholder="Pagamento" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-800">
                                    <SelectItem value="todos">Todos</SelectItem>
                                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                    <SelectItem value="cartao">Cartão</SelectItem>
                                    <SelectItem value="pix">PIX</SelectItem>
                                    <SelectItem value="parcelado">Parcelado</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filtroData} onValueChange={(value: any) => setFiltroData(value)}>
                                <SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-700/50 text-white">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <SelectValue placeholder="Período" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-800">
                                    <SelectItem value="todos">Todos</SelectItem>
                                    <SelectItem value="hoje">Hoje</SelectItem>
                                    <SelectItem value="semana">Esta Semana</SelectItem>
                                    <SelectItem value="mes">Este Mês</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabela de Consultas */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-orange-400" />
                            <span>Histórico de Consultas</span>
                        </div>
                        <div className="text-sm text-gray-400">
                            Mostrando {consultasFiltradas.length} de {consultas.length} consultas
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {consultas.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">Nenhuma consulta registrada</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Registre sua primeira consulta no sistema
                            </p>
                            <Button
                                className="mt-4 gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                onClick={() => window.location.href = '/movimento/nova'}
                            >
                                <Plus className="h-4 w-4" />
                                Nova Consulta
                            </Button>
                        </div>
                    ) : consultasFiltradas.length === 0 ? (
                        <div className="text-center py-12">
                            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">Nenhuma consulta encontrada</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Tente ajustar os termos da busca ou os filtros
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-800/50">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-800/50">
                                        <TableHead className="text-gray-400">Data/Hora</TableHead>
                                        <TableHead className="text-gray-400">Animal</TableHead>
                                        <TableHead className="text-gray-400 hidden md:table-cell">Proprietário</TableHead>
                                        <TableHead className="text-gray-400 hidden lg:table-cell">Veterinário</TableHead>
                                        <TableHead className="text-gray-400">Status</TableHead>
                                        <TableHead className="text-gray-400">Pagamento</TableHead>
                                        <TableHead className="text-gray-400 text-right">Total</TableHead>
                                        <TableHead className="text-gray-400 text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {consultasFiltradas.map(consulta => {
                                        const statusBadge = getStatusBadge(consulta.status);
                                        const pagamentoBadge = getPagamentoBadge(consulta.formaPagamento);
                                        
                                        return (
                                            <TableRow
                                                key={consulta.id}
                                                className="border-gray-800/30 hover:bg-gray-800/20"
                                            >
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <p className="text-white font-medium">
                                                            {formatarData(consulta.data)}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {formatarHora(consulta.data)}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <PawPrint className="h-4 w-4 text-blue-400" />
                                                        <span className="text-white font-medium">
                                                            {consulta.animalNome}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-white hidden md:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-gray-400" />
                                                        {consulta.proprietarioNome}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-white hidden lg:table-cell">
                                                    {consulta.veterinario || 'Não informado'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`bg-gradient-to-r border ${statusBadge.color} ${statusBadge.textColor} border-gray-700`}>
                                                        <statusBadge.icon className="h-3 w-3 mr-1" />
                                                        {statusBadge.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`bg-gradient-to-r border ${pagamentoBadge.color} ${pagamentoBadge.textColor} border-gray-700`}>
                                                        <pagamentoBadge.icon className="h-3 w-3 mr-1" />
                                                        {pagamentoBadge.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <p className="text-lg font-bold text-emerald-400">
                                                        {formatarMoeda(consulta.total)}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => abrirDetalhes(consulta)}
                                                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => imprimirRecibo(consulta)}
                                                            className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                                                        >
                                                            <Printer className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* MODAL DE DETALHES */}
            <Dialog open={detalheOpen} onOpenChange={setDetalheOpen}>
                <DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 text-white max-w-4xl max-h-[90vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-red-400" />
                            Detalhes da Consulta
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            {consultaSelecionada?.animalNome} - {formatarData(consultaSelecionada?.data || '')}
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="h-[calc(90vh-200px)] pr-4">
                        {consultaSelecionada && (
                            <div className="space-y-6">
                                {/* Informações Principais */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-white text-sm">Informações do Atendimento</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Animal:</span>
                                                <span className="text-white font-medium">{consultaSelecionada.animalNome}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Proprietário:</span>
                                                <span className="text-white font-medium">{consultaSelecionada.proprietarioNome}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Data:</span>
                                                <span className="text-white">{formatarData(consultaSelecionada.data)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Hora:</span>
                                                <span className="text-white">{formatarHora(consultaSelecionada.data)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Veterinário:</span>
                                                <span className="text-white">{consultaSelecionada.veterinario || 'Não informado'}</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-white text-sm">Informações Financeiras</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Status:</span>
                                                <Badge className={`bg-gradient-to-r border ${getStatusBadge(consultaSelecionada.status).color} ${getStatusBadge(consultaSelecionada.status).textColor} border-gray-700`}>
                                                    {getStatusBadge(consultaSelecionada.status).label}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Pagamento:</span>
                                                <Badge className={`bg-gradient-to-r border ${getPagamentoBadge(consultaSelecionada.formaPagamento).color} ${getPagamentoBadge(consultaSelecionada.formaPagamento).textColor} border-gray-700`}>
                                                    {getPagamentoBadge(consultaSelecionada.formaPagamento).label}
                                                </Badge>
                                            </div>
                                            {consultaSelecionada.parcelas && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Parcelas:</span>
                                                    <span className="text-white">{consultaSelecionada.parcelas}x</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Subtotal:</span>
                                                <span className="text-white">{formatarMoeda(consultaSelecionada.subtotal || consultaSelecionada.total)}</span>
                                            </div>
                                            {consultaSelecionada.desconto && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Desconto:</span>
                                                    <span className="text-emerald-400">{consultaSelecionada.desconto}%</span>
                                                </div>
                                            )}
                                            {consultaSelecionada.acrescimo && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Acréscimo:</span>
                                                    <span className="text-red-400">{consultaSelecionada.acrescimo}%</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Itens da Consulta */}
                                <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                    <CardHeader>
                                        <CardTitle className="text-white text-sm">Itens da Consulta</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-gray-800/50">
                                                    <TableHead className="text-gray-400">Item</TableHead>
                                                    <TableHead className="text-gray-400">Tipo</TableHead>
                                                    <TableHead className="text-gray-400 text-right">Qtd</TableHead>
                                                    <TableHead className="text-gray-400 text-right">Preço Unit.</TableHead>
                                                    <TableHead className="text-gray-400 text-right">Desc.</TableHead>
                                                    <TableHead className="text-gray-400 text-right">Subtotal</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {consultaSelecionada.itens.map((item, index) => (
                                                    <TableRow key={index} className="border-gray-800/30">
                                                        <TableCell className="text-white">{item.nome}</TableCell>
                                                        <TableCell>
                                                            <Badge className={`bg-gradient-to-r border ${
                                                                item.tipo === 'produto'
                                                                    ? 'from-blue-600/20 to-cyan-600/20 text-blue-400'
                                                                    : 'from-emerald-600/20 to-green-600/20 text-emerald-400'
                                                            } border-gray-700`}>
                                                                {item.tipo === 'produto' ? 'Produto' : 'Serviço'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-white text-right">{item.quantidade}</TableCell>
                                                        <TableCell className="text-white text-right">{formatarMoeda(item.preco)}</TableCell>
                                                        <TableCell className="text-white text-right">{item.desconto}%</TableCell>
                                                        <TableCell className="text-white text-right font-bold">
                                                            {formatarMoeda(item.subtotal)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>

                                        <div className="mt-6 pt-6 border-t border-gray-800/50">
                                            <div className="flex justify-end">
                                                <div className="space-y-2 text-right">
                                                    <div className="flex justify-between items-center gap-8">
                                                        <span className="text-gray-400">Subtotal:</span>
                                                        <span className="text-white text-lg">{formatarMoeda(consultaSelecionada.subtotal || consultaSelecionada.total)}</span>
                                                    </div>
                                                    {consultaSelecionada.desconto && (
                                                        <div className="flex justify-between items-center gap-8">
                                                            <span className="text-gray-400">Desconto ({consultaSelecionada.desconto}%):</span>
                                                            <span className="text-emerald-400 text-lg">-{formatarMoeda((consultaSelecionada.subtotal || consultaSelecionada.total) * (consultaSelecionada.desconto / 100))}</span>
                                                        </div>
                                                    )}
                                                    {consultaSelecionada.acrescimo && (
                                                        <div className="flex justify-between items-center gap-8">
                                                            <span className="text-gray-400">Acréscimo ({consultaSelecionada.acrescimo}%):</span>
                                                            <span className="text-red-400 text-lg">+{formatarMoeda((consultaSelecionada.subtotal || consultaSelecionada.total) * (consultaSelecionada.acrescimo / 100))}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between items-center gap-8 pt-2 border-t border-gray-800/50">
                                                        <span className="text-white text-xl font-bold">Total:</span>
                                                        <span className="text-emerald-400 text-2xl font-bold">{formatarMoeda(consultaSelecionada.total)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Observações */}
                                {consultaSelecionada.observacoes && (
                                    <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50">
                                        <CardHeader>
                                            <CardTitle className="text-white text-sm">Observações</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-white bg-gray-900/30 p-4 rounded">
                                                {consultaSelecionada.observacoes}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}
                    </ScrollArea>

                    <DialogFooter className="pt-6 border-t border-gray-800/50">
                        <Button
                            variant="outline"
                            onClick={() => setDetalheOpen(false)}
                            className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                        >
                            Fechar
                        </Button>
                        {consultaSelecionada && (
                            <Button
                                onClick={() => {
                                    imprimirRecibo(consultaSelecionada);
                                    setDetalheOpen(false);
                                }}
                                className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                            >
                                <Printer className="h-4 w-4" />
                                Imprimir Recibo
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// Import necessário para o ícone Plus
import { Plus } from 'lucide-react';

export default ListaConsultas;