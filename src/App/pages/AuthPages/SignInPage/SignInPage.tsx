import AuthWrapper, { type InputAttributes } from "../components/AuthWrapper";

const SignInPage = () => {
    const inputsAttributes: InputAttributes[] = [
        {
            text: "Email",
            type: "email",
            name: 'email'
        }, {
            text: "Password",
            type: "password",
            autoComplete: "new-password",
            name: 'password'
        }]

    return (
        <AuthWrapper 
            title="Login" 
            inputsAttributes={inputsAttributes}
            leftBtnText="Sign in"
            rightBtnText="Sign up">
        </AuthWrapper>
    );
}

export default SignInPage;
