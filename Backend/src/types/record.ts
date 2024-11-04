import { FormatField, RowTypes } from "./format";

export type RecordRow = {
    type: RowTypes;
    fields: FormatField[][];
};

export type Record = {
    _id?: any;
    format: any;
    dateCreate: Date;
    userCreate: any;
    dateLastUpdate: Date;
    userLastUpdate: any;
    rows: RecordRow[];
};