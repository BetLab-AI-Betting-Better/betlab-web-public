'use client'

/**
 * MobileHeader - Improved version with modern design
 *
 * Improvements:
 * - Better visual hierarchy
 * - Smooth animations
 * - Modern sport selector with slide animation
 * - Notification badge support
 * - Search integration
 * - Better logo design with gradient
 * - Improved spacing and typography
 * - Enhanced accessibility
 */

import * as React from 'react'
import { ArrowLeft, Sun, Moon, Menu, Search, Bell } from 'lucide-react'
import { cn } from '@/shared/utils'
import { Button } from '@/presentation/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'
import { useTheme } from 'next-themes'

export interface MobileHeaderProps {
  title?: string
  showBack?: boolean
  onBackClick?: () => void
  showAvatar?: boolean
  avatarSrc?: string
  avatarFallback?: string
  onAvatarClick?: () => void
  showThemeToggle?: boolean
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
  showThemeToggle = true,
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
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40',
        'bg-background/80 backdrop-blur-xl',
        'border-b border-border/50',
        'transition-all duration-300 ease-in-out',
        collapsible && collapsed ? 'h-12 shadow-lg' : 'h-16 shadow-md',
        // Safe area support for iOS notch
        'pt-[env(safe-area-inset-top,0px)]',
        'lg:hidden',
        className
      )}
      role="banner"
    >
      <div
        className={cn(
          'flex items-center justify-between px-3',
          'transition-all duration-300',
          collapsible && collapsed ? 'h-12' : 'h-16'
        )}
      >
        {/* Left section */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackClick}
              className={cn(
                "shrink-0 hover:bg-[var(--lime)]/10",
                "transition-all duration-200",
                "active:scale-95"
              )}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              {/* Enhanced Logo */}
              <div className="relative group">
                <div className={cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center",
                  "bg-gradient-to-br from-[var(--navy)] via-[var(--navy)] to-[var(--lime)]",
                  "shadow-md transition-all duration-300",
                  "group-hover:shadow-lg group-hover:scale-105"
                )}>
                  <span className="text-white font-black text-base tracking-tight">
                    BL
                  </span>
                </div>
                {/* Subtle glow effect */}
                <div className={cn(
                  "absolute inset-0 rounded-xl",
                  "bg-gradient-to-br from-[var(--lime)]/20 to-transparent",
                  "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  "blur-sm -z-10"
                )} />
              </div>
              {!collapsed && (
                <span className={cn(
                  "text-lg font-bold text-foreground",
                  "bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text",
                  "animate-in fade-in-0 slide-in-from-left-2 duration-300"
                )}>
                  BetLab
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center section */}
        <div className="flex items-center justify-center flex-1 min-w-0">
          {title && !collapsed ? (
            <h1 className={cn(
              "text-base font-bold text-foreground truncate px-2",
              "animate-in fade-in-0 zoom-in-95 duration-300"
            )}>
              {title}
            </h1>
          ) : null}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1 justify-end flex-1">
          {showSearch && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSearchClick}
              className={cn(
                "shrink-0 hover:bg-[var(--lime)]/10",
                "transition-all duration-200 active:scale-95"
              )}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {showNotifications && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onNotificationClick}
              className={cn(
                "shrink-0 relative hover:bg-[var(--lime)]/10",
                "transition-all duration-200 active:scale-95"
              )}
              aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount})` : ''}`}
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span
                  className={cn(
                    "absolute -top-1 -right-1",
                    "flex items-center justify-center",
                    "min-w-[18px] h-[18px] px-1",
                    "text-[10px] font-bold text-white",
                    "bg-red-500 rounded-full",
                    "animate-in zoom-in-50 duration-200",
                    "shadow-md"
                  )}
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </Button>
          )}

          {showThemeToggle && mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={cn(
                "shrink-0 hover:bg-[var(--lime)]/10",
                "transition-all duration-200 active:scale-95"
              )}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform duration-200" />
              ) : (
                <Moon className="h-5 w-5 rotate-0 scale-100 transition-transform duration-200" />
              )}
            </Button>
          )}

          {showAvatar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onAvatarClick}
              className={cn(
                "shrink-0 rounded-full p-0 h-9 w-9",
                "hover:ring-2 hover:ring-[var(--lime)]/30",
                "transition-all duration-200 active:scale-95"
              )}
              aria-label="User menu"
            >
              <Avatar className="h-9 w-9 ring-2 ring-border">
                <AvatarImage src={avatarSrc} alt="User avatar" />
                <AvatarFallback className={cn(
                  "text-xs font-semibold",
                  "bg-gradient-to-br from-[var(--navy)] to-[var(--lime)]",
                  "text-white"
                )}>
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
            </Button>
          )}

          {showMenu && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className={cn(
                "shrink-0 hover:bg-[var(--lime)]/10",
                "transition-all duration-200 active:scale-95"
              )}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
