'use client'

import * as React from 'react'
import { Home, Calendar, Star, User, Zap, Bell, ChevronDown, Settings, LogOut } from 'lucide-react'
import { cn } from '@/shared/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu'

type NavTab = 'home' | 'virtual' | 'matches' | 'favorites' | 'settings'

interface NavItem {
  id: NavTab
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'virtual', label: 'Virtual', icon: Zap },
  { id: 'matches', label: 'Matchs', icon: Calendar },
  { id: 'favorites', label: 'Favoris', icon: Star },
]

export interface DesktopHeaderProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
  user?: {
    name: string
    email: string
    avatar?: string
  }
  notificationCount?: number
  onNotificationClick?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onLogout?: () => void
  className?: string
}

export function DesktopHeader({
  activeTab,
  onTabChange,
  user,
  notificationCount = 0,
  onNotificationClick,
  onProfileClick,
  onSettingsClick,
  onLogout,
  className,
}: DesktopHeaderProps) {
  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-30',
        'hidden lg:block',
        'bg-surface-elevated/80 backdrop-blur-xl',
        'border-b border-gray-200/50',
        className
      )}
      role="banner"
    >
      <div className="max-w-7xl mx-auto h-14 flex items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 rounded-md gradient-navy flex items-center justify-center">
            <span className="text-lime font-black text-[10px] tracking-tight">BL</span>
          </div>
          <span className="text-sm font-bold text-foreground tracking-tight">
            Bet<span className="text-lime-600">Lab</span>
          </span>
        </div>

        {/* Nav — centré */}
        <nav
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gray-100/70 p-1 rounded-full"
          role="navigation"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2 rounded-full',
                  'text-[13px] font-medium',
                  'transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/20',
                  isActive
                    ? 'bg-navy text-white shadow-sm'
                    : 'text-gray-500 hover:text-navy hover:bg-white/80'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors duration-200',
                    isActive ? 'text-lime' : 'text-current'
                  )}
                />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Right — actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative flex items-center justify-center h-8 w-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount})` : ''}`}
          >
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[15px] h-[15px] px-0.5 text-[8px] font-bold text-white bg-live rounded-full ring-2 ring-surface-elevated">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>

          {/* User */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'flex items-center gap-2 pl-1 pr-2 py-1 rounded-full',
                    'hover:bg-gray-50 transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/20'
                  )}
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-[9px] font-semibold bg-navy text-lime">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-56 rounded-xl shadow-xl border border-gray-200/80 p-1.5 bg-surface-elevated">
                {/* User card */}
                <div className="flex items-center gap-3 px-2.5 py-3 rounded-lg bg-gray-50 mb-1">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-[10px] font-semibold bg-navy text-lime">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                    <p className="text-[11px] text-text-tertiary truncate">{user.email}</p>
                  </div>
                </div>

                <DropdownMenuSeparator className="bg-gray-100 my-1" />

                <DropdownMenuItem onClick={onProfileClick} className="rounded-lg cursor-pointer text-[13px] py-2 px-2.5 gap-2.5">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>Mon profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSettingsClick} className="rounded-lg cursor-pointer text-[13px] py-2 px-2.5 gap-2.5">
                  <Settings className="h-4 w-4 text-gray-400" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNotificationClick?.()} className="rounded-lg cursor-pointer text-[13px] py-2 px-2.5 gap-2.5">
                  <Bell className="h-4 w-4 text-gray-400" />
                  <span>Notifications</span>
                  {notificationCount > 0 && (
                    <span className="ml-auto text-[10px] font-bold text-white bg-live rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-100 my-1" />

                <DropdownMenuItem onClick={onLogout} className="rounded-lg cursor-pointer text-[13px] py-2 px-2.5 gap-2.5 text-red-500 focus:text-red-500 focus:bg-red-50">
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[9px] font-semibold bg-gray-100 text-gray-400">
                U
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </header>
  )
}
