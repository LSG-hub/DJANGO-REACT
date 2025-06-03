import { useLocation } from "react-router-dom";
import Form from "../components/Form";

function Login() {
    const location = useLocation();
    const message = location.state?.message;

    return (
        <div>
            {message && (
                <div className="success-message" style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#166534',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    {message}
                </div>
            )}
            <Form route="/api/token/" method="login" />
        </div>
    );
}

export default Login;