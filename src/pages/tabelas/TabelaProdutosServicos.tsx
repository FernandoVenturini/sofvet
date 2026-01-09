import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    Trash2, Edit, Search, Plus, Package, Settings, DollarSign,
    ShoppingBag, Stethoscope, Sparkles, Filter, RefreshCw, TrendingUp,
    Activity, Tag, Star, ShoppingCart, Clock,
    FileText, CreditCard, Receipt, PlusCircle,
    MinusCircle, Layers, Database, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Produto {
    id: string;
    nome: string;
    tipo: 'servico' | 'produto' | 'medicamento' | 'cirurgia' | 'procedimento';
    categoria: string;
    preco: number;
    descricao?: string;
    estoque?: number;
    custo?: number;
    codigo?: string;
    duracao?: number;
    createdAt: string;
    updatedAt?: string;
}

interface Lancamento {
    id: string;
    produtoId: string;
    produtoNome: string;
    produtoTipo: string;
    quantidade: number;
    precoUnitario: number;
    precoTotal: number;
    desconto: number;
    observacao?: string;
    status: 'pendente' | 'finalizado' | 'cancelado';
    comandaId?: string;
    clienteId?: string;
    clienteNome?: string;
    createdAt: string;
    createdBy: string;
}

interface Comanda {
    id: string;
    numero: number;
    clienteId?: string;
    clienteNome?: string;
    total: number;
    totalDesconto: number;
    totalFinal: number;
    status: 'aberta' | 'fechada' | 'paga';
    lancamentos: string[];
    createdAt: string;
    fechadaEm?: string;
}

