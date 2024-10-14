export const MASTER = {
    TYPE_DOCUMENTS: 'Tipos de Documento',
    GENDERS: 'Generos',
} as const;

type MasterTypes = typeof MASTER[keyof typeof MASTER];

export type Master = {
    type: MasterTypes;
    value: string;
};
