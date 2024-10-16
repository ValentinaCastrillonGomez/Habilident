export const ROW_TYPES = {
    SINGLE: 'single',
    TABLE: 'table',
} as const;

export type RowTypes = typeof ROW_TYPES[keyof typeof ROW_TYPES];

export type FormatField = {
    name: string;
    type: string;
    required: boolean;
};

export type FormatRow<T> = {
    type: RowTypes;
    fields: T;
};

export type Format = {
    _id?: any;
    name: string;
    rows: FormatRow<FormatField[]>[];
};