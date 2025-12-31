import { medicamentosVeterinarios } from "@/data/medicamentosVeterinarios";
import {
  buscarMedicamentosCompletos,
  getEstatisticasMedicamentos,
} from "./apiMedicamentos";
import { PDFService } from "./pdfService";

export interface Medicamento {
  id: string;
  nomeComercial: string;
  nomeQuimico: string;
  especies: Array<{
    codigo: string;
    descricao: string;
    dosePorKg: number;
    unidade: string;
    contraindicado?: boolean;
  }>;
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
  categoria: string;
  viaAdministracao: string[];
}

export const medicamentoService = {
  // Buscar todos os medicamentos
  async getAll(): Promise<Medicamento[]> {
    return [...medicamentosVeterinarios];
  },

  // Buscar com filtros
  async search(params: {
    termo?: string;
    especie?: string;
    categoria?: string;
    tipo?: "todos" | "veterinarios" | "humanos";
  }): Promise<Medicamento[]> {
    let resultados = await buscarMedicamentosCompletos(
      params.termo || "",
      params.especie,
      params.categoria
    );

    // Aplicar filtro de tipo
    if (params.tipo === "veterinarios") {
      resultados = resultados.filter((m) => m.isVeterinario);
    } else if (params.tipo === "humanos") {
      resultados = resultados.filter((m) => !m.isVeterinario);
    }

    return resultados;
  },

  // Buscar por ID
  async getById(id: string): Promise<Medicamento | null> {
    const medicamento = medicamentosVeterinarios.find((m) => m.id === id);
    return medicamento || null;
  },

  // Criar novo medicamento
  async create(
    medicamentoData: Omit<
      Medicamento,
      "id" | "dataCadastro" | "dataAtualizacao" | "usadoEmConsultas"
    >
  ): Promise<string> {
    const novoId = (medicamentosVeterinarios.length + 1).toString();
    const novoMedicamento: Medicamento = {
      ...medicamentoData,
      id: novoId,
      dataCadastro: new Date(),
      dataAtualizacao: new Date(),
      usadoEmConsultas: 0,
    };

    // Em produção, aqui salvaria no Firebase/banco de dados
    console.log("Medicamento criado:", novoMedicamento);
    return novoId;
  },

  // Atualizar medicamento
  async update(
    id: string,
    medicamentoData: Partial<Medicamento>
  ): Promise<void> {
    console.log("Atualizando medicamento:", id, medicamentoData);
    // Em produção, atualizaria no banco de dados
  },

  // Deletar medicamento
  async delete(id: string): Promise<void> {
    console.log("Deletando medicamento:", id);
    // Em produção, removeria do banco de dados
  },

  // Incrementar contador de usos
  async incrementarUso(id: string): Promise<void> {
    console.log("Incrementando uso do medicamento:", id);
  },

  // Importar de PDF
  async importarDePDF(file: File): Promise<Medicamento[]> {
    try {
      const medicamentosDoPDF = await PDFService.processarPDF(file);

      // Converter para formato do sistema
      const medicamentosConvertidos = medicamentosDoPDF.map((med, index) => ({
        id: `pdf-${Date.now()}-${index}`,
        nomeComercial: med.nomeComercial,
        nomeQuimico: med.nomeQuimico || med.nomeComercial,
        especies: med.especies || [],
        atencao: med.atencao || "",
        apresentacao: med.apresentacao || "Não especificado",
        indicacao: med.indicacao || "Não especificado",
        posologia: med.posologia || "Não especificado",
        laboratorios: med.laboratorios || ["Importado da USP"],
        observacoes: "Importado do PDF da USP",
        isVeterinario:
          med.isVeterinario !== undefined ? med.isVeterinario : true,
        dataCadastro: new Date(),
        dataAtualizacao: new Date(),
        usadoEmConsultas: 0,
        categoria: med.categoria || "Não categorizado",
        viaAdministracao: ["Oral"], // Padrão
      }));

      return medicamentosConvertidos;
    } catch (error) {
      console.error("Erro na importação:", error);
      throw error;
    }
  },

  // Buscar na API externa
  async buscarNaANVISA(termo: string): Promise<any[]> {
    try {
      const response = await fetch(
        `https://consultas.anvisa.gov.br/api/consulta/medicamentos/termo?nome=${encodeURIComponent(
          termo
        )}`
      );
      const data = await response.json();
      return data.content || [];
    } catch (error) {
      console.warn("API ANVISA indisponível");
      return [];
    }
  },

  // Estatísticas
  getEstatisticas() {
    return getEstatisticasMedicamentos();
  },
};
