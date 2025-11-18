'use client'

import { useState, useEffect } from 'react'
import { X, Download } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after 30s or after user visits 3 pages
      const visitCount = parseInt(localStorage.getItem('visitCount') || '0')
      localStorage.setItem('visitCount', String(visitCount + 1))

      // Ne pas afficher si dismissed récemment
      const dismissed = localStorage.getItem('installPromptDismissed')
      if (dismissed) {
        const daysSince = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24)
        if (daysSince < 7) return
      }

      // Afficher après 3 visites
      if (visitCount >= 2) {
        setTimeout(() => setShowPrompt(true), 30000) // 30s delay
      }
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('installPromptDismissed', Date.now().toString())
  }

  if (!showPrompt || !deferredPrompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 lg:left-auto lg:right-4 lg:w-96 animate-in slide-in-from-bottom-5">
      <div className="bg-card border border-lime/20 rounded-lg shadow-xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-lime" />
            <h3 className="font-semibold text-foreground">Installer BetLab</h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Installez l&apos;application pour un accès rapide et une expérience optimisée.
        </p>

        <div className="flex gap-2">
          <Button onClick={handleInstall} className="flex-1" variant="default">
            Installer
          </Button>
          <Button onClick={handleDismiss} variant="outline">
            Plus tard
          </Button>
        </div>
      </div>
    </div>
  )
}
