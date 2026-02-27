import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import Text from 'components/Text';
import Button from 'components/Button';
import Card from 'components/Card';
import { useNavigate } from 'react-router';
import ArrowDownIcon from 'components/icons/ArrowDownIcon';
import cn from 'classnames';
import styles from './ProductPage.module.scss';
import api from '../../../api/config';
import { type Product } from '../../../types/product';


const ProductPage = () => {
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [cardsRecomended, setCardsRecomended] = useState<Product[] | null>(null);

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

                const [productResponse, recomended] = await Promise.all([api.get(`/products/${id}`), getCardsRandom(id)]);

                setProduct(productResponse.data)
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
            const response = await api.get('/products');
            const newCardsRecomended: Product[] = [];

            for (const product of response.data) {
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

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error.message}</div>;
    if (!product) return <div>Продукт не найден</div>;
    
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

                    <div>
                        <Text view="title">{product.contentSlot}</Text>

                        <div className={styles.product__buttons}>
                            <Button>Buy Now</Button>
                            <Button className={cn(styles['product__buttons--right'])} white={true}>Add to Card</Button>
                        </div>
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
                                captionSlot={<>{product.captionSlot}</>}
                                title={<>{product.title}</>}
                                subtitle={<>{product.subtitle}</>}
                                contentSlot={<>{product.contentSlot}</>}
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