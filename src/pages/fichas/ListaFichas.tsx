import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Trash2, Edit } from 'lucide-react';

interface Ficha {
    id: string;
    nomeAnimal: string;
    especie: string;
    raca: string;
    nomeProprietario: string;
    imagemUrl?: string;
}

const ListaFichas = () => {
    const { user } = useContext(AuthContext);
    const [fichas, setFichas] = useState<Ficha[]>([]);
    const [busca, setBusca] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarFichas = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const q = query(collection(db, 'animais'), where('userId', '==', user.uid));
                const snapshot = await getDocs(q);
                const lista: Ficha[] = [];
                snapshot.forEach((docSnap) => {
                    const data = docSnap.data();
                    lista.push({
                        id: docSnap.id,
                        nomeAnimal: data.nomeAnimal || '',
                        especie: data.especie || '',
                        raca: data.raca || '',
                        nomeProprietario: data.nomeProprietario || '',
                        imagemUrl: data.imagemUrl || '',
                    });
                });
                setFichas(lista);
            } catch (error) {
                console.error('Erro ao carregar fichas:', error);
                alert('Erro ao carregar as fichas.');
            } finally {
                setLoading(false);
            }
        };

        carregarFichas();
    }, [user]);

    const fichasFiltradas = fichas.filter((ficha) =>
        ficha.nomeAnimal.toLowerCase().includes(busca.toLowerCase()) ||
        ficha.nomeProprietario.toLowerCase().includes(busca.toLowerCase())
    );

    const excluirFicha = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta ficha?')) return;
        try {
            await deleteDoc(doc(db, 'animais', id));
            setFichas(fichas.filter((f) => f.id !== id));
            alert('Ficha excluída com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir:', error);
            alert('Erro ao excluir a ficha.');
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                Carregando fichas...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold text-white text-center mb-8">Lista de Fichas</h1>

            {/* Busca */}
            <Card className="bg-black/50 border-red-600/30 mb-8">
                <CardHeader>
                    <CardTitle className="text-white">Buscar Ficha</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Nome do animal ou proprietário..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="pl-10 bg-black/50 border-red-600/50 text-white"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Tabela */}
            <Card className="bg-black/50 border-red-600/30">
                <CardHeader>
                    <CardTitle className="text-white">
                        Fichas Cadastradas ({fichasFiltradas.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {fichasFiltradas.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">
                            {busca ? 'Nenhuma ficha encontrada com essa busca' : 'Nenhuma ficha cadastrada ainda'}
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-white">Foto</TableHead>
                                    <TableHead className="text-white">Animal</TableHead>
                                    <TableHead className="text-white">Espécie / Raça</TableHead>
                                    <TableHead className="text-white">Proprietário</TableHead>
                                    <TableHead className="text-white">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fichasFiltradas.map((ficha) => (
                                    <TableRow key={ficha.id}>
                                        <TableCell>
                                            {ficha.imagemUrl ? (
                                                <img
                                                    src={ficha.imagemUrl}
                                                    alt={ficha.nomeAnimal}
                                                    className="h-12 w-12 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
                                                    Sem foto
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-white font-medium">{ficha.nomeAnimal}</TableCell>
                                        <TableCell className="text-gray-300">{ficha.especie} / {ficha.raca}</TableCell>
                                        <TableCell className="text-gray-300">{ficha.nomeProprietario}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Link to={`/fichas/editar/${ficha.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => excluirFicha(ficha.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
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

export default ListaFichas;