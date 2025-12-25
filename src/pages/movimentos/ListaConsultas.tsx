import ReactDOMServer from 'react-dom/server';


import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

interface Consulta {
    id: string;
    animalNome: string;
    proprietarioNome: string;
    data: string;
    total: number;
    itens: Array<{ nome: string, quantidade: number, preco: number }>;
}

const ListaConsultas = () => {
    const [consultas, setConsultas] = useState<Consulta[]>([]);
    const [busca, setBusca] = useState('');
    const [loading, setLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const carregarConsultas = async () => {
            setLoading(true);
            try {
                const snapshot = await getDocs(collection(db, 'consultas'));
                const lista = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Consulta[];
                setConsultas(lista);
            } catch (error) {
                console.error('Erro ao carregar consultas:', error);
            } finally {
                setLoading(false);
            }
        };
        carregarConsultas();
    }, []);

    const consultasFiltradas = consultas.filter(c =>
        c.animalNome.toLowerCase().includes(busca.toLowerCase()) ||
        c.proprietarioNome.toLowerCase().includes(busca.toLowerCase())
    );

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    const imprimirRecibo = (consulta: Consulta) => {
        // Cria um componente temporário para impressão
        const PrintComponent = () => (
            <div ref={printRef} className="p-8 bg-white text-black">
                <h1 className="text-3xl font-bold text-center mb-8">Recibo - SofVet</h1>
                <p><strong>Animal:</strong> {consulta.animalNome}</p>
                <p><strong>Proprietário:</strong> {consulta.proprietarioNome}</p>
                <p><strong>Data:</strong> {new Date(consulta.data).toLocaleDateString('pt-BR')}</p>
                <h2 className="text-xl font-bold mt-6 mb-4">Itens da Consulta</h2>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2">Item</th>
                            <th className="text-center py-2">Qtd</th>
                            <th className="text-right py-2">Preço</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consulta.itens.map((item, i) => (
                            <tr key={i} className="border-b">
                                <td className="py-2">{item.nome}</td>
                                <td className="text-center py-2">{item.quantidade}</td>
                                <td className="text-right py-2">R$ {(item.quantidade * item.preco).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="text-xl font-bold text-right mt-8">
                    Total: R$ {consulta.total.toFixed(2)}
                </p>
                <p className="text-center mt-12 text-gray-600">Obrigado pela preferência!</p>
            </div>
        );

        // Renderiza temporariamente e imprime
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
        <html>
          <head><title>Recibo SofVet</title></head>
          <body>${ReactDOMServer.renderToString(<PrintComponent />)}</body>
        </html>
      `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    if (loading) {
        return <div className="text-white text-center py-20">Carregando consultas...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold text-white text-center mb-8">Lista de Consultas</h1>

            <Card className="bg-black/50 border-red-600/30 mb-8">
                <CardHeader>
                    <CardTitle className="text-white">Buscar Consulta</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        placeholder="Nome do animal ou proprietário"
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                        className="bg-black/50 border-red-600/50 text-white"
                    />
                </CardContent>
            </Card>

            <Card className="bg-black/50 border-red-600/30">
                <CardHeader>
                    <CardTitle className="text-white">Consultas Realizadas ({consultasFiltradas.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-white">Animal</TableHead>
                                <TableHead className="text-white">Proprietário</TableHead>
                                <TableHead className="text-white">Data</TableHead>
                                <TableHead className="text-white">Total</TableHead>
                                <TableHead className="text-white">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {consultasFiltradas.map(consulta => (
                                <TableRow key={consulta.id}>
                                    <TableCell className="text-white">{consulta.animalNome}</TableCell>
                                    <TableCell className="text-white">{consulta.proprietarioNome}</TableCell>
                                    <TableCell className="text-white">
                                        {new Date(consulta.data).toLocaleDateString('pt-BR')}
                                    </TableCell>
                                    <TableCell className="text-white font-bold">
                                        R$ {consulta.total.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => imprimirRecibo(consulta)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                                            <Printer className="h-4 w-4 mr-2" />
                                            Imprimir Recibo
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ListaConsultas;