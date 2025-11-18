import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { TrendingUp } from "lucide-react"
import { cn } from "@/shared/utils"

/**
 * EdgeChip - Chip d'affichage du edge (avantage) BetLab
 *
 * Affiche le pourcentage d'avantage (edge) d'un pronostic avec:
 * - Couleurs selon seuils:
 *   - > 10%: Vert excellent
 *   - >= 5%: Lime good
 *   - >= 2%: Orange fair
 *   - < 2%: Gris low
 * - Format: "+X.X%" avec 1 décimale
 * - 2 tailles: sm (24px), md (32px)
 * - Icône TrendingUp
 * - Animation pulse si edge > 10%
 * - Tooltip optionnel avec explication
 * - Mobile-friendly
 * - Support dark mode
 *
 * @example
 * ```tsx
 * // Edge excellent avec animation
 * <EdgeChip edge={12.5} />
 *
 * // Edge moyen, petite taille
 * <EdgeChip edge={6.3} size="sm" />
 *
 * // Edge faible sans label
 * <EdgeChip edge={1.8} showLabel={false} />
 * ```
 */

/**
 * Détermine la catégorie d'edge selon les seuils
 */
const getEdgeCategory = (edge: number): "excellent" | "good" | "fair" | "low" => {
  if (edge > 10) return "excellent"
  if (edge >= 5) return "good"
  if (edge >= 2) return "fair"
  return "low"
}

/**
 * Formate le pourcentage d'edge avec signe et 1 décimale
 */
const formatEdge = (edge: number): string => {
  const formatted = Math.abs(edge).toFixed(1)
  return edge >= 0 ? `+${formatted}%` : `-${formatted}%`
}

const edgeChipVariants = cva(
  "inline-flex items-center justify-center rounded-full font-bold transition-all duration-200 shrink-0 whitespace-nowrap gap-1 select-none shadow-sm",
  {
    variants: {
      category: {
        excellent: "bg-[var(--success)] text-white hover:shadow-md dark:bg-[var(--success)]/90",
        good: "bg-[var(--lime)] text-[var(--navy)] hover:shadow-md dark:bg-[var(--lime)]/90",
        fair: "bg-[var(--warning)] text-white hover:shadow-md dark:bg-[var(--warning)]/90",
        low: "bg-[var(--gray)] text-white hover:shadow-md dark:bg-[var(--gray)]/80",
      },
      size: {
        sm: "h-6 px-2 text-xs min-w-[48px]",
        md: "h-8 px-3 text-sm min-w-[64px]",
      },
      animated: {
        true: "animate-pulse",
        false: "",
      },
    },
    defaultVariants: {
      category: "fair",
      size: "md",
      animated: false,
    },
  }
)

const iconSizeMap = {
  sm: 12,
  md: 14,
} as const

export interface EdgeChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'title'>,
    Omit<VariantProps<typeof edgeChipVariants>, 'category' | 'animated'> {
  /**
   * Valeur du edge en pourcentage (ex: 8.2 pour 8.2%)
   */
  edge: number

  /**
   * Taille du chip
   * - sm: 24px de hauteur
   * - md: 32px de hauteur (défaut)
   */
  size?: "sm" | "md"

  /**
   * Afficher le label "Edge:" avant le pourcentage
   * @default false
   */
  showLabel?: boolean

  /**
   * Afficher l'icône TrendingUp
   * @default true
   */
  showIcon?: boolean

  /**
   * Afficher un tooltip avec explication du edge
   * @default false
   */
  showTooltip?: boolean
}

const EdgeChip = React.forwardRef<HTMLSpanElement, EdgeChipProps>(
  ({
    className,
    edge,
    size = "md",
    showLabel = false,
    showIcon = true,
    showTooltip = false,
    ...props
  }, ref) => {
    const category = getEdgeCategory(edge)
    const formattedEdge = formatEdge(edge)
    const iconSize = iconSizeMap[size]
    const shouldAnimate = category === "excellent"

    const tooltipText = showTooltip
      ? `Edge ${formattedEdge}: ${
          category === "excellent"
            ? "Excellent avantage, pariez avec confiance"
            : category === "good"
            ? "Bon avantage, opportunité intéressante"
            : category === "fair"
            ? "Avantage correct, à considérer"
            : "Faible avantage, prudence recommandée"
        }`
      : undefined

    return (
      <span
        ref={ref}
        className={cn(
          edgeChipVariants({ category, size, animated: shouldAnimate }),
          className
        )}
        role="status"
        aria-label={`Edge: ${formattedEdge}`}
        title={tooltipText}
        data-edge={edge}
        data-category={category}
        data-size={size}
        {...props}
      >
        {showIcon && (
          <TrendingUp size={iconSize} className="shrink-0" aria-hidden="true" />
        )}
        {showLabel && <span className="font-medium">Edge:</span>}
        <span className="font-bold tracking-tight">{formattedEdge}</span>
      </span>
    )
  }
)

EdgeChip.displayName = "EdgeChip"

export { EdgeChip, edgeChipVariants, getEdgeCategory, formatEdge }
