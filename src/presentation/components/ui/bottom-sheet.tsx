"use client"

import * as React from "react"
import { useSwipeable } from "react-swipeable"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/presentation/components/ui/sheet"
import { cn } from "@/shared/utils"

/**
 * BottomSheet - Mobile-optimized sheet component
 *
 * Features:
 * - Slides from bottom on mobile
 * - Swipe down to dismiss
 * - Backdrop blur effect
 * - Safe area insets for iOS
 * - Max height: 90vh
 * - Rounded top corners
 * - Drag handle indicator
 */

interface BottomSheetProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type SheetContentProps = Omit<React.ComponentPropsWithoutRef<typeof SheetContent>, "ref">

interface BottomSheetContentProps extends SheetContentProps {
  showHandle?: boolean
  swipeable?: boolean
  maxHeight?: string
}

function BottomSheet({ children, ...props }: BottomSheetProps) {
  return <Sheet {...props}>{children}</Sheet>
}

function BottomSheetTrigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SheetTrigger>) {
  return <SheetTrigger {...props}>{children}</SheetTrigger>
}

function BottomSheetContent({
  className,
  children,
  showHandle = true,
  swipeable = true,
  maxHeight = "90vh",
  ...props
}: BottomSheetContentProps) {
  const [isDragging, setIsDragging] = React.useState(false)

  // Swipeable handlers for dismiss gesture
  const handlers = useSwipeable({
    onSwipedDown: (eventData) => {
      // Only close if swiped down with enough velocity
      if (eventData.velocity > 0.3 && swipeable) {
        // Trigger close via ESC key simulation
        const event = new KeyboardEvent('keydown', { key: 'Escape' })
        document.dispatchEvent(event)
      }
    },
    onSwiping: (eventData) => {
      if (eventData.dir === "Down") {
        setIsDragging(true)
      }
    },
    onSwiped: () => {
      setIsDragging(false)
    },
    trackMouse: false,
    trackTouch: true,
    delta: 10,
    preventScrollOnSwipe: false,
  })

  return (
    <SheetContent
      side="bottom"
      className={cn(
        // Base styles
        "rounded-t-2xl border-t-0",
        // Mobile-first layout
        "w-full p-0",
        // Max height with safe area insets
        `max-h-[${maxHeight}]`,
        "pb-[env(safe-area-inset-bottom)]",
        // Backdrop blur
        "backdrop-blur-sm",
        // Smooth animations
        "transition-transform duration-300 ease-out",
        // Dragging state
        isDragging && "transition-none",
        className
      )}
      {...handlers}
      {...props}
    >
      {/* Drag handle indicator */}
      {showHandle && (
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-light rounded-full" />
        </div>
      )}

      {/* Scrollable content area */}
      <div className="overflow-y-auto max-h-[calc(90vh-env(safe-area-inset-bottom)-48px)]">
        {children}
      </div>
    </SheetContent>
  )
}

function BottomSheetHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SheetHeader>) {
  return (
    <SheetHeader
      className={cn(
        "px-6 pt-2 pb-4 border-b border-gray-light",
        className
      )}
      {...props}
    />
  )
}

function BottomSheetFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SheetFooter>) {
  return (
    <SheetFooter
      className={cn(
        "px-6 py-4 border-t border-gray-light mt-auto",
        "flex-row gap-3",
        className
      )}
      {...props}
    />
  )
}

function BottomSheetTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SheetTitle>) {
  return (
    <SheetTitle
      className={cn("text-xl text-center", className)}
      {...props}
    />
  )
}

function BottomSheetDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SheetDescription>) {
  return (
    <SheetDescription
      className={cn("text-center text-text-secondary", className)}
      {...props}
    />
  )
}

function BottomSheetClose({
  ...props
}: React.ComponentPropsWithoutRef<typeof SheetClose>) {
  return <SheetClose {...props} />
}

export {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetFooter,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetClose,
}
