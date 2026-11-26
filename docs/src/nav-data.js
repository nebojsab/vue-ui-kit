// Docs navigation — one source for the sidebar (ComponentView) and the index (HomeView).
// Groups follow Atomic Design: foundations → atoms → molecules → organisms.
export const navGroups = [
  {
    label: "Get started",
    items: [
      { slug: 'principles', label: "Principles", description: "Five rules behind every component", icon: "✓", color: '#6366F1' },
      { slug: 'theming', label: "Theming", description: "Live playground — brand colour and corners, copy the CSS", icon: "◐", color: '#E85EC4' },
    ],
  },
  {
    label: "Foundations",
    items: [
      { slug: 'colors', label: "Color Tokens", description: "Theme-aware semantic tokens — surfaces, text, brand, reward, podium", icon: "◐", color: '#6366F1' },
      { slug: 'typography', label: "Typography", description: "Inter only — display, UI and tabular figures for time", icon: "Aa", color: '#E85EC4' },
      { slug: 'spacing', label: "Spacing Scale", description: "4px base grid — key stops used across components", icon: "▦", color: '#F472B6' },
      { slug: 'shape', label: "Radius & Elevation", description: "Three named radii, borders first, shadows only when floating", icon: "▢", color: '#6366F1' },
      { slug: 'motion', label: "Motion & Layers", description: "Durations, reduced motion and the z-index scale", icon: "≋", color: '#F472B6' },
      { slug: 'icons', label: "Iconography", description: "Heroicons 24 outline — variants, sizes, colour, catalog of meanings", icon: "✦", color: '#FBBF24' },
    ],
  },
  {
    label: "Atoms",
    items: [
      { slug: 'button', label: "Button", description: "5 variants (incl. reward) × 3 sizes, loading and disabled", icon: "▶", color: '#6366F1' },
      { slug: 'badge', label: "Badge", description: "Semantic status label — colors, dot indicator, 3 sizes", icon: "●", color: '#F472B6' },
      { slug: 'avatar', label: "Avatar", description: "User initials with deterministic color hash, 5 sizes", icon: "◯", color: '#E85EC4' },
      { slug: 'chip', label: "Chip", description: "Pill label — 7 variants, removable, count badge", icon: "◇", color: '#6366F1' },
      { slug: 'input', label: "Input", description: "Text field with slots, error state, clearable", icon: "▤", color: '#6366F1' },
      { slug: 'textarea', label: "Textarea", description: "Multi-line field — same look as Input", icon: "¶", color: '#6366F1' },
      { slug: 'select', label: "Select", description: "Dropdown for predefined option lists", icon: "▾", color: '#6366F1' },
      { slug: 'checkbox', label: "Checkbox", description: "Multi-select and acknowledgement, supports indeterminate", icon: "▤", color: '#6366F1' },
      { slug: 'toggle', label: "Toggle", description: "Binary switch for immediate-effect settings", icon: "⏻", color: '#F472B6' },
      { slug: 'otp-input', label: "OTP Input", description: "One box per digit — paste, arrows, one-time-code", icon: "⁘", color: '#6366F1' },
      { slug: 'tooltip', label: "Tooltip", description: "Hover and focus label for icon-only buttons", icon: "▴", color: '#6B7280' },
      { slug: 'divider', label: "Divider", description: "Thin separator — horizontal or vertical, optional label", icon: "─", color: '#6B7280' },
      { slug: 'spinner', label: "Spinner", description: "Animated loading indicator — 4 sizes, 3 colors", icon: "⟳", color: '#F59E0B' },
      { slug: 'skeleton', label: "Skeleton", description: "Loading placeholder — text, rect, circle, card variants", icon: "▭", color: '#6B7280' },
      { slug: 'card', label: "Card", description: ".card surface and .card-interactive for cards that open", icon: "▭", color: '#6B7280' },
    ],
  },
  {
    label: "Molecules · Forms",
    items: [
      { slug: 'form-field', label: "Form Field", description: "Label + hint + error wrapper for any input", icon: "▤", color: '#6B7280' },
      { slug: 'date-input', label: "Date Input", description: "Native date picker shown as \"14 Oct 2026\" in every locale", icon: "▦", color: '#6366F1' },
      { slug: 'combobox', label: "Combobox", description: "Searchable single / multi picker — value-in-field vs chips", icon: "⌕", color: '#6366F1' },
      { slug: 'radio-card', label: "Radio Card", description: "Selectable card with icon, title, description", icon: "◉", color: '#E85EC4' },
      { slug: 'toggle-group', label: "Toggle Group", description: "Grouped switches that open and close — permissions", icon: "⏻", color: '#E85EC4' },
      { slug: 'copy-button', label: "Copy Button", description: "Copy a value — \"Copied\" + toast", icon: "⧉", color: '#6366F1' },
    ],
  },
  {
    label: "Molecules · Navigation",
    items: [
      { slug: 'tabs', label: "Tabs", description: "Tabs with panels — underline or pills, ARIA keyboard", icon: "⊟", color: '#6366F1' },
      { slug: 'view-tabs', label: "View Tabs", description: "Underline tabs — Table / Calendar / Kanban", icon: "⊟", color: '#6366F1' },
      { slug: 'segment-control', label: "Segment Control", description: "Pill-group switcher — My Activities / Team", icon: "⊙", color: '#6366F1' },
      { slug: 'breadcrumbs', label: "Breadcrumbs", description: "Hierarchy trail — collapses the middle", icon: "›", color: '#6B7280' },
      { slug: 'pagination', label: "Pagination", description: "Page numbers with gaps, \"3 / 12\" on phones", icon: "‹›", color: '#6366F1' },
      { slug: 'dropdown-menu', label: "Dropdown Menu", description: "Action menu — keyboard, typeahead, danger items", icon: "⋯", color: '#6366F1' },
      { slug: 'filter-chip', label: "Filter Chip", description: "Toggle filter with tones and icon — × clears it", icon: "◈", color: '#E85EC4' },
      { slug: 'filter-tile', label: "Filter Tile", description: "Count tile that filters — muted at zero", icon: "#", color: '#6366F1' },
    ],
  },
  {
    label: "Molecules · Content & feedback",
    items: [
      { slug: 'alert', label: "Alert", description: "Inline message — five tones, actions, dismissible", icon: "!", color: '#F472B6' },
      { slug: 'accordion', label: "Accordion", description: "Expand / collapse sections — FAQs, settings groups", icon: "≡", color: '#E85EC4' },
      { slug: 'stat-card', label: "Stat Card", description: "Single KPI with display-font value, reward tone", icon: "#", color: '#6366F1' },
      { slug: 'info-chip', label: "Info Chip", description: "Directional data chip — ↗ trend indicator", icon: "↗", color: '#F472B6' },
      { slug: 'progress', label: "Progress Bar", description: "Linear 0–100% — quota, completion, upload", icon: "▬", color: '#F472B6' },
      { slug: 'empty-state', label: "Empty State", description: "Zero-state UI with icon, title, and action slot", icon: "○", color: '#6B7280' },
    ],
  },
  {
    label: "Molecules · Gamification",
    items: [
      { slug: 'period-tabs', label: "Period Tabs", description: "Week / Month / Quarter / Year switch with elapsed bars", icon: "▤", color: '#6366F1' },
      { slug: 'countdown', label: "Countdown", description: "Live countdown in tabular tiles — role=\"timer\"", icon: "◷", color: '#FBBF24' },
      { slug: 'xp-bar', label: "XP Bar", description: "Level progress in gold with points label", icon: "▤", color: '#FBBF24' },
      { slug: 'reward-box', label: "Reward Box", description: "Animated bonus box — idle wiggle, claim burst", icon: "◆", color: '#FBBF24' },
    ],
  },
  {
    label: "Organisms · Overlays",
    items: [
      { slug: 'modal', label: "Modal", description: "Centered dialog — focus in / out, Esc, pinned footer", icon: "▢", color: '#6366F1' },
      { slug: 'confirm-dialog', label: "Confirm Dialog", description: "Asks before delete, remove, discard — focus on Cancel", icon: "⚠", color: '#F472B6' },
      { slug: 'drawer', label: "Drawer", description: "Side panel for details and secondary forms", icon: "▐", color: '#6366F1' },
      { slug: 'popover', label: "Popover", description: "Click-to-open panel — filters, quick settings", icon: "◫", color: '#6366F1' },
      { slug: 'toast', label: "Toast", description: "Bottom-right confirmation via ui.toast()", icon: "✓", color: '#F472B6' },
    ],
  },
  {
    label: "Organisms · App shell",
    items: [
      { slug: 'sidebar', label: "Sidebar", description: "Floating app sidebar — rail on md, collapsible panel on lg", icon: "▌", color: '#6366F1' },
      { slug: 'bottom-nav', label: "Bottom Nav", description: "Phone tab bar with raised action and More sheet", icon: "▁", color: '#6366F1' },
      { slug: 'sticky-bar', label: "Sticky Bar", description: "Toolbar that sticks and knows when it is stuck", icon: "▔", color: '#F472B6' },
      { slug: 'back-to-top', label: "Back to Top", description: "Corner button that appears on long pages", icon: "↑", color: '#6B7280' },
      { slug: 'user-menu', label: "User Menu", description: "Avatar menu for the topbar — profile, theme, sign out", icon: "◯", color: '#6366F1' },
    ],
  },
  {
    label: "Organisms · Data",
    items: [
      { slug: 'data-table', label: "Data Table", description: "Table with cell slots, responsive columns, caption", icon: "▦", color: '#6366F1' },
    ],
  },
  {
    label: "Templates",
    items: [
      { slug: 'template-dashboard', label: "Dashboard", description: "App home — sidebar, KPIs, chart, table; bottom nav on phones", icon: "▦", color: '#6366F1' },
      { slug: 'template-settings', label: "Settings", description: "Tabs, forms, toggles, team roles and a danger zone", icon: "⚙", color: '#E85EC4' },
      { slug: 'template-sign-in', label: "Sign in", description: "Split screen — email, password, then a one-time code", icon: "→", color: '#F472B6' },
      { slug: 'template-projects', label: "Projects", description: "List with filters, row menus, pagination and an edit drawer", icon: "≣", color: '#FBBF24' },
    ],
  },
  {
    label: "Composables",
    items: [
      { slug: 'composables', label: "Composables", description: "useInfiniteList, useStuck, useFloating", icon: "ƒ", color: '#E85EC4' },
    ],
  },
]
