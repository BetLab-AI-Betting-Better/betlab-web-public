"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/shared/utils"
import { Input } from "@/presentation/components/ui/input"

export type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-12", className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={cn(
            "absolute right-0 top-0 h-full px-3 py-2",
            "hover:bg-accent rounded-r-md transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            // Touch-friendly: 44px min width
            "min-w-[44px] flex items-center justify-center"
          )}
          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
