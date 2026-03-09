import Text from 'components/Text';
import styles from './ProductsPage.module.scss';
import React from 'react';
import ProductsContainer from 'components/ProductsContainer';
import ProductFilter from 'components/ProductFilter';

const ProductsPage: React.FC = () => {

    return (
        <main className={styles.page}>
            <div className={styles.page__title}>
                <Text view="title">Products</Text>
                <Text view="p-20" color="secondary">We display products based on the latest products we have, if you want to see our old products please enter the name of the item</Text>
            </div>

            <ProductFilter />
            <ProductsContainer />
        </main>
    );
};

export default ProductsPage;
