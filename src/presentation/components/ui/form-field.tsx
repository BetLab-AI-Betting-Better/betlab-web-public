"use client"

import * as React from "react"
import { cn } from "@/shared/utils"
import { Label } from "@/presentation/components/ui/label"

export interface FormFieldWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  htmlFor?: string
  error?: string
  required?: boolean
  description?: string
}

/**
 * Wrapper générique pour les champs de formulaire
 * Fournit un label, une description optionnelle et un message d'erreur
 * Utilise le spacing mobile-friendly (16px vertical)
 */
const FormFieldWrapper = React.forwardRef<
  HTMLDivElement,
  FormFieldWrapperProps
>(
  (
    {
      className,
      label,
      htmlFor,
      error,
      required,
      description,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-2 mb-4", className)} // Mobile: 16px vertical spacing
        {...props}
      >
        {label && (
          <Label
            htmlFor={htmlFor}
            className={cn(
              "text-sm font-medium",
              error && "text-destructive"
            )}
          >
            {label}
            {required && (
              <span className="text-destructive ml-1" aria-label="required">
                *
              </span>
            )}
          </Label>
        )}

        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        {children}

        {error && (
          <p className="text-sm text-destructive flex items-start gap-1">
            <span aria-hidden="true">•</span>
            <span>{error}</span>
          </p>
        )}
      </div>
    )
  }
)

FormFieldWrapper.displayName = "FormFieldWrapper"

export { FormFieldWrapper }
