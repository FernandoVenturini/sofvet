'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Printer,
    Download,
    FileText,
    DollarSign,
    TrendingUp,
    BarChart3,
    PieChart,
    Users,
    PawPrint,
    Calendar,
    Filter,
    Search,
    RefreshCw,
    Sparkles,
    AlertTriangle,
    CheckCircle,
    Clock,
    CreditCard,
    Package,
    Syringe,
    Activity,
    Zap,
    Mail,
    Phone,
    Home,
    Tag,
    Award,
    TrendingDown,
    Database,
    FileBarChart,
    Bell,
    MapPin,
    Briefcase,
    Stethoscope,
    Shield,
    Heart,
    Thermometer,
    Brain,
    ChevronRight,
    Eye,
    MoreVertical,
    ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';

const Relatorios = () => {
    const [activeTab, setActiveTab] = useState('faturamento');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [dados, setDados] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [filtroVeterinario, setFiltroVeterinario] = useState('todos');
    const [filtroEspecie, setFiltroEspecie] = useState('todos');
    const [filtroStatus, setFiltroStatus] = useState('todos');

    // Estatísticas gerais
    const [estatisticas, setEstatisticas] = useState({
        totalFaturamento: 0,
        consultasHoje: 0,
        animaisAtendidos: 0,
        produtosVendidos: 0,
        vacinasPendentes: 0,
        devedores: 0
    });

    // Opções para selects
    const veterinarios = ['Dr. João Silva', 'Dra. Maria Santos', 'Dr. Pedro Costa', 'Todos'];
    const especies = ['Cão', 'Gato', 'Ave', 'Roedor', 'Réptil', 'Todos'];
    const statusPagamento = ['Pago', 'Pendente', 'Parcelado', 'Cancelado', 'Todos'];

    useEffect(() => {
        carregarEstatisticasGerais();
    }, []);

    useEffect(() => {
        if (dataInicio && dataFim) {
            carregarRelatorio();
        }
    }, [activeTab, dataInicio, dataFim, filtroVeterinario, filtroEspecie, filtroStatus]);

    const carregarEstatisticasGerais = async () => {
        try {
            // Carregar consultas para estatísticas
            const consultasSnap = await getDocs(collection(db, 'consultas'));
            const consultas = consultasSnap.docs.map(doc => doc.data());
            
            // Carregar animais
            const animaisSnap = await getDocs(collection(db, 'animais'));
            const animais = animaisSnap.docs.map(doc => doc.data());

            const hoje = new Date().toISOString().split('T')[0];
            const consultasHoje = consultas.filter(c => c.data === hoje).length;
            
            const totalFaturamento = consultas.reduce((sum, c) => sum + (c.total || 0), 0);
            
            // Contar animais únicos atendidos
            const animaisUnicos = [...new Set(consultas.map(c => c.animalId))].length;
            
            // Contar produtos vendidos
            const produtosVendidos = consultas.reduce((sum, c) => {
                return sum + (c.itens?.reduce((itemSum: number, item: any) => itemSum + item.quantidade, 0) || 0);
            }, 0);
            
            // Contar vacinas pendentes (simulação)
            const vacinasPendentes = animais.reduce((sum, a) => {
                return sum + (a.vacinas?.filter((v: any) => v.proximaData <= hoje).length || 0);
            }, 0);
            
            // Contar devedores (simulação)
            const devedores = consultas.filter(c => c.formaPagamento === 'parcelado' || c.status === 'pendente').length;

            setEstatisticas({
                totalFaturamento,
                consultasHoje,
                animaisAtendidos: animaisUnicos,
                produtosVendidos,
                vacinasPendentes,
                devedores
            });
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    };

    const carregarRelatorio = async () => {
        setLoading(true);
        try {
            let lista: any[] = [];

            if (activeTab === 'faturamento') {
                const snap = await getDocs(query(
                    collection(db, 'consultas'),
                    orderBy('data', 'desc')
                ));
                
                snap.forEach(doc => {
                    const d = doc.data();
                    if (d.data >= dataInicio && d.data <= dataFim) {
                        // Aplicar filtros adicionais
                        const veterinarioMatch = filtroVeterinario === 'todos' || d.veterinario === filtroVeterinario;
                        const statusMatch = filtroStatus === 'todos' || d.status === filtroStatus;
                        
                        if (veterinarioMatch && statusMatch) {
                            lista.push({
                                id: doc.id,
                                ...d,
                                dataFormatada: format(new Date(d.data), 'dd/MM/yyyy'),
                                hora: format(new Date(d.data), 'HH:mm')
                            });
                        }
                    }
                });
                setDados(lista);
            }

            if (activeTab === 'devedores') {
                const snap = await getDocs(query(
                    collection(db, 'consultas'),
                    where('status', 'in', ['pendente', 'parcelado'])
                ));
                
                snap.forEach(doc => {
                    const d = doc.data();
                    if (d.formaPagamento === 'parcelado' || d.status === 'pendente') {
                        lista.push({
                            id: doc.id,
                            ...d,
                            dataFormatada: format(new Date(d.data), 'dd/MM/yyyy'),
                            valorPendente: d.total - (d.valorPago || 0)
                        });
                    }
                });
                setDados(lista);
            }

            if (activeTab === 'vacinas-pendentes') {
                const snap = await getDocs(collection(db, 'animais'));
                
                snap.forEach(doc => {
                    const d = doc.data();
                    const vacinas = d.vacinas || [];
                    
                    vacinas.forEach((v: any) => {
                        if (v.proximaData && v.proximaData >= dataInicio && v.proximaData <= dataFim) {
                            // Filtro por espécie
                            const especieMatch = filtroEspecie === 'todos' || d.especie === filtroEspecie;
                            
                            if (especieMatch) {
                                lista.push({
                                    id: doc.id,
                                    animalNome: d.nomeAnimal,
                                    proprietario: d.nomeProprietario,
                                    telefone: d.telefoneProprietario,
                                    especie: d.especie,
                                    vacina: v.nomeVacina,
                                    dose: v.dose,
                                    dataAplicacao: v.dataAplicacao,
                                    proximaData: v.proximaData,
                                    proximaDataFormatada: format(new Date(v.proximaData), 'dd/MM/yyyy')
                                });
                            }
                        }
                    });
                });
                setDados(lista);
            }

            if (activeTab === 'animais-especie') {
                const snap = await getDocs(collection(db, 'animais'));
                const contagem: any = {};
                
                snap.forEach(doc => {
                    const especie = doc.data().especie || 'Não informada';
                    // Filtro por espécie
                    if (filtroEspecie === 'todos' || especie === filtroEspecie) {
                        contagem[especie] = (contagem[especie] || 0) + 1;
                    }
                });
                
                setDados(Object.entries(contagem).map(([especie, total]) => ({ 
                    especie, 
                    total,
                    porcentagem: ((total as number) / snap.size * 100).toFixed(1)
                })));
            }

            if (activeTab === 'produtos-vendidos') {
                const snap = await getDocs(query(
                    collection(db, 'consultas'),
                    where('data', '>=', dataInicio),
                    where('data', '<=', dataFim)
                ));
                
                const contagem: any = {};
                const faturamentoPorProduto: any = {};
                
                snap.forEach(doc => {
                    const itens = doc.data().itens || [];
                    itens.forEach((item: any) => {
                        const nome = item.nome || 'Sem nome';
                        contagem[nome] = (contagem[nome] || 0) + item.quantidade;
                        faturamentoPorProduto[nome] = (faturamentoPorProduto[nome] || 0) + item.subtotal;
                    });
                });
                
                const resultado = Object.entries(contagem).map(([nome, quantidade]) => ({ 
                    nome, 
                    quantidade,
                    faturamento: faturamentoPorProduto[nome] || 0
                }));
                
                // Ordenar por quantidade (mais vendidos primeiro)
                resultado.sort((a, b) => (b.quantidade as number) - (a.quantidade as number));
                setDados(resultado.slice(0, 20)); // Top 20
            }

            if (activeTab === 'mala-direta') {
                const snap = await getDocs(collection(db, 'animais'));
                
                snap.forEach(doc => {
                    const d = doc.data();
                    const vacinas = d.vacinas || [];
                    
                    vacinas.forEach((v: any) => {
                        if (v.proximaData) {
                            const proximaData = new Date(v.proximaData);
                            const hoje = new Date();
                            const diferencaDias = Math.ceil((proximaData.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
                            
                            // Mostrar apenas vacinas próximas (próximos 30 dias)
                            if (diferencaDias >= 0 && diferencaDias <= 30) {
                                lista.push({
                                    id: doc.id,
                                    animal: d.nomeAnimal,
                                    proprietario: d.nomeProprietario,
                                    telefone: d.telefoneProprietario,
                                    email: d.emailProprietario,
                                    endereco: d.enderecoProprietario,
                                    vacina: v.nomeVacina,
                                    dose: v.dose,
                                    dataAplicacao: v.dataAplicacao,
                                    proximaData: v.proximaData,
                                    proximaDataFormatada: format(proximaData, 'dd/MM/yyyy'),
                                    diasRestantes: diferencaDias
                                });
                            }
                        }
                    });
                });
                
                // Ordenar por data mais próxima
                lista.sort((a, b) => a.diasRestantes - b.diasRestantes);
                setDados(lista);
            }
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const formatarDataBR = (data: string) => {
        try {
            return format(new Date(data), 'dd/MM/yyyy');
        } catch {
            return data;
        }
    };

    const getTituloRelatorio = () => {
        const titulos: {[key: string]: string} = {
            'faturamento': 'Relatório de Faturamento',
            'devedores': 'Clientes com Pendências Financeiras',
            'vacinas-pendentes': 'Vacinas com Aplicação Pendente',
            'animais-especie': 'Distribuição de Animais por Espécie',
            'produtos-vendidos': 'Produtos e Serviços Mais Vendidos',
            'mala-direta': 'Mala Direta para Revacinação'
        };
        return titulos[activeTab] || 'Relatório';
    };

    const getDescricaoRelatorio = () => {
        const descricoes: {[key: string]: string} = {
            'faturamento': 'Análise detalhada do faturamento por período',
            'devedores': 'Clientes com pendências financeiras para acompanhamento',
            'vacinas-pendentes': 'Controle de vacinas com aplicação em atraso',
            'animais-especie': 'Distribuição de espécies atendidas na clínica',
            'produtos-vendidos': 'Ranking dos produtos e serviços mais vendidos',
            'mala-direta': 'Lista de clientes para contato de revacinação'
        };
        return descricoes[activeTab] || 'Relatório gerado pelo sistema';
    };

    const imprimirRelatorio = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const itensHTML = dados.map((item, index) => {
            if (activeTab === 'faturamento') {
                return `
                    <tr>
                        <td>${formatarDataBR(item.data)}</td>
                        <td>${item.animalNome}</td>
                        <td>${item.proprietarioNome}</td>
                        <td>${item.veterinario || 'Não informado'}</td>
                        <td>${formatarMoeda(item.total)}</td>
                    </tr>
                `;
            } else if (activeTab === 'devedores') {
                return `
                    <tr>
                        <td>${item.proprietarioNome}</td>
                        <td>${item.animalNome}</td>
                        <td>${item.dataFormatada}</td>
                        <td>${formatarMoeda(item.valorPendente || item.total)}</td>
                        <td>${item.parcelas || 1} parcela(s)</td>
                    </tr>
                `;
            } else if (activeTab === 'vacinas-pendentes') {
                return `
                    <tr>
                        <td>${item.animalNome}</td>
                        <td>${item.proprietario}</td>
                        <td>${item.especie}</td>
                        <td>${item.vacina}</td>
                        <td>${item.proximaDataFormatada}</td>
                    </tr>
                `;
            } else if (activeTab === 'animais-especie') {
                return `
                    <tr>
                        <td>${item.especie}</td>
                        <td>${item.total}</td>
                        <td>${item.porcentagem}%</td>
                    </tr>
                `;
            } else if (activeTab === 'produtos-vendidos') {
                return `
                    <tr>
                        <td>${item.nome}</td>
                        <td>${item.quantidade}</td>
                        <td>${formatarMoeda(item.faturamento)}</td>
                    </tr>
                `;
            } else if (activeTab === 'mala-direta') {
                return `
                    <tr>
                        <td>${item.animal}</td>
                        <td>${item.proprietario}</td>
                        <td>${item.telefone}</td>
                        <td>${item.vacina}</td>
                        <td>${item.proximaDataFormatada}</td>
                    </tr>
                `;
            }
            return '';
        }).join('');

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>${getTituloRelatorio()} - SofVet</title>
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
                            border-bottom: 2px solid #d1d5db;
                            padding-bottom: 20px;
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
                        td {
                            padding: 10px;
                            border-bottom: 1px solid #e5e7eb;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 50px;
                            color: #6b7280;
                        }
                        .periodo {
                            color: #6b7280;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">SofVet - Sistema Veterinário</div>
                        <div style="font-size: 24px; margin-bottom: 5px;">${getTituloRelatorio()}</div>
                        <div class="periodo">
                            Período: ${formatarDataBR(dataInicio)} até ${formatarDataBR(dataFim)}
                        </div>
                        <div class="periodo">
                            Data de emissão: ${formatarDataBR(new Date().toISOString())}
                        </div>
                    </div>
                    
                    <div class="info">
                        <div><strong>Descrição:</strong> ${getDescricaoRelatorio()}</div>
                        <div><strong>Total de registros:</strong> ${dados.length}</div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                ${activeTab === 'faturamento' ? '<th>Data</th><th>Animal</th><th>Proprietário</th><th>Veterinário</th><th>Valor</th>' : ''}
                                ${activeTab === 'devedores' ? '<th>Proprietário</th><th>Animal</th><th>Data</th><th>Valor Pendente</th><th>Parcelas</th>' : ''}
                                ${activeTab === 'vacinas-pendentes' ? '<th>Animal</th><th>Proprietário</th><th>Espécie</th><th>Vacina</th><th>Próxima Data</th>' : ''}
                                ${activeTab === 'animais-especie' ? '<th>Espécie</th><th>Quantidade</th><th>Porcentagem</th>' : ''}
                                ${activeTab === 'produtos-vendidos' ? '<th>Produto/Serviço</th><th>Quantidade</th><th>Faturamento</th>' : ''}
                                ${activeTab === 'mala-direta' ? '<th>Animal</th><th>Proprietário</th><th>Telefone</th><th>Vacina</th><th>Próxima Data</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            ${itensHTML}
                        </tbody>
                    </table>
                    
                    <div class="footer">
                        Relatório gerado automaticamente pelo sistema SofVet<br>
                        Sistema de Gestão Veterinária
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const exportarParaCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Cabeçalhos
        if (activeTab === 'faturamento') {
            csvContent += "Data,Animal,Proprietário,Veterinário,Valor\n";
            dados.forEach(item => {
                csvContent += `${formatarDataBR(item.data)},${item.animalNome},${item.proprietarioNome},${item.veterinario || ''},${item.total}\n`;
            });
        } else if (activeTab === 'devedores') {
            csvContent += "Proprietário,Animal,Data,Valor Pendente,Parcelas\n";
            dados.forEach(item => {
                csvContent += `${item.proprietarioNome},${item.animalNome},${formatarDataBR(item.data)},${item.valorPendente || item.total},${item.parcelas || 1}\n`;
            });
        } else if (activeTab === 'vacinas-pendentes') {
            csvContent += "Animal,Proprietário,Espécie,Vacina,Próxima Data\n";
            dados.forEach(item => {
                csvContent += `${item.animalNome},${item.proprietario},${item.especie},${item.vacina},${item.proximaDataFormatada}\n`;
            });
        } else if (activeTab === 'animais-especie') {
            csvContent += "Espécie,Quantidade,Porcentagem\n";
            dados.forEach(item => {
                csvContent += `${item.especie},${item.total},${item.porcentagem}%\n`;
            });
        } else if (activeTab === 'produtos-vendidos') {
            csvContent += "Produto/Serviço,Quantidade,Faturamento\n";
            dados.forEach(item => {
                csvContent += `${item.nome},${item.quantidade},${item.faturamento}\n`;
            });
        } else if (activeTab === 'mala-direta') {
            csvContent += "Animal,Proprietário,Telefone,Email,Vacina,Próxima Data,Dias Restantes\n";
            dados.forEach(item => {
                csvContent += `${item.animal},${item.proprietario},${item.telefone},${item.email || ''},${item.vacina},${item.proximaDataFormatada},${item.diasRestantes}\n`;
            });
        }
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${getTituloRelatorio().toLowerCase().replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30">
                            <FileBarChart className="h-6 w-6 text-red-400" />
                        </div>
                        <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 border border-red-500/30">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Relatórios SofVet
                        </Badge>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">
                        Relatórios e Estatísticas
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Análises detalhadas e relatórios do sistema veterinário
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={exportarParaCSV}
                        disabled={dados.length === 0}
                        className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Exportar CSV
                    </Button>
                    <Button
                        onClick={imprimirRelatorio}
                        disabled={dados.length === 0}
                        className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                    >
                        <Printer className="h-4 w-4" />
                        Imprimir Relatório
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Faturamento Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-2xl font-bold text-emerald-400">{formatarMoeda(estatisticas.totalFaturamento)}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20">
                                <DollarSign className="h-5 w-5 text-emerald-400" />
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
                                <p className="text-2xl font-bold text-blue-400">{estatisticas.consultasHoje}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
                                <Calendar className="h-5 w-5 text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Animais Atendidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-2xl font-bold text-amber-400">{estatisticas.animaisAtendidos}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-600/20 to-orange-600/20">
                                <PawPrint className="h-5 w-5 text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Produtos Vendidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-2xl font-bold text-purple-400">{estatisticas.produtosVendidos}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                                <Package className="h-5 w-5 text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Vacinas Pendentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-2xl font-bold text-red-400">{estatisticas.vacinasPendentes}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                                <Syringe className="h-5 w-5 text-red-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Clientes Devedores</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-2xl font-bold text-rose-400">{estatisticas.devedores}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-rose-600/20 to-pink-600/20">
                                <AlertTriangle className="h-5 w-5 text-rose-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Filter className="h-5 w-5 text-red-400" />
                        Filtros do Relatório
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        Configure os filtros para gerar o relatório desejado
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-3">
                            <Label className="text-white">Data Início</Label>
                            <Input
                                type="date"
                                value={dataInicio}
                                onChange={e => setDataInicio(e.target.value)}
                                className="bg-gray-900/50 border-gray-700/50 text-white"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-white">Data Fim</Label>
                            <Input
                                type="date"
                                value={dataFim}
                                onChange={e => setDataFim(e.target.value)}
                                className="bg-gray-900/50 border-gray-700/50 text-white"
                            />
                        </div>

                        {activeTab === 'faturamento' && (
                            <>
                                <div className="space-y-3">
                                    <Label className="text-white">Veterinário</Label>
                                    <Select value={filtroVeterinario} onValueChange={setFiltroVeterinario}>
                                        <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-800">
                                            {veterinarios.map(vet => (
                                                <SelectItem key={vet} value={vet === 'Todos' ? 'todos' : vet}>
                                                    {vet}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-white">Status Pagamento</Label>
                                    <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                                        <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-800">
                                            {statusPagamento.map(status => (
                                                <SelectItem key={status} value={status === 'Todos' ? 'todos' : status.toLowerCase()}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}

                        {(activeTab === 'vacinas-pendentes' || activeTab === 'animais-especie') && (
                            <div className="space-y-3">
                                <Label className="text-white">Espécie</Label>
                                <Select value={filtroEspecie} onValueChange={setFiltroEspecie}>
                                    <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-gray-800">
                                        {especies.map(especie => (
                                            <SelectItem key={especie} value={especie === 'Todos' ? 'todos' : especie}>
                                                {especie}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="flex items-end">
                            <Button
                                onClick={carregarRelatorio}
                                className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                disabled={!dataInicio || !dataFim}
                            >
                                <RefreshCw className="h-4 w-4" />
                                Gerar Relatório
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Abas dos Relatórios */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid grid-cols-2 md:grid-cols-6 bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50 p-1">
                    <TabsTrigger value="faturamento" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Faturamento
                    </TabsTrigger>
                    <TabsTrigger value="devedores" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Devedores
                    </TabsTrigger>
                    <TabsTrigger value="vacinas-pendentes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                        <Syringe className="h-4 w-4 mr-2" />
                        Vacinas
                    </TabsTrigger>
                    <TabsTrigger value="animais-especie" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                        <PawPrint className="h-4 w-4 mr-2" />
                        Espécies
                    </TabsTrigger>
                    <TabsTrigger value="produtos-vendidos" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                        <Package className="h-4 w-4 mr-2" />
                        Produtos
                    </TabsTrigger>
                    <TabsTrigger value="mala-direta" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
                        <Mail className="h-4 w-4 mr-2" />
                        Mala Direta
                    </TabsTrigger>
                </TabsList>

                {/* Conteúdo dos Relatórios */}
                <TabsContent value={activeTab} className="space-y-6">
                    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                        <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        {activeTab === 'faturamento' && <DollarSign className="h-5 w-5 text-red-400" />}
                                        {activeTab === 'devedores' && <AlertTriangle className="h-5 w-5 text-red-400" />}
                                        {activeTab === 'vacinas-pendentes' && <Syringe className="h-5 w-5 text-red-400" />}
                                        {activeTab === 'animais-especie' && <PawPrint className="h-5 w-5 text-red-400" />}
                                        {activeTab === 'produtos-vendidos' && <Package className="h-5 w-5 text-red-400" />}
                                        {activeTab === 'mala-direta' && <Mail className="h-5 w-5 text-red-400" />}
                                        {getTituloRelatorio()}
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">
                                        {getDescricaoRelatorio()}
                                        {dataInicio && dataFim && (
                                            <span className="ml-2">
                                                • Período: {formatarDataBR(dataInicio)} até {formatarDataBR(dataFim)}
                                            </span>
                                        )}
                                    </CardDescription>
                                </div>
                                <Badge className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30 self-start md:self-auto">
                                    {dados.length} registro{dados.length !== 1 ? 's' : ''} encontrado{dados.length !== 1 ? 's' : ''}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                                    <p className="text-gray-400">Gerando relatório...</p>
                                </div>
                            ) : dados.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileBarChart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg">Nenhum dado encontrado</p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        {!dataInicio || !dataFim 
                                            ? 'Selecione as datas de início e fim para gerar o relatório'
                                            : 'Não há registros para o período e filtros selecionados'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <ScrollArea className="h-[500px] pr-4">
                                    <div className="overflow-x-auto rounded-lg border border-gray-800/50">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-gray-800/50">
                                                    {activeTab === 'faturamento' && (
                                                        <>
                                                            <TableHead className="text-gray-400">Data</TableHead>
                                                            <TableHead className="text-gray-400">Animal</TableHead>
                                                            <TableHead className="text-gray-400">Proprietário</TableHead>
                                                            <TableHead className="text-gray-400">Veterinário</TableHead>
                                                            <TableHead className="text-gray-400">Pagamento</TableHead>
                                                            <TableHead className="text-gray-400 text-right">Valor</TableHead>
                                                        </>
                                                    )}
                                                    {activeTab === 'devedores' && (
                                                        <>
                                                            <TableHead className="text-gray-400">Proprietário</TableHead>
                                                            <TableHead className="text-gray-400">Animal</TableHead>
                                                            <TableHead className="text-gray-400">Data</TableHead>
                                                            <TableHead className="text-gray-400">Status</TableHead>
                                                            <TableHead className="text-gray-400 text-right">Valor Pendente</TableHead>
                                                            <TableHead className="text-gray-400">Parcelas</TableHead>
                                                        </>
                                                    )}
                                                    {activeTab === 'vacinas-pendentes' && (
                                                        <>
                                                            <TableHead className="text-gray-400">Animal</TableHead>
                                                            <TableHead className="text-gray-400">Proprietário</TableHead>
                                                            <TableHead className="text-gray-400">Espécie</TableHead>
                                                            <TableHead className="text-gray-400">Vacina</TableHead>
                                                            <TableHead className="text-gray-400">Dose</TableHead>
                                                            <TableHead className="text-gray-400 text-right">Próxima Data</TableHead>
                                                        </>
                                                    )}
                                                    {activeTab === 'animais-especie' && (
                                                        <>
                                                            <TableHead className="text-gray-400">Espécie</TableHead>
                                                            <TableHead className="text-gray-400 text-right">Quantidade</TableHead>
                                                            <TableHead className="text-gray-400 text-right">Porcentagem</TableHead>
                                                            <TableHead className="text-gray-400">Gráfico</TableHead>
                                                        </>
                                                    )}
                                                    {activeTab === 'produtos-vendidos' && (
                                                        <>
                                                            <TableHead className="text-gray-400">Produto/Serviço</TableHead>
                                                            <TableHead className="text-gray-400">Tipo</TableHead>
                                                            <TableHead className="text-gray-400 text-right">Quantidade</TableHead>
                                                            <TableHead className="text-gray-400 text-right">Faturamento</TableHead>
                                                            <TableHead className="text-gray-400">Ranking</TableHead>
                                                        </>
                                                    )}
                                                    {activeTab === 'mala-direta' && (
                                                        <>
                                                            <TableHead className="text-gray-400">Animal</TableHead>
                                                            <TableHead className="text-gray-400">Proprietário</TableHead>
                                                            <TableHead className="text-gray-400">Telefone</TableHead>
                                                            <TableHead className="text-gray-400">Vacina</TableHead>
                                                            <TableHead className="text-gray-400">Dias Restantes</TableHead>
                                                            <TableHead className="text-gray-400 text-right">Próxima Data</TableHead>
                                                        </>
                                                    )}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {dados.map((item, index) => (
                                                    <TableRow key={index} className="border-gray-800/30 hover:bg-gray-800/20">
                                                        {activeTab === 'faturamento' && (
                                                            <>
                                                                <TableCell className="text-white">
                                                                    <div className="space-y-1">
                                                                        <p>{item.dataFormatada}</p>
                                                                        <p className="text-xs text-gray-400">{item.hora}</p>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-white">{item.animalNome}</TableCell>
                                                                <TableCell className="text-white">{item.proprietarioNome}</TableCell>
                                                                <TableCell className="text-white">{item.veterinario || 'Não informado'}</TableCell>
                                                                <TableCell>
                                                                    <Badge className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30">
                                                                        {item.formaPagamento}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <p className="text-lg font-bold text-emerald-400">
                                                                        {formatarMoeda(item.total)}
                                                                    </p>
                                                                </TableCell>
                                                            </>
                                                        )}
                                                        {activeTab === 'devedores' && (
                                                            <>
                                                                <TableCell className="text-white font-medium">{item.proprietarioNome}</TableCell>
                                                                <TableCell className="text-white">{item.animalNome}</TableCell>
                                                                <TableCell className="text-white">{item.dataFormatada}</TableCell>
                                                                <TableCell>
                                                                    <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400 border border-red-500/30">
                                                                        Pendente
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <p className="text-lg font-bold text-red-400">
                                                                        {formatarMoeda(item.valorPendente || item.total)}
                                                                    </p>
                                                                </TableCell>
                                                                <TableCell className="text-white">{item.parcelas || 1} parcela(s)</TableCell>
                                                            </>
                                                        )}
                                                        {activeTab === 'vacinas-pendentes' && (
                                                            <>
                                                                <TableCell className="text-white font-medium">{item.animalNome}</TableCell>
                                                                <TableCell className="text-white">{item.proprietario}</TableCell>
                                                                <TableCell>
                                                                    <Badge className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-400 border border-amber-500/30">
                                                                        {item.especie}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-white">{item.vacina}</TableCell>
                                                                <TableCell className="text-white">{item.dose}</TableCell>
                                                                <TableCell className="text-right">
                                                                    <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400 border border-red-500/30">
                                                                        {item.proximaDataFormatada}
                                                                    </Badge>
                                                                </TableCell>
                                                            </>
                                                        )}
                                                        {activeTab === 'animais-especie' && (
                                                            <>
                                                                <TableCell className="text-white font-medium">{item.especie}</TableCell>
                                                                <TableCell className="text-right">
                                                                    <p className="text-2xl font-bold text-white">{item.total}</p>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <p className="text-lg font-bold text-blue-400">{item.porcentagem}%</p>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="w-full bg-gray-800 rounded-full h-2">
                                                                        <div 
                                                                            className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full"
                                                                            style={{ width: `${item.porcentagem}%` }}
                                                                        />
                                                                    </div>
                                                                </TableCell>
                                                            </>
                                                        )}
                                                        {activeTab === 'produtos-vendidos' && (
                                                            <>
                                                                <TableCell className="text-white font-medium">{item.nome}</TableCell>
                                                                <TableCell>
                                                                    <Badge className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400 border border-purple-500/30">
                                                                        {item.nome.includes('Vacina') || item.nome.includes('Vacinação') ? 'Serviço' : 'Produto'}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <p className="text-2xl font-bold text-white">{item.quantidade}</p>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <p className="text-lg font-bold text-emerald-400">
                                                                        {formatarMoeda(item.faturamento)}
                                                                    </p>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge className={`${
                                                                        index < 3 
                                                                            ? 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-400 border border-amber-500/30'
                                                                            : 'bg-gradient-to-r from-gray-600/20 to-gray-700/20 text-gray-400 border border-gray-500/30'
                                                                    }`}>
                                                                        #{index + 1}
                                                                    </Badge>
                                                                </TableCell>
                                                            </>
                                                        )}
                                                        {activeTab === 'mala-direta' && (
                                                            <>
                                                                <TableCell className="text-white font-medium">{item.animal}</TableCell>
                                                                <TableCell className="text-white">{item.proprietario}</TableCell>
                                                                <TableCell className="text-white">{item.telefone}</TableCell>
                                                                <TableCell className="text-white">{item.vacina}</TableCell>
                                                                <TableCell>
                                                                    <Badge className={`${
                                                                        item.diasRestantes <= 7
                                                                            ? 'bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400 border border-red-500/30'
                                                                            : item.diasRestantes <= 14
                                                                            ? 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-400 border border-amber-500/30'
                                                                            : 'bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-400 border border-emerald-500/30'
                                                                    }`}>
                                                                        {item.diasRestantes} dia{item.diasRestantes !== 1 ? 's' : ''}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <p className="text-white">{item.proximaDataFormatada}</p>
                                                                </TableCell>
                                                            </>
                                                        )}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </ScrollArea>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Relatorios;