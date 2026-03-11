import s from './AuthWrapper.module.scss';
import cn from 'classnames';
import Text from 'components/Text';
import Button from 'components/Button';
import { useNavigate } from 'react-router';
import Input from 'components/Input';

type AuthWrapperProps = {
    className?: string,
    title: string,
    placeholders: string[],
    leftBtnText: string,
    rightBtnText: string
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({
    className, 
    title, 
    placeholders, 
    leftBtnText,
    rightBtnText,
}: AuthWrapperProps) => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        const route = title === "Registration" ? '/login' : '/registration';
        navigate(route);
    }

    return (
        <section className={cn(s.auth, className)}>
            <Text view="title">{title}</Text>
            <div className={s.inputs}>
                {placeholders.map((placeholder: string) =>
                     <Input placeholder={placeholder} afterSlot={<></>}/>
                )}
            </div>

            <div className={s.buttons}>
                <Button className={s.button}>{leftBtnText}</Button>
                <Button className={s['buttons--right']} white={true} onClick={handleButtonClick}>{rightBtnText}</Button>
            </div>
        </section>
    )
}

export default AuthWrapper;
