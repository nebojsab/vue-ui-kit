/**
 * Vue UI Kit — components, art, logo and toast.
 *
 *   import { AppButton, StatCard, toast } from '@nebojsab/vue-ui-kit'
 *
 * Styles:  import '@nebojsab/vue-ui-kit/styles.css' (see README)
 * Tokens:  presets: [uiKitPreset] from '@nebojsab/vue-ui-kit/tailwind-preset'
 */

// ── Components ───────────────────────────────────────────────────────────
export { default as AppAvatar } from './components/AppAvatar.vue'
export { default as AppBackToTop } from './components/AppBackToTop.vue'
export { default as AppBadge } from './components/AppBadge.vue'
export { default as AppBottomNav } from './components/AppBottomNav.vue'
export { default as AppButton } from './components/AppButton.vue'
export { default as AppCheckbox } from './components/AppCheckbox.vue'
export { default as AppChip } from './components/AppChip.vue'
export { default as AppCombobox } from './components/AppCombobox.vue'
export { default as AppConfirmDialog } from './components/AppConfirmDialog.vue'
export { default as AppCopyButton } from './components/AppCopyButton.vue'
export { default as AppCountdown } from './components/AppCountdown.vue'
export { default as AppDateInput } from './components/AppDateInput.vue'
export { default as AppDivider } from './components/AppDivider.vue'
export { default as AppDrawer } from './components/AppDrawer.vue'
export { default as AppEmptyState } from './components/AppEmptyState.vue'
export { default as AppFilterChip } from './components/AppFilterChip.vue'
export { default as AppFilterTile } from './components/AppFilterTile.vue'
export { default as AppFormField } from './components/AppFormField.vue'
export { default as AppInfoChip } from './components/AppInfoChip.vue'
export { default as AppInput } from './components/AppInput.vue'
export { default as AppModal } from './components/AppModal.vue'
export { default as AppOtpInput } from './components/AppOtpInput.vue'
export { default as AppPeriodTabs } from './components/AppPeriodTabs.vue'
export { default as AppPopover } from './components/AppPopover.vue'
export { default as AppProgressBar } from './components/AppProgressBar.vue'
export { default as AppRadioCard } from './components/AppRadioCard.vue'
export { default as AppRewardBox } from './components/AppRewardBox.vue'
export { default as AppSegmentControl } from './components/AppSegmentControl.vue'
export { default as AppSelect } from './components/AppSelect.vue'
export { default as AppSidebar } from './components/AppSidebar.vue'
export { default as AppSkeleton } from './components/AppSkeleton.vue'
export { default as AppSpinner } from './components/AppSpinner.vue'
export { default as AppStickyBar } from './components/AppStickyBar.vue'
export { default as AppTextarea } from './components/AppTextarea.vue'
export { default as AppToaster } from './components/AppToaster.vue'
export { default as AppToggle } from './components/AppToggle.vue'
export { default as AppToggleGroup } from './components/AppToggleGroup.vue'
export { default as AppTooltip } from './components/AppTooltip.vue'
export { default as AppUserMenu } from './components/AppUserMenu.vue'
export { default as AppViewTabs } from './components/AppViewTabs.vue'
export { default as AppXpBar } from './components/AppXpBar.vue'
export { default as DataTable } from './components/DataTable.vue'
export { default as StatCard } from './components/StatCard.vue'

// ── Brand art ────────────────────────────────────────────────────────────
export { default as FlowLines } from './art/FlowLines.vue'
export { default as LightStreak } from './art/LightStreak.vue'
export { default as Swoosh } from './art/Swoosh.vue'

// ── Logo ─────────────────────────────────────────────────────────────────
export { default as BrandLogo } from './logo/BrandLogo.vue'
export { default as KitLogo } from './logo/KitLogo.vue'

// ── Composables ──────────────────────────────────────────────────────────
export { useInfiniteList } from './composables/useInfiniteList.js'
export { useStuck } from './composables/useStuck.js'
export { useFloating } from './utils/floating.js'

// ── Toast ────────────────────────────────────────────────────────────────
export { toast, toasts } from './toast.js'
