'use client'

import { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHapticFeedback } from '@/presentation/hooks/use-haptic-feedback'

interface SuccessToastProps {
  show: boolean
  message: string
  onClose: () => void
  duration?: number
}

export function SuccessToast({
  show,
  message,
  onClose,
  duration = 3000,
}: SuccessToastProps) {
  const { vibrate } = useHapticFeedback()

  useEffect(() => {
    if (show) {
      vibrate('success')
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose, vibrate])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-sm"
        >
          <div className="flex items-center gap-3 bg-lime text-navy p-4 rounded-lg shadow-lg">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
