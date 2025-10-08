export async function poll<T>(
    fn: () => Promise<T>,
    opts: { intervalMs?: number; timeoutMs?: number; stop: (res: T) => boolean }
): Promise<T> {
    const interval = opts.intervalMs ?? 2500;
    const timeout = opts.timeoutMs ?? 60_000;

    const start = Date.now();
    // immediate first call
    let res = await fn();
    if (opts.stop(res)) return res;

    // loop
    while (Date.now() - start < timeout) {
        await new Promise((r) => setTimeout(r, interval));
        res = await fn();
        if (opts.stop(res)) return res;
    }
    return res; // last result (may still be pending)
}
