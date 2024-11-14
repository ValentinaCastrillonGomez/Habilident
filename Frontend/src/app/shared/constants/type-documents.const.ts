export const TYPE_DOCUMENTS = {
    RC: "Registro civil",
    TI: "Tarjeta de identidad",
    CC: "Cédula de ciudadanía",
    TE: "Tarjeta de extranjería",
    CE: "Cédula de extranjería",
    NIT: "Número de identificación tributaria",
    PP: "Pasaporte",
    PEP: "Permiso especial de permanencia",
    DIE: "Documento de identificación extranjero",
    NUIP: "NUIP",
    FOREIGN_NIT: "NIT de otro país",
} as const;

export type TypeDocument = typeof TYPE_DOCUMENTS[keyof typeof TYPE_DOCUMENTS];
