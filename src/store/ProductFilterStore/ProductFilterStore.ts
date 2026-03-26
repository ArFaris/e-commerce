import { action, computed, makeObservable, observable, runInAction, values } from "mobx";
import type { Product } from "types/product";
import { type Option } from 'components/MultiDropdown';
import ProductsStore from "../ProductsStore";
import categoryStore from "../CategoryStore";

type PrivateFields = '_priceFrom' | '_priceTo' | '_selectedCategories' | '_selectedItems' | '_isOpen' | '_filteredProducts';

class ProductFilterStore {
    private _priceFrom: number | null = null;
    private _priceTo: number | null = null;
    private _selectedCategories: Record<string, boolean> = {};
    private _selectedItems: Option[] = [];
    private _isOpen: boolean = false;
    private _filteredProducts: Product[] = [];

    constructor() {
        makeObservable<ProductFilterStore, PrivateFields>(this, {
            _priceFrom: observable,
            _priceTo: observable,
            _selectedCategories: observable,
            _selectedItems: observable,
            _isOpen: observable,
            _filteredProducts: observable,
            
            priceFrom: computed,
            priceTo: computed,
            selectedCategories: computed,
            selectedItems: computed,
            isOpen: computed,
            filteredProducts: computed,
            activeFiltersCount: computed,
            
            setPriceFrom: action.bound,
            setPriceTo: action.bound,
            setSelectedCategories: action.bound,
            setSelectedItems: action.bound,
            setIsOpen: action.bound,
            applyFilters: action.bound,
            resetFilters: action.bound,
            initializeCategories: action.bound
        });

        this.initializeCategories();
    }

    async initializeCategories() {
        console.log('init productFilterStore')
        if (categoryStore.currentCategories().length === 0) {
            await categoryStore.loadCategories();
        }
        
        const initialCategories: Record<string, boolean> = {};
        categoryStore.currentCategories().forEach(category => {
            initialCategories[category.id] = true;
        });
        this._selectedCategories = initialCategories;
    }

    setPriceFrom(price: number | null) {
        this._priceFrom = price;
        this.applyFilters();
    }

    setPriceTo(price: number | null) {
        this._priceTo = price;
        this.applyFilters();
    }

    setSelectedCategories(id: string, isChecked: boolean) {
        this._selectedCategories[id] = isChecked;
        this.applyFilters();
    }

    setSelectedItems(options: Option[]) {
        this._selectedItems = options;
        this.applyFilters();
    }

    setIsOpen(isOpen: boolean) {
        this._isOpen = isOpen;
    }

    resetFilters() {
        this._priceFrom = null;
        this._priceTo = null;
        this._selectedItems = [];
        
        const resetCategories: Record<string, boolean> = {};
        categoryStore.currentCategories().forEach(category => {
            resetCategories[category.id] = true;
        });
        this._selectedCategories = resetCategories;
        
        this.applyFilters();
    }

    private getNumericPrice(product: Product): number {
        if (typeof product.price === 'number') {
            return product.price;
        }
        
        const priceString = String(product.price).replace('$', '');
        return parseFloat(priceString) || 0;
    }

    applyFilters() {
        if (!ProductsStore.products.length) {
            this._filteredProducts = [];
            return;
        }

        let filtered = [...ProductsStore.products];

        if (this._priceFrom !== null) {
            filtered = filtered.filter(product => {
                const price = this.getNumericPrice(product);
                return price >= this._priceFrom!;
            });
        }
        if (this._priceTo !== null) {
            filtered = filtered.filter(product => {
                const price = this.getNumericPrice(product);
                return price <= this._priceTo!;
            });
        }

        const activeCategories = Object.entries(this._selectedCategories)
            .filter(([_, isChecked]) => isChecked)
            .map(([id]) => id);
        
        if (activeCategories.length > 0 && activeCategories.length < categoryStore.currentCategories().length) {
            filtered = filtered.filter(product => {
                const category = categoryStore.currentCategories().find(cat => cat.name === product.category_name);
                return category ? activeCategories.includes(category.id) : false;
            });
        }

        if (this._selectedItems.length > 0) {
            filtered = filtered.filter(product => 
                this._selectedItems.some(item => item.key === product.id)
            );
        }

        runInAction(() => {
            this._filteredProducts = filtered;
            ProductsStore.setFilteredProducts(filtered);
        });
    }

    get priceFrom() {
        return this._priceFrom;
    }

    get priceTo() {
        return this._priceTo;
    }

    get selectedCategories() {
        return this._selectedCategories;
    }

    get selectedItems() {
        return this._selectedItems;
    }

    get isOpen() {
        return this._isOpen;
    }

    get filteredProducts() {
        return this._filteredProducts;
    }

    get activeFiltersCount(): number {
        let count = 0;
        if (this._priceFrom !== null) count++;
        if (this._priceTo !== null) count++;
        if (this._selectedItems.length > 0) count++;
        
        const activeCategories = values(this._selectedCategories).filter(v => v === false).length;
        if (activeCategories > 0) count++;
        
        return count;
    }
}

export default new ProductFilterStore();
