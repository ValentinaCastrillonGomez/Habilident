import { Permission } from "./permission";

export type Role = {
    _id?: any;
    name: string;
    permissions: Permission[];
};