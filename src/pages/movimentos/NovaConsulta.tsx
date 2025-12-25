import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const NovaConsulta = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [animais, setAnimais] = useState<any[]>([]);
    const [produtos, setProdutos] = useState<any[]>([]);
    const [buscaAnimal, setBuscaAnimal] = useState('');
    const [animalSelecionado, setAnimalSelecionado] = useState<any>(null);
    const [itens, setItens] = useState<Array<{ produtoId: string, nome: string, quantidade: number, preco: number, desconto: number }>>([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    const [quantidade, setQuantidade] = useState(1);
    const [formaPagamento, setFormaPagamento] = useState('dinheiro');
    const [parcelas, setParcelas] = useState(1);

    useEffect(() => {
        const carregarDados = async () => {
            const animaisSnap = await getDocs(query(collection(db, 'animais'), where('userId', '==', user?.uid)));
            setAnimais(animaisSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            const produtosSnap = await getDocs(collection(db, 'produtos'));
            setProdutos(produtosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        carregarDados();
    }, [user]);

    const animaisFiltrados = animais.filter(a =>
        a.nomeAnimal.toLowerCase().includes(buscaAnimal.toLowerCase()) ||
        a.nomeProprietario.toLowerCase().includes(buscaAnimal.toLowerCase())
    );

    const adicionarItem = () => {
        if (!produtoSelecionado) return;
        const produto = produtos.find(p => p.id === produtoSelecionado);
        if (!produto) return;

        setItens([...itens, {
            produtoId: produto.id,
            nome: produto.nome,
            quantidade,
            preco: produto.preco,
            desconto: 0,
        }]);
        setProdutoSelecionado('');
        setQuantidade(1);
    };

    const total = itens.reduce((sum, item) => sum + (item.quantidade * item.preco * (1 - item.desconto / 100)), 0);

    const salvarConsulta = async () => {
        if (!animalSelecionado || itens.length === 0) {
            alert('Selecione animal e adicione itens');
            return;
        }

        await addDoc(collection(db, 'consultas'), {
            animalId: animalSelecionado.id,
            animalNome: animalSelecionado.nomeAnimal,
            proprietarioNome: animalSelecionado.nomeProprietario,
            itens,
            total,
            formaPagamento,
            parcelas,
            data: new Date().toISOString(),
            userId: user?.uid,
            createdAt: serverTimestamp(),
        });

        alert('Consulta salva com sucesso!');
        navigate('/movimento/lista');
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold text-white text-center mb-8">Nova Consulta / Movimento</h1>

            {/* Busca Animal */}
            <Card className="bg-black/50 border-red-600/30 mb-8">
                <CardHeader><CardTitle className="text-white">Buscar Animal</CardTitle></CardHeader>
                <CardContent>
                    <Input
                        placeholder="Nome do animal ou proprietário"
                        value={buscaAnimal}
                        onChange={e => setBuscaAnimal(e.target.value)}
                        className="mb-4 bg-black/50 border-red-600/50 text-white"
                    />
                    {buscaAnimal && (
                        <div className="max-h-60 overflow-y-auto">
                            {animaisFiltrados.map(animal => (
                                <div key={animal.id} className="p-3 hover:bg-red-600/20 cursor-pointer rounded" onClick={() => {
                                    setAnimalSelecionado(animal);
                                    setBuscaAnimal('');
                                }}>
                                    <p className="text-white font-medium">{animal.nomeAnimal}</p>
                                    <p className="text-gray-400 text-sm">Proprietário: {animal.nomeProprietario}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {animalSelecionado && (
                        <div className="mt-4 p-4 bg-red-600/20 rounded">
                            <p className="text-white">Animal selecionado: <strong>{animalSelecionado.nomeAnimal}</strong> ({animalSelecionado.nomeProprietario})</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Adicionar Itens */}
            <Card className="bg-black/50 border-red-600/30 mb-8">
                <CardHeader><CardTitle className="text-white">Adicionar Produtos/Serviços</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <Select value={produtoSelecionado} onValueChange={setProdutoSelecionado}>
                            <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                                <SelectValue placeholder="Selecione item" />
                            </SelectTrigger>
                            <SelectContent>
                                {produtos.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.nome} - R$ {p.preco.toFixed(2)} ({p.tipo})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input type="number" value={quantidade} onChange={e => setQuantidade(Number(e.target.value))} min="1" className="bg-black/50 border-red-600/50 text-white" />
                        <Button onClick={adicionarItem} className="bg-red-600 hover:bg-red-700">Adicionar</Button>
                    </div>

                    {itens.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-white">Item</TableHead>
                                    <TableHead className="text-white">Qtd</TableHead>
                                    <TableHead className="text-white">Preço Unit.</TableHead>
                                    <TableHead className="text-white">Desconto %</TableHead>
                                    <TableHead className="text-white">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {itens.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="text-white">{item.nome}</TableCell>
                                        <TableCell className="text-white">{item.quantidade}</TableCell>
                                        <TableCell className="text-white">R$ {item.preco.toFixed(2)}</TableCell>
                                        <TableCell className="text-white">
                                            <Input type="number" value={item.desconto} onChange={e => {
                                                const novos = [...itens];
                                                novos[index].desconto = Number(e.target.value);
                                                setItens(novos);
                                            }} className="w-20 bg-black/50 border-red-600/50 text-white" />
                                        </TableCell>
                                        <TableCell className="text-white">R$ {(item.quantidade * item.preco * (1 - item.desconto / 100)).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Financeiro */}
            <Card className="bg-black/50 border-red-600/30 mb-8">
                <CardHeader><CardTitle className="text-white">Financeiro</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <Label className="text-white">Total da Consulta</Label>
                        <div className="text-3xl font-bold text-red-400">R$ {total.toFixed(2)}</div>
                    </div>
                    <div>
                        <Label className="text-white">Forma de Pagamento</Label>
                        <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                            <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                <SelectItem value="cartao">Cartão</SelectItem>
                                <SelectItem value="pix">PIX</SelectItem>
                                <SelectItem value="parcelado">Parcelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {formaPagamento === 'parcelado' && (
                        <div>
                            <Label className="text-white">Parcelas</Label>
                            <Input type="number" value={parcelas} onChange={e => setParcelas(Number(e.target.value))} min="2" max="12" className="bg-black/50 border-red-600/50 text-white" />
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button onClick={salvarConsulta} className="bg-red-600 hover:bg-red-700 text-lg px-8 py-6">
                    Salvar Consulta
                </Button>
                <Button variant="outline" className="border-red-600 text-red-500 hover:bg-red-600/20 text-lg px-8 py-6">
                    Imprimir Recibo
                </Button>
            </div>
        </div>
    );
};

export default NovaConsulta;