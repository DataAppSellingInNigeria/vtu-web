// src/pages/buy/components.tsx
import { ReactNode } from "react";

export function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700">{label}</span>
            {children}
        </label>
    );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`h-11 rounded-xl border border-slate-300 px-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600/50 ${props.className ?? ""}`}
        />
    );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
            className={`h-11 rounded-xl border border-slate-300 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600/50 ${props.className ?? ""}`}
        />
    );
}

export function SubmitButton({ loading, disabled, children }: { loading?: boolean; disabled?: boolean; children: ReactNode }) {
    return (
        <button
            type="submit"
            disabled={disabled || loading}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-sky-600 px-5 font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-60"
        >
            {loading ? "Processing…" : children}
        </button>
    );
}
