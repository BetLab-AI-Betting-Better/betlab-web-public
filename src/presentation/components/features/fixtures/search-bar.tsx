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
  placeholder = "Rechercher une equipe ou ligue...",
  className
}: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full h-10 pl-10 pr-10 rounded-xl",
            "bg-gray-50 border border-gray-200/80",
            "text-sm text-text-primary placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-navy/15 focus:border-navy/30 focus:bg-white",
            "transition-all duration-200"
          )}
          aria-label="Rechercher des matchs"
        />

        {value && (
          <button
            onClick={() => onChange("")}
            className={cn(
              "absolute right-3 p-1 rounded-md",
              "text-gray-400 hover:text-navy",
              "hover:bg-gray-100 transition-colors"
            )}
            aria-label="Effacer la recherche"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
