export interface User {
    id?: number;
    name: string;
    username: string;
    password?: string;
    roles?: string[];
    token?: string;
}

export interface Role {
    id?: number;
    name: string;
    description: string;
}