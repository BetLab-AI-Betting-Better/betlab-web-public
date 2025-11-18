/**
 * Export central pour tous les hooks custom
 */

// ⚠️ use-form-validation has type errors with Zod - commented out (not used)
// export {
//   useFormValidation,
//   getFormErrors,
//   hasFieldError,
//   getFieldError,
// } from "./use-form-validation"

export {
  useNavigation,
  type NavRoute,
} from "./use-navigation"

// Home hooks (BATCH 6) - Migrated to features/
// ⚠️ use-fixtures → server/services/fixtures.ts
// ⚠️ use-predictions → server/services/predictions.ts
// ⚠️ use-home-filters → features/fixtures/hooks/use-fixture-filters.ts
// ⚠️ use-h2h → Removed (disabled, not used)

// UX Mobile hooks
export { usePullToRefresh } from "./use-pull-to-refresh"
export { useHapticFeedback } from "./use-haptic-feedback"
export { useSuccessToast } from "./use-success-toast"
