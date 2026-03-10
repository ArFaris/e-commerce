import Input from "components/Input";
import Text from "components/Text";
import s from "./AuthPage.module.scss";
import Button from "components/Button";
import { useNavigate } from "react-router";

const AuthPage = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    }

    return (
        <section className={s.auth}>
            <Text view="title">Registration</Text>

            <div className={s.inputs}>
                <Input placeholder="First Name" afterSlot={<></>}/>
                <Input placeholder="Last name" afterSlot={<></>}/>
                <Input placeholder="Email" afterSlot={<></>}/>
                <Input placeholder="Password" afterSlot={<></>}/>
                <Input placeholder="Repeat password" afterSlot={<></>}/>
            </div>

            <div className={s.buttons}>
                <Button className={s.button}>Sign up</Button>
                <Button className={s['buttons--right']} white={true} onClick={handleLoginClick}>Sign in</Button>
            </div>
        </section>
    );
}

export default AuthPage;