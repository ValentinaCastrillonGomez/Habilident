export const TYPE_PARAMETERS = {
    TYPE_DOCUMENTS: 'Tipo de documentos',
    GENDERS: 'Generos',
    PERIODICITY: 'Periocidad',
} as const;

export type TypeParameters = typeof TYPE_PARAMETERS[keyof typeof TYPE_PARAMETERS];
