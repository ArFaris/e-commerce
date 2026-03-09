import { action, computed, makeObservable, observable } from "mobx";
import type { CategoryType } from "types/category";
import api from 'api/config';

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
        await api.get('/categories')
            .then(response => {
                this.setCategories(response.data);
            })
            .catch(error => console.log(error));
    }

    get category(): CategoryType | null {
        return this._category;
    }

    currentCategories(): CategoryType[] {
        return this._categories;
    }

    async setCategory(name?: string) {
        if (this._categories.length === 0) {
            console.log("un")
            await this.loadCategories();
        }
        console.log(this._categories)
        const category = this._categories.find(item => item.slug === name);
        console.log(category)
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
