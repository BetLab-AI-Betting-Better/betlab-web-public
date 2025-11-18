"use client"

import { usePathname, useRouter } from "next/navigation"
import { useCallback } from "react"

export type NavRoute = "home" | "matches" | "favorites" | "settings"

export function useNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  // Détermine la route active basée sur le pathname
  const getActiveRoute = useCallback((): NavRoute => {
    if (pathname === "/") return "home"
    if (pathname.startsWith("/matches")) return "matches"
    if (pathname.startsWith("/favorites")) return "favorites"
    if (pathname.startsWith("/settings")) return "settings"
    return "home"
  }, [pathname])

  // Navigation helpers
  const navigateToHome = useCallback(() => {
    router.push("/")
  }, [router])

  const navigateToMatches = useCallback(() => {
    router.push("/matches")
  }, [router])

  const navigateToFavorites = useCallback(() => {
    router.push("/favorites")
  }, [router])

  const navigateToSettings = useCallback(() => {
    router.push("/settings")
  }, [router])

  // Navigation générique
  const navigateTo = useCallback((route: NavRoute) => {
    switch (route) {
      case "home":
        navigateToHome()
        break
      case "matches":
        navigateToMatches()
        break
      case "favorites":
        navigateToFavorites()
        break
      case "settings":
        navigateToSettings()
        break
    }
  }, [navigateToHome, navigateToMatches, navigateToFavorites, navigateToSettings])

  return {
    activeRoute: getActiveRoute(),
    pathname,
    navigateToHome,
    navigateToMatches,
    navigateToFavorites,
    navigateToSettings,
    navigateTo,
    router,
  }
}
