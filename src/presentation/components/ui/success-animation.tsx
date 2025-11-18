'use client';

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/shared/utils"

export interface SuccessAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  duration?: number
  onAnimationComplete?: () => void
  show?: boolean
}

const sizeClasses = {
  sm: "h-12 w-12",
  md: "h-16 w-16",
  lg: "h-24 w-24",
}

const iconSizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
}

const SuccessAnimation = React.forwardRef<HTMLDivElement, SuccessAnimationProps>(
  (
    {
      className,
      size = "md",
      duration = 2000,
      onAnimationComplete,
      show = true,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(show)

    React.useEffect(() => {
      if (show) {
        setIsVisible(true)
        const timer = setTimeout(() => {
          setIsVisible(false)
          onAnimationComplete?.()
        }, duration)
        return () => clearTimeout(timer)
      }
    }, [show, duration, onAnimationComplete])

    if (!isVisible && !show) return null

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center",
          "animate-in fade-in zoom-in duration-300",
          !isVisible && "animate-out fade-out zoom-out duration-300",
          className
        )}
        role="status"
        aria-live="polite"
        aria-label="Succès"
        {...props}
      >
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full bg-[#10B981]/10",
            sizeClasses[size],
            "animate-in zoom-in duration-500"
          )}
        >
          {/* Cercle de pulsation */}
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-[#10B981]/20 animate-ping",
              sizeClasses[size]
            )}
            style={{ animationDuration: "1s", animationIterationCount: "2" }}
          />

          {/* Icône checkmark */}
          <div
            className={cn(
              "relative z-10 flex items-center justify-center rounded-full bg-[#10B981]",
              "animate-in zoom-in duration-500 delay-100"
            )}
          >
            <Check
              className={cn(
                "text-white animate-in zoom-in duration-300 delay-200",
                iconSizeClasses[size]
              )}
              strokeWidth={3}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    )
  }
)
SuccessAnimation.displayName = "SuccessAnimation"

export { SuccessAnimation }
