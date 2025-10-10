// src/pages/admin/AdminRegister.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Mirror user's phone validation/normalization (Nigeria)
const phoneRegex = /^(?:\+234|0)(\d{10})$/;

const ROLE_OPTIONS = ["admin", "superAdmin"]; // extend later if needed

export default function AdminRegister() {
    const nav = useNavigate();

    // Same fields as user register:
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    // Admin-only: roles (default to ["admin"])
    const [roles, setRoles] = useState<string[]>(["admin"]);

    // UI/validation states (match user page UX)
    const [error, setError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string>("");
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
        if (name === "phone") setPhoneError("");
        if (name === "email") setError(null);
    }

    // Keep same normalization as user form
    function normalizePhone(input: string) {
        let phone = input.trim();
        if (phone.startsWith("+234")) phone = "0" + phone.slice(4);
        return phone;
    }

    function toggleRole(r: string) {
        setRoles((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // validate phone like user form
        const normalizedPhone = normalizePhone(formData.phone);
        if (!phoneRegex.test(normalizedPhone)) {
            setPhoneError("Please enter a valid Nigerian phone number.");
            setIsLoading(false);
            return;
        }

        // enforce terms like user form
        if (!isChecked) {
            setError("You must agree to the Terms and Conditions and Privacy Policy.");
            setIsLoading(false);
            return;
        }

        try {
            // Send to admin endpoint with roles
            const payload = { ...formData, phone: normalizedPhone, roles };
            const res = await API.post("/auth/register", payload);

            // If backend sets cookie and returns user, navigate to admin area
            if (res.data?.ok && res.data?.user) {
                toast.success("Admin created successfully! Redirecting…", { position: "top-center" });
                nav("/admin/status");
                return;
            }

            // Fallback: show success then go to admin login
            toast.success("Admin created. Please sign in.", { position: "top-center" });
            nav("/admin/login");
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                (err?.response?.status === 409 ? "Email already registered." : "Registration failed.");
            setError(msg);
            toast.error(msg, { position: "top-center" });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Match user register layout */}
            <Navbar />

            <div className="flex items-center justify-center bg-gray-100 flex-grow py-2">
                <form onSubmit={onSubmit} className="bg-white px-8 py-4 rounded shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Admin</h2>

                    {error && (
                        <p className="mb-4 p-4 text-sm text-white bg-red-500 rounded-md shadow-md">
                            {error}
                        </p>
                    )}

                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-600">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter full name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter email"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-600">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="0XXXXXXXXXX or +234XXXXXXXXXX"
                            required
                        />
                        {phoneError && <p className="text-red-600 text-sm">{phoneError}</p>}
                    </div>

                    {/* Password (with eye toggle) */}
                    <div className="mb-2 relative">
                        <label className="block text-sm font-medium mb-1 text-gray-600">Password</label>
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setIsPasswordVisible((v) => !v)}
                            className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500"
                            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                        >
                            {isPasswordVisible ? <EyeOff /> : <Eye />}
                        </button>
                    </div>

                    {/* Terms & policies */}
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

                    {/* (Optional) Role picker — keep hidden if you want only admin by default.
              You can wrap the block below with a feature flag.
          */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-600">Roles</label>
                        <div className="flex gap-3 flex-wrap">
                            {ROLE_OPTIONS.map((r) => (
                                <label key={r} className="inline-flex items-center gap-2">
                                    <input type="checkbox" checked={roles.includes(r)} onChange={() => toggleRole(r)} />
                                    <span className="text-sm">{r}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
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
                            "Create Admin"
                        )}
                    </button>

                    <p className="mt-4 text-sm text-center text-gray-600">
                        Already have an admin account?{" "}
                        <Link to="/admin/login" className="text-blue-500 hover:underline">Sign in</Link>
                    </p>
                </form>

                <ToastContainer />
            </div>

            <Footer />
        </div>
    );
}
