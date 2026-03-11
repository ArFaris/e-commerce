import AuthWrapper from "../components/AuthWrapper";

const SignInPage = () => {
    const placeholders = ["Email", "Password"]

    return (
        <AuthWrapper 
            title="Login" 
            placeholders={placeholders}
            leftBtnText="Sign in"
            rightBtnText="Sign up">
        </AuthWrapper>
    );
}

export default SignInPage;
