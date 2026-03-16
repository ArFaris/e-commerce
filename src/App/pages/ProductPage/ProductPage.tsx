import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import Text from 'components/Text';
import Button from 'components/Button';
import Card from 'components/Card';
import { useNavigate } from 'react-router';
import ArrowDownIcon from 'components/icons/ArrowDownIcon';
import styles from './ProductPage.module.scss';
import { type Product } from 'types/product';
import { useCartProducts } from 'App/App';
import type { CollectionModel } from 'shared/collection';
import ButtonsGroup from 'components/ButtonsGroup';
import supabase from 'lib/Supabase';
import uiStore from 'store/UIStore';

const ProductPage = () => {
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [cardsRecomended, setCardsRecomended] = useState<Product[] | null>(null);

    const {setProductsInCart} = useCartProducts();

    useEffect(() => {
        uiStore.setLoading(loading);
    }, [loading])

    useEffect(() => {
        if (!id) {
            setError(new Error('Id продукта не указан'));
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try 
            {
                setLoading(true);

                const { data: product, error } = await supabase
                                                            .from('products')
                                                            .select('*')
                                                            .eq('id', id)
                                                            .single();
                if (error) throw error;

                const recomended = await getCardsRandom(id);

                setProduct(product)
                setCardsRecomended(recomended);
            } catch (err) 
            {
                setError(err instanceof Error ? err : new Error('Ошибка загрузки'));
            } finally {
                setLoading(false); 
            }
        }

        fetchProduct();
    }, [id])

    const getCardsRandom = async (id: string): Promise<Product[]> => {
        try {
            const { data, error } = await supabase
                                        .from('products')
                                        .select('*');
            if (error) {
                throw error;
            }

            const newCardsRecomended: Product[] = [];

            for (const product of data) {
                if (newCardsRecomended.length >= 3) break;

                if (product.id !== id) {
                    newCardsRecomended.push(product);
                }
            }

            return newCardsRecomended;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    const handleButtonClick = () => {
        if (!product) return;
        setProductsInCart(prevCart => {
            const newCart: CollectionModel<string, {product: Product, count: number}> = {...prevCart};

            const id = product.id;
            if (newCart.entities[id]) {
                newCart.entities[id] = {product: product, count: prevCart.entities[id].count + 1};
            } else {
                newCart.order.push(id);
                newCart.entities[id] = {product: product, count: 1};
            }

            return newCart;
        })
    }

    if (error) return;
    if (!product) return;
    
    return (
        <main className={styles.page}>
            <div className={styles.back} onClick={() => navigate('/products')}>
                <ArrowDownIcon width={32} height={32} className={styles.back__icon}/>
                <Text view="p-20">Назад</Text>
            </div>

            <section className={styles.product}>
                <div className={styles['product__image-wrapper']}>
                    <img src={`/public/products/${product.image}.png`}/>
                </div>

                <div className={styles.product__content}>
                    <div className={styles.product__description}>
                        <Text view="title">{product.title}</Text>
                        <Text view="p-20" color="secondary">{product.subtitle}</Text>
                    </div>

                    <div className={styles.actions}>
                        <Text view="title">{product.price}</Text>
                        <ButtonsGroup className={styles.buttons} leftText="Buy Now" rightText="Add to Card" onRightClick={handleButtonClick}/>
                    </div>
                </div>
            </section>

            <section>
                <Text view="title">Related Items</Text>

                <div className={styles.products}>
                    {
                        cardsRecomended?.map(product => 
                                <Card 
                                image={`/public/products/${product.image}.png`}
                                captionSlot={<>{product.category_name}</>}
                                title={<>{product.title}</>}
                                subtitle={<>{product.subtitle}</>}
                                contentSlot={<>{product.price}</>}
                                onClick={() => navigate(`/products/${product.id}`)}
                                actionSlot={<Button style={{width: '155px'}}>Add to Cart</Button>}
                            />)
                    }
                </div>
            </section>
        </main>
    );
}

export default ProductPage;
