export type Page<T> = {
    data: T[];
    totalRecords: number;
    totalPages: number;
};