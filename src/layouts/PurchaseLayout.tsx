// src/pages/buy/PurchaseLayout.tsx
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useWallet } from "../hooks/useWallet";
import Navbar from "../components/Navbar";

export default function PurchaseLayout({
    title,
    subtitle,
    children,
}: { title: string; subtitle?: string; children: ReactNode }) {
    const { data, isLoading, refetch, isFetching } = useWallet();
    const balance = data?.balance ?? 0;
    const currency = data?.currency ?? "NGNM";

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
                <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                    <header className="flex items-start justify-between">
                        <div>
                            <Link to="/wallet-page" className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800">
                                <ArrowLeft className="w-4 h-4" /> Back to Wallet
                            </Link>
                            <h1 className="mt-2 text-2xl md:text-3xl font-black text-slate-900">{title}</h1>
                            {subtitle && <p className="text-slate-600">{subtitle}</p>}
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm w-56">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-600">Balance</span>
                                <button
                                    onClick={() => refetch()}
                                    className="text-xs text-sky-700 hover:text-sky-800 underline underline-offset-4 disabled:opacity-50"
                                    disabled={isFetching}
                                >
                                    {isFetching ? "…" : "Refresh"}
                                </button>
                            </div>
                            <div className="mt-1 text-xl font-extrabold text-slate-900">
                                {currency} {isLoading ? "—" : balance.toLocaleString()}
                            </div>
                        </div>
                    </header>

                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-6">
                        {children}
                    </div>

                    <p className="text-xs text-slate-500">
                        Payments debit your wallet instantly. Keep sufficient balance for a smooth checkout.
                    </p>
                </div>
            </div>
        </div>
    );
}
