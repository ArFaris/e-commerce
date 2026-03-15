import AuthWrapper, { type InputAttributes } from "../components/AuthWrapper";

const SignUpPage = () => {
    const inputsAttributes: InputAttributes[] = [
        {
            text: "First Name",
            type: "text",
            name: 'firstName'
        }, {
            text: "Last name", 
            type: "text",
            name: 'lastName'
        }, {
            text: "Email", 
            type: "email",
            name: 'email'
        }, {
            text: "Password", 
            type: "password",
            autoComplete: "new-password",
            name: 'password'
        }, {
            text: "Repeat password",
            type: "password",
            name: 'copyPassword'
        }];

    return (
        <AuthWrapper 
            title="Registration" 
            inputsAttributes={inputsAttributes}
            leftBtnText="Sign up"
            rightBtnText="Sign in">
        </AuthWrapper>
    );
}

export default SignUpPage;
