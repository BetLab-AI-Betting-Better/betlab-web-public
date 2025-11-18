'use client'

import * as React from 'react'
import { Home, Calendar, Star, User } from 'lucide-react'
import { cn } from '@/shared/utils'

export interface MobileBottomNavProps {
  activeTab: 'home' | 'matches' | 'favorites' | 'settings'
  onTabChange: (tab: 'home' | 'matches' | 'favorites' | 'settings') => void
  notifications?: {
    matches?: number
    favorites?: number
  }
  className?: string
}

interface NavItem {
  id: 'home' | 'matches' | 'favorites' | 'settings'
  label: string
  icon: React.ComponentType<{ className?: string }>
  ariaLabel: string
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    ariaLabel: 'Navigate to home',
  },
  {
    id: 'matches',
    label: 'Matches',
    icon: Calendar,
    ariaLabel: 'View matches',
  },
  {
    id: 'favorites',
    label: 'Favorites',
    icon: Star,
    ariaLabel: 'View favorites',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: User,
    ariaLabel: 'Open settings',
  },
]

export function MobileBottomNav({
  activeTab,
  onTabChange,
  notifications,
  className,
}: MobileBottomNavProps) {
  const handleTabClick = (tabId: typeof activeTab) => {
    // Trigger haptic feedback if supported
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }

    onTabChange(tabId)
  }

  const handleKeyDown = (
    e: React.KeyboardEvent,
    tabId: typeof activeTab
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleTabClick(tabId)
    }
  }

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'h-16 bg-background/95 backdrop-blur-md',
        'border-t border-border',
        'transition-transform duration-200 ease-in-out',
        'lg:hidden',
        // Safe area support for iOS notch
        'pb-[env(safe-area-inset-bottom,0px)]',
        className
      )}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex h-16 items-center justify-around px-2">
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
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              className={cn(
                'relative flex flex-col items-center justify-center',
                'w-16 h-16',
                'transition-all duration-200 ease-in-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'active:scale-95',
                isActive && 'scale-110'
              )}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Notification badge */}
              {hasNotification && (
                <span
                  className={cn(
                    'absolute top-1 right-3',
                    'flex items-center justify-center',
                    'min-w-[18px] h-[18px] px-1',
                    'text-[10px] font-bold text-white',
                    'bg-red-500 rounded-full',
                    'animate-in zoom-in-50',
                    notificationCount && notificationCount > 99 ? 'px-1.5' : ''
                  )}
                  aria-label={`${notificationCount} notifications`}
                >
                  {notificationCount && notificationCount > 99
                    ? '99+'
                    : notificationCount}
                </span>
              )}

              {/* Icon */}
              <Icon
                className={cn(
                  'w-6 h-6 transition-colors duration-200',
                  isActive
                    ? 'text-[hsl(var(--navy))]'
                    : 'text-muted-foreground'
                )}
              />

              {/* Label */}
              <span
                className={cn(
                  'mt-1 text-xs font-medium transition-colors duration-200',
                  isActive
                    ? 'text-[hsl(var(--navy))]'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[hsl(var(--navy))] rounded-full"
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
