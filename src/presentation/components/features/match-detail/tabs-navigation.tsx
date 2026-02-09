"use client"

import { cn } from "@/shared/utils"

export type TabId = "overview" | "predictions" | "stats" | "lineups" | "analysis" | "value" | "h2h"

interface Tab {
  id: TabId
  label: string
}

interface TabsNavigationProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: Tab[] = [
  { id: "overview", label: "Aperçu" },
  { id: "analysis", label: "Analyse" },
  { id: "predictions", label: "Marchés" },
  { id: "stats", label: "Stats" },
  { id: "lineups", label: "Compos" },
  { id: "h2h", label: "H2H" },
  { id: "value", label: "Value" },
]

/**
 * Navigation à tabs pour la page Match Detail
 */
export function TabsNavigation({
  activeTab,
  onTabChange,
}: TabsNavigationProps) {
  return (
    <div className="sticky top-[180px] z-40 bg-background border-b">
      <div className="flex items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                // Layout
                "relative flex-1 py-4",
                // Typography
                "text-sm font-medium transition-all duration-200",
                // Mobile touch target
                "min-h-[44px]",
                // Active/Inactive states
                isActive
                  ? "text-[var(--navy)] scale-105"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-selected={isActive}
              role="tab"
            >
              {tab.label}

              {/* Animated indicator bar */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--lime)]" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
