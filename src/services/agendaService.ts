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
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export interface AgendamentoFirebase {
  id?: string;
  data: Date;
  hora: string;
  pacienteId: string;
  veterinario: string;
  tipo:
    | "consulta"
    | "retorno"
    | "cirurgia"
    | "vacina"
    | "exame"
    | "banho"
    | "tosa";
  status:
    | "agendado"
    | "confirmado"
    | "em_andamento"
    | "concluido"
    | "cancelado"
    | "falta";
  descricao: string;
  observacoes?: string;
  duracao: number;
  valor: number;
  criadoEm: Date;
  atualizadoEm: Date;
  pacienteNome?: string;
  pacienteEspecie?: string;
  pacienteRaca?: string;
  proprietarioNome?: string;
  proprietarioTelefone?: string;
}

export const agendaService = {
  // Buscar agendamentos por período
  async buscarAgendamentos(
    dataInicio: Date,
    dataFim: Date
  ): Promise<AgendamentoFirebase[]> {
    try {
      const q = query(
        collection(db, "agendamentos"),
        where("data", ">=", Timestamp.fromDate(dataInicio)),
        where("data", "<=", Timestamp.fromDate(dataFim)),
        orderBy("data", "asc"),
        orderBy("hora", "asc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          data: data.data?.toDate() || new Date(),
          hora: data.hora || "",
          pacienteId: data.pacienteId || "",
          veterinario: data.veterinario || "",
          tipo: data.tipo || "consulta",
          status: data.status || "agendado",
          descricao: data.descricao || "",
          observacoes: data.observacoes || "",
          duracao: data.duracao || 30,
          valor: data.valor || 0,
          criadoEm: data.criadoEm?.toDate() || new Date(),
          atualizadoEm: data.atualizadoEm?.toDate() || new Date(),
          pacienteNome: data.pacienteNome || "",
          pacienteEspecie: data.pacienteEspecie || "",
          pacienteRaca: data.pacienteRaca || "",
          proprietarioNome: data.proprietarioNome || "",
          proprietarioTelefone: data.proprietarioTelefone || "",
        };
      });
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      return [];
    }
  },

  // Buscar agendamentos do dia
  async buscarAgendamentosDoDia(data: Date): Promise<AgendamentoFirebase[]> {
    const inicioDia = new Date(data);
    inicioDia.setHours(0, 0, 0, 0);

    const fimDia = new Date(data);
    fimDia.setHours(23, 59, 59, 999);

    return this.buscarAgendamentos(inicioDia, fimDia);
  },

  // Buscar agendamentos da semana
  async buscarAgendamentosDaSemana(data: Date): Promise<AgendamentoFirebase[]> {
    const inicioSemana = startOfWeek(data);
    const fimSemana = endOfWeek(data);
    fimSemana.setHours(23, 59, 59, 999);

    return this.buscarAgendamentos(inicioSemana, fimSemana);
  },

  // Buscar agendamentos do mês
  async buscarAgendamentosDoMes(data: Date): Promise<AgendamentoFirebase[]> {
    const inicioMes = startOfMonth(data);
    const fimMes = endOfMonth(data);
    fimMes.setHours(23, 59, 59, 999);

    return this.buscarAgendamentos(inicioMes, fimMes);
  },

  // Criar novo agendamento
  async criarAgendamento(
    agendamento: Omit<AgendamentoFirebase, "id" | "criadoEm" | "atualizadoEm">
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "agendamentos"), {
        ...agendamento,
        data: Timestamp.fromDate(agendamento.data),
        criadoEm: Timestamp.now(),
        atualizadoEm: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      throw error;
    }
  },

  // Atualizar agendamento
  async atualizarAgendamento(
    id: string,
    dados: Partial<AgendamentoFirebase>
  ): Promise<void> {
    try {
      const updateData: any = {
        ...dados,
        atualizadoEm: Timestamp.now(),
      };

      if (dados.data) {
        updateData.data = Timestamp.fromDate(dados.data);
      }

      await updateDoc(doc(db, "agendamentos", id), updateData);
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      throw error;
    }
  },

  // Excluir agendamento
  async excluirAgendamento(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "agendamentos", id));
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      throw error;
    }
  },

  // Alterar status
  async alterarStatus(
    id: string,
    status: AgendamentoFirebase["status"]
  ): Promise<void> {
    try {
      await updateDoc(doc(db, "agendamentos", id), {
        status,
        atualizadoEm: Timestamp.now(),
      });
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      throw error;
    }
  },

  // Enviar lembrete
  async enviarLembrete(
    agendamentoId: string,
    tipo: "whatsapp" | "email" | "sms"
  ): Promise<boolean> {
    try {
      console.log(`Lembrete ${tipo} enviado para agendamento ${agendamentoId}`);
      return true;
    } catch (error) {
      console.error("Erro ao enviar lembrete:", error);
      return false;
    }
  },
};