'use client'

import { WifiOff, RefreshCw } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-background">
      <div className="flex flex-col items-center text-center max-w-md">
        {/* Icon */}
        <div className="mb-6 p-6 rounded-full bg-muted">
          <WifiOff className="w-16 h-16 text-muted-foreground" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-3 text-foreground">
          Hors ligne
        </h1>

        {/* Description */}
        <p className="text-muted-foreground mb-8 text-lg">
          Vous êtes actuellement hors ligne. Vérifiez votre connexion internet pour accéder à BetLab.
        </p>

        {/* Retry Button */}
        <Button
          onClick={() => window.location.reload()}
          className="gap-2"
          size="lg"
        >
          <RefreshCw className="w-5 h-5" />
          Réessayer
        </Button>

        {/* Additional Info */}
        <div className="mt-12 p-4 rounded-lg bg-card border">
          <h3 className="font-semibold mb-2 text-sm">Conseils</h3>
          <ul className="text-sm text-muted-foreground space-y-1 text-left">
            <li>• Vérifiez votre connexion Wi-Fi ou données mobiles</li>
            <li>• Activez le mode avion puis désactivez-le</li>
            <li>• Essayez de vous rapprocher de votre routeur</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
