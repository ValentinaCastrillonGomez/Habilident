export const GENDERS = {
    H: "Hombre",
    M: "Mujer",
    O: "Otro",
} as const;

export type Gender = typeof GENDERS[keyof typeof GENDERS];
