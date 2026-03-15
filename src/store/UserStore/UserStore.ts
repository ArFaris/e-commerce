import { action, computed, makeObservable, observable } from "mobx";
import api from 'api/config';
import type { User, UserCreate} from 'types/user';

type PrivateFields = '_isLoading' | '_error' | '_user';

class UserStore {
    private _isLoading: boolean = false;
    private _error: null | string = null;
    private _user: User | null = null;


    constructor() {
        makeObservable<UserStore, PrivateFields>(this, {
            _isLoading: observable,
            _error: observable,
            _user: observable,

            register: action,
            login: action,
            updateUser: action,
            deleteUser: action,
            logout: action,

            user: computed,
            error: computed,
            loading: computed
        })
    }

    
    async register(data: UserCreate) {
        const userData = {
            ...data,
            'createdAt': new Date().toISOString()
        }

        try {
            this._isLoading = true;
            this._error = null;

            const checkResponse = await api.get(`/users?email=${userData.email}`);

            if (checkResponse.data.length > 0) {
                this._error = 'A user with such as email already exists';
                return;
            }

            const response = await api.post('/users', userData);
            
            this._user = response.data;
            localStorage.setItem('user', JSON.stringify(this._user));

            return this._user;
        } catch(error) {
            this._error = error instanceof Error ? error.message : 'Error in register()';
            throw error;
        } finally {
            this._isLoading = false;
        }
    }

    async login(email: string, password: string) {
        try {
            this._isLoading = true;
            this._error = null;

            const response = await api.get<User[]>(`/users?email=${email}&password=${password}`);

            console.log(response)
            if (response.data.length === 0) {
                this._error = 'The user does not exist';
                console.log("error");
                return;
            }

            this._user = response.data[0];

            localStorage.setItem('user', JSON.stringify(this._user));

            return this._user;
        } catch(error) {
            this._error = error instanceof Error ? error.message : 'Error in login()';
            throw error;
        } finally {
            this._isLoading = false;
        }
    }

    async updateUser(userId: string, updates: Partial<UserCreate>) {
        try {
            this._isLoading = true;
            this._error = null;

            const response = await api.patch(`/users/${userId}`, updates);
            this._user = response.data;

            localStorage.setItem('user', JSON.stringify(this._user));

            return this._user;
        } catch(error) {
            this._error = error instanceof Error ? error.message : 'Error in updateUser()';
            throw error;
        } finally {
            this._isLoading = false;
        }
    }

    async deleteUser(userId: string) {
        try {
            this._isLoading = true;
            this._error = null;

            await api.delete(`/users/${userId}`);

            this._user = null;
            localStorage.removeItem('user');
        } catch(error) {
            this._error = error instanceof Error ? error.message : 'Error in deleteUser()';
            throw error;
        } finally {
            this._isLoading = false;
        }
    }

    async restoreSession() {
        const savedUser = localStorage.getItem('user');

        if (!savedUser) return;

        try {
            const user = JSON.parse(savedUser);
            const response = await api.get(`/users/${user.id}`);

            this._user = response.data;
            localStorage.setItem('user', JSON.stringify(this._user));
        } catch(error) {
            localStorage.removeItem('user');
        }
    }

    logout() {
        this._user = null;
        localStorage.removeItem('user');
        this._error = null;
    }
    
    get user(): User | null {
        return this._user;
    }

    get error(): string | null {
        return this._error;
    }

    get loading(): boolean {
        return this._isLoading;
    }
}

export default new UserStore();
