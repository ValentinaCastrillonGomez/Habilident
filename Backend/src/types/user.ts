import { Role } from "./roles";

export type User = {
    _id?: any;
    firstNames: string;
    lastNames: string;
    birthday: Date;
    typeDocument: string;
    numberDocument: number;
    email: string;
    gender: string;
    address: string;
    phone: number;
    office: string;
    cargo: string;
    role: Role;
    password: string;
    signature?: string;
    state: boolean;
}