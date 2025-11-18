import * as React from "react"
import { Inbox } from "lucide-react"
import { cn } from "@/shared/utils"
import { Button } from "./button"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title?: string
  message?: string
  action?: {
    label: string
    onClick: () => void
  }
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      icon,
      title = "Aucune donnée",
      message = "Aucun élément à afficher pour le moment.",
      action,
      ...props
    },
    ref
  ) => {
    const Icon = icon || <Inbox className="h-12 w-12" aria-hidden="true" />

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-4 p-8 text-center",
          className
        )}
        role="status"
        aria-live="polite"
        {...props}
      >
        <div className="rounded-full bg-muted p-4 text-muted-foreground">
          {Icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {message && (
            <p className="text-sm text-muted-foreground max-w-md">{message}</p>
          )}
        </div>
        {action && (
          <Button onClick={action.onClick} variant="outline">
            {action.label}
          </Button>
        )}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
