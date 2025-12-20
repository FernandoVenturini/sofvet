import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface MovimentoItem {
  nomeProduto: string;
  quantidade: number;
  subtotal: number;
}

interface Movimento {
  total: number;
  data: any;
  itens: MovimentoItem[];
}

interface VacinaPendente {
  nomeAnimal: string;
  nomeProprietario: string;
  vacinaNome: string;
  dose: number;
  dataPrevista: string;
}

interface Aniversariante {
  nomeAnimal: string;
  nomeProprietario: string;
  dataNascimento: string;
}

const Relatorios = () => {
  const [faturamentoTotal, setFaturamentoTotal] = useState(0);
  const [vacinasPendentes, setVacinasPendentes] = useState<VacinaPendente[]>([]);
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarRelatorios = async () => {
      setLoading(true);
      try {
        // 1. Faturamento total (todos os movimentos)
        let totalFaturado = 0;
        const animaisSnapshot = await getDocs(collection(db, 'animais'));
        for (const animalDoc of animaisSnapshot.docs) {
          const movimentosSnapshot = await getDocs(collection(db, 'animais', animalDoc.id, 'movimentos'));
          movimentosSnapshot.forEach((movDoc) => {
            const data = movDoc.data() as Movimento;
            totalFaturado += data.total || 0;
          });
        }
        setFaturamentoTotal(totalFaturado);

        // 2. Vacinas pendentes (próximas doses)
        const pendentes: VacinaPendente[] = [];
        animaisSnapshot.forEach((animalDoc) => {
          const data = animalDoc.data();
          const vacinas = data.vacinas || [];
          vacinas.forEach((v: any) => {
            if (v.proximaData) {
              pendentes.push({
                nomeAnimal: data.nomeAnimal || '',
                nomeProprietario: data.nomeProprietario || '',
                vacinaNome: v.nomeVacina || '',
                dose: v.dose || 0,
                dataPrevista: v.proximaData,
              });
            }
          });
        });
        // Ordena por data mais próxima
        pendentes.sort((a, b) => new Date(a.dataPrevista).getTime() - new Date(b.dataPrevista).getTime());
        setVacinasPendentes(pendentes);

        // 3. Aniversariantes do mês atual
        const hoje = new Date();
        const inicioMes = startOfMonth(hoje);
        const fimMes = endOfMonth(hoje);
        const aniversariantesMes: Aniversariante[] = [];

        animaisSnapshot.forEach((animalDoc) => {
          const data = animalDoc.data();
          if (data.dataNascimento) {
            const nascimento = new Date(data.dataNascimento);
            const nascimentoEsteAno = new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate());
            if (isWithinInterval(nascimentoEsteAno, { start: inicioMes, end: fimMes })) {
              aniversariantesMes.push({
                nomeAnimal: data.nomeAnimal || '',
                nomeProprietario: data.nomeProprietario || '',
                dataNascimento: data.dataNascimento,
              });
            }
          }
        });
        setAniversariantes(aniversariantesMes);

      } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
        alert('Erro ao carregar relatórios.');
      } finally {
        setLoading(false);
      }
    };

    carregarRelatorios();
  }, []);

  if (loading) {
    return <div className="text-white text-center py-20">Carregando relatórios...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-white text-center mb-10">Relatórios</h1>

      {/* Faturamento Total */}
      <Card className="bg-black/50 border-red-600/30 mb-8">
        <CardHeader>
          <CardTitle className="text-white">Faturamento Total (Todos os Tempos)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold text-green-400">
            R$ {faturamentoTotal.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      {/* Vacinas Pendentes */}
      <Card className="bg-black/50 border-red-600/30 mb-8">
        <CardHeader>
          <CardTitle className="text-white">
            Vacinas Pendentes ({vacinasPendentes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vacinasPendentes.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhuma vacina pendente</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Animal</TableHead>
                  <TableHead className="text-white">Proprietário</TableHead>
                  <TableHead className="text-white">Vacina</TableHead>
                  <TableHead className="text-white">Dose</TableHead>
                  <TableHead className="text-white">Data Prevista</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vacinasPendentes.map((v, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-white">{v.nomeAnimal}</TableCell>
                    <TableCell className="text-gray-300">{v.nomeProprietario}</TableCell>
                    <TableCell className="text-white">{v.vacinaNome}</TableCell>
                    <TableCell className="text-white">{v.dose}ª dose</TableCell>
                    <TableCell className="text-white">
                      {format(new Date(v.dataPrevista), 'dd/MM/yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Aniversariantes do Mês */}
      <Card className="bg-black/50 border-red-600/30">
        <CardHeader>
          <CardTitle className="text-white">
            Aniversariantes do Mês ({aniversariantes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {aniversariantes.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhum aniversariante este mês</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Animal</TableHead>
                  <TableHead className="text-white">Proprietário</TableHead>
                  <TableHead className="text-white">Data de Nascimento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aniversariantes.map((a, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-white font-medium">{a.nomeAnimal}</TableCell>
                    <TableCell className="text-gray-300">{a.nomeProprietario}</TableCell>
                    <TableCell className="text-white">
                      {format(new Date(a.dataNascimento), 'dd/MM/yyyy')}
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

export default Relatorios;