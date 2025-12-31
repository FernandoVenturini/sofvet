import pdfParse from "pdf-parse";
import fs from "fs";

export const converterPDFMedicamentos = async (caminhoPDF: string) => {
  const dataBuffer = fs.readFileSync(caminhoPDF);
  const data = await pdfParse(dataBuffer);

  // Processar o texto do PDF
  const linhas = data.text.split("\n");
  const medicamentos = [];

  let medicamentoAtual: any = {};

  for (const linha of linhas) {
    if (linha.match(/^[A-Z]/)) {
      // Nome do medicamento
      if (medicamentoAtual.nome) {
        medicamentos.push(medicamentoAtual);
      }
      medicamentoAtual = {
        nome: linha.trim(),
        especies: [],
      };
    } else if (linha.includes("mg/kg") || linha.includes("ml/kg")) {
      // Extrair dose por espécie
      const doseMatch = linha.match(/(\d+\.?\d*)\s*(mg|ml)\/kg/);
      if (doseMatch) {
        medicamentoAtual.especies.push({
          dosePorKg: parseFloat(doseMatch[1]),
          unidade: doseMatch[2],
        });
      }
    }
  }

  return medicamentos;
};
