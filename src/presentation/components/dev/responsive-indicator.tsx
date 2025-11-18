'use client'

import { useBreakpoint } from '@/presentation/hooks/use-breakpoint'

export function ResponsiveIndicator() {
  const { breakpoint, width, isMobile, isTablet, isDesktop } = useBreakpoint()

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-2 right-2 z-[9999] bg-black/90 text-white px-3 py-2 rounded-lg text-xs font-mono shadow-xl border border-lime/30">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lime">{breakpoint.toUpperCase()}</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">{width}px</span>
        </div>
        <div className="flex gap-1 text-[10px]">
          <span className={isMobile ? 'text-lime' : 'text-gray-500'}>Mobile</span>
          <span className="text-gray-600">·</span>
          <span className={isTablet ? 'text-lime' : 'text-gray-500'}>Tablet</span>
          <span className="text-gray-600">·</span>
          <span className={isDesktop ? 'text-lime' : 'text-gray-500'}>Desktop</span>
        </div>
      </div>
    </div>
  )
}
