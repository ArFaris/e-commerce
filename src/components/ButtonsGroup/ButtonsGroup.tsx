import Button from "components/Button"
import s from './ButtonsGroup.module.scss';
import cn from 'classnames';

type ButtonGroupProps = {
    leftText: string, 
    rightText: string,
    onRightClick: () => void,
    className?: string,
    classNameLeft?: string,
    classNameRight?: string,
}

const ButtonsGroup = ({
    leftText, 
    rightText, 
    onRightClick, 
    className,
    classNameLeft,
    classNameRight
}: ButtonGroupProps) => {
    return (                        
        <div className={cn(s.buttons, className)}>
            <Button className={classNameLeft}>{leftText}</Button>
            <Button className={cn(s['buttons--right'], classNameRight)} white={true} onClick={onRightClick}>{rightText}</Button>
        </div>
    )
}

export default ButtonsGroup;
