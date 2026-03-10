import Input from "components/Input";
import Text from "components/Text";
import s from "./SignInPage.module.scss";
import Button from "components/Button";
import { useNavigate } from "react-router";

const AuthPage = () => {
    const navigate = useNavigate();

    const handleAuthClick = () => {
        navigate('/auth');
    }

    return (
        <section className={s.auth}>
            <Text view="title">Login</Text>

            <div className={s.inputs}>
                <Input placeholder="Email" afterSlot={<></>}/>
                <Input placeholder="Password" afterSlot={<></>}/>
            </div>

            <div className={s.buttons}>
                <Button className={s.button}>Sign in</Button>
                <Button className={s['buttons--right']} white={true} onClick={handleAuthClick}>Sign up</Button>
            </div>
        </section>
    );
}

export default AuthPage;