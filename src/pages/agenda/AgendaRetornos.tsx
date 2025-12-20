import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isPast } from 'date-fns';

interface Retorno {
  id: string;
  animalId: string;
  nomeAnimal: string;
  nomeProprietario: string;
  vacinaNome: string;
  dose: number;
  dataPrevista: string;
}

const AgendaRetornos = () => {
  const [retornos, setRetornos] = useState<Retorno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarRetornos = async () => {
      setLoading(true);
      try {
        const animaisSnapshot = await getDocs(collection(db, 'animais'));
        const listaRetornos: Retorno[] = [];

        animaisSnapshot.forEach((animalDoc) => {
          const data = animalDoc.data();
          const vacinas = data.vacinas || [];

          vacinas.forEach((v: any, index: number) => {
            if (v.proximaData && v.proximaData.trim() !== '') {
              listaRetornos.push({
                id: `${animalDoc.id}-${index}`,
                animalId: animalDoc.id,
                nomeAnimal: data.nomeAnimal || 'Animal sem nome',
                nomeProprietario: data.nomeProprietario || 'Proprietário não informado',
                vacinaNome: v.nomeVacina || 'Vacina desconhecida',
                dose: v.dose || 0,
                dataPrevista: v.proximaData,
              });
            }
          });
        });

        // Ordena por data mais próxima
        listaRetornos.sort((a, b) => new Date(a.dataPrevista).getTime() - new Date(b.dataPrevista).getTime());
        setRetornos(listaRetornos);
      } catch (error) {
        console.error('Erro ao carregar agenda:', error);
        alert('Erro ao carregar a agenda de retornos.');
      } finally {
        setLoading(false);
      }
    };

    carregarRetornos();
  }, []);

  const getStatusBadge = (dataPrevista: string) => {
    const date = new Date(dataPrevista);
    if (isPast(date) && !isToday(date)) {
      return <Badge className="bg-red-600 text-white">Atrasado</Badge>;
    }
    if (isToday(date)) {
      return <Badge className="bg-yellow-500 text-black">Hoje</Badge>;
    }
    return <Badge className="bg-green-600 text-white">Agendado</Badge>;
  };

  if (loading) {
    return <div className="text-white text-center py-20">Carregando agenda de retornos...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-white text-center mb-8">Agenda de Retornos e Revacinações</h1>

      <Card className="bg-black/50 border-red-600/30">
        <CardHeader>
          <CardTitle className="text-white">
            Próximos Retornos ({retornos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {retornos.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Nenhum retorno programado no momento
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Animal</TableHead>
                  <TableHead className="text-white">Proprietário</TableHead>
                  <TableHead className="text-white">Vacina</TableHead>
                  <TableHead className="text-white">Dose</TableHead>
                  <TableHead className="text-white">Data Prevista</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {retornos.map((retorno) => (
                  <TableRow key={retorno.id}>
                    <TableCell className="text-white font-medium">{retorno.nomeAnimal}</TableCell>
                    <TableCell className="text-gray-300">{retorno.nomeProprietario}</TableCell>
                    <TableCell className="text-white">{retorno.vacinaNome}</TableCell>
                    <TableCell className="text-white">{retorno.dose}ª dose</TableCell>
                    <TableCell className="text-white">
                      {format(new Date(retorno.dataPrevista), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{getStatusBadge(retorno.dataPrevista)}</TableCell>
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

export default AgendaRetornos;