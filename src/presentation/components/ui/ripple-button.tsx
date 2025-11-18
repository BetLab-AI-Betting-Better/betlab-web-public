'use client'

import { useState, useCallback, ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/utils'

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  rippleColor?: string
  haptic?: boolean
}

export function RippleButton({
  children,
  className,
  rippleColor = 'rgba(200, 220, 63, 0.5)',
  haptic = true,
  onClick,
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    // Haptic feedback
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }

    setRipples(prev => [...prev, { x, y, id }])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id))
    }, 600)

    onClick?.(e)
  }, [onClick, haptic])

  return (
    <button
      className={cn('relative overflow-hidden', className)}
      onClick={handleClick}
      {...props}
    >
      {children}

      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            backgroundColor: rippleColor,
          }}
        />
      ))}
    </button>
  )
}
