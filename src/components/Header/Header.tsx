import React, { useState, useContext} from 'react';
import UserIcon from 'components/icons/UserIcon';
import CartIcon from 'components/icons/CartIcon';
import { useNavigate } from 'react-router';
import Text from 'components/Text';
import s from './Header.module.scss';
import { useCartProducts } from 'App/App';
import Cart from 'components/Cart';
import { observer } from 'mobx-react-lite';
import userStore from 'store/UserStore';
import MenuIcon from 'components/icons/MenuIcon';
import BurgerMenu from './componenets/BurgerMenu';
import useBurgerMenu from 'hooks/useBurgerMenu.ts';

export type Link = {
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

const Header: React.FC<HeaderProps> = ({image='/logo.png', links=linksArr}: HeaderProps) => {
    const navigate = useNavigate();
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

    const { productsInCart } = useCartProducts();
    const { isOpen, close, open } = useBurgerMenu();

    const handleLinkClick = (link: Link) => {
        navigate(link.to);
    }

    const handleCartClick = () => {
        setIsCartOpen(true);
    }

    const handleUserClick = async () => {
        await userStore.restoreSession();

        if (userStore.user) {
            navigate('/user');
        } else {
            navigate('/registration');
        }
    }

    const handleLogoClick = () => {
        navigate('/products');
    }

    return (
        <CartContext.Provider value={{isCartOpen, setIsCartOpen}}>
            <div className={s.header}>
                <img src={image} className={s.header__image} onClick={handleLogoClick}/>

                <div className={s.header__links}>
                    {
                        links.map(link =>
                        <div key={link.to} onClick={() => handleLinkClick(link)} className={s.header__link}><Text 
                        view="p-18">
                            {link.description}
                        </Text></div>)
                    }
                </div>

                <div className={s.icons}>
                    <div className={s.header__icons}>
                        <CartIcon onClick={handleCartClick}/>
                        <UserIcon onClick={handleUserClick}/>
                    </div>

                    <MenuIcon onClick={open} className={s.menu}/>
                </div>

            </div>

            {isCartOpen && <Cart products={productsInCart} />}
            <BurgerMenu     onClose={close}
                            isOpen={isOpen}
                            links={links} 
                            onCartClick={handleCartClick} 
                            onUserClick={handleUserClick}
                            onLinkClick={handleLinkClick}/>
        </CartContext.Provider>
    );
}

export default observer(Header);
