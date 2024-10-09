export const PERMISSION_ROLES = {
    CREATE_ROLES: 'Crear roles',
    READ_ROLES: 'Listar roles',
    UPDATE_ROLES: 'Actualizar roles',
    DELETE_ROLES: 'Eliminar roles',
} as const;

export const PERMISSION_USERS = {
    CREATE_USERS: 'Crear usuarios',
    READ_USERS: 'Listar usuarios',
    UPDATE_USERS: 'Actualizar usuarios',
    DELETE_USERS: 'Eliminar usuarios',
} as const;

export const PERMISSIONS = {
    users: Object.values(PERMISSION_USERS),
    roles: Object.values(PERMISSION_ROLES)
};

export type Permission =
    | typeof PERMISSION_USERS[keyof typeof PERMISSION_USERS]
    | typeof PERMISSION_ROLES[keyof typeof PERMISSION_ROLES];
