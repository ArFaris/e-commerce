import { action, computed, makeObservable, observable, runInAction } from "mobx";
import type { Product } from "types/product";
import { type Option } from 'components/MultiDropdown';
import { getInitialCollectionModel, normalizeCollection } from "shared/collection";
import type { CollectionModel } from "shared/collection";
import api from "api/config";

type PrivateFields = '_filteredProducts' | '_allProducts' | '_isLoading' | '_error' | '_logError' | '_options' | '_productsCollection' | '_selectedOptions';

class ProductsStore {
    private _filteredProducts: Product[] = [];
    private _allProducts: Product[] = [];
    private _isLoading: boolean = false;
    private _error: string | null = null;
    private _options: Option[] = [];
    private _selectedOptions: Option[] = [];
    private _productsCollection: CollectionModel<string, Product> = getInitialCollectionModel();

    constructor() {
        makeObservable<ProductsStore, PrivateFields>(this, {
            _allProducts: observable,
            _filteredProducts: observable,
            _isLoading: observable,
            _error: observable,
            _options: observable,
            _selectedOptions: observable,
            _productsCollection: observable,
            
            products: computed,
            filteredProducts: computed,
            options: computed,
            isLoading: computed,
            error: computed,
            count: computed,
            productsCollection: computed,
            
            loadProducts: action.bound,
            filterByName: action.bound,
            filterByOptions: action.bound,
            resetFilter: action.bound,
            _logError: action.bound
        });
    }

    async loadProducts(category?: string) {
        if (this._isLoading) {
            return;
        }

        this._isLoading = true;
        this._error = null;

        try {
            const response = await api.get('/products');

            runInAction(() => {
                this._isLoading = false;
                if (category) {
                    this._allProducts = response.data.filter((item: Product) => item.captionSlot.toLocaleLowerCase() === category.toLocaleLowerCase());
                } else {
                    this._allProducts = response.data;
                }

                this._filteredProducts = [...this._allProducts];
            });
        } catch(error) {
            runInAction(() => {
                this._isLoading = false;

                if (error instanceof Error) this._error = error.message;
                this._logError();
            });
        }
    }

    async loadOptions() {
        if (this._allProducts.length === 0) {
            await this.loadProducts();
        }

        this._options = [];
        for (let product of this._allProducts) {
            this._options.push({value: product.title, key: product.id})
        }
        
        this._productsCollection = normalizeCollection<string, Product>(this._allProducts, (product: Product) => product.id);
    }

    resetFilter() {
        this._filteredProducts = [...this._allProducts];
    }
 
    filterByName(inputStr: string) {
        this._filteredProducts = this._allProducts.filter(item => item.title.toLocaleLowerCase().indexOf(inputStr) === 0);
    }

    filterByOptions() {
        this._filteredProducts = this._allProducts.filter(item => this._selectedOptions.some(option => option.key === item.id));
    }

    private _logError() {
        if (this._error) {
            console.error('Product loading failed', this._error);
        }
    }

    get products(): Product[] {
        return this._allProducts;
    }

    get filteredProducts(): Product[] {
        return this._filteredProducts;
    }

    get options(): Option[] {
        return this._options;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    get error(): string | null {
        return this._error;
    }

    get count(): number {
        return this._filteredProducts.length;
    }

    get productsCollection(): CollectionModel<string, Product> {
        return this._productsCollection;
    }

    get selectedOptions(): Option[] {
        return this._selectedOptions;
    }

    setFilteredProducts(products: Product[]) {
        this._filteredProducts = products;
    }

    setAllProducts(products: Product[]) {
        this._allProducts = products;
    }

    setCurrentOptions(options: Option[]) {
        this._selectedOptions = options;
    }
}

export default new ProductsStore();
