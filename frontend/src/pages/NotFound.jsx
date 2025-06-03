import { Link } from "react-router-dom";
import { Bot, ArrowLeft } from "lucide-react";
import "../styles/AuthForm.css";

function NotFound() {
    return (
        <div className="auth-container">
            <div className="auth-card" style={{ textAlign: 'center' }}>
                <div className="auth-logo">
                    <Bot size={48} className="logo-icon" />
                </div>
                <h1 style={{ fontSize: '72px', margin: '0 0 16px 0', color: '#667eea' }}>404</h1>
                <h2 className="auth-title">Page Not Found</h2>
                <p className="auth-subtitle" style={{ marginBottom: '32px' }}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link 
                    to="/" 
                    className="auth-button"
                    style={{ 
                        textDecoration: 'none',
                        display: 'inline-flex',
                        width: 'auto',
                        padding: '12px 24px'
                    }}
                >
                    <ArrowLeft size={20} />
                    Back to Chat
                </Link>
            </div>
        </div>
    );
}

export default NotFound;