'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>
  threshold?: number // Distance to trigger (default: 80px)
  enabled?: boolean
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  enabled = true,
}: UsePullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)

  const startY = useRef(0)
  const scrollableRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return

    const scrollTop = scrollableRef.current?.scrollTop || 0
    if (scrollTop === 0) {
      startY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }, [enabled])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || isRefreshing) return

    const currentY = e.touches[0].clientY
    const distance = Math.max(0, currentY - startY.current)

    // Damping effect
    const dampedDistance = distance * 0.5
    setPullDistance(dampedDistance)

    // Prevent default scroll if pulling
    if (distance > 10) {
      e.preventDefault()
    }
  }, [isPulling, isRefreshing])

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return

    setIsPulling(false)

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      setPullDistance(threshold)

      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh])

  useEffect(() => {
    const element = scrollableRef.current
    if (!element || !enabled) return

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    scrollableRef,
    isPulling,
    isRefreshing,
    pullDistance,
  }
}
