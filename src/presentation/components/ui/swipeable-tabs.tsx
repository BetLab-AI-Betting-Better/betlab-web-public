"use client"

import * as React from "react"
import { useSwipeable } from "react-swipeable"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/presentation/components/ui/tabs"
import { cn } from "@/shared/utils"

/**
 * SwipeableTabs - Mobile-optimized tabs with swipe gestures
 *
 * Features:
 * - Touch gestures for tab navigation (swipe left/right)
 * - Snap scroll horizontal on mobile
 * - Animated indicator
 * - Overflow-x-scroll with hidden scrollbar
 * - Touch-friendly trigger areas
 * - Smooth transitions
 */

interface SwipeableTabsProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Tabs>, 'value'> {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
}

interface SwipeableTabsListProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TabsList>, 'children'> {
  scrollable?: boolean
  children?: React.ReactNode
}

interface SwipeableTabsTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TabsTrigger>, 'children'> {
  value: string
  children?: React.ReactNode
}

interface SwipeableTabsContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TabsContent>, 'children'> {
  value: string
  swipeable?: boolean
  children?: React.ReactNode
}

const SwipeableTabsContext = React.createContext<{
  activeTab: string
  setActiveTab: (value: string) => void
  tabs: string[]
  registerTab: (value: string) => void
}>({
  activeTab: "",
  setActiveTab: () => {},
  tabs: [],
  registerTab: () => {},
})

function SwipeableTabs({
  children,
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  ...props
}: SwipeableTabsProps) {
  const [activeTab, setActiveTab] = React.useState(
    controlledValue || defaultValue
  )
  const [tabs, setTabs] = React.useState<string[]>([])

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setActiveTab(controlledValue)
    }
  }, [controlledValue])

  const handleValueChange = React.useCallback(
    (value: string) => {
      setActiveTab(value)
      onValueChange?.(value)
    },
    [onValueChange]
  )

  const registerTab = React.useCallback((value: string) => {
    setTabs((prev) => {
      if (!prev.includes(value)) {
        return [...prev, value]
      }
      return prev
    })
  }, [])

  return (
    <SwipeableTabsContext.Provider
      value={{ activeTab, setActiveTab: handleValueChange, tabs, registerTab }}
    >
      <Tabs
        value={activeTab}
        onValueChange={handleValueChange}
        className={cn("w-full", className)}
        {...props}
      >
        {children}
      </Tabs>
    </SwipeableTabsContext.Provider>
  )
}

function SwipeableTabsList({
  children,
  className,
  scrollable = true,
  ...props
}: SwipeableTabsListProps) {
  const listRef = React.useRef<HTMLDivElement>(null)

  return (
    <TabsList
      ref={listRef}
      className={cn(
        // Base styles
        "w-full justify-start",
        // Scrollable on mobile
        scrollable && [
          "overflow-x-auto overflow-y-hidden",
          "snap-x snap-mandatory",
          // Hide scrollbar
          "scrollbar-none",
          "[&::-webkit-scrollbar]:hidden",
          "[-ms-overflow-style:none]",
          "[scrollbar-width:none]",
        ],
        // Smooth scrolling
        "scroll-smooth",
        className
      )}
      {...props}
    >
      {children}
    </TabsList>
  )
}

function SwipeableTabsTrigger({
  children,
  value,
  className,
  ...props
}: SwipeableTabsTriggerProps) {
  const { registerTab } = React.useContext(SwipeableTabsContext)

  React.useEffect(() => {
    registerTab(value)
  }, [value, registerTab])

  return (
    <TabsTrigger
      value={value}
      className={cn(
        // Touch-friendly sizing
        "min-h-[44px] px-6",
        // Snap point for scrolling
        "snap-start",
        // Prevent text selection on swipe
        "select-none",
        // Better touch feedback
        "active:scale-95",
        "transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </TabsTrigger>
  )
}

function SwipeableTabsContent({
  children,
  value,
  swipeable = true,
  className,
  ...props
}: SwipeableTabsContentProps) {
  const { activeTab, setActiveTab, tabs } = React.useContext(
    SwipeableTabsContext
  )

  const currentIndex = tabs.indexOf(activeTab)
  const nextTab = tabs[currentIndex + 1]
  const prevTab = tabs[currentIndex - 1]

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (swipeable && nextTab) {
        setActiveTab(nextTab)
      }
    },
    onSwipedRight: () => {
      if (swipeable && prevTab) {
        setActiveTab(prevTab)
      }
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50,
    preventScrollOnSwipe: false,
    // Only trigger swipe on horizontal gestures
    swipeDuration: 500,
  })

  return (
    <TabsContent
      value={value}
      className={cn(
        // Smooth entrance animation
        "data-[state=active]:animate-in",
        "data-[state=active]:fade-in-0",
        "data-[state=active]:slide-in-from-right-4",
        "data-[state=inactive]:animate-out",
        "data-[state=inactive]:fade-out-0",
        // Ensure swipe works
        swipeable && "touch-pan-y",
        className
      )}
      {...(swipeable ? handlers : {})}
      {...props}
    >
      {children}
    </TabsContent>
  )
}

export {
  SwipeableTabs,
  SwipeableTabsList,
  SwipeableTabsTrigger,
  SwipeableTabsContent,
}
