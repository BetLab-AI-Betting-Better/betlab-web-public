import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 aria-invalid:border-destructive min-h-[44px] cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md active:shadow-sm active:scale-[0.98]",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 hover:shadow-md focus-visible:ring-destructive/20 active:scale-[0.98]",
        outline:
          "border border-gray-200 bg-surface-elevated shadow-xs hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm active:scale-[0.98]",
        secondary:
          "bg-navy-100 text-navy shadow-xs hover:bg-navy-100/80 hover:shadow-sm active:scale-[0.98]",
        ghost:
          "hover:bg-gray-100 hover:text-foreground active:bg-gray-200",
        link:
          "text-navy underline-offset-4 hover:underline",
        primary:
          "bg-navy text-white shadow-sm hover:bg-navy-700 hover:shadow-md active:bg-navy-700 active:scale-[0.98] transition-all",
        lime:
          "bg-lime text-navy-950 shadow-sm hover:bg-lime-300 hover:shadow-md active:bg-lime-300 active:scale-[0.98] font-semibold transition-all",
      },
      size: {
        default: "h-11 px-5 py-2 has-[>svg]:px-3",
        sm: "h-9 rounded-md gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-12 rounded-lg px-6 text-base has-[>svg]:px-4",
        icon: "size-11",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
