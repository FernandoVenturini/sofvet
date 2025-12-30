import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  getDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Proprietario, FichaAnimal, LancamentoConta } from '@/types/proprietario';

export const proprietarioService = {
  // Buscar todos os proprietários
  async buscarTodos(): Promise<Proprietario[]> {
    try {
      const q = query(collection(db, 'proprietarios'), orderBy('nome'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Proprietario));
    } catch (error) {
      console.error('Erro ao buscar proprietários:', error);
      throw error;
    }
  },

  // Buscar proprietário por ID
  async buscarPorId(id: string): Promise<Proprietario | null> {
    try {
      const docRef = doc(db, 'proprietarios', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Proprietario;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar proprietário:', error);
      throw error;
    }
  },

  // Criar novo proprietário
  async criar(proprietario: Omit<Proprietario, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'proprietarios'), {
        ...proprietario,
        dataCadastro: Timestamp.now(),
        saldo: 0
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar proprietário:', error);
      throw error;
    }
  },

  // Atualizar proprietário
  async atualizar(id: string, data: Partial<Proprietario>): Promise<void> {
    try {
      await updateDoc(doc(db, 'proprietarios', id), data);
    } catch (error) {
      console.error('Erro ao atualizar proprietário:', error);
      throw error;
    }
  },

  // Excluir proprietário
  async excluir(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'proprietarios', id));
    } catch (error) {
      console.error('Erro ao excluir proprietário:', error);
      throw error;
    }
  },

  // Buscar fichas do proprietário
  async buscarFichas(proprietarioId: string): Promise<FichaAnimal[]> {
    try {
      const q = query(
        collection(db, 'fichas_animais'),
        where('proprietarioId', '==', proprietarioId),
        orderBy('nome')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as FichaAnimal));
    } catch (error) {
      console.error('Erro ao buscar fichas:', error);
      return [];
    }
  },

  // Buscar lançamentos da conta corrente
  async buscarLancamentosConta(proprietarioId: string): Promise<LancamentoConta[]> {
    try {
      const q = query(
        collection(db, 'lancamentos_conta'),
        where('proprietarioId', '==', proprietarioId),
        orderBy('data', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as LancamentoConta));
    } catch (error) {
      console.error('Erro ao buscar lançamentos:', error);
      return [];
    }
  },

  // Adicionar lançamento na conta corrente
  async adicionarLancamentoConta(lancamento: Omit<LancamentoConta, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'lancamentos_conta'), {
        ...lancamento,
        data: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar lançamento:', error);
      throw error;
    }
  },

  // Buscar proprietários por nome ou código
  async buscarPorFiltro(filtro: string): Promise<Proprietario[]> {
    try {
      const proprietarios = await this.buscarTodos();
      return proprietarios.filter(p =>
        p.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        p.cpf.toLowerCase().includes(filtro.toLowerCase()) ||
        p.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
        p.telefone1.toLowerCase().includes(filtro.toLowerCase())
      );
    } catch (error) {
      console.error('Erro ao filtrar proprietários:', error);
      throw error;
    }
  },

  // Gerar código automático
  async gerarCodigo(): Promise<string> {
    try {
      const proprietarios = await this.buscarTodos();
      if (proprietarios.length === 0) return '1';
      
      const ultimoCodigo = proprietarios.reduce((max, p) => {
        const num = parseInt(p.codigo.replace('.', '')) || 0;
        return num > max ? num : max;
      }, 0);
      
      return (ultimoCodigo + 1).toString();
    } catch (error) {
      console.error('Erro ao gerar código:', error);
      return '1';
    }
  }
};