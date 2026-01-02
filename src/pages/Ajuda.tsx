import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
    LifeBuoy
} from 'lucide-react';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export default function Ajuda() {
    const [contactForm, setContactForm] = useState({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmitContact = () => {
        if (!contactForm.nome || !contactForm.email || !contactForm.mensagem) {
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }

        toast.success('Mensagem enviada com sucesso!', {
            description: 'Nossa equipe entrará em contato em breve.'
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
            answer: 'Acesse Diversos → Backup Diário. Para versões Windows 7 ou superior, copie a pasta SOFVETW para um pendrive. Para Windows 98 ou inferior, use a rotina interna de backup.',
            category: 'backup'
        },
        {
            question: 'Como cadastrar uma nova vacina?',
            answer: 'Vá para Tabelas → Vacinas. Clique no botão de adicionar (+) e preencha: nome da vacina, número de doses e periodicidade. Use pelo menos 2 doses para vacinas anuais.',
            category: 'tabelas'
        },
        {
            question: 'Como emitir um atestado de saúde?',
            answer: 'Na ficha do animal, clique na aba "Impressos" e selecione "Atestado de Saúde". Os dados do animal serão preenchidos automaticamente.',
            category: 'impressos'
        },
        {
            question: 'O que fazer se aparecer "VOCÊ PRECISA INSTALAR OS FONTES"?',
            answer: 'Acesse o menu Iniciar → Configurações → Painel de Controle → Fontes → Arquivo → Instalar Fontes Novas. Selecione a pasta SOFVETW e instale as fontes FOXFONT, FOXPRINT e 3OF9.',
            category: 'problemas'
        },
        {
            question: 'Como trabalhar em rede com o SofVet?',
            answer: '1. Compartilhe a pasta SOFVET no servidor. 2. Nos terminais, instale apenas as fontes. 3. Mapeie a unidade de rede. 4. Crie um atalho para SOFVETW.EXE na pasta compartilhada.',
            category: 'rede'
        },
        {
            question: 'Como calcular dose de medicamento no DEF?',
            answer: 'Na ficha do animal, clique no ícone do DEF. Cadastre primeiro o peso do animal. Clique em "Dosagem" para calcular automaticamente baseado no peso e espécie.',
            category: 'def'
        },
        {
            question: 'Como enviar mensagens para outros usuários?',
            answer: 'Acesse Diversos → Mensagens. Clique em "Enviar Mensagem", selecione o destinatário (ou "Todos") e escreva sua mensagem.',
            category: 'mensagens'
        },
        {
            question: 'O que é o ponteiro de última mensagem lida?',
            answer: 'É um controle que mostra qual foi a última mensagem que você leu. Útil para não perder mensagens importantes.',
            category: 'mensagens'
        }
    ];

    const commonProblems = [
        {
            problema: 'Não consigo utilizar o SOFVET em rede!',
            solucao: 'Verifique se o HD do servidor está compartilhado e se a pasta SOFVETW tem permissão completa. Nos terminais, instale apenas as fontes e mapeie a unidade de rede.',
            gravidade: 'alta'
        },
        {
            problema: 'Quando entro no SOFVET, aparece: "O SUPERVISOR BLOQUEOU SUA ENTRADA"',
            solucao: 'Apague o arquivo DISABLE.SYS na pasta SOFVETW. Este arquivo é criado durante o backup e às vezes não é removido automaticamente.',
            gravidade: 'media'
        },
        {
            problema: 'Erro de biblioteca na Agenda',
            solucao: 'Execute como administrador: C:\\SOFVETW\\REGSVR32.EXE MSCAL.OCX /U /S e depois C:\\SOFVETW\\REGSVR32.EXE MSCAL.OCX /S',
            gravidade: 'baixa'
        },
        {
            problema: 'Perdi todos os dados. O que fazer?',
            solucao: 'Se você faz backup regularmente, reinstale o SOFVET e restaure o último backup. Caso contrário, entre em contato com o suporte técnico.',
            gravidade: 'alta'
        },
        {
            problema: 'Impressão de etiquetas fora do alinhamento',
            solucao: 'Ajuste as configurações de cabeçalho e tabulação em Diversos → Configurações → Impressão. Faça uma impressão de teste após cada ajuste.',
            gravidade: 'baixa'
        }
    ];

    const updates = [
        { version: '2.0.0', date: '01/01/2024', changes: ['Versão inicial do SofVet', 'Interface moderna', 'Todas funcionalidades do SofVet'] },
        { version: '1.9.5', date: '15/12/2023', changes: ['Correção de bugs no movimento', 'Melhorias no backup'] },
        { version: '1.9.0', date: '01/12/2023', changes: ['Novo módulo de mensagens', 'Utilitários adicionados'] },
        { version: '1.8.0', date: '15/11/2023', changes: ['Sistema de backup automático', 'Exportação para Excel'] },
    ];

    const filteredFaq = searchTerm
        ? faqItems.filter(item =>
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : faqItems;

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <HelpCircle className="h-8 w-8" />
                            Central de Ajuda
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Encontre respostas, tutoriais e suporte para o SofVet
                        </p>
                    </div>
                    <Badge variant="outline" className="gap-2">
                        <Award className="h-4 w-4" />
                        Versão 2.0.0
                    </Badge>
                </div>

                {/* Barra de busca */}
                <div className="mt-6 relative">
                    <div className="relative">
                        <Input
                            placeholder="Buscar na ajuda (digite sua dúvida)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-6 text-lg"
                        />
                        <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                    </div>
                    {searchTerm && (
                        <div className="absolute z-10 w-full bg-white border rounded-b-lg shadow-lg">
                            <div className="p-4">
                                <p className="text-sm text-muted-foreground mb-2">
                                    {filteredFaq.length} resultados para "{searchTerm}"
                                </p>
                                {filteredFaq.slice(0, 3).map((item, index) => (
                                    <div key={index} className="p-3 hover:bg-gray-50 rounded cursor-pointer">
                                        <p className="font-medium">{item.question}</p>
                                        <p className="text-sm text-muted-foreground truncate">{item.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Tabs defaultValue="sobre" className="w-full">
                <TabsList className="grid grid-cols-5 mb-8">
                    <TabsTrigger value="sobre" className="gap-2">
                        <Info className="h-4 w-4" />
                        Sobre
                    </TabsTrigger>
                    <TabsTrigger value="faq" className="gap-2">
                        <HelpCircle className="h-4 w-4" />
                        FAQ
                    </TabsTrigger>
                    <TabsTrigger value="suporte" className="gap-2">
                        <LifeBuoy className="h-4 w-4" />
                        Suporte
                    </TabsTrigger>
                    <TabsTrigger value="problemas" className="gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Problemas
                    </TabsTrigger>
                    <TabsTrigger value="atualizacoes" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Atualizações
                    </TabsTrigger>
                </TabsList>

                {/* ABA 1: SOBRE O SISTEMA (Baseado no manual) */}
                <TabsContent value="sobre">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="h-5 w-5" />
                                    Sobre o SofVet
                                </CardTitle>
                                <CardDescription>
                                    Informações do sistema, licença e créditos
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start">
                                        <BookOpen className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-800">Baseado no manual do SofVet</p>
                                            <p className="text-blue-700 text-sm mt-1">
                                                O SofVet é uma evolução moderna do tradicional SofVet, mantendo todas as funcionalidades com uma interface atualizada.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Informações do Sistema</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Nome do Sistema</Label>
                                            <div className="p-3 border rounded bg-gray-50">
                                                <p className="font-medium">SofVet - Software Veterinário</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Versão</Label>
                                            <div className="p-3 border rounded bg-gray-50">
                                                <p className="font-medium">2.0.0 (Baseado no SofVet)</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Data da Versão</Label>
                                            <div className="p-3 border rounded bg-gray-50">
                                                <p className="font-medium">01 de Janeiro de 2024</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Licenciado para</Label>
                                            <div className="p-3 border rounded bg-gray-50">
                                                <p className="font-medium">Clínica Veterinária Jardins</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Características do Sistema</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="p-4 border rounded text-center">
                                            <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
                                            <p className="font-medium">Gestão Completa</p>
                                            <p className="text-xs text-muted-foreground">Clínica + Pet Shop</p>
                                        </div>
                                        <div className="p-4 border rounded text-center">
                                            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                                            <p className="font-medium">Multi-usuário</p>
                                            <p className="text-xs text-muted-foreground">Até 10 terminais</p>
                                        </div>
                                        <div className="p-4 border rounded text-center">
                                            <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                                            <p className="font-medium">Backup Automático</p>
                                            <p className="text-xs text-muted-foreground">Proteção de dados</p>
                                        </div>
                                        <div className="p-4 border rounded text-center">
                                            <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                                            <p className="font-medium">Relatórios</p>
                                            <p className="text-xs text-muted-foreground">Completos</p>
                                        </div>
                                        <div className="p-4 border rounded text-center">
                                            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
                                            <p className="font-medium">Mensagens</p>
                                            <p className="text-xs text-muted-foreground">Comunicação interna</p>
                                        </div>
                                        <div className="p-4 border rounded text-center">
                                            <Settings className="h-8 w-8 mx-auto mb-2 text-primary" />
                                            <p className="font-medium">Utilitários</p>
                                            <p className="text-xs text-muted-foreground">Ferramentas extras</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Requisitos do Sistema</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 border rounded">
                                            <div className="flex items-center gap-3">
                                                <Settings className="h-5 w-5" />
                                                <div>
                                                    <p className="font-medium">Sistema Operacional</p>
                                                    <p className="text-sm text-muted-foreground">Windows 7 ou superior</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline">Recomendado</Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded">
                                            <div className="flex items-center gap-3">
                                                <Database className="h-5 w-5" />
                                                <div>
                                                    <p className="font-medium">Memória RAM</p>
                                                    <p className="text-sm text-muted-foreground">4 GB mínimo</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline">Mínimo</Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded">
                                            <div className="flex items-center gap-3">
                                                <Globe className="h-5 w-5" />
                                                <div>
                                                    <p className="font-medium">Espaço em Disco</p>
                                                    <p className="text-sm text-muted-foreground">2 GB livres</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline">Recomendado</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Download className="h-5 w-5" />
                                    Recursos
                                </CardTitle>
                                <CardDescription>
                                    Downloads e documentação
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <BookOpen className="h-4 w-4" />
                                        Manual do Usuário (PDF)
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Video className="h-4 w-4" />
                                        Vídeo Tutoriais
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <FileText className="h-4 w-4" />
                                        Guia Rápido
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Download className="h-4 w-4" />
                                        Atualizações
                                    </Button>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <h3 className="font-medium">Links Úteis</h3>
                                    <div className="space-y-2">
                                        <a href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                                            <Globe className="h-4 w-4" />
                                            Site Oficial
                                        </a>
                                        <a href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                                            <MessageSquare className="h-4 w-4" />
                                            Fórum da Comunidade
                                        </a>
                                        <a href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                                            <BookOpen className="h-4 w-4" />
                                            Base de Conhecimento
                                        </a>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <h3 className="font-medium">Estatísticas</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Versão atual:</span>
                                            <Badge>2.0.0</Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Última atualização:</span>
                                            <span className="text-sm">01/01/2024</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Usuários ativos:</span>
                                            <span className="text-sm">1.248</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Animais cadastrados:</span>
                                            <span className="text-sm">2.567</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">
                                        Desenvolvido com ❤️ para a comunidade veterinária
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Baseado no tradicional SofVet
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* ABA 2: FAQ - PERGUNTAS FREQUENTES */}
                <TabsContent value="faq">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <HelpCircle className="h-5 w-5" />
                                Perguntas Frequentes (FAQ)
                            </CardTitle>
                            <CardDescription>
                                Encontre respostas para as dúvidas mais comuns
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Button
                                        variant={!searchTerm ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        Todas
                                    </Button>
                                    <Button
                                        variant={searchTerm === 'backup' ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSearchTerm('backup')}
                                    >
                                        Backup
                                    </Button>
                                    <Button
                                        variant={searchTerm === 'tabelas' ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSearchTerm('tabelas')}
                                    >
                                        Tabelas
                                    </Button>
                                    <Button
                                        variant={searchTerm === 'mensagens' ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSearchTerm('mensagens')}
                                    >
                                        Mensagens
                                    </Button>
                                    <Button
                                        variant={searchTerm === 'def' ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSearchTerm('def')}
                                    >
                                        DEF
                                    </Button>
                                </div>

                                <Accordion type="single" collapsible className="w-full">
                                    {filteredFaq.map((item, index) => (
                                        <AccordionItem key={index} value={`item-${index}`}>
                                            <AccordionTrigger className="text-left">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline">{item.category}</Badge>
                                                    <span>{item.question}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="p-4 bg-gray-50 rounded">
                                                    <p className="text-gray-700">{item.answer}</p>
                                                    <div className="mt-3 flex gap-2">
                                                        <Button variant="outline" size="sm">
                                                            <ThumbsUp className="h-4 w-4 mr-1" />
                                                            Útil
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            <ThumbsDown className="h-4 w-4 mr-1" />
                                                            Não útil
                                                        </Button>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>

                                {filteredFaq.length === 0 && (
                                    <div className="text-center py-12">
                                        <HelpCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                        <p className="text-gray-500">Nenhuma pergunta encontrada com "{searchTerm}"</p>
                                        <Button
                                            variant="outline"
                                            className="mt-4"
                                            onClick={() => setSearchTerm('')}
                                        >
                                            Ver todas as perguntas
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Não encontrou sua dúvida?</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" className="gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Chat Online
                                    </Button>
                                    <Button className="gap-2">
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
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <LifeBuoy className="h-5 w-5" />
                                    Contato de Suporte
                                </CardTitle>
                                <CardDescription>
                                    Entre em contato com nossa equipe técnica
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start">
                                        <Phone className="h-5 w-5 text-blue-600 mt=0.5 mr-3" />
                                        <div>
                                            <p className="font-medium text-blue-800">Suporte Técnico SofVet</p>
                                            <p className="text-blue-700 text-sm mt-1">
                                                Baseado nas informações de contato do manual original.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-medium text-lg">Contatos Oficiais</h3>

                                        <div className="space-y-3">
                                            <div className="p-4 border rounded-lg">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Phone className="h-5 w-5 text-green-600" />
                                                    <div>
                                                        <p className="font-medium">Telefone</p>
                                                        <p className="text-sm text-muted-foreground">Suporte técnico</p>
                                                    </div>
                                                </div>
                                                <p className="text-lg font-bold">+44 7747843073</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Horário: Segunda a Sexta, 8h às 18h
                                                </p>
                                            </div>

                                            <div className="p-4 border rounded-lg">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Mail className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <p className="font-medium">Email</p>
                                                        <p className="text-sm text-muted-foreground">Suporte por email</p>
                                                    </div>
                                                </div>
                                                <p className="text-lg font-bold">suportesofvet@gmail.com</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Resposta em até 24 horas úteis
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-medium text-lg"></h3>

                                        <div className="space-y-3">
                                            <div className="p-3 border rounded">
                                                <p className="font-medium">&lt;LVF_Code/&gt;Sistemas e Automação</p>
                                                <p className="text-sm text-muted-foreground">Rua Benjamin Rodrigues, 203</p>
                                                <p className="text-sm text-muted-foreground">Jd. Eldorado - SP - 07500-000</p>
                                            </div>

                                            <div className="p-3 border rounded">
                                                <p className="font-medium">Site Oficial</p>
                                                <a href="http://www.sofvet.com.br" className="text-blue-600 hover:underline text-sm">
                                                    http://www.sofvet.com.br
                                                </a>
                                            </div>

                                            <div className="p-3 border rounded">
                                                <p className="font-medium">Tempo no mercado</p>
                                                <p className="text-lg font-bold text-green-600">Mais de 25 anos</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Especializada em software veterinário
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Canais de Atendimento</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 border rounded">
                                            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <Phone className="h-6 w-6 text-green-600" />
                                            </div>
                                            <p className="font-medium">Telefone</p>
                                            <p className="text-xs text-muted-foreground">Prioridade</p>
                                        </div>
                                        <div className="text-center p-4 border rounded">
                                            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <Mail className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <p className="font-medium">Email</p>
                                            <p className="text-xs text-muted-foreground">Documentado</p>
                                        </div>
                                        <div className="text-center p-4 border rounded">
                                            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <MessageSquare className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <p className="font-medium">Chat</p>
                                            <p className="text-xs text-muted-foreground">Online</p>
                                        </div>
                                        <div className="text-center p-4 border rounded">
                                            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <Video className="h-6 w-6 text-orange-600" />
                                            </div>
                                            <p className="font-medium">Remoto</p>
                                            <p className="text-xs text-muted-foreground">TeamViewer/AnyDesk</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Formulário de Contato
                                </CardTitle>
                                <CardDescription>
                                    Preencha o formulário para solicitar suporte
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Nome *</Label>
                                            <Input
                                                placeholder="Seu nome completo"
                                                value={contactForm.nome}
                                                onChange={(e) => setContactForm({ ...contactForm, nome: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email *</Label>
                                            <Input
                                                type="email"
                                                placeholder="seu@email.com"
                                                value={contactForm.email}
                                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Telefone</Label>
                                        <Input
                                            placeholder="(11) 99999-9999"
                                            value={contactForm.telefone}
                                            onChange={(e) => setContactForm({ ...contactForm, telefone: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Assunto</Label>
                                        <Select
                                            value={contactForm.assunto}
                                            onValueChange={(value) => setContactForm({ ...contactForm, assunto: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o assunto" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="suporte">Suporte Técnico</SelectItem>
                                                <SelectItem value="venda">Vendas e Licenças</SelectItem>
                                                <SelectItem value="sugestao">Sugestões</SelectItem>
                                                <SelectItem value="treinamento">Treinamento</SelectItem>
                                                <SelectItem value="outro">Outro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Mensagem *</Label>
                                        <Textarea
                                            placeholder="Descreva seu problema ou dúvida..."
                                            rows={6}
                                            value={contactForm.mensagem}
                                            onChange={(e) => setContactForm({ ...contactForm, mensagem: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                            Campos com * são obrigatórios
                                        </div>
                                        <Button onClick={handleSubmitContact} className="gap-2">
                                            <Mail className="h-4 w-4" />
                                            Enviar Mensagem
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Antes de enviar</h3>

                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium">Verifique o manual</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Muitas dúvidas já estão respondidas na documentação
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium">Descreva detalhadamente</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Inclua versão do sistema, sistema operacional e passo a passo do problema
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium">Anexe prints se necessário</p>
                                                <p className="text-sm text-muted-foreground">
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Problemas Comuns e Soluções
                            </CardTitle>
                            <CardDescription>
                                Soluções para os problemas mais frequentes do sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                                <div className="flex items-start">
                                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                    <div>
                                        <p className="font-medium text-blue-800">Baseado no manual do SofVet</p>
                                        <p className="text-blue-700 text-sm mt-1">
                                            Estas são soluções para problemas documentados no manual original do SofVet.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Problema</TableHead>
                                        <TableHead>Solução</TableHead>
                                        <TableHead>Gravidade</TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {commonProblems.map((problema, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="flex items-start gap-2">
                                                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${problema.gravidade === 'alta' ? 'text-red-600' :
                                                            problema.gravidade === 'media' ? 'text-yellow-600' : 'text-green-600'
                                                        }`} />
                                                    <div>
                                                        <p className="font-medium">{problema.problema}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {problema.gravidade === 'alta' ? 'Crítico - Resolver imediatamente' :
                                                                problema.gravidade === 'media' ? 'Importante - Resolver em breve' :
                                                                    'Baixa - Pode aguardar'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm">{problema.solucao}</p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    problema.gravidade === 'alta' ? 'destructive' :
                                                        problema.gravidade === 'media' ? 'secondary' : 'outline'
                                                }>
                                                    {problema.gravidade === 'alta' ? 'Alta' :
                                                        problema.gravidade === 'media' ? 'Média' : 'Baixa'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm">Copiar</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Separator className="my-6" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Settings className="h-5 w-5" />
                                            Problemas Técnicos
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Accordion type="single" collapsible>
                                            <AccordionItem value="fonts">
                                                <AccordionTrigger>Erro: "VOCÊ PRECISA INSTALAR OS FONTES"</AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-2">
                                                        <p className="font-medium">Para Windows XP:</p>
                                                        <ol className="list-decimal pl-5 space-y-1 text-sm">
                                                            <li>Menu Iniciar → Configurações → Painel de Controle</li>
                                                            <li>Fontes → Arquivo → Instalar Fontes Novas</li>
                                                            <li>Selecione diretório SOFVETW</li>
                                                            <li>Selecione Tudo → OK</li>
                                                        </ol>
                                                        <p className="font-medium mt-3">Para Windows 7 ou superior:</p>
                                                        <ol className="list-decimal pl-5 space-y-1 text-sm">
                                                            <li>Abra o disco local (C:)</li>
                                                            <li>Localize a pasta sofvetw</li>
                                                            <li>Localize FOXFONT, FOXPRINT e 3OF9</li>
                                                            <li>Clique com botão direito em cada um e selecione INSTALAR</li>
                                                        </ol>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            <AccordionItem value="disable">
                                                <AccordionTrigger>Erro: "O SUPERVISOR BLOQUEOU SUA ENTRADA"</AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-2">
                                                        <p>Este erro ocorre quando o arquivo DISABLE.SYS não foi removido após um backup.</p>
                                                        <p className="font-medium">Solução:</p>
                                                        <ol className="list-decimal pl-5 space-y-1 text-sm">
                                                            <li>Vá em INICIAR → LOCALIZAR → ARQUIVOS OU PASTAS</li>
                                                            <li>Busque por DISABLE.SYS</li>
                                                            <li>Localize o arquivo na pasta SOFVETW</li>
                                                            <li>Exclua o arquivo DISABLE.SYS</li>
                                                        </ol>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            <AccordionItem value="agenda">
                                                <AccordionTrigger>Erro de biblioteca na Agenda</AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-2">
                                                        <p>Execute os seguintes comandos no Prompt de Comando (como administrador):</p>
                                                        <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                                                            C:\SOFVETW\REGSVR32.EXE MSCAL.OCX /U /S<br />
                                                            C:\SOFVETW\REGSVR32.EXE MSCAL.OCX /S
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-2">
                                                            Após executar ambos comandos, reinicie o SofVet.
                                                        </p>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Database className="h-5 w-5" />
                                            Problemas de Dados
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Accordion type="single" collapsible>
                                            <AccordionItem value="backup">
                                                <AccordionTrigger>Perdi todos os dados</AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-2">
                                                        <p className="font-medium">Se você tem backup:</p>
                                                        <ol className="list-decimal pl-5 space-y-1 text-sm">
                                                            <li>Reinstale o SofVet</li>
                                                            <li>Atualize com o último CD enviado</li>
                                                            <li>Siga as instruções para restaurar seu backup</li>
                                                        </ol>
                                                        <p className="font-medium mt-3">Se não tem backup:</p>
                                                        <p className="text-sm text-red-600">
                                                            Entre em contato imediatamente com o suporte técnico.
                                                            Os dados podem ser irrecuperáveis.
                                                        </p>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            <AccordionItem value="rede">
                                                <AccordionTrigger>Não consigo usar em rede</AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-2">
                                                        <p className="font-medium">Passos para configurar rede:</p>
                                                        <ol className="list-decimal pl-5 space-y-1 text-sm">
                                                            <li>Verifique se o micro SERVIDOR tem o HD compartilhado</li>
                                                            <li>Nos TERMINAIS, instale apenas os arquivos de fonte</li>
                                                            <li>Nos TERMINAIS, mapeie a unidade de rede</li>
                                                            <li>Crie atalho para y:\SOFVETW\SOFVETW.EXE (y = letra do mapeamento)</li>
                                                        </ol>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            <AccordionItem value="restore">
                                                <AccordionTrigger>Problemas para restaurar backup</AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-2">
                                                        <p>Para restaurar backup do SofVet:</p>
                                                        <ol className="list-decimal pl-5 space-y-1 text-sm">
                                                            <li>Copie toda a pasta SOFVETW do pendrive</li>
                                                            <li>Cole no computador servidor</li>
                                                            <li>Sobrescreva a pasta SOFVETW existente</li>
                                                        </ol>
                                                        <p className="text-sm text-muted-foreground mt-2">
                                                            Certifique-se de que ninguém está usando o sistema durante a restauração.
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <RefreshCw className="h-5 w-5" />
                                Histórico de Atualizações
                            </CardTitle>
                            <CardDescription>
                                Acompanhe as mudanças e melhorias do SofVet
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {updates.map((update, index) => (
                                    <div key={index} className="relative pl-8 pb-6 border-l-2 border-primary last:border-l-0 last:pb-0">
                                        <div className="absolute -left-2.5 top-0 w-5 h-5 bg-primary rounded-full" />

                                        <div className="ml-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Badge variant="secondary">{update.version}</Badge>
                                                <span className="text-sm text-muted-foreground">{update.date}</span>
                                                {index === 0 && (
                                                    <Badge className="gap-1">
                                                        <CheckCircle className="h-3 w-3" />
                                                        Atual
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                {update.changes.map((change, changeIndex) => (
                                                    <div key={changeIndex} className="flex items-start gap-2">
                                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                                        <span>{change}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-6" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Verificar Atualizações</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            Verifique se há novas versões disponíveis do SofVet.
                                        </p>
                                        <Button className="w-full gap-2">
                                            <RefreshCw className="h-4 w-4" />
                                            Verificar Atualizações
                                        </Button>
                                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                <div>
                                                    <p className="font-medium text-green-800">Sistema atualizado</p>
                                                    <p className="text-sm text-green-700">Você está usando a versão mais recente</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Próximas Atualizações</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-blue-600" />
                                                <span className="font-medium">Em desenvolvimento</span>
                                            </div>
                                            <ul className="space-y-1 text-sm pl-6">
                                                <li>• Integração com sistemas de pagamento</li>
                                                <li>• App móvel para clientes</li>
                                                <li>• Relatórios avançados em tempo real</li>
                                                <li>• Backup automático na nuvem</li>
                                            </ul>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Estas funcionalidades estão planejadas para versões futuras.
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start">
                                    <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                    <div>
                                        <p className="font-medium text-blue-800">Sobre as atualizações</p>
                                        <p className="text-blue-700 text-sm mt-1">
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
            <div className="mt-8 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h3 className="font-medium mb-2">Ajuda Rápida</h3>
                        <div className="space-y-1 text-sm">
                            <a href="#" className="block text-blue-600 hover:underline">Manual do Usuário</a>
                            <a href="#" className="block text-blue-600 hover:underline">Vídeo Tutoriais</a>
                            <a href="#" className="block text-blue-600 hover:underline">FAQ Completo</a>
                            <a href="#" className="block text-blue-600 hover:underline">Treinamentos</a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Suporte</h3>
                        <div className="space-y-1 text-sm">
                            <p className="text-muted-foreground">Telefone: +44 7747843073</p>
                            <p className="text-muted-foreground">Email: contatosofvet@gmail.com</p>
                            <p className="text-muted-foreground">Site: www.sofvet.com.br</p>
                            <p className="text-muted-foreground">Horário: 8h às 18h (segunda a sexta)</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Informações</h3>
                        <div className="space-y-1 text-sm">
                            <p className="text-muted-foreground">Versão: 2.0.0</p>
                            <p className="text-muted-foreground">Licença: Clínica Veterinária Golfinho</p>
                            <p className="text-muted-foreground">Desenvolvido por: &lt;LVF_Code/&gt; Sistemas e Automação</p>
                            <p className="text-muted-foreground">Baseado no: SofVet.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        © 2026 SofVet - Software Veterinário. Todos os direitos reservados.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Baseado no manual do SofVet.
                    </p>
                </div>
            </div>
        </div>
    );
}

