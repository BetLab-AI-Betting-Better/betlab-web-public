/**
 * Export central pour tous les composants UI
 * Permet des imports simplifiés: import { Button, Input } from "@/presentation/components/ui"
 */

// Composants shadcn de base
export { Button } from "./button"
export { Input } from "./input"
export { Textarea } from "./textarea"
export { Label } from "./label"
export { Checkbox } from "./checkbox"
export { Switch } from "./switch"
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./card"
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog"
export { Alert, AlertTitle, AlertDescription } from "./alert"
export { Skeleton } from "./skeleton"

// Select avec tous ses sous-composants
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./select"

// Radio Group
export { RadioGroup, RadioGroupItem } from "./radio-group"

// Form avec tous ses composants
export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField,
} from "./form"

// Composants custom
export { PasswordInput } from "./password-input"
export { FormError } from "./form-error"
export { FormFieldWrapper } from "./form-field"

// Toast (Sonner)
export { Toaster } from "./sonner"

// Alert Dialog
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./alert-dialog"

// Composants d'états de feedback BetLab
export { Spinner, spinnerVariants } from "./spinner"
export { LoadingState, loadingStateVariants } from "./loading-state"
export { ErrorState } from "./error-state"
export { EmptyState } from "./empty-state"
export { SuccessAnimation } from "./success-animation"

// Skeleton Loaders spécialisés
export { SkeletonCard } from "./skeleton-card"
export { SkeletonList } from "./skeleton-list"

// Types des composants feedback
export type { SpinnerProps } from "./spinner"
export type { LoadingStateProps } from "./loading-state"
export type { ErrorStateProps } from "./error-state"
export type { EmptyStateProps } from "./empty-state"
export type { SuccessAnimationProps } from "./success-animation"
export type { SkeletonCardProps } from "./skeleton-card"
export type { SkeletonListProps } from "./skeleton-list"

// Composants de navigation et overlay - BATCH 1 Agent 3
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "./sheet"
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs"
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./dropdown-menu"
export { Popover, PopoverTrigger, PopoverContent } from "./popover"
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "./command"

// Variants mobile-optimized - Agent 3
export {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetFooter,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetClose,
} from "./bottom-sheet"

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
} from "./modal"

export {
  SwipeableTabs,
  SwipeableTabsList,
  SwipeableTabsTrigger,
  SwipeableTabsContent,
} from "./swipeable-tabs"

// Badges & Chips spécialisés - BATCH 2 Agent 1
export { Badge, badgeVariants } from "./badge"
export { ConfidenceBadge, confidenceBadgeVariants } from "./confidence-badge"
export { EdgeChip, edgeChipVariants, getEdgeCategory, formatEdge } from "./edge-chip"
export { LiveBadge, liveBadgeVariants } from "./live-badge"

// Types des badges & chips
export type { ConfidenceBadgeProps } from "./confidence-badge"
export type { EdgeChipProps } from "./edge-chip"
export type { LiveBadgeProps } from "./live-badge"
