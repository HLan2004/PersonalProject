
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {login, saveToken, isAuthenticated, removeToken, validateToken} from "../service/auth";
import activityTracker from "../service/activityTracker";

// Styled Components (keeping all your existing styles)
const PageWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f6f5f7;
`;

const Container = styled.div`
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    position: relative;
    overflow: hidden;
    width: 768px;
    max-width: 100%;
    min-height: 480px;

    &.right-panel-active .sign-in-container {
        transform: translateX(100%);
    }

    &.right-panel-active .sign-up-container {
        transform: translateX(100%);
        opacity: 1;
        z-index: 5;
        animation: show 0.6s;
    }

    &.right-panel-active .overlay-container {
        transform: translateX(-100%);
    }

    &.right-panel-active .overlay {
        transform: translateX(50%);
    }

    &.right-panel-active .overlay-left {
        transform: translateX(0);
    }

    &.right-panel-active .overlay-right {
        transform: translateX(20px);
    }

    @keyframes show {
        0%, 49.99% {
            opacity: 0;
            z-index: 1;
        }

        50%, 100% {
            opacity: 1;
            z-index: 5;
        }
    }
`;

const FormContainer = styled.div`
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
`;

const SignUpContainer = styled(FormContainer)`
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
`;

const SignInContainer = styled(FormContainer)`
    left: 0;
    width: 50%;
    z-index: 2;
`;

const Form = styled.form`
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 50px;
    height: 100%;
    text-align: center;
`;

const Title = styled.h1`
    font-weight: bold;
    margin: 0;
`;

const Paragraph = styled.p`
    font-size: 14px;
    font-weight: 100;
    line-height: 20px;
    letter-spacing: 0.5px;
    margin: 20px 0 30px;
`;

const Span = styled.span`
    font-size: 12px;
`;

const Anchor = styled.a`
    color: #333333;
    font-size: 14px;
    text-decoration: none;
    margin: 15px 0;
`;

const Input = styled.input`
    background-color: #eeeeee;
    border: none;
    padding: 12px 15px;
    margin: 8px 0;
    width: 100%;
