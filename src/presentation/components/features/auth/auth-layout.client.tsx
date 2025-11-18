"use client";

import type { ReactNode } from "react";
import { Toaster as SonnerToaster } from "@/presentation/components/ui/sonner";
import { Toaster } from "@/presentation/components/ui/toast";
import { ToastProvider } from "@/presentation/hooks/use-toast";

export function AuthLayoutShell({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <SonnerToaster />
      <Toaster />
    </ToastProvider>
  );
}
