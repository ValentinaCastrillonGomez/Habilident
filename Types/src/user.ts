export type User = {
    _id?: any;
    firstNames: string;
    lastNames: string;
    typeDocument: string;
    numberDocument: string;
    email: string;
    address: string;
    phone: string;
    birthday: Date;
    gender: string;
    office: string;
    position: string;
    roles: any[];
    password: string;
    signature?: Signature;
    refreshToken?: string;
    state: boolean;
}

export type Signature = {
    name: string;
    image: string;
}