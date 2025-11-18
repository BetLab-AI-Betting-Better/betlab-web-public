"use client"

import * as React from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "@/shared/utils"

export interface FormErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
  errors?: string[]
}

/**
 * Component pour afficher les erreurs de validation de formulaire
 * Affiche un message unique ou une liste d'erreurs
 * Utilise la couleur error (#EF4444) pour le texte et les icônes
 */
const FormError = React.forwardRef<HTMLDivElement, FormErrorProps>(
  ({ className, message, errors, ...props }, ref) => {
    // Si ni message ni errors, ne rien afficher
    if (!message && (!errors || errors.length === 0)) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-md bg-destructive/10 p-3 text-sm text-destructive",
          "flex gap-2 items-start",
          className
        )}
        role="alert"
        {...props}
      >
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div className="flex-1">
          {message && <p>{message}</p>}
          {errors && errors.length > 0 && (
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }
)

FormError.displayName = "FormError"

export { FormError }
