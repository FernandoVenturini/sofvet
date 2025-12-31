export const medicamentosVeterinarios = [
    {
        id: "1",
        nomeComercial: "Ivermectina",
        nomeQuimico: "Ivermectina",
        especies: [
            { codigo: "CAN", descricao: "Canino", dosePorKg: 0.2, unidade: "mg" },
            {
                codigo: "FEL",
                descricao: "Felino",
                dosePorKg: 0,
                unidade: "mg",
                contraindicado: true,
            },
            { codigo: "BOV", descricao: "Bovino", dosePorKg: 0.2, unidade: "mg" },
            { codigo: "EQU", descricao: "Equino", dosePorKg: 0.2, unidade: "mg" },
        ],
        atencao: "NÃO USAR EM FELINOS! Toxicidade em Collies e raças relacionadas.",
        apresentacao: "Injetável 1%, Solução oral 0,08%, Comprimidos 6mg",
        indicacao: "Antiparasitário de amplo espectro",
        posologia: "0.2 mg/kg SC a cada 30 dias. Oral: 0.3 mg/kg.",
        laboratorios: ["Merial", "Ourofino", "Zoetis", "MSD"],
        observacoes:
            "Eficaz contra nematódeos, ácaros, piolhos. Contra-indicado para filhotes < 6 semanas.",
        isVeterinario: true,
        usadoEmConsultas: 128,
        categoria: "Antiparasitário",
        viaAdministracao: ["Oral", "Subcutânea", "Tópica"],
    },
    {
        id: "2",
        nomeComercial: "Enrofloxacina (Baytril)",
        nomeQuimico: "Enrofloxacina",
        especies: [
            { codigo: "CAN", descricao: "Canino", dosePorKg: 5, unidade: "mg" },
            { codigo: "FEL", descricao: "Felino", dosePorKg: 5, unidade: "mg" },
            { codigo: "AVE", descricao: "Aves", dosePorKg: 10, unidade: "mg" },
        ],
        atencao:
            "Pode causar lesões cartilaginosas em animais jovens. Evitar uso em gestantes.",
        apresentacao: "Injetável 2.5%, 5% e 10%, Comprimidos 15mg, 50mg, 150mg",
        indicacao: "Antibiótico de amplo espectro (bactericida)",
        posologia: "5-20 mg/kg/dia, VO ou SC, dividido em 1-2 doses",
        laboratorios: ["Bayer", "Agener União", "Vetnil"],
        observacoes:
            "Fluoroquinolona. Eficaz contra Gram-negativos. Uso off-label em aves.",
        isVeterinario: true,
        usadoEmConsultas: 94,
        categoria: "Antibiótico",
        viaAdministracao: ["Oral", "Subcutânea", "Intramuscular"],
    },
    {
        id: "3",
        nomeComercial: "Dipirona (Novalgina)",
        nomeQuimico: "Metamizol Sódico",
        especies: [
            { codigo: "CAN", descricao: "Canino", dosePorKg: 25, unidade: "mg" },
            { codigo: "FEL", descricao: "Felino", dosePorKg: 15, unidade: "mg" },
            { codigo: "EQU", descricao: "Equino", dosePorKg: 10, unidade: "g" },
        ],
        atencao:
            "Pode causar agranulocitose. Monitorar hemograma com uso prolongado.",
        apresentacao: "Comprimidos 500mg, Solução injetável 500mg/ml",
        indicacao: "Analgésico e antitérmico",
        posologia:
            "Caninos: 25 mg/kg VO a cada 8h. Felinos: 15 mg/kg VO a cada 12h.",
        laboratorios: ["Sanofi", "Medley", "Neo Química"],
        observacoes:
            "Uso humano adaptado. Eficaz para dor leve a moderada e febre.",
        isVeterinario: false,
        usadoEmConsultas: 215,
        categoria: "Analgésico/Antitérmico",
        viaAdministracao: ["Oral", "Intravenosa", "Intramuscular"],
    },
    {
        id: "4",
        nomeComercial: "Dexametasona (Decadron)",
        nomeQuimico: "Dexametasona",
        especies: [
            { codigo: "CAN", descricao: "Canino", dosePorKg: 0.1, unidade: "mg" },
            { codigo: "FEL", descricao: "Felino", dosePorKg: 0.1, unidade: "mg" },
            { codigo: "EQU", descricao: "Equino", dosePorKg: 0.05, unidade: "mg" },
        ],
        atencao:
            "Uso prolongado pode causar síndrome de Cushing, diabetes, imunossupressão.",
        apresentacao: "Injetável 2mg/ml, 4mg/ml, Comprimidos 0.5mg, 0.75mg",
        indicacao: "Anti-inflamatório esteroidal, imunossupressor",
        posologia: "0.1-0.2 mg/kg/dia, redução gradual. Choque: 4-8 mg/kg IV.",
        laboratorios: ["MSD", "Aché", "Eurofarma"],
        observacoes:
            "Glicocorticóide potente. Usar dose mínima efetiva por menor tempo possível.",
        isVeterinario: false,
        usadoEmConsultas: 87,
        categoria: "Corticoesteróide",
        viaAdministracao: ["Intravenosa", "Intramuscular", "Oral"],
    },
    {
        id: "5",
        nomeComercial: "Carprofeno (Rimadyl)",
        nomeQuimico: "Carprofeno",
        especies: [
            { codigo: "CAN", descricao: "Canino", dosePorKg: 4, unidade: "mg" },
            { codigo: "FEL", descricao: "Felino", dosePorKg: 2, unidade: "mg" },
        ],
        atencao:
            "Monitorar função renal e hepática. Evitar em animais desidratados.",
        apresentacao: "Comprimidos 20mg, 50mg, 100mg",
        indicacao: "Anti-inflamatório não esteroidal (AINE)",
        posologia: "4 mg/kg/dia VO, dividido em 2 doses. Manutenção: 2 mg/kg/dia.",
        laboratorios: ["Zoetis", "Elanco", "Vetbrands"],
        observacoes:
            "AINE coxib seletivo. Eficaz para osteoartrite e dor pós-operatória.",
        isVeterinario: true,
        usadoEmConsultas: 156,
        categoria: "Anti-inflamatório",
        viaAdministracao: ["Oral"],
    },
    {
        id: "6",
        nomeComercial: "Marbofloxacina (Marbocyl)",
        nomeQuimico: "Marbofloxacina",
        especies: [
            { codigo: "CAN", descricao: "Canino", dosePorKg: 2, unidade: "mg" },
            { codigo: "FEL", descricao: "Felino", dosePorKg: 2, unidade: "mg" },
        ],
        atencao:
            "Evitar em animais com histórico de convulsões. Monitorar função renal.",
        apresentacao: "Comprimidos 20mg, 80mg, Solução oral 5mg/ml",
        indicacao: "Antibiótico fluorquinolona de 3ª geração",
        posologia: "2 mg/kg/dia VO, uma vez ao dia. Pele: 2-5 mg/kg/dia.",
        laboratorios: ["Vetoquinol", "Agener União"],
        observacoes:
            "Excelente penetração tecidual. Eficaz contra Pseudomonas spp.",
        isVeterinario: true,
        usadoEmConsultas: 73,
        categoria: "Antibiótico",
        viaAdministracao: ["Oral"],
    },
    {
        id: "7",
        nomeComercial: "Fenbendazol (Panacur)",
        nomeQuimico: "Fenbendazol",
        especies: [
            { codigo: "CAN", descricao: "Canino", dosePorKg: 50, unidade: "mg" },
            { codigo: "FEL", descricao: "Felino", dosePorKg: 50, unidade: "mg" },
            { codigo: "BOV", descricao: "Bovino", dosePorKg: 7.5, unidade: "mg" },
        ],
        atencao:
            "Seguro para fêmeas gestantes. Efeito larvicida em estágios migratórios.",
        apresentacao: "Pasta oral 10%, Pó, Suspensão 10%",
        indicacao: "Anti-helmíntico de amplo espectro",
        posologia:
            "50 mg/kg/dia VO por 3-5 dias. Giardia: 50 mg/kg/dia por 5 dias.",
        laboratorios: ["Intervet/MSD", "Ourofino"],
        observacoes:
            "Benzimidazol. Eficaz contra nematódeos gastrointestinais e Giardia.",
        isVeterinario: true,
        usadoEmConsultas: 189,
        categoria: "Antiparasitário",
        viaAdministracao: ["Oral"],
    },
    {
        id: "8",
        nomeComercial: "Tramadol (Tramal)",
        nomeQuimico: "Tramadol Cloridrato",
        especies: [
            { codigo: "CAN", descricao: "Canino", dosePorKg: 5, unidade: "mg" },
            { codigo: "FEL", descricao: "Felino", dosePorKg: 2, unidade: "mg" },
        ],
        atencao:
            "Pode causar sedação, náusea. Evitar com outros depressores do SNC.",
        apresentacao: "Cápsulas 50mg, Gotas 100mg/ml, Injetável 50mg/ml",
        indicacao: "Analgésico opióide para dor moderada a severa",
        posologia:
            "Caninos: 5 mg/kg VO a cada 8-12h. Felinos: 2-4 mg/kg VO a cada 12h.",
        laboratorios: ["Pfizer", "Medley", "Cristália"],
        observacoes:
            "Agonista μ-opioide fraco. Inibe recaptação de serotonina e noradrenalina.",
        isVeterinario: false,
        usadoEmConsultas: 64,
        categoria: "Analgésico Opioide",
        viaAdministracao: ["Oral", "Intramuscular", "Subcutânea"],
    },
    {
        id: "9",
        nomeComercial: "Cefalexina (Keflex)",
        nomeQuimico: "Cefalexina",
        especies: [
            { codigo: "CAN", descricao: "Canino", dosePorKg: 22, unidade: "mg" },
            { codigo: "FEL", descricao: "Felino", dosePorKg: 22, unidade: "mg" },
        ],
        atencao:
            "Pode causar disturbios gastrointestinais. Monitorar em pacientes alérgicos à penicilina.",
        apresentacao: "Cápsulas 500mg, Suspensão oral 250mg/5ml",
        indicacao: "Antibiótico cefalosporina de 1ª geração",
        posologia:
            "22-30 mg/kg VO a cada 8-12h. Infecções cutâneas: 22 mg/kg a cada 12h.",
        laboratorios: ["EMS", "Medley", "Sanofi"],
        observacoes:
            "Bactericida, age na parede celular. Eficaz contra Staphylococcus e Streptococcus.",
        isVeterinario: false,
        usadoEmConsultas: 142,
        categoria: "Antibiótico",
        viaAdministracao: ["Oral"],
    },
    {
        id: "10",
        nomeComercial: "Furosemida (Lasix)",
        nomeQuimico: "Furosemida",
        especies: [
            { codigo: "CAN", descricao: "Canino", dosePorKg: 2, unidade: "mg" },
            { codigo: "FEL", descricao: "Felino", dosePorKg: 1, unidade: "mg" },
            { codigo: "EQU", descricao: "Equino", dosePorKg: 1, unidade: "mg" },
        ],
        atencao:
            "Pode causar desidratação e desequilíbrio eletrolítico. Monitorar potássio.",
        apresentacao: "Comprimidos 40mg, Injetável 10mg/ml",
        indicacao: "Diurético de alça para edema e insuficiência cardíaca",
        posologia: "1-4 mg/kg VO, SC, IV a cada 8-12h. Ajustar conforme resposta.",
        laboratorios: ["Sanofi", "Aché", "Eurofarma"],
        observacoes:
            "Inibe reabsorção de Na+/K+/Cl- na alça de Henle. Efeito em 30-60 min.",
        isVeterinario: false,
        usadoEmConsultas: 58,
        categoria: "Diurético",
        viaAdministracao: ["Oral", "Intravenosa", "Subcutânea"],
    },
];

// Categorias para filtro
export const categoriasMedicamentos = [
    "Todos",
    "Antibiótico",
    "Anti-inflamatório",
    "Analgésico/Antitérmico",
    "Antiparasitário",
    "Corticoesteróide",
    "Diurético",
    "Analgésico Opioide",
    "Anticonvulsivante",
    "Anestésico",
    "Broncodilatador",
    "Cardiovascular",
];

// Espécies suportadas
export const especiesSuportadas = [
    { codigo: "CAN", descricao: "Canino" },
    { codigo: "FEL", descricao: "Felino" },
    { codigo: "EQU", descricao: "Equino" },
    { codigo: "BOV", descricao: "Bovino" },
    { codigo: "AVE", descricao: "Aves" },
    { codigo: "SUI", descricao: "Suíno" },
    { codigo: "CAP", descricao: "Caprino/Ovino" },
    { codigo: "EXO", descricao: "Exóticos" },
];
