export const  PERIODICITY = {
    D: "diario",
    S: "Semanal",
    M: "Mensual",
    T: "Trimestral",
    ST: "Semestral",
    A: "Anual",
} as const;

export type Periodicitys = typeof PERIODICITY[keyof typeof PERIODICITY];
