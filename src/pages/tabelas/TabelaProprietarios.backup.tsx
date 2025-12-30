import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Edit } from 'lucide-react';

interface Proprietario {
    id: string;
    nome: string;
    endereco: string;
    telefone: string;
    email: string;
    cpf: string;
    observacoes: string;
    ativo: boolean;
}

const TabelaProprietarios = () => {
    const [proprietarios, setProprietarios] = useState<Proprietario[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');

    // Formulário de cadastro
    const [nome, setNome] = useState('');
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [ativo, setAtivo] = useState(true);

    // Edição
    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState('');
    const [editNome, setEditNome] = useState('');
    const [editEndereco, setEditEndereco] = useState('');
    const [editTelefone, setEditTelefone] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editCpf, setEditCpf] = useState('');
    const [editObservacoes, setEditObservacoes] = useState('');
    const [editAtivo, setEditAtivo] = useState(true);

    useEffect(() => {
        carregarProprietarios();
    }, []);

    const carregarProprietarios = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, 'proprietarios'));
            const lista = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Proprietario[];
            setProprietarios(lista);
        } catch (error) {
            console.error('Erro ao carregar proprietários:', error);
            alert('Erro ao carregar lista');
        } finally {
            setLoading(false);
        }
    };

    const salvarProprietario = async () => {
        if (!nome.trim() || !cpf.trim()) {
            alert('Nome e CPF são obrigatórios');
            return;
        }

        try {
            await addDoc(collection(db, 'proprietarios'), {
                nome: nome.trim(),
                endereco: endereco.trim(),
                telefone: telefone.trim(),
                email: email.trim(),
                cpf: cpf.trim(),
                observacoes: observacoes.trim(),
                ativo,
            });
            setNome('');
            setEndereco('');
            setTelefone('');
            setEmail('');
            setCpf('');
            setObservacoes('');
            setAtivo(true);
            alert('Proprietário salvo com sucesso!');
            carregarProprietarios();
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar proprietário');
        }
    };

    const abrirEdicao = (p: Proprietario) => {
        setEditId(p.id);
        setEditNome(p.nome);
        setEditEndereco(p.endereco || '');
        setEditTelefone(p.telefone || '');
        setEditEmail(p.email || '');
        setEditCpf(p.cpf || '');
        setEditObservacoes(p.observacoes || '');
        setEditAtivo(p.ativo);
        setEditOpen(true);
    };

    const salvarEdicao = async () => {
        if (!editNome.trim() || !editCpf.trim()) {
            alert('Nome e CPF são obrigatórios');
            return;
        }

        try {
            await updateDoc(doc(db, 'proprietarios', editId), {
                nome: editNome.trim(),
                endereco: editEndereco.trim(),
                telefone: editTelefone.trim(),
                email: editEmail.trim(),
                cpf: editCpf.trim(),
                observacoes: editObservacoes.trim(),
                ativo: editAtivo,
            });
            setEditOpen(false);
            alert('Proprietário atualizado!');
            carregarProprietarios();
        } catch (error) {
            console.error('Erro ao editar:', error);
            alert('Erro ao atualizar proprietário');
        }
    };

    const excluir = async (id: string) => {
        if (!confirm('Excluir permanentemente?')) return;
        try {
            await deleteDoc(doc(db, 'proprietarios', id));
            alert('Excluído com sucesso!');
            carregarProprietarios();
        } catch (error) {
            console.error('Erro ao excluir:', error);
            alert('Erro ao excluir');
        }
    };

    const proprietariosFiltrados = proprietarios.filter(p =>
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.cpf.toLowerCase().includes(busca.toLowerCase())
    );

    if (loading) {
        return <div className="text-white text-center py-20">Carregando...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold text-white text-center mb-10">Tabela de Proprietários</h1>

            {/* Formulário de Cadastro */}
            <Card className="bg-black/50 border-red-600/30 mb-8">
                <CardHeader>
                    <CardTitle className="text-white">Cadastrar Novo Proprietário</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="text-white">Nome *</Label>
                        <Input value={nome} onChange={e => setNome(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white">Endereço</Label>
                        <Input value={endereco} onChange={e => setEndereco(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white">Telefone</Label>
                        <Input value={telefone} onChange={e => setTelefone(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white">E-mail</Label>
                        <Input value={email} onChange={e => setEmail(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white">CPF *</Label>
                        <Input value={cpf} onChange={e => setCpf(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                        <Label className="text-white">Observações</Label>
                        <Textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} rows={3} className="bg-black/50 border-red-600/50 text-white" />
                    </div>
                    <div className="md:col-span-3">
                        <Button onClick={salvarProprietario} className="w-full bg-red-600 hover:bg-red-700 py-6 text-lg">
                            Salvar Proprietário
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Lista */}
            <Card className="bg-black/50 border-red-600/30">
                <CardHeader>
                    <CardTitle className="text-white">
                        Proprietários Cadastrados ({proprietariosFiltrados.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        placeholder="Buscar por nome ou CPF..."
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                        className="mb-6 bg-black/50 border-red-600/50 text-white"
                    />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-white">Nome</TableHead>
                                <TableHead className="text-white hidden md:table-cell">Endereço</TableHead>
                                <TableHead className="text-white hidden md:table-cell">Telefone</TableHead>
                                <TableHead className="text-white hidden md:table-cell">E-mail</TableHead>
                                <TableHead className="text-white">CPF</TableHead>
                                <TableHead className="text-white text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {proprietariosFiltrados.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                                        Nenhum proprietário encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                proprietariosFiltrados.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="text-white font-medium">{p.nome}</TableCell>
                                        <TableCell className="text-white hidden md:table-cell">{p.endereco || '-'}</TableCell>
                                        <TableCell className="text-white hidden md:table-cell">{p.telefone || '-'}</TableCell>
                                        <TableCell className="text-white hidden md:table-cell">{p.email || '-'}</TableCell>
                                        <TableCell className="text-white">{p.cpf}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => abrirEdicao(p)} className="mr-2">
                                                <Edit className="h-4 w-4 text-blue-400" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => excluir(p.id)}>
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
                        <DialogTitle>Editar Proprietário</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div>
                            <Label className="text-white">Nome</Label>
                            <Input value={editNome} onChange={e => setEditNome(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                        </div>
                        <div>
                            <Label className="text-white">Endereço</Label>
                            <Input value={editEndereco} onChange={e => setEditEndereco(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
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
                            <Label className="text-white">CPF</Label>
                            <Input value={editCpf} onChange={e => setEditCpf(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                        </div>
                        <div>
                            <Label className="text-white">Observações</Label>
                            <Textarea value={editObservacoes} onChange={e => setEditObservacoes(e.target.value)} rows={4} className="bg-black/50 border-red-600/50 text-white" />
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

export default TabelaProprietarios;