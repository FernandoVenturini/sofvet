import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

interface Animal {
    id: string;
    nomeAnimal: string;
    nomeProprietario: string;
    telefoneProprietario: string;
    vacinas: Array<{
        nomeVacina: string;
        dose: number;
        dataAplicacao: string;
        proximaData: string;
    }>;
    // Futuro: consultas do animal
}

const Retorno = () => {
    const [busca, setBusca] = useState('');
    const [animais, setAnimais] = useState<Animal[]>([]);
    const [animalSelecionado, setAnimalSelecionado] = useState<Animal | null>(null);
    const [tipoRetorno, setTipoRetorno] = useState<'vacina' | 'consulta'>('vacina');
    const [vacinaSelecionada, setVacinaSelecionada] = useState('');
    const [dataRetorno, setDataRetorno] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarAnimais = async () => {
            setLoading(true);
            try {
                const snap = await getDocs(collection(db, 'animais'));
                const lista = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Animal[];
                setAnimais(lista);
            } catch (error) {
                console.error('Erro ao carregar animais:', error);
                alert('Erro ao carregar dados');
            } finally {
                setLoading(false);
            }
        };
        carregarAnimais();
    }, []);

    const animaisFiltrados = animais.filter(a =>
        a.nomeAnimal.toLowerCase().includes(busca.toLowerCase()) ||
        a.nomeProprietario.toLowerCase().includes(busca.toLowerCase())
    );

    const vacinasUnicas = Array.from(new Set(animalSelecionado?.vacinas.map(v => v.nomeVacina) || []));

    const salvarRetorno = async () => {
        if (!animalSelecionado) return;

        // Aqui você pode salvar em uma collection 'retornos' ou atualizar a ficha
        try {
            await addDoc(collection(db, 'retornos'), {
                animalId: animalSelecionado.id,
                animalNome: animalSelecionado.nomeAnimal,
                proprietarioNome: animalSelecionado.nomeProprietario,
                tipo: tipoRetorno,
                vacina: tipoRetorno === 'vacina' ? vacinaSelecionada : null,
                dataRetorno,
                observacoes,
                dataRegistro: new Date().toISOString(),
            });
            alert('Retorno registrado com sucesso!');
            setDataRetorno('');
            setObservacoes('');
            setVacinaSelecionada('');
        } catch (error) {
            console.error('Erro ao salvar retorno:', error);
            alert('Erro ao salvar');
        }
    };

    if (loading) {
        return <div className="text-white text-center py-20">Carregando animais...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold text-white text-center mb-10">Alterar / Consultar Retorno</h1>

            {/* Busca do Animal */}
            <Card className="bg-black/50 border-red-600/30 mb-8">
                <CardHeader>
                    <CardTitle className="text-white">Buscar Animal</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        placeholder="Digite o nome do animal ou proprietário"
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white mb-4"
                    />
                    <div className="max-h-60 overflow-y-auto">
                        {animaisFiltrados.map(animal => (
                            <div
                                key={animal.id}
                                className="p-4 hover:bg-red-600/20 cursor-pointer rounded mb-2 border border-red-600/20"
                                onClick={() => {
                                    setAnimalSelecionado(animal);
                                    setBusca('');
                                }}
                            >
                                <p className="text-white font-semibold">{animal.nomeAnimal}</p>
                                <p className="text-gray-400 text-sm">Proprietário: {animal.nomeProprietario} | Tel: {animal.telefoneProprietario || 'Não informado'}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Histórico do Animal Selecionado */}
            {animalSelecionado && (
                <>
                    <Card className="bg-black/50 border-red-600/30 mb-8">
                        <CardHeader>
                            <CardTitle className="text-white">
                                Histórico de {animalSelecionado.nomeAnimal}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Vacinas Aplicadas e Próximas */}
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-4">Vacinas</h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-white">Vacina</TableHead>
                                                <TableHead className="text-white">Dose</TableHead>
                                                <TableHead className="text-white">Aplicada em</TableHead>
                                                <TableHead className="text-white">Próxima</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {animalSelecionado.vacinas?.length > 0 ? (
                                                animalSelecionado.vacinas.map((v, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell className="text-white">{v.nomeVacina}</TableCell>
                                                        <TableCell className="text-white">{v.dose}ª</TableCell>
                                                        <TableCell className="text-white">
                                                            {v.dataAplicacao ? format(new Date(v.dataAplicacao), 'dd/MM/yyyy') : '-'}
                                                        </TableCell>
                                                        <TableCell className={v.proximaData && new Date(v.proximaData) < new Date() ? 'text-red-400' : 'text-green-400'}>
                                                            {v.proximaData ? format(new Date(v.proximaData), 'dd/MM/yyyy') : '-'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-gray-400 text-center">Nenhuma vacina registrada</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Futuro: Histórico de Consultas */}
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-4">Consultas Anteriores</h3>
                                    <p className="text-gray-400">Em desenvolvimento...</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Registrar Novo Retorno */}
                    <Card className="bg-black/50 border-red-600/30">
                        <CardHeader>
                            <CardTitle className="text-white">Registrar Novo Retorno</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label className="text-white">Tipo de Retorno</Label>
                                <Select value={tipoRetorno} onValueChange={v => setTipoRetorno(v as 'vacina' | 'consulta')}>
                                    <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vacina">Revacinação</SelectItem>
                                        <SelectItem value="consulta">Consulta de Retorno</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {tipoRetorno === 'vacina' && (
                                <div>
                                    <Label className="text-white">Vacina</Label>
                                    <Select value={vacinaSelecionada} onValueChange={setVacinaSelecionada}>
                                        <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                                            <SelectValue placeholder="Selecione a vacina" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vacinasUnicas.map(vacina => (
                                                <SelectItem key={vacina} value={vacina}>{vacina}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div>
                                <Label className="text-white">Data do Retorno</Label>
                                <Input
                                    type="date"
                                    value={dataRetorno}
                                    onChange={e => setDataRetorno(e.target.value)}
                                    className="bg-black/50 border-red-600/50 text-white"
                                />
                            </div>

                            <div>
                                <Label className="text-white">Observações</Label>
                                <Textarea
                                    placeholder="Detalhes do retorno, sintomas, recomendações..."
                                    value={observacoes}
                                    onChange={e => setObservacoes(e.target.value)}
                                    rows={5}
                                    className="bg-black/50 border-red-600/50 text-white"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={salvarRetorno} className="bg-red-600 hover:bg-red-700 px-10 py-6 text-lg">
                                    Salvar Retorno
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
};

export default Retorno;