import Text from 'components/Text';
import Button from 'components/Button';
import Card from 'components/Card';
import { useNavigate } from 'react-router';
import styles from './ProductsContainer.module.scss';
import { useEffect } from 'react';
import { type Product } from 'types/product';
import { observer } from "mobx-react-lite";
import {  type CollectionModel } from 'shared/collection';
import React from 'react';
import { useCartProducts } from 'App/App';
import ProductsStore from 'store/ProductsStore';

type ProductContainerProps = {
    category?: string;
}

const ProductContainer: React.FC<ProductContainerProps> = ({category}: ProductContainerProps) => {
    const { setProductsInCart } = useCartProducts();

    useEffect(() => {
        const loadData = async () => {
            await ProductsStore.loadProducts(category);
            await ProductsStore.loadOptions();
        };
        
        loadData();
    }, [category]);

    const handlerButtonToCartClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        if (!e.currentTarget.parentElement) {
            return;
        }
        e.stopPropagation();
        setProductsInCart(prevCart => {
            const newCart: CollectionModel<string, {product: Product, count: number}> = {...prevCart};

            if (newCart.entities[id]) {
                newCart.entities[id] = {product: ProductsStore.productsCollection.entities[id], count: prevCart.entities[id].count + 1};
            } else {
                newCart.order.push(id);
                newCart.entities[id] = {product: ProductsStore.productsCollection.entities[id], count: 1};
            }

            return newCart;
        })
    };

    const navigate = useNavigate();

    return (
        <>
            <div className={styles.subtitle}>
                <Text view="subtitle">Total products</Text>
                <Text view="p-20" color="accent">{ProductsStore.count}</Text>
            </div>

            <div className={styles.products}>
                {
                    ProductsStore.filteredProducts.map(product =>
                        <Card 
                        key={product.id}
                        className={styles.product}
                        image={`/products/${product.image}.png`}
                        captionSlot={<>{product.category_name}</>}
                        title={<>{product.title}</>}
                        subtitle={<>{product.subtitle}</>}
                        contentSlot={<>{product.price}</>}
                        onClick={() => navigate(`/products/${product.id}`)}
                        actionSlot={<Button style={{width: '155px'}} 
                        onClick={(e) => handlerButtonToCartClick(e, product.id)}>Add to Cart</Button>}/>)
                }
            </div>
        </>
    );
}

export default observer(ProductContainer);
