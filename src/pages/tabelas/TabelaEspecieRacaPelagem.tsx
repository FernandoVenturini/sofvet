import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Edit } from 'lucide-react';

interface Especie {
    id: string;
    nome: string;
}

interface Raca {
    id: string;
    nome: string;
    especieId: string;
}

interface Pelagem {
    id: string;
    nome: string;
    racaId: string;
}

// Dados reais pré-definidos (expandidos para mais raças e pelagens)
const DADOS_INICIAIS = {
    especies: ['Canino', 'Felino', 'Ave', 'Roedor', 'Réptil', 'Equino', 'Coelho', 'Exótico'],
    racas: {
        Canino: [
            'Labrador Retriever', 'Golden Retriever', 'Pastor Alemão', 'Bulldog Francês', 'Poodle', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer', 'Dachshund', 'Shih Tzu', 'SRD',
            'Bulldog Inglês', 'Pit Bull', 'Border Collie', 'Chihuahua', 'Siberian Husky', 'Doberman', 'Maltês', 'Cocker Spaniel', 'Jack Russell Terrier'
        ],
        Felino: [
            'Persa', 'Siamês', 'Maine Coon', 'Sphynx', 'Ragdoll', 'British Shorthair', 'Abissínio', 'Bengal', 'SRD',
            'Scottish Fold', 'Birman', 'Norueguês da Floresta', 'Devon Rex', 'Burmese', 'Exótico de Pelo Curto'
        ],
        Ave: [
            'Calopsita', 'Papagaio', 'Agapornis', 'Canário', 'Periquito', 'Arara', 'Cacatua', 'Pardal', 'Pintassilgo', 'Mandarim'
        ],
        Roedor: [
            'Hamster', 'Porquinho da Índia', 'Chinchila', 'Gerbil', 'Rato', 'Camundongo', 'Coelho Anão'
        ],
        Réptil: [
            'Jabuti', 'Iguana', 'Serpente', 'Camaleão', 'Tartaruga', 'Lagarto', 'Cobra do Milho'
        ],
        Equino: [
            'Quarto de Milha', 'Puro Sangue Inglês', 'Mangalarga Marchador', 'Árabe', 'Appaloosa', 'Paint Horse'
        ],
        Coelho: [
            'Mini Lop', 'Holland Lop', 'Netherland Dwarf', 'Flemish Giant', 'Rex', 'Angorá'
        ],
        Exótico: [
            'Furão', 'Primata', 'Hedgehog', 'Sugar Glider', 'Axolotl', 'Outros'
        ]
    },
    pelagens: [
        'Curta', 'Longa', 'Média', 'Sem pelo', 'Ondulada', 'Fios duros', 'Cacheada', 'Densa', 'Rala', 'Macia', 'Áspera', 'Brilhante', 'Opaca'
    ],
};

