import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

interface Animal {
  id: string;
  nomeAnimal: string;
  nomeProprietario: string;
}

interface Produto {
  id: string;
  nome: string;
  preco: number;
}

interface ItemMovimento {
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

const Movimento = () => {
  const { user } = useContext(AuthContext);

  const [animais, setAnimais] = useState<Animal[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [buscaAnimal, setBuscaAnimal] = useState('');
  const [animalSelecionado, setAnimalSelecionado] = useState<Animal | null>(null);
  const [itens, setItens] = useState<ItemMovimento[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [formaPagamento, setFormaPagamento] = useState('dinheiro');
  const [loading, setLoading] = useState(false);

  // Carrega animais do usuário
  useEffect(() => {
    const carregarAnimais = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'animais'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const lista: Animal[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          lista.push({
            id: doc.id,
            nomeAnimal: data.nomeAnimal || '',
            nomeProprietario: data.nomeProprietario || '',
          });
        });
        setAnimais(lista);
      } catch (error) {
        console.error('Erro ao carregar animais:', error);
      }
    };
    carregarAnimais();
  }, [user]);

  // Carrega produtos da tabela (assumindo collection 'produtos')
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'produtos'));
        const lista: Produto[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          lista.push({
            id: doc.id,
            nome: data.nome || '',
            preco: data.preco || 0,
          });
        });
        setProdutos(lista);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    };
    carregarProdutos();
  }, []);

  const animaisFiltrados = animais.filter((a) =>
    a.nomeAnimal.toLowerCase().includes(buscaAnimal.toLowerCase()) ||
    a.nomeProprietario.toLowerCase().includes(buscaAnimal.toLowerCase())
  );

  const adicionarItem = () => {
    if (!produtoSelecionado) {
      alert('Selecione um produto');
      return;
    }

    const produto = produtos.find(p => p.id === produtoSelecionado);
    if (!produto) return;

    const novoItem: ItemMovimento = {
      produtoId: produto.id,
      nomeProduto: produto.nome,
      quantidade,
      precoUnitario: produto.preco,
      subtotal: produto.preco * quantidade,
    };

    setItens([...itens, novoItem]);
    setProdutoSelecionado('');
    setQuantidade(1);
  };

  const totalMovimento = itens.reduce((sum, item) => sum + item.subtotal, 0);

  const salvarMovimento = async () => {
    if (!animalSelecionado || itens.length === 0) {
      alert('Selecione um animal e adicione itens');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'animais', animalSelecionado.id, 'movimentos'), {
        itens,
        total: totalMovimento,
        formaPagamento,
        data: serverTimestamp(),
        userId: user?.uid,
      });

      alert('Movimento salvo com sucesso!');
      setItens([]);
      setAnimalSelecionado(null);
      setBuscaAnimal('');
    } catch (error) {
      console.error('Erro ao salvar movimento:', error);
      alert('Erro ao salvar movimento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-white text-center mb-10">Movimento - Consultas e Vendas</h1>

      {/* Seleção do Animal */}
      <Card className="bg-black/50 border-red-600/30 mb-8">
        <CardHeader>
          <CardTitle className="text-white">Buscar Animal</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Digite nome do animal ou proprietário..."
            value={buscaAnimal}
            onChange={(e) => setBuscaAnimal(e.target.value)}
            className="bg-black/50 border-red-600/50 text-white mb-4"
          />

          {buscaAnimal && animaisFiltrados.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {animaisFiltrados.map((animal) => (
                <div
                  key={animal.id}
                  className="p-4 bg-black/70 border border-red-600/30 rounded cursor-pointer hover:bg-red-600/20"
                  onClick={() => {
                    setAnimalSelecionado(animal);
                    setBuscaAnimal(`${animal.nomeAnimal} - ${animal.nomeProprietario}`);
                  }}
                >
                  <p className="text-white font-medium">{animal.nomeAnimal}</p>
                  <p className="text-gray-400 text-sm">{animal.nomeProprietario}</p>
                </div>
              ))}
            </div>
          )}

          {animalSelecionado && (
            <div className="mt-4 p-4 bg-green-600/20 border border-green-600 rounded">
              <p className="text-white font-semibold">
                Animal selecionado: {animalSelecionado.nomeAnimal} ({animalSelecionado.nomeProprietario})
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Adicionar Itens */}
      {animalSelecionado && (
        <Card className="bg-black/50 border-red-600/30 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Adicionar Itens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Label className="text-white">Produto/Serviço</Label>
                <Select onValueChange={setProdutoSelecionado} value={produtoSelecionado}>
                  <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nome} - R$ {p.preco.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Quantidade</Label>
                <Input
                  type="number"
                  min="1"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="bg-black/50 border-red-600/50 text-white"
                />
              </div>

              <div className="flex items-end">
                <Button onClick={adicionarItem} className="bg-red-600 hover:bg-red-700 w-full">
                  Adicionar Item
                </Button>
              </div>
            </div>

            {/* Lista de itens */}
            {itens.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Item</TableHead>
                    <TableHead className="text-white">Qtd</TableHead>
                    <TableHead className="text-white">Preço Unit.</TableHead>
                    <TableHead className="text-white">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-white">{item.nomeProduto}</TableCell>
                      <TableCell className="text-white">{item.quantidade}</TableCell>
                      <TableCell className="text-white">R$ {item.precoUnitario.toFixed(2)}</TableCell>
                      <TableCell className="text-white">R$ {item.subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right text-white font-bold">
                      Total
                    </TableCell>
                    <TableCell className="text-white font-bold">
                      R$ {totalMovimento.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}

            <div className="mt-6 space-y-4">
              <div>
                <Label className="text-white">Forma de Pagamento</Label>
                <Select onValueChange={setFormaPagamento} value={formaPagamento}>
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

              <Button
                onClick={salvarMovimento}
                disabled={loading || itens.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-12 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Salvando Movimento...
                  </>
                ) : (
                  'Finalizar e Salvar Movimento'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Movimento;