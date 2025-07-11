import { User } from "./user";

export const FREQUENCIES = {
    DAYS: 'Diario',
    MONTHS: 'Mensual',
    ANNUAL: 'Anual',
} as const;

export type Frequency = typeof FREQUENCIES[keyof typeof FREQUENCIES];

export type Alert = {
    state: boolean;
    frequency: Frequency | null;
    often: number | null;
    startAt: Date | null;
    hours: string[] | null;
    responsibleUser: User | null;
};
