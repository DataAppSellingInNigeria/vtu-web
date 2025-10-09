// src/components/wallet/TransactionsList.tsx
import { useMemo, useState } from "react";
import type { Tx } from "../../hooks/useWallet";
import { useMyTransactions } from "../../hooks/useWallet";
import TxRow from "../../components/wallet/TxRow";
import ReceiptModal from "../../components/wallet/ReceiptModal";

type TransactionsListProps = {
    limit?: number;
    highlightRef?: string | null;
};

export default function TransactionsList({
    limit = 10,
    highlightRef = null,
}: TransactionsListProps) {
    const { data, isLoading, error } = useMyTransactions({ limit });

    // Normalize various response shapes into a single items array (as in your current code)
    const items: (Tx & { _orig?: any })[] = Array.isArray(data?.items)
        ? (data!.items as (Tx & { _orig?: any })[])
        : Array.isArray((data as any)?.data)
            ? (data as any).data
            : Array.isArray(data as any)
                ? (data as any)
                : [];

    // ✅ Defensive "newest-first" sort on the client
    const getTime = (t: any) =>
        new Date(
            t.timestamp ??
            t.createdAt ??
            t._orig?.timestamp ??
            t._orig?.createdAt ??
            0
        ).getTime();

    const sortedItems = useMemo(
        () => [...items].sort((a, b) => getTime(b) - getTime(a)),
        [items]
    );

    // Preserve your highlight logic, now reading from sortedItems
    const active = useMemo(() => {
        if (!highlightRef || sortedItems.length === 0) return null;
        return (
            sortedItems.find((t: any) =>
                [t.refId, t._orig?.ref, t._orig?.reference, t._orig?.requestId, t._orig?.transactionId].some(
                    (v) => v === highlightRef
                )
            ) ?? null
        );
    }, [highlightRef, sortedItems]);

    const [selected, setSelected] = useState<(Tx & { _orig?: any }) | null>(active || null);

    // Blue card shell, full width (no left/right margins)
    const shellCls =
        "my-6 w-full rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50 to-sky-100 shadow-md";

    const skeleton = (
        <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse h-16 rounded-xl bg-white/60" />
            ))}
        </div>
    );

    if (error) {
        return (
            <section className={shellCls}>
                <header className="px-4 sm:px-5 py-3 border-b border-sky-200 bg-sky-100/70 rounded-t-2xl">
                    <h3 className="font-semibold text-sky-900">Recent Transactions</h3>
                </header>
                <div className="p-4 sm:p-5">
                    <p className="text-sm text-rose-600">Failed to load transactions.</p>
                </div>
            </section>
        );
    }

    return (
        <section className={shellCls}>
            <header className="px-4 sm:px-5 py-3 border-b border-sky-200 bg-sky-100/70 rounded-t-2xl">
                <h3 className="font-semibold text-sky-900">Recent Transactions</h3>
            </header>

            <div className="p-2 sm:p-3">
                {isLoading ? (
                    skeleton
                ) : sortedItems.length === 0 ? (
                    <p className="text-sm text-sky-900/70 px-3 py-2">No transactions yet.</p>
                ) : (
                    <ul className="divide-y divide-sky-200">
                        {sortedItems.map((tx) => {
                            const isActive =
                                !!highlightRef &&
                                (tx.refId === highlightRef ||
                                    tx._orig?.ref === highlightRef ||
                                    tx._orig?.reference === highlightRef ||
                                    tx._orig?.requestId === highlightRef ||
                                    tx._orig?.transactionId === highlightRef);

                            return (
                                <TxRow
                                    key={tx.id ?? tx._id ?? tx.refId}
                                    tx={tx}
                                    isActive={!!isActive}
                                    onView={(t) => setSelected(t)}
                                />
                            );
                        })}
                    </ul>
                )}
            </div>

            {selected && <ReceiptModal tx={selected} onClose={() => setSelected(null)} />}
        </section>
    );
}
