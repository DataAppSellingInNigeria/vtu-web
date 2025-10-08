// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, try to load the current user using the cookie
    useEffect(() => {
        (async () => {
            try {
                const { data } = await API.get("/auth/me");  // protected, uses cookie
                setUser(data);
                console.log(user)
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Login now accepts credentials; server sets the cookie
    const login = async ({ email, password }) => {
        await API.post("/auth/login", { email, password }); // sets Set-Cookie
        const { data } = await API.get("/auth/me");
        setUser(data);
    };

    const logout = async () => {
        try { await API.post("/auth/logout"); } catch { }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);
export default AuthContext;