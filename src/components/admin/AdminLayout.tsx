import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";


export default function AdminLayout() {
    const { pathname } = useLocation();
    const isActive = (p: string) =>
        pathname.startsWith(p) ? "bg-blue-600 text-white" : "text-slate-700";


    return (
        <div className="min-h-screen bg-slate-50">
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-600" />
                        <span className="font-semibold">VTU Admin</span>
                    </div>
                    <div className="text-sm text-slate-500">Admin Console</div>
                </div>
            </header>
            <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
                <aside className="col-span-12 md:col-span-3 lg:col-span-2">
                    <nav className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
                        <ul className="flex md:block gap-2">
                            <li>
                                <Link className={`block px-3 py-2 rounded-xl ${isActive("/admin/dashboard")}`} to="/admin/dashboard">Dashboard</Link>
                            </li>
                            <li>
                                <Link className={`block px-3 py-2 rounded-xl ${isActive("/admin/transactions")}`} to="/admin/transactions">Transactions</Link>
                            </li>
                            <li>
                                <Link className={`block px-3 py-2 rounded-xl ${isActive("/admin/withdrawals")}`} to="/admin/withdrawals">Withdrawals</Link>
                            </li>
                            <li>
                                <Link className={`block px-3 py-2 rounded-xl ${isActive("/admin/wallets")}`} to="/admin/wallets">Wallets</Link>
                            </li>
                            <li>
                                <Link className={`block px-3 py-2 rounded-xl ${isActive("/admin/services")}`} to="/admin/services">Services Ops</Link>
                            </li>
                            <li>
                                <Link className={`block px-3 py-2 rounded-xl ${isActive("/admin/payments")}`} to="/admin/payments">Payments/Webhooks</Link>
                            </li>
                            <li>
                                <Link className={`block px-3 py-2 rounded-xl ${isActive("/admin/status")}`} to="/admin/status">System Status</Link>
                            </li>
                        </ul>
                    </nav>
                </aside>
                <main className="col-span-12 md:col-span-9 lg:col-span-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}