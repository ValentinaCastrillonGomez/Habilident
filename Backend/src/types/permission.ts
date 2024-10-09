export const PERMISSION = {
    //Usuarios
    CREATE_USERS: 'Crear usuarios',
    READ_USERS: 'Listar usuarios',
    UPDATE_USERS: 'Actualizar usuarios',
    DELETE_USERS: 'Eliminar usuarios',
    //Roles
    CREATE_ROLES: 'Crear roles',
    READ_ROLES: 'Listar roles',
    UPDATE_ROLES: 'Actualizar roles',
    DELETE_ROLES: 'Eliminar roles',
} as const;

export const PERMISSIONS = Object.values(PERMISSION);

export type Permission = typeof PERMISSION[keyof typeof PERMISSION];
