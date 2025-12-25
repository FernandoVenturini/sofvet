import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer } from 'lucide-react';
import { format } from 'date-fns';

const Relatorios = () => {
  const [activeTab, setActiveTab] = useState('faturamento');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataInicio && dataFim) carregarRelatorio();
  }, [activeTab, dataInicio, dataFim]);

  const carregarRelatorio = async () => {
    setLoading(true);
    try {
      let lista: any[] = [];

      if (activeTab === 'faturamento') {
        const snap = await getDocs(collection(db, 'consultas'));
        snap.forEach(doc => {
          const d = doc.data();
          if (d.data >= dataInicio && d.data <= dataFim) lista.push(d);
        });
        setDados(lista);
      }

      if (activeTab === 'devedores') {
        const snap = await getDocs(collection(db, 'consultas'));
        snap.forEach(doc => {
          const d = doc.data();
          if (d.formaPagamento === 'parcelado' && d.parcelas > 1) lista.push(d);
        });
        setDados(lista);
      }

      if (activeTab === 'vacinas-pendentes') {
        const snap = await getDocs(collection(db, 'animais'));
        snap.forEach(doc => {
          const d = doc.data();
          const vacinas = d.vacinas || [];
          vacinas.forEach((v: any) => {
            if (v.proximaData && v.proximaData >= dataInicio && v.proximaData <= dataFim) {
              lista.push({ ...d, proximaVacina: v });
            }
          });
        });
        setDados(lista);
      }

      if (activeTab === 'animais-especie') {
        const snap = await getDocs(collection(db, 'animais'));
        const contagem: any = {};
        snap.forEach(doc => {
          const especie = doc.data().especie || 'Não informada';
          contagem[especie] = (contagem[especie] || 0) + 1;
        });
        setDados(Object.entries(contagem).map(([especie, total]) => ({ especie, total })));
      }

      if (activeTab === 'produtos-vendidos') {
        const snap = await getDocs(collection(db, 'consultas'));
        const contagem: any = {};
        snap.forEach(doc => {
          const itens = doc.data().itens || [];
          itens.forEach((item: any) => {
            const nome = item.nome || 'Sem nome';
            contagem[nome] = (contagem[nome] || 0) + item.quantidade;
          });
        });
        setDados(Object.entries(contagem).map(([nome, quantidade]) => ({ nome, quantidade })));
      }

      if (activeTab === 'mala-direta') {
        const snap = await getDocs(collection(db, 'animais'));
        snap.forEach(doc => {
          const d = doc.data();
          const vacinas = d.vacinas || [];
          vacinas.forEach((v: any) => {
            if (v.proximaData) {
              lista.push({
                animal: d.nomeAnimal,
                proprietario: d.nomeProprietario,
                telefone: d.telefoneProprietario,
                vacina: v.nomeVacina,
                dose: v.dose,
                dataPrevista: v.proximaData,
              });
            }
          });
        });
        setDados(lista);
      }
    } catch (error) {
      alert('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const imprimir = () => window.print();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-white text-center mb-8">Relatórios</h1>

      {/* Filtros */}
      <Card className="bg-black/50 border-red-600/30 mb-8">
        <CardHeader>
          <CardTitle className="text-white">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-white">Data Início</Label>
            <Input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
          </div>
          <div>
            <Label className="text-white">Data Fim</Label>
            <Input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
          </div>
          <div className="flex items-end">
            <Button onClick={carregarRelatorio} className="w-full bg-red-600 hover:bg-red-700">
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Abas dos relatórios */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'faturamento', label: 'Faturamento' },
          { id: 'devedores', label: 'Clientes Devedores' },
          { id: 'vacinas-pendentes', label: 'Vacinas Pendentes' },
          { id: 'animais-especie', label: 'Animais por Espécie' },
          { id: 'produtos-vendidos', label: 'Produtos Mais Vendidos' },
          { id: 'mala-direta', label: 'Mala Direta Revacinação' },
        ].map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'bg-red-600' : 'border-red-600 text-red-500 hover:bg-red-600/20'}
          >
            {tab.label}
          </Button>
        ))}
        <Button onClick={imprimir} className="ml-auto bg-blue-600 hover:bg-blue-700">
          <Printer className="mr-2 h-4 w-4" />
          Imprimir
        </Button>
      </div>

      {/* Resultados */}
      <Card className="bg-black/50 border-red-600/30">
        <CardHeader>
          <CardTitle className="text-white">
            {activeTab === 'faturamento' && 'Faturamento'}
            {activeTab === 'devedores' && 'Clientes Devedores'}
            {activeTab === 'vacinas-pendentes' && 'Vacinas Pendentes'}
            {activeTab === 'animais-especie' && 'Animais por Espécie'}
            {activeTab === 'produtos-vendidos' && 'Produtos/Serviços Mais Vendidos'}
            {activeTab === 'mala-direta' && 'Mala Direta de Revacinação'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-400 text-center py-8">Carregando...</p>
          ) : dados.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhum dado encontrado</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {activeTab === 'faturamento' && (
                    <>
                      <TableHead className="text-white">Data</TableHead>
                      <TableHead className="text-white">Animal</TableHead>
                      <TableHead className="text-white">Total</TableHead>
                    </>
                  )}
                  {activeTab === 'devedores' && (
                    <>
                      <TableHead className="text-white">Proprietário</TableHead>
                      <TableHead className="text-white">Animal</TableHead>
                      <TableHead className="text-white">Parcelas</TableHead>
                    </>
                  )}
                  {activeTab === 'vacinas-pendentes' && (
                    <>
                      <TableHead className="text-white">Animal</TableHead>
                      <TableHead className="text-white">Vacina</TableHead>
                      <TableHead className="text-white">Próxima Dose</TableHead>
                    </>
                  )}
                  {activeTab === 'animais-especie' && (
                    <>
                      <TableHead className="text-white">Espécie</TableHead>
                      <TableHead className="text-white">Quantidade</TableHead>
                    </>
                  )}
                  {activeTab === 'produtos-vendidos' && (
                    <>
                      <TableHead className="text-white">Produto/Serviço</TableHead>
                      <TableHead className="text-white">Quantidade Vendida</TableHead>
                    </>
                  )}
                  {activeTab === 'mala-direta' && (
                    <>
                      <TableHead className="text-white">Animal</TableHead>
                      <TableHead className="text-white">Proprietário</TableHead>
                      <TableHead className="text-white">Telefone</TableHead>
                      <TableHead className="text-white">Vacina</TableHead>
                      <TableHead className="text-white">Data Prevista</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dados.map((item, i) => (
                  <TableRow key={i}>
                    {activeTab === 'faturamento' && (
                      <>
                        <TableCell className="text-white">{format(new Date(item.data), 'dd/MM/yyyy')}</TableCell>
                        <TableCell className="text-white">{item.animalNome}</TableCell>
                        <TableCell className="text-white">R$ {item.total.toFixed(2)}</TableCell>
                      </>
                    )}
                    {activeTab === 'devedores' && (
                      <>
                        <TableCell className="text-white">{item.proprietarioNome}</TableCell>
                        <TableCell className="text-white">{item.animalNome}</TableCell>
                        <TableCell className="text-white">{item.parcelas} parcelas</TableCell>
                      </>
                    )}
                    {activeTab === 'vacinas-pendentes' && (
                      <>
                        <TableCell className="text-white">{item.nomeAnimal}</TableCell>
                        <TableCell className="text-white">{item.proximaVacina.nomeVacina}</TableCell>
                        <TableCell className="text-white">{format(new Date(item.proximaVacina.proximaData), 'dd/MM/yyyy')}</TableCell>
                      </>
                    )}
                    {activeTab === 'animais-especie' && (
                      <>
                        <TableCell className="text-white">{item[0]}</TableCell>
                        <TableCell className="text-white">{item[1]}</TableCell>
                      </>
                    )}
                    {activeTab === 'produtos-vendidos' && (
                      <>
                        <TableCell className="text-white">{item[0]}</TableCell>
                        <TableCell className="text-white">{item[1]}</TableCell>
                      </>
                    )}
                    {activeTab === 'mala-direta' && (
                      <>
                        <TableCell className="text-white">{item.animal}</TableCell>
                        <TableCell className="text-white">{item.proprietario}</TableCell>
                        <TableCell className="text-white">{item.telefone}</TableCell>
                        <TableCell className="text-white">{item.vacina}</TableCell>
                        <TableCell className="text-white">{format(new Date(item.dataPrevista), 'dd/MM/yyyy')}</TableCell>
                      </>
                    )}
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