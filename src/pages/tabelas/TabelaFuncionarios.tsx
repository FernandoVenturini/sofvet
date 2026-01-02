import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Trash2, Edit, CheckCircle, XCircle, Search, Users, Briefcase, 
  Phone, Mail, DollarSign, Calendar, UserPlus, Sparkles, Filter,
  TrendingUp, Shield, Award, Activity, ChevronRight, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Funcionario {
    id: string;
    nome: string;
    cargo: string;
    telefone: string;
    email: string;
    salario: number;
    dataAdmissao: string;
    ativo: boolean;
    createdAt?: string;
    updatedAt?: string;
}

const TabelaFuncionarios = () => {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');
    const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativos' | 'inativos'>('todos');

    // Formulário de cadastro/edição
    const [nome, setNome] = useState('');
    const [cargo, setCargo] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [salario, setSalario] = useState('');
    const [dataAdmissao, setDataAdmissao] = useState('');
    const [ativo, setAtivo] = useState(true);

    // Modal de edição
    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState('');
    const [editNome, setEditNome] = useState('');
    const [editCargo, setEditCargo] = useState('');
    const [editTelefone, setEditTelefone] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editSalario, setEditSalario] = useState('');
    const [editDataAdmissao, setEditDataAdmissao] = useState('');
    const [editAtivo, setEditAtivo] = useState(true);

    useEffect(() => {
        carregarFuncionarios();
    }, []);

    const carregarFuncionarios = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, 'funcionarios'));
            const lista = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Funcionario[];
            setFuncionarios(lista);
        } catch (error) {
            console.error('Erro ao carregar funcionários:', error);
            toast.error('Erro ao carregar lista de funcionários');
        } finally {
            setLoading(false);
        }
    };

    const salvarFuncionario = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !cargo || !salario) {
            toast.error('Preencha os campos obrigatórios (Nome, Cargo e Salário)');
            return;
        }

        if (Number(salario) <= 0) {
            toast.error('O salário deve ser maior que zero');
            return;
        }

        try {
            await addDoc(collection(db, 'funcionarios'), {
                nome,
                cargo,
                telefone: telefone || '',
                email: email || '',
                salario: Number(salario),
                dataAdmissao: dataAdmissao || '',
                ativo,
                createdAt: new Date().toISOString(),
            });

            // Limpa formulário
            resetarFormulario();

            toast.success('Funcionário cadastrado com sucesso!');
            carregarFuncionarios();
        } catch (error) {
            console.error('Erro ao salvar funcionário:', error);
            toast.error('Erro ao cadastrar funcionário');
        }
    };

    const abrirEdicao = (func: Funcionario) => {
        setEditId(func.id);
        setEditNome(func.nome);
        setEditCargo(func.cargo);
        setEditTelefone(func.telefone || '');
        setEditEmail(func.email || '');
        setEditSalario(func.salario.toString());
        setEditDataAdmissao(func.dataAdmissao || '');
        setEditAtivo(func.ativo);
        setEditOpen(true);
    };

    const salvarEdicao = async () => {
        if (!editNome || !editCargo || !editSalario) {
            toast.error('Preencha os campos obrigatórios (Nome, Cargo e Salário)');
            return;
        }

        if (Number(editSalario) <= 0) {
            toast.error('O salário deve ser maior que zero');
            return;
        }

        try {
            const ref = doc(db, 'funcionarios', editId);
            await updateDoc(ref, {
                nome: editNome,
                cargo: editCargo,
                telefone: editTelefone,
                email: editEmail,
                salario: Number(editSalario),
                dataAdmissao: editDataAdmissao,
                ativo: editAtivo,
                updatedAt: new Date().toISOString(),
            });

            setEditOpen(false);
            toast.success('Funcionário atualizado com sucesso!');
            carregarFuncionarios();
        } catch (error) {
            console.error('Erro ao editar funcionário:', error);
            toast.error('Erro ao atualizar funcionário');
        }
    };

    const excluirFuncionario = async (id: string, nome: string) => {
        if (!confirm(`Tem certeza que deseja excluir o funcionário "${nome}"?`)) return;

        try {
            await deleteDoc(doc(db, 'funcionarios', id));
            toast.success('Funcionário excluído com sucesso!');
            carregarFuncionarios();
        } catch (error) {
            console.error('Erro ao excluir funcionário:', error);
            toast.error('Erro ao excluir funcionário');
        }
    };

    const resetarFormulario = () => {
        setNome('');
        setCargo('');
        setTelefone('');
        setEmail('');
        setSalario('');
        setDataAdmissao('');
        setAtivo(true);
    };

    const funcionariosFiltrados = funcionarios.filter(f => {
        const matchesSearch = 
            f.nome.toLowerCase().includes(busca.toLowerCase()) ||
            f.cargo.toLowerCase().includes(busca.toLowerCase()) ||
            f.email.toLowerCase().includes(busca.toLowerCase()) ||
            f.telefone.toLowerCase().includes(busca.toLowerCase());
        
        const matchesStatus = 
            filtroStatus === 'todos' ||
            (filtroStatus === 'ativos' && f.ativo) ||
            (filtroStatus === 'inativos' && !f.ativo);
        
        return matchesSearch && matchesStatus;
    });

    const estatisticas = {
        total: funcionarios.length,
        ativos: funcionarios.filter(f => f.ativo).length,
        inativos: funcionarios.filter(f => !f.ativo).length,
        salarioTotal: funcionarios.reduce((acc, f) => acc + f.salario, 0),
        mediaSalarial: funcionarios.length > 0 ? 
            funcionarios.reduce((acc, f) => acc + f.salario, 0) / funcionarios.length : 0,
    };

    const cargosUnicos = Array.from(new Set(funcionarios.map(f => f.cargo)));

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <p className="text-gray-400">Carregando funcionários...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30">
                            <Users className="h-6 w-6 text-red-400" />
                        </div>
                        <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 border border-red-500/30">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Gestão de Equipe
                        </Badge>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">
                        Tabela de Funcionários
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Gerencie a equipe da clínica veterinária
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total de Funcionários</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-white">{estatisticas.total}</p>
                                <p className="text-sm text-gray-400">Colaboradores</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                                <Users className="h-5 w-5 text-red-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Funcionários Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-emerald-400">{estatisticas.ativos}</p>
                                <p className="text-sm text-gray-400">Em atividade</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20">
                                <TrendingUp className="h-5 w-5 text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Média Salarial</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-blue-400">
                                    R$ {estatisticas.mediaSalarial.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-400">Por funcionário</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
                                <DollarSign className="h-5 w-5 text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Folha de Pagamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-amber-400">
                                    R$ {estatisticas.salarioTotal.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-400">Total mensal</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-600/20 to-orange-600/20">
                                <Award className="h-5 w-5 text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros e Busca */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Buscar por nome, cargo, telefone ou email..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="pl-10 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Select value={filtroStatus} onValueChange={(v: 'todos' | 'ativos' | 'inativos') => setFiltroStatus(v)}>
                                <SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-700/50 text-white">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        <SelectValue placeholder="Filtrar por status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-800">
                                    <SelectItem value="todos">Todos os status</SelectItem>
                                    <SelectItem value="ativos">Apenas ativos</SelectItem>
                                    <SelectItem value="inativos">Apenas inativos</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={carregarFuncionarios}
                                className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Formulário de Cadastro */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-red-400" />
                        Cadastrar Novo Funcionário
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        Preencha os dados para adicionar um novo membro à equipe
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={salvarFuncionario} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <Label className="text-white flex items-center gap-2">
                                    <Users className="h-4 w-4 text-red-400" />
                                    Nome *
                                </Label>
                                <Input
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                    placeholder="Nome completo"
                                    className="bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-white flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-blue-400" />
                                    Cargo *
                                </Label>
                                <Select value={cargo} onValueChange={setCargo}>
                                    <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                        <SelectValue placeholder="Selecione o cargo" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-gray-800">
                                        {cargosUnicos.map((cargoItem, index) => (
                                            <SelectItem key={index} value={cargoItem}>{cargoItem}</SelectItem>
                                        ))}
                                        <SelectItem value="novo">+ Adicionar novo cargo</SelectItem>
                                    </SelectContent>
                                </Select>
                                {cargo === 'novo' && (
                                    <Input
                                        placeholder="Digite o novo cargo"
                                        onChange={e => setCargo(e.target.value)}
                                        className="mt-2 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                    />
                                )}
                            </div>

                            <div className="space-y-3">
                                <Label className="text-white flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-emerald-400" />
                                    Telefone
                                </Label>
                                <Input
                                    value={telefone}
                                    onChange={e => setTelefone(e.target.value)}
                                    placeholder="(11) 99999-9999"
                                    className="bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-white flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-amber-400" />
                                    E-mail
                                </Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="exemplo@clinica.com"
                                    className="bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-white flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-green-400" />
                                    Salário (R$) *
                                </Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={salario}
                                    onChange={e => setSalario(e.target.value)}
                                    placeholder="Ex: 4500.00"
                                    className="bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-white flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-purple-400" />
                                    Data de Admissão
                                </Label>
                                <Input
                                    type="date"
                                    value={dataAdmissao}
                                    onChange={e => setDataAdmissao(e.target.value)}
                                    className="bg-gray-900/50 border-gray-700/50 text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-white flex items-center gap-2">
                                <Activity className="h-4 w-4 text-cyan-400" />
                                Status
                            </Label>
                            <Select value={ativo ? 'ativo' : 'inativo'} onValueChange={v => setAtivo(v === 'ativo')}>
                                <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white w-full md:w-64">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-800">
                                    <SelectItem value="ativo">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                                            Ativo
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="inativo">
                                        <div className="flex items-center gap-2">
                                            <XCircle className="h-4 w-4 text-red-400" />
                                            Inativo
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator className="bg-gray-800/50" />

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={resetarFormulario}
                                className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Limpar Formulário
                            </Button>
                            <Button
                                type="submit"
                                className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                disabled={!nome || !cargo || !salario}
                            >
                                <UserPlus className="h-4 w-4" />
                                Cadastrar Funcionário
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Tabela de Funcionários */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-blue-400" />
                            <span>Funcionários Cadastrados</span>
                        </div>
                        <div className="text-sm text-gray-400">
                            Mostrando {funcionariosFiltrados.length} de {funcionarios.length} funcionários
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {funcionarios.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">Nenhum funcionário cadastrado</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Comece cadastrando seu primeiro funcionário no formulário acima
                            </p>
                        </div>
                    ) : funcionariosFiltrados.length === 0 ? (
                        <div className="text-center py-12">
                            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">Nenhum funcionário encontrado</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Tente ajustar os termos da busca ou os filtros
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-800/50">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-800/50">
                                        <TableHead className="text-gray-400">Funcionário</TableHead>
                                        <TableHead className="text-gray-400">Cargo</TableHead>
                                        <TableHead className="text-gray-400 hidden lg:table-cell">Contato</TableHead>
                                        <TableHead className="text-gray-400 hidden md:table-cell">Salário</TableHead>
                                        <TableHead className="text-gray-400">Status</TableHead>
                                        <TableHead className="text-gray-400 text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {funcionariosFiltrados.map(func => (
                                        <TableRow key={func.id} className="border-gray-800/30 hover:bg-gray-800/20">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${func.ativo ? 'bg-gradient-to-br from-emerald-600/20 to-green-600/20' : 'bg-gradient-to-br from-red-600/20 to-pink-600/20'}`}>
                                                        <Users className={`h-4 w-4 ${func.ativo ? 'text-emerald-400' : 'text-red-400'}`} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">{func.nome}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {func.dataAdmissao ? 
                                                                format(new Date(func.dataAdmissao), 'dd/MM/yyyy') : 
                                                                'Data não informada'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-gray-700 text-gray-400">
                                                    {func.cargo}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <div className="space-y-1">
                                                    {func.telefone && (
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Phone className="h-3 w-3 text-emerald-400" />
                                                            <span className="text-gray-300">{func.telefone}</span>
                                                        </div>
                                                    )}
                                                    {func.email && (
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Mail className="h-3 w-3 text-amber-400" />
                                                            <span className="text-gray-300">{func.email}</span>
                                                        </div>
                                                    )}
                                                    {!func.telefone && !func.email && (
                                                        <span className="text-gray-500 text-sm">Não informado</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-green-400" />
                                                    <span className="text-white">R$ {func.salario.toFixed(2)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={
                                                    func.ativo 
                                                        ? "bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-400 border-emerald-500/30"
                                                        : "bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400 border-red-500/30"
                                                }>
                                                    {func.ativo ? (
                                                        <>
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Ativo
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                            Inativo
                                                        </>
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => abrirEdicao(func)}
                                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => excluirFuncionario(func.id, func.nome)}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal de Edição */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5 text-blue-400" />
                            Editar Funcionário
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-white">Nome *</Label>
                                <Input 
                                    value={editNome} 
                                    onChange={e => setEditNome(e.target.value)} 
                                    className="bg-gray-900/50 border-gray-700/50 text-white" 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Cargo *</Label>
                                <Select value={editCargo} onValueChange={setEditCargo}>
                                    <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                        <SelectValue placeholder="Selecione o cargo" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-gray-800">
                                        {cargosUnicos.map((cargoItem, index) => (
                                            <SelectItem key={index} value={cargoItem}>{cargoItem}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Telefone</Label>
                                <Input 
                                    value={editTelefone} 
                                    onChange={e => setEditTelefone(e.target.value)} 
                                    className="bg-gray-900/50 border-gray-700/50 text-white" 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">E-mail</Label>
                                <Input 
                                    value={editEmail} 
                                    onChange={e => setEditEmail(e.target.value)} 
                                    className="bg-gray-900/50 border-gray-700/50 text-white" 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Salário (R$) *</Label>
                                <Input 
                                    type="number" 
                                    step="0.01" 
                                    min="0"
                                    value={editSalario} 
                                    onChange={e => setEditSalario(e.target.value)} 
                                    className="bg-gray-900/50 border-gray-700/50 text-white" 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Data de Admissão</Label>
                                <Input 
                                    type="date" 
                                    value={editDataAdmissao} 
                                    onChange={e => setEditDataAdmissao(e.target.value)} 
                                    className="bg-gray-900/50 border-gray-700/50 text-white" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white">Status</Label>
                            <Select value={editAtivo ? 'ativo' : 'inativo'} onValueChange={v => setEditAtivo(v === 'ativo')}>
                                <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-800">
                                    <SelectItem value="ativo">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                                            Ativo
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="inativo">
                                        <div className="flex items-center gap-2">
                                            <XCircle className="h-4 w-4 text-red-400" />
                                            Inativo
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setEditOpen(false)}
                            className="border-gray-700 text-gray-400 hover:text-white"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={salvarEdicao} 
                            className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                        >
                            <Edit className="h-4 w-4" />
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TabelaFuncionarios;