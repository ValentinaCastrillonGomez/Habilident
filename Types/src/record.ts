import { FormatRow } from "./format";

export type Record = {
    _id?: any;
    format: any;
    dateEffective: Date;
    dateCreate?: Date;
    userCreate?: any;
    dateLastUpdate?: Date;
    userLastUpdate?: any;
    rows: FormatRow[];
};