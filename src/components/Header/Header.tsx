import React from 'react';
import UserIcon from 'components/icons/UserIcon';
import CartIcon from 'components/icons/CartIcon';
import { useNavigate } from 'react-router';
import Text from 'components/Text';
import s from './Header.module.scss';

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
        to: "#"
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

const Header: React.FC<HeaderProps> = ({image='public/logo.png', links=linksArr}: HeaderProps) => {
    const navigate = useNavigate();

    const handleLinkClick = (link: Link) => {
        navigate(link.to);
    }

    return (
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
                <CartIcon />
                <UserIcon />
            </div>
        </div>
    );
}

export default Header;