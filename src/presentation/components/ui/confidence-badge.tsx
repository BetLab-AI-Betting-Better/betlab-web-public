import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { TrendingUp, Minus, TrendingDown } from "lucide-react"
import { cn } from "@/shared/utils"

/**
 * ConfidenceBadge - Badge de niveau de confiance BetLab
 *
 * Affiche un indicateur de confiance pour les pronostics avec:
 * - 3 niveaux: HIGH (élevé), MEDIUM (moyen), LOW (faible)
 * - Couleurs sémantiques (vert, orange, rouge)
 * - 3 tailles: sm (24px), md (32px), lg (40px)
 * - Icônes optionnelles (TrendingUp, Minus, TrendingDown)
 * - Labels optionnels en français
 * - Mobile-friendly avec touch targets >= 32px
 * - Support dark mode
 *
 * @example
 * ```tsx
 * // Confiance élevée avec label
 * <ConfidenceBadge level="high" showLabel />
 *
 * // Confiance moyenne, taille large
 * <ConfidenceBadge level="medium" size="lg" />
 *
 * // Confiance faible, petite taille
 * <ConfidenceBadge level="low" size="sm" showLabel />
 * ```
 */

const confidenceBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 shrink-0 whitespace-nowrap gap-1 select-none",
  {
    variants: {
      level: {
        high: "bg-[var(--success)] text-white shadow-sm hover:shadow-md dark:bg-[var(--success)]/90",
        medium: "bg-[var(--warning)] text-white shadow-sm hover:shadow-md dark:bg-[var(--warning)]/90",
        low: "bg-[var(--error)] text-white shadow-sm hover:shadow-md dark:bg-[var(--error)]/90",
      },
      size: {
        sm: "h-6 px-2 text-xs min-w-[24px]",
        md: "h-8 px-3 text-sm min-w-[32px]",
        lg: "h-10 px-4 text-base min-w-[40px]",
      },
    },
    defaultVariants: {
      level: "medium",
      size: "md",
    },
  }
)

const iconSizeMap = {
  sm: 12,
  md: 14,
  lg: 16,
} as const

const labelMap = {
  high: "Élevé",
  medium: "Moyen",
  low: "Faible",
} as const

const IconMap = {
  high: TrendingUp,
  medium: Minus,
  low: TrendingDown,
} as const

export interface ConfidenceBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof confidenceBadgeVariants> {
  /**
   * Niveau de confiance
   * - high: Confiance élevée (vert)
   * - medium: Confiance moyenne (orange)
   * - low: Confiance faible (rouge)
   */
  level: "high" | "medium" | "low"

  /**
   * Taille du badge
   * - sm: 24px de hauteur
   * - md: 32px de hauteur (défaut)
   * - lg: 40px de hauteur
   */
  size?: "sm" | "md" | "lg"

  /**
   * Afficher le label texte ("Élevé", "Moyen", "Faible")
   * @default false
   */
  showLabel?: boolean

  /**
   * Afficher l'icône
   * @default true
   */
  showIcon?: boolean
}

const ConfidenceBadge = React.forwardRef<HTMLSpanElement, ConfidenceBadgeProps>(
  ({
    className,
    level,
    size = "md",
    showLabel = false,
    showIcon = true,
    ...props
  }, ref) => {
    const Icon = IconMap[level]
    const iconSize = iconSizeMap[size]
    const label = labelMap[level]

    return (
      <span
        ref={ref}
        className={cn(confidenceBadgeVariants({ level, size }), className)}
        role="status"
        aria-label={`Confiance ${label.toLowerCase()}`}
        data-level={level}
        data-size={size}
        {...props}
      >
        {showIcon && <Icon size={iconSize} className="shrink-0" aria-hidden="true" />}
        {showLabel && <span className="font-semibold">{label}</span>}
        {!showLabel && !showIcon && (
          <span className="sr-only">{label}</span>
        )}
      </span>
    )
  }
)

ConfidenceBadge.displayName = "ConfidenceBadge"

export { ConfidenceBadge, confidenceBadgeVariants }
