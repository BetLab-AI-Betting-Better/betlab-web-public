'use client'

/**
 * MobilePageWrapper - Wrapper pour pages avec UX mobile complète
 *
 * Inclut automatiquement:
 * - Pull-to-refresh
 * - Success toast
 * - Error handling
 *
 * Utilisation:
 * <MobilePageWrapper onRefresh={refetch}>
 *   {content}
 * </MobilePageWrapper>
 */

import { ReactNode } from 'react'
import { usePullToRefresh } from '@/presentation/hooks/use-pull-to-refresh'
import { useSuccessToast } from '@/presentation/hooks/use-success-toast'
import { PullToRefreshIndicator } from '@/presentation/components/ui/pull-to-refresh-indicator'
import { SuccessToast } from '@/presentation/components/ui/success-toast'
import { cn } from '@/shared/utils'

interface MobilePageWrapperProps {
  children: ReactNode
  onRefresh?: () => Promise<void>
  enablePullToRefresh?: boolean
  className?: string
}

export function MobilePageWrapper({
  children,
  onRefresh,
  enablePullToRefresh = true,
  className,
}: MobilePageWrapperProps) {
  const { show, message, hideSuccess } = useSuccessToast()

  const { scrollableRef, pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: onRefresh || (async () => {}),
    threshold: 80,
    enabled: enablePullToRefresh && !!onRefresh,
  })

  return (
    <>
      {/* Success Toast Global */}
      <SuccessToast
        show={show}
        message={message}
        onClose={hideSuccess}
      />

      {/* Scrollable Content avec Pull-to-Refresh */}
      <div
        ref={scrollableRef}
        className={cn(
          'relative min-h-screen overflow-y-auto',
          className
        )}
      >
        {enablePullToRefresh && onRefresh && (
          <PullToRefreshIndicator
            pullDistance={pullDistance}
            isRefreshing={isRefreshing}
          />
        )}

        {children}
      </div>
    </>
  )
}
