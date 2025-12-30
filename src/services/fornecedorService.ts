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
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Fornecedor, ProdutoFornecedor, Cotacao } from "@/types/fornecedor";

export const fornecedorService = {
  // Buscar todos os fornecedores
  async buscarTodos(): Promise<Fornecedor[]> {
    try {
      const q = query(collection(db, "fornecedores"), orderBy("nome"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Fornecedor)
      );
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      throw error;
    }
  },

  // Buscar fornecedor por ID
  async buscarPorId(id: string): Promise<Fornecedor | null> {
    try {
      const docRef = doc(db, "fornecedores", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Fornecedor;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar fornecedor:", error);
      throw error;
    }
  },

  // Criar novo fornecedor
  async criar(fornecedor: Omit<Fornecedor, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "fornecedores"), {
        ...fornecedor,
        dataCadastro: Timestamp.now(),
        totalCompras: 0,
        quantidadeCompras: 0,
        ativo: true,
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error);
      throw error;
    }
  },

  // Atualizar fornecedor
  async atualizar(id: string, data: Partial<Fornecedor>): Promise<void> {
    try {
      await updateDoc(doc(db, "fornecedores", id), {
        ...data,
      });
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
      throw error;
    }
  },

  // Excluir fornecedor
  async excluir(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "fornecedores", id));
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
      throw error;
    }
  },

  // Buscar fornecedores por filtro
  async buscarPorFiltro(filtro: string, tipo?: string): Promise<Fornecedor[]> {
    try {
      const fornecedores = await this.buscarTodos();
      return fornecedores.filter((f) => {
        const filtroMatch =
          f.nome.toLowerCase().includes(filtro.toLowerCase()) ||
          f.cnpj.toLowerCase().includes(filtro.toLowerCase()) ||
          f.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
          f.especialidade?.toLowerCase().includes(filtro.toLowerCase()) ||
          f.contato.toLowerCase().includes(filtro.toLowerCase());

        const tipoMatch = !tipo || f.tipo === tipo;

        return filtroMatch && tipoMatch;
      });
    } catch (error) {
      console.error("Erro ao filtrar fornecedores:", error);
      throw error;
    }
  },

  // Buscar produtos do fornecedor
  async buscarProdutos(fornecedorId: string): Promise<ProdutoFornecedor[]> {
    try {
      const q = query(
        collection(db, "produtos_fornecedores"),
        where("fornecedorId", "==", fornecedorId),
        orderBy("descricao")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as ProdutoFornecedor)
      );
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
  },

  // Buscar cotações do fornecedor
  async buscarCotacoes(fornecedorId: string): Promise<Cotacao[]> {
    try {
      const q = query(
        collection(db, "cotacoes"),
        where("fornecedorId", "==", fornecedorId),
        orderBy("data", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Cotacao)
      );
    } catch (error) {
      console.error("Erro ao buscar cotações:", error);
      return [];
    }
  },

  // Adicionar produto ao fornecedor
  async adicionarProduto(
    produto: Omit<ProdutoFornecedor, "id">
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "produtos_fornecedores"), {
        ...produto,
        dataCadastro: Timestamp.now(),
        dataAtualizacao: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      throw error;
    }
  },

  // Adicionar cotação
  async adicionarCotacao(cotacao: Omit<Cotacao, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "cotacoes"), {
        ...cotacao,
        data: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar cotação:", error);
      throw error;
    }
  },

  // Gerar código automático
  async gerarCodigo(): Promise<string> {
    try {
      const fornecedores = await this.buscarTodos();
      if (fornecedores.length === 0) return "F001";

      const ultimoCodigo = fornecedores.reduce((max, f) => {
        const match = f.codigo.match(/F(\d+)/);
        if (match) {
          const num = parseInt(match[1]);
          return num > max ? num : max;
        }
        return max;
      }, 0);

      return `F${(ultimoCodigo + 1).toString().padStart(3, "0")}`;
    } catch (error) {
      console.error("Erro ao gerar código:", error);
      return "F001";
    }
  },

  // Buscar fornecedores preferenciais
  async buscarPreferenciais(): Promise<Fornecedor[]> {
    try {
      const q = query(
        collection(db, "fornecedores"),
        where("preferencial", "==", true),
        where("ativo", "==", true),
        orderBy("nome")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Fornecedor)
      );
    } catch (error) {
      console.error("Erro ao buscar preferenciais:", error);
      return [];
    }
  },

  // Buscar fornecedores por especialidade
  async buscarPorEspecialidade(especialidade: string): Promise<Fornecedor[]> {
    try {
      const q = query(
        collection(db, "fornecedores"),
        where("especialidade", "==", especialidade),
        where("ativo", "==", true),
        orderBy("nome")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Fornecedor)
      );
    } catch (error) {
      console.error("Erro ao buscar por especialidade:", error);
      return [];
    }
  },

  // Atualizar métricas após compra
  async registrarCompra(fornecedorId: string, valor: number): Promise<void> {
    try {
      const fornecedor = await this.buscarPorId(fornecedorId);
      if (fornecedor) {
        await this.atualizar(fornecedorId, {
          dataUltimaCompra: new Date().toISOString(),
          valorUltimaCompra: valor,
          totalCompras: fornecedor.totalCompras + valor,
          quantidadeCompras: fornecedor.quantidadeCompras + 1,
        });
      }
    } catch (error) {
      console.error("Erro ao registrar compra:", error);
      throw error;
    }
  },

  // Buscar fornecedores ativos
  async buscarAtivos(): Promise<Fornecedor[]> {
    try {
      const q = query(
        collection(db, "fornecedores"),
        where("ativo", "==", true),
        orderBy("nome")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Fornecedor)
      );
    } catch (error) {
      console.error("Erro ao buscar ativos:", error);
      return [];
    }
  },
};