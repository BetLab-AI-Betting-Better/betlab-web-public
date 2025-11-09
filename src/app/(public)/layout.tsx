import type { ReactNode } from "react";
import { PublicShell } from "@/modules/layouts/ui/public-shell.client";
import { getCurrentUser } from "@/modules/auth/server/session";

// ⚠️ runtime = "nodejs" removed - incompatible with cacheComponents in Next.js 16

/**
 * Public layout stays on the server while delegating nav to a lightweight client shell.
 */

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return <PublicShell user={user}>{children}</PublicShell>;
}
