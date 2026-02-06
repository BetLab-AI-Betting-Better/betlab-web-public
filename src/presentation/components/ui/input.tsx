import * as React from "react"

import { cn } from "@/shared/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Mobile-friendly: h-12 (48px) for touch, text-base (16px) prevents iOS zoom
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-gray-200 h-12 w-full min-w-0 rounded-lg border bg-surface-elevated px-3.5 py-3 text-base shadow-xs transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-navy focus-visible:ring-navy/15 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
