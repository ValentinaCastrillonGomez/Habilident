export type List = {
    name: string;
    protected: boolean;
    values: string[];
}

export type Parameter = {
    _id?: any;
    office: string;
    lists: List[];
};