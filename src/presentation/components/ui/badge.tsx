import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-navy text-white rounded-md",
        secondary:
          "border-transparent bg-navy-100 text-navy rounded-md",
        destructive:
          "border-transparent bg-destructive text-white rounded-md focus-visible:ring-destructive/20",
        outline:
          "text-foreground border-gray-200 rounded-md",
        success:
          "border-transparent bg-success/10 text-success rounded-md font-semibold",
        warning:
          "border-transparent bg-warning/10 text-warning rounded-md font-semibold",
        error:
          "border-transparent bg-error/10 text-error rounded-md font-semibold",
        live:
          "border-transparent bg-live text-white rounded-full font-bold animate-live-glow",
      },
      size: {
        default: "h-6 text-xs",
        sm: "h-5 text-[10px] px-1.5",
        lg: "h-7 text-sm px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
