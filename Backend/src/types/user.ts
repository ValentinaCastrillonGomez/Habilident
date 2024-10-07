import { Role } from "./roles";

export type User = {
    _id?: any;
    firstNames: string;
    lastNames: string;
    birdthday: Date;
    typeDocument: TypeDocument;
    numberDocument: number;
    email: string;
    gender: Gender;
    address: string;
    phone: number;
    office: Office;
    cargo: string;
    role: Role;
    password: string;
    signature?: Blob[]
    state: boolean;
}