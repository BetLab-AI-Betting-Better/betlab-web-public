import type { ReactNode } from "react";

// ⚠️ runtime = "nodejs" removed - incompatible with cacheComponents in Next.js 16

export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return children;
}
