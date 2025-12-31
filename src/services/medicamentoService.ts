// Serviço simplificado para começar
import { db } from '@/lib/firebase';
import {
	collection,
	addDoc,
	getDocs,
	updateDoc,
	deleteDoc,
	doc,
	query,
	orderBy,
	increment,
	serverTimestamp
} from 'firebase/firestore';

const medicamentosCollection = collection(db, 'medicamentos');

export interface EspecieDosagem {
	codigo: string;
	descricao: string;
	dosePorKg: number;
	unidade: string;
}

export interface Medicamento {
	id: string;
	nomeComercial: string;
	nomeQuimico: string;
	especies: EspecieDosagem[];
	atencao: string;
	apresentacao: string;
	indicacao: string;
	posologia: string;
	laboratorios: string[];
	observacoes: string;
	isVeterinario: boolean;
	dataCadastro: Date;
	dataAtualizacao: Date;
	usadoEmConsultas: number;
}

export const medicamentoService = {
	async getAll(): Promise<Medicamento[]> {
		try {
			const q = query(medicamentosCollection, orderBy('nomeComercial'));
			const snapshot = await getDocs(q);
			return snapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
				dataCadastro: doc.data().dataCadastro?.toDate() || new Date(),
				dataAtualizacao: doc.data().dataAtualizacao?.toDate() || new Date(),
				usadoEmConsultas: doc.data().usadoEmConsultas || 0,
			})) as Medicamento[];
		} catch (error) {
			console.error('Erro ao buscar medicamentos:', error);
			// Retorna array vazio em caso de erro (para desenvolvimento)
			return [];
		}
	},

	async create(medicamento: Omit<Medicamento, 'id' | 'dataCadastro' | 'dataAtualizacao' | 'usadoEmConsultas'>): Promise<string> {
		try {
			const docRef = await addDoc(medicamentosCollection, {
				...medicamento,
				usadoEmConsultas: 0,
				dataCadastro: serverTimestamp(),
				dataAtualizacao: serverTimestamp(),
			});
			return docRef.id;
		} catch (error) {
			console.error('Erro ao criar medicamento:', error);
			throw error;
		}
	},

	async update(id: string, medicamento: Partial<Medicamento>): Promise<void> {
		try {
			const docRef = doc(db, 'medicamentos', id);
			await updateDoc(docRef, {
				...medicamento,
				dataAtualizacao: serverTimestamp(),
			});
		} catch (error) {
			console.error('Erro ao atualizar medicamento:', error);
			throw error;
		}
	},

	async delete(id: string): Promise<void> {
		try {
			const docRef = doc(db, 'medicamentos', id);
			await deleteDoc(docRef);
		} catch (error) {
			console.error('Erro ao deletar medicamento:', error);
			throw error;
		}
	},

	async incrementarUso(id: string): Promise<void> {
		try {
			const docRef = doc(db, 'medicamentos', id);
			await updateDoc(docRef, {
				usadoEmConsultas: increment(1),
				dataAtualizacao: serverTimestamp(),
			});
		} catch (error) {
			console.error('Erro ao incrementar uso:', error);
			throw error;
		}
	},

	// Funções mockadas para backup (implementar depois)
	async criarBackup(descricao: string): Promise<string> {
		console.log('Criando backup:', descricao);
		return 'backup-id';
	},

	async listarBackups(): Promise<any[]> {
		return [];
	},

	async restaurarBackup(backupId: string): Promise<void> {
		console.log('Restaurando backup:', backupId);
	},

	async exportarParaJSON(): Promise<string> {
		const medicamentos = await this.getAll();
		const data = {
			exportadoEm: new Date().toISOString(),
			totalRegistros: medicamentos.length,
			medicamentos: medicamentos.map(med => ({
				...med,
				dataCadastro: med.dataCadastro.toISOString(),
				dataAtualizacao: med.dataAtualizacao.toISOString(),
			})),
		};

		return JSON.stringify(data, null, 2);
	},

	async importarDeJSON(jsonData: string): Promise<void> {
		console.log('Importando dados JSON:', jsonData);
	},

	async getMedicamentosMaisUsados(limit: number = 10): Promise<any[]> {
		const medicamentos = await this.getAll();
		return medicamentos
			.sort((a, b) => b.usadoEmConsultas - a.usadoEmConsultas)
			.slice(0, limit)
			.map(med => ({
				id: med.id,
				nome: med.nomeComercial,
				uso: med.usadoEmConsultas,
				tipo: med.isVeterinario ? 'Veterinário' : 'Humano',
			}));
	},

	async getRelatorioUso(inicio: Date, fim: Date): Promise<any[]> {
		const medicamentos = await this.getAll();
		return medicamentos
			.filter(med => med.dataCadastro >= inicio && med.dataCadastro <= fim)
			.sort((a, b) => b.usadoEmConsultas - a.usadoEmConsultas)
			.map(med => ({
				nome: med.nomeComercial,
				uso: med.usadoEmConsultas,
				tipo: med.isVeterinario ? 'Veterinário' : 'Humano',
				ultimoUso: med.dataAtualizacao,
			}));
	},
};