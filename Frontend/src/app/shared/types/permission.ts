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
    //parameters
    CREATE_PARAMETERS: 'Crear parametros',
    READ_PARAMETERS: 'Listar parametros',
    UPDATE_PARAMETERS: 'Actualizar parametros',
    DELETE_PARAMETERS: 'Eliminar parametros',
    //formats
    CREATE_FORMATS: 'Crear formatos',
    READ_FORMATS: 'Listar formatos',
    UPDATE_FORMATS: 'Actualizar formatos',
    DELETE_FORMATS: 'Eliminar formatos',
    //records
    CREATE_RECORDS: 'Crear registros',
    READ_RECORDS: 'Listar registros',
    UPDATE_RECORDS: 'Actualizar registros',
    DELETE_RECORDS: 'Eliminar registros',
    //alerts
    CREATE_ALERTS: 'Crear alarmas',
    READ_ALERTS: 'Listar alarmas',
    UPDATE_ALERTS: 'Actualizar alarmas',
    DELETE_ALERTS: 'Eliminar alarmas',
    //reports
    PRINT_REPORTS: 'Imprimir reportes',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
