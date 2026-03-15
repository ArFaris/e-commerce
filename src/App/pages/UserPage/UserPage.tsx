import Text from 'components/Text';
import s from './UserPage.module.scss';
import userStore from 'store/UserStore';
import ButtonsGroup from 'components/ButtonsGroup';
import cn from 'classnames';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import Input from 'components/Input';
import { observer } from 'mobx-react-lite';
import { UserShema } from 'shared/schemas/user.schema';
import { ZodError } from 'zod';
import { validation } from 'shared/utils/validation-error';

interface InputsState {
    firstName?: string;
    lastName?: string;
    email?: string;
}

const UserPage: React.FC = () => {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [inputs, setInputs] = useState<Record<string, string | undefined>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const logout = () => {
        try {
            userStore.logout();
            navigate('/products');
        } catch(error) {
            console.log(error);
        }
    }

    const deleteUser = () => {
        try {
            const id = userStore.user?.id || null;
            if (!id) throw new Error('id not found');

            userStore.deleteUser(id);
            navigate('/products');
        } catch(error) {
            console.log(error);
        }
    }

    const edit = () => {
        setEditMode(true);
    }

    const saveChanges = async () => {
        try {
            UserShema.partial().parse(inputs);
        } catch(error) {
            if (error instanceof ZodError) {
                const fieldErrors = validation(error);
                setErrors(fieldErrors);
                return;
            }
        }

        setErrors({});
        
        try {
            const id = userStore.user?.id || null;
            if (!id) throw new Error('id not found');

            await userStore.updateUser(id, inputs);
        } catch(error) {
            console.log(error);
        }

        setEditMode(false);
    }

    useEffect(() => {
        const restoreSession = async () => {
            try {
                await userStore.restoreSession();
                setInputs({'firstName': userStore.user?.firstName, 'lastName': userStore.user?.lastName, 'email': userStore.user?.email}); 
            } catch(error) {
                console.log(error);
            };
        }

        restoreSession();
    }, []);

    const user = userStore.user;
    const userInfo: Record<string, { title: string, data: string }> = { 'firstName': { title: 'First Name:', data: user?.firstName || ''}, 
                                                                        'lastName': { title: 'Last Name:', data: user?.lastName || ''}, 
                                                                        'email': { title: 'Email:', data: user?.email || ''}};

    const handleInputChange = (label: string, newValue: string) => {
        setInputs(prev => ({
                ...prev,
                [label]: newValue,
        }));
    }

    return (
        <>
            <main className={cn(s.page, s.profile)}>
                <Text className={s.title} view='title'>Profile</Text>

                <div className={cn(s.info, editMode && s['info-edit'])}>
                    {
                        Object.entries(userInfo).map(([label, info]) => (
                            <div key={label}>
                                <Text view='subtitle' className={cn(s.text, editMode && s['text-edit'])}>{info.title}
                                    {!editMode && <span className={s.props}>{info.data}</span>}
                                        {editMode && 
                                            <Input  placeholder={info.title} 
                                                    value={inputs[label]}
                                                    editmode={true}
                                                    afterSlot={<></>}
                                                    onChange={(newValue) => handleInputChange(label, newValue)}
                                                    error={!!errors[label]}
                                        />}
                                </Text>
                                {errors[label] && <Text className={cn(s['text-error'], s.error)} view="p-14">{errors[label]}</Text>}
                            </div>
                        ))
                    }
                </div>

                <ButtonsGroup leftText={editMode ? 'Save changes' : 'Edit Profile'} 
                            rightText='Log out of your profile'
                            onLeftClick={!editMode ? () => edit() : () => saveChanges()} 
                            onRightClick={logout}/>

                <Text className={s.delete} view='button' onClick={deleteUser}>Delete profile</Text>
            </main>
        </>
    );
};

export default observer(UserPage);
