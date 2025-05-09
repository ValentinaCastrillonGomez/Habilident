export const TYPE_PARAMETERS = {
    TYPE_DOCUMENTS: 'Tipo de documentos',
    GENDERS: 'Generos',
    PERIODICITY: 'Periocidad',
} as const;

export type Parameter = {
    _id?: any;
    name: string;
    protected: boolean;
    options: string[];
};
