import { Permission } from "./permission";

export type Role = {
    name: string;
    permissions: Permission[];
};