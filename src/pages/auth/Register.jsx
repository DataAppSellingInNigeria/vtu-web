import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// IMPORTANT: use the axios instance that has withCredentials: true
import API from "../../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const phoneRegex = /^(?:\+234|0)(\d{10})$/;

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
    const [error, setError] = useState(null);
    const [phoneError, setPhoneError] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
        if (name === "phone") setPhoneError("");
        if (name === "email") setError(null);
    };

    const normalizePhone = (input) => {
        let phone = input.trim();
        // Convert +234xxxxxxxxxx -> 0xxxxxxxxxx
        if (phone.startsWith("+234")) phone = "0" + phone.slice(4);
        return phone;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Phone validation
        const normalizedPhone = normalizePhone(formData.phone);
        if (!phoneRegex.test(normalizedPhone)) {
            setPhoneError("Please enter a valid Nigerian phone number.");
            setIsLoading(false);
            return;
        }

        if (!isChecked) {
            setError("You must agree to the Terms and Conditions and Privacy Policy.");
            setIsLoading(false);
            return;
        }

        try {
            // Send registration
            const payload = { ...formData, phone: normalizedPhone };
            const res = await API.post("/auth/register", payload);

            // If backend auto-logs in by setting cookie on register:
            if (res.data?.ok && res.data?.user) {
                toast.success("Registration successful! Welcome 👋", { position: "top-center" });
                // Optionally fetch /auth/me here if you keep user state in context
                navigate("/dashboard");
                return;
            }

            // Else (no auto-login): go to login
            toast.success("Registration successful! Please log in.", { position: "top-center" });
            navigate("/login");
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                (err?.response?.status === 409 ? "Email already registered." : "Registration failed.");
            setError(msg);
            toast.error(msg, { position: "top-center" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex items-center justify-center bg-gray-100 flex-grow py-2">
                <form onSubmit={handleSubmit} className="bg-white px-8 py-4 rounded shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>

                    {error && (
                        <p className="mb-4 p-4 text-sm text-white bg-red-500 rounded-md shadow-md">
                            {error}
                        </p>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-600">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter your fullname"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-600">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter your phone number"
                            required
                        />
                        {phoneError && <p className="text-red-600 text-sm">{phoneError}</p>}
                    </div>

                    <div className="mb-2 relative">
                        <label className="block text-sm font-medium mb-1 text-gray-600">Password</label>
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setIsPasswordVisible((v) => !v)}
                            className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500"
                        >
                            {isPasswordVisible ? <EyeOff /> : <Eye />}
                        </button>
                    </div>

                    <div className="mb-4 flex items-center">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                            className="h-4 w-4 text-sky-600 rounded"
                        />
                        <label
                            htmlFor="terms"
                            className={`ml-2 text-sm ${!isChecked ? "text-red-600" : "text-gray-600"}`}
                        >
                            I agree to the{" "}
                            <a href="/terms-and-conditions" className="text-sky-600">Terms and Conditions</a>{" "}
                            and{" "}
                            <a href="/privacy-policy" className="text-sky-600">Privacy Policy</a>.
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex justify-center">
                                <ClipLoader size={20} color="#fff" />
                            </div>
                        ) : (
                            "Sign Up"
                        )}
                    </button>

                    <p className="mt-4 text-sm text-center text-gray-600">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-500 hover:underline">Login</a>
                    </p>
                </form>

                <ToastContainer />
            </div>

            <Footer />
        </div>
    );
};

export default Register;