import Button from "components/Button"
import s from './ButtonsGroup.module.scss';
import cn from 'classnames';

type ButtonGroupProps = {
    leftText: string, 
    rightText: string,
    onRightClick: () => void,
    onLeftClick?: () => void,
    className?: string,
    classNameLeft?: string,
    classNameRight?: string,
    form?: boolean
}

const ButtonsGroup = ({
    leftText, 
    rightText, 
    onRightClick, 
    onLeftClick,
    className,
    classNameLeft,
    classNameRight,
    form
}: ButtonGroupProps) => {
    return (                        
        <div className={cn(s.buttons, className)}>
            <Button className={classNameLeft} type={form ? "submit" : "button"} onClick={onLeftClick}>{leftText}</Button>
            <Button className={cn(s['buttons--right'], classNameRight)} white={true} onClick={onRightClick}>{rightText}</Button>
        </div>
    )
}

export default ButtonsGroup;
