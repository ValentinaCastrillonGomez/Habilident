import { User } from "./user";

export enum ROW_TYPES {
    SINGLE,
    AREA,
    TABLE,
};

export enum INPUT_TYPES {
    LABEL,
    TEXT,
    NUMBER,
    SELECT,
    DATE,
    IMAGE,
    SIGNATURE,
    USER,
    RECORD,
};

export const TYPES_NAMES = {
    [INPUT_TYPES.LABEL]: 'Texto',
    [INPUT_TYPES.TEXT]: 'Campo',
    [INPUT_TYPES.NUMBER]: 'Numerico',
    [INPUT_TYPES.SELECT]: 'Seleccionable',
    [INPUT_TYPES.DATE]: 'Fecha',
    [INPUT_TYPES.IMAGE]: 'Imagen',
    [INPUT_TYPES.SIGNATURE]: 'Firma',
    [INPUT_TYPES.USER]: 'Usuario',
    [INPUT_TYPES.RECORD]: 'Registro',
} as const;

export type FieldsConfig = {
    name: string;
    type: INPUT_TYPES;
    required: boolean;
    value: string;
    reference: string | null;
};

export type SingleRow = {
    type: ROW_TYPES.SINGLE;
    fields: FieldsConfig[];
};

export type AreaRow = {
    type: ROW_TYPES.AREA;
    fields: FieldsConfig;
};

export type TableRow = {
    type: ROW_TYPES.TABLE;
    fields: FieldsConfig[][];
};

export type Alert = {
    state: boolean;
    frequency: string | null;
    dateStart: Date | null;
    responsibleUser: User | null;
};

export type Format = {
    _id?: any;
    name: string;
    state: boolean;
    alert: Alert;
    rows: FormatRow[];
};

export type FormatRow = SingleRow | AreaRow | TableRow;
