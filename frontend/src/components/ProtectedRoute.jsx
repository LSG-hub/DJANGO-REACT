import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";
import LoadingIndicator from "./LoadingIndicator";

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            
            if (!token) {
                console.log("No access token found");
                setIsAuthorized(false);
                setIsLoading(false);
                return;
            }

            // Check if token is valid
            try {
                const decoded = jwtDecode(token);
                const tokenExpiration = decoded.exp;
                const now = Date.now() / 1000;

                if (tokenExpiration < now) {
                    console.log("Token expired, trying to refresh");
                    await refreshToken();
                } else {
                    console.log("Token is valid");
                    setIsAuthorized(true);
                }
            } catch (decodeError) {
                console.log("Token decode error:", decodeError);
                await refreshToken();
            }
        } catch (error) {
            console.log("Auth check error:", error);
            setIsAuthorized(false);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        
        if (!refreshToken) {
            console.log("No refresh token found");
            setIsAuthorized(false);
            return;
        }

        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                console.log("Token refreshed successfully");
                setIsAuthorized(true);
            } else {
                console.log("Token refresh failed");
                setIsAuthorized(false);
            }
        } catch (error) {
            console.log("Token refresh error:", error);
            // Clear invalid tokens
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            setIsAuthorized(false);
        }
    };

    // Show loading screen while checking authentication
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#f5f5f5'
            }}>
                <LoadingIndicator />
                <p style={{ marginTop: '16px', color: '#666' }}>Verifying authentication...</p>
            </div>
        );
    }

    // Only redirect after we've finished checking
    if (isAuthorized === false) {
        console.log("User not authorized, redirecting to login");
        return <Navigate to="/login" replace />;
    }

    // User is authorized, show the protected content
    return children;
}

export default ProtectedRoute;