import Text from 'components/Text';
import Button from 'components/Button';
import Input from 'components/Input';
import Card from 'components/Card';
import { useNavigate } from 'react-router';
import styles from './ProductsPage.module.scss';
import { useState, useEffect } from 'react';
import MultiDropdown from 'components/MultiDropdown';
import { type Option } from 'components/MultiDropdown';
import api from '../../../api/config';
import { type Product } from '../../../types/product';
import {  type CollectionModel, getInitialCollectionModel, normalizeCollection } from '../../../shared/collection';
import React from 'react';
import { useCartProducts } from 'App/App';

type ProductsPageProps = {
    pageTitle?: string, 
    pageSubtitle?: string,
    filterCategory?: string
}

const ProductsPage: React.FC<ProductsPageProps> = ({pageTitle="Products", 
                       pageSubtitle="We display products based on the latest products we have, if you want to see our old products please enter the name of the item",
                       filterCategory
                    }: ProductsPageProps) => {

    const [searchText, setSearchText] = useState('');
    const [products, setProducts] = useState<Product[] | []>([]);
    const [currentProducts, setCurrentProducts] = useState<Product[] | []>([]);
    const [options, setOptions] = useState<Option[] | []>([]);
    const [currentOptions, setCurrentOptions] = useState<Option[] | []>([]);
    const [productsCollection, setProductsCollection] = useState<CollectionModel<string, Product>>(getInitialCollectionModel());

    const {productsInCart, setProductsInCart} = useCartProducts();

    useEffect(() => {
        api.get('/products')
            .then(response => {
                if (filterCategory) {
                    const filteredProducts = response.data.filter((item: Product) => item.captionSlot.toLocaleLowerCase() === filterCategory.toLocaleLowerCase());
                    setProducts(filteredProducts);
                    setCurrentProducts(filteredProducts);
                } else {
                    setProducts(response.data);
                    setCurrentProducts(response.data);
                }
            })
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        if (!Array.isArray(products) || options.length > 0) return;

        const newOptions: Option[] = [];
        for (let product of products) {
            newOptions.push({value: product.title, key: product.id})
        }
        
        setProductsCollection(normalizeCollection<string, Product>(products, (product: Product) => product.id));
        console.log(productsCollection)
        setOptions(newOptions);
    }, [products]);

    const handleInputChange = (currentValue: string) => {
        setSearchText(currentValue);
    }

    const handleMultiDropdownChange = (selectedOptions: Option[]) => {
        setCurrentOptions(selectedOptions);

        if (selectedOptions.length === 0) {
            api.get('/products')
                .then(response => setCurrentProducts(response.data));
        } else {
            const filtered = products.filter(product =>
                selectedOptions.some(option => option.key === product.id)
            );

            setCurrentProducts(filtered);
        }
    }

    const getTitle = (options: Option[]): string => {
        if (options.length === 0) return "Filter";

        const title: string = options.map(option => option.value).join(', ');
        return title;
    }

    const handlerButtonClick = () => {
        if (searchText.trim() === '') return;

        const str = searchText.toLocaleLowerCase();
        const filtered = products.filter(product => 
            product.title.toLocaleLowerCase().indexOf(str) === 0
        );
        setCurrentProducts(filtered);
    }

    useEffect(() => {
        if (searchText.trim() === '') {
            setCurrentProducts(products);
        }
    }, [searchText])

    const handlerButtonToCartClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        if (!e.currentTarget.parentElement) {
            return;
        }
        e.stopPropagation();
        console.log(productsInCart)
        setProductsInCart(prevCart => {
            const newCart: CollectionModel<string, {product: Product, count: number}> = {...prevCart};

            if (newCart.entities[id]) {
                newCart.entities[id] = {product: productsCollection.entities[id], count: prevCart.entities[id].count + 1};
            } else {
                newCart.order.push(id);
                newCart.entities[id] = {product: productsCollection.entities[id], count: 1};
            }

            return newCart;
        })
    };

    const navigate = useNavigate();

    return (
        <main className={styles.page}>
            <div className={styles.title}>
                <Text view="title">{pageTitle}</Text>
                <Text view="p-20" color="secondary">{pageSubtitle}</Text>
            </div>

            <div className={styles.active}>
                <div className={styles.input}>
                    <Input value={searchText} placeholder="Search Product" onChange={handleInputChange} afterSlot={<></>}/>
                    <Button onClick={handlerButtonClick}>Find now</Button>
                </div>

                <MultiDropdown options={options} onChange={(e) => handleMultiDropdownChange(e)} getTitle={(options: Option[]) => getTitle(options)} value={currentOptions}/>
            </div>

            <div className={styles.subtitle}>
                <Text view="subtitle">Total products</Text>
                <Text view="p-20" color="accent">184</Text>
            </div>

            <div className={styles.products}>
                {
                    currentProducts.map(product =>
                        <Card 
                        key={product.id}
                        className={styles.product}
                        image={`/public/products/${product.image}.png`}
                        captionSlot={<>{product.captionSlot}</>}
                        title={<>{product.title}</>}
                        subtitle={<>{product.subtitle}</>}
                        contentSlot={<>{product.contentSlot}</>}
                        onClick={() => navigate(`/products/${product.id}`)}
                        actionSlot={<Button style={{width: '155px'}} onClick={(e) => handlerButtonToCartClick(e, product.id)}>Add to Cart</Button>}/>)
                }
            </div>
        </main>
    );
};

export default ProductsPage;
