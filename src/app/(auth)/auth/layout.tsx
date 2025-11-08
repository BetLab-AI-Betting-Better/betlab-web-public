import type { ReactNode } from "react";
import { AuthLayoutShell } from "@/modules/auth";

// ⚠️ runtime = "nodejs" removed - incompatible with cacheComponents in Next.js 16

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthLayoutShell>{children}</AuthLayoutShell>;
}
