import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';

interface Produto {
    id: string;
    nome: string;
    tipo: 'servico' | 'produto';
    preco: number;
}

const TabelaProdutos = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState<'servico' | 'produto'>('servico');
    const [preco, setPreco] = useState('');

    useEffect(() => {
        const carregar = async () => {
            const snapshot = await getDocs(collection(db, 'produtos'));
            const lista = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Produto[];
            setProdutos(lista);
        };
        carregar();
    }, []);

    const salvar = async () => {
        if (!nome || !preco) return;
        await addDoc(collection(db, 'produtos'), {
            nome,
            tipo,
            preco: Number(preco),
        });
        setNome('');
        setPreco('');
        const snapshot = await getDocs(collection(db, 'produtos'));
        setProdutos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Produto[]);
    };

    const excluir = async (id: string) => {
        await deleteDoc(doc(db, 'produtos', id));
        setProdutos(produtos.filter(p => p.id !== id));
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold text-white text-center mb-8">Tabela de Produtos e Serviços</h1>

            <Card className="bg-black/50 border-red-600/30 mb-8">
                <CardHeader><CardTitle className="text-white">Cadastrar Item</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label className="text-white">Nome</Label>
                        <Input value={nome} onChange={e => setNome(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white">Tipo</Label>
                        <Select value={tipo} onValueChange={v => setTipo(v as 'servico' | 'produto')}>
                            <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="servico">Serviço</SelectItem>
                                <SelectItem value="produto">Produto</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white">Preço (R$)</Label>
                        <Input type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                    </div>
                    <div className="flex items-end">
                        <Button onClick={salvar} className="w-full bg-red-600 hover:bg-red-700">Salvar</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-black/50 border-red-600/30">
                <CardHeader><CardTitle className="text-white">Itens Cadastrados</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-white">Nome</TableHead>
                                <TableHead className="text-white">Tipo</TableHead>
                                <TableHead className="text-white">Preço</TableHead>
                                <TableHead className="text-white">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {produtos.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell className="text-white">{p.nome}</TableCell>
                                    <TableCell className="text-white">{p.tipo === 'servico' ? 'Serviço' : 'Produto'}</TableCell>
                                    <TableCell className="text-white">R$ {p.preco.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Button variant="destructive" size="sm" onClick={() => excluir(p.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default TabelaProdutos;