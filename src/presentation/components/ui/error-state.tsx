import * as React from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "@/shared/utils"
import { Button } from "./button"

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
  showIcon?: boolean
}

const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      className,
      title = "Une erreur s'est produite",
      message = "Impossible de charger les données. Veuillez réessayer.",
      onRetry,
      retryLabel = "Réessayer",
      showIcon = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-4 p-8 text-center",
          className
        )}
        role="alert"
        aria-live="assertive"
        {...props}
      >
        {showIcon && (
          <div className="rounded-full bg-[#EF4444]/10 p-3">
            <AlertCircle className="h-8 w-8 text-[#EF4444]" aria-hidden="true" />
          </div>
        )}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {message && (
            <p className="text-sm text-muted-foreground max-w-md">{message}</p>
          )}
        </div>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="destructive"
            className="bg-[#EF4444] hover:bg-[#EF4444]/90"
          >
            {retryLabel}
          </Button>
        )}
      </div>
    )
  }
)
ErrorState.displayName = "ErrorState"

export { ErrorState }
