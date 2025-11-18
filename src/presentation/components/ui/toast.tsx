"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/shared/utils"
import { useToast, type Toast } from "@/presentation/hooks/use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  )
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: (id: string) => void
}) {
  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
        "data-[variant=default]:bg-background data-[variant=default]:border-border",
        "data-[variant=destructive]:bg-destructive data-[variant=destructive]:text-destructive-foreground data-[variant=destructive]:border-destructive"
      )}
      data-variant={toast.variant || "default"}
    >
      <div className="grid gap-1">
        {toast.title && (
          <div className="text-sm font-semibold">{toast.title}</div>
        )}
        {toast.description && (
          <div className="text-sm opacity-90">{toast.description}</div>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-70 focus:opacity-100 focus:outline-none focus:ring-2"
        aria-label="Fermer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export { useToast }
