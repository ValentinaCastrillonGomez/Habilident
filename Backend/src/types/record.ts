import { FormatField, FormatRow } from "./format";

export type FieldValue = FormatField & {
    value: string;
};

export type Record = {
    _id?: any;
    format: any;
    dateCreate: string;
    userCreate: any;
    dateLastUpdate: string;
    userLastUpdate: any;
    values: FormatRow<FieldValue[][]>[];
};