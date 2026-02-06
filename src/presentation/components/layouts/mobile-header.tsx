'use client'

import * as React from 'react'
import { ArrowLeft, Menu, Search, Bell } from 'lucide-react'
import { cn } from '@/shared/utils'
import { Button } from '@/presentation/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'

export interface MobileHeaderProps {
  title?: string
  showBack?: boolean
  onBackClick?: () => void
  showAvatar?: boolean
  avatarSrc?: string
  avatarFallback?: string
  onAvatarClick?: () => void
  showMenu?: boolean
  onMenuClick?: () => void
  showSearch?: boolean
  onSearchClick?: () => void
  showNotifications?: boolean
  notificationCount?: number
  onNotificationClick?: () => void
  collapsible?: boolean
  collapsed?: boolean
  className?: string
}

export function MobileHeader({
  title,
  showBack = false,
  onBackClick,
  showAvatar = true,
  avatarSrc,
  avatarFallback = 'U',
  onAvatarClick,
  showMenu = false,
  onMenuClick,
  showSearch = false,
  onSearchClick,
  showNotifications = false,
  notificationCount = 0,
  onNotificationClick,
  collapsible = false,
  collapsed = false,
  className,
}: MobileHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40',
        'glass',
        'border-b border-gray-200/40',
        'transition-all duration-300 ease-out',
        collapsible && collapsed ? 'h-12' : 'h-14',
        'pt-[env(safe-area-inset-top,0px)]',
        'lg:hidden',
        className
      )}
      role="banner"
    >
      <div
        className={cn(
          'flex items-center justify-between px-4',
          'transition-all duration-300',
          collapsible && collapsed ? 'h-12' : 'h-14'
        )}
      >
        {/* Left section */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onBackClick}
              className="shrink-0 hover:bg-gray-100 active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <div className="h-8 w-8 rounded-lg bg-navy flex items-center justify-center shadow-sm">
                <span className="text-lime font-black text-xs tracking-tight">BL</span>
              </div>
              {!collapsed && (
                <span className="text-base font-bold text-foreground tracking-tight">
                  Bet<span className="text-lime">Lab</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center section */}
        <div className="flex items-center justify-center flex-1 min-w-0">
          {title && !collapsed ? (
            <h1 className="text-sm font-semibold text-foreground truncate px-2 tracking-tight">
              {title}
            </h1>
          ) : null}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-0.5 justify-end flex-1">
          {showSearch && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onSearchClick}
              className="shrink-0 hover:bg-gray-100 active:scale-95"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px] text-gray-500" />
            </Button>
          )}

          {showNotifications && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onNotificationClick}
              className="shrink-0 relative hover:bg-gray-100 active:scale-95"
              aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount})` : ''}`}
            >
              <Bell className="h-[18px] w-[18px] text-gray-500" />
              {notificationCount > 0 && (
                <span
                  className={cn(
                    'absolute -top-0.5 -right-0.5',
                    'flex items-center justify-center',
                    'min-w-[16px] h-[16px] px-1',
                    'text-[9px] font-bold text-white',
                    'bg-live rounded-full',
                    'shadow-sm'
                  )}
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </Button>
          )}

          {showAvatar && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onAvatarClick}
              className="shrink-0 rounded-full p-0 h-8 w-8 hover:ring-2 hover:ring-lime/20 active:scale-95"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8 ring-1 ring-gray-200">
                <AvatarImage src={avatarSrc} alt="User avatar" />
                <AvatarFallback className="text-[10px] font-semibold bg-navy text-lime">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
            </Button>
          )}

          {showMenu && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onMenuClick}
              className="shrink-0 hover:bg-gray-100 active:scale-95"
              aria-label="Open menu"
            >
              <Menu className="h-[18px] w-[18px] text-gray-500" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
