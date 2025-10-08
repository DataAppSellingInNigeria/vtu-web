// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuthContext } from "../../context/AuthContext"; // updated hook import

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { login } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/wallet-page";

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setError(null);
    //     setIsLoading(true);

    //     try {
    //         await login({ email, password }); // <-- server sets cookie; context fetches /auth/me
    //         toast.success("Login successful!", { position: "top-center" });
    //         // navigate("/wallet-page");
    //         const location = useLocation();
    //         const from = location.state?.from?.pathname || "/wallet-page";
    //         navigate(from, { replace: true });
    //     } catch (err) {
    //         const msg = err?.response?.data?.message || "Login failed.";
    //         setError(msg);
    //         toast.error(msg, { position: "top-center" });
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login({ email, password });
            toast.success("Login successful!", { position: "top-center" });
            navigate(from, { replace: true });
        } catch (err) {
            const msg = err?.response?.data?.message || "Login failed.";
            toast.error(msg, { position: "top-center" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex items-center justify-center bg-gray-100 flex-grow">
                <form onSubmit={handleSubmit} className="bg-white px-8 py-4 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

                    {error && (
                        <p className="mb-4 p-4 text-sm text-white bg-red-500 rounded-md shadow-md">
                            {error}
                        </p>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-600">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="mb-6 relative">
                        <label className="block text-sm font-medium mb-1 text-gray-600">Password</label>
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500"
                        >
                            {isPasswordVisible ? <EyeOff /> : <Eye />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex justify-center">
                                <ClipLoader size={20} />
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </button>

                    <p className="mt-4 text-sm text-center text-gray-600">
                        Don&apos;t have an account?{" "}
                        <a href="/register" className="text-blue-500 hover:underline">Register</a>
                    </p>
                </form>

                <ToastContainer />
            </div>

            <Footer />
        </div>
    );
};

export default Login;