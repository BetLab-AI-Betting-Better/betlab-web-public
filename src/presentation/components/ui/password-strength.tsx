"use client"

import * as React from "react"
import { cn } from "@/shared/utils"
import { Check } from "lucide-react"

export interface PasswordStrengthProps {
  password: string
  className?: string
}

interface PasswordCriteria {
  label: string
  regex: RegExp
  met: boolean
}

type StrengthLevel = "weak" | "medium" | "good" | "strong"

function calculatePasswordStrength(password: string): {
  level: StrengthLevel
  score: number
  criteria: PasswordCriteria[]
} {
  const criteria: PasswordCriteria[] = [
    {
      label: "Au moins 8 caractères",
      regex: /.{8,}/,
      met: /.{8,}/.test(password),
    },
    {
      label: "Une majuscule",
      regex: /[A-Z]/,
      met: /[A-Z]/.test(password),
    },
    {
      label: "Une minuscule",
      regex: /[a-z]/,
      met: /[a-z]/.test(password),
    },
    {
      label: "Un chiffre",
      regex: /[0-9]/,
      met: /[0-9]/.test(password),
    },
  ]

  const metCriteria = criteria.filter((c) => c.met).length
  const score = (metCriteria / criteria.length) * 100

  let level: StrengthLevel = "weak"
  if (metCriteria === 4) {
    level = "strong"
  } else if (metCriteria === 3) {
    level = "good"
  } else if (metCriteria >= 2) {
    level = "medium"
  }

  return { level, score, criteria }
}

const strengthConfig: Record<
  StrengthLevel,
  { color: string; bgColor: string; label: string }
> = {
  weak: {
    color: "text-red-600 dark:text-red-500",
    bgColor: "bg-red-600 dark:bg-red-500",
    label: "Faible",
  },
  medium: {
    color: "text-orange-600 dark:text-orange-500",
    bgColor: "bg-orange-600 dark:bg-orange-500",
    label: "Moyen",
  },
  good: {
    color: "text-[var(--lime)] dark:text-[var(--lime)]",
    bgColor: "bg-[var(--lime)] dark:bg-[var(--lime)]",
    label: "Bon",
  },
  strong: {
    color: "text-green-600 dark:text-green-500",
    bgColor: "bg-green-600 dark:bg-green-500",
    label: "Fort",
  },
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const { level, score, criteria } = calculatePasswordStrength(password)
  const config = strengthConfig[level]

  if (!password) {
    return null
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Force du mot de passe</span>
          <span className={cn("font-medium", config.color)}>
            {config.label}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full transition-all duration-300",
              config.bgColor
            )}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Criteria List */}
      <div className="space-y-2">
        {criteria.map((criterion, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm"
          >
            <div
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full transition-colors",
                criterion.met
                  ? "bg-green-600 dark:bg-green-500"
                  : "bg-muted border border-border"
              )}
            >
              {criterion.met && (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
            <span
              className={cn(
                "transition-colors",
                criterion.met
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {criterion.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
