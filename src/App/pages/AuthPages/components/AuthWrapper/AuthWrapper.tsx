import s from './AuthWrapper.module.scss';
import cn from 'classnames';
import Text from 'components/Text';
import { useNavigate } from 'react-router';
import Input from 'components/Input';
import ButtonsGroup from 'components/ButtonsGroup';
import userStore from 'store/UserStore';
import { observer } from 'mobx-react-lite';
import type { UserCreate } from 'types/user';
import { ZodError } from 'zod';
import { useState } from 'react';
import { UserShema } from 'shared/schemas/user.schema';
import { validation } from 'shared/utils/validation-error';

export type InputAttributes = {
    text: string,
    type: string,
    autoComplete?: string,
    name: string
}

type AuthWrapperProps = {
    className?: string,
    title: string,
    inputsAttributes: InputAttributes[],
    leftBtnText: string,
    rightBtnText: string
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({
    className, 
    title, 
    inputsAttributes, 
    leftBtnText,
    rightBtnText
}: AuthWrapperProps) => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleButtonClick = () => {
        const route = title === "Registration" ? '/login' : '/registration';
        navigate(route);
    }

    const signUser = async (e: React.SubmitEvent<HTMLFormElement>, requestType: string) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData(e.currentTarget);
        console.log('type')
        console.log(requestType)

        console.log('inner first name')
        console.log(formData.get('firstName')?.toString())

        console.log('isLogin')
        console.log(requestType === 'login' ? 'nullName' : '')

        console.log('isLogin2')
        console.log(requestType === 'login')

        console.log('final')
        console.log(formData.get('lastName')?.toString() ?? requestType === 'login' ? 'nullName' : '')

        const user: UserCreate = {
            email: formData.get('email')?.toString() || '',
            password: formData.get('password')?.toString() || '',
            firstName: formData.get('firstName')?.toString() ?? (requestType === 'login' ? 'nullName' : ''),
            lastName: formData.get('lastName')?.toString() ?? (requestType === 'login' ? 'nullName' : ''),
        }

        try {
            UserShema.partial().parse(user);
        } catch(error) {
            if (error instanceof ZodError) {
                const fieldErrors = validation(error);
                setErrors(fieldErrors);
                return;
            }
        }

        if (requestType === 'registration') {
            if (user.password !== formData.get('copyPassword')) {
                setErrors({'password': 'Passwords must match', 'copyPassword': 'Passwords must match'});
                return;
            };       
            
            try {
                await userStore.register(user);
                navigate('/user');
            } catch(error) {
                console.error(error);
            }
        } else {
            console.log('login')
            try {
                await userStore.login(user.email, user.password);
                navigate('/user');
                if (userStore.error) {
                    throw userStore.error;
                }
            } catch(error) {
                console.error(error);
                setErrors({'userNotFound': 'Account not found'});
            }
        }
    }

    const handleInputSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        if (title.toLocaleLowerCase() === 'registration') {
            await signUser(e, 'registration');
        } else {
            await signUser(e, 'login');
        }
    }

    return (
        <form onSubmit={(e) => handleInputSubmit(e)} className={cn(s.auth, className)}>
            <Text view="title">{title}</Text>
            <div className={s.inputs}>
                {inputsAttributes.map(attributes => (
                    <div key={attributes.name} className={s.inputBox}>
                        <Input name={attributes.name} 
                                autoComplete={attributes.autoComplete} 
                                placeholder={attributes.text} 
                                type={attributes.type} 
                                afterSlot={<></>}
                                required
                                error={!!errors[attributes.name]}
                        />
                        {errors[attributes.name] && <Text className={s['text-error']} view="p-14">{errors[attributes.name]}</Text>}
                    </div>
                ))}
                {errors['userNotFound'] && <Text className={s['text-error']} view="p-14">{errors['userNotFound']}</Text>}
            </div>

            <ButtonsGroup 
                leftText={leftBtnText} 
                rightText={rightBtnText}
                onRightClick={handleButtonClick}
                className={s.button}
                classNameRight={s.button}
                classNameLeft={s.button}
                form={true}
            />
        </form>
    )
}

export default observer(AuthWrapper);
