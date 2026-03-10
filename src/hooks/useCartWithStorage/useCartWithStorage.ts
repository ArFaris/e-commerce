import type { CartProductsContextType } from "App/App";
import { useEffect, useState } from "react";
import type { CollectionModel } from "shared/collection";
import { getInitialCollectionModel } from "shared/collection";
import type { Product } from "types/product";

const useCartWithStorage = (): CartProductsContextType => {
    const [productsInCart, setProductsInCart] = useState<CollectionModel<string, {product: Product, count: number}>>(getInitialCollectionModel());

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');

        if (savedCart) {
            setProductsInCart(JSON.parse(savedCart));
        }
    }, []);
    
    useEffect(() => {
        if (productsInCart) {
            localStorage.setItem('cart', JSON.stringify(productsInCart));
        }
    }, [productsInCart]);

    return {productsInCart, setProductsInCart};
}

export default useCartWithStorage;
