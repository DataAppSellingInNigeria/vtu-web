// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PhoneCall, LockIcon, LogOut, Menu, X, LayoutDashboard } from "lucide-react";

// Import your PNG logo
import Logo from "../assets/DT_logo_tranparent.png"
// import nineMobileLogo from "../assets/9mobile.png";

const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
];

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const [open, setOpen] = useState(false);

    const linkBase =
        "inline-flex items-center text-sm font-medium text-white hover:text-slate-100 transition";
    const btnBase =
        "inline-flex items-center gap-2 rounded-xl px-4 py-2 transition";

    return (
        <header className="sticky top-0 z-50 bg-sky-600 shadow-md">
            <div className="mx-auto max-w-7xl px-4">
                <div className="h-16 flex items-center justify-between">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src={Logo} // your imported PNG
                            alt="DahaTech Logo"
                            className="h-10 w-auto object-contain"
                        />
                        <span className="font-extrabold tracking-tight text-white text-lg">
                            DahaTech
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {/* {navLinks.map(({ label, href }) => (
                            <a key={label} href={href} className={linkBase}>
                                {label}
                            </a>
                        ))} */}

                        <NavLink
                            to="/wallet-page"
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? "underline underline-offset-4" : ""}`
                            }
                        >
                            <LayoutDashboard className="w-4 h-4 mr-1" />
                            My Wallet
                        </NavLink>

                        <NavLink
                            to="/buy/transactions-logs"
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? "underline underline-offset-4" : ""}`
                            }
                        >
                            <LayoutDashboard className="w-4 h-4 mr-1" />
                            My Transactions
                        </NavLink>
                    </nav>

                    {/* Desktop actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <a
                            href="https://wa.me/2348146149773"
                            target="_blank"
                            rel="noreferrer"
                            className={`${btnBase} border border-white/50 text-white hover:bg-sky-700`}
                        >
                            <PhoneCall className="w-4 h-4" />
                            Support
                        </a>

                        {isAuthenticated ? (
                            <button
                                onClick={logout}
                                className={`${btnBase} border-2 border-red-100 text-red-50 hover:bg-red-500 hover:text-white`}
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className={`${btnBase} bg-white text-sky-600 font-semibold hover:bg-slate-100`}
                            >
                                <LockIcon className="w-4 h-4" />
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile burger */}
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="md:hidden inline-flex items-center justify-center rounded-xl p-2 border border-white/40 text-white hover:bg-sky-700"
                        aria-expanded={open}
                        aria-label="Toggle menu"
                    >
                        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden bg-sky-700 transition-all">
                    <div className="mx-auto max-w-7xl px-4 py-3 space-y-3">
                        {navLinks.map(({ label, href }) => (
                            <a
                                key={label}
                                href={href}
                                className="block px-3 py-2 rounded-lg text-white hover:bg-sky-600 hover:text-slate-100"
                                onClick={() => setOpen(false)}
                            >
                                {label}
                            </a>
                        ))}

                        <NavLink
                            to="/wallet-page"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-lg ${isActive ? "text-yellow-200 underline" : "text-white"
                                } hover:bg-sky-600`
                            }
                            onClick={() => setOpen(false)}
                        >
                            <span className="inline-flex items-center gap-2">
                                <LayoutDashboard className="w-4 h-4" />
                                My Wallet
                            </span>
                        </NavLink>

                        <NavLink
                            to="/buy/transactions-logs"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-lg ${isActive ? "text-yellow-200 underline" : "text-white"
                                } hover:bg-sky-600`
                            }
                            onClick={() => setOpen(false)}
                        >
                            <span className="inline-flex items-center gap-2">
                                <LayoutDashboard className="w-4 h-4" />
                                My Transaction
                            </span>
                        </NavLink>

                        <div className="pt-2 flex flex-col gap-2">
                            <a
                                href="https://wa.me/2348146149773"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-4 py-2 text-white hover:bg-sky-600"
                                onClick={() => setOpen(false)}
                            >
                                <PhoneCall className="w-4 h-4" />
                                Support
                            </a>

                            {isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        logout();
                                    }}
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 px-4 py-2 text-red-50 hover:bg-red-500 hover:text-white"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 bg-white text-sky-600 font-semibold hover:bg-slate-100"
                                    onClick={() => setOpen(false)}
                                >
                                    <LockIcon className="w-4 h-4" />
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}