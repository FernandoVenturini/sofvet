interface Appointment {
  id: string;
  animalId: string;
  animalName: string;
  ownerId: string;
  ownerName: string;
  veterinarianId: string;
  veterinarianName: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: "consulta" | "cirurgia" | "vacina" | "exame" | "retorno";
  status:
    | "agendado"
    | "confirmado"
    | "em_andamento"
    | "concluido"
    | "cancelado";
  description: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
