import type { ReactNode } from "react";
import { AuthLayoutShell } from "@/presentation/components/features/auth/auth-layout.client";

// ⚠️ runtime = "nodejs" removed - incompatible with cacheComponents in Next.js 16

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthLayoutShell>{children}</AuthLayoutShell>;
}