const TabelaEspecieRacaPelagem = () => {
    const [especies, setEspecies] = useState<Especie[]>([]);
    const [racas, setRacas] = useState<Raca[]>([]);
    const [pelagens, setPelagens] = useState<Pelagem[]>([]);
    const [loading, setLoading] = useState(true);

    const [novaEspecie, setNovaEspecie] = useState('');
    const [especieSelecionada, setEspecieSelecionada] = useState('');
    const [novaRaca, setNovaRaca] = useState('');
    const [racaSelecionada, setRacaSelecionada] = useState('');
    const [novaPelagem, setNovaPelagem] = useState('');

    const [editOpen, setEditOpen] = useState(false);
    const [editTipo, setEditTipo] = useState<'especie' | 'raca' | 'pelagem'>('especie');
    const [editId, setEditId] = useState('');
    const [editNome, setEditNome] = useState('');

    const carregarDados = async () => {
        setLoading(true);
        try {
            const especiesSnap = await getDocs(collection(db, 'especies'));
            let listaEspecies = especiesSnap.docs.map(doc => ({ id: doc.id, nome: doc.data().nome } as Especie));
            setEspecies(listaEspecies);

            const racasSnap = await getDocs(collection(db, 'racas'));
            setRacas(racasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Raca)));

            const pelagensSnap = await getDocs(collection(db, 'pelagens'));
            setPelagens(pelagensSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pelagem)));
        } catch (error) {
            console.error('Erro:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const inicializarDados = async () => {
            const especiesSnap = await getDocs(collection(db, 'especies'));
            if (especiesSnap.empty) {
                const especieMap: { [key: string]: string } = {};
                for (const nome of DADOS_INICIAIS.especies) {
                    const docRef = await addDoc(collection(db, 'especies'), { nome });
                    especieMap[nome] = docRef.id;
                }

                // Pré-cadastra raças
                for (const [especieNome, racasLista] of Object.entries(DADOS_INICIAIS.racas)) {
                    const especieId = especieMap[especieNome];
                    if (especieId) {
                        for (const racaNome of racasLista) {
                            await addDoc(collection(db, 'racas'), { nome: racaNome, especieId });
                        }
                    }
                }

                // Pré-cadastra pelagens (associadas a uma raça padrão, ex: Labrador para Canino)
                const racasSnap = await getDocs(collection(db, 'racas'));
                const labrador = racasSnap.docs.find(doc => doc.data().nome === 'Labrador Retriever');
                if (labrador) {
                    const labradorId = labrador.id;
                    for (const nome of DADOS_INICIAIS.pelagens) {
                        await addDoc(collection(db, 'pelagens'), { nome, racaId: labradorId });
                    }
                }
            }
            carregarDados();
        };

        inicializarDados();
    }, []);

    const adicionarEspecie = async () => {
        if (!novaEspecie.trim()) return;
        await addDoc(collection(db, 'especies'), { nome: novaEspecie.trim() });
        setNovaEspecie('');
        carregarDados();
    };

    const adicionarRaca = async () => {
        if (!novaRaca.trim() || !especieSelecionada) return;
        await addDoc(collection(db, 'racas'), { nome: novaRaca.trim(), especieId: especieSelecionada });
        setNovaRaca('');
        setEspecieSelecionada('');
        carregarDados();
    };

    const adicionarPelagem = async () => {
        if (!novaPelagem.trim() || !racaSelecionada) return;
        await addDoc(collection(db, 'pelagens'), { nome: novaPelagem.trim(), racaId: racaSelecionada });
        setNovaPelagem('');
        setRacaSelecionada('');
        carregarDados();
    };

    const abrirEdicao = (tipo: 'especie' | 'raca' | 'pelagem', id: string, nome: string) => {
        setEditTipo(tipo);
        setEditId(id);
        setEditNome(nome);
        setEditOpen(true);
    };

    const salvarEdicao = async () => {
        if (!editNome.trim()) return;
        const ref = doc(db, editTipo === 'especie' ? 'especies' : editTipo === 'raca' ? 'racas' : 'pelagens', editId);
        await updateDoc(ref, { nome: editNome.trim() });
        setEditOpen(false);
        carregarDados();
    };

    const excluir = async (tipo: 'especie' | 'raca' | 'pelagem', id: string) => {
        if (!confirm('Excluir permanentemente?')) return;
        const ref = doc(db, tipo === 'especie' ? 'especies' : tipo === 'raca' ? 'racas' : 'pelagens', id);
        await deleteDoc(ref);
        carregarDados();
    };

    if (loading) {
        return <div className="text-white text-center py-20">Carregando listas...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold text-white text-center mb-10">Espécie, Raça e Pelagem</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Espécies */}
                <Card className="bg-black/50 border-red-600/30">
                    <CardHeader><CardTitle className="text-white">Espécies</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input placeholder="Nova espécie" value={novaEspecie} onChange={e => setNovaEspecie(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
                            <Button onClick={adicionarEspecie} className="bg-red-600 hover:bg-red-700">Adicionar</Button>
                        </div>
                        <Table>
                            <TableHeader><TableRow><TableHead className="text-white">Nome</TableHead><TableHead className="text-white text-right">Ações</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {especies.map(e => (
                                    <TableRow key={e.id}>
                                        <TableCell className="text-white">{e.nome}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => abrirEdicao('especie', e.id, e.nome)}><Edit className="h-4 w-4 text-blue-400" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => excluir('especie', e.id)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Raças */}
                <Card className="bg-black/50 border-red-600/30">
                    <CardHeader><CardTitle className="text-white">Raças</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-white">Espécie</Label>
                            <Select value={especieSelecionada} onValueChange={setEspecieSelecionada}>
                                <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                                    <SelectValue placeholder="Selecione a espécie" />
                                </SelectTrigger>
                                <SelectContent>
                                    {especies.map(e => <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2">
                            <Input placeholder="Nova raça" value={novaRaca} onChange={e => setNovaRaca(e.target.value)} disabled={!especieSelecionada} className="bg-black/50 border-red-600/50 text-white" />
                            <Button onClick={adicionarRaca} disabled={!especieSelecionada || !novaRaca.trim()} className="bg-red-600 hover:bg-red-700">Adicionar</Button>
                        </div>
                        <Table>
                            <TableHeader><TableRow><TableHead className="text-white">Raça</TableHead><TableHead className="text-white">Espécie</TableHead><TableHead className="text-white text-right">Ações</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {racas.map(r => (
                                    <TableRow key={r.id}>
                                        <TableCell className="text-white">{r.nome}</TableCell>
                                        <TableCell className="text-white">
                                            {especies.find(e => e.id === r.especieId)?.nome || '—'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => abrirEdicao('raca', r.id, r.nome)}><Edit className="h-4 w-4 text-blue-400" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => excluir('raca', r.id)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pelagens */}
                <Card className="bg-black/50 border-red-600/30">
                    <CardHeader><CardTitle className="text-white">Pelagens</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-white">Raça</Label>
                            <Select value={racaSelecionada} onValueChange={setRacaSelecionada}>
                                <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                                    <SelectValue placeholder="Selecione a raça" />
                                </SelectTrigger>
                                <SelectContent>
                                    {racas.map(r => <SelectItem key={r.id} value={r.id}>{r.nome}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2">
                            <Input placeholder="Nova pelagem" value={novaPelagem} onChange={e => setNovaPelagem(e.target.value)} disabled={!racaSelecionada} className="bg-black/50 border-red-600/50 text-white" />
                            <Button onClick={adicionarPelagem} disabled={!racaSelecionada || !novaPelagem.trim()} className="bg-red-600 hover:bg-red-700">Adicionar</Button>
                        </div>
                        <Table>
                            <TableHeader><TableRow><TableHead className="text-white">Pelagem</TableHead><TableHead className="text-white">Raça</TableHead><TableHead className="text-white text-right">Ações</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {pelagens.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="text-white">{p.nome}</TableCell>
                                        <TableCell className="text-white">
                                            {racas.find(r => r.id === p.racaId)?.nome || '—'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => abrirEdicao('pelagem', p.id, p.nome)}><Edit className="h-4 w-4 text-blue-400" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => excluir('pelagem', p.id)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="bg-black/90 border-red-600/30 text-white">
                    <DialogHeader><DialogTitle>Editar</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                        <Input value={editNome} onChange={e => setEditNome(e.target.value)} className="bg-black/50 border-red-600/50 text-white" />
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

export default TabelaEspecieRacaPelagem;