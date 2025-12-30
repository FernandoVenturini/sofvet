import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
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
}

const TabelaFuncionarios = () => {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');

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
            alert('Erro ao carregar lista de funcionários');
        } finally {
            setLoading(false);
        }
    };

    const salvarFuncionario = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !cargo || !salario) return;

        try {
            await addDoc(collection(db, 'funcionarios'), {
                nome,
                cargo,
                telefone,
                email,
                salario: Number(salario),
                dataAdmissao,
                ativo,
                createdAt: new Date().toISOString(),
            });

            // Limpa formulário
            setNome('');
            setCargo('');
            setTelefone('');
            setEmail('');
            setSalario('');
            setDataAdmissao('');
            setAtivo(true);

            alert('Funcionário cadastrado com sucesso!');
            carregarFuncionarios();
        } catch (error) {
            console.error('Erro ao salvar funcionário:', error);
            alert('Erro ao cadastrar funcionário');
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
        if (!editNome || !editCargo || !editSalario) return;

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
            alert('Funcionário atualizado com sucesso!');
            carregarFuncionarios();
        } catch (error) {
            console.error('Erro ao editar funcionário:', error);
            alert('Erro ao atualizar funcionário');
        }
    };

    const excluirFuncionario = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este funcionário?')) return;

        try {
            await deleteDoc(doc(db, 'funcionarios', id));
            alert('Funcionário excluído com sucesso!');
            carregarFuncionarios();
        } catch (error) {
            console.error('Erro ao excluir funcionário:', error);
            alert('Erro ao excluir funcionário');
        }
    };

    const funcionariosFiltrados = funcionarios.filter(f =>
        f.nome.toLowerCase().includes(busca.toLowerCase()) ||
        f.cargo.toLowerCase().includes(busca.toLowerCase())
    );

    if (loading) {
        return <div className="text-white text-center py-20">Carregando funcionários...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold text-white text-center mb-10">Tabela de Funcionários</h1>

            {/* Formulário de Cadastro */}
            <Card className="bg-black/50 border-red-600/30 mb-8">
                <CardHeader>
                    <CardTitle className="text-white">Cadastrar Novo Funcionário</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="text-white">Nome *</Label>
                        <Input
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            placeholder="Nome completo"
                            className="bg-black/50 border-red-600/50 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white">Cargo *</Label>
                        <Input
                            value={cargo}
                            onChange={e => setCargo(e.target.value)}
                            placeholder="Ex: Veterinário, Recepcionista, Auxiliar"
                            className="bg-black/50 border-red-600/50 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white">Telefone</Label>
                        <Input
                            value={telefone}
                            onChange={e => setTelefone(e.target.value)}
                            placeholder="(11) 99999-9999"
                            className="bg-black/50 border-red-600/50 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white">E-mail</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="exemplo@clinica.com"
                            className="bg-black/50 border-red-600/50 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white">Salário (R$)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={salario}
                            onChange={e => setSalario(e.target.value)}
                            placeholder="Ex: 4500.00"
                            className="bg-black/50 border-red-600/50 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white">Data de Admissão</Label>
                        <Input
                            type="date"
                            value={dataAdmissao}
                            onChange={e => setDataAdmissao(e.target.value)}
                            className="bg-black/50 border-red-600/50 text-white"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-3">
                        <Label className="text-white">Status</Label>
                        <Select value={ativo ? 'ativo' : 'inativo'} onValueChange={v => setAtivo(v === 'ativo')}>
                            <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ativo">Ativo</SelectItem>
                                <SelectItem value="inativo">Inativo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="md:col-span-3">
                        <Button onClick={salvarFuncionario} className="w-full bg-red-600 hover:bg-red-700 py-6 text-lg font-bold">
                            Salvar Funcionário
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Busca e Lista */}
            <Card className="bg-black/50 border-red-600/30">
                <CardHeader>
                    <CardTitle className="text-white">
                        Funcionários Cadastrados ({funcionariosFiltrados.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        placeholder="Buscar por nome ou cargo..."
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                        className="mb-6 bg-black/50 border-red-600/50 text-white"
                    />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-white">Nome</TableHead>
                                <TableHead className="text-white">Cargo</TableHead>
                                <TableHead className="text-white hidden md:table-cell">Telefone</TableHead>
                                <TableHead className="text-white hidden md:table-cell">E-mail</TableHead>
                                <TableHead className="text-white hidden md:table-cell">Salário</TableHead>
                                <TableHead className="text-white">Status</TableHead>
                                <TableHead className="text-white text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {funcionariosFiltrados.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                                        Nenhum funcionário encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                funcionariosFiltrados.map(func => (
                                    <TableRow key={func.id}>
                                        <TableCell className="text-white font-medium">{func.nome}</TableCell>
                                        <TableCell className="text-white">{func.cargo}</TableCell>
                                        <TableCell className="text-white hidden md:table-cell">{func.telefone || '-'}</TableCell>
                                        <TableCell className="text-white hidden md:table-cell">{func.email || '-'}</TableCell>
                                        <TableCell className="text-white hidden md:table-cell">R$ {func.salario.toFixed(2)}</TableCell>
                                        <TableCell>
                                            {func.ativo ? (
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                    <span className="text-green-400">Ativo</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <XCircle className="h-5 w-5 text-red-500" />
                                                    <span className="text-red-400">Inativo</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => abrirEdicao(func)} className="mr-2">
                                                <Edit className="h-4 w-4 text-blue-400" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => excluirFuncionario(func.id)}>
                                                <Trash2 className="h-4 w-4 text-red-400" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modal de Edição */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="bg-black/90 border-red-600/30 text-white">
                    <DialogHeader>
                        <DialogTitle>Editar Funcionário</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div>
                            <Label className="text-white">Nome</Label>
                            <Input value={editNome} onChange={e => setEditNome(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                        </div>
                        <div>
                            <Label className="text-white">Cargo</Label>
                            <Input value={editCargo} onChange={e => setEditCargo(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                        </div>
                        <div>
                            <Label className="text-white">Telefone</Label>
                            <Input value={editTelefone} onChange={e => setEditTelefone(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                        </div>
                        <div>
                            <Label className="text-white">E-mail</Label>
                            <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                        </div>
                        <div>
                            <Label className="text-white">Salário (R$)</Label>
                            <Input type="number" step="0.01" value={editSalario} onChange={e => setEditSalario(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                        </div>
                        <div>
                            <Label className="text-white">Data de Admissão</Label>
                            <Input type="date" value={editDataAdmissao} onChange={e => setEditDataAdmissao(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                        </div>
                        <div>
                            <Label className="text-white">Status</Label>
                            <Select value={editAtivo ? 'ativo' : 'inativo'} onValueChange={v => setEditAtivo(v === 'ativo')}>
                                <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ativo">Ativo</SelectItem>
                                    <SelectItem value="inativo">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button variant="outline" onClick={() => setEditOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={salvarEdicao} className="bg-red-600 hover:bg-red-700">
                                Salvar Alterações
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TabelaFuncionarios;