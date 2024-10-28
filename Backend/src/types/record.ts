import { FormatField, RowTypes } from "./format";

export type RecordRow = {
    type: RowTypes;
    fields: FormatField[][];
};

export type Record = {
    _id?: any;
    format: any;
    dateCreate: string;
    userCreate: any;
    dateLastUpdate: string;
    userLastUpdate: any;
    rows: RecordRow[];
};