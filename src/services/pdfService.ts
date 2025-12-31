// Serviço para processar PDFs da USP
export class PDFService {
  static async processarPDF(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          // Simulação de processamento de PDF
          // Na prática, você usaria uma biblioteca como pdf-parse
          console.log("Processando PDF:", file.name);

          // Dados simulados do PDF da USP
          const medicamentosDoPDF = [
            {
              nomeComercial: "Amoxicilina + Ácido Clavulânico (Clavamox)",
              nomeQuimico: "Amoxicilina + Ácido Clavulânico",
              especies: [
                {
                  codigo: "CAN",
                  descricao: "Canino",
                  dosePorKg: 12.5,
                  unidade: "mg",
                },
                {
                  codigo: "FEL",
                  descricao: "Felino",
                  dosePorKg: 12.5,
                  unidade: "mg",
                },
              ],
              atencao: "Pode causar diarreia. Administrar com alimento.",
              apresentacao: "Comprimidos 62.5mg, 250mg, 500mg",
              indicacao: "Antibiótico beta-lactâmico de amplo espectro",
              posologia: "12.5-25 mg/kg VO a cada 12h",
              laboratorios: ["Zoetis", "Agener União"],
              categoria: "Antibiótico",
              isVeterinario: true,
            },
            {
              nomeComercial: "Metronidazol (Flagyl)",
              nomeQuimico: "Metronidazol",
              especies: [
                {
                  codigo: "CAN",
                  descricao: "Canino",
                  dosePorKg: 15,
                  unidade: "mg",
                },
                {
                  codigo: "FEL",
                  descricao: "Felino",
                  dosePorKg: 10,
                  unidade: "mg",
                },
              ],
              atencao: "Neurotoxicidade com doses altas. Sabor amargo.",
              apresentacao: "Comprimidos 250mg, 500mg",
              indicacao:
                "Antibiótico/antiparasitário para Giardia e anaeróbios",
              posologia: "10-15 mg/kg VO a cada 12h",
              laboratorios: ["Sanofi", "Medley"],
              categoria: "Antibiótico/Antiparasitário",
              isVeterinario: false,
            },
          ];

          // Simular delay de processamento
          setTimeout(() => {
            resolve(medicamentosDoPDF);
          }, 2000);
        } catch (error) {
          reject(new Error("Erro ao processar PDF: " + error));
        }
      };

      reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
      reader.readAsArrayBuffer(file);
    });
  }

  static extrairTextoDePDF(buffer: ArrayBuffer): string {
    // Implementação real usaria pdf-parse
    // Por enquanto retorna texto simulado
    return `
    MEDICAMENTOS VETERINÁRIOS - USP
    ================================
    
    1. Ivermectina
    Espécies: Canino, Bovino, Equino
    Dose: 0.2 mg/kg SC
    Apresentação: Injetável 1%
    
    2. Enrofloxacina
    Espécies: Canino, Felino, Aves
    Dose: 5-20 mg/kg/dia
    Apresentação: Comprimidos 15-150mg
    
    3. Dipirona
    Espécies: Canino, Felino
    Dose: 25 mg/kg (cães), 15 mg/kg (gatos)
    Apresentação: Comprimidos 500mg
    `;
  }
}
