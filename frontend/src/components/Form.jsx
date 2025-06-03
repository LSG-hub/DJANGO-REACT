import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/AuthForm.css";
import LoadingIndicator from "./LoadingIndicator";
import { Bot, Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const isLogin = method === "login";
    const title = isLogin ? "Welcome back" : "Create your account";
    const subtitle = isLogin ? "Sign in to continue your conversations" : "Start chatting with your AI assistant";
    const buttonText = isLogin ? "Sign In" : "Create Account";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validation for registration
        if (!isLogin) {
            if (password !== confirmPassword) {
                setError("Passwords don't match");
                setLoading(false);
                return;
            }
            if (password.length < 6) {
                setError("Password must be at least 6 characters long");
                setLoading(false);
                return;
            }
        }

        try {
            const payload = isLogin 
                ? { username, password }
                : { username, email, password };
                
            console.log("Submitting to:", route);
            console.log("Payload:", payload);
            
            const res = await api.post(route, payload);
            console.log("Response:", res.data);
            
            if (isLogin) {
                // Store tokens
                if (res.data.access) {
                    localStorage.setItem(ACCESS_TOKEN, res.data.access);
                    console.log("Access token stored:", res.data.access.substring(0, 20) + "...");
                }
                if (res.data.refresh) {
                    localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                    console.log("Refresh token stored:", res.data.refresh.substring(0, 20) + "...");
                }
                
                // Verify tokens were stored
                const storedAccess = localStorage.getItem(ACCESS_TOKEN);
                const storedRefresh = localStorage.getItem(REFRESH_TOKEN);
                console.log("Verification - Access token exists:", !!storedAccess);
                console.log("Verification - Refresh token exists:", !!storedRefresh);
                
                // Navigate to home
                navigate("/");
            } else {
                // Show success message and redirect to login
                setError("");
                navigate("/login", { 
                    state: { message: "Account created successfully! Please sign in." }
                });
            }
        } catch (error) {
            console.error("Form submission error:", error);
            if (error.response?.data) {
                const errorData = error.response.data;
                if (typeof errorData === 'object') {
                    // Handle field-specific errors
                    const firstError = Object.values(errorData)[0];
                    setError(Array.isArray(firstError) ? firstError[0] : firstError);
                } else {
                    setError(errorData);
                }
            } else {
                setError(isLogin ? "Invalid username or password" : "Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Header */}
                <div className="auth-header">
                    <div className="auth-logo">
                        <Bot size={40} className="logo-icon" />
                        <h1 className="logo-text">ChatBot</h1>
                    </div>
                    <h2 className="auth-title">{title}</h2>
                    <p className="auth-subtitle">{subtitle}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* Username Field */}
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <div className="input-wrapper">
                            <UserIcon size={20} className="input-icon" />
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="form-input"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Email Field (Registration only) */}
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <div className="input-wrapper">
                                <Mail size={20} className="input-icon" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="form-input"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    )}

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <div className="input-wrapper">
                            <Lock size={20} className="input-icon" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="form-input"
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle"
                                disabled={loading}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field (Registration only) */}
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <div className="input-wrapper">
                                <Lock size={20} className="input-icon" />
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    className="form-input"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? <LoadingIndicator size="small" /> : buttonText}
                    </button>
                </form>

                {/* Footer */}
                <div className="auth-footer">
                    {isLogin ? (
                        <p>
                            Don't have an account?{" "}
                            <Link to="/register" className="auth-link">
                                Sign up
                            </Link>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{" "}
                            <Link to="/login" className="auth-link">
                                Sign in
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Form;