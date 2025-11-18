'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'

export interface ShareData {
  title: string
  text: string
  url: string
}

export interface ShareResult {
  success: boolean
  method: 'share' | 'clipboard'
  error?: string
}

export function useShare() {
  const [isSharing, setIsSharing] = useState(false)

  // Vérifier si Web Share API est disponible
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator

  const share = useCallback(async (data: ShareData): Promise<ShareResult> => {
    if (isSharing) {
      return { success: false, method: 'share', error: 'Already sharing' }
    }

    setIsSharing(true)

    try {
      if (!canShare) {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(data.url)
        toast.success('Lien copié dans le presse-papier')
        setIsSharing(false)
        return { success: true, method: 'clipboard' }
      }

      await navigator.share(data)
      setIsSharing(false)
      return { success: true, method: 'share' }
    } catch (error) {
      setIsSharing(false)

      if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled the share dialog
        return { success: false, method: 'share', error: 'User cancelled' }
      }

      // Fallback to clipboard on error
      try {
        await navigator.clipboard.writeText(data.url)
        toast.success('Lien copié dans le presse-papier')
        return { success: true, method: 'clipboard' }
      } catch (clipboardError) {
        toast.error('Impossible de partager le lien')
        return { success: false, method: 'share', error: 'Failed to share' }
      }
    }
  }, [canShare, isSharing])

  return { share, canShare, isSharing }
}
