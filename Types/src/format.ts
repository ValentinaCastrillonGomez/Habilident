export const ROW_TYPES = {
    SINGLE: 'single',
    AREA: 'area',
    TABLE: 'table',
} as const;

export type RowTypes = typeof ROW_TYPES[keyof typeof ROW_TYPES];

export const INPUT_TYPES = {
    TEXT: 'text',
    NUMBER: 'number',
    SELECT: 'select',
    DATE: 'date',
} as const;

export const TYPES_NAMES = {
    [INPUT_TYPES.TEXT]: 'Texto',
    [INPUT_TYPES.NUMBER]: 'Numero',
    [INPUT_TYPES.SELECT]: 'Selección',
    [INPUT_TYPES.DATE]: 'Fecha',
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

export type Format = {
    _id?: any;
    name: string;
    rows: FormatRow[];
};