import { action, computed, makeObservable, observable } from "mobx";

type PrivateFields = '_loading' | '_error';

class UIStore {
    private _loading: boolean = false;
    private _error: string | null = null;

    constructor() {
        makeObservable<UIStore, PrivateFields>(this, {
            _loading: observable,
            _error: observable,

            loading: computed,
            error: computed,

            setLoading: action,
            setError: action
        })
    }

    setLoading(value: boolean) {
        this._loading = value;
    }

    setError(value: string | null) {
        this._error = value;
    }

    get loading(): boolean {
        return this._loading;
    }

    get error(): null | string {
        return this._error;
    }
}

export default new UIStore();