`;

const Button = styled.button`
    border-radius: 20px;
    border: 1px solid #ff4b2b;
    background-color: #ff4b2b;
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    cursor: pointer;
    margin-top: 20px;

    &:active {
        transform: scale(0.95);
    }

    &:focus {
        outline: none;
    }

    &.ghost {
        background-color: transparent;
        border-color: #ffffff;
    }

    &.guest {
        background-color: #6c757d;
        border-color: #6c757d;
        margin-top: 5px;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const OverlayContainer = styled.div`
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.6s ease-in-out;
    z-index: 100;
`;

const Overlay = styled.div`
    background: #ff416c;
    background: linear-gradient(to right, #ff4b2b, #ff416c);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 0;
    color: #ffffff;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
`;

const OverlayPanel = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    text-align: center;
    top: 0;
    height: 100%;
    width: 50%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
`;

const OverlayLeft = styled(OverlayPanel)`
    transform: translateX(-20px);
`;

const OverlayRight = styled(OverlayPanel)`
    right: 0;
    transform: translateX(0);
`;

const SocialContainer = styled.div`
    margin: 20px 0;
`;

const Social = styled.a`
    border: 1px solid #dddddd;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
    height: 40px;
    width: 40px;
`;

const ErrorMessage = styled.div`
    color: #ff4b2b;
    font-size: 12px;
    margin: 10px 0;
    text-align: center;
`;

const SuccessMessage = styled.div`
    color: #28a745;
    font-size: 12px;
    margin: 10px 0;
    text-align: center;
`;

// Thêm styled component cho "OR" divider
const OrDivider = styled.div`
    display: flex;
    align-items: center;
    margin: 15px 0 10px 0;
    width: 100%;

    &::before,
    &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #ddd;
    }

    span {
        padding: 0 15px;
        color: #666;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
`;

const GlobalStyle = styled.div`
    * {
        box-sizing: border-box;
    }

    body {
        background: #f6f5f7;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-family: sans-serif;
        height: 100vh;
        margin: -20px 0 50px;
    }
`;

// Main Auth Component
export default function Auth() {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = async () => {
            setIsCheckingAuth(true);

            try {
                if (isAuthenticated()) {
                    // Validate token trước khi redirect
                    const isValid = await validateToken();
                    if (isValid) {
                        navigate("/app");
                        return;
                    }
                }

                // Nếu không có token hoặc token không hợp lệ, clear storage
                removeToken();
            } catch (error) {
                console.error('Auth check failed:', error);
                removeToken();
            } finally {
                setIsCheckingAuth(false);
            }
        };

        checkAuthStatus();
    }, [navigate]);

    // Expose activityTracker globally for api interceptor
    useEffect(() => {
        window.activityTracker = activityTracker;
        return () => {
            delete window.activityTracker;
        };
    }, []);

    // Handle successful login
    const handleLoginSuccess = (tokenData) => {
        // Save the JWT token
        saveToken(tokenData.token);

        // Start activity tracking
        activityTracker.startTracking();

        console.log('Login successful, activity tracking started');

        // Clear any error messages
        setErrorMessage("");
        setSuccessMessage("Login successful! Redirecting...");

        // Navigate to the main app after a brief delay
        setTimeout(() => {
            navigate('/app');
        }, 1000);
    };

    // Handle guest mode
    const handleGuestMode = () => {
        setSuccessMessage("Entering as guest...");
        console.log('Entering guest mode');

        // Navigate to app without authentication
        setTimeout(() => {
            navigate('/app?mode=guest');
        }, 500);
    };

    const handleSignIn = async (e) => {
        e.preventDefault();

        // Clear previous messages
        setErrorMessage("");
        setSuccessMessage("");

        // Basic validation
        if (!email || !password) {
            setErrorMessage("Please enter both email and password");
            return;
        }

        setIsLoading(true);

        try {
            const { data } = await login({ email, password });
            handleLoginSuccess(data);
        } catch (err) {
            console.error("Login failed:", err);

            // Handle different types of errors
            if (err.response?.status === 401) {
                setErrorMessage("Invalid email or password");
            } else if (err.response?.status === 403) {
                setErrorMessage("Account not verified. Please check your email.");
            } else if (err.response?.data?.message) {
                setErrorMessage(err.response.data.message);
            } else if (err.message === 'Authentication required') {
                setErrorMessage("Session expired. Please try again.");
            } else {
                setErrorMessage("Login failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        setSuccessMessage("Sign up functionality coming soon!");

        setTimeout(() => {
            setIsRightPanelActive(false);
            setSuccessMessage("");
        }, 2000);
    };

    const clearMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    if (isCheckingAuth) {
        return (
            <PageWrapper>
                <div style={{ textAlign: 'center', color: '#666' }}>
                    <p>Checking authentication...</p>
                </div>
            </PageWrapper>
        );
    }


    return (
        <PageWrapper>
            <GlobalStyle>
                <Container className={isRightPanelActive ? "right-panel-active" : ""} id="container">
                    <SignUpContainer className="form-container sign-up-container">
                        <Form onSubmit={handleSignUp}>
                            <Title>Create Account</Title>
                            <SocialContainer>
                                <Social href="#" className="social"><i className="fab fa-facebook-f"></i></Social>
                                <Social href="#" className="social"><i className="fab fa-google-plus-g"></i></Social>
                                <Social href="#" className="social"><i className="fab fa-linkedin-in"></i></Social>
                            </SocialContainer>
                            <Span>or use your email for registration</Span>
                            <Input type="text" placeholder="Name" />
                            <Input type="email" placeholder="Email" />
                            <Input type="password" placeholder="Password" />
                            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Creating..." : "Sign Up"}
                            </Button>
                        </Form>
                    </SignUpContainer>

                    <SignInContainer className="form-container sign-in-container">
                        <Form onSubmit={handleSignIn}>
                            <Title>Sign In</Title>
                            <SocialContainer>
                                <Social href="#" className="social"><i className="fab fa-facebook-f"></i></Social>
                                <Social href="#" className="social"><i className="fab fa-google-plus-g"></i></Social>
                                <Social href="#" className="social"><i className="fab fa-linkedin-in"></i></Social>
                            </SocialContainer>
                            <Span>or use your account</Span>
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    clearMessages();
                                }}
                                disabled={isLoading}
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    clearMessages();
                                }}
                                disabled={isLoading}
                            />
                            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Signing In..." : "Sign In"}
                            </Button>

                            {/* OR Divider */}
                            <OrDivider>
                                <span>or</span>
                            </OrDivider>

                            {/* Guest Mode Button */}
                            <Button
                                type="button"
                                className="guest"
                                onClick={handleGuestMode}
                                disabled={isLoading}
                            >
                                Continue as Guest
                            </Button>
                        </Form>
                    </SignInContainer>

                    <OverlayContainer className="overlay-container">
                        <Overlay className="overlay">
                            <OverlayLeft className="overlay-panel overlay-left">
                                <Title>Welcome Back</Title>
                                <Paragraph>To keep connected with us please login with your personal info</Paragraph>
                                <Button
                                    className="ghost"
                                    onClick={() => {
                                        setIsRightPanelActive(false);
                                        clearMessages();
                                    }}
                                >
                                    Sign In
                                </Button>
                            </OverlayLeft>
                            <OverlayRight className="overlay-panel overlay-right">
                                <Title>Hello Friend!</Title>
                                <Paragraph>Enter your personal details and start journey with us</Paragraph>
                                <Button
                                    className="ghost"
                                    onClick={() => {
                                        setIsRightPanelActive(true);
                                        clearMessages();
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </OverlayRight>
                        </Overlay>
                    </OverlayContainer>
                </Container>
            </GlobalStyle>
        </PageWrapper>
    );
}