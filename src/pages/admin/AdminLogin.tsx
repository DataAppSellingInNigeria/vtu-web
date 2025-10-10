// src/pages/admin/AdminLogin.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";

export default function AdminLogin() {
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null); setLoading(true);
        try {
            await API.post("/admin/auth/login", { email, password });
            nav("/admin/dashboard"); // protected area
        } catch (e: any) {
            setErr(e?.response?.data?.message ?? "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen grid place-items-center bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h1 className="text-2xl font-bold mb-1">Admin Sign In</h1>
                <p className="text-sm text-slate-600 mb-6">Access the admin console</p>

                {err && <div className="mb-4 text-sm text-red-600">{err}</div>}

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input className="w-full border rounded-xl px-3 py-2" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input className="w-full border rounded-xl px-3 py-2" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button disabled={loading} className="w-full rounded-xl bg-blue-600 text-white py-2">
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </form>

                <div className="text-sm text-slate-600 mt-4">
                    Need an admin account?{" "}
                    <Link to="/admin/register" className="text-blue-600 underline">Register</Link>
                </div>
            </div>
        </div>
    );
}
