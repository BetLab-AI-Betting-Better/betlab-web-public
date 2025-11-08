import type { ReactNode } from "react";
import { Suspense } from "react";
import { PublicShell } from "@/modules/layouts/ui/public-shell.client";
import { getCurrentUser } from "@/modules/auth/server/session";

// ⚠️ runtime = "nodejs" removed - incompatible with cacheComponents in Next.js 16

/**
 * Public layout stays on the server while delegating nav to a lightweight client shell.
 */

async function UserProvider({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return <PublicShell user={user}>{children}</PublicShell>;
}

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<PublicShell user={null}>{children}</PublicShell>}>
      <UserProvider>{children}</UserProvider>
    </Suspense>
  );
}
