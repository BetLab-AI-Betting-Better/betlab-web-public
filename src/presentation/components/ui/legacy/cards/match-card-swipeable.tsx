'use client'

/**
 * MatchCardSwipeable - Match card avec gestes de swipe
 *
 * Features:
 * - Swipe left: Ajouter/retirer des favoris
 * - Swipe right: Partager
 * - Haptic feedback sur les actions
 * - Indicateurs visuels pendant le swipe
 */

import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { Heart, Share2 } from 'lucide-react'
import { cn } from '@/shared/utils'
import { useHapticFeedback } from '@/presentation/hooks/use-haptic-feedback'

interface MatchCardSwipeableProps {
  matchId: string
  isFavorite?: boolean
  onFavoriteToggle?: () => void
  onShare?: () => void
  children: React.ReactNode
  className?: string
}

export function MatchCardSwipeable({
  matchId,
  isFavorite = false,
  onFavoriteToggle,
  onShare,
  children,
  className,
}: MatchCardSwipeableProps) {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const { vibrate } = useHapticFeedback()

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (!onFavoriteToggle) return

      setSwipeDirection('left')
      vibrate('light')
      onFavoriteToggle()

      setTimeout(() => setSwipeDirection(null), 300)
    },
    onSwipedRight: () => {
      if (!onShare) return

      setSwipeDirection('right')
      vibrate('medium')
      onShare()

      setTimeout(() => setSwipeDirection(null), 300)
    },
    trackTouch: true,
    delta: 50,
    preventScrollOnSwipe: false,
  })

  return (
    <div className="relative">
      {/* Swipe indicators - Background */}
      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
        {/* Right swipe indicator (Share) */}
        <div
          className={cn(
            'flex items-center gap-2 transition-all duration-200',
            swipeDirection === 'right' ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
          )}
        >
          <div className="bg-lime rounded-full p-2">
            <Share2 className="w-5 h-5 text-navy" />
          </div>
          <span className="text-sm font-medium text-lime">Partager</span>
        </div>

        {/* Left swipe indicator (Favorite) */}
        <div
          className={cn(
            'flex items-center gap-2 transition-all duration-200',
            swipeDirection === 'left' ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
          )}
        >
          <span className="text-sm font-medium text-destructive">
            {isFavorite ? 'Retirer' : 'Favori'}
          </span>
          <div className="bg-destructive rounded-full p-2">
            <Heart
              className={cn(
                'w-5 h-5 text-white',
                isFavorite && 'fill-white'
              )}
            />
          </div>
        </div>
      </div>

      {/* Card content */}
      <div
        {...swipeHandlers}
        className={cn(
          'relative transition-transform duration-200',
          swipeDirection === 'left' && 'translate-x-[-4px]',
          swipeDirection === 'right' && 'translate-x-[4px]',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
