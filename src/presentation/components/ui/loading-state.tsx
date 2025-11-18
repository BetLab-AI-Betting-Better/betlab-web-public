import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/utils"
import { Spinner, type SpinnerProps } from "./spinner"

const loadingStateVariants = cva(
  "flex flex-col items-center justify-center gap-3",
  {
    variants: {
      mode: {
        inline: "p-8",
        fullscreen: "fixed inset-0 z-50",
      },
    },
    defaultVariants: {
      mode: "inline",
    },
  }
)

export interface LoadingStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingStateVariants> {
  message?: string
  showOverlay?: boolean
  spinnerSize?: SpinnerProps["size"]
  spinnerVariant?: SpinnerProps["variant"]
}

const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  (
    {
      className,
      mode,
      message,
      showOverlay = false,
      spinnerSize = "lg",
      spinnerVariant = "primary",
      ...props
    },
    ref
  ) => {
    return (
      <>
        {showOverlay && mode === "fullscreen" && (
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
        )}
        <div
          ref={ref}
          className={cn(loadingStateVariants({ mode }), className)}
          role="status"
          aria-live="polite"
          {...props}
        >
          <Spinner size={spinnerSize} variant={spinnerVariant} />
          {message && (
            <p className="text-sm font-medium text-muted-foreground">
              {message}
            </p>
          )}
        </div>
      </>
    )
  }
)
LoadingState.displayName = "LoadingState"

export { LoadingState, loadingStateVariants }
