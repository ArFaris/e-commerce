import { action, computed, makeObservable, observable, set } from "mobx";
import categoryStore from "store/CategoryStore";

type PrivateFields = '_initialSum' | '_finalSum' | '_selectedCategories' | '_isOpen';

class FilterStore {
    private _initialSum: number | null = null;
    private _finalSum: number | null = null;
    private _selectedCategories: Record<string, boolean> = {};
    private _isOpen: boolean = false;

    constructor() {
        makeObservable<FilterStore, PrivateFields>(this, {
            _initialSum: observable,
            _finalSum: observable,
            _selectedCategories: observable,
            _isOpen: observable,
            setInitialSum: action.bound,
            setFinalSum: action.bound,
            setSelectedCategories: action.bound,
            initialSum: computed,
            finalSum: computed,
            isCategoriesChecked: computed
        })

        this.initialSelectedCategories();
    }

    async initialSelectedCategories() {
        if (!categoryStore.currentCategories()) {
            await categoryStore.loadCategories();
        }

        categoryStore.currentCategories().forEach(category => set(this._selectedCategories, category.id, true));
    }

    setSelectedCategories(id: string, isChecked: boolean) {
        set(this._selectedCategories, id, isChecked);
    }

    setInitialSum(sum: number) {
        this._initialSum = sum;
    }

    setFinalSum(sum: number) {
        this._finalSum = sum;
    }

    setIsOpen(isOpen: boolean) {
        this._isOpen = isOpen;
    }

    get initialSum() {
        return this._initialSum;
    }

    get finalSum() {
        return this._finalSum;
    }

    get isCategoriesChecked() {
        return this._selectedCategories;
    }

    get isOpen() {
        return this._isOpen;
    }
}

export default new FilterStore();
