export const PERMISSIONS = {
    //roles
    CREATE_ROLES: 'Crear roles',
    READ_ROLES: 'Listar roles',
    UPDATE_ROLES: 'Actualizar roles',
    DELETE_ROLES: 'Eliminar roles',
    //users
    CREATE_USERS: 'Crear usuarios',
    READ_USERS: 'Listar usuarios',
    UPDATE_USERS: 'Actualizar usuarios',
    DELETE_USERS: 'Eliminar usuarios',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