const TabelaProdutosServicos = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
    const [comandas, setComandas] = useState<Comanda[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');
    const [filtroTipo, setFiltroTipo] = useState<'todos' | Produto['tipo']>('todos');
    const [activeTab, setActiveTab] = useState('cadastrar');

    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState<Produto['tipo']>('servico');
    const [categoria, setCategoria] = useState('');
    const [preco, setPreco] = useState('');
    const [descricao, setDescricao] = useState('');
    const [estoque, setEstoque] = useState('');
    const [duracao, setDuracao] = useState('');
    const [codigo, setCodigo] = useState('');

    const [comandaAtual, setComandaAtual] = useState<Comanda | null>(null);
    const [lancamentoQuantidade, setLancamentoQuantidade] = useState<{ [key: string]: number }>({});
    const [clienteNome, setClienteNome] = useState('');
    const [observacaoLancamento, setObservacaoLancamento] = useState('');
    const [descontoPercentual, setDescontoPercentual] = useState('0');
    const [modalLancamento, setModalLancamento] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState('');
    const [editNome, setEditNome] = useState('');
    const [editTipo, setEditTipo] = useState<Produto['tipo']>('servico');
    const [editCategoria, setEditCategoria] = useState('');
    const [editPreco, setEditPreco] = useState('');
    const [editDescricao, setEditDescricao] = useState('');
    const [editEstoque, setEditEstoque] = useState('');
    const [editDuracao, setEditDuracao] = useState('');
    const [editCodigo, setEditCodigo] = useState('');

    const [buscaDebounced, setBuscaDebounced] = useState('');

    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setBuscaDebounced(busca);
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [busca]);

    const carregarDados = async () => {
        setLoading(true);
        try {
            // Carregar produtos
            const produtosSnapshot = await getDocs(collection(db, 'produtos'));
            const produtosLista = produtosSnapshot.docs.map(doc => ({
                id: doc.id,
                nome: doc.data().nome || 'Sem nome',
                tipo: doc.data().tipo || 'servico',
                categoria: doc.data().categoria || 'geral',
                preco: doc.data().preco || 0,
                descricao: doc.data().descricao,
                estoque: doc.data().estoque,
                custo: doc.data().custo,
                codigo: doc.data().codigo,
                duracao: doc.data().duracao,
                createdAt: doc.data().createdAt,
                updatedAt: doc.data().updatedAt,
            }));
            setProdutos(produtosLista);

            // Carregar lançamentos pendentes
            const lancamentosSnapshot = await getDocs(
                query(collection(db, 'lancamentos'), where('status', '==', 'pendente'))
            );
            const lancamentosLista = lancamentosSnapshot.docs.map(doc => ({
                id: doc.id,
                produtoId: doc.data().produtoId,
                produtoNome: doc.data().produtoNome,
                produtoTipo: doc.data().produtoTipo,
                quantidade: doc.data().quantidade,
                precoUnitario: doc.data().precoUnitario,
                precoTotal: doc.data().precoTotal,
                desconto: doc.data().desconto || 0,
                observacao: doc.data().observacao,
                status: doc.data().status,
                comandaId: doc.data().comandaId,
                clienteId: doc.data().clienteId,
                clienteNome: doc.data().clienteNome,
                createdAt: doc.data().createdAt,
                createdBy: doc.data().createdBy,
            }));
            setLancamentos(lancamentosLista);

            // Carregar comandas abertas e ordenar por número
            const comandasSnapshot = await getDocs(
                query(collection(db, 'comandas'), where('status', '==', 'aberta'))
            );

            let comandasLista: Comanda[] = [];

            if (!comandasSnapshot.empty) {
                comandasLista = comandasSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        numero: data.numero || 0,
                        clienteId: data.clienteId,
                        clienteNome: data.clienteNome,
                        total: data.total || 0,
                        totalDesconto: data.totalDesconto || 0,
                        totalFinal: data.totalFinal || 0,
                        status: data.status,
                        lancamentos: data.lancamentos || [],
                        createdAt: data.createdAt,
                        fechadaEm: data.fechadaEm,
                    };
                });

                // Ordenar por número (mais alta primeiro)
                comandasLista.sort((a, b) => b.numero - a.numero);
            }

            setComandas(comandasLista);

            // Se não houver comanda aberta, criar uma
            if (comandasLista.length === 0) {
                await criarComandaAtual();
            } else {
                // Usar a comanda mais recente (maior número)
                const comandaMaisRecente = comandasLista[0];

                // Verificar se precisa corrigir valores
                const lancamentosComanda = lancamentosLista.filter(l => l.comandaId === comandaMaisRecente.id);
                const totalCalculado = lancamentosComanda.reduce((acc, l) => acc + l.precoTotal, 0);
                const descontoCalculado = lancamentosComanda.reduce((acc, l) => acc + l.desconto, 0);
                const finalCalculado = totalCalculado - descontoCalculado;

                // Se os valores estão inconsistentes, corrigir
                if (comandaMaisRecente.total !== totalCalculado ||
                    comandaMaisRecente.totalDesconto !== descontoCalculado ||
                    comandaMaisRecente.totalFinal !== finalCalculado) {

                    await updateDoc(doc(db, 'comandas', comandaMaisRecente.id), {
                        total: totalCalculado,
                        totalDesconto: descontoCalculado,
                        totalFinal: Math.max(0, finalCalculado), // Garantir não negativo
                        updatedAt: new Date().toISOString(),
                    });

                    // Atualizar objeto local
                    setComandaAtual({
                        ...comandaMaisRecente,
                        total: totalCalculado,
                        totalDesconto: descontoCalculado,
                        totalFinal: Math.max(0, finalCalculado),
                    });
                } else {
                    setComandaAtual(comandaMaisRecente);
                }
            }

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            toast.error('Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    const criarComandaAtual = async () => {
        try {
            // Gerar número único para comanda
            const comandasSnapshot = await getDocs(collection(db, 'comandas'));
            const numerosExistentes = comandasSnapshot.docs.map(doc => doc.data().numero || 0);
            const ultimoNumero = numerosExistentes.length > 0 ? Math.max(...numerosExistentes) : 999;
            const comandaNumero = ultimoNumero + 1;

            const novaComanda = {
                numero: comandaNumero,
                clienteNome: '',
                total: 0,
                totalDesconto: 0,
                totalFinal: 0,
                status: 'aberta' as const,
                lancamentos: [],
                createdAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, 'comandas'), novaComanda);
            const novaComandaComId = {
                ...novaComanda,
                id: docRef.id,
            };

            setComandaAtual(novaComandaComId);
            setComandas(prev => [novaComandaComId, ...prev]);

            return novaComandaComId;
        } catch (error) {
            console.error('Erro ao criar comanda:', error);
            toast.error('Erro ao criar comanda');
            return null;
        }
    };

    const salvarProduto = async () => {
        if (!nome.trim()) {
            toast.error('Digite um nome para o item');
            return;
        }

        if (!preco || Number(preco) <= 0) {
            toast.error('Digite um preço válido');
            return;
        }

        try {
            const produtoData = {
                nome: nome.trim(),
                tipo,
                categoria: categoria.trim() || 'geral',
                preco: Number(preco),
                descricao: descricao.trim() || '',
                estoque: estoque ? Number(estoque) : null,
                custo: Number(preco) * 0.6, // Custo 60% do preço
                codigo: codigo.trim() || '',
                duracao: duracao ? Number(duracao) : null,
                createdAt: new Date().toISOString(),
            };

            await addDoc(collection(db, 'produtos'), produtoData);

            // Reset form
            setNome('');
            setPreco('');
            setDescricao('');
            setEstoque('');
            setDuracao('');
            setCodigo('');
            setCategoria('');
            setTipo('servico');

            toast.success('Item cadastrado com sucesso!');
            carregarDados();
            setActiveTab('listar');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            toast.error('Erro ao salvar item');
        }
    };

    const abrirEdicao = (produto: Produto) => {
        setEditId(produto.id);
        setEditNome(produto.nome);
        setEditTipo(produto.tipo);
        setEditCategoria(produto.categoria);
        setEditPreco(produto.preco.toString());
        setEditDescricao(produto.descricao || '');
        setEditEstoque(produto.estoque?.toString() || '');
        setEditDuracao(produto.duracao?.toString() || '');
        setEditCodigo(produto.codigo || '');
        setEditOpen(true);
    };

    const salvarEdicao = async () => {
        if (!editNome.trim()) {
            toast.error('Digite um nome para o item');
            return;
        }

        if (!editPreco || Number(editPreco) <= 0) {
            toast.error('Digite um preço válido');
            return;
        }

        try {
            await updateDoc(doc(db, 'produtos', editId), {
                nome: editNome.trim(),
                tipo: editTipo,
                categoria: editCategoria.trim() || 'geral',
                preco: Number(editPreco),
                descricao: editDescricao.trim() || '',
                estoque: editEstoque ? Number(editEstoque) : null,
                duracao: editDuracao ? Number(editDuracao) : null,
                codigo: editCodigo.trim() || '',
                updatedAt: new Date().toISOString(),
            });

            setEditOpen(false);
            toast.success('Item atualizado com sucesso!');
            carregarDados();
        } catch (error) {
            console.error('Erro ao editar:', error);
            toast.error('Erro ao atualizar item');
        }
    };

    const excluirProduto = async (id: string, nome: string) => {
        if (!confirm(`Tem certeza que deseja excluir "${nome}"? Esta ação não pode ser desfeita.`)) return;

        try {
            await deleteDoc(doc(db, 'produtos', id));
            toast.success('Item excluído com sucesso!');
            carregarDados();
        } catch (error) {
            console.error('Erro ao excluir:', error);
            toast.error('Erro ao excluir item');
        }
    };

    const adicionarLancamento = async (produto: Produto) => {
        try {
            // Garantir que temos uma comanda atual
            let comandaParaUsar = comandaAtual;
            if (!comandaParaUsar) {
                comandaParaUsar = await criarComandaAtual();
                if (!comandaParaUsar) {
                    toast.error('Não foi possível criar uma comanda');
                    return;
                }
            }

            const quantidade = lancamentoQuantidade[produto.id] || 1;

            // Verificar estoque
            if (produto.estoque !== undefined && produto.estoque < quantidade) {
                toast.error(`Estoque insuficiente. Disponível: ${produto.estoque}`);
                return;
            }

            const precoTotal = produto.preco * quantidade;
            const descontoValor = (precoTotal * Number(descontoPercentual)) / 100;
            const precoFinal = precoTotal - descontoValor;

            // Criar lançamento
            const lancamentoData = {
                produtoId: produto.id,
                produtoNome: produto.nome,
                produtoTipo: produto.tipo,
                quantidade,
                precoUnitario: produto.preco,
                precoTotal,
                desconto: descontoValor,
                observacao: observacaoLancamento.trim() || '',
                status: 'pendente',
                comandaId: comandaParaUsar.id,
                clienteNome: clienteNome.trim() || 'Cliente não identificado',
                createdAt: new Date().toISOString(),
                createdBy: 'usuario_atual',
            };

            const lancamentoRef = await addDoc(collection(db, 'lancamentos'), lancamentoData);

            // Atualizar estoque se for produto/medicamento
            if (produto.estoque !== undefined) {
                await updateDoc(doc(db, 'produtos', produto.id), {
                    estoque: produto.estoque - quantidade,
                    updatedAt: new Date().toISOString(),
                });
            }

            // Calcular novos totais da comanda
            const novosLancamentos = [...comandaParaUsar.lancamentos, lancamentoRef.id];
            const novoTotal = (comandaParaUsar.total || 0) + precoTotal;
            const novoTotalDesconto = (comandaParaUsar.totalDesconto || 0) + descontoValor;
            const novoTotalFinal = Math.max(0, novoTotal - novoTotalDesconto);

            // Atualizar comanda
            await updateDoc(doc(db, 'comandas', comandaParaUsar.id), {
                total: novoTotal,
                totalDesconto: novoTotalDesconto,
                totalFinal: novoTotalFinal,
                lancamentos: novosLancamentos,
                clienteNome: clienteNome.trim() || comandaParaUsar.clienteNome || '',
                updatedAt: new Date().toISOString(),
            });

            // Reset states
            setLancamentoQuantidade(prev => ({ ...prev, [produto.id]: 1 }));
            setObservacaoLancamento('');
            setModalLancamento(false);
            setProdutoSelecionado(null);

            toast.success(`${produto.nome} adicionado à comanda!`);
            await carregarDados();

        } catch (error) {
            console.error('Erro ao adicionar lançamento:', error);
            toast.error('Erro ao adicionar item à comanda');
        }
    };

    const finalizarComanda = async () => {
        if (!comandaAtual || lancamentos.length === 0) {
            toast.error('Nenhum item na comanda para finalizar');
            return;
        }

        try {
            // Atualizar status dos lançamentos
            const updatePromises = lancamentos.map(lanc =>
                updateDoc(doc(db, 'lancamentos', lanc.id), {
                    status: 'finalizado',
                    updatedAt: new Date().toISOString(),
                })
            );

            await Promise.all(updatePromises);

            // Fechar comanda atual
            await updateDoc(doc(db, 'comandas', comandaAtual.id), {
                status: 'fechada',
                fechadaEm: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            toast.success('Comanda finalizada com sucesso!');

            // Criar nova comanda e recarregar dados
            await criarComandaAtual();
            await carregarDados();

        } catch (error) {
            console.error('Erro ao finalizar comanda:', error);
            toast.error('Erro ao finalizar comanda');
        }
    };

    const removerLancamento = async (lancamentoId: string, produtoId?: string, quantidade?: number) => {
        try {
            // Buscar dados do lançamento
            const lancamento = lancamentos.find(l => l.id === lancamentoId);
            if (!lancamento) {
                toast.error('Lançamento não encontrado');
                return;
            }

            // Restaurar estoque se for produto
            if (produtoId && quantidade && comandaAtual) {
                const produtoDoc = await getDocs(query(collection(db, 'produtos'), where('__name__', '==', produtoId)));
                if (!produtoDoc.empty) {
                    const produtoData = produtoDoc.docs[0].data();
                    await updateDoc(doc(db, 'produtos', produtoId), {
                        estoque: (produtoData.estoque || 0) + quantidade,
                        updatedAt: new Date().toISOString(),
                    });
                }
            }

            // Remover lançamento
            await deleteDoc(doc(db, 'lancamentos', lancamentoId));

            // Atualizar comanda
            if (comandaAtual) {
                const novosLancamentos = comandaAtual.lancamentos.filter(id => id !== lancamentoId);
                const lancamentosRestantes = lancamentos.filter(l => l.id !== lancamentoId);

                const novoTotal = lancamentosRestantes.reduce((acc, l) => acc + l.precoTotal, 0);
                const novoTotalDesconto = lancamentosRestantes.reduce((acc, l) => acc + l.desconto, 0);
                const novoTotalFinal = Math.max(0, novoTotal - novoTotalDesconto);

                await updateDoc(doc(db, 'comandas', comandaAtual.id), {
                    total: novoTotal,
                    totalDesconto: novoTotalDesconto,
                    totalFinal: novoTotalFinal,
                    lancamentos: novosLancamentos,
                    updatedAt: new Date().toISOString(),
                });
            }

            toast.success('Item removido da comanda');
            await carregarDados();
        } catch (error) {
            console.error('Erro ao remover lançamento:', error);
            toast.error('Erro ao remover item da comanda');
        }
    };

    const corrigirValoresComanda = async () => {
        if (!comandaAtual) return;

        try {
            // Recalcular totais baseado nos lançamentos atuais
            const lancamentosComanda = lancamentos.filter(l => l.comandaId === comandaAtual.id);
            const totalCalculado = lancamentosComanda.reduce((acc, l) => acc + l.precoTotal, 0);
            const descontoCalculado = lancamentosComanda.reduce((acc, l) => acc + l.desconto, 0);
            const finalCalculado = Math.max(0, totalCalculado - descontoCalculado);

            await updateDoc(doc(db, 'comandas', comandaAtual.id), {
                total: totalCalculado,
                totalDesconto: descontoCalculado,
                totalFinal: finalCalculado,
                updatedAt: new Date().toISOString(),
            });

            // Atualizar estado local
            setComandaAtual({
                ...comandaAtual,
                total: totalCalculado,
                totalDesconto: descontoCalculado,
                totalFinal: finalCalculado,
            });

            toast.success('Valores da comanda corrigidos!');
            carregarDados();
        } catch (error) {
            console.error('Erro ao corrigir comanda:', error);
            toast.error('Erro ao corrigir valores');
        }
    };

    const preencherExemplos = async () => {
        try {
            const exemplos: Omit<Produto, 'id' | 'createdAt'>[] = [
                // Serviços
                { nome: 'Consulta Clínica Geral', tipo: 'servico', categoria: 'Consultas', preco: 120.00, descricao: 'Consulta completa com exame físico', duracao: 30 },
                { nome: 'Consulta Emergencial', tipo: 'servico', categoria: 'Consultas', preco: 250.00, descricao: 'Atendimento de emergência 24h', duracao: 60 },
                { nome: 'Consulta Retorno', tipo: 'servico', categoria: 'Consultas', preco: 80.00, descricao: 'Consulta de retorno', duracao: 20 },
                { nome: 'Vacinação Anual', tipo: 'servico', categoria: 'Vacinas', preco: 90.00, descricao: 'Aplicação de vacina anual', duracao: 15 },
                { nome: 'Banho e Tosa Pequeno', tipo: 'servico', categoria: 'Estética', preco: 60.00, descricao: 'Banho e tosa para pets até 10kg', duracao: 120 },

                // Cirurgias
                { nome: 'Castração - Cães Pequenos', tipo: 'cirurgia', categoria: 'Cirurgias', preco: 400.00, descricao: 'Cirurgia de castração para cães até 10kg', duracao: 60 },
                { nome: 'Castração - Gatos', tipo: 'cirurgia', categoria: 'Cirurgias', preco: 350.00, descricao: 'Cirurgia de castração para gatos', duracao: 45 },

                // Procedimentos
                { nome: 'Exame de Sangue Completo', tipo: 'procedimento', categoria: 'Exames', preco: 95.00, descricao: 'Hemograma completo', duracao: 10 },
                { nome: 'Raio-X Simples', tipo: 'procedimento', categoria: 'Exames', preco: 150.00, descricao: 'Raio-X em uma posição', duracao: 20 },

                // Produtos
                { nome: 'Vacina V10', tipo: 'produto', categoria: 'Vacinas', preco: 80.00, descricao: 'Vacina polivalente para cães', estoque: 50 },
                { nome: 'Antipulgas Frontline', tipo: 'produto', categoria: 'Antiparasitários', preco: 45.90, descricao: 'Antipulgas e carrapatos 3 pipetas', estoque: 100 },
                { nome: 'Ração Royal Canin 10kg', tipo: 'produto', categoria: 'Alimentos', preco: 189.90, descricao: 'Ração premium para cães adultos', estoque: 30 },

                // Medicamentos
                { nome: 'Dipirona Gotas 50ml', tipo: 'medicamento', categoria: 'Analgésicos', preco: 15.90, descricao: 'Analgésico e antitérmico', estoque: 45 },
                { nome: 'Amoxicilina 500mg', tipo: 'medicamento', categoria: 'Antibióticos', preco: 35.00, descricao: 'Antibiótico de amplo espectro', estoque: 50 },
            ];

            for (const exemplo of exemplos) {
                await addDoc(collection(db, 'produtos'), {
                    ...exemplo,
                    custo: exemplo.preco * 0.6,
                    createdAt: new Date().toISOString(),
                });
            }

            toast.success(`${exemplos.length} itens de exemplo adicionados com sucesso!`);
            carregarDados();
        } catch (error) {
            console.error('Erro ao preencher exemplos:', error);
            toast.error('Erro ao adicionar exemplos');
        }
    };

    const produtosFiltrados = produtos.filter(p => {
        const matchesSearch = p.nome.toLowerCase().includes(buscaDebounced.toLowerCase()) ||
            p.descricao?.toLowerCase().includes(buscaDebounced.toLowerCase()) ||
            p.codigo?.toLowerCase().includes(buscaDebounced.toLowerCase()) ||
            p.categoria.toLowerCase().includes(buscaDebounced.toLowerCase());
        const matchesType = filtroTipo === 'todos' || p.tipo === filtroTipo;
        return matchesSearch && matchesType;
    });

    const estatisticas = {
        totalProdutos: produtos.length,
        servicos: produtos.filter(p => p.tipo === 'servico').length,
        produtos: produtos.filter(p => p.tipo === 'produto').length,
        medicamentos: produtos.filter(p => p.tipo === 'medicamento').length,
        cirurgias: produtos.filter(p => p.tipo === 'cirurgia').length,
        procedimentos: produtos.filter(p => p.tipo === 'procedimento').length,
        valorTotalLancamentos: lancamentos.reduce((acc, l) => acc + l.precoTotal, 0),
        totalDescontos: lancamentos.reduce((acc, l) => acc + l.desconto, 0),
        valorFinalLancamentos: Math.max(0, lancamentos.reduce((acc, l) => acc + (l.precoTotal - l.desconto), 0)),
        itensNaComanda: lancamentos.reduce((acc, l) => acc + l.quantidade, 0),
        comandasAbertas: comandas.length,
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <p className="text-gray-400">Carregando produtos e serviços...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30">
                            <ShoppingBag className="h-6 w-6 text-red-400" />
                        </div>
                        <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 border border-red-500/30">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Catálogo Completo da Clínica
                        </Badge>
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                        Produtos e Serviços
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm md:text-base">
                        Gerencie todo o catálogo e faça lançamentos na comanda
                    </p>
                </div>

                {/* Comanda Atual */}
                {comandaAtual && (
                    <Card className="w-full lg:w-auto bg-gradient-to-br from-emerald-900/20 to-green-900/20 border border-emerald-500/30">
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Receipt className="h-8 w-8 text-emerald-400" />
                                    <div>
                                        <p className="text-sm text-emerald-300">Comanda #{comandaAtual.numero}</p>
                                        <p className={`text-xl md:text-2xl font-bold ${(comandaAtual.totalFinal || 0) < 0 ? 'text-red-400' : 'text-white'
                                            }`}>
                                            R$ {Math.max(0, comandaAtual.totalFinal || 0).toFixed(2)}
                                        </p>
                                        <p className="text-xs text-emerald-400">
                                            {lancamentos.length} itens • {estatisticas.itensNaComanda} unidades
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {(comandaAtual.totalFinal < 0 || comandaAtual.totalFinal !== estatisticas.valorFinalLancamentos) && (
                                        <Button
                                            variant="outline"
                                            onClick={corrigirValoresComanda}
                                            className="border-amber-700 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                                            title="Corrigir valores da comanda"
                                        >
                                            <AlertCircle className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        onClick={finalizarComanda}
                                        disabled={lancamentos.length === 0}
                                        className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                                    >
                                        <CreditCard className="h-4 w-4" />
                                        Finalizar
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium text-gray-400">Total Itens</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xl md:text-2xl font-bold text-white">{estatisticas.totalProdutos}</p>
                                <p className="text-xs text-gray-400">Cadastrados</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                                <Database className="h-3 w-3 md:h-4 md:w-4 text-red-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium text-gray-400">Serviços</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xl md:text-2xl font-bold text-blue-400">{estatisticas.servicos}</p>
                                <p className="text-xs text-gray-400">Consultas</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
                                <Stethoscope className="h-3 w-3 md:h-4 md:w-4 text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium text-gray-400">Produtos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xl md:text-2xl font-bold text-emerald-400">{estatisticas.produtos}</p>
                                <p className="text-xs text-gray-400">Farmácia</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20">
                                <Package className="h-3 w-3 md:h-4 md:w-4 text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium text-gray-400">Medicamentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xl md:text-2xl font-bold text-purple-400">{estatisticas.medicamentos}</p>
                                <p className="text-xs text-gray-400">Remédios</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                                <Package className="h-3 w-3 md:h-4 md:w-4 text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium text-gray-400">Valor Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xl md:text-2xl font-bold text-amber-400">
                                    R$ {estatisticas.valorTotalLancamentos.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-400">Lançamentos</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-600/20 to-orange-600/20">
                                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium text-gray-400">Na Comanda</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xl md:text-2xl font-bold text-cyan-400">{estatisticas.itensNaComanda}</p>
                                <p className="text-xs text-gray-400">Unidades</p>
                            </div>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-600/20 to-blue-600/20">
                                <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 text-cyan-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Comanda Ativa */}
            {lancamentos.length > 0 && (
                <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                    <CardHeader>
                        <CardTitle className="text-white flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-emerald-400" />
                                Comanda Ativa - #{comandaAtual?.numero}
                                <Badge className="ml-2 bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-400 border-emerald-500/30">
                                    {lancamentos.length} itens
                                </Badge>
                            </div>
                            <div className="text-sm text-gray-400 mt-1 sm:mt-0">
                                Cliente: {clienteNome || 'Não informado'}
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Cliente e Desconto */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <Label className="text-white mb-2 block">Cliente</Label>
                                    <Input
                                        value={clienteNome}
                                        onChange={e => setClienteNome(e.target.value)}
                                        placeholder="Nome do cliente"
                                        className="bg-gray-900/50 border-gray-700/50 text-white"
                                    />
                                </div>
                                <div className="w-full sm:w-48">
                                    <Label className="text-white mb-2 block">Desconto (%)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={descontoPercentual}
                                            onChange={e => setDescontoPercentual(e.target.value)}
                                            className="bg-gray-900/50 border-gray-700/50 text-white"
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={() => setDescontoPercentual('0')}
                                            className="border-gray-700 text-gray-400"
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Lista de Lançamentos */}
                            <div className="border border-gray-800/50 rounded-lg overflow-x-auto">
                                <div className="min-w-[600px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-gray-800/50">
                                                <TableHead className="text-gray-400">Item</TableHead>
                                                <TableHead className="text-gray-400">Quantidade</TableHead>
                                                <TableHead className="text-gray-400">Preço Unit.</TableHead>
                                                <TableHead className="text-gray-400">Desconto</TableHead>
                                                <TableHead className="text-gray-400">Subtotal</TableHead>
                                                <TableHead className="text-gray-400 text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {lancamentos.map(l => (
                                                <TableRow key={l.id} className="border-gray-800/30 hover:bg-gray-800/20">
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${l.produtoTipo === 'servico' ? 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20' :
                                                                    l.produtoTipo === 'cirurgia' ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/20' :
                                                                        l.produtoTipo === 'medicamento' ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20' :
                                                                            'bg-gradient-to-br from-emerald-600/20 to-green-600/20'
                                                                }`}>
                                                                {l.produtoTipo === 'servico' ? <Stethoscope className="h-4 w-4" /> :
                                                                    l.produtoTipo === 'cirurgia' ? <Activity className="h-4 w-4" /> :
                                                                        l.produtoTipo === 'medicamento' ? <Package className="h-4 w-4" /> :
                                                                            <FileText className="h-4 w-4" />
                                                                }
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-white">{l.produtoNome}</p>
                                                                <p className="text-xs text-gray-500 capitalize">{l.produtoTipo}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    if (l.quantidade > 1) {
                                                                        removerLancamento(l.id, l.produtoId, 1);
                                                                    }
                                                                }}
                                                                className="h-6 w-6 p-0 border-gray-700"
                                                                disabled={l.quantidade <= 1}
                                                            >
                                                                <MinusCircle className="h-3 w-3" />
                                                            </Button>
                                                            <span className="font-medium text-white min-w-[20px] text-center">
                                                                {l.quantidade}
                                                            </span>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    const produto = produtos.find(p => p.id === l.produtoId);
                                                                    if (produto) {
                                                                        setProdutoSelecionado(produto);
                                                                        setLancamentoQuantidade(prev => ({ ...prev, [produto.id]: 1 }));
                                                                        setModalLancamento(true);
                                                                    }
                                                                }}
                                                                className="h-6 w-6 p-0 border-gray-700"
                                                            >
                                                                <PlusCircle className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-medium text-white">
                                                            R$ {l.precoUnitario.toFixed(2)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-medium text-amber-400">
                                                            R$ {l.desconto.toFixed(2)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-bold text-white">
                                                            R$ {(l.precoTotal - l.desconto).toFixed(2)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => removerLancamento(l.id, l.produtoId, l.quantidade)}
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Totais */}
                            <div className="flex justify-end">
                                <div className="w-full sm:w-96 space-y-2">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal:</span>
                                        <span className="font-medium">R$ {estatisticas.valorTotalLancamentos.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-amber-400">
                                        <span>Descontos:</span>
                                        <span className="font-medium">- R$ {estatisticas.totalDescontos.toFixed(2)}</span>
                                    </div>
                                    <Separator className="bg-gray-800/50" />
                                    <div className="flex justify-between text-white text-lg font-bold">
                                        <span>Total:</span>
                                        <span>R$ {estatisticas.valorFinalLancamentos.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filtros e Busca */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Buscar por nome, descrição, categoria ou código..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="pl-10 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Select value={filtroTipo} onValueChange={(v: 'todos' | Produto['tipo']) => setFiltroTipo(v)}>
                                <SelectTrigger className="w-full sm:w-[180px] bg-gray-900/50 border-gray-700/50 text-white">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        <SelectValue placeholder="Filtrar por tipo" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-800">
                                    <SelectItem value="todos">Todos os tipos</SelectItem>
                                    <SelectItem value="servico">Serviços</SelectItem>
                                    <SelectItem value="cirurgia">Cirurgias</SelectItem>
                                    <SelectItem value="procedimento">Procedimentos</SelectItem>
                                    <SelectItem value="medicamento">Medicamentos</SelectItem>
                                    <SelectItem value="produto">Produtos</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={carregarDados}
                                className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50 p-1 w-full overflow-x-auto">
                    <TabsTrigger value="cadastrar" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30 whitespace-nowrap">
                        <Plus className="h-4 w-4 mr-2" />
                        Cadastrar Item
                    </TabsTrigger>
                    <TabsTrigger value="listar" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30 whitespace-nowrap">
                        <Package className="h-4 w-4 mr-2" />
                        Listar Itens
                    </TabsTrigger>
                    <TabsTrigger value="exemplos" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30 whitespace-nowrap">
                        <Star className="h-4 w-4 mr-2" />
                        Exemplos
                    </TabsTrigger>
                </TabsList>

                {/* Tab: Cadastrar */}
                <TabsContent value="cadastrar" className="mt-6">
                    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Plus className="h-5 w-5 text-red-400" />
                                Cadastrar Novo Item
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Adicione novos produtos, serviços, medicamentos ou procedimentos ao catálogo
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {/* Nome e Categoria */}
                                <div className="space-y-3">
                                    <Label className="text-white flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-red-400" />
                                        Nome do Item *
                                    </Label>
                                    <Input
                                        value={nome}
                                        onChange={e => setNome(e.target.value)}
                                        placeholder="Ex: Consulta Geral, Vacina V10..."
                                        className="bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-white flex items-center gap-2">
                                        <Layers className="h-4 w-4 text-blue-400" />
                                        Categoria
                                    </Label>
                                    <Input
                                        value={categoria}
                                        onChange={e => setCategoria(e.target.value)}
                                        placeholder="Ex: Consultas, Vacinas, Alimentos..."
                                        className="bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                    />
                                </div>

                                {/* Tipo e Preço */}
                                <div className="space-y-3">
                                    <Label className="text-white flex items-center gap-2">
                                        <Settings className="h-4 w-4 text-blue-400" />
                                        Tipo *
                                    </Label>
                                    <Select value={tipo} onValueChange={(v: Produto['tipo']) => setTipo(v)}>
                                        <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-800">
                                            <SelectItem value="servico">Serviço</SelectItem>
                                            <SelectItem value="cirurgia">Cirurgia</SelectItem>
                                            <SelectItem value="procedimento">Procedimento</SelectItem>
                                            <SelectItem value="medicamento">Medicamento</SelectItem>
                                            <SelectItem value="produto">Produto</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-white flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-emerald-400" />
                                        Preço (R$) *
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={preco}
                                        onChange={e => setPreco(e.target.value)}
                                        placeholder="99.90"
                                        className="bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
                                    />
                                </div>

                                {/* Estoque e Código */}
                                {(tipo === 'produto' || tipo === 'medicamento') && (
                                    <>
                                        <div className="space-y-3">
                                            <Label className="text-white flex items-center gap-2">
                                                <Package className="h-4 w-4 text-purple-400" />
                                                Estoque
                                            </Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={estoque}
                                                onChange={e => setEstoque(e.target.value)}
                                                placeholder="Quantidade em estoque"
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-white flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-amber-400" />
                                                Código do Produto
                                            </Label>
                                            <Input
                                                value={codigo}
                                                onChange={e => setCodigo(e.target.value)}
                                                placeholder="Código interno ou de barras"
                                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Duração para serviços */}
                                {(tipo === 'servico' || tipo === 'cirurgia' || tipo === 'procedimento') && (
                                    <div className="space-y-3">
                                        <Label className="text-white flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-cyan-400" />
                                            Duração (minutos)
                                        </Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={duracao}
                                            onChange={e => setDuracao(e.target.value)}
                                            placeholder="Tempo estimado em minutos"
                                            className="bg-gray-900/50 border-gray-700/50 text-white"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Descrição */}
                            <div className="space-y-3">
                                <Label className="text-white flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-400" />
                                    Descrição
                                </Label>
                                <Textarea
                                    value={descricao}
                                    onChange={e => setDescricao(e.target.value)}
                                    placeholder="Descrição detalhada do item..."
                                    className="bg-gray-900/50 border-gray-700/50 text-white min-h-[100px]"
                                />
                            </div>

                            <Separator className="bg-gray-800/50" />

                            <div className="flex flex-col sm:flex-row justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setNome('');
                                        setPreco('');
                                        setDescricao('');
                                        setEstoque('');
                                        setDuracao('');
                                        setCodigo('');
                                        setCategoria('');
                                        setTipo('servico');
                                    }}
                                    className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Limpar
                                </Button>
                                <Button
                                    onClick={salvarProduto}
                                    className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                    disabled={!nome.trim() || !preco}
                                >
                                    <Plus className="h-4 w-4" />
                                    Cadastrar Item
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Listar */}
                <TabsContent value="listar" className="mt-6">
                    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-blue-400" />
                                    <span>Itens Cadastrados</span>
                                </div>
                                <div className="text-sm text-gray-400">
                                    Mostrando {produtosFiltrados.length} de {produtos.length} itens
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {produtos.length === 0 ? (
                                <div className="text-center py-12">
                                    <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg">Nenhum item cadastrado</p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Comece cadastrando seu primeiro item
                                    </p>
                                    <Button
                                        className="mt-4 gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                        onClick={() => setActiveTab('cadastrar')}
                                    >
                                        <Plus className="h-4 w-4" />
                                        Cadastrar Primeiro Item
                                    </Button>
                                </div>
                            ) : produtosFiltrados.length === 0 ? (
                                <div className="text-center py-12">
                                    <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg">Nenhum item encontrado</p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Tente ajustar os termos da busca ou os filtros
                                    </p>
                                </div>
                            ) : (
                                <div className="border border-gray-800/50 rounded-lg overflow-x-auto">
                                    <div className="min-w-[800px]">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-gray-800/50">
                                                    <TableHead className="text-gray-400">Item</TableHead>
                                                    <TableHead className="text-gray-400">Tipo</TableHead>
                                                    <TableHead className="text-gray-400">Categoria</TableHead>
                                                    <TableHead className="text-gray-400">Preço</TableHead>
                                                    <TableHead className="text-gray-400">Estoque</TableHead>
                                                    <TableHead className="text-gray-400 text-right">Ações</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {produtosFiltrados.map(p => {
                                                    const getTipoColor = (tipo: Produto['tipo']) => {
                                                        switch (tipo) {
                                                            case 'servico': return 'border-blue-500/30 text-blue-400';
                                                            case 'cirurgia': return 'border-amber-500/30 text-amber-400';
                                                            case 'procedimento': return 'border-cyan-500/30 text-cyan-400';
                                                            case 'medicamento': return 'border-purple-500/30 text-purple-400';
                                                            case 'produto': return 'border-emerald-500/30 text-emerald-400';
                                                            default: return 'border-gray-500/30 text-gray-400';
                                                        }
                                                    };

                                                    const getTipoIcon = (tipo: Produto['tipo']) => {
                                                        switch (tipo) {
                                                            case 'servico': return <Stethoscope className="h-4 w-4" />;
                                                            case 'cirurgia': return <Activity className="h-4 w-4" />;
                                                            case 'procedimento': return <FileText className="h-4 w-4" />;
                                                            case 'medicamento': return <Package className="h-4 w-4" />;
                                                            case 'produto': return <ShoppingBag className="h-4 w-4" />;
                                                            default: return <Package className="h-4 w-4" />;
                                                        }
                                                    };

                                                    return (
                                                        <TableRow key={p.id} className="border-gray-800/30 hover:bg-gray-800/20">
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`p-2 rounded-lg ${p.tipo === 'servico' ? 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20' :
                                                                            p.tipo === 'cirurgia' ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/20' :
                                                                                p.tipo === 'procedimento' ? 'bg-gradient-to-br from-cyan-600/20 to-blue-600/20' :
                                                                                    p.tipo === 'medicamento' ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20' :
                                                                                        'bg-gradient-to-br from-emerald-600/20 to-green-600/20'
                                                                        }`}>
                                                                        {getTipoIcon(p.tipo)}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium text-white truncate">{p.nome}</p>
                                                                        {p.descricao && (
                                                                            <p className="text-xs text-gray-500 truncate">{p.descricao}</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className={`border ${getTipoColor(p.tipo)}`}>
                                                                    {p.tipo === 'servico' ? 'Serviço' :
                                                                        p.tipo === 'cirurgia' ? 'Cirurgia' :
                                                                            p.tipo === 'procedimento' ? 'Procedimento' :
                                                                                p.tipo === 'medicamento' ? 'Medicamento' : 'Produto'}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="text-gray-300">{p.categoria}</span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <DollarSign className="h-4 w-4 text-emerald-400" />
                                                                    <span className="font-medium text-white">R$ {p.preco.toFixed(2)}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {p.estoque !== undefined ? (
                                                                    <Badge className={
                                                                        p.estoque > 20 ? "bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-400 border-emerald-500/30" :
                                                                            p.estoque > 10 ? "bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-400 border-amber-500/30" :
                                                                                "bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400 border-red-500/30"
                                                                    }>
                                                                        {p.estoque} un.
                                                                    </Badge>
                                                                ) : (
                                                                    <span className="text-gray-500">—</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex justify-end gap-1">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            setProdutoSelecionado(p);
                                                                            setLancamentoQuantidade(prev => ({ ...prev, [p.id]: 1 }));
                                                                            setModalLancamento(true);
                                                                        }}
                                                                        className="gap-1 border-emerald-700 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                                                    >
                                                                        <Plus className="h-3 w-3" />
                                                                        <span className="hidden sm:inline">Lançar</span>
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => abrirEdicao(p)}
                                                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => excluirProduto(p.id, p.nome)}
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
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Exemplos */}
                <TabsContent value="exemplos" className="mt-6">
                    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Star className="h-5 w-5 text-amber-400" />
                                Banco de Dados Completo da Clínica
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Adicione um catálogo completo com itens pré-definidos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Categorias */}
                                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Stethoscope className="h-5 w-5 text-blue-400" />
                                        <h4 className="font-semibold text-white">Serviços</h4>
                                    </div>
                                    <ul className="space-y-1 text-sm text-gray-300">
                                        <li>• Consultas (Geral, Emergencial, Retorno)</li>
                                        <li>• Vacinações</li>
                                        <li>• Banho e Tosa</li>
                                        <li>• Estética Completa</li>
                                    </ul>
                                </div>

                                <div className="p-4 rounded-lg bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Activity className="h-5 w-5 text-amber-400" />
                                        <h4 className="font-semibold text-white">Cirurgias</h4>
                                    </div>
                                    <ul className="space-y-1 text-sm text-gray-300">
                                        <li>• Castrações (Todos os portes)</li>
                                        <li>• Cesárea Emergencial</li>
                                        <li>• Remoção de Tumores</li>
                                        <li>• Correção de Fraturas</li>
                                    </ul>
                                </div>

                                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Package className="h-5 w-5 text-purple-400" />
                                        <h4 className="font-semibold text-white">Medicamentos</h4>
                                    </div>
                                    <ul className="space-y-1 text-sm text-gray-300">
                                        <li>• Analgésicos e Anti-inflamatórios</li>
                                        <li>• Antibióticos</li>
                                        <li>• Corticoides</li>
                                        <li>• Cardiológicos</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/30 gap-4">
                                <div className="flex items-center gap-3">
                                    <Database className="h-6 w-6 text-amber-400" />
                                    <div>
                                        <p className="font-medium text-white">Importar Catálogo Completo</p>
                                        <p className="text-sm text-amber-400/80">
                                            Adicionará itens pré-configurados ao seu sistema
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={preencherExemplos}
                                    className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 whitespace-nowrap"
                                >
                                    <Database className="h-4 w-4" />
                                    Importar Catálogo
                                </Button>
                            </div>

                            <div className="text-sm text-gray-400">
                                <p className="mb-2">💡 Este catálogo inclui:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 ml-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                        <span>Consultas e serviços básicos</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
                                        <span>Cirurgias especializadas</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                                        <span>Farmácia veterinária</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modal de Lançamento */}
            <Dialog open={modalLancamento} onOpenChange={setModalLancamento}>
                <DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 text-white max-w-md md:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <PlusCircle className="h-5 w-5 text-emerald-400" />
                            Lançar Item na Comanda
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Adicione este item à comanda atual
                        </DialogDescription>
                    </DialogHeader>

                    {produtoSelecionado && (
                        <div className="space-y-4 py-4">
                            {/* Informações do Produto */}
                            <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700/50">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`p-2 rounded-lg ${produtoSelecionado.tipo === 'servico' ? 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20' :
                                            produtoSelecionado.tipo === 'cirurgia' ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/20' :
                                                produtoSelecionado.tipo === 'procedimento' ? 'bg-gradient-to-br from-cyan-600/20 to-blue-600/20' :
                                                    produtoSelecionado.tipo === 'medicamento' ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20' :
                                                        'bg-gradient-to-br from-emerald-600/20 to-green-600/20'
                                        }`}>
                                        {produtoSelecionado.tipo === 'servico' ? <Stethoscope className="h-5 w-5" /> :
                                            produtoSelecionado.tipo === 'cirurgia' ? <Activity className="h-5 w-5" /> :
                                                produtoSelecionado.tipo === 'procedimento' ? <FileText className="h-5 w-5" /> :
                                                    produtoSelecionado.tipo === 'medicamento' ? <Package className="h-5 w-5" /> :
                                                        <ShoppingBag className="h-5 w-5" />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white truncate">{produtoSelecionado.nome}</h3>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={
                                                produtoSelecionado.tipo === 'servico' ? 'border-blue-500/30 text-blue-400' :
                                                    produtoSelecionado.tipo === 'cirurgia' ? 'border-amber-500/30 text-amber-400' :
                                                        produtoSelecionado.tipo === 'procedimento' ? 'border-cyan-500/30 text-cyan-400' :
                                                            produtoSelecionado.tipo === 'medicamento' ? 'border-purple-500/30 text-purple-400' :
                                                                'border-emerald-500/30 text-emerald-400'
                                            }>
                                                {produtoSelecionado.tipo === 'servico' ? 'Serviço' :
                                                    produtoSelecionado.tipo === 'cirurgia' ? 'Cirurgia' :
                                                        produtoSelecionado.tipo === 'procedimento' ? 'Procedimento' :
                                                            produtoSelecionado.tipo === 'medicamento' ? 'Medicamento' : 'Produto'}
                                            </Badge>
                                            <span className="text-gray-400 text-sm truncate">{produtoSelecionado.categoria}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div>
                                        <p className="text-sm text-gray-400">Preço unitário</p>
                                        <p className="text-xl md:text-2xl font-bold text-white">R$ {produtoSelecionado.preco.toFixed(2)}</p>
                                    </div>
                                    {produtoSelecionado.estoque !== undefined && (
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400">Estoque disponível</p>
                                            <p className={`text-lg font-bold ${produtoSelecionado.estoque > 10 ? 'text-emerald-400' :
                                                    produtoSelecionado.estoque > 0 ? 'text-amber-400' : 'text-red-400'
                                                }`}>
                                                {produtoSelecionado.estoque} unidades
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quantidade */}
                            <div className="space-y-2">
                                <Label className="text-white">Quantidade</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                const current = lancamentoQuantidade[produtoSelecionado.id] || 1;
                                                if (current > 1) {
                                                    setLancamentoQuantidade(prev => ({
                                                        ...prev,
                                                        [produtoSelecionado.id]: current - 1
                                                    }));
                                                }
                                            }}
                                            className="border-gray-700 text-gray-400"
                                        >
                                            <MinusCircle className="h-4 w-4" />
                                        </Button>
                                        <span className="text-2xl font-bold text-white min-w-[40px] text-center">
                                            {lancamentoQuantidade[produtoSelecionado.id] || 1}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                const current = lancamentoQuantidade[produtoSelecionado.id] || 1;
                                                if (produtoSelecionado.estoque === undefined ||
                                                    current < produtoSelecionado.estoque) {
                                                    setLancamentoQuantidade(prev => ({
                                                        ...prev,
                                                        [produtoSelecionado.id]: current + 1
                                                    }));
                                                }
                                            }}
                                            disabled={produtoSelecionado.estoque !== undefined &&
                                                (lancamentoQuantidade[produtoSelecionado.id] || 1) >= produtoSelecionado.estoque}
                                            className="border-gray-700 text-gray-400"
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            type="number"
                                            min="1"
                                            max={produtoSelecionado.estoque}
                                            value={lancamentoQuantidade[produtoSelecionado.id] || 1}
                                            onChange={e => {
                                                const value = parseInt(e.target.value);
                                                if (!isNaN(value) && value > 0) {
                                                    setLancamentoQuantidade(prev => ({
                                                        ...prev,
                                                        [produtoSelecionado.id]: value
                                                    }));
                                                }
                                            }}
                                            className="bg-gray-900/50 border-gray-700/50 text-white text-center"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Observação */}
                            <div className="space-y-2">
                                <Label className="text-white">Observação (opcional)</Label>
                                <Textarea
                                    value={observacaoLancamento}
                                    onChange={e => setObservacaoLancamento(e.target.value)}
                                    placeholder="Observações sobre este lançamento..."
                                    className="bg-gray-900/50 border-gray-700/50 text-white min-h-[80px]"
                                />
                            </div>

                            {/* Resumo */}
                            <div className="p-4 rounded-lg bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-700/50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-400">Valor total:</span>
                                    <span className="text-xl md:text-2xl font-bold text-white">
                                        R$ {((lancamentoQuantidade[produtoSelecionado.id] || 1) * produtoSelecionado.preco).toFixed(2)}
                                    </span>
                                </div>
                                {produtoSelecionado.estoque !== undefined && (
                                    <p className="text-sm text-gray-400">
                                        Após esta compra, restarão {Math.max(0, produtoSelecionado.estoque - (lancamentoQuantidade[produtoSelecionado.id] || 1))} unidades em estoque
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setModalLancamento(false);
                                setProdutoSelecionado(null);
                            }}
                            className="border-gray-700 text-gray-400 hover:text-white w-full sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => produtoSelecionado && adicionarLancamento(produtoSelecionado)}
                            className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 w-full sm:w-auto"
                            disabled={produtoSelecionado?.estoque !== undefined &&
                                (lancamentoQuantidade[produtoSelecionado.id] || 1) > (produtoSelecionado?.estoque || 0)}
                        >
                            <PlusCircle className="h-4 w-4" />
                            Adicionar à Comanda
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Edição */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 text-white max-w-md md:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5 text-blue-400" />
                            Editar Item
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Edite as informações deste item
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-3">
                            <Label className="text-white">Nome do Item *</Label>
                            <Input
                                value={editNome}
                                onChange={e => setEditNome(e.target.value)}
                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                placeholder="Nome do item"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-white">Categoria</Label>
                            <Input
                                value={editCategoria}
                                onChange={e => setEditCategoria(e.target.value)}
                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                placeholder="Categoria"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-white">Tipo *</Label>
                            <Select value={editTipo} onValueChange={(v: Produto['tipo']) => setEditTipo(v)}>
                                <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-800">
                                    <SelectItem value="servico">Serviço</SelectItem>
                                    <SelectItem value="cirurgia">Cirurgia</SelectItem>
                                    <SelectItem value="procedimento">Procedimento</SelectItem>
                                    <SelectItem value="medicamento">Medicamento</SelectItem>
                                    <SelectItem value="produto">Produto</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-white">Preço (R$) *</Label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={editPreco}
                                onChange={e => setEditPreco(e.target.value)}
                                className="bg-gray-900/50 border-gray-700/50 text-white"
                                placeholder="99.90"
                            />
                        </div>

                        {(editTipo === 'produto' || editTipo === 'medicamento') && (
                            <>
                                <div className="space-y-3">
                                    <Label className="text-white">Estoque</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={editEstoque}
                                        onChange={e => setEditEstoque(e.target.value)}
                                        className="bg-gray-900/50 border-gray-700/50 text-white"
                                        placeholder="Quantidade em estoque"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-white">Código do Produto</Label>
                                    <Input
                                        value={editCodigo}
                                        onChange={e => setEditCodigo(e.target.value)}
                                        className="bg-gray-900/50 border-gray-700/50 text-white"
                                        placeholder="Código interno ou de barras"
                                    />
                                </div>
                            </>
                        )}

                        {(editTipo === 'servico' || editTipo === 'cirurgia' || editTipo === 'procedimento') && (
                            <div className="space-y-3">
                                <Label className="text-white">Duração (minutos)</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={editDuracao}
                                    onChange={e => setEditDuracao(e.target.value)}
                                    className="bg-gray-900/50 border-gray-700/50 text-white"
                                    placeholder="Tempo estimado em minutos"
                                />
                            </div>
                        )}

                        <div className="space-y-3">
                            <Label className="text-white">Descrição</Label>
                            <Textarea
                                value={editDescricao}
                                onChange={e => setEditDescricao(e.target.value)}
                                className="bg-gray-900/50 border-gray-700/50 text-white min-h-[80px]"
                                placeholder="Descrição detalhada do item..."
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setEditOpen(false)}
                            className="border-gray-700 text-gray-400 hover:text-white w-full sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={salvarEdicao}
                            className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 w-full sm:w-auto"
                            disabled={!editNome.trim() || !editPreco}
                        >
                            <Edit className="h-4 w-4" />
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TabelaProdutosServicos;