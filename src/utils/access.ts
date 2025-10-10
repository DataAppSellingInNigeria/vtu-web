// src/utils/access.ts
import type { AdminIdentity } from "../hooks/useAdminAuth";

export function hasAnyRole(user: AdminIdentity | null, roles: string[]) {
    return !!user?.roles?.some(r => roles.includes(r));
}
