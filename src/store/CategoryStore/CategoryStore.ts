import { action, computed, makeObservable, observable } from "mobx";
import type { CategoryType } from "types/category";
import supabase from "lib/Supabase";

type PrivateFields = '_category' | '_categories';

class CategoryStore {
    private _category: CategoryType | null = null;
    private _categories: CategoryType[] = [];

    constructor() {
        makeObservable<CategoryStore, PrivateFields>(this, {
            _category: observable,
            _categories: observable,
            setCategory: action.bound,
            setCategories: action.bound,
            loadCategories: action.bound,
            category: computed
        })
    }

    async loadCategories() {
        const { data, error } = await supabase
                                    .from('categories')
                                    .select('*')
        if (data) {
            this.setCategories(data);
        } else {
            console.error(error);
        }
    }

    get category(): CategoryType | null {
        return this._category;
    }

    currentCategories(): CategoryType[] {
        return this._categories;
    }

    async setCategory(name?: string) {
        if (this._categories.length === 0) {
            await this.loadCategories();
        }
        const category = this._categories.find(item => item.slug === name);
        if (!category) {
            console.error("Несуществующая категория");
            return;
        } else {
            this._category = category;
        }
    }

    setCategories(categories: CategoryType[]) {
        this._categories = categories;
    }
}

export default new CategoryStore();
