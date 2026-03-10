import React, { useState, useContext} from 'react';
import UserIcon from 'components/icons/UserIcon';
import CartIcon from 'components/icons/CartIcon';
import { useNavigate } from 'react-router';
import Text from 'components/Text';
import s from './Header.module.scss';
import { useCartProducts } from 'App/App';
import Cart from 'components/Cart';

type Link = {
    description: string,
    to: string
}

const linksArr: Link[] = [
    {
        description: "Products",
        to: "/products"
    },
    {
        description: "Categories",
        to: "/categories"
    },
    {
        description: "About us",
        to: "#"
    }
]

type HeaderProps = {
    image?: string,
    links?: Link[]
}

export type CartContextType = {
    isCartOpen: boolean, 
    setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const CartContext = React.createContext<CartContextType | undefined>(undefined);

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCartContext must be used within CartContext.Provider');
    }
    return context;
}

const Header: React.FC<HeaderProps> = ({image='/public/logo.png', links=linksArr}: HeaderProps) => {
    console.log('Header рендерится!', new Date().toISOString());
    const navigate = useNavigate();
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
    const { productsInCart } = useCartProducts();

    const handleLinkClick = (link: Link) => {
        navigate(link.to);
    }

    const handleCartClick = () => {
        setIsCartOpen(true);
    }

    const handleUserClick = () => {
        navigate('/auth');
    }

    return (
        <CartContext.Provider value={{isCartOpen, setIsCartOpen}}>
            <div className={s.header}>
                <img src={image}/>

                <div className={s.header__links}>
                    {
                        links.map(link =>
                        <div onClick={() => handleLinkClick(link)} className={s.header__link}><Text 
                        view="p-18">
                            {link.description}
                        </Text></div>)
                    }
                </div>

                <div className={s.header__icons}>
                    <CartIcon onClick={handleCartClick}/>
                    <UserIcon onClick={handleUserClick}/>
                </div>
            </div>

            {isCartOpen && <Cart products={productsInCart} />}
        </CartContext.Provider>
    );
}

export default Header;
