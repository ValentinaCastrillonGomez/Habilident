import { User } from "./user";

export const ROW_TYPES = {
    SINGLE: 'single',
    AREA: 'area',
    TABLE: 'table',
} as const;

export type RowTypes = typeof ROW_TYPES[keyof typeof ROW_TYPES];

export const INPUT_TYPES = {
    LABEL: 'label',
    TEXT: 'text',
    NUMBER: 'number',
    SELECT: 'select',
    DATE: 'date',
    IMAGE: 'image',
    SIGNATURE: 'signature',
} as const;

export const TYPES_NAMES = {
    [INPUT_TYPES.LABEL]: 'Texto',
    [INPUT_TYPES.TEXT]: 'Campo',
    [INPUT_TYPES.NUMBER]: 'Numerico',
    [INPUT_TYPES.SELECT]: 'Seleccionable',
    [INPUT_TYPES.DATE]: 'Fecha',
    [INPUT_TYPES.IMAGE]: 'Imagen',
    [INPUT_TYPES.SIGNATURE]: 'Firma',
} as const;

export type InputTypes = typeof INPUT_TYPES[keyof typeof INPUT_TYPES];

export type FormatField = {
    name: string;
    type: InputTypes;
    required: boolean;
    value?: string;
};

export type FormatRow = {
    type: RowTypes;
    fields: FormatField[];
};

export type Alert = {
    state: boolean;
    frequency?: string;
    dateStart?: Date;
    responsibleUser?: User;
    lastGenerated?: Date;
};

export type Format = {
    _id?: any;
    name: string;
    state: boolean;
    rows: FormatRow[];
    alert: Alert;
};