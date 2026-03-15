import { type Product } from "../../../../types/product";
import Text from "components/Text";
import Button from "components/Button";
import s from './CartData.module.scss';
import { useState, useEffect, useMemo } from 'react';
import { useCartProducts } from "App/App";
import CloseIcon from 'components/icons/CloseIcon';
import { useCartAmount } from "components/Cart";

type CartDataProps = {
    product: Product,
    price: string,
    count: number
}

const CartData = ({product, count}: CartDataProps) => {
    console.log("product", product)
    const { setProductsInCart } = useCartProducts();
    const { setTotalAmounts } = useCartAmount();

    const parsePriceFromSlot = (slot: string): number => {
        console.log(slot)
        let priceValue = slot.slice(1);
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
                const { [product.id]: _, ...rest } = prev;
                return {...rest}
            })
        }
    }, [totalPrice, product.id]);

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
            <img src={`/public/products/${product.image}.png`} className={s.image}/>

            <div className={s.content}>
                <div>
                    <Text view="p-14" color="secondary" weight="bold">{product.category_name}</Text>
                    <Text view="p-20">{product.title}</Text>
                    <Text view="p-16" color="secondary" maxLines={1}>{product.subtitle}</Text>
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
