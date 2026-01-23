import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Trash2, Plus, Search, Syringe, Shield, Calendar, PlusCircle, 
  AlertCircle, CheckCircle, Sparkles, Filter, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

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
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarVacinas();
  }, []);

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
      toast.error('Erro ao carregar a tabela de vacinas.');
    } finally {
      setLoading(false);
    }
  };

  const salvarVacina = async () => {
    if (!nome || !doses || !intervalo) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (Number(doses) <= 0 || Number(intervalo) <= 0) {
      toast.error('Os valores devem ser maiores que zero');
      return;
    }

    try {
      await addDoc(collection(db, 'vacinas'), {
        nome,
        doses: Number(doses),
        intervaloDias: Number(intervalo),
        createdAt: new Date(),
      });
      
      setNome('');
      setDoses('');
      setIntervalo('');
      toast.success('Vacina cadastrada com sucesso!');
      carregarVacinas();
    } catch (error) {
      console.error('Erro ao salvar vacina:', error);
      toast.error('Erro ao cadastrar vacina.');
    }
  };

  const excluirVacina = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir a vacina "${nome}"?`)) return;
    try {
      await deleteDoc(doc(db, 'vacinas', id));
      setVacinas(vacinas.filter((v) => v.id !== id));
      toast.success('Vacina excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast.error('Erro ao excluir vacina.');
    }
  };

  const vacinasFiltradas = vacinas.filter(v =>
    v.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const estatisticas = {
    total: vacinas.length,
    comMultiplasDoses: vacinas.filter(v => v.doses > 1).length,
    intervaloLongo: vacinas.filter(v => v.intervaloDias >= 30).length,
    intervaloCurto: vacinas.filter(v => v.intervaloDias < 30).length,
  };

  const resetarFormulario = () => {
    setNome('');
    setDoses('');
    setIntervalo('');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="text-gray-400">Carregando tabela de vacinas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30">
              <Syringe className="h-6 w-6 text-red-400" />
            </div>
            <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 border border-red-500/30">
              <Sparkles className="h-3 w-3 mr-1" />
              Catálogo de Vacinas
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-green-400">
            Tabela de Vacinas
          </h1>
          <p className="text-gray-400 mt-2">
            Gerencie o catálogo de vacinas disponíveis para os pacientes
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total de Vacinas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{estatisticas.total}</p>
                <p className="text-sm text-gray-400">Vacinas cadastradas</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                <Syringe className="h-5 w-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Múltiplas Doses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-400">{estatisticas.comMultiplasDoses}</p>
                <p className="text-sm text-gray-400">Com 2+ doses</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
                <Shield className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Intervalo Longo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-400">{estatisticas.intervaloLongo}</p>
                <p className="text-sm text-gray-400">≥ 30 dias</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-600/20 to-orange-600/20">
                <Calendar className="h-5 w-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Intervalo Curto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-400">{estatisticas.intervaloCurto}</p>
                <p className="text-sm text-gray-400">＜ 30 dias</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
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
                  placeholder="Buscar vacina por nome..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={carregarVacinas}
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
            <PlusCircle className="h-5 w-5 text-red-400" />
            Cadastrar Nova Vacina
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label className="text-white flex items-center gap-2">
                <Syringe className="h-4 w-4 text-red-400" />
                Nome da Vacina
              </Label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: V8 Filhote, V10, Antirrábica, etc."
                className="bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-white flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                Número de Doses
              </Label>
              <Input
                type="number"
                value={doses}
                onChange={(e) => setDoses(e.target.value)}
                placeholder="Ex: 3"
                min="1"
                className="bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-400" />
                Intervalo entre doses (dias)
              </Label>
              <Input
                type="number"
                value={intervalo}
                onChange={(e) => setIntervalo(e.target.value)}
                placeholder="Ex: 30"
                min="1"
                className="bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <Separator className="bg-gray-800/50" />

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={resetarFormulario}
              className="border-gray-700 text-gray-400 hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Limpar
            </Button>
            <Button
              onClick={salvarVacina}
              className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              disabled={!nome || !doses || !intervalo}
            >
              <Plus className="h-4 w-4" />
              Salvar Vacina
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Vacinas */}
      <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span>Vacinas Cadastradas</span>
            </div>
            <div className="text-sm text-gray-400">
              Mostrando {vacinasFiltradas.length} de {vacinas.length} vacinas
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vacinas.length === 0 ? (
            <div className="text-center py-12">
              <Syringe className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Nenhuma vacina cadastrada ainda</p>
              <p className="text-gray-500 text-sm mt-2">
                Comece cadastrando sua primeira vacina no formulário acima
              </p>
            </div>
          ) : vacinasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Nenhuma vacina encontrada</p>
              <p className="text-gray-500 text-sm mt-2">
                Tente ajustar os termos da busca
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-800/50">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800/50">
                    <TableHead className="text-gray-400">Vacina</TableHead>
                    <TableHead className="text-gray-400">Doses</TableHead>
                    <TableHead className="text-gray-400">Intervalo</TableHead>
                    <TableHead className="text-gray-400">Duração Total</TableHead>
                    <TableHead className="text-gray-400 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vacinasFiltradas.map((vacina) => {
                    const duracaoTotal = (vacina.doses - 1) * vacina.intervaloDias;
                    const hasMultipleDoses = vacina.doses > 1;
                    
                    return (
                      <TableRow key={vacina.id} className="border-gray-800/30 hover:bg-gray-800/20">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${hasMultipleDoses ? 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20' : 'bg-gradient-to-br from-emerald-600/20 to-green-600/20'}`}>
                              <Syringe className={`h-4 w-4 ${hasMultipleDoses ? 'text-blue-400' : 'text-emerald-400'}`} />
                            </div>
                            <div>
                              <p className="font-medium text-white">{vacina.nome}</p>
                              <p className="text-xs text-gray-500">ID: {vacina.id.substring(0, 8)}...</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-gray-700 text-gray-400">
                            {vacina.doses} dose{vacina.doses !== 1 ? 's' : ''}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-amber-400" />
                            <span className="text-white">{vacina.intervaloDias} dias</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {hasMultipleDoses ? (
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded ${duracaoTotal > 60 ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/20' : 'bg-gradient-to-br from-emerald-600/20 to-green-600/20'}`}>
                                <AlertCircle className={`h-3 w-3 ${duracaoTotal > 60 ? 'text-amber-400' : 'text-emerald-400'}`} />
                              </div>
                              <span className={`${duracaoTotal > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {duracaoTotal} dias
                              </span>
                            </div>
                          ) : (
                            <Badge variant="outline" className="border-gray-700 text-gray-400">
                              Dose única
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => excluirVacina(vacina.id, vacina.nome)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TabelaVacinas;