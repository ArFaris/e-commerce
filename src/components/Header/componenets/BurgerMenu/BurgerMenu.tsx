import s from './BurgerMenu.module.scss';
import cn from 'classnames';
import type { Link } from '../../Header';
import Text from 'components/Text';
import { useEffect } from 'react';
import UserIcon from 'components/icons/UserIcon';
import CartIcon from 'components/icons/CartIcon';
import { createPortal } from 'react-dom';
import CloseIcon from 'components/icons/CloseIcon';

type BurgerMenuProps = {
    isOpen: boolean,
    onClose: () => void;
    links: Link[],
    onCartClick: () => void,
    onUserClick: () => void,
    onLinkClick: (link: Link) => void,
    className?: string
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({
    isOpen,
    onClose,
    links, 
    onCartClick, 
    onUserClick, 
    onLinkClick,
    className}: 
BurgerMenuProps) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        }

        let resizeTimer: number;
        const handleResize = () => {
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }

            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 1024) {
                    onClose();
                }
            }, 150);
        }

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscape);
            window.addEventListener('resize', handleResize);
        }

        return () => {
            document.body.style.overflow = 'auto';
            document.removeEventListener('keydown', handleEscape);
            window.removeEventListener('resize', handleResize);

            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }
        }
    }, [isOpen, onClose]);

    return createPortal(
        <div className={cn(s.menu, className, isOpen ? s.open : s.close)}>
            <CloseIcon className={cn(s['close-icon'], s.icon)} color="accent" onClick={onClose}/>
            <Text view='title'>Menu</Text>

            <div className={s.icons}>
                <CartIcon onClick={() => { onClose(); onCartClick()}}/>
                <UserIcon onClick={() => { onClose(); onUserClick()}}/>
            </div>

            <nav>
                {
                    links.map(link =>
                    <div key={link.to} onClick={() => { onClose(); onLinkClick(link)}} className={s.link}>
                        <Text view="subtitle">{link.description}</Text>
                    </div>)
                }
            </nav>
        </div>,
        document.body
    );
}

export default BurgerMenu;
