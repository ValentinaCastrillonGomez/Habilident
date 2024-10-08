export const PERMISSION = {
    //Usuarios
    CREATE_USERS: 'Crear usuarios',
    READ_USERS: 'Listar usuarios',
    UPDATE_USERS: 'Actualizar usuarios',
    DELETE_USERS: 'Eliminar usuarios',
    //Roles
    CREATE_ROLES: 'Crear roles',
    READ_ROLES: 'Listar usuarios',
    UPDATE_ROLES: 'Actualizar usuarios',
    DELETE_ROLES: 'Eliminar usuarios',
} as const;

export const PERMISSIONS = Object.values(PERMISSION);

export type Permission = typeof PERMISSION[keyof typeof PERMISSION];
