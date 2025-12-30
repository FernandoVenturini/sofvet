import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Edit } from 'lucide-react';

interface Produto {
    id: string;
    nome: string;
    tipo: 'servico' | 'produto';
    preco: number;
}

const TabelaProdutosServicos = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');

    // Formulário
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState<'servico' | 'produto'>('servico');
    const [preco, setPreco] = useState('');

    // Edição
    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState('');
    const [editNome, setEditNome] = useState('');
    const [editTipo, setEditTipo] = useState<'servico' | 'produto'>('servico');
    const [editPreco, setEditPreco] = useState('');

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, 'produtos'));
            const lista = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    nome: data.nome || 'Sem nome',
                    tipo: data.tipo || 'servico',
                    preco: data.preco || 0,
                };
            });
            setProdutos(lista);
        } catch (error) {
            console.error('Erro ao carregar:', error);
        } finally {
            setLoading(false);
        }
    };

    const salvarProduto = async () => {
        if (!nome.trim() || !preco) {
            alert('Nome e preço são obrigatórios');
            return;
        }

        try {
            await addDoc(collection(db, 'produtos'), {
                nome: nome.trim(),
                tipo,
                preco: Number(preco),
            });
            setNome('');
            setPreco('');
            setTipo('servico');
            alert('Produto/Serviço salvo com sucesso!');
            carregarProdutos();
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar');
        }
    };

    const abrirEdicao = (p: Produto) => {
        setEditId(p.id);
        setEditNome(p.nome);
        setEditTipo(p.tipo);
        setEditPreco(p.preco.toString());
        setEditOpen(true);
    };

    const salvarEdicao = async () => {
        if (!editNome.trim() || !editPreco) return;

        try {
            await updateDoc(doc(db, 'produtos', editId), {
                nome: editNome.trim(),
                tipo: editTipo,
                preco: Number(editPreco),
            });
            setEditOpen(false);
            alert('Atualizado com sucesso!');
            carregarProdutos();
        } catch (error) {
            console.error('Erro ao editar:', error);
            alert('Erro ao atualizar');
        }
    };

    const excluir = async (id: string) => {
        if (!confirm('Excluir permanentemente?')) return;
        try {
            await deleteDoc(doc(db, 'produtos', id));
            alert('Excluído com sucesso!');
            carregarProdutos();
        } catch (error) {
            console.error('Erro ao excluir:', error);
            alert('Erro ao excluir');
        }
    };

    const produtosFiltrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(busca.toLowerCase())
    );

    if (loading) {
        return <div className="text-white text-center py-20 text-2xl">Carregando...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold text-white text-center mb-10">Produtos e Serviços</h1>

            {/* Formulário */}
            <Card className="bg-black/50 border-red-600/30 mb-10">
                <CardHeader>
                    <CardTitle className="text-white">Cadastrar Novo Item</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="text-white">Nome *</Label>
                        <Input
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            placeholder="Ex: Consulta Geral"
                            className="bg-black/50 border-red-600/50 text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white">Tipo</Label>
                        <div className="flex gap-4">
                            <label className="flex items-center text-white">
                                <input
                                    type="radio"
                                    value="servico"
                                    checked={tipo === 'servico'}
                                    onChange={() => setTipo('servico')}
                                    className="mr-2"
                                />
                                Serviço
                            </label>
                            <label className="flex items-center text-white">
                                <input
                                    type="radio"
                                    value="produto"
                                    checked={tipo === 'produto'}
                                    onChange={() => setTipo('produto')}
                                    className="mr-2"
                                />
                                Produto
                            </label>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white">Preço (R$)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={preco}
                            onChange={e => setPreco(e.target.value)}
                            placeholder="99.90"
                            className="bg-black/50 border-red-600/50 text-white"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <Button onClick={salvarProduto} className="w-full bg-red-600 hover:bg-red-700 py-6 text-lg">
                            Salvar Item
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Lista */}
            <Card className="bg-black/50 border-red-600/30">
                <CardHeader>
                    <CardTitle className="text-white">
                        Itens Cadastrados ({produtosFiltrados.length})
                    </CardTitle>
                    <Input
                        placeholder="Buscar por nome..."
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                        className="mt-4 bg-black/50 border-red-600/50 text-white"
                    />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-white">Nome</TableHead>
                                <TableHead className="text-white">Tipo</TableHead>
                                <TableHead className="text-white">Preço</TableHead>
                                <TableHead className="text-white text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {produtosFiltrados.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-gray-400 py-10">
                                        Nenhum item cadastrado ainda
                                    </TableCell>
                                </TableRow>
                            ) : (
                                produtosFiltrados.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="text-white font-medium">{p.nome}</TableCell>
                                        <TableCell className="text-white">
                                            {p.tipo === 'servico' ? 'Serviço' : 'Produto'}
                                        </TableCell>
                                        <TableCell className="text-white">R$ {p.preco.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => abrirEdicao(p)}>
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

            {/* Modal Edição */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="bg-black/90 border-red-600/30 text-white">
                    <DialogHeader>
                        <DialogTitle>Editar Item</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input value={editNome} onChange={e => setEditNome(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                        <div className="flex gap-4">
                            <label className="flex items-center text-white">
                                <input
                                    type="radio"
                                    value="servico"
                                    checked={editTipo === 'servico'}
                                    onChange={() => setEditTipo('servico')}
                                    className="mr-2"
                                />
                                Serviço
                            </label>
                            <label className="flex items-center text-white">
                                <input
                                    type="radio"
                                    value="produto"
                                    checked={editTipo === 'produto'}
                                    onChange={() => setEditTipo('produto')}
                                    className="mr-2"
                                />
                                Produto
                            </label>
                        </div>
                        <Input type="number" step="0.01" value={editPreco} onChange={e => setEditPreco(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                        <div className="flex justify-end gap-4">
                            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
                            <Button onClick={salvarEdicao} className="bg-red-600 hover:bg-red-700">Salvar</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TabelaProdutosServicos;