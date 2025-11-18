"use client"

import * as React from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog"
import { cn } from "@/shared/utils"

/**
 * Modal - Responsive modal component
 *
 * Features:
 * - Full screen on mobile (<768px)
 * - Normal centered modal on desktop
 * - Slide-up animation on mobile
 * - Close button always accessible (top-right)
 * - Dark mode support
 * - Accessible (ARIA labels)
 */

interface ModalProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface ModalContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DialogContent>, "showCloseButton"> {
  variant?: "default" | "mobile-fullscreen"
}

function Modal({ children, ...props }: ModalProps) {
  return <Dialog {...props}>{children}</Dialog>
}

function ModalTrigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogTrigger>) {
  return <DialogTrigger {...props}>{children}</DialogTrigger>
}

function ModalContent({
  className,
  children,
  variant = "default",
  ...props
}: ModalContentProps) {
  return (
    <DialogContent
      className={cn(
        // Base responsive styles
        variant === "mobile-fullscreen" && [
          // Mobile: full screen with slide-up animation
          "md:max-w-lg md:rounded-lg",
          "max-md:w-screen max-md:h-screen max-md:max-w-none",
          "max-md:rounded-none max-md:border-0",
          "max-md:top-0 max-md:left-0",
          "max-md:translate-x-0 max-md:translate-y-0",
          "max-md:data-[state=open]:slide-in-from-bottom",
          "max-md:data-[state=closed]:slide-out-to-bottom",
          // Smooth transitions
          "max-md:duration-300",
        ],
        variant === "default" && [
          // Default: centered modal on all screen sizes
          "max-w-lg",
          // Mobile optimizations
          "max-md:max-w-[calc(100vw-2rem)]",
          "max-md:max-h-[85vh]",
        ],
        // Common styles
        "flex flex-col",
        "overflow-hidden",
        className
      )}
      showCloseButton={true}
      {...props}
    >
      {/* Scrollable content wrapper */}
      <div className="overflow-y-auto flex-1">
        {children}
      </div>
    </DialogContent>
  )
}

function ModalHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogHeader>) {
  return (
    <DialogHeader
      className={cn(
        "px-6 pt-6 pb-4",
        "border-b border-gray-light",
        "shrink-0",
        className
      )}
      {...props}
    />
  )
}

function ModalFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogFooter>) {
  return (
    <DialogFooter
      className={cn(
        "px-6 py-4",
        "border-t border-gray-light",
        "mt-auto shrink-0",
        // Mobile: full-width stacked buttons
        "max-md:flex-col max-md:gap-3",
        // Desktop: horizontal layout
        "md:flex-row md:gap-2",
        className
      )}
      {...props}
    />
  )
}

function ModalTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogTitle>) {
  return (
    <DialogTitle
      className={cn(
        "text-2xl font-semibold text-text-primary",
        "max-md:text-xl",
        className
      )}
      {...props}
    />
  )
}

function ModalDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogDescription>) {
  return (
    <DialogDescription
      className={cn(
        "text-text-secondary",
        "mt-2",
        className
      )}
      {...props}
    />
  )
}

function ModalClose({
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogClose>) {
  return <DialogClose {...props} />
}

function ModalBody({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "px-6 py-4",
        "text-text-primary",
        className
      )}
      {...props}
    />
  )
}

export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
  ModalBody,
}
