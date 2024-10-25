import { FormatRow } from "./format";

export type Record = {
    _id?: any;
    format: any;
    dateCreate: string;
    userCreate: any;
    dateLastUpdate: string;
    userLastUpdate: any;
    rows: FormatRow[];
};