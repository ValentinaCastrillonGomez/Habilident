export const INPUT_TYPES = {
    TEXT: 'text',
    TABLE: 'table',
} as const;

export type InputTypes = typeof INPUT_TYPES[keyof typeof INPUT_TYPES];

export type Input = {
    name: string;
    type: string;
    required: boolean;
    value?: string;
};

export type Matrix = {
    type: InputTypes;
    inputs: Input[];
    values?: any[];
};

export type Format = {
    _id?: any;
    name: string;
    matrix: Matrix[];
};