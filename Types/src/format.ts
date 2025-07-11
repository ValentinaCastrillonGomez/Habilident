import { Alert } from "./alert";

export const ROW_TYPES = {
    SINGLE: 'Campos',
    AREA: 'Texto en area',
    TABLE: 'Tabla',
} as const;

export type RowType = typeof ROW_TYPES[keyof typeof ROW_TYPES];

export const INPUT_TYPES = {
    LABEL: 'Titulo',
    TEXT: 'Texto',
    NUMBER: 'Numerico',
    SELECT: 'Seleccionable',
    DATE: 'Fecha',
    IMAGE: 'Imagen',
    SIGNATURE: 'Firma',
    USER: 'Usuario',
    RECORD: 'Registro',
} as const;

export type InputType = typeof INPUT_TYPES[keyof typeof INPUT_TYPES];

export type FieldsConfig = {
    name: string;
    type: InputType;
    required: boolean;
    value: string;
    reference: string | null;
};

export type SingleRow = {
    type: typeof ROW_TYPES.SINGLE;
    fields: FieldsConfig[];
};

export type AreaRow = {
    type: typeof ROW_TYPES.AREA;
    fields: FieldsConfig;
};

export type TableRow = {
    type: typeof ROW_TYPES.TABLE;
    fields: FieldsConfig[][];
};

export type Format = {
    _id?: any;
    name: string;
    state: boolean;
    block: boolean;
    alert: Alert;
    rows: FormatRow[];
};

export type FormatRow = SingleRow | AreaRow | TableRow;
