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

const ProductsPage = () => {
    const [searchText, setSearchText] = useState('');
    const [products, setProducts] = useState<Product[] | []>([]);
    const [currentProducts, setCurrentProducts] = useState<Product[] | []>([]);
    const [options, setOptions] = useState<Option[] | []>([]);
    const [currentOptions, setCurrentOptions] = useState<Option[] | []>([]);

    useEffect(() => {
        api.get('/products')
            .then(response => {
                setProducts(response.data);
                setCurrentProducts(response.data);
            })
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        if (options.length > 0) return;

        const newOptions: Option[] = [];
        for (let product of products) {
            newOptions.push({value: product.title, key: product.id})
        }
        console.log('newOptions', newOptions)
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

    const navigate = useNavigate();

    return (
        <main className={styles.page}>
            <div className={styles.title}>
                <Text view="title">Products</Text>
                <Text view="p-20" color="secondary">We display products based on the latest products we have, if you want to see our old products please enter the name of the item</Text>
            </div>

            <div className={styles.active}>
                <div>
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
                        actionSlot={<Button style={{width: '155px'}}>Add to Cart</Button>}/>)
                }
            </div>
        </main>
    );
};

export default ProductsPage;
