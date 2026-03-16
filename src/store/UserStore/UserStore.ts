import { action, computed, makeObservable, observable } from "mobx";
import type { User, UserCreate} from 'types/user';
import supabase from "lib/Supabase";

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
            'created_at': new Date().toISOString()
        }

        try {
            this._isLoading = true;
            this._error = null;

            const { data: existingUsers } = await supabase
                                                    .from('users')
                                                    .select('*')
                                                    .eq('email', userData.email);

            if (!existingUsers) {
                this._error = 'A user with such as email already exists';
                return;
            }

            const { data: newUser, error } = await supabase
                                                .from('users')
                                                .insert([userData])
                                                .select()
                                                .single()
            if (error) throw error;

            this._user = newUser;
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

            const { data: user } = await supabase    
                                            .from('users')
                                            .select()
                                            .eq('email', email)
                                            .eq('password', password)
                                            .single()
            if (!user) {
                this._error = 'The user does not exist';
                return;
            }

            this._user = user;

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

            const { data: updatedUser, error } = await supabase
                                                    .from('users')
                                                    .update(updates)
                                                    .eq('id', userId)
                                                    .select()
                                                    .single()
            if (error) throw error;
            this._user = updatedUser;

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

            const { error } = await supabase
                    .from('users')
                    .delete()
                    .eq('id', userId);

            if (error) throw error;
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

            const { data: userData, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single();

            if (error) throw error;
            this._user = userData;
            localStorage.setItem('user', JSON.stringify(this._user));
        } catch(error) {
            localStorage.removeItem('user');
            console.error(error);
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
