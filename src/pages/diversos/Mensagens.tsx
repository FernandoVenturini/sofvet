import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Search,
    Send,
    Trash2,
    Eye,
    Mail,
    Filter,
    CheckCircle,
    Clock,
    Users,
    User,
    AlertCircle,
    MessageSquare,
    ArrowRight,
    Calendar,
    UserCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

interface Message {
    id: number;
    sender: string;
    senderId: string;
    recipient: string;
    recipientId: string;
    subject: string;
    content: string;
    timestamp: Date;
    read: boolean;
    priority: 'normal' | 'alta';
}

interface UserType {
    id: string;
    name: string;
    role: string;
    online: boolean;
}

export default function Mensagens() {
    // Estado inicial baseado no manual do SofVet
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: 'SUPERVISOR',
            senderId: '001',
            recipient: 'Todos',
            recipientId: 'all',
            subject: 'Backup Diário',
            content: 'Lembrem-se de fazer o backup diário do sistema hoje às 18h.',
            timestamp: new Date('2024-01-02T09:00:00'),
            read: true,
            priority: 'alta'
        },
        {
            id: 2,
            sender: 'Recepcionista',
            senderId: '002',
            recipient: 'Veterinário Jardim',
            recipientId: '003',
            subject: 'Cliente na recepção',
            content: 'Sr. Carlos chegou para retorno com seu cachorro Rex. Favor atender na sala 2.',
            timestamp: new Date('2024-01-02T14:25:00'),
            read: false,
            priority: 'normal'
        },
        {
            id: 3,
            sender: 'Veterinário',
            senderId: '003',
            recipient: 'Recepcionista',
            recipientId: '002',
            subject: 'Cirurgia agendada',
            content: 'A cirurgia da cadela Luna está marcada para amanhã às 10h. Preparar sala de cirurgia.',
            timestamp: new Date('2024-01-01T16:45:00'),
            read: true,
            priority: 'alta'
        },
        {
            id: 4,
            sender: 'Administração',
            senderId: '001',
            recipient: 'Todos',
            recipientId: 'all',
            subject: 'Reunião mensal',
            content: 'Reunião mensal da equipe amanhã às 8h na sala de reuniões.',
            timestamp: new Date('2024-01-01T17:30:00'),
            read: false,
            priority: 'normal'
        }
    ]);

    const [users] = useState<UserType[]>([
        { id: '001', name: 'SUPERVISOR', role: 'Administrador', online: true },
        { id: '002', name: 'Recepcionista', role: 'Recepção', online: true },
        { id: '003', name: 'Veterinário Jardim', role: 'Médico Veterinário', online: false },
        { id: '004', name: 'Auxiliar Técnico', role: 'Auxiliar', online: true },
        { id: '005', name: 'Banho e Tosa', role: 'Esteticista', online: true }
    ]);

    const [newMessage, setNewMessage] = useState({
        recipient: 'all',
        subject: '',
        content: '',
        priority: 'normal' as 'normal' | 'alta'
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('inbox');
    const [lastReadPointer, setLastReadPointer] = useState<number>(2);
    const [daysToKeep, setDaysToKeep] = useState(30);
    const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');
    const [searchResults, setSearchResults] = useState<Message[]>([]);
    const [selectedMessages, setSelectedMessages] = useState<number[]>([]);

    // Contadores baseados no manual do SofVet
    const unreadCount = messages.filter(m => !m.read).length;
    const highPriorityCount = messages.filter(m => m.priority === 'alta').length;
    const messagesForMe = messages.filter(m =>
        m.recipientId === 'all' || m.recipientId === 'current-user'
    );

    // 1. ENVIAR NOVA MENSAGEM (baseado no manual)
    const sendMessage = () => {
        if (!newMessage.subject.trim() || !newMessage.content.trim()) {
            toast.error('Preencha o assunto e o conteúdo da mensagem');
            return;
        }

        const recipientName = newMessage.recipient === 'all'
            ? 'Todos'
            : users.find(u => u.id === newMessage.recipient)?.name || 'Usuário';

        const newMsg: Message = {
            id: messages.length + 1,
            sender: 'Você',
            senderId: 'current-user',
            recipient: recipientName,
            recipientId: newMessage.recipient,
            subject: newMessage.subject,
            content: newMessage.content,
            timestamp: new Date(),
            read: false,
            priority: newMessage.priority
        };

        setMessages([newMsg, ...messages]);

        toast.success('Mensagem enviada com sucesso!');

        // Resetar formulário
        setNewMessage({
            recipient: 'all',
            subject: '',
            content: '',
            priority: 'normal'
        });
    };

    // 2. LER MENSAGENS (para você e para todos)
    const markAsRead = (messageId: number) => {
        setMessages(messages.map(msg =>
            msg.id === messageId ? { ...msg, read: true } : msg
        ));
        toast.info('Mensagem marcada como lida');
    };

    const markAllAsRead = () => {
        setMessages(messages.map(msg => ({ ...msg, read: true })));
        toast.info('Todas as mensagens marcadas como lidas');
    };

    // 3. PROCURAR MENSAGEM POR PARTE DO TEXTO (busca flexível)
    const searchMessages = () => {
        if (!searchTerm.trim()) {
            toast.error('Digite um termo para buscar');
            return;
        }

        const term = searchTerm.toLowerCase();
        const results = messages.filter(msg =>
            msg.subject.toLowerCase().includes(term) ||
            msg.content.toLowerCase().includes(term) ||
            msg.sender.toLowerCase().includes(term) ||
            msg.recipient.toLowerCase().includes(term)
        );

        setSearchResults(results);

        if (results.length === 0) {
            toast.info('Nenhuma mensagem encontrada com o termo buscado');
        } else {
            toast.success(`Encontradas ${results.length} mensagens`);
        }
    };

    // 4. SEU PONTEIRO DE ÚLTIMA MENSAGIDA LIDA
    const updateLastReadPointer = () => {
        const lastReadId = messages
            .filter(msg => msg.read)
            .sort((a, b) => b.id - a.id)[0]?.id || 0;

        setLastReadPointer(lastReadId);
        toast.info(`Ponteiro atualizado para mensagem ID: ${lastReadId}`);
    };

    // 5. LIMPEZA DAS MENSAGENS ANTIGAS
    const cleanOldMessages = () => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        const oldMessages = messages.filter(msg =>
            new Date(msg.timestamp) < cutoffDate
        );

        if (oldMessages.length === 0) {
            toast.info('Não há mensagens antigas para limpar');
            return;
        }

        setMessages(messages.filter(msg =>
            new Date(msg.timestamp) >= cutoffDate
        ));

        toast.warning(`Removidas ${oldMessages.length} mensagens antigas`);
    };

    // Filtrar mensagens para exibição
    const filteredMessages = messages.filter(msg => {
        if (filter === 'unread') return !msg.read;
        if (filter === 'high') return msg.priority === 'alta';
        return true;
    });

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Módulo de Mensagens</h1>
                <p className="text-muted-foreground mt-2">
                    Sistema completo de troca de mensagens entre os diversos usuários do SofVet
                </p>
                <div className="flex gap-4 mt-4">
                    <Badge variant="outline" className="gap-2">
                        <Mail className="h-4 w-4" />
                        {messages.length} mensagens
                    </Badge>
                    <Badge variant="secondary" className="gap-2">
                        <Eye className="h-4 w-4" />
                        {unreadCount} não lidas
                    </Badge>
                    <Badge variant="destructive" className="gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {highPriorityCount} prioritárias
                    </Badge>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 mb-8">
                    <TabsTrigger value="inbox" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Caixa de Entrada
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-2">
                                {unreadCount}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="send" className="gap-2">
                        <Send className="h-4 w-4" />
                        Enviar Mensagem
                    </TabsTrigger>
                    <TabsTrigger value="search" className="gap-2">
                        <Search className="h-4 w-4" />
                        Pesquisar
                    </TabsTrigger>
                    <TabsTrigger value="pointer" className="gap-2">
                        <UserCheck className="h-4 w-4" />
                        Ponteiro
                    </TabsTrigger>
                    <TabsTrigger value="cleanup" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Limpar
                    </TabsTrigger>
                </TabsList>

                {/* ABA 1: CAIXA DE ENTRADA (Ler mensagens) */}
                <TabsContent value="inbox">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Caixa de Entrada</CardTitle>
                                    <CardDescription>
                                        Mensagens endereçadas para você e para todos
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                                        <SelectTrigger className="w-[180px]">
                                            <Filter className="mr-2 h-4 w-4" />
                                            <SelectValue placeholder="Filtrar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas as mensagens</SelectItem>
                                            <SelectItem value="unread">Não lidas</SelectItem>
                                            <SelectItem value="high">Prioritárias</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" onClick={markAllAsRead}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Marcar todas como lidas
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">Lida</TableHead>
                                        <TableHead>Remetente</TableHead>
                                        <TableHead>Destinatário</TableHead>
                                        <TableHead>Assunto</TableHead>
                                        <TableHead>Data/Hora</TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMessages.map((message) => (
                                        <TableRow key={message.id} className={!message.read ? 'bg-muted/50' : ''}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={message.read}
                                                    onCheckedChange={() => markAsRead(message.id)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    <span className={message.sender === 'SUPERVISOR' ? 'font-bold text-red-600' : ''}>
                                                        {message.sender}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {message.recipient === 'Todos' ? <Users className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                                    {message.recipient}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {message.subject}
                                                    {message.priority === 'alta' && (
                                                        <Badge variant="destructive" className="ml-2">
                                                            Alta
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-sm text-muted-foreground truncate max-w-xs">
                                                    {message.content}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(message.timestamp)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        markAsRead(message.id);
                                                        toast.info(`Mensagem: ${message.subject}`, {
                                                            description: message.content
                                                        });
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ABA 2: ENVIAR NOVA MENSAGEM */}
                <TabsContent value="send">
                    <Card>
                        <CardHeader>
                            <CardTitle>Enviar Nova Mensagem</CardTitle>
                            <CardDescription>
                                Envie mensagens para usuários específicos ou para todos os usuários
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Destinatário</Label>
                                    <Select
                                        value={newMessage.recipient}
                                        onValueChange={(value) => setNewMessage({ ...newMessage, recipient: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o destinatário" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    Todos os usuários
                                                </div>
                                            </SelectItem>
                                            {users.map((user) => (
                                                <SelectItem key={user.id} value={user.id}>
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4" />
                                                        {user.name} - {user.role}
                                                        {user.online && (
                                                            <Badge variant="outline" className="ml-2">
                                                                Online
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Prioridade</Label>
                                    <Select
                                        value={newMessage.priority}
                                        onValueChange={(value: 'normal' | 'alta') => setNewMessage({ ...newMessage, priority: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a prioridade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="alta">Alta Prioridade</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Assunto</Label>
                                <Input
                                    placeholder="Digite o assunto da mensagem"
                                    value={newMessage.subject}
                                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Conteúdo da Mensagem</Label>
                                <Textarea
                                    placeholder="Digite o conteúdo da mensagem..."
                                    value={newMessage.content}
                                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                                    rows={8}
                                    className="resize-none"
                                />
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button variant="outline" onClick={() => {
                                    setNewMessage({
                                        recipient: 'all',
                                        subject: '',
                                        content: '',
                                        priority: 'normal'
                                    });
                                }}>
                                    Limpar
                                </Button>
                                <Button onClick={sendMessage} className="gap-2">
                                    <Send className="h-4 w-4" />
                                    Enviar Mensagem
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ABA 3: PESQUISAR MENSAGENS */}
                <TabsContent value="search">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pesquisar Mensagens</CardTitle>
                            <CardDescription>
                                Procure mensagens por parte do texto em qualquer campo
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Digite qualquer palavra para buscar (remetente, assunto, conteúdo...)"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && searchMessages()}
                                />
                                <Button onClick={searchMessages} className="gap-2">
                                    <Search className="h-4 w-4" />
                                    Pesquisar
                                </Button>
                            </div>

                            {searchResults.length > 0 && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold">
                                                Resultados da pesquisa: {searchResults.length} mensagens
                                            </h3>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSearchResults([])}
                                            >
                                                Limpar resultados
                                            </Button>
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Remetente</TableHead>
                                                    <TableHead>Assunto</TableHead>
                                                    <TableHead>Data</TableHead>
                                                    <TableHead>Trecho encontrado</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {searchResults.map((message) => (
                                                    <TableRow key={message.id}>
                                                        <TableCell>{message.sender}</TableCell>
                                                        <TableCell>{message.subject}</TableCell>
                                                        <TableCell>{formatDate(message.timestamp)}</TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {message.content.substring(0, 100)}...
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>
                            )}

                            {searchResults.length === 0 && searchTerm && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Nenhuma mensagem encontrada com o termo "{searchTerm}"</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ABA 4: PONTEIRO DE ÚLTIMA MENSAGEM LIDA */}
                <TabsContent value="pointer">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ponteiro de Última Mensagem Lida</CardTitle>
                            <CardDescription>
                                Controle das mensagens já lidas pelo usuário
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Última mensagem lida (ID)</Label>
                                    <div className="text-3xl font-bold text-center p-4 border rounded-lg">
                                        {lastReadPointer}
                                    </div>
                                    <p className="text-sm text-muted-foreground text-center">
                                        ID da última mensagem marcada como lida
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Total de mensagens lidas</Label>
                                    <div className="text-3xl font-bold text-center p-4 border rounded-lg">
                                        {messages.filter(m => m.read).length}
                                    </div>
                                    <p className="text-sm text-muted-foreground text-center">
                                        de {messages.length} mensagens no total
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="font-semibold">Últimas mensagens lidas:</h3>
                                <div className="space-y-2">
                                    {messages
                                        .filter(m => m.read)
                                        .sort((a, b) => b.id - a.id)
                                        .slice(0, 5)
                                        .map((message) => (
                                            <div key={message.id} className="p-3 border rounded-lg">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">{message.subject}</span>
                                                    <Badge variant="outline">ID: {message.id}</Badge>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    De: {message.sender} • {formatDate(message.timestamp)}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div className="flex justify-center pt-4">
                                <Button onClick={updateLastReadPointer} className="gap-2">
                                    <UserCheck className="h-4 w-4" />
                                    Atualizar Ponteiro
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ABA 5: LIMPEZA DE MENSAGENS ANTIGAS */}
                <TabsContent value="cleanup">
                    <Card>
                        <CardHeader>
                            <CardTitle>Limpeza de Mensagens Antigas</CardTitle>
                            <CardDescription>
                                Remova mensagens antigas para otimizar o espaço do sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Manter mensagens dos últimos (dias):</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Mensagens mais antigas que este período serão removidas
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            type="number"
                                            value={daysToKeep}
                                            onChange={(e) => setDaysToKeep(Number(e.target.value))}
                                            className="w-24"
                                            min="1"
                                            max="365"
                                        />
                                        <span className="text-sm">dias</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="p-4 border rounded-lg bg-muted/50">
                                    <h3 className="font-semibold mb-2">Mensagens que serão removidas:</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-2xl font-bold text-red-600">
                                                {messages.filter(msg => {
                                                    const cutoffDate = new Date();
                                                    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
                                                    return new Date(msg.timestamp) < cutoffDate;
                                                }).length}
                                            </div>
                                            <p className="text-sm text-muted-foreground">Mensagens antigas</p>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-green-600">
                                                {messages.filter(msg => {
                                                    const cutoffDate = new Date();
                                                    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
                                                    return new Date(msg.timestamp) >= cutoffDate;
                                                }).length}
                                            </div>
                                            <p className="text-sm text-muted-foreground">Mensagens que permanecerão</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Data de corte: {(() => {
                                        const cutoffDate = new Date();
                                        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
                                        return cutoffDate.toLocaleDateString('pt-BR');
                                    })()}</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Todas as mensagens anteriores a esta data serão removidas
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-center gap-4 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const cutoffDate = new Date();
                                        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
                                        const oldMessages = messages.filter(msg =>
                                            new Date(msg.timestamp) < cutoffDate
                                        );

                                        toast.info(`Pré-visualização das mensagens a remover`, {
                                            description: `${oldMessages.length} mensagens serão removidas`
                                        });
                                    }}
                                >
                                    Pré-visualizar
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={cleanOldMessages}
                                    className="gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Executar Limpeza
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}