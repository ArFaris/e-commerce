export interface UserCreate {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
}

export interface User extends UserCreate {
    id: string;
    created_at: string;
}
