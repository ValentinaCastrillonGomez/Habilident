export const roles = {
    ADMIN: 'Administrador',
    AUXILIAR: 'Personal Operativo',
    AUDITOR: 'Auditor',
} as const;

export type Role = typeof roles[keyof typeof roles];