import { type Product } from "../../../../types/product";
import Text from "components/Text";
import Button from "components/Button";
import s from './CartData.module.scss';
import { useState, useEffect, useMemo } from 'react';
import { useCartProducts } from "App/App";
import CloseIcon from 'components/icons/CloseIcon';
import { useCartAmount } from "components/Cart";
import type { CollectionModel } from "shared/collection";

type CartDataProps = {
    product: Product,
    price: string,
    count: number,
    id: string
}

const CartData = ({product, count, id}: CartDataProps) => {
    const { setProductsInCart } = useCartProducts();
    const { setTotalAmounts } = useCartAmount();

    const parsePriceFromSlot = (slot: string): number => {
        const priceValue = slot.slice(1);
        return Number(priceValue);
    }

    const defaultPrice = useMemo(() => parsePriceFromSlot(product.price), [product.price]);
    const [currentCount, setCurrentCount] = useState(count);
    const [disableBtn, setDisableBtn] = useState<boolean>(count === 1 ? true : false);

    const totalPrice = useMemo(() => {
        return Number((currentCount * defaultPrice).toFixed(2))
    }, [currentCount, defaultPrice]);

    useEffect(() => {
        setTotalAmounts(prev => ({
            ...prev,
            [product.id]: totalPrice
        }))

        return () => {
            setTotalAmounts(prev => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [product.id]: _, ...rest } = prev;
                return {...rest}
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalPrice, product.id]);

    useEffect(() => {
        setProductsInCart(prevCart => {
            const newCart: CollectionModel<string, {product: Product, count: number}> = {...prevCart};

            newCart.entities[id] = {product: product, count: currentCount};

            return newCart;
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCount])

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => 
    {
        if (e.currentTarget.textContent === '+') {
            setCurrentCount(prev => prev + 1);
            if (disableBtn) {
                setDisableBtn(false);
            }
        } else {
            if (currentCount === 2) {
                setDisableBtn(true);
            }
            setCurrentCount(prev => prev - 1);
        }
    }

    const handleCloseClick = (product: Product) => {
        setProductsInCart(prevCart => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [product.id]: removedItem, ...otherItems } = prevCart.entities;

            return {
                order: prevCart.order.filter(id => id !== product.id),
                entities: otherItems
            }
        });
    }

    return (
        <article className={s.data}>
            <CloseIcon className={s.icon} color="secondary" onClick={() => handleCloseClick(product)}/>
            <img src={`/products/${product.image}.png`} className={s.image}/>

            <div className={s.content}>
                <div>
                    <Text view="p-14" color="secondary" weight="bold">{product.category_name}</Text>
                    <Text view="p-20">{product.title}</Text>
                    <Text view="p-16" color="secondary" maxLines={1} className={s.subtitle}>{product.subtitle}</Text>
                </div>

                <div className={s.actions}>
                    <Button key="+" disabled={disableBtn} className={s["actions__button"]} onClick={(e) => handleButtonClick(e)}>-</Button>
                    <Text view="p-14">{`$${(defaultPrice * currentCount).toFixed(2)}`}</Text>
                    <Button key="-" className={s["actions__button"]} onClick={(e) => handleButtonClick(e)}>+</Button>
                    <Text view="p-14">{`${currentCount} lot`}</Text>
                </div>
            </div>
        </article>
    )
}

export default CartData;
