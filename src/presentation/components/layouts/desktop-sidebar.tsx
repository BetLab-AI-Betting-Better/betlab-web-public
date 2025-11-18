'use client'

import * as React from 'react'
import { Home, Calendar, Star, User, LogOut, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react'
import { cn } from '@/shared/utils'
import { Button } from '@/presentation/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'
import { useTheme } from 'next-themes'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/presentation/components/ui/tooltip'

export interface DesktopSidebarProps {
  activeTab: 'home' | 'matches' | 'favorites' | 'settings'
  onTabChange: (tab: 'home' | 'matches' | 'favorites' | 'settings') => void
  collapsed?: boolean
  onToggleCollapse?: () => void
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onLogout?: () => void
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

export function DesktopSidebar({
  activeTab,
  onTabChange,
  collapsed = false,
  onToggleCollapse,
  user,
  onLogout,
  className,
}: DesktopSidebarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const NavButton = ({ item }: { item: NavItem }) => {
    const Icon = item.icon
    const isActive = activeTab === item.id

    const button = (
      <button
        onClick={() => onTabChange(item.id)}
        className={cn(
          'flex items-center gap-3 w-full',
          'px-3 py-2.5 rounded-lg',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'group relative',
          isActive
            ? 'bg-[hsl(var(--navy))]/10 text-[hsl(var(--navy))] font-medium'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          collapsed && 'justify-center px-2'
        )}
        aria-label={item.ariaLabel}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-[hsl(var(--navy))]')} />

        {!collapsed && (
          <span className="transition-opacity duration-200 opacity-100">
            {item.label}
          </span>
        )}

        {isActive && (
          <span
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2',
              'w-1 h-8 bg-[hsl(var(--navy))] rounded-r-full',
              'transition-all duration-200'
            )}
            aria-hidden="true"
          />
        )}
      </button>
    )

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      )
    }

    return button
  }

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen',
          'bg-background border-r border-border',
          'hidden lg:flex flex-col',
          'transition-all duration-300 ease-in-out',
          collapsed ? 'w-20' : 'w-72',
          className
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Top section - Logo & Collapse button */}
        <div
          className={cn(
            'flex items-center justify-between p-6 border-b border-border',
            collapsed && 'justify-center p-4'
          )}
        >
          {!collapsed ? (
            <>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--navy))] flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-lg">BL</span>
                </div>
                <span className="text-xl font-bold text-foreground">BetLab</span>
              </div>
              {onToggleCollapse && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleCollapse}
                  className="shrink-0"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-[hsl(var(--navy))] flex items-center justify-center">
                <span className="text-white font-bold text-lg">BL</span>
              </div>
              {onToggleCollapse && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleCollapse}
                  className="h-8 w-8"
                  aria-label="Expand sidebar"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Middle section - Navigation items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <NavButton key={item.id} item={item} />
          ))}
        </nav>

        {/* Bottom section - User profile & actions */}
        <div className="border-t border-border p-4 space-y-2">
          {/* Theme toggle */}
          {mounted && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={collapsed ? 'icon' : 'default'}
                  onClick={toggleTheme}
                  className={cn('w-full', !collapsed && 'justify-start')}
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                  {!collapsed && (
                    <span className="ml-3">
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="font-medium">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </TooltipContent>
              )}
            </Tooltip>
          )}

          {/* User profile */}
          {user && (
            <div
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg',
                'bg-accent/50',
                collapsed && 'justify-center p-2'
              )}
            >
              <Avatar className={cn('shrink-0', collapsed ? 'h-8 w-8' : 'h-10 w-10')}>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-sm font-medium">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>

              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Logout button */}
          {onLogout && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={collapsed ? 'icon' : 'default'}
                  onClick={onLogout}
                  className={cn(
                    'w-full text-destructive hover:text-destructive hover:bg-destructive/10',
                    !collapsed && 'justify-start'
                  )}
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Logout</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="font-medium">
                  Logout
                </TooltipContent>
              )}
            </Tooltip>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
