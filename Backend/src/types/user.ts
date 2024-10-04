import { Role } from "./roles";

export type User = {
    _id?: any;
    fullName: string;
    username: string;
    password: string;
    email: string;
    phone?: number;
    roles: Role[];
    state?: boolean;
}