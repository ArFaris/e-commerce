import AuthWrapper from "../components/AuthWrapper";

const SignUpPage = () => {
    const placeholders = ["First Name", "Last name", "Email", "Password", "Repeat password"]

    return (
        <AuthWrapper 
            title="Registration" 
            placeholders={placeholders}
            leftBtnText="Sign up"
            rightBtnText="Sign in">
        </AuthWrapper>
    );
}

export default SignUpPage;
