'use client'

import * as React from 'react'
import { Home, Calendar, Star, User, Zap } from 'lucide-react'
import { cn } from '@/shared/utils'

export interface MobileBottomNavProps {
  activeTab: 'home' | 'virtual' | 'matches' | 'favorites' | 'settings'
  onTabChange: (tab: 'home' | 'virtual' | 'matches' | 'favorites' | 'settings') => void
  notifications?: {
    matches?: number
    favorites?: number
  }
  className?: string
}

interface NavItem {
  id: 'home' | 'virtual' | 'matches' | 'favorites' | 'settings'
  label: string
  icon: React.ComponentType<{ className?: string }>
  ariaLabel: string
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, ariaLabel: 'Navigate to home' },
  { id: 'virtual', label: 'Virtual', icon: Zap, ariaLabel: 'Virtual Match Builder' },
  { id: 'matches', label: 'Matches', icon: Calendar, ariaLabel: 'View matches' },
  { id: 'favorites', label: 'Favoris', icon: Star, ariaLabel: 'View favorites' },
  { id: 'settings', label: 'Compte', icon: User, ariaLabel: 'Open settings' },
]

export function MobileBottomNav({
  activeTab,
  onTabChange,
  notifications,
  className,
}: MobileBottomNavProps) {
  const handleTabClick = (tabId: typeof activeTab) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }
    onTabChange(tabId)
  }

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-surface-elevated/95 backdrop-blur-xl',
        'border-t border-gray-200/60',
        'transition-transform duration-200 ease-in-out',
        'lg:hidden',
        'pb-[env(safe-area-inset-bottom,0px)]',
        className
      )}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex h-[56px] items-center justify-around px-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          const hasNotification =
            (item.id === 'matches' && notifications?.matches) ||
            (item.id === 'favorites' && notifications?.favorites)
          const notificationCount =
            item.id === 'matches'
              ? notifications?.matches
              : item.id === 'favorites'
                ? notifications?.favorites
                : undefined

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={cn(
                'relative flex flex-col items-center justify-center',
                'w-14 h-14',
                'transition-all duration-200 ease-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'active:scale-95'
              )}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Notification badge */}
              {hasNotification && (
                <span
                  className={cn(
                    'absolute top-0.5 right-1.5',
                    'flex items-center justify-center',
                    'min-w-[16px] h-[16px] px-1',
                    'text-[9px] font-bold text-white',
                    'bg-live rounded-full',
                    'animate-in zoom-in-50'
                  )}
                  aria-label={`${notificationCount} notifications`}
                >
                  {notificationCount && notificationCount > 99
                    ? '99+'
                    : notificationCount}
                </span>
              )}

              {/* Active pill background */}
              {isActive && (
                <span
                  className="absolute top-1 inset-x-2 h-[30px] bg-lime/15 rounded-lg animate-slide-in"
                  aria-hidden="true"
                />
              )}

              {/* Icon */}
              <Icon
                className={cn(
                  'w-5 h-5 transition-all duration-200 relative z-10',
                  isActive
                    ? 'text-navy stroke-[2.5px]'
                    : 'text-gray-400'
                )}
              />

              {/* Label */}
              <span
                className={cn(
                  'mt-0.5 text-[10px] transition-all duration-200 relative z-10',
                  isActive
                    ? 'text-navy font-semibold'
                    : 'text-gray-400 font-medium'
                )}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
