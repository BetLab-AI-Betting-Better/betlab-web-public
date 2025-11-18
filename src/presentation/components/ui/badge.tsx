import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/utils"

/**
 * BetLab Badge Component
 *
 * Usage examples:
 * - Success: <Badge variant="success">Won</Badge>
 * - Warning: <Badge variant="warning">Pending</Badge>
 * - Error: <Badge variant="error">Lost</Badge>
 * - Live: <Badge variant="live">LIVE</Badge>
 * - Mobile-friendly with min-height 28px for easy tapping
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden min-h-[28px]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        success:
          "border-transparent bg-[var(--success)] text-white [a&]:hover:bg-[var(--success)]/90 font-semibold",
        warning:
          "border-transparent bg-[var(--warning)] text-white [a&]:hover:bg-[var(--warning)]/90 font-semibold",
        error:
          "border-transparent bg-[var(--error)] text-white [a&]:hover:bg-[var(--error)]/90 font-semibold",
        live:
          "border-transparent bg-[var(--live)] text-white [a&]:hover:bg-[var(--live)]/90 font-bold animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
