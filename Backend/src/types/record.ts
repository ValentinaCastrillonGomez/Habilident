import { Matrix } from "./format";

export type Record = {
    _id?: any;
    dateCreate: string;
    userCreate: any;
    dateLastUpdate: string;
    userLastUpdate: any;
    format: any;
    matrix: Matrix[];
};  