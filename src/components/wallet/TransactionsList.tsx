// src/components/wallet/TransactionsList.tsx
import { useMemo } from "react";
import { useMyTransactions } from "../../hooks/useWallet";

type TransactionsListProps = {
    limit?: number;
    highlightRef?: string | null;
    showInlineReceipt?: boolean;
};

export default function TransactionsList({
    limit = 10,
    highlightRef = null,
    showInlineReceipt = true,
}: TransactionsListProps) {
    // Call hooks unconditionally
    const { data, isLoading, error } = useMyTransactions({ limit });

    // Prefer normalized items from hook, but be defensive if shape deviates
    const items = Array.isArray(data?.items)
        ? data!.items
        : Array.isArray((data as any)?.data)
            ? (data as any).data
            : Array.isArray(data as any)
                ? (data as any)
                : [];

    const active = useMemo(() => {
        if (!highlightRef || items.length === 0) return null;
        return (
            items.find((t: any) =>
                [t.refId, t._orig?.ref, t._orig?.reference, t._orig?.requestId, t._orig?.transactionId]
                    .some((v) => v === highlightRef)
            ) ?? null
        );
    }, [highlightRef, items]);

    const skeleton = (
        <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse h-14 rounded-xl bg-slate-200/70 dark:bg-neutral-800" />
            ))}
        </div>
    );

    if (error) {
        return (
            <div className="rounded-2xl border dark:border-neutral-800 p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Recent Transactions</h3>
                </div>
                <p className="text-sm text-red-600">Failed to load transactions.</p>
            </div>
        );
    }

    const list = items.length === 0 ? (
        <p className="text-sm text-neutral-500">No transactions yet.</p>
    ) : (
        <ul className="divide-y dark:divide-neutral-800">
            {items.map((tx: any) => {
                const isActive =
                    !!highlightRef &&
                    (tx.refId === highlightRef ||
                        tx._orig?.ref === highlightRef ||
                        tx._orig?.reference === highlightRef ||
                        tx._orig?.requestId === highlightRef ||
                        tx._orig?.transactionId === highlightRef);

                return (
                    <li
                        key={tx.id}
                        className={
                            "py-3 flex flex-col gap-2 " +
                            (isActive ? "rounded-xl ring-2 ring-blue-500 ring-offset-0" : "")
                        }
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium capitalize">
                                    {String(tx.type ?? "").replace("_", " ")}{tx.service ? ` · ${tx.service}` : ""}
                                </div>
                                <div className="text-xs text-neutral-500">
                                    {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : ""}
                                </div>
                                {tx.refId && (
                                    <div className="text-xs text-neutral-400">Ref: {tx.refId}</div>
                                )}
                            </div>

                            <div className="text-right">
                                <div className="text-sm font-semibold">
                                    {(tx.currency ?? "NGN") + " " + (tx.amount ?? 0).toLocaleString()}
                                </div>
                                <span
                                    className={
                                        "text-xs px-2 py-0.5 rounded-full " +
                                        (tx.status === "success"
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                            : tx.status === "failed"
                                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300")
                                    }
                                >
                                    {tx.status}
                                </span>
                            </div>
                        </div>

                        {isActive && showInlineReceipt && tx._orig && (
                            <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 sm:p-4">
                                <h4 className="text-sm font-semibold">Receipt</h4>
                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm">
                                    <div className="text-neutral-600 dark:text-neutral-300">
                                        <span className="text-neutral-500">Reference:</span> {tx.refId || "-"}
                                    </div>
                                    <div className="text-neutral-600 dark:text-neutral-300">
                                        <span className="text-neutral-500">Type:</span> {tx.type || "-"}
                                    </div>
                                    <div className="text-neutral-600 dark:text-neutral-300">
                                        <span className="text-neutral-500">Service:</span> {tx.service || "-"}
                                    </div>
                                    <div className="text-neutral-600 dark:text-neutral-300">
                                        <span className="text-neutral-500">Amount:</span> ₦{(tx.amount ?? 0).toLocaleString()}
                                    </div>
                                    <div className="text-neutral-600 dark:text-neutral-300">
                                        <span className="text-neutral-500">Status:</span> {tx.status || "-"}
                                    </div>
                                    <div className="text-neutral-600 dark:text-neutral-300">
                                        <span className="text-neutral-500">Date:</span>{" "}
                                        {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "-"}
                                    </div>
                                </div>
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );

    return (
        <div className="rounded-2xl border dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Recent Transactions</h3>
            </div>
            {isLoading ? skeleton : list}
        </div>
    );
}