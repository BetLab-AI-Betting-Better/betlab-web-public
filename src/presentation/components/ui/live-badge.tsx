import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/utils"

/**
 * LiveBadge - Badge indicateur LIVE pour les matchs en cours
 *
 * Badge animé pour indiquer qu'un match est en cours avec:
 * - Couleur rouge vif (#DC2626)
 * - Animation pulse CSS
 * - 2 tailles: sm (24px), md (28px)
 * - Dot indicateur rouge pulsant optionnel
 * - Variant compact (juste le dot)
 * - Background semi-transparent optionnel
 * - Glow effect optionnel
 * - Mobile-friendly
 * - Support dark mode
 *
 * @example
 * ```tsx
 * // Badge LIVE standard avec animation
 * <LiveBadge />
 *
 * // Badge LIVE avec dot et glow
 * <LiveBadge showDot showGlow />
 *
 * // Compact mode (juste le dot)
 * <LiveBadge compact />
 *
 * // Petite taille sans animation
 * <LiveBadge size="sm" animated={false} />
 * ```
 */

const liveBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-bold uppercase tracking-wider shrink-0 whitespace-nowrap select-none",
  {
    variants: {
      size: {
        sm: "h-6 px-2 text-[10px] min-w-[40px]",
        md: "h-7 px-3 text-xs min-w-[48px]",
      },
      variant: {
        solid: "bg-[var(--live)] text-white shadow-sm",
        outline: "bg-transparent border-2 border-[var(--live)] text-[var(--live)]",
        ghost: "bg-[var(--live)]/10 text-[var(--live)] dark:bg-[var(--live)]/20",
      },
      animated: {
        true: "",
        false: "",
      },
      compact: {
        true: "w-6 h-6 p-0 min-w-0",
        false: "",
      },
      showGlow: {
        true: "shadow-[0_0_10px_rgba(220,38,38,0.5)] dark:shadow-[0_0_15px_rgba(220,38,38,0.6)]",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "solid",
      animated: true,
      compact: false,
      showGlow: false,
    },
  }
)

const dotVariants = cva(
  "rounded-full shrink-0 bg-white",
  {
    variants: {
      size: {
        sm: "w-1.5 h-1.5",
        md: "w-2 h-2",
      },
      animated: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      animated: true,
    },
  }
)

export interface LiveBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof liveBadgeVariants> {
  /**
   * Taille du badge
   * - sm: 24px de hauteur
   * - md: 28px de hauteur (défaut)
   */
  size?: "sm" | "md"

  /**
   * Variant visuel du badge
   * - solid: Fond rouge plein (défaut)
   * - outline: Bordure rouge, fond transparent
   * - ghost: Fond rouge transparent
   */
  variant?: "solid" | "outline" | "ghost"

  /**
   * Activer l'animation pulse
   * @default true
   */
  animated?: boolean

  /**
   * Afficher le dot indicateur avant le texte
   * @default false
   */
  showDot?: boolean

  /**
   * Mode compact (juste le dot, pas de texte)
   * @default false
   */
  compact?: boolean

  /**
   * Afficher l'effet glow
   * @default false
   */
  showGlow?: boolean
}

const LiveBadge = React.forwardRef<HTMLSpanElement, LiveBadgeProps>(
  ({
    className,
    size = "md",
    variant = "solid",
    animated = true,
    showDot = false,
    compact = false,
    showGlow = false,
    ...props
  }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          liveBadgeVariants({ size, variant, animated, compact, showGlow }),
          animated && "animate-pulse",
          className
        )}
        role="status"
        aria-label="Match en direct"
        aria-live="polite"
        data-live="true"
        data-size={size}
        data-variant={variant}
        {...props}
      >
        {compact ? (
          <span
            className={cn(
              dotVariants({ size, animated }),
              animated && "animate-pulse",
              "bg-current"
            )}
            aria-hidden="true"
          />
        ) : (
          <>
            {showDot && (
              <span
                className={cn(
                  dotVariants({ size, animated }),
                  animated && "animate-pulse",
                  "mr-1"
                )}
                aria-hidden="true"
              />
            )}
            <span className="font-extrabold">LIVE</span>
          </>
        )}
        <span className="sr-only">Match en direct</span>
      </span>
    )
  }
)

LiveBadge.displayName = "LiveBadge"

export { LiveBadge, liveBadgeVariants }
