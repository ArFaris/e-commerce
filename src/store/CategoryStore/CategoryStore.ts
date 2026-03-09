import { action, makeObservable, observable } from "mobx";
import type { CategoryType } from "types/category";

type PrivateFields = '_category' | '_categories';

class CategoryStore {
    private _category: CategoryType | null = null;
    private _categories: CategoryType[] = [];

    constructor() {
        makeObservable<CategoryStore, PrivateFields>(this, {
            _category: observable,
            _categories: observable,
            setCategory: action.bound,
            setCategories: action.bound
        })
    }

    currentCategory(): CategoryType | null {
        return this._category;
    }

    currentCategories(): CategoryType[] {
        return this._categories;
    }

    setCategory(category: CategoryType) {
        this._category = category;
    }

    setCategories(categories: CategoryType[]) {
        this._categories = categories;
    }
}

export default new CategoryStore();
