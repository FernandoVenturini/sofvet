import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';

interface Vacina {
  id: string;
  nome: string;
  doses: number;
  intervaloDias: number;
}

const TabelaVacinas = () => {
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [nome, setNome] = useState('');
  const [doses, setDoses] = useState('');
  const [intervalo, setIntervalo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarVacinas = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'vacinas'));
        const lista: Vacina[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          lista.push({
            id: docSnap.id,
            nome: data.nome || '',
            doses: data.doses || 0,
            intervaloDias: data.intervaloDias || 0,
          });
        });
        setVacinas(lista);
      } catch (error) {
        console.error('Erro ao carregar vacinas:', error);
        alert('Erro ao carregar a tabela de vacinas.');
      } finally {
        setLoading(false);
      }
    };

    carregarVacinas();
  }, []);

  const salvarVacina = async () => {
    if (!nome || !doses || !intervalo) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      await addDoc(collection(db, 'vacinas'), {
        nome,
        doses: Number(doses),
        intervaloDias: Number(intervalo),
      });
      setNome('');
      setDoses('');
      setIntervalo('');
      alert('Vacina cadastrada com sucesso!');
      // Recarrega a lista
      const snapshot = await getDocs(collection(db, 'vacinas'));
      const lista: Vacina[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        lista.push({
          id: docSnap.id,
          nome: data.nome,
          doses: data.doses,
          intervaloDias: data.intervaloDias,
        });
      });
      setVacinas(lista);
    } catch (error) {
      console.error('Erro ao salvar vacina:', error);
      alert('Erro ao cadastrar vacina.');
    }
  };

  const excluirVacina = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta vacina?')) return;
    try {
      await deleteDoc(doc(db, 'vacinas', id));
      setVacinas(vacinas.filter((v) => v.id !== id));
      alert('Vacina excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir vacina.');
    }
  };

  if (loading) {
    return <div className="text-white text-center py-20">Carregando tabela de vacinas...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-white text-center mb-8">Tabela de Vacinas</h1>

      {/* Formulário de cadastro */}
      <Card className="bg-black/50 border-red-600/30 mb-8">
        <CardHeader>
          <CardTitle className="text-white">Cadastrar Nova Vacina</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-white">Nome da Vacina</Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: V8 Filhote"
              className="bg-black/50 border-red-600/50 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Número de Doses</Label>
            <Input
              type="number"
              value={doses}
              onChange={(e) => setDoses(e.target.value)}
              placeholder="Ex: 3"
              className="bg-black/50 border-red-600/50 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Intervalo entre doses (dias)</Label>
            <Input
              type="number"
              value={intervalo}
              onChange={(e) => setIntervalo(e.target.value)}
              placeholder="Ex: 30"
              className="bg-black/50 border-red-600/50 text-white"
            />
          </div>
        </CardContent>
        <CardContent>
          <Button onClick={salvarVacina} className="bg-red-600 hover:bg-red-700 text-white font-bold">
            Salvar Vacina
          </Button>
        </CardContent>
      </Card>

      {/* Lista de vacinas cadastradas */}
      <Card className="bg-black/50 border-red-600/30">
        <CardHeader>
          <CardTitle className="text-white">Vacinas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {vacinas.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhuma vacina cadastrada ainda</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Nome</TableHead>
                  <TableHead className="text-white">Doses</TableHead>
                  <TableHead className="text-white">Intervalo (dias)</TableHead>
                  <TableHead className="text-white">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vacinas.map((vacina) => (
                  <TableRow key={vacina.id}>
                    <TableCell className="text-white">{vacina.nome}</TableCell>
                    <TableCell className="text-white">{vacina.doses}</TableCell>
                    <TableCell className="text-white">{vacina.intervaloDias}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => excluirVacina(vacina.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TabelaVacinas;