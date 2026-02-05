import type { ReactNode } from "react";
import { PublicShell } from "@/presentation/components/layouts/public-shell.client";

// ⚠️ runtime = "nodejs" removed - incompatible with cacheComponents in Next.js 16

/**
 * Public layout stays on the server while delegating nav to a lightweight client shell.
 */

export default async function PublicLayout({ children }: { children: ReactNode }) {
  return <PublicShell user={null}>{children}</PublicShell>;
}
