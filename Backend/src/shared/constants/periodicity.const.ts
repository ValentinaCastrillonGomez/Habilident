export const PERIODICITY = {
    DIARY: "Diario",
    WEEKLY: "Semanal",
    MONTHLY: "Mensual",
    QUARTERLY: "Trimestral",
    BIANNUAL: "Semestral",
    ANNUAL: "Anual",
} as const;

export type Periodicity = typeof PERIODICITY[keyof typeof PERIODICITY];
