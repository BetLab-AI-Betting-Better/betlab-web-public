"use client"

import React from "react"

type ToastVariant = "default" | "destructive"

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastState {
  toasts: Toast[]
}

type Action =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "REMOVE_TOAST"; id: string }

const toastReducer = (state: ToastState, action: Action): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      }
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      }
    default:
      return state
  }
}

const ToastContext = React.createContext<{
  toasts: Toast[]
  toast: (props: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] })

  const toast = React.useCallback(
    ({ duration = 5000, ...props }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9)
      dispatch({ type: "ADD_TOAST", toast: { ...props, id, duration } })

      if (duration > 0) {
        setTimeout(() => {
          dispatch({ type: "REMOVE_TOAST", id })
        }, duration)
      }
    },
    []
  )

  const dismiss = React.useCallback((id: string) => {
    dispatch({ type: "REMOVE_TOAST", id })
  }, [])

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
