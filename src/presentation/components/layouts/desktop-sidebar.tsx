'use client'

import * as React from 'react'
import { Home, Calendar, Star, User, LogOut, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { cn } from '@/shared/utils'
import { Button } from '@/presentation/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/presentation/components/ui/tooltip'

export interface DesktopSidebarProps {
  activeTab: 'home' | 'virtual' | 'matches' | 'favorites' | 'settings'
  onTabChange: (tab: 'home' | 'virtual' | 'matches' | 'favorites' | 'settings') => void
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

export function DesktopSidebar({
  activeTab,
  onTabChange,
  collapsed = false,
  onToggleCollapse,
  user,
  onLogout,
  className,
}: DesktopSidebarProps) {
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
          'transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/40',
          'group relative',
          isActive
            ? 'bg-white/[0.12] text-white font-medium'
            : 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]',
          collapsed && 'justify-center px-2'
        )}
        aria-label={item.ariaLabel}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className={cn('h-5 w-5 shrink-0 transition-colors', isActive && 'text-lime')} />

        {!collapsed && (
          <span className="text-sm transition-opacity duration-200 opacity-100">
            {item.label}
          </span>
        )}

        {isActive && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-lime rounded-r-full animate-slide-in"
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
          'gradient-sidebar',
          'hidden lg:flex flex-col',
          'transition-all duration-300 ease-in-out',
          'border-r border-white/[0.06]',
          collapsed ? 'w-[72px]' : 'w-[260px]',
          className
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo & Collapse */}
        <div
          className={cn(
            'flex items-center justify-between p-5 border-b border-white/[0.06]',
            collapsed && 'justify-center p-4'
          )}
        >
          {!collapsed ? (
            <>
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-lime flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-navy-950 font-black text-sm tracking-tight">BL</span>
                </div>
                <span className="text-lg font-bold text-white tracking-tight">
                  Bet<span className="text-lime">Lab</span>
                </span>
              </div>
              {onToggleCollapse && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onToggleCollapse}
                  className="shrink-0 text-white/40 hover:text-white/70 hover:bg-white/[0.06]"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-lime flex items-center justify-center shadow-md">
                <span className="text-navy-950 font-black text-sm tracking-tight">BL</span>
              </div>
              {onToggleCollapse && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onToggleCollapse}
                  className="h-7 w-7 text-white/40 hover:text-white/70 hover:bg-white/[0.06]"
                  aria-label="Expand sidebar"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map((item) => (
            <NavButton key={item.id} item={item} />
          ))}
        </nav>

        {/* User profile & Logout */}
        <div className="border-t border-white/[0.06] p-3 space-y-2">
          {user && (
            <div
              className={cn(
                'flex items-center gap-3 p-2.5 rounded-lg',
                'bg-white/[0.04]',
                collapsed && 'justify-center p-2'
              )}
            >
              <Avatar className={cn('shrink-0 ring-2 ring-lime/30', collapsed ? 'h-8 w-8' : 'h-9 w-9')}>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs font-semibold bg-navy-700 text-white">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>

              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-white/40 truncate">
                    {user.email}
                  </p>
                </div>
              )}
            </div>
          )}

          {onLogout && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={collapsed ? 'icon-sm' : 'default'}
                  onClick={onLogout}
                  className={cn(
                    'w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/10',
                    !collapsed && 'justify-start'
                  )}
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  {!collapsed && <span className="ml-2 text-sm">Déconnexion</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="font-medium">
                  Déconnexion
                </TooltipContent>
              )}
            </Tooltip>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
