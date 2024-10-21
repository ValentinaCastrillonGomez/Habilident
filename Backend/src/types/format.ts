export const ROW_TYPES = {
    SINGLE: 'single',
    TABLE: 'table',
} as const;

export type RowTypes = typeof ROW_TYPES[keyof typeof ROW_TYPES];

export const INPUT_TYPES = {
    TEXT: 'text',
    NUMBER: 'number',
    SELECT: 'select',
    DATE: 'date',
} as const;

export type InputTypes = typeof INPUT_TYPES[keyof typeof INPUT_TYPES];

export type FormatField = {
    name: string;
    type: InputTypes;
    required: boolean;
    value?: string;
    options?: any[];
    position?: {
        x: number;
        y: number;
        state: boolean;
    };
};

export type FormatRow = {
    type: RowTypes;
    fields: FormatField[];
    values?: any[][]
    position?: {
        x: number;
        y: number;
        state: boolean;
    };
};

export type Format = {
    _id?: any;
    name: string;
    rows: FormatRow[];
};