import { type Product } from '../../types/product';
import CartData from './components/CartData';
import s from './Cart.module.scss';
import cn from 'classnames';
import Text from 'components/Text';
import {  type CollectionModel } from '../../shared/collection';
import { useState, useCallback, useEffect, useContext } from 'react';
import Button from 'components/Button';
import CloseIcon from 'components/icons/CloseIcon';
import { useCartContext } from 'components/Header';
import React from 'react';
import { useNavigate } from 'react-router';

type CartProps = {
    products?: CollectionModel<string, { product: Product; count: number; }>,
    className?: string
}

export type CartAmountContextType = {
    totalAmounts: Record<string, number>, 
    setTotalAmounts: React.Dispatch<React.SetStateAction<Record<string, number>>>
}

export const CartAmountContext = React.createContext<CartAmountContextType | undefined>(undefined);

export const useCartAmount = () => {
    const context = useContext(CartAmountContext);
    if (!context) {
        throw new Error('useCartAmount must be used within CartAmountContext.Provider');
    }
    return context;
}

const Cart = ({products, className}: CartProps) => {
    const [totalAmounts, setTotalAmounts] = useState<Record<string, number>>({});
    const [finalSum, setFinalSum] = useState<string>('$0');

    const {isCartOpen, setIsCartOpen} = useCartContext();

    const navigate = useNavigate();

    const handleCartClick = useCallback(() => {
        document.body.style.overflow = 'unset';
        setIsCartOpen(false);
    }, []);

    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset'
        };
    }, [isCartOpen]);

    useEffect(() => {
        if (totalAmounts.length !== 0) {
            const amounts = Object.values(totalAmounts);
            setFinalSum(`$${(amounts.reduce((acc, currSum) => acc + currSum, 0)).toFixed(2)}`);
        }
    }, [totalAmounts])

    const handleOrderClick = () => {
        handleCartClick();
    }

    return (
        <> 
            {isCartOpen && (
                <CartAmountContext.Provider value={{totalAmounts, setTotalAmounts}}>
                    <div className={s.cart__overlay} onClick={handleCartClick}></div>
                    <div className={cn(s.cart, className)}>
                        <CloseIcon className={s.icon} color="accent" onClick={handleCartClick}/>
                        <Text view="title" className={s.cart__text}>Cart</Text>
                        <div className={s.cart__data}>
                            {
                                products?.order.map((id) => <CartData key={id} count={products.entities[id].count} product={products.entities[id].product} 
                                price={products.entities[id].product.contentSlot}/>)
                            }
                        </div>
                        <Text view="subtitle">{`Total amount: ${finalSum}`}</Text>
                        <Button className={s.cart__button} onClick={handleOrderClick}>Place an order</Button>
                    </div>
                </CartAmountContext.Provider>
            )}
        </>
    );
}

export default Cart;
