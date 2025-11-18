"use client"

import { Search, X } from "lucide-react"
import { cn } from "@/shared/utils"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Rechercher une équipe ou une ligue...",
  className
}: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="relative flex items-center">
        {/* Search Icon */}
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full h-14 pl-12 pr-12 rounded-lg",
            "bg-muted/50 border border-border",
            "text-base text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent",
            "transition-all duration-200"
          )}
          aria-label="Rechercher des matchs"
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={() => onChange("")}
            className={cn(
              "absolute right-4 p-1.5 rounded-md",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-muted transition-colors"
            )}
            aria-label="Effacer la recherche"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Results count */}
      {value && (
        <div className="absolute left-0 -bottom-5 text-xs text-muted-foreground">
          Recherche active
        </div>
      )}
    </div>
  )
}
