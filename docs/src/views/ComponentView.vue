<template>
  <AppLayout>
    <div class="flex gap-8 min-h-screen">

      <!-- ── Sticky left sidebar ──────────────────────────────────────── -->
      <aside class="hidden lg:flex flex-col w-52 flex-shrink-0">
        <div class="sticky-aside scroll-thin w-full space-y-1 pr-1">
          <div class="mb-4 px-3">
            <p class="text-overline text-brand">Open source</p>
            <p class="text-sm font-semibold text-fg mt-0.5">Design System</p>
            <p class="text-xs text-subtle mt-0.5">Vue 3 + Tailwind CSS</p>
          </div>

          <!-- Groups: divider + breathing room between each section -->
          <div
            v-for="(group, gi) in navGroups"
            :key="group.label"
            :class="gi > 0 && 'mt-4 pt-4 border-t border-line'"
          >
            <p class="text-[11px] font-extrabold uppercase tracking-[0.1em] text-fg-muted px-3 mb-2">{{ group.label }}</p>
            <router-link
              v-for="item in group.items"
              :key="item.slug"
              :to="'/' + item.slug"
              class="block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all"
              :class="route.params.slug === item.slug
                ? 'bg-surface-2 text-fg font-bold ring-1 ring-inset ring-line'
                : 'text-subtle hover:text-fg hover:bg-surface-2'"
            >{{ item.label }}</router-link>
          </div>

          <div class="px-3 pt-4 mt-4 border-t border-line">
            <router-link to="/" class="text-xs text-subtle hover:text-brand transition-colors">← All components</router-link>
          </div>
        </div>
      </aside>

      <!-- ── Main content ─────────────────────────────────────────────── -->
      <main class="flex-1 min-w-0 pb-24">

        <template v-if="current">
          <!-- Page header -->
          <div class="mb-8">
            <h1 class="font-display font-bold text-[28px] sm:text-[34px] tracking-tight">{{ current.title }}</h1>
            <p class="text-sm text-subtle mt-1 max-w-2xl">{{ current.description }}</p>
          </div>


          <!-- When to use / When not to use -->
          <div v-if="current.whenToUse" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div class="rounded-card border border-success/30 bg-success/[0.06] p-5">
              <p class="text-overline text-success mb-3 flex items-center gap-2"><CheckCircleIcon class="w-4 h-4" />{{ current.useLabel ?? 'When to use' }}</p>
              <ul class="space-y-2">
                <li v-for="item in current.whenToUse" :key="item" class="text-sm text-fg-2 flex gap-2">
                  <span class="text-success flex-shrink-0" aria-hidden="true">•</span>{{ item }}
                </li>
              </ul>
            </div>
            <div class="rounded-card border border-danger/30 bg-danger/[0.06] p-5">
              <p class="text-overline text-danger mb-3 flex items-center gap-2"><XCircleIcon class="w-4 h-4" />{{ current.notLabel ?? 'When not to use' }}</p>
              <ul class="space-y-2">
                <li v-for="item in current.whenNotTo" :key="item" class="text-sm text-fg-2 flex gap-2">
                  <span class="text-danger flex-shrink-0" aria-hidden="true">•</span>{{ item }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Props table -->
          <section v-if="current.props" class="mb-8">
            <h2 class="text-overline text-subtle mb-3">Props</h2>
            <div class="rounded-xl border border-line overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-surface-2">
                  <tr>
                    <th class="text-left px-4 py-2.5 text-xs font-semibold text-subtle uppercase tracking-wide">Name</th>
                    <th class="text-left px-4 py-2.5 text-xs font-semibold text-subtle uppercase tracking-wide">Type</th>
                    <th class="text-left px-4 py-2.5 text-xs font-semibold text-subtle uppercase tracking-wide">Default</th>
                    <th class="text-left px-4 py-2.5 text-xs font-semibold text-subtle uppercase tracking-wide">Description</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-line">
                  <tr v-for="prop in current.props" :key="prop.name" class="bg-surface-1">
                    <td class="px-4 py-2.5 font-mono text-brand text-xs">{{ prop.name }}</td>
                    <td class="px-4 py-2.5 font-mono text-fg-2 text-xs">{{ prop.type }}</td>
                    <td class="px-4 py-2.5 font-mono text-fg-muted text-xs">{{ prop.default ?? '—' }}</td>
                    <td class="px-4 py-2.5 text-fg-2 text-xs">{{ prop.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Stories -->
          <div v-for="story in current.stories" :key="story.name" class="mb-10">
            <div class="mb-3">
              <h3 class="text-[15px] font-extrabold text-fg">{{ story.name }}</h3>
              <p v-if="story.description" class="text-xs text-subtle mt-0.5">{{ story.description }}</p>
            </div>
            <div v-if="story.demo" class="rounded-card border border-line bg-surface-1 p-6 mb-3">
              <component :is="story.demo" />
            </div>
            <div class="rounded-xl bg-page border border-line overflow-hidden">
              <div class="px-4 py-2 border-b border-line flex items-center justify-between">
                <span class="text-xs text-fg-muted font-mono">{{ story.name }}</span>
                <button
                  class="text-xs text-fg-muted hover:text-fg transition-colors px-2 py-1 rounded hover:bg-surface-2"
                  @click="copyText(story.snippet, story.name)"
                >{{ copiedKey === story.name ? 'Copied!' : 'Copy' }}</button>
              </div>
              <pre class="p-4 overflow-x-auto text-sm font-mono text-fg-2 leading-relaxed"><code>{{ story.snippet }}</code></pre>
            </div>
          </div>

        </template>

        <!-- Not found -->
        <div v-else class="text-center py-20">
          <p class="text-subtle text-sm">Component <span class="font-mono text-brand">{{ slug }}</span> not found.</p>
          <router-link to="/" class="mt-4 inline-block text-sm text-brand hover:underline">← Back to Design System</router-link>
        </div>

      </main>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, defineComponent, h } from 'vue'
import { useRoute } from 'vue-router'
import {
  TableCellsIcon, CalendarDaysIcon, ViewColumnsIcon, Squares2X2Icon, BanknotesIcon, BoltIcon,
  BriefcaseIcon, BeakerIcon, MegaphoneIcon, CheckCircleIcon, XCircleIcon,
  HomeIcon, ListBulletIcon, BuildingOffice2Icon, UsersIcon, BookOpenIcon, Cog6ToothIcon,
  ArrowTrendingUpIcon, ViewfinderCircleIcon, BuildingStorefrontIcon, UserGroupIcon, MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline'
import AppLayout from '../DocsLayout.vue'
import { iconsDoc } from './iconsDoc'
import { moleculesDocs } from './docs/molecules'
import { foundationsDocs } from './docs/foundations'
import { guidesDocs } from './docs/guides'
import { templatesDocs } from './docs/templates'
import { navGroups } from '../nav'
const territory = (region) => `Acme - ${region}`
import AppButton from '@ds/components/AppButton.vue'
import AppBadge from '@ds/components/AppBadge.vue'
import AppAvatar from '@ds/components/AppAvatar.vue'
import AppInput from '@ds/components/AppInput.vue'
import AppSelect from '@ds/components/AppSelect.vue'
import AppToggle from '@ds/components/AppToggle.vue'
import AppCheckbox from '@ds/components/AppCheckbox.vue'
import AppSpinner from '@ds/components/AppSpinner.vue'
import AppDivider from '@ds/components/AppDivider.vue'
import AppEmptyState from '@ds/components/AppEmptyState.vue'
import AppFormField from '@ds/components/AppFormField.vue'
import AppProgressBar from '@ds/components/AppProgressBar.vue'
import AppChip from '@ds/components/AppChip.vue'
import AppSegmentControl from '@ds/components/AppSegmentControl.vue'
import AppViewTabs from '@ds/components/AppViewTabs.vue'
import AppRadioCard from '@ds/components/AppRadioCard.vue'
import AppInfoChip from '@ds/components/AppInfoChip.vue'
import AppSkeleton from '@ds/components/AppSkeleton.vue'
import AppPeriodTabs from '@ds/components/AppPeriodTabs.vue'
import AppCountdown from '@ds/components/AppCountdown.vue'
import AppXpBar from '@ds/components/AppXpBar.vue'
import StatCard from '@ds/components/StatCard.vue'
import AppRewardBox from '@ds/components/AppRewardBox.vue'
import AppTextarea from '@ds/components/AppTextarea.vue'
import AppCombobox from '@ds/components/AppCombobox.vue'
import AppModal from '@ds/components/AppModal.vue'
import AppDrawer from '@ds/components/AppDrawer.vue'
import AppPopover from '@ds/components/AppPopover.vue'
import DataTable from '@ds/components/DataTable.vue'
import AppSidebar from '@ds/components/AppSidebar.vue'
import AppBottomNav from '@ds/components/AppBottomNav.vue'
import AppBackToTop from '@ds/components/AppBackToTop.vue'
import AppUserMenu from '@ds/components/AppUserMenu.vue'
import AppFilterChip from '@ds/components/AppFilterChip.vue'
import AppFilterTile from '@ds/components/AppFilterTile.vue'
import AppDateInput from '@ds/components/AppDateInput.vue'
import AppStickyBar from '@ds/components/AppStickyBar.vue'
import AppCopyButton from '@ds/components/AppCopyButton.vue'
import AppConfirmDialog from '@ds/components/AppConfirmDialog.vue'
import AppToggleGroup from '@ds/components/AppToggleGroup.vue'
import { UserIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'
import { useInfiniteList } from '@ds/composables/useInfiniteList.js'
import KitLogo from '@ds/logo/KitLogo.vue'
import { toast } from '@ds/toast.js'
// Docs have no app store — same call shape as the apps' ui.toast()
const useUiStore = () => ({ toast })
import { RECORD_STYLE, COMPANY_STYLE } from '../activityStyles'

const route = useRoute()
const slug = computed(() => route.params.slug)

// ── Nav structure (shared with HomeView) ────────────────────────────────

// ── Demo reactive state (defined before componentData so closures work) ───
const demoTags      = ref(['Vue 3', 'Tailwind', 'Pinia', 'Vite'])
const demoSegment   = ref('mine')
const demoSegment2  = ref('table')
const demoTab       = ref('overview')
const demoRadio     = ref('sales')
const demoInput     = ref('')
const demoClearable = ref('Clear me…')
const demoToggle1   = ref(true)
const demoToggle2   = ref(false)
const demoToggle3   = ref(true)
const demoCheck1    = ref(true)
const demoCheck2    = ref(false)
const demoSelect    = ref('')
const demoSelectErr = ref('')
const demoFormInput = ref('')
const demoFormSelect = ref('')
const demoPeriod    = ref('week')
const demoReward    = ref(true)
const demoTextarea  = ref('')
const demoComboSingle = ref('Brightwave plc')
const demoComboMulti  = ref(['Sentrix'])
const demoModal     = ref(false)
const demoDrawer    = ref(false)
const demoFormIcon  = ref('')
const demoDate      = ref('2026-10-14')
const demoDateEmpty = ref('')
const demoCollapsed = ref(false)
const demoFilterChips = ref(['presales'])
const demoFilterTile  = ref(null)
const demoPerms = ref(['access', 'vendors.view', 'vendors.enroll', 'invoices.view'])
const DEMO_PERM_GROUPS = [
  { key: 'portal', label: 'Portal', items: [{ key: 'access', code: 'module:access', label: 'Sign in and see the dashboard', locked: true }] },
  { key: 'vendors', label: 'Vendors', items: [
    { key: 'vendors.view', code: 'vendors:view', label: 'Browse vendors' },
    { key: 'vendors.enroll', code: 'vendors:enroll', label: 'Request vendor enrollment' },
    { key: 'vendors.accept', code: 'vendors:accept', label: 'Accept vendor terms', hint: 'Commits the company contractually' },
  ] },
  { key: 'billing', label: 'Billing', items: [
    { key: 'invoices.view', code: 'invoices:view', label: 'View invoices' },
    { key: 'agreements.view', code: 'agreements:view', label: 'View agreements' },
  ] },
]


function removeTag(tag) {
  const idx = demoTags.value.indexOf(tag)
  if (idx > -1) demoTags.value.splice(idx, 1)
}

// ── Component data ────────────────────────────────────────────────────────
const componentData = {
  ...guidesDocs,
  ...foundationsDocs,
  ...moleculesDocs,
  ...templatesDocs,
  icons: iconsDoc,

  // ── Button ──────────────────────────────────────────────────────────────
  button: {
    title: 'Button',
    description: 'The primary interactive element in the design system. Buttons communicate actions and guide users through a flow. Use them for actions that happen in the current context — not for navigation between pages.',
    whenToUse: [
      'Submitting forms or confirming dialogs',
      'Triggering actions like Save, Delete, or Export',
      'Opening modals or drawers',
      'Secondary and ghost variants for lower-priority actions alongside a primary button',
    ],
    whenNotTo: [
      "Don't use multiple primary buttons in one view — pick one primary action",
      "Don't use buttons for navigation — use RouterLink or <a> instead",
      'Avoid ghost buttons as standalone CTAs without visual context',
    ],
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'reward' | 'danger'", default: "'primary'", description: 'Visual style. reward = gold, only for claiming points/bonuses' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height: 36 / 44 / 48px. md is the 44px touch-target default' },
      { name: 'tag', type: "String | Component", default: "'button'", description: "Render as 'a' or a component — :tag=\"RouterLink\" to=\"/activity\" for navigation that looks like a button" },
      { name: 'loading', type: 'Boolean', default: 'false', description: 'Shows a spinner and disables interaction' },
      { name: 'disabled', type: 'Boolean', default: 'false', description: 'Prevents clicks and dims the button' },
    ],
    stories: [
      {
        name: 'Variants',
        description: 'Five semantic variants. Primary is the one action per screen; reward is gold and only claims points.',
        snippet: `<AppButton variant="primary">Log activity</AppButton>
<AppButton variant="secondary">Export CSV</AppButton>
<AppButton variant="ghost">View all</AppButton>
<AppButton variant="reward">Claim bonus</AppButton>
<AppButton variant="danger">Delete</AppButton>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'flex flex-wrap gap-3' }, [
          h(AppButton, { variant: 'primary' }, () => 'Log activity'),
          h(AppButton, { variant: 'secondary' }, () => 'Export CSV'),
          h(AppButton, { variant: 'ghost' }, () => 'View all'),
          h(AppButton, { variant: 'reward' }, () => 'Claim bonus'),
          h(AppButton, { variant: 'danger' }, () => 'Delete'),
        ]) } }),
      },
      {
        name: 'Sizes',
        description: 'Three sizes to match surrounding content density.',
        snippet: `<AppButton variant="primary" size="sm">Small</AppButton>
<AppButton variant="primary" size="md">Medium</AppButton>
<AppButton variant="primary" size="lg">Large</AppButton>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'flex flex-wrap items-center gap-3' }, [
          h(AppButton, { variant: 'primary', size: 'sm' }, () => 'Small'),
          h(AppButton, { variant: 'primary', size: 'md' }, () => 'Medium'),
          h(AppButton, { variant: 'primary', size: 'lg' }, () => 'Large'),
        ]) } }),
      },
      {
        name: 'States',
        description: 'Loading shows a spinner and prevents double-submission. Disabled dims and blocks interaction.',
        snippet: `<AppButton variant="primary" :loading="true">Loading</AppButton>
<AppButton variant="primary" :disabled="true">Disabled</AppButton>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'flex flex-wrap items-center gap-3' }, [
          h(AppButton, { variant: 'primary', loading: true }, () => 'Loading'),
          h(AppButton, { variant: 'primary', disabled: true }, () => 'Disabled'),
        ]) } }),
      },
    ],
  },

  // ── Badge ────────────────────────────────────────────────────────────────
  badge: {
    title: 'Badge',
    description: 'Compact status labels for communicating state or category at a glance. Badges are non-interactive — they display information, not trigger actions.',
    whenToUse: [
      'Status of an entity (Active, Pending, Closed)',
      'Category labels on cards or list items',
      'Numeric counts or points indicators',
    ],
    whenNotTo: [
      "Don't use as buttons or interactive elements",
      "Don't stack more than 2–3 badges per row",
    ],
    props: [
      { name: 'color', type: "'brand' | 'success' | 'warning' | 'danger' | 'neutral' | 'reward'", default: "'neutral'", description: 'Color scheme of the badge' },
      { name: 'size', type: "'xs' | 'sm' | 'md'", default: "'sm'", description: 'Size of the badge' },
      { name: 'dot', type: 'Boolean', default: 'false', description: 'Shows a colored dot before the label' },
      { name: 'icon', type: 'Component', default: 'null', description: 'Leading Heroicon, sized to the badge — e.g. a user icon before a count' },
    ],
    stories: [
      {
        name: 'Colors',
        description: 'Six semantic color variants.',
        snippet: `<AppBadge color="brand">Brand</AppBadge>
<AppBadge color="success">Success</AppBadge>
<AppBadge color="warning">Warning</AppBadge>
<AppBadge color="danger">Danger</AppBadge>
<AppBadge color="neutral">Neutral</AppBadge>
<AppBadge color="reward">Reward</AppBadge>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'flex flex-wrap gap-2' }, [
          h(AppBadge, { color: 'brand' }, () => 'Brand'),
          h(AppBadge, { color: 'success' }, () => 'Success'),
          h(AppBadge, { color: 'warning' }, () => 'Warning'),
          h(AppBadge, { color: 'danger' }, () => 'Danger'),
          h(AppBadge, { color: 'neutral' }, () => 'Neutral'),
          h(AppBadge, { color: 'reward' }, () => 'Reward'),
        ]) } }),
      },
      {
        name: 'With dot indicator',
        description: 'Dot prefix for live status communication.',
        snippet: `<AppBadge color="success" dot>Active</AppBadge>
<AppBadge color="warning" dot>Pending</AppBadge>
<AppBadge color="danger" dot>Offline</AppBadge>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'flex flex-wrap gap-2' }, [
          h(AppBadge, { color: 'success', dot: true }, () => 'Active'),
          h(AppBadge, { color: 'warning', dot: true }, () => 'Pending'),
          h(AppBadge, { color: 'danger', dot: true }, () => 'Offline'),
        ]) } }),
      },
      {
        name: 'With an icon',
        description: 'People on a role: brand when someone is on it, neutral at zero. Give it a title / aria-label with the full sentence.',
        snippet: `<AppBadge :icon="UserIcon" color="brand" size="xs" aria-label="3 people">3</AppBadge>
<AppBadge :icon="UserIcon" size="xs" aria-label="0 people">0</AppBadge>
<AppBadge :icon="DocumentTextIcon" color="success" size="sm">4 documents</AppBadge>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'flex flex-wrap items-center gap-2' }, [
          h(AppBadge, { icon: UserIcon, color: 'brand', size: 'xs', 'aria-label': '3 people' }, () => '3'),
          h(AppBadge, { icon: UserIcon, size: 'xs', 'aria-label': '0 people' }, () => '0'),
          h(AppBadge, { icon: DocumentTextIcon, color: 'success', size: 'sm' }, () => '4 documents'),
        ]) } }),
      },
      {
        name: 'Sizes',
        snippet: `<AppBadge color="brand" size="xs">XSmall</AppBadge>
<AppBadge color="brand" size="sm">Small</AppBadge>
<AppBadge color="brand" size="md">Medium</AppBadge>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'flex flex-wrap items-center gap-2' }, [
          h(AppBadge, { color: 'brand', size: 'xs' }, () => 'XSmall'),
          h(AppBadge, { color: 'brand', size: 'sm' }, () => 'Small'),
          h(AppBadge, { color: 'brand', size: 'md' }, () => 'Medium'),
        ]) } }),
      },
    ],
  },

  // ── Avatar ───────────────────────────────────────────────────────────────
  avatar: {
    title: 'Avatar',
    description: 'User representation component with deterministic color generation from name. Falls back to initials when no image is provided.',
    whenToUse: [
      'User identity in comments, activity feeds, or headers',
      'Avatar groups for showing multiple participants',
      'Profile pictures and account menus',
    ],
    whenNotTo: [
      "Don't use for non-person entities — use icons or badges instead",
    ],
    props: [
      { name: 'name', type: 'String', default: '—', description: 'Full name — used to generate initials and a deterministic background color' },
      { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Diameter of the avatar' },
      { name: 'src', type: 'String', default: '—', description: 'Image URL — falls back to initials if not provided or fails to load' },
    ],
    stories: [
      {
        name: 'Sizes',
        description: 'Five sizes from xs (24px) to xl (56px).',
        snippet: `<AppAvatar name="Luka Petrovic" size="xl" />
<AppAvatar name="Lukas B." size="lg" />
<AppAvatar name="James H" size="md" />
<AppAvatar name="Tom W" size="sm" />
<AppAvatar name="A" size="xs" />`,
        demo: defineComponent({ setup() {
          const people = [['Luka Petrovic','xl'],['Lukas B.','lg'],['James H','md'],['Tom W','sm'],['A','xs']]
          return () => h('div', { class: 'flex flex-wrap items-end gap-4' }, people.map(([name, size]) =>
            h('div', { class: 'flex flex-col items-center gap-1.5' }, [
              h(AppAvatar, { name, size }),
              h('span', { class: 'text-xs text-subtle font-mono' }, size),
            ])
          ))
        } }),
      },
      {
        name: 'Avatar group',
        description: 'Overlapping ring pattern for showing multiple participants with a +N overflow indicator.',
        snippet: `<div class="flex -space-x-2">
  <AppAvatar
    v-for="n in names" :key="n" :name="n" size="sm"
    class="ring-2 ring-surface-1"
  />
  <div class="w-8 h-8 rounded-xl bg-surface-2
              border-2 border-surface-1
              flex items-center justify-center">
    <span class="text-xs text-subtle font-semibold">+8</span>
  </div>
</div>`,
        demo: defineComponent({ setup() {
          const names = ['Luka Petrovic','Lukas B','James H','Tom W']
          return () => h('div', { class: 'flex -space-x-2' }, [
            ...names.map(n => h(AppAvatar, { name: n, size: 'sm', class: 'ring-2 ring-surface-1' })),
            h('div', { class: 'w-8 h-8 rounded-xl bg-surface-2 border-2 border-surface-1 flex items-center justify-center' },
              h('span', { class: 'text-xs text-subtle font-semibold' }, '+8')
            ),
          ])
        } }),
      },
    ],
  },

  // ── Input ────────────────────────────────────────────────────────────────
  input: {
    title: 'Input',
    description: 'Text input field for capturing user data. Supports leading and trailing slots for icons, a clearable state, and inline error feedback. Always pair with AppFormField for a label.',
    whenToUse: [
      'Single-line text capture in forms',
      'Search bars and filter inputs',
      'Any field where the user types free text',
    ],
    whenNotTo: [
      "Don't use for multi-line text — use a textarea instead",
      "Don't use without a label — always pair with AppFormField",
    ],
    props: [
      { name: 'modelValue', type: 'String', default: "''", description: 'Bound value (v-model)' },
      { name: 'type', type: "'text' | 'email' | 'password' | 'number'", default: "'text'", description: 'HTML input type' },
      { name: 'placeholder', type: 'String', default: '—', description: 'Placeholder text shown when empty' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height and font size of the input' },
      { name: 'error', type: 'Boolean | String', default: 'false', description: 'Error state — true highlights border red' },
      { name: 'disabled', type: 'Boolean', default: 'false', description: 'Disables the input' },
      { name: 'clearable', type: 'Boolean', default: 'false', description: 'Shows a clear (×) icon when value is non-empty' },
      { name: '#leading / #trailing', type: 'Slot', default: '—', description: 'Icon inside the field — padding adjusts automatically (pl-10 / pr-10)' },
      { name: 'wrapperClass', type: 'String | Array', default: "''", description: 'Classes for the wrapper div. class and other attrs go to the <input> itself' },
    ],
    stories: [
      {
        name: 'Default',
        snippet: `<AppInput v-model="text" placeholder="Enter text…" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' }, [
            h(AppInput, { modelValue: demoInput.value, 'onUpdate:modelValue': v => { demoInput.value = v }, placeholder: 'Enter text…' }),
          ])
        } }),
      },
      {
        name: 'Sizes',
        snippet: `<AppInput v-model="text" placeholder="Small…" size="sm" />
<AppInput v-model="text" placeholder="Medium…" size="md" />
<AppInput v-model="text" placeholder="Large…" size="lg" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-2 max-w-sm' }, [
            h(AppInput, { modelValue: demoInput.value, 'onUpdate:modelValue': v => { demoInput.value = v }, placeholder: 'Small…', size: 'sm' }),
            h(AppInput, { modelValue: demoInput.value, 'onUpdate:modelValue': v => { demoInput.value = v }, placeholder: 'Medium…', size: 'md' }),
            h(AppInput, { modelValue: demoInput.value, 'onUpdate:modelValue': v => { demoInput.value = v }, placeholder: 'Large…', size: 'lg' }),
          ])
        } }),
      },
      {
        name: 'Error state',
        snippet: `<AppInput v-model="text" placeholder="Error state" :error="true" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' }, [
            h(AppInput, { modelValue: demoInput.value, 'onUpdate:modelValue': v => { demoInput.value = v }, placeholder: 'Error state', error: true }),
          ])
        } }),
      },
      {
        name: 'Clearable',
        snippet: `<AppInput v-model="text" placeholder="Type to clear…" clearable />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' }, [
            h(AppInput, { modelValue: demoClearable.value, 'onUpdate:modelValue': v => { demoClearable.value = v }, placeholder: 'Type to clear…', clearable: true }),
          ])
        } }),
      },
    ],
  },

  // ── Select ───────────────────────────────────────────────────────────────
  select: {
    title: 'Select',
    description: 'Dropdown selector for choosing from a predefined list of options. Accepts both string arrays and label/value object arrays.',
    whenToUse: [
      'Choosing from 5+ options where a radio group would be too long',
      'Type, category, or status filters in forms',
    ],
    whenNotTo: [
      "Don't use for fewer than 4 options — use radio buttons or AppSegmentControl instead",
      'Avoid for Boolean choices — use AppToggle',
    ],
    props: [
      { name: 'modelValue', type: 'String | Object', default: '—', description: 'Bound value (v-model)' },
      { name: 'options', type: "Array<String | { label: String, value: any }>", default: '[]', description: 'List of options — strings or label/value pairs' },
      { name: 'placeholder', type: 'String', default: '—', description: 'Text shown when no value is selected' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height of the select control' },
      { name: 'error', type: 'Boolean', default: 'false', description: 'Highlights the border in danger color' },
      { name: 'disabled', type: 'Boolean', default: 'false', description: 'Prevents interaction' },
    ],
    stories: [
      {
        name: 'Default',
        snippet: `<AppSelect
  v-model="selected"
  :options="['Sales', 'Pre-Sales', 'Marketing']"
/>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' }, [
            h(AppSelect, { modelValue: demoSelect.value, 'onUpdate:modelValue': v => { demoSelect.value = v }, options: ['Sales','Pre-Sales','Marketing'] }),
          ])
        } }),
      },
      {
        name: 'With placeholder',
        snippet: `<AppSelect
  v-model="selected"
  :options="['Sales', 'Pre-Sales', 'Marketing']"
  placeholder="Select type…"
/>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' }, [
            h(AppSelect, { modelValue: demoSelect.value, 'onUpdate:modelValue': v => { demoSelect.value = v }, options: ['Sales','Pre-Sales','Marketing'], placeholder: 'Select type…' }),
          ])
        } }),
      },
      {
        name: 'Error state',
        snippet: `<AppSelect
  v-model="selected"
  :options="['Upcoming', 'In Progress', 'Completed']"
  placeholder="Select…"
  :error="true"
/>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' }, [
            h(AppSelect, { modelValue: demoSelectErr.value, 'onUpdate:modelValue': v => { demoSelectErr.value = v }, options: ['Upcoming','In Progress','Completed'], placeholder: 'Select…', error: true }),
          ])
        } }),
      },
    ],
  },

  // ── Toggle ───────────────────────────────────────────────────────────────
  toggle: {
    title: 'Toggle',
    description: 'Binary on/off switch for immediate effect settings. Unlike a checkbox, a toggle typically applies its change immediately without a submit action.',
    whenToUse: [
      'Settings that apply instantly (notifications, dark mode, feature flags)',
      'Any binary preference that has immediate effect',
    ],
    whenNotTo: [
      "Don't use in forms that require a submit button to apply changes — use a checkbox instead",
      'Avoid for acknowledging terms — use a checkbox',
    ],
    props: [
      { name: 'modelValue', type: 'Boolean', default: 'false', description: 'On/off state (v-model)' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the toggle pill' },
      { name: 'disabled', type: 'Boolean', default: 'false', description: 'Prevents toggling' },
      { name: 'activeColor', type: 'String', default: "'bg-brand'", description: 'Tailwind bg class applied when the toggle is on' },
      { name: 'aria-label', type: 'String', default: '—', description: 'Required when there is no visible label wrapping the toggle' },
    ],
    stories: [
      {
        name: 'Default',
        description: 'Interactive on/off state.',
        snippet: `<AppToggle v-model="enabled" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex items-center gap-3' }, [
            h(AppToggle, { modelValue: demoToggle1.value, 'onUpdate:modelValue': v => { demoToggle1.value = v } }),
            h('span', { class: 'text-sm text-subtle' }, demoToggle1.value ? 'On' : 'Off'),
          ])
        } }),
      },
      {
        name: 'Sizes',
        snippet: `<AppToggle v-model="enabled" size="sm" active-color="bg-success" />
<AppToggle v-model="enabled" size="md" />
<AppToggle v-model="enabled" size="lg" active-color="bg-reward" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-4 max-w-xs' }, [
            h('div', { class: 'flex items-center justify-between' }, [
              h('div', [
                h('p', { class: 'text-sm font-medium text-fg' }, 'Notifications'),
                h('p', { class: 'text-xs text-subtle' }, 'size="sm"'),
              ]),
              h(AppToggle, { modelValue: demoToggle2.value, 'onUpdate:modelValue': v => { demoToggle2.value = v }, size: 'sm', activeColor: 'bg-success' }),
            ]),
            h('div', { class: 'flex items-center justify-between' }, [
              h('div', [
                h('p', { class: 'text-sm font-medium text-fg' }, 'Dark Mode'),
                h('p', { class: 'text-xs text-subtle' }, 'size="md" (default)'),
              ]),
              h(AppToggle, { modelValue: demoToggle1.value, 'onUpdate:modelValue': v => { demoToggle1.value = v } }),
            ]),
            h('div', { class: 'flex items-center justify-between' }, [
              h('div', [
                h('p', { class: 'text-sm font-medium text-fg' }, 'Rewards'),
                h('p', { class: 'text-xs text-subtle' }, 'size="lg"'),
              ]),
              h(AppToggle, { modelValue: demoToggle3.value, 'onUpdate:modelValue': v => { demoToggle3.value = v }, size: 'lg', activeColor: 'bg-reward' }),
            ]),
          ])
        } }),
      },
      {
        name: 'Disabled state',
        snippet: `<AppToggle :model-value="true" :disabled="true" />
<AppToggle :model-value="false" :disabled="true" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex gap-4' }, [
            h(AppToggle, { modelValue: true, disabled: true }),
            h(AppToggle, { modelValue: false, disabled: true }),
          ])
        } }),
      },
    ],
  },

  // ── Checkbox ─────────────────────────────────────────────────────────────
  checkbox: {
    title: 'Checkbox',
    description: 'Form control for multi-selection or agreement acknowledgement. Supports indeterminate state for parent/child selection patterns.',
    whenToUse: [
      'Multi-select lists',
      'Agreeing to terms or policies',
      'Select-all parent with child checkboxes (use indeterminate)',
    ],
    whenNotTo: [
      "Don't use for binary settings with immediate effect — use AppToggle",
      'Avoid standalone use without a visible label',
    ],
    props: [
      { name: 'modelValue', type: 'Boolean | Array', default: 'false', description: 'Checked state (v-model)' },
      { name: 'indeterminate', type: 'Boolean', default: 'false', description: 'Shows a dash for partial selection' },
      { name: 'disabled', type: 'Boolean', default: 'false', description: 'Prevents checking' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Size of the checkbox' },
    ],
    stories: [
      {
        name: 'Default',
        snippet: `<AppCheckbox v-model="agreed">Agree to terms and conditions</AppCheckbox>
<AppCheckbox v-model="digest">Send weekly digest</AppCheckbox>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-3' }, [
            h(AppCheckbox, { modelValue: demoCheck1.value, 'onUpdate:modelValue': v => { demoCheck1.value = v } }, () => 'Agree to terms and conditions'),
            h(AppCheckbox, { modelValue: demoCheck2.value, 'onUpdate:modelValue': v => { demoCheck2.value = v } }, () => 'Send weekly digest'),
          ])
        } }),
      },
      {
        name: 'Indeterminate',
        description: 'Used for select-all patterns where only some children are selected.',
        snippet: `<AppCheckbox :model-value="true" :indeterminate="true">Partially selected</AppCheckbox>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-3' }, [
            h(AppCheckbox, { modelValue: true, indeterminate: true }, () => 'Partially selected'),
          ])
        } }),
      },
      {
        name: 'Disabled states',
        snippet: `<AppCheckbox :model-value="false" :disabled="true">Disabled unchecked</AppCheckbox>
<AppCheckbox :model-value="true" :disabled="true">Disabled checked</AppCheckbox>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-3' }, [
            h(AppCheckbox, { modelValue: false, disabled: true }, () => 'Disabled unchecked'),
            h(AppCheckbox, { modelValue: true, disabled: true }, () => 'Disabled checked'),
          ])
        } }),
      },
    ],
  },

  // ── Chip ─────────────────────────────────────────────────────────────────
  chip: {
    title: 'Chip',
    description: 'Pill-shaped label for tags, filters, and inline status indicators. More visually prominent than a Badge. Supports removable variant for tag inputs and count badges for filter chips.',
    whenToUse: [
      'Removable tags in tag inputs',
      'Filter chips that can be dismissed',
      'Inline category labels with more visual weight than a Badge',
      'Count of active filters applied',
    ],
    whenNotTo: [
      "Don't use as primary navigation — use tabs or segment controls",
      "Don't nest interactive chips inside other interactive elements",
    ],
    props: [
      { name: 'label', type: 'String', default: '—', description: 'Text content of the chip' },
      { name: 'variant', type: "'default' | 'brand' | 'success' | 'warning' | 'danger' | 'purple' | 'reward'", default: "'default'", description: 'Color variant' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Size of the chip' },
      { name: 'removable', type: 'Boolean', default: 'false', description: 'Shows a × icon and emits @remove' },
      { name: 'dot', type: 'Boolean', default: 'false', description: 'Shows a colored dot before the label' },
      { name: 'count', type: 'Number', default: '—', description: 'Badge count shown after the label' },
    ],
    stories: [
      {
        name: 'Variants',
        snippet: `<AppChip label="Default" />
<AppChip label="Brand" variant="brand" />
<AppChip label="Success" variant="success" />
<AppChip label="Warning" variant="warning" />
<AppChip label="Danger" variant="danger" />
<AppChip label="Pre-Sales" variant="purple" />
<AppChip label="Reward" variant="reward" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex flex-wrap gap-2' }, [
            h(AppChip, { label: 'Default' }),
            h(AppChip, { label: 'Brand', variant: 'brand' }),
            h(AppChip, { label: 'Success', variant: 'success' }),
            h(AppChip, { label: 'Warning', variant: 'warning' }),
            h(AppChip, { label: 'Danger', variant: 'danger' }),
            h(AppChip, { label: 'Pre-Sales', variant: 'purple' }),
            h(AppChip, { label: 'Reward', variant: 'reward' }),
          ])
        } }),
      },
      {
        name: 'With dot',
        snippet: `<AppChip label="Active" variant="success" dot />
<AppChip label="Pending" variant="warning" dot />
<AppChip label="Pre-Sales" variant="purple" dot />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex flex-wrap gap-2' }, [
            h(AppChip, { label: 'Active', variant: 'success', dot: true }),
            h(AppChip, { label: 'Pending', variant: 'warning', dot: true }),
            h(AppChip, { label: 'Pre-Sales', variant: 'purple', dot: true }),
          ])
        } }),
      },
      {
        name: 'With count',
        snippet: `<AppChip label="Filters" variant="brand" :count="3" />
<AppChip label="Tags" :count="12" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex flex-wrap gap-2' }, [
            h(AppChip, { label: 'Filters', variant: 'brand', count: 3 }),
            h(AppChip, { label: 'Tags', count: 12 }),
          ])
        } }),
      },
      {
        name: 'Removable',
        description: 'Interactive chips that can be dismissed. Emits @remove on click.',
        snippet: `<AppChip
  v-for="tag in tags" :key="tag"
  :label="tag" variant="brand" removable
  @remove="removeTag(tag)"
/>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex flex-wrap gap-2' }, [
            ...demoTags.value.map(tag =>
              h(AppChip, { label: tag, variant: 'brand', removable: true, onRemove: () => removeTag(tag) })
            ),
            demoTags.value.length === 0
              ? h('span', { class: 'text-xs text-subtle' }, 'All removed — refresh to reset')
              : null,
          ])
        } }),
      },
    ],
  },

  // ── Info Chip ────────────────────────────────────────────────────────────
  'info-chip': {
    title: 'Info Chip',
    description: 'Directional indicator chip for displaying ranked or trended data points. The arrow prefix communicates direction or trend.',
    whenToUse: [
      'Top signals, top vendors, trending metrics in directory/profile views',
      'Any data point that benefits from a directional context (↗ growing, ↘ declining)',
    ],
    whenNotTo: [
      "Don't use for actionable items — it's display only",
      "Don't use without meaningful direction context",
    ],
    props: [
      { name: 'label', type: 'String', default: '—', description: 'Display text' },
      { name: 'direction', type: "'up' | 'down' | 'right' | 'none'", default: "'none'", description: 'Arrow direction indicator' },
      { name: 'variant', type: "'default' | 'brand' | 'success' | 'warning' | 'danger'", default: "'default'", description: 'Color variant' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Size of the chip' },
    ],
    stories: [
      {
        name: 'Directions',
        description: 'Four direction values for different trend signals.',
        snippet: `<AppInfoChip label="Top signal: SALES · 153" direction="up" variant="brand" />
<AppInfoChip label="Trending down" direction="down" variant="danger" />
<AppInfoChip label="Stable" direction="right" variant="success" />
<AppInfoChip label="No change" direction="none" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex flex-wrap gap-2' }, [
            h(AppInfoChip, { label: 'Top signal: SALES · 153', direction: 'up', variant: 'brand' }),
            h(AppInfoChip, { label: 'Trending down', direction: 'down', variant: 'danger' }),
            h(AppInfoChip, { label: 'Stable', direction: 'right', variant: 'success' }),
            h(AppInfoChip, { label: 'No change', direction: 'none' }),
          ])
        } }),
      },
      {
        name: 'Variants',
        snippet: `<AppInfoChip label="Default" />
<AppInfoChip label="Brand" variant="brand" direction="up" />
<AppInfoChip label="Success" variant="success" direction="up" />
<AppInfoChip label="Warning" variant="warning" direction="down" />
<AppInfoChip label="Danger" variant="danger" direction="down" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex flex-wrap gap-2' }, [
            h(AppInfoChip, { label: 'Default' }),
            h(AppInfoChip, { label: 'Brand', variant: 'brand', direction: 'up' }),
            h(AppInfoChip, { label: 'Success', variant: 'success', direction: 'up' }),
            h(AppInfoChip, { label: 'Warning', variant: 'warning', direction: 'down' }),
            h(AppInfoChip, { label: 'Danger', variant: 'danger', direction: 'down' }),
          ])
        } }),
      },
    ],
  },

  // ── Segment Control ──────────────────────────────────────────────────────
  'segment-control': {
    title: 'Segment Control',
    description: 'Pill-group switcher for toggling between two or three views or filter scopes. Functionally similar to tabs but with a more compact, inline appearance.',
    whenToUse: [
      'My Activities / Team toggle in activity lists',
      'Overview / Detail scope switcher',
      'Any 2–3 option toggle where radio buttons would feel too heavy',
    ],
    whenNotTo: [
      "Don't use for more than 3–4 options — use AppViewTabs instead",
      "Don't use as navigation between pages — use router links",
    ],
    props: [
      { name: 'modelValue', type: 'String', default: '—', description: 'Active segment value (v-model)' },
      { name: 'options', type: "Array<{ label: String, value: String, icon?: Component | String }>", default: '[]', description: 'Segment options. icon can be a heroicon component' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '36px or 44px height' },
      { name: 'aria-label', type: 'String', default: 'null', description: 'Accessible name for the tablist' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Size of the control' },
    ],
    stories: [
      {
        name: 'Default',
        description: 'Interactive segment switcher.',
        snippet: `<AppSegmentControl
  v-model="activeView"
  :options="[
    { label: 'My Activities', value: 'mine' },
    { label: 'Team', value: 'team' },
    { label: 'All', value: 'all' },
  ]"
/>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-2' }, [
            h(AppSegmentControl, {
              modelValue: demoSegment.value,
              'onUpdate:modelValue': v => { demoSegment.value = v },
              options: [{ label: 'My Activities', value: 'mine' }, { label: 'Team', value: 'team' }, { label: 'All', value: 'all' }],
            }),
            h('p', { class: 'text-xs text-subtle' }, [
              'Selected: ',
              h('span', { class: 'font-mono text-brand' }, demoSegment.value),
            ]),
          ])
        } }),
      },
      {
        name: 'With icons',
        snippet: `<AppSegmentControl
  v-model="activeView"
  :options="[
    { label: 'Table', value: 'table', icon: TableCellsIcon },
    { label: 'Calendar', value: 'cal', icon: CalendarDaysIcon },
    { label: 'Kanban', value: 'board', icon: ViewColumnsIcon },
  ]"
/>`,
        demo: defineComponent({ setup() {
          return () => h(AppSegmentControl, {
            modelValue: demoSegment2.value,
            'onUpdate:modelValue': v => { demoSegment2.value = v },
            options: [{ label: 'Table', value: 'table', icon: TableCellsIcon }, { label: 'Calendar', value: 'cal', icon: CalendarDaysIcon }, { label: 'Kanban', value: 'board', icon: ViewColumnsIcon }],
          })
        } }),
      },
    ],
  },

  // ── View Tabs ────────────────────────────────────────────────────────────
  'view-tabs': {
    title: 'View Tabs',
    description: 'Underline tab bar for switching between content views within the same page — Table, Calendar, Kanban etc. Each tab can have an optional icon prefix.',
    whenToUse: [
      'Switching between different visual representations of the same data (Table / Calendar / Kanban)',
      'Section tabs within a page (Overview / Members / Settings)',
      'Any 3+ option view switcher',
    ],
    whenNotTo: [
      "Don't use for 2 options — AppSegmentControl is more compact",
      "Don't use for navigation between routes — use RouterLink with active state",
    ],
    props: [
      { name: 'modelValue', type: 'String', default: '—', description: 'Active tab value (v-model)' },
      { name: 'tabs', type: "Array<{ label, value, icon?: Component, count?: Number, tone?: 'neutral' | 'brand' | 'warning' | 'danger' }>", default: '[]', description: 'Tab definitions. count shows a badge (e.g. failed syncs in warning)' },
      { name: 'id-prefix', type: 'String', default: "'tabs'", description: 'Prefix for tab/panel ids — pair with role="tabpanel" :id="`${prefix}-panel-${value}`"' },
      { name: 'aria-label', type: 'String', default: 'null', description: 'Accessible name for the tablist. Arrow keys / Home / End move between tabs' },
    ],
    stories: [
      {
        name: 'Default',
        snippet: `<AppViewTabs
  v-model="activeTab"
  :tabs="[
    { label: 'Overview', value: 'overview' },
    { label: 'Pipeline', value: 'pipeline' },
    { label: 'Activity', value: 'activity' },
  ]"
/>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-3' }, [
            h(AppViewTabs, {
              modelValue: demoTab.value,
              'onUpdate:modelValue': v => { demoTab.value = v },
              tabs: [{ label: 'Overview', value: 'overview' }, { label: 'Pipeline', value: 'pipeline' }, { label: 'Activity', value: 'activity' }],
            }),
            h('p', { class: 'text-xs text-subtle' }, [
              'Active: ',
              h('span', { class: 'font-mono text-brand' }, demoTab.value),
            ]),
          ])
        } }),
      },
      {
        name: 'With icons',
        snippet: `<AppViewTabs
  v-model="activeTab"
  :tabs="[
    { label: 'Overview', value: 'overview', icon: Squares2X2Icon },
    { label: 'Pipeline', value: 'pipeline', icon: BanknotesIcon, count: 4, tone: 'brand' },
    { label: 'Activity', value: 'activity', icon: BoltIcon, count: 8, tone: 'warning' },
  ]"
/>`,
        demo: defineComponent({ setup() {
          return () => h(AppViewTabs, {
            modelValue: demoTab.value,
            'onUpdate:modelValue': v => { demoTab.value = v },
            tabs: [{ label: 'Overview', value: 'overview', icon: Squares2X2Icon }, { label: 'Pipeline', value: 'pipeline', icon: BanknotesIcon, count: 4, tone: 'brand' }, { label: 'Activity', value: 'activity', icon: BoltIcon, count: 8, tone: 'warning' }],
          })
        } }),
      },
    ],
  },

  // ── Radio Card ───────────────────────────────────────────────────────────
  'radio-card': {
    title: 'Radio Card',
    description: 'Selectable card combining a visual icon square, title, description, and radio indicator. Used for prominent single-select choices where visual differentiation matters.',
    whenToUse: [
      'Single-select choice where options have distinct visual identity (Sales, Pre-Sales, Marketing)',
      'Onboarding flows where the user picks a category or type',
      'Any single-select where a regular radio group feels too plain',
    ],
    whenNotTo: [
      "Don't use for more than 5 options — a regular radio list is more scannable",
      "Don't use for binary choices — use AppToggle",
    ],
    props: [
      { name: 'modelValue', type: 'String', default: '—', description: 'Selected value (v-model)' },
      { name: 'value', type: 'String', default: '—', description: 'Value this card represents' },
      { name: 'label', type: 'String', default: '—', description: 'Card title' },
      { name: 'description', type: 'String', default: '—', description: 'Supporting text beneath the title' },
      { name: 'color', type: "'brand' | 'purple' | 'success' | 'warning' | 'danger'", default: "'brand'", description: 'Color of the icon square' },
      { name: 'disabled', type: 'Boolean', default: 'false', description: 'Prevents selection' },
    ],
    stories: [
      {
        name: 'Default',
        description: 'Interactive — click to select a card.',
        snippet: `<AppRadioCard
  v-model="selected"
  value="sales"
  label="Sales"
  description="Customer meetings, demos, closing"
  color="brand"
>
  <template #icon><BriefcaseIcon class="w-5 h-5" /></template>
</AppRadioCard>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-3 max-w-md' }, [
            h(AppRadioCard, {
              modelValue: demoRadio.value, 'onUpdate:modelValue': v => { demoRadio.value = v },
              value: 'sales', label: 'Sales', description: 'Customer meetings, demos, closing', color: 'brand',
            }, { icon: () => h(BriefcaseIcon, { class: 'w-5 h-5' }) }),
            h(AppRadioCard, {
              modelValue: demoRadio.value, 'onUpdate:modelValue': v => { demoRadio.value = v },
              value: 'presales', label: 'Pre-Sales', description: 'Technical evaluations, POCs', color: 'purple',
            }, { icon: () => h(BeakerIcon, { class: 'w-5 h-5' }) }),
            h(AppRadioCard, {
              modelValue: demoRadio.value, 'onUpdate:modelValue': v => { demoRadio.value = v },
              value: 'marketing', label: 'Marketing', description: 'Events, content, campaigns', color: 'success',
            }, { icon: () => h(MegaphoneIcon, { class: 'w-5 h-5' }) }),
            h('p', { class: 'text-xs text-subtle mt-2' }, [
              'Selected: ',
              h('span', { class: 'font-mono text-brand' }, demoRadio.value),
            ]),
          ])
        } }),
      },
    ],
  },

  // ── Spinner ──────────────────────────────────────────────────────────────
  spinner: {
    title: 'Spinner',
    description: 'Animated loading indicator for async operations. Use inline in buttons, or as a page/section overlay for longer loads.',
    whenToUse: [
      "Inside buttons during async actions (use AppButton's loading prop instead where possible)",
      'Section-level loading state while data is being fetched',
      'Page-level loading before first paint',
    ],
    whenNotTo: [
      "Don't use for skeleton-replaced content — use AppSkeleton instead",
      'Avoid showing a spinner for operations under 300ms',
    ],
    props: [
      { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Diameter of the spinner' },
      { name: 'color', type: "'brand' | 'subtle' | 'white'", default: "'brand'", description: 'Color of the spinning arc' },
      { name: 'label', type: 'String', default: '—', description: 'Accessible label for screen readers (visually hidden)' },
    ],
    stories: [
      {
        name: 'Sizes',
        snippet: `<AppSpinner size="xs" />
<AppSpinner size="sm" />
<AppSpinner size="md" />
<AppSpinner size="lg" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex flex-wrap items-center gap-8' }, [
            ...['xs','sm','md','lg'].map(s =>
              h('div', { class: 'flex flex-col items-center gap-2' }, [
                h(AppSpinner, { size: s }),
                h('span', { class: 'text-xs text-subtle font-mono' }, s),
              ])
            ),
          ])
        } }),
      },
      {
        name: 'Colors',
        snippet: `<AppSpinner color="brand" />
<AppSpinner color="subtle" />
<!-- white — use on colored backgrounds -->
<div class="bg-brand rounded-lg p-2">
  <AppSpinner color="white" />
</div>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex flex-wrap items-center gap-6' }, [
            h('div', { class: 'flex flex-col items-center gap-2' }, [
              h(AppSpinner, { color: 'brand' }),
              h('span', { class: 'text-xs text-subtle font-mono' }, 'brand'),
            ]),
            h('div', { class: 'flex flex-col items-center gap-2' }, [
              h(AppSpinner, { color: 'subtle' }),
              h('span', { class: 'text-xs text-subtle font-mono' }, 'subtle'),
            ]),
            h('div', { class: 'flex flex-col items-center gap-2' }, [
              h('div', { class: 'bg-brand rounded-lg p-2' }, h(AppSpinner, { color: 'white' })),
              h('span', { class: 'text-xs text-subtle font-mono' }, 'white'),
            ]),
          ])
        } }),
      },
    ],
  },

  // ── Skeleton ─────────────────────────────────────────────────────────────
  skeleton: {
    title: 'Skeleton',
    description: 'Content placeholder shown while data is loading. Reduces perceived load time by giving the user a preview of the content structure before data arrives.',
    whenToUse: [
      'List items, cards, and tables that are being fetched',
      'Any content area that has a predictable shape before data loads',
    ],
    whenNotTo: [
      "Don't use alongside spinners for the same content area — pick one",
      "Don't use for very short loading states (< 300ms)",
    ],
    props: [
      { name: 'variant', type: "'rect' | 'circle' | 'text' | 'card'", default: "'rect'", description: 'Shape of the skeleton' },
      { name: 'width', type: 'String', default: "'100%'", description: 'CSS width' },
      { name: 'height', type: 'String', default: "'1rem'", description: 'CSS height' },
      { name: 'lines', type: 'Number', default: '1', description: 'Number of lines (only for variant="text")' },
      { name: 'animate', type: 'Boolean', default: 'true', description: 'Whether to show pulse animation' },
    ],
    stories: [
      {
        name: 'Text lines',
        snippet: `<AppSkeleton variant="text" :lines="3" height="12px" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-md' }, h(AppSkeleton, { variant: 'text', lines: 3, height: '12px' }))
        } }),
      },
      {
        name: 'Rect',
        snippet: `<AppSkeleton height="48px" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-md' }, h(AppSkeleton, { height: '48px' }))
        } }),
      },
      {
        name: 'Circle',
        snippet: `<AppSkeleton variant="circle" width="40px" height="40px" />
<AppSkeleton variant="circle" width="56px" height="56px" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex gap-3 items-center' }, [
            h(AppSkeleton, { variant: 'circle', width: '40px', height: '40px' }),
            h(AppSkeleton, { variant: 'circle', width: '56px', height: '56px' }),
          ])
        } }),
      },
      {
        name: 'Card',
        snippet: `<AppSkeleton variant="card" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' }, h(AppSkeleton, { variant: 'card' }))
        } }),
      },
    ],
  },

  // ── Progress Bar ─────────────────────────────────────────────────────────
  progress: {
    title: 'Progress Bar',
    description: 'Linear progress bar for displaying a percentage value. Use for quota attainment, completion rates, or any 0–100% metric.',
    whenToUse: [
      'Quota attainment on vendor/partner cards',
      'Form completion progress',
      'Upload or processing progress',
    ],
    whenNotTo: [
      "Don't use for indefinite loading — use AppSpinner or AppSkeleton instead",
    ],
    props: [
      { name: 'value', type: 'Number', default: '0', description: 'Percentage value (0–100)' },
      { name: 'label', type: 'String', default: '—', description: 'Label shown above the bar' },
      { name: 'showValue', type: 'Boolean', default: 'false', description: 'Shows the numeric percentage after the label' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height of the progress track' },
      { name: 'color', type: "'brand' | 'success' | 'warning' | 'danger' | 'reward'", default: "'brand'", description: 'Color of the filled bar' },
    ],
    stories: [
      {
        name: 'With label and value',
        snippet: `<AppProgressBar :value="35" label="Week" :show-value="true" />
<AppProgressBar :value="98" label="Month" :show-value="true" color="warning" />
<AppProgressBar :value="67" label="Level 3" :show-value="true" color="reward" />
<AppProgressBar :value="100" label="Done" :show-value="true" color="success" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-4 max-w-md' }, [
            h(AppProgressBar, { value: 35, label: 'Week', showValue: true }),
            h(AppProgressBar, { value: 98, label: 'Month', showValue: true, color: 'warning' }),
            h(AppProgressBar, { value: 67, label: 'Level 3', showValue: true, color: 'reward' }),
            h(AppProgressBar, { value: 100, label: 'Done', showValue: true, color: 'success' }),
          ])
        } }),
      },
      {
        name: 'Sizes',
        snippet: `<AppProgressBar :value="60" label="sm" size="sm" />
<AppProgressBar :value="60" label="md" size="md" />
<AppProgressBar :value="60" label="lg" size="lg" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-4 max-w-md' }, [
            h(AppProgressBar, { value: 60, label: 'sm', size: 'sm' }),
            h(AppProgressBar, { value: 60, label: 'md', size: 'md' }),
            h(AppProgressBar, { value: 60, label: 'lg', size: 'lg' }),
          ])
        } }),
      },
    ],
  },

  // ── Divider ──────────────────────────────────────────────────────────────
  divider: {
    title: 'Divider',
    description: 'Thin line separator for visual grouping. Horizontal by default, supports vertical for inline layouts. Optional centered label for section titles.',
    whenToUse: [
      'Separating sections within a card or form',
      'Dividing sidebar sections',
      "Inline divider between elements like 'or'",
    ],
    whenNotTo: [
      "Don't overuse — whitespace is often a better separator than a line",
    ],
    props: [
      { name: 'vertical', type: 'Boolean', default: 'false', description: 'Renders as a vertical line instead of horizontal' },
    ],
    stories: [
      {
        name: 'Horizontal',
        snippet: `<AppDivider />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-md' }, h(AppDivider))
        } }),
      },
      {
        name: 'With label',
        snippet: `<AppDivider>or continue with</AppDivider>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-md' }, h(AppDivider, null, () => 'or continue with'))
        } }),
      },
      {
        name: 'Vertical',
        snippet: `<div class="flex items-center h-8 gap-4">
  <span>Left</span>
  <AppDivider vertical />
  <span>Right</span>
</div>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'flex items-center h-8 gap-4' }, [
            h('span', { class: 'text-sm text-subtle' }, 'Left'),
            h(AppDivider, { vertical: true }),
            h('span', { class: 'text-sm text-subtle' }, 'Right'),
          ])
        } }),
      },
    ],
  },

  // ── Empty State ──────────────────────────────────────────────────────────
  'empty-state': {
    title: 'Empty State',
    description: 'Zero-state UI for empty lists, search results, or onboarding prompts. Includes icon, title, description, and optional action slot.',
    whenToUse: [
      'Empty activity lists or dashboards with no data yet',
      'Search returning 0 results',
      'Filtered views with no matching items',
    ],
    whenNotTo: [
      "Don't show an empty state during loading — show a skeleton instead",
    ],
    props: [
      { name: 'title', type: 'String', default: '—', description: 'Main heading text' },
      { name: 'description', type: 'String', default: '—', description: 'Supporting detail text' },
      { name: 'compact', type: 'Boolean', default: 'false', description: 'Reduces padding for use inside cards or sidebars' },
    ],
    stories: [
      {
        name: 'Default',
        snippet: `<AppEmptyState
  title="No activities yet"
  description="Log your first activity to start tracking."
>
  <template #action>
    <AppButton variant="primary" size="sm">Log Activity</AppButton>
  </template>
</AppEmptyState>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'rounded-2xl border border-line' },
            h(AppEmptyState, { title: 'No activities yet', description: 'Log your first activity to start tracking.' }, {
              action: () => h(AppButton, { variant: 'primary', size: 'sm' }, () => 'Log Activity'),
            })
          )
        } }),
      },
      {
        name: 'Compact',
        description: 'Reduced padding for use inside cards or narrow panels.',
        snippet: `<AppEmptyState
  title="No vendor data"
  description="Activities with vendor links appear here."
  compact
/>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'rounded-2xl border border-line' },
            h(AppEmptyState, { title: 'No vendor data', description: 'Activities with vendor links appear here.', compact: true })
          )
        } }),
      },
    ],
  },

  // ── Form Field ───────────────────────────────────────────────────────────
  'form-field': {
    title: 'Form Field',
    description: 'Wrapper molecule that pairs a label, hint, and error message with any form input. Ensures consistent label/error spacing and wires for accessibility automatically.',
    whenToUse: [
      'Wrapping every form input that needs a label',
      'Any field that can have an error message or helper text',
    ],
    whenNotTo: [
      "Don't use without an input inside — it's a wrapper, not a standalone element",
    ],
    props: [
      { name: 'label', type: 'String', default: '—', description: 'Label text displayed above the input' },
      { name: 'hint', type: 'String', default: '—', description: 'Small annotation shown inline with the label (e.g. "Required")' },
      { name: 'helper', type: 'String', default: '—', description: 'Helper text shown below the input' },
      { name: 'error', type: 'String', default: '—', description: 'Error message shown below the input in danger color' },
      { name: 'required', type: 'Boolean', default: 'false', description: 'Shows a * indicator on the label' },
      { name: 'fullWidth', type: 'Boolean', default: 'true', description: 'Makes the field take full container width' },
      { name: 'inputId', type: 'String', default: '—', description: 'ID wired to the label for accessibility' },
      { name: 'icon', type: 'Component', default: 'null', description: 'Heroicon before the label — e.g. the vendor / reseller / end user icon' },
      { name: 'iconClass', type: 'String', default: "'text-fg-muted'", description: "Colour for the icon, e.g. 'text-accent-purple'" },
    ],
    stories: [
      {
        name: 'Default',
        snippet: `<AppFormField label="Vendor name" helper="The vendor you met with">
  <AppInput v-model="vendor" placeholder="e.g. Sentrix" />
</AppFormField>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' },
            h(AppFormField, { label: 'Vendor name', helper: 'The vendor you met with' }, {
              default: () => h(AppInput, { modelValue: demoFormInput.value, 'onUpdate:modelValue': v => { demoFormInput.value = v }, placeholder: 'e.g. Sentrix' }),
            })
          )
        } }),
      },
      {
        name: 'Required field',
        snippet: `<AppFormField label="Activity type" required hint="Required">
  <AppSelect v-model="type" :options="options" placeholder="Select…" />
</AppFormField>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' },
            h(AppFormField, { label: 'Activity type', required: true, hint: 'Required' }, {
              default: () => h(AppSelect, { modelValue: demoFormSelect.value, 'onUpdate:modelValue': v => { demoFormSelect.value = v }, options: ['Sales','Pre-Sales','Marketing'], placeholder: 'Select…' }),
            })
          )
        } }),
      },
      {
        name: 'With error',
        snippet: `<AppFormField label="Notes" error="At least 20 characters required">
  <AppInput v-model="notes" placeholder="Describe the activity…" :error="true" />
</AppFormField>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'max-w-sm' },
            h(AppFormField, { label: 'Notes', error: 'At least 20 characters required' }, {
              default: () => h(AppInput, { modelValue: demoFormInput.value, 'onUpdate:modelValue': v => { demoFormInput.value = v }, placeholder: 'Describe the activity…', error: true }),
            })
          )
        } }),
      },
      {
        name: 'With icon',
        description: 'An icon before the label ties the field to a category. Colour it with the matching accent token.',
        snippet: `<AppFormField label="Vendor" :icon="BuildingStorefrontIcon" icon-class="text-accent-purple" input-id="vendor">
  <AppInput id="vendor" v-model="vendor" placeholder="e.g. Sentrix" />
</AppFormField>
<AppFormField label="Reseller" :icon="BuildingOffice2Icon" icon-class="text-brand" input-id="reseller">…</AppFormField>
<AppFormField label="End user" :icon="UserGroupIcon" icon-class="text-accent-amber" input-id="enduser">…</AppFormField>`,
        demo: defineComponent({ setup() {
          const fields = [
            { label: 'Vendor', icon: BuildingStorefrontIcon, iconClass: 'text-accent-purple', placeholder: 'e.g. Sentrix' },
            { label: 'Reseller', icon: BuildingOffice2Icon, iconClass: 'text-brand', placeholder: 'e.g. Brightwave plc' },
            { label: 'End user', icon: UserGroupIcon, iconClass: 'text-accent-amber', placeholder: 'e.g. Northwind' },
          ]
          return () => h('div', { class: 'grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl' }, fields.map((f, i) =>
            h(AppFormField, { label: f.label, icon: f.icon, iconClass: f.iconClass, inputId: 'ds-ff-icon-' + i }, {
              default: () => h(AppInput, { id: 'ds-ff-icon-' + i, placeholder: f.placeholder, modelValue: i === 0 ? demoFormIcon.value : '', 'onUpdate:modelValue': (v) => { if (i === 0) demoFormIcon.value = v } }),
            })
          ))
        } }),
      },
    ],
  },

  // ── Color tokens ─────────────────────────────────────────────────────────
  colors: {
    title: 'Color Tokens',
    description: 'Semantic, theme-aware palette. Tokens are RGB channels in CSS variables (src/styles/index.css) mapped in tailwind-preset.js, so one class works in light and dark mode and still supports opacity modifiers (bg-brand/10). Rule of thumb: indigo is action, gold is reward.',
    whenToUse: [
      'Use bg-page / bg-surface-1/2/3 / border-line for every background and border',
      'Use text-fg, text-fg-2 and text-fg-muted for text hierarchy',
      'Use brand for interactive elements — CTAs, active states, focus rings, links',
      'Use reward (gold) only for points, levels, XP and bonuses',
      'Use podium-gold/silver/bronze only for rank 1/2/3',
      'Use accent-blue / purple / pink / amber for categories — chips, pickers, form-field icons. Pick one meaning per accent in your app',
    ],
    whenNotTo: [
      "Don't write light/dark pairs (bg-surface-1) in new code — the semantic token already switches",
      "Don't use gold for anything that isn't a reward — it loses meaning",
      "Don't add raw hex in templates — add a variable in styles/index.css and a token in tailwind-preset.js",
    ],
    stories: [
      {
        name: 'Surfaces & text',
        description: 'Layered surfaces, never pure black. Switch the theme to see both sets.',
        snippet: `<div class="bg-page">                 <!-- page -->
  <div class="bg-surface-1 border border-line rounded-card">   <!-- card -->
    <div class="bg-surface-2">          <!-- row / control inside a card -->
      <p class="text-fg">Primary</p>
      <p class="text-fg-2">Secondary</p>
      <p class="text-fg-muted">Meta</p>`,
        demo: defineComponent({ setup() {
          const tokens = [
            { cls: 'bg-page', name: 'page', use: 'Page background' },
            { cls: 'bg-surface-1', name: 'surface-1', use: 'Cards, panels' },
            { cls: 'bg-surface-2', name: 'surface-2', use: 'Rows, controls' },
            { cls: 'bg-surface-3', name: 'surface-3', use: 'Hover, active segment' },
            { cls: 'bg-line', name: 'line', use: 'Borders, dividers' },
          ]
          return () => h('div', { class: 'space-y-5' }, [
            h('div', { class: 'grid grid-cols-2 sm:grid-cols-5 gap-3' }, tokens.map(t =>
              h('div', { class: 'rounded-xl overflow-hidden border border-line' }, [
                h('div', { class: 'h-12 ' + t.cls }),
                h('div', { class: 'p-3 bg-surface-1' }, [
                  h('p', { class: 'text-xs font-bold font-mono' }, t.name),
                  h('p', { class: 'text-xs text-fg-muted mt-0.5' }, t.use),
                ]),
              ])
            )),
            h('div', { class: 'flex flex-wrap gap-6' }, [
              h('p', { class: 'text-fg font-bold' }, 'text-fg — primary'),
              h('p', { class: 'text-fg-2' }, 'text-fg-2 — secondary'),
              h('p', { class: 'text-fg-muted' }, 'text-fg-muted — meta'),
            ]),
          ])
        } }),
      },
      {
        name: 'Accents',
        description: 'Two accents only. Status and category colors stay strict — each means one thing.',
        snippet: `bg-brand text-brand-on          /* action — CTA fill + its text */
text-brand  hover:text-brand-hover  /* links */
bg-reward-fill text-reward-on   /* reward fill — Claim bonus, XP bar */
text-reward                     /* gold text — points */
bg-podium-gold | -silver | -bronze  /* rank 1/2/3 only */
success · warning · danger      /* status */
accent-blue · accent-purple · accent-pink · accent-amber   /* categories */`,
        demo: defineComponent({ setup() {
          const tokens = [
            { cls: 'bg-brand', name: 'brand', use: 'Action, focus' },
            { cls: 'bg-reward-fill', name: 'reward', use: 'Points, XP, bonus' },
            { cls: 'bg-podium-gold', name: 'podium-gold', use: 'Rank 1' },
            { cls: 'bg-podium-silver', name: 'podium-silver', use: 'Rank 2' },
            { cls: 'bg-podium-bronze', name: 'podium-bronze', use: 'Rank 3' },
            { cls: 'bg-success', name: 'success', use: 'Completed, live' },
            { cls: 'bg-warning', name: 'warning', use: 'Caution' },
            { cls: 'bg-danger', name: 'danger', use: 'Errors, destructive' },
            { cls: 'bg-accent-blue', name: 'accent-blue', use: 'Category' },
            { cls: 'bg-accent-purple', name: 'accent-purple', use: 'Category' },
            { cls: 'bg-accent-pink', name: 'accent-pink', use: 'Category' },
            { cls: 'bg-accent-amber', name: 'accent-amber', use: 'Category' },
          ]
          return () => h('div', { class: 'grid grid-cols-2 sm:grid-cols-3 gap-3' }, tokens.map(t =>
            h('div', { class: 'rounded-xl overflow-hidden border border-line' }, [
              h('div', { class: 'h-12 ' + t.cls }),
              h('div', { class: 'p-3 bg-surface-1' }, [
                h('p', { class: 'text-xs font-bold font-mono' }, t.name),
                h('p', { class: 'text-xs text-fg-muted mt-0.5' }, t.use),
              ]),
            ])
          ))
        } }),
      },
      {
        name: 'Record types & companies',
        description: 'Example: each record type and company kind in an app gets one accent + icon, used for badges, chips, calendar events and pickers. Defined once in the app (here docs/src/activityStyles.js: RECORD_STYLE, COMPANY_STYLE).',
        snippet: `import { RECORD_STYLE, COMPANY_STYLE } from '../activityStyles'

RECORD_STYLE['Pre-Sales'].soft   // 'bg-accent-purple/15 text-accent-purple'
RECORD_STYLE.Sales.icon          // ArrowTrendingUpIcon
COMPANY_STYLE.reseller.soft      // 'bg-brand/15 text-brand'

// AppCombobox chips use the same colours: tone="brand" | "purple" | "amber"`,
        demo: defineComponent({ setup() {
          const rec = Object.entries(RECORD_STYLE)
          const comp = [['Vendor', COMPANY_STYLE.vendor], ['Reseller', COMPANY_STYLE.reseller], ['End user', COMPANY_STYLE.endUser]]
          const tile = ([name, st]) => h('div', { class: 'flex items-center gap-3 rounded-xl border border-line bg-surface-1 p-3' }, [
            h('span', { class: 'w-10 h-10 rounded-xl flex items-center justify-center ' + st.soft }, h(st.icon, { class: 'w-5 h-5' })),
            h('div', [h('p', { class: 'text-sm font-extrabold' }, name), h('p', { class: 'text-xs font-mono text-fg-muted' }, st.soft)]),
          ])
          return () => h('div', { class: 'space-y-4' }, [
            h('p', { class: 'text-overline text-fg-muted' }, 'Record types'),
            h('div', { class: 'grid grid-cols-1 sm:grid-cols-3 gap-3' }, rec.map(tile)),
            h('p', { class: 'text-overline text-fg-muted' }, 'Company kinds'),
            h('div', { class: 'grid grid-cols-1 sm:grid-cols-3 gap-3' }, comp.map(tile)),
          ])
        } }),
      },
    ],
  },

  // ── Typography ───────────────────────────────────────────────────────────
  typography: {
    title: 'Typography',
    description: 'Inter is the typeface and runs the whole UI (self-hosted via @fontsource/inter). Bold for titles and big numbers, Regular for UI and body, Light only for large intro copy, Medium caps with +100 tracking for overlines and CTAs. There is no second typeface: font-display, font-sans and font-mono all map to Inter. font-mono adds tabular figures, so countdowns, periods and IDs keep their width as digits change.',
    whenToUse: [
      'font-bold (Inter Bold) for page titles, section titles and large numbers (points, KPIs)',
      'Default Inter Regular for body, tables and forms — Light only for 18px+ intro copy',
      'CTAs (primary/reward buttons) are caps with +100 tracking — AppButton does this for you',
      'font-mono (Inter, tabular figures) for countdowns, "3d left" and IDs',
      'text-overline (12px, uppercase, tracked) for labels above metrics',
      'Add .tabular to numbers that line up in columns',
    ],
    whenNotTo: [
      "Don't use Inter Light below 18px — it gets too thin in tables and forms",
      "Don't add another typeface — Inter is the whole system",
      "Don't go below 12px for text — text-2xs (10px) is too small for labels",
      "Don't use emoji as icons — use heroicons",
    ],
    stories: [
      {
        name: 'Type Scale',
        description: 'Bold for hierarchy, Regular for reading, Medium caps for labels, tabular figures for time.',
        snippet: `<h1 class="font-display font-bold text-[34px] tracking-tight">Good morning, Luka</h1>
<h2 class="font-display font-bold text-[22px]">Weekly challenge</h2>
<h3 class="font-display font-semibold text-xl">Recent activity</h3>
<p class="text-base text-fg-2">Body copy</p>
<p class="text-overline text-fg-2">Pipeline generated</p>
<p class="font-display font-bold text-num-lg tabular">£22,000</p>
<p class="font-mono font-bold">03d 14h</p>`,
        demo: defineComponent({ setup() {
          const scale = [
            { cls: 'font-display font-bold text-[34px] tracking-tight', label: 'Inter · 34 / 700', sample: 'Good morning' },
            { cls: 'font-display font-bold text-[22px]', label: 'Inter · 22 / 700', sample: 'Weekly challenge' },
            { cls: 'font-display font-semibold text-xl', label: 'Inter · 20 / 600', sample: 'Recent activity' },
            { cls: 'text-lg font-light text-fg-2', label: 'Inter · 18 / 300', sample: 'Every activity moves you up the grid.' },
            { cls: 'text-lg font-extrabold', label: 'Inter · 18 / 800', sample: 'Lukas Brenner' },
            { cls: 'text-base text-fg-2', label: 'Inter · 16 / 400', sample: 'Log a Sales activity before Sunday' },
            { cls: 'text-sm text-fg-2', label: 'Inter · 14 / 400', sample: 'Sales · 2026-09-25 · Sentrix' },
            { cls: 'text-overline text-fg-2', label: 'overline · 12 / 500 +100', sample: 'Pipeline generated' },
            { cls: 'font-display font-bold text-num-lg tabular', label: 'text-num-lg · 40', sample: '£22,000' },
            { cls: 'font-mono font-bold text-[15px] text-brand', label: 'font-mono · 15 / 700 · tabular', sample: '03d 14h 22m' },
          ]
          return () => h('div', { class: 'space-y-3' },
            scale.map(t =>
              h('div', { class: 'flex items-baseline gap-4 py-1 border-b border-line last:border-0' }, [
                h('span', { class: 'text-xs text-fg-muted font-mono w-44 flex-shrink-0' }, t.label),
                h('p', { class: t.cls + ' truncate' }, t.sample),
              ])
            )
          )
        } }),
      },
      {
        name: 'Setup',
        description: 'Inter ships with the kit (styles.css imports the weights) — apps add nothing.',
        snippet: `/* @nebojsab/vue-ui-kit/styles.css — weights 300–800 */
@import '@fontsource/inter/400.css'; /* …300, 500, 600, 700, 800 */
.font-mono { font-variant-numeric: tabular-nums; }

// tailwind-preset.js
fontFamily: {
  display: ['Inter', 'sans-serif'],
  sans:    ['Inter', 'system-ui', 'sans-serif'],
  mono:    ['Inter', 'sans-serif'],   // + tabular figures
}`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'grid grid-cols-1 sm:grid-cols-3 gap-4' }, [
            h('div', { class: 'rounded-xl bg-surface-2 p-4' }, [h('p', { class: 'font-display font-bold text-3xl' }, 'Aa'), h('p', { class: 'text-sm text-fg-2 mt-2' }, 'Inter Bold · titles')]),
            h('div', { class: 'rounded-xl bg-surface-2 p-4' }, [h('p', { class: 'font-light text-3xl' }, 'Aa'), h('p', { class: 'text-sm text-fg-2 mt-2' }, 'Inter Light / Regular · copy')]),
            h('div', { class: 'rounded-xl bg-surface-2 p-4' }, [h('p', { class: 'font-mono font-bold text-3xl' }, '0123'), h('p', { class: 'text-sm text-fg-2 mt-2' }, 'Inter tabular · font-mono')]),
          ])
        } }),
      },
    ],
  },

  // ── Spacing ──────────────────────────────────────────────────────────────
  spacing: {
    title: 'Spacing Scale',
    description: 'Based on Tailwind\'s 4px grid (1 unit = 4px). The scale is intentionally constrained — using the prescribed stops keeps visual rhythm consistent across the entire UI. Gap and margin values follow the same scale.',
    whenToUse: [
      'Use p-5 (20px) as the default card padding',
      'Use p-6 (24px) for large form sections and page-level sections',
      'Use gap-3 (12px) for dense grids, gap-4 (16px) for standard grids',
      'Use mb-8 (32px) between major page sections',
      'Use gap-2 (8px) for icon-to-label spacing in buttons and chips',
    ],
    whenNotTo: [
      "Don't use arbitrary pixel values like p-[18px] — round to the nearest scale stop",
      "Don't use spacing tokens outside the defined stops (p-7, p-9 etc.) without design review",
    ],
    stories: [
      {
        name: 'Space Scale Reference',
        description: 'Visual reference for key spacing stops used across components.',
        snippet: `/* Key spacing stops */
p-1   → 4px   icon internal padding
p-2   → 8px   badge/chip padding
p-3   → 12px  button sm, dense lists
p-4   → 16px  button md, standard padding
p-5   → 20px  card default padding
p-6   → 24px  large sections, forms
gap-2 → 8px   icon-to-label gap
gap-3 → 12px  dense grid gap
gap-4 → 16px  standard grid gap
gap-6 → 24px  section gap
mb-8  → 32px  between page sections`,
        demo: defineComponent({ setup() {
          const stops = [
            { token: 'p-1',   px: 4,  usage: 'Icon internal padding' },
            { token: 'p-2',   px: 8,  usage: 'Badge / chip padding' },
            { token: 'p-3',   px: 12, usage: 'Button sm, dense lists' },
            { token: 'p-4',   px: 16, usage: 'Button md, standard padding' },
            { token: 'p-5',   px: 20, usage: 'Card default padding' },
            { token: 'p-6',   px: 24, usage: 'Large sections, forms' },
            { token: 'gap-2', px: 8,  usage: 'Icon → label gap' },
            { token: 'gap-3', px: 12, usage: 'Dense grid gap' },
            { token: 'gap-4', px: 16, usage: 'Standard grid gap' },
            { token: 'gap-6', px: 24, usage: 'Section gap' },
            { token: 'mb-8',  px: 32, usage: 'Between page sections' },
          ]
          return () => h('div', { class: 'space-y-2.5' },
            stops.map(s =>
              h('div', { class: 'flex items-center gap-4' }, [
                h('span', { class: 'text-xs font-mono text-subtle w-16 flex-shrink-0' }, s.token),
                h('div', {
                  class: 'bg-brand/40 rounded flex-shrink-0',
                  style: `width:${s.px}px;height:14px`
                }),
                h('span', { class: 'text-xs text-subtle' }, `${s.px}px — ${s.usage}`),
              ])
            )
          )
        } }),
      },
    ],
  },


  // ── Stat Card ────────────────────────────────────────────────────────────
  'stat-card': {
    title: 'Stat Card',
    description: 'A single KPI: label, big display-font value, optional sub-label and extra content (e.g. an XP bar) in the default slot. The reward tone turns the card gold — use it only for points. `featured` marks the most important metric on the page with the hero gradient backdrop (soft in light, night in dark) and a gradient value.',
    whenToUse: [
      'KPI rows (Activities, Pipeline, Total points)',
      'One number that answers one question',
      'featured on the one metric that matters most in the row — usually pipeline',
    ],
    whenNotTo: [
      "Don't put more than one number in a card",
      "Don't use tone=\"reward\" for anything that isn't points or levels",
      "Don't feature more than one card per row — if everything pops, nothing does",
    ],
    props: [
      { name: 'label', type: 'String', default: '—', description: 'Overline label (required)' },
      { name: 'value', type: 'String | Number', default: 'null', description: 'Main value. null / empty shows a muted dash. Words get a smaller size automatically' },
      { name: 'sublabel', type: 'String', default: 'null', description: 'Muted line under the value' },
      { name: 'icon', type: 'Component', default: 'null', description: 'Heroicon shown top-right' },
      { name: 'tone', type: "'default' | 'reward'", default: "'default'", description: 'Reward = gold card for points' },
      { name: 'featured', type: 'Boolean', default: 'false', description: 'Most important metric in the row — hero gradient backdrop and a gradient value' },
    ],
    stories: [
      {
        name: 'Default and reward',
        description: 'Numbers, words, empty values and a reward card with an XP bar in the slot.',
        snippet: `<StatCard label="Activities" :value="35" sublabel="This week" />
<StatCard label="Top activity type" value="Pre-Sales" sublabel="This week" />
<StatCard label="Pipeline generated" :value="null" sublabel="Shows once you log activities" />
<StatCard label="Total points" tone="reward" value="710">
  <AppXpBar :level="3" :value="53" :show-labels="false" size="sm" />
</StatCard>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4' }, [
          h(StatCard, { label: 'Activities', value: 35, sublabel: 'This week' }),
          h(StatCard, { label: 'Top activity type', value: 'Pre-Sales', sublabel: 'This week' }),
          h(StatCard, { label: 'Pipeline generated', value: null, sublabel: 'Shows once you log activities' }),
          h(StatCard, { label: 'Total points', tone: 'reward', value: '710' }, () => h(AppXpBar, { level: 3, value: 53, showLabels: false, size: 'sm' })),
        ]) } }),
      },
      {
        name: 'Featured',
        description: 'One per row: the metric the page is really about. Follows the theme — a soft indigo gradient in light, a night gradient in dark.',
        snippet: `<StatCard label="Activities" :value="35" sublabel="This month" />
<StatCard featured label="Pipeline influenced" value="£67k" sublabel="This month" :icon="BriefcaseIcon" />
<StatCard label="Next booked" value="5 Oct" sublabel="Qualification Call · in 2 days" />`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'grid grid-cols-1 sm:grid-cols-3 gap-4' }, [
          h(StatCard, { label: 'Activities', value: 35, sublabel: 'This month' }),
          h(StatCard, { featured: true, label: 'Pipeline influenced', value: '£67k', sublabel: 'This month' }),
          h(StatCard, { label: 'Next booked', value: '5 Oct', sublabel: 'Qualification Call · in 2 days' }),
        ]) } }),
      },
    ],
  },

  // ── Period Tabs ──────────────────────────────────────────────────────────
  'period-tabs': {
    title: 'Period Tabs',
    description: 'Period switcher that doubles as a progress indicator. Each tab shows its label, a meta string ("3d left") and a bar for how much of the period has elapsed — it replaces separate "period progress" bars. Supports arrow-key navigation (WAI-ARIA tabs).',
    whenToUse: [
      'Switching the time window of a whole section (race, KPIs)',
      'When the time remaining in each option matters to the user',
    ],
    whenNotTo: [
      "Don't use for non-time options — use Segment Control",
      "Don't use for page-level navigation — use View Tabs",
    ],
    props: [
      { name: 'v-model', type: 'String', default: '—', description: 'Selected tab value' },
      { name: 'tabs', type: 'Array<{ value, label, labelShort?, meta?, metaShort?, progress? }>', default: '—', description: 'progress is 0–100 elapsed. *Short variants are used below the sm breakpoint' },
      { name: 'aria-label', type: 'String', default: "'Period'", description: 'Accessible name of the tablist' },
    ],
    stories: [
      {
        name: 'Race periods',
        description: 'Fed from useRaceStore().periods in the app.',
        snippet: `<AppPeriodTabs
  v-model="period"
  aria-label="Race period"
  :tabs="[
    { value: 'week',    label: 'Week',    meta: '3d left',  metaShort: '3d',  progress: 55 },
    { value: 'month',   label: 'Month',   meta: '30d left', metaShort: '30d', progress: 3 },
    { value: 'quarter', label: 'Quarter', labelShort: 'Qtr', meta: '91d left', metaShort: '91d', progress: 1 },
    { value: 'year',    label: 'Year',    meta: '91d left', metaShort: '91d', progress: 75 },
  ]"
/>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'space-y-3' }, [
          h(AppPeriodTabs, {
            modelValue: demoPeriod.value,
            'onUpdate:modelValue': (v) => { demoPeriod.value = v },
            ariaLabel: 'Race period',
            tabs: [
              { value: 'week', label: 'Week', meta: '3d left', metaShort: '3d', progress: 55 },
              { value: 'month', label: 'Month', meta: '30d left', metaShort: '30d', progress: 3 },
              { value: 'quarter', label: 'Quarter', labelShort: 'Qtr', meta: '91d left', metaShort: '91d', progress: 1 },
              { value: 'year', label: 'Year', meta: '91d left', metaShort: '91d', progress: 75 },
            ],
          }),
          h('p', { class: 'text-sm text-fg-2' }, `Selected: ${demoPeriod.value}`),
        ]) } }),
      },
    ],
  },

  // ── Countdown ────────────────────────────────────────────────────────────
  countdown: {
    title: 'Countdown',
    description: 'Live countdown in mono tiles. Ticks every second when seconds are shown, otherwise every 30 seconds. Exposed to assistive tech as role="timer" with a readable label.',
    whenToUse: [
      'Time left in a race, promotion or bonus window',
    ],
    whenNotTo: [
      "Don't use for durations that already passed — show a date instead",
      "Don't show seconds unless the page is about the deadline (a challenge page yes, a dashboard no)",
    ],
    props: [
      { name: 'to', type: 'Date | String | Number', default: '—', description: 'Target moment' },
      { name: 'units', type: "Array<'days'|'hours'|'minutes'|'seconds'>", default: "['days','hours','minutes']", description: 'Units to show, in order' },
      { name: 'label', type: 'String', default: 'null', description: 'Overline above the tiles' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '52px or 60px tiles' },
      { name: 'align', type: "'start' | 'end'", default: "'start'", description: 'Alignment of label + tiles' },
    ],
    stories: [
      {
        name: 'Sizes',
        description: 'sm in compact headers, md with seconds on a dedicated page.',
        snippet: `<AppCountdown :to="period.end" label="Ends in" size="sm" />
<AppCountdown :to="period.end" :units="['days','hours','minutes','seconds']" label="Challenge ends in" />`,
        demo: defineComponent({ setup() {
          const to = Date.now() + 3 * 86_400_000 + 14 * 3_600_000 + 22 * 60_000
          return () => h('div', { class: 'flex flex-wrap items-end gap-8' }, [
            h(AppCountdown, { to, label: 'Ends in', size: 'sm' }),
            h(AppCountdown, { to, label: 'Race ends in', units: ['days', 'hours', 'minutes', 'seconds'] }),
          ])
        } }),
      },
    ],
  },

  // ── XP Bar ───────────────────────────────────────────────────────────────
  'xp-bar': {
    title: 'XP Bar',
    description: 'Level progress in gold. Feed it from one source of truth in your app (level, percentage and points to the next level) so every bar agrees.',
    whenToUse: [
      'Progress inside the current level — topbar, KPI card, profile, leaderboard',
    ],
    whenNotTo: [
      "Don't use for non-reward progress (quota, upload) — use Progress Bar",
      "Don't compute level or % in a component — read it from one shared store",
    ],
    props: [
      { name: 'level', type: 'Number', default: '—', description: 'Current level' },
      { name: 'value', type: 'Number', default: '—', description: '0–100 progress inside the level' },
      { name: 'current', type: 'Number', default: '0', description: 'Lifetime points (label)' },
      { name: 'max', type: 'Number', default: '0', description: 'Points needed for next level (label)' },
      { name: 'show-labels', type: 'Boolean', default: 'true', description: 'Level + "x / y XP" row' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Bar height' },
    ],
    stories: [
      {
        name: 'With and without labels',
        description: 'Default slot renders under the bar.',
        snippet: `<AppXpBar :level="info.level" :value="info.pct" :current="info.points" :max="info.levelEnd">
  <p class="text-[13px] text-reward/80">{{ info.toNext }} XP to Level {{ info.nextLevel }}</p>
</AppXpBar>
<AppXpBar :level="3" :value="53" :show-labels="false" size="sm" />`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'space-y-6 max-w-sm' }, [
          h(AppXpBar, { level: 3, value: 53, current: 710, max: 900 }, () => h('p', { class: 'text-[13px] text-reward/80' }, '190 XP to Level 4')),
          h(AppXpBar, { level: 3, value: 53, showLabels: false, size: 'sm' }),
        ]) } }),
      },
    ],
  },

  // ── Reward Box ───────────────────────────────────────────────────────────
  'reward-box': {
    title: 'Reward Box',
    description: 'Animated daily-bonus box. While a reward is waiting it periodically wiggles, pulses a gold glow, sweeps a shimmer and pings its dot. Clicking it bursts particles and a floating "+N", then settles into the claimed state. All motion is turned off under prefers-reduced-motion.',
    whenToUse: [
      'A reward the user can claim right now (daily bonus)',
      'Exactly one animated box per screen — pass :animate="false" to any other instance',
    ],
    whenNotTo: [
      "Don't use for regular notifications — it's only for claimable rewards",
      "Don't animate more than one reward box at a time",
    ],
    props: [
      { name: 'available', type: 'Boolean', default: 'true', description: 'Reward ready to claim. false shows the claimed state' },
      { name: 'points', type: 'Number', default: '50', description: 'Shown in the burst and labels' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '36px or 44px' },
      { name: 'animate', type: 'Boolean', default: 'true', description: 'Idle attention animation' },
      { name: 'dot', type: 'Boolean', default: 'true', description: 'Pink notification dot' },
      { name: 'popover', type: 'Boolean', default: 'true', description: 'Styled hover / focus popover with points and time until the daily reset' },
      { name: 'placement', type: "'bottom' | 'right'", default: "'bottom'", description: 'Popover side — right for the sidebar rail. Bottom left-aligns on phones' },
      { name: '@claim', type: 'Event', default: '—', description: 'Fired on click while available' },
    ],
    stories: [
      {
        name: 'States',
        description: 'Click the first box to see the claim burst. It resets after 2 seconds in this demo.',
        snippet: `<AppRewardBox
  :available="auth.dailyBonusAvailable"
  :points="auth.dailyBonusPoints"
  @claim="auth.claimDailyBonus()"
/>
<AppRewardBox size="sm" :animate="false" :dot="false" />
<AppRewardBox :available="false" />`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'flex items-center gap-8 pt-6' }, [
          h(AppRewardBox, { available: demoReward.value, points: 50, onClaim: () => { demoReward.value = false; setTimeout(() => { demoReward.value = true }, 2000) } }),
          h(AppRewardBox, { size: 'sm', animate: false, dot: false }),
          h(AppRewardBox, { available: false }),
        ]) } }),
      },
    ],
  },

  // ── Textarea ─────────────────────────────────────────────────────────────
  textarea: {
    title: 'Textarea',
    description: 'Multi-line text field with the same look, focus ring and error state as Input. Wrap it in Form Field for a label.',
    whenToUse: ['Descriptions, next steps, support messages — anything longer than one line'],
    whenNotTo: ["Don't use for single-line values — use Input"],
    props: [
      { name: 'v-model', type: 'String', default: "''", description: 'Value' },
      { name: 'rows', type: 'Number', default: '4', description: 'Visible lines' },
      { name: 'placeholder', type: 'String', default: "''", description: 'Placeholder text' },
      { name: 'error', type: 'Boolean', default: 'false', description: 'Danger border + ring' },
      { name: 'resize', type: 'Boolean', default: 'false', description: 'Allow vertical resize' },
    ],
    stories: [
      {
        name: 'In a form field',
        description: 'Label wiring via input-id.',
        snippet: `<AppFormField label="Description" input-id="desc" required>
  <AppTextarea id="desc" v-model="body" placeholder="Describe the activity…" />
</AppFormField>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'max-w-md' },
          h(AppFormField, { label: 'Description', inputId: 'ds-desc', required: true }, {
            default: () => h(AppTextarea, { id: 'ds-desc', modelValue: demoTextarea.value, 'onUpdate:modelValue': (v) => { demoTextarea.value = v }, placeholder: 'Describe the activity…' }),
          })
        ) } }),
      },
    ],
  },

  // ── Combobox ─────────────────────────────────────────────────────────────
  combobox: {
    title: 'Combobox',
    description: 'Searchable picker for one or many values (companies, opportunities). Keyboard: ↑ ↓ to move, Enter to pick, Esc to close. Rule: a single-select shows its value INSIDE the field with Change and ×, so it never looks like more can be added. Multi-select keeps the search field and lists values as chips below. The results list is teleported to <body> with fixed positioning (useFloating), so a modal\'s scrolling body can\'t cut it off, and it opens above the field when there is no room below.',
    whenToUse: [
      'Picking from a long list where typing is faster than scrolling (vendors, resellers, end users)',
      'multiple for fields that accept several values (Vendors, End users)',
    ],
    whenNotTo: [
      "Don't use for fewer than ~8 fixed options — use Select or Segment Control",
      "Don't show a single-select's value as a chip under an empty search — users will try to add a second one",
    ],
    props: [
      { name: 'v-model', type: 'String | null (single) · Array (multiple)', default: 'null', description: 'Selected value(s)' },
      { name: 'options', type: 'Array<{ value, label, meta? }>', default: '—', description: 'Filtered client-side by label. meta is a muted second line' },
      { name: 'multiple', type: 'Boolean', default: 'false', description: 'Allow several values, shown as chips' },
      { name: 'min-chars', type: 'Number', default: '0', description: 'Characters before results show (companies use 3)' },
      { name: 'tone', type: "'brand' | 'purple' | 'amber' | 'neutral'", default: "'neutral'", description: 'Chip colour' },
      { name: 'error', type: 'Boolean', default: 'false', description: 'Danger border' },
      { name: 'input-id', type: 'String', default: 'auto', description: 'Pass the same id to Form Field for the label' },
    ],
    stories: [
      {
        name: 'Single vs multiple',
        description: 'Reseller accepts one, Vendors accepts many — the difference is visible before anyone tries.',
        snippet: `<AppCombobox v-model="reseller" :options="resellers" tone="brand" placeholder="Search resellers…" />
<AppCombobox v-model="vendors" :options="vendors" multiple tone="purple" placeholder="Search vendors…" />`,
        demo: defineComponent({ setup() {
          const opts = (list) => list.map((label) => ({ value: label, label }))
          const resellers = opts(['Brightwave plc', 'Kessler IT Ltd', 'Compunet', 'Kilobyte Software Services'])
          const vendors = opts(['Sentrix', 'Inboxa AI', 'Mailguard', 'IdentiQ', 'Skyedge'])
          return () => h('div', { class: 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl' }, [
            h(AppFormField, { label: 'Reseller', inputId: 'ds-cb-1', helper: 'Single select' }, { default: () => h(AppCombobox, { inputId: 'ds-cb-1', options: resellers, tone: 'brand', placeholder: 'Search resellers…', modelValue: demoComboSingle.value, 'onUpdate:modelValue': (v) => { demoComboSingle.value = v } }) }),
            h(AppFormField, { label: 'Vendors', inputId: 'ds-cb-2', helper: 'Multiple' }, { default: () => h(AppCombobox, { inputId: 'ds-cb-2', options: vendors, multiple: true, tone: 'purple', placeholder: 'Search vendors…', modelValue: demoComboMulti.value, 'onUpdate:modelValue': (v) => { demoComboMulti.value = v } }) }),
          ])
        } }),
      },
    ],
  },

  // ── Modal ────────────────────────────────────────────────────────────────
  modal: {
    title: 'Modal',
    description: 'Centered dialog for focused tasks (Log activity). Moves focus in on open and back to the trigger on close, closes on Esc and backdrop. Header, body and footer are separate so long forms scroll while actions stay visible.',
    whenToUse: ['A task the user must finish or cancel before continuing — creating an activity'],
    whenNotTo: [
      "Don't use for reading details — use Drawer so the list stays in context",
      "Don't stack modals — open a Drawer from a modal for secondary forms (New reseller)",
    ],
    props: [
      { name: 'v-model', type: 'Boolean', default: 'false', description: 'Open state' },
      { name: 'title', type: 'String', default: "''", description: 'Header title (or use #header)' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Max width 448 / 576 / 768 / 1024px' },
      { name: 'close-on-backdrop', type: 'Boolean', default: 'true', description: 'Turn off while the form is dirty' },
      { name: '#header / #default / #footer', type: 'Slots', default: '—', description: 'Footer stays pinned while the body scrolls' },
    ],
    stories: [
      {
        name: 'Basic',
        description: 'Title, body and footer actions.',
        snippet: `<AppModal v-model="open" title="Discard changes?" size="sm">
  Your activity hasn't been saved.
  <template #footer>
    <AppButton variant="ghost" @click="open = false">Keep editing</AppButton>
    <AppButton variant="danger" @click="discard">Discard</AppButton>
  </template>
</AppModal>`,
        demo: defineComponent({ setup() { return () => h('div', [
          h(AppButton, { variant: 'secondary', onClick: () => { demoModal.value = true } }, () => 'Open modal'),
          h(AppModal, { modelValue: demoModal.value, 'onUpdate:modelValue': (v) => { demoModal.value = v }, title: 'Discard changes?', size: 'sm' }, {
            default: () => h('p', { class: 'text-[15px] text-fg-2' }, "Your activity hasn't been saved."),
            footer: () => [
              h(AppButton, { variant: 'ghost', onClick: () => { demoModal.value = false } }, () => 'Keep editing'),
              h(AppButton, { variant: 'danger', onClick: () => { demoModal.value = false } }, () => 'Discard'),
            ],
          }),
        ]) } }),
      },
    ],
  },

  // ── Drawer ───────────────────────────────────────────────────────────────
  // ── Confirm Dialog ───────────────────────────────────────────────────────
  'confirm-dialog': {
    title: 'Confirm Dialog',
    description: "Asks before anything that can't be taken back — delete, remove, discard, disconnect. The title is the question, the body says what will happen (and what won't), the confirm button repeats the verb. Focus starts on Cancel, so Enter or a double click never destroys by accident.",
    whenToUse: ['Deleting or removing something for good — a role, a person, a document, an integration', 'Losing work — discarding a draft, restoring over one', 'Cutting something off — disconnecting a sync, replacing a secret (tone="default")'],
    whenNotTo: ["Don't ask for things that are easy to undo — do it and offer Undo in a toast", "Don't ask when the action can't happen anyway (a role people are still on) — say why instead", "Never label the buttons OK / Yes — name the action"],
    props: [
      { name: 'v-model', type: 'Boolean', default: 'false', description: 'Open or closed' },
      { name: 'title', type: 'String', default: '—', description: 'The question: "Delete this role?" (required)' },
      { name: 'confirm-label', type: 'String', default: '—', description: 'The verb again: "Delete role" (required)' },
      { name: 'cancel-label', type: 'String', default: "'Cancel'", description: 'Change it when the confirm button also says cancel: "Keep invite"' },
      { name: 'tone', type: "'danger' | 'default'", default: "'danger'", description: 'danger = gone for good; default = disruptive but reversible' },
      { name: '@confirm · @cancel', type: 'Event', default: '—', description: 'Confirm leaves closing to you; Cancel, Esc, × and the backdrop close it' },
      { name: 'default slot', type: 'Slot', default: '—', description: 'What happens — name the thing in bold, end with "This can\'t be undone." when it can\'t' },
    ],
    stories: [
      {
        name: 'Delete',
        description: 'Settings → Team → Roles → Delete role.',
        snippet: `<AppButton variant="ghost" @click="open = true">Delete role</AppButton>
<AppConfirmDialog v-model="open" title="Delete this role?" confirm-label="Delete role" @confirm="remove">
  <p><span class="font-semibold text-fg">Sales</span> and its permissions will be gone. This can't be undone.</p>
</AppConfirmDialog>`,
        demo: defineComponent({ setup() {
          const open = ref(false)
          const tone = ref('danger')
          const show = (t) => { tone.value = t; open.value = true }
          return () => h('div', { class: 'flex flex-wrap gap-3' }, [
            h(AppButton, { variant: 'secondary', onClick: () => show('danger') }, () => 'Delete role'),
            h(AppButton, { variant: 'secondary', onClick: () => show('default') }, () => 'Replace secret'),
            h(AppConfirmDialog, {
              modelValue: open.value,
              'onUpdate:modelValue': (v) => { open.value = v },
              title: tone.value === 'danger' ? 'Delete this role?' : 'Replace the secret?',
              confirmLabel: tone.value === 'danger' ? 'Delete role' : 'Replace secret',
              tone: tone.value,
              onConfirm: () => { open.value = false; toast(tone.value === 'danger' ? 'Role deleted' : 'Secret replaced') },
            }, () => h('p', {}, tone.value === 'danger'
              ? [h('span', { class: 'font-semibold text-fg' }, 'Sales'), " and its permissions will be gone. Nobody is on it, so no one loses access. This can't be undone."]
              : ['The current secret stops working straight away. ', h('span', { class: 'font-semibold text-fg' }, 'ConnectWise PSA'), " is refused until it's updated with the new one."])),
          ])
        } }),
      },
    ],
  },

  drawer: {
    title: 'Drawer',
    description: 'Side panel that slides in from the right. Used for activity details (keeps the list visible behind) and secondary forms opened from a modal (New reseller / end user). Same focus and Esc behaviour as Modal.',
    whenToUse: ['Reading a record without leaving the list', 'A small form needed in the middle of another form'],
    whenNotTo: ["Don't put a multi-step flow in a drawer — use Modal or a page"],
    props: [
      { name: 'v-model', type: 'Boolean', default: 'false', description: 'Open state' },
      { name: 'title / subtitle', type: 'String', default: "''", description: 'Header text (or use #header)' },
      { name: 'width', type: "'md' | 'lg'", default: "'md'", description: '480px or 640px' },
      { name: '#header / #default / #footer', type: 'Slots', default: '—', description: 'Footer pinned to the bottom' },
    ],
    stories: [
      {
        name: 'Secondary form',
        description: 'The New reseller panel pattern.',
        snippet: `<AppDrawer v-model="open" title="New reseller" subtitle="Create a reseller and add it to your activity">
  …form fields…
  <template #footer>
    <AppButton variant="ghost" @click="open = false">Cancel</AppButton>
    <AppButton class="ml-auto" type="submit" form="reseller-form">Save reseller</AppButton>
  </template>
</AppDrawer>`,
        demo: defineComponent({ setup() { return () => h('div', [
          h(AppButton, { variant: 'secondary', onClick: () => { demoDrawer.value = true } }, () => 'Open drawer'),
          h(AppDrawer, { modelValue: demoDrawer.value, 'onUpdate:modelValue': (v) => { demoDrawer.value = v }, title: 'New reseller', subtitle: 'Create a reseller and add it to your activity' }, {
            default: () => h(AppFormField, { label: 'Company name', inputId: 'ds-dr-name', required: true }, { default: () => h(AppInput, { id: 'ds-dr-name', placeholder: 'e.g. Acme Corporation' }) }),
            footer: () => [
              h(AppButton, { variant: 'ghost', onClick: () => { demoDrawer.value = false } }, () => 'Cancel'),
              h(AppButton, { class: 'ml-auto', onClick: () => { demoDrawer.value = false } }, () => 'Save reseller'),
            ],
          }),
        ]) } }),
      },
    ],
  },

  // ── Popover ──────────────────────────────────────────────────────────────
  popover: {
    title: 'Popover',
    description: 'Click-to-open panel anchored to a trigger (Filters). Closes on outside click and Esc (inside a modal, Esc closes the popover first). The trigger slot gets toggle() and open; the content slot gets close(). The panel is teleported to <body> with fixed positioning (useFloating), so modals and scrolling cards can\'t clip it, and it flips above the trigger when there is no room below.',
    whenToUse: ['A handful of controls that shouldn\'t take permanent space — filters, quick settings'],
    whenNotTo: ["Don't use for hover-only information — use Tooltip", "Don't put long forms in it — use Drawer"],
    props: [
      { name: 'label', type: 'String', default: 'null', description: 'Accessible name of the panel' },
      { name: 'align', type: "'start' | 'end'", default: "'start'", description: 'Edge of the trigger it lines up with' },
      { name: 'width-class', type: 'String', default: "'w-80'", description: 'Width utility for the panel' },
      { name: '#trigger="{ toggle, open }" · #default="{ close }"', type: 'Slots', default: '—', description: 'Bind :aria-expanded="open" on the trigger' },
    ],
    stories: [
      {
        name: 'Filters',
        description: 'The Activity page filter panel.',
        snippet: `<AppPopover label="Filters">
  <template #trigger="{ toggle, open }">
    <AppButton variant="secondary" :aria-expanded="open" @click="toggle">Filters</AppButton>
  </template>
  <template #default="{ close }">
    …fields…
    <AppButton size="sm" @click="close">Done</AppButton>
  </template>
</AppPopover>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'min-h-[220px]' },
          h(AppPopover, { label: 'Filters' }, {
            trigger: ({ toggle, open }) => h(AppButton, { variant: 'secondary', 'aria-expanded': open, onClick: toggle }, () => 'Filters'),
            default: ({ close }) => h('div', { class: 'space-y-4' }, [
              h(AppFormField, { label: 'Record type', inputId: 'ds-pop-rt' }, { default: () => h(AppSelect, { id: 'ds-pop-rt', modelValue: '', options: [{ value: '', label: 'All types' }, 'Sales', 'Pre-Sales', 'Marketing'] }) }),
              h('div', { class: 'flex justify-end' }, h(AppButton, { size: 'sm', onClick: close }, () => 'Done')),
            ]),
          })
        ) } }),
      },
    ],
  },

  // ── Toast ────────────────────────────────────────────────────────────────
  toast: {
    title: 'Toast',
    description: 'Short confirmation in the bottom-right corner, gone after 4 seconds and announced to screen readers. AppToaster is mounted once in AppLayout — call ui.toast() from anywhere.',
    whenToUse: ['Confirming something that happened off-screen or after a modal closed (Activity logged · +50 pts)'],
    whenNotTo: ["Don't use for errors the user must fix — show them next to the field", "Don't use for anything that needs an action"],
    props: [
      { name: "toast(message, tone)", type: "(String, 'success' | 'reward' | 'danger')", default: "tone 'success'", description: 'useUiStore().toast — reward = gold, for points' },
    ],
    stories: [
      {
        name: 'Tones',
        description: 'Click to show each tone.',
        snippet: `import { toast, AppToaster } from '@nebojsab/vue-ui-kit'

// once, in App.vue
<AppToaster />

toast('Test Reseller Ltd created and added')
toast('Activity logged · +50 pts', 'reward')
toast('Salesforce sync failed', 'danger')`,
        demo: defineComponent({ setup() { const ui = useUiStore(); return () => h('div', { class: 'flex flex-wrap gap-3' }, [
          h(AppButton, { variant: 'secondary', onClick: () => ui.toast('Test Reseller Ltd created and added') }, () => 'Success'),
          h(AppButton, { variant: 'reward', onClick: () => ui.toast('Activity logged · +50 pts', 'reward') }, () => 'Reward'),
          h(AppButton, { variant: 'secondary', onClick: () => ui.toast('Salesforce sync failed', 'danger') }, () => 'Danger'),
        ]) } }),
      },
    ],
  },

  // ── Date Input ───────────────────────────────────────────────────────────
  'date-input': {
    title: 'Date Input',
    description: 'Native date picker that always reads the same way ("14 Oct 2026"), whatever the browser locale. While focused the native field shows, so typing and the keyboard picker still work. The value is an ISO date string.',
    whenToUse: [
      'Any single date in a form — meeting date, close date, filters',
    ],
    whenNotTo: [
      "Don't use for date ranges or times — pair two fields or use the period controls",
      "Don't parse the value with new Date('YYYY-MM-DD') — it's UTC midnight and can show the day before",
    ],
    props: [
      { name: 'v-model', type: 'String', default: "''", description: 'ISO date, YYYY-MM-DD' },
      { name: 'id', type: 'String', default: '—', description: 'Pass the same id to Form Field input-id for the label' },
      { name: 'min / max', type: 'String', default: '—', description: 'ISO bounds for the native picker' },
      { name: 'error', type: 'Boolean', default: 'false', description: 'Danger border + ring' },
      { name: 'disabled', type: 'Boolean', default: 'false', description: 'Disables the field' },
      { name: 'locale', type: 'String', default: "'en-GB'", description: 'Display locale' },
      { name: 'format', type: 'Object', default: "{ day: 'numeric', month: 'short', year: 'numeric' }", description: 'toLocaleDateString options for the display' },
    ],
    stories: [
      {
        name: 'In a form field',
        description: 'Click or tab into the field to see the native control.',
        snippet: `<AppFormField label="Meeting date" input-id="date" required>
  <AppDateInput id="date" v-model="date" />
</AppFormField>
<AppFormField label="Follow-up" input-id="follow" helper="Today or later">
  <AppDateInput id="follow" v-model="followUp" :min="today" />
</AppFormField>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl' }, [
          h(AppFormField, { label: 'Meeting date', inputId: 'ds-date-1', required: true }, { default: () => h(AppDateInput, { id: 'ds-date-1', modelValue: demoDate.value, 'onUpdate:modelValue': (v) => { demoDate.value = v } }) }),
          h(AppFormField, { label: 'Follow-up', inputId: 'ds-date-2', helper: 'Today or later' }, { default: () => h(AppDateInput, { id: 'ds-date-2', min: '2026-10-14', modelValue: demoDateEmpty.value, 'onUpdate:modelValue': (v) => { demoDateEmpty.value = v } }) }),
        ]) } }),
      },
    ],
  },

  // ── Filter Chip ──────────────────────────────────────────────────────────
  'filter-chip': {
    title: 'Filter Chip',
    description: 'Toggle chip for quick filters. Off it stays neutral and the tone shows on the icon only; on it gets a soft tone fill and a ×. Clicking again clears it — the chip itself is where the filter lives, so there is no separate list of applied filters.',
    whenToUse: [
      'One-tap filters above a list (record type, company kind)',
      'Toggling several independent filters at once',
    ],
    whenNotTo: [
      "Don't use to switch between views — use Segment Control or View Tabs",
      "Don't use for removable tags in an input — use Chip with removable",
    ],
    props: [
      { name: 'label', type: 'String', default: "''", description: 'Text (or use the default slot)' },
      { name: 'active', type: 'Boolean', default: 'false', description: 'On state — soft fill, aria-pressed, × when clearable' },
      { name: 'tone', type: "'brand' | 'blue' | 'purple' | 'pink' | 'amber' | 'neutral'", default: "'brand'", description: 'Colour of the icon and the active fill' },
      { name: 'icon', type: 'Component', default: 'null', description: 'Heroicon before the label' },
      { name: 'clearable', type: 'Boolean', default: 'true', description: 'Show × while active. Off: the chip keeps its width when selected — use for one-of tabs (All · Published · Draft)' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '28px or 36px' },
      { name: '@click', type: 'Event', default: '—', description: 'Native click — toggle your own state' },
    ],
    stories: [
      {
        name: 'Tones',
        description: 'Click to toggle. Each category uses its own accent tone.',
        snippet: `<AppFilterChip
  v-for="f in filters" :key="f.value"
  :label="f.label" :icon="f.icon" :tone="f.tone"
  :active="selected.includes(f.value)"
  @click="toggle(f.value)"
/>`,
        demo: defineComponent({ setup() {
          const chips = [
            { value: 'sales', label: 'Sales', tone: 'blue', icon: ArrowTrendingUpIcon },
            { value: 'presales', label: 'Pre-Sales', tone: 'purple', icon: ViewfinderCircleIcon },
            { value: 'marketing', label: 'Marketing', tone: 'pink', icon: MegaphoneIcon },
            { value: 'enduser', label: 'End user', tone: 'amber', icon: UserGroupIcon },
            { value: 'brand', label: 'Mine', tone: 'brand', icon: BoltIcon },
            { value: 'neutral', label: 'Upcoming', tone: 'neutral', icon: CalendarDaysIcon },
          ]
          const toggle = (v) => {
            const list = demoFilterChips.value
            demoFilterChips.value = list.includes(v) ? list.filter((x) => x !== v) : [...list, v]
          }
          return () => h('div', { class: 'flex flex-wrap gap-2' }, chips.map((c) =>
            h(AppFilterChip, { label: c.label, icon: c.icon, tone: c.tone, active: demoFilterChips.value.includes(c.value), onClick: () => toggle(c.value) })
          ))
        } }),
      },
      {
        name: 'Small, not clearable',
        snippet: `<AppFilterChip label="This week" size="sm" tone="neutral" :clearable="false" :active="period === 'week'" />`,
        demo: defineComponent({ setup() {
          const period = ref('week')
          return () => h('div', { class: 'flex flex-wrap gap-2' }, ['week', 'month', 'quarter'].map((p) =>
            h(AppFilterChip, { label: 'This ' + p, size: 'sm', tone: 'neutral', clearable: false, active: period.value === p, onClick: () => { period.value = p } })
          ))
        } }),
      },
    ],
  },

  // ── Filter Tile ──────────────────────────────────────────────────────────
  'filter-tile': {
    title: 'Filter Tile',
    description: 'A count that filters: click to show only those records, click again (×) to clear. Zero is muted, dashed and not clickable — it would only lead to an empty list. Fills its grid cell.',
    whenToUse: [
      'A row of counts above a list that double as filters (record types, statuses)',
    ],
    whenNotTo: [
      "Don't use for KPIs that don't filter anything — use Stat Card",
      "Don't put more than one number in a tile",
    ],
    props: [
      { name: 'label', type: 'String', default: '—', description: 'Overline label (required)' },
      { name: 'value', type: 'Number | String', default: '0', description: 'The count' },
      { name: 'sublabel', type: 'String', default: 'null', description: 'Muted line under the value' },
      { name: 'active', type: 'Boolean', default: 'false', description: 'Selected — brand fill, ×, aria-pressed' },
      { name: 'muteZero', type: 'Boolean', default: 'true', description: 'Mute and disable a zero (unless it is the active one)' },
      { name: '@click', type: 'Event', default: '—', description: 'Native click — toggle your own state' },
    ],
    stories: [
      {
        name: 'Row of tiles',
        description: 'Click a tile to filter, click again to clear. Marketing is zero, so it is muted.',
        snippet: `<div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
  <AppFilterTile
    v-for="t in tiles" :key="t.key"
    :label="t.label" :value="t.count" :sublabel="t.sub"
    :active="filter === t.key"
    @click="filter = filter === t.key ? null : t.key"
  />
</div>`,
        demo: defineComponent({ setup() {
          const tiles = [
            { key: 'sales', label: 'Sales', value: 12, sublabel: 'This month' },
            { key: 'presales', label: 'Pre-Sales', value: 7, sublabel: 'This month' },
            { key: 'marketing', label: 'Marketing', value: 0, sublabel: 'This month' },
            { key: 'upcoming', label: 'Upcoming', value: 3, sublabel: 'Next 7 days' },
          ]
          return () => h('div', { class: 'grid grid-cols-2 lg:grid-cols-4 gap-3' }, tiles.map((t) =>
            h(AppFilterTile, { label: t.label, value: t.value, sublabel: t.sublabel, active: demoFilterTile.value === t.key, onClick: () => { demoFilterTile.value = demoFilterTile.value === t.key ? null : t.key } })
          ))
        } }),
      },
    ],
  },


  // ── Sidebar ──────────────────────────────────────────────────────────────
  sidebar: {
    title: 'Sidebar',
    description: 'Floating app sidebar for md and up. On md it is a 64px icon rail; on lg the full 256px panel, which collapses to the rail (v-model:collapsed). Labels animate width and opacity so collapsing feels fluid. Links are RouterLinks when the app has vue-router, plain <a> otherwise. Phones use Bottom Nav instead.',
    whenToUse: [
      'The main navigation of an app shell',
      'footerItems for tools that sit apart from the main nav (Design System, Guide)',
    ],
    whenNotTo: [
      "Don't use on phones — it is hidden below md; pair it with Bottom Nav",
      'Don\'t forget the content offset: md:ml-[88px] and, when expanded, lg:ml-[280px]',
    ],
    props: [
      { name: 'groups', type: 'Array<{ title, items: [{ to, label, icon, tag? }] }>', default: '—', description: 'Nav groups (required). tag = short mono label on the right (e.g. NEW)' },
      { name: 'footerItems', type: 'Array<{ to, label, icon }>', default: '[]', description: 'Pinned to the bottom of the panel' },
      { name: 'v-model:collapsed', type: 'Boolean', default: 'false', description: 'lg+ only. Persist it in the app (e.g. localStorage)' },
      { name: 'isActive', type: '(item) => Boolean', default: 'null', description: "Custom active check. Default: path prefix match, '/' exact" },
      { name: 'homeTo / homeLabel', type: 'String', default: "'/' · 'Home'", description: 'Logo link and its accessible name' },
      { name: 'navLabel / toolsLabel', type: 'String', default: "'Main' · 'Tools'", description: 'aria-label of the two <nav>s' },
      { name: 'brand', type: 'Boolean', default: 'false', description: 'Brand gradient when open; on the compact rail (and always below lg) a solid fill instead — indigo-100 in light, deep indigo #1E1B4B in dark' },
      { name: '#logo="{ collapsed }"', type: 'Slot', default: '—', description: 'Rendered twice: full logo (collapsed false) and the rail mark (collapsed true)' },
      { name: '#bottom="{ collapsed }"', type: 'Slot', default: '—', description: 'Extra content at the bottom of the panel (e.g. support, a user menu)' },
    ],
    stories: [
      {
        name: 'App shell',
        description: 'Shown in a frame here — in an app it is fixed to the viewport. Resize the window: rail on md, full panel on lg. Clicking the links only changes the active item in this demo.',
        snippet: `<AppSidebar
  v-model:collapsed="collapsed"
  :groups="[
    { title: 'Workspace', items: [
      { to: '/', label: 'Home', icon: HomeIcon },
      { to: '/activity', label: 'Activity', icon: ListBulletIcon, tag: 'NEW' },
      { to: '/companies', label: 'Companies', icon: BuildingOffice2Icon },
    ] },
    { title: 'Team', items: [{ to: '/directory', label: 'Directory', icon: UsersIcon }] },
  ]"
  :footer-items="[{ to: '/guide', label: 'Guide', icon: BookOpenIcon }]"
>
  <template #logo="{ collapsed }">
    <!-- The mark on the rail, the full logo open -->
    <KitLogo v-if="collapsed" variant="mark" class="h-8" />
    <KitLogo v-else class="h-8 text-fg" />
  </template>
</AppSidebar>
<main :class="['md:ml-[88px]', !collapsed && 'lg:ml-[280px]']">…</main>`,
        demo: defineComponent({ setup() {
          const active = ref('activity')
          const item = (key, label, icon, extra = {}) => ({ to: '/sidebar?nav=' + key, label, icon, ...extra })
          const groups = [
            { title: 'Workspace', items: [item('home', 'Home', HomeIcon), item('activity', 'Activity', ListBulletIcon, { tag: 'NEW' }), item('companies', 'Companies', BuildingOffice2Icon)] },
            { title: 'Team', items: [item('directory', 'Directory', UsersIcon)] },
          ]
          const footerItems = [item('guide', 'Guide', BookOpenIcon), item('settings', 'Settings', Cog6ToothIcon)]
          // Keep the demo on this page: stop the RouterLinks, just move the active item
          const onClickCapture = (e) => {
            const a = e.target.closest('a')
            if (!a) return
            e.preventDefault()
            const nav = new URL(a.href).searchParams.get('nav')
            if (nav) active.value = nav
          }
          return () => h('div', { class: 'space-y-3' }, [
            h('p', { class: 'text-xs text-subtle md:hidden' }, 'The sidebar shows from md (768px) up — widen the window to see it.'),
            h('div', {
              class: 'relative h-[520px] rounded-xl border border-line bg-page overflow-hidden',
              style: { transform: 'translateZ(0)' },
              onClickCapture,
            }, [
              h(AppSidebar, {
                groups, footerItems,
                isActive: (it) => it.to.endsWith('=' + active.value),
                collapsed: demoCollapsed.value,
                'onUpdate:collapsed': (v) => { demoCollapsed.value = v },
              }, {
                logo: ({ collapsed }) => h(KitLogo, { variant: collapsed ? 'mark' : 'full', class: collapsed ? 'h-8' : 'h-8 text-fg' }),
              }),
              h('div', { class: ['h-full p-6 md:ml-[88px] transition-all duration-200', !demoCollapsed.value && 'lg:ml-[280px]'] }, [
                h('p', { class: 'text-overline text-fg-muted mb-3' }, 'Content'),
                h(AppSkeleton, { variant: 'card' }),
              ]),
            ]),
          ])
        } }),
      },
    ],
  },

  // ── Bottom Nav ───────────────────────────────────────────────────────────
  'bottom-nav': {
    title: 'Bottom Nav',
    description: 'Phone tab bar (below md only): two tabs, a raised main action, one more tab and More. More opens a bottom sheet with the rest of the nav. From md up the Sidebar takes over. In apps it is md:hidden and fixed to the viewport; the preview prop renders it inside a box instead, as in the phone frame below.',
    whenToUse: [
      'The phone navigation of an app shell, next to Sidebar',
      'One main action per app in the centre (Log activity)',
    ],
    whenNotTo: [
      "Don't put more than three tabs in tabs — the rest go in more",
      "Don't use on tablet or desktop — it hides itself from md up",
      'Leave room for it: pad the page bottom (about 6rem + safe area) on phones',
    ],
    props: [
      { name: 'tabs', type: 'Array<{ label, icon, to? | onClick?, active? }>', default: '—', description: 'Up to 3 (required): two left of the action, one right. Without more, a 4th fills the last slot' },
      { name: 'more', type: 'Array<{ label, icon, to? | onClick?, active? }>', default: '[]', description: 'Everything else, in the More bottom sheet' },
      { name: 'action', type: '{ label, icon? }', default: "{ label: 'Add' }", description: 'Raised centre button. icon defaults to PlusIcon' },
      { name: 'isActive', type: '(item) => Boolean', default: 'null', description: "Custom active check. item.active wins; default is path prefix match, '/' exact" },
      { name: 'navLabel', type: 'String', default: "'Main'", description: 'aria-label of the <nav>' },
      { name: 'preview', type: 'Boolean', default: 'false', description: 'Docs / previews only: render inside the nearest positioned box at any width, More sheet included' },
      { name: '@action', type: 'Event', default: '—', description: 'Centre button clicked' },
      { name: '#more="{ close }"', type: 'Slot', default: '—', description: 'Extra content at the bottom of the More sheet (e.g. sign out)' },
    ],
    stories: [
      {
        name: 'Phone preview',
        description: 'Live, in a phone-sized frame: tap the tabs, the centre action and More (the sheet opens inside the frame).',
        snippet: `<div class="relative h-[560px] overflow-hidden">
  <AppBottomNav preview :tabs="tabs" :more="more" :action="{ label: 'Log activity' }" @action="log" />
</div>`,
        demo: defineComponent({ setup() {
          const current = ref('Activity')
          const pick = (label) => () => { current.value = label }
          const item = (label, icon) => ({ label, icon, onClick: pick(label), get active() { return current.value === label } })
          const tabs = [item('Activity', BoltIcon), item('Directory', BuildingOffice2Icon), item('Search', MagnifyingGlassIcon)]
          const more = [item('Guide', BookOpenIcon), item('Admin', UsersIcon), item('Settings', Cog6ToothIcon)]
          const logged = ref(0)
          return () => h('div', { class: 'flex justify-center' }, [
            h('div', { class: 'relative w-[375px] max-w-full h-[560px] overflow-hidden rounded-[32px] border border-line bg-page shadow-xl' }, [
              h('div', { class: 'p-5 space-y-3' }, [
                h('p', { class: 'text-overline text-fg-muted' }, 'Phone · 375px'),
                h('p', { class: 'font-display font-semibold text-2xl' }, current.value),
                h('p', { class: 'text-sm text-fg-2' }, logged.value
                  ? `Centre action pressed ${logged.value}×`
                  : 'Tap a tab, the raised + or More.'),
                ...[1, 2, 3].map((i) => h('div', { key: i, class: 'h-16 rounded-2xl bg-surface-1 border border-line' })),
              ]),
              h(AppBottomNav, {
                preview: true,
                tabs, more,
                action: { label: 'Log activity' },
                onAction: () => { logged.value++ },
              }),
            ]),
          ])
        } }),
      },
      {
        name: 'App shell',
        description: 'Code only — the bar renders below md. Items with to are links; items with onClick are buttons (use active to highlight them).',
        snippet: `<AppBottomNav
  :tabs="[
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/activity', label: 'Activity', icon: ListBulletIcon },
    { to: '/companies', label: 'Companies', icon: BuildingOffice2Icon },
  ]"
  :more="[
    { to: '/directory', label: 'Directory', icon: UsersIcon },
    { to: '/guide', label: 'Guide', icon: BookOpenIcon },
    { label: 'Search', icon: MagnifyingGlassIcon, onClick: openSearch },
  ]"
  :action="{ label: 'Log activity' }"
  @action="logOpen = true"
/>`,
      },
    ],
  },

  // ── Sticky Bar ───────────────────────────────────────────────────────────
  'sticky-bar': {
    title: 'Sticky Bar',
    description: 'Sticks to the top of the scroller. Once stuck it gets a backdrop, border and shadow, and the slot\'s stuck flag turns true — e.g. to show filters set further up the page as chips that follow along. Stuck detection comes from useStuck (see Composables).',
    whenToUse: [
      'Toolbars above long lists (search, filters, view switch)',
      'Repeating context that scrolled out of view while stuck',
    ],
    whenNotTo: [
      "Don't stack several sticky bars — bind v-model:height and stick section headers (or a side column) right under it instead",
    ],
    props: [
      { name: 'top', type: 'Number', default: '0', description: 'Offset from the top of the scroller (px)' },
      { name: 'scroller', type: 'Element | String', default: "'main'", description: "The scrolling element or a selector. Falls back to the window" },
      { name: 'bleedClass', type: 'String', default: "'-mx-4 sm:-mx-8 px-4 sm:px-8 py-3'", description: 'Padding / negative margins so the backdrop spans the page gutter' },
      { name: '#default="{ stuck }"', type: 'Slot', default: '—', description: 'Bar content' },
      { name: 'v-model:height', type: 'Number', default: '0', description: "The bar's current height (px), kept up to date as it wraps — use it as the top offset of headers that stick under it" },
      { name: 'expose: stuck, bar, height', type: 'Ref', default: '—', description: 'Stuck state, the sticky element and its height' },
    ],
    stories: [
      {
        name: 'In a scroller',
        description: 'Scroll the box: the bar picks up its backdrop and shows the stuck-only line.',
        snippet: `<AppStickyBar :top="0" scroller="main">
  <template #default="{ stuck }">
    <div class="flex items-center gap-2">
      <AppInput placeholder="Search activity…" />
      <AppFilterChip v-if="stuck && type" :label="type" tone="purple" active @click="type = null" />
    </div>
  </template>
</AppStickyBar>`,
        demo: defineComponent({ setup() {
          return () => h('div', { id: 'ds-sticky-scroller', class: 'h-72 overflow-y-auto scroll-thin rounded-xl border border-line bg-page' }, [
            h('div', { class: 'p-4 space-y-2' }, [
              h('p', { class: 'text-overline text-fg-muted' }, 'Page header'),
              h('p', { class: 'text-sm text-fg-2' }, 'Scroll down — the bar below sticks to the top of this box.'),
            ]),
            h(AppStickyBar, { scroller: '#ds-sticky-scroller', bleedClass: 'px-4 py-3' }, {
              default: ({ stuck }) => h('div', { class: 'flex items-center gap-2' }, [
                h(AppFilterChip, { label: 'Pre-Sales', tone: 'purple', icon: ViewfinderCircleIcon, active: true, size: 'sm' }),
                h('span', { class: 'text-xs text-fg-muted' }, stuck ? 'stuck = true · backdrop on' : 'stuck = false'),
              ]),
            }),
            h('div', { class: 'p-4 space-y-3' }, Array.from({ length: 10 }, () => h(AppSkeleton, { variant: 'text', lines: 2 }))),
          ])
        } }),
      },
    ],
  },

  // ── Back to Top ──────────────────────────────────────────────────────────
  'back-to-top': {
    title: 'Back to Top',
    description: 'Round button in the bottom-right corner that appears once you have scrolled about a screen down a long page, and scrolls smoothly back up (instantly under prefers-reduced-motion). On phones it sits above the Bottom Nav by default.',
    whenToUse: [
      'Long, infinite-scrolling lists (Activity)',
    ],
    whenNotTo: [
      "Don't use on short pages — it never shows up anyway, just leave it out",
    ],
    props: [
      { name: 'target', type: 'Element | String', default: "'main'", description: "The scrolling element or a selector. Falls back to the window" },
      { name: 'offset', type: 'Number', default: '700', description: 'Show after this many pixels' },
      { name: 'label', type: 'String', default: "'Back to top'", description: 'aria-label and title' },
      { name: 'offsetClass', type: 'String', default: "'bottom-[calc(6rem+env(safe-area-inset-bottom))] md:bottom-8'", description: 'Bottom position — clears the phone bottom bar' },
      { name: 'preview', type: 'Boolean', default: 'false', description: 'Docs / previews only: sit in the bottom-right of the nearest positioned box instead of the viewport' },
      { name: '@update:visible', type: 'Event (Boolean)', default: '—', description: 'Shown / hidden — e.g. lift toasts out of the corner' },
    ],
    stories: [
      {
        name: 'In a scroller',
        description: 'Scroll the box: the button appears after 200px and takes you back up.',
        snippet: `<div class="relative">
  <div id="list" class="h-80 overflow-y-auto">…</div>
  <AppBackToTop preview target="#list" :offset="200" />
</div>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'relative rounded-xl border border-line bg-page overflow-hidden' }, [
            h('div', { id: 'ds-btt-scroller', class: 'h-80 overflow-y-auto scroll-thin p-4 space-y-2' }, [
              h('p', { class: 'text-overline text-fg-muted' }, 'Scroll down ↓'),
              ...Array.from({ length: 24 }, (_, i) => h('div', { key: i, class: 'h-12 rounded-xl bg-surface-1 border border-line px-4 flex items-center text-sm text-fg-2' }, `Activity ${i + 1}`)),
            ]),
            h(AppBackToTop, { preview: true, target: '#ds-btt-scroller', offset: 200 }),
          ])
        } }),
      },
      {
        name: 'Usage',
        description: 'In an app: mount it once in the page or app shell.',
        snippet: `<AppBackToTop target="main" :offset="700" @update:visible="ui.liftToasts = $event" />`,
      },
    ],
  },

  'user-menu': {
    title: 'User Menu',
    description: 'The account menu in the topbar, top right: avatar with name and role (name/role show from lg), opening a menu with who you are, your links and Sign out. The same in every app — the user never lives in the sidebar.',
    whenToUse: [
      'Once per app, at the right end of the topbar',
    ],
    whenNotTo: [
      "Don't put the user (name, email) in the sidebar as well — one place only",
      "Don't use for general menus — use Popover",
    ],
    props: [
      { name: 'name', type: 'String', default: '—', description: 'Full name (required); also feeds the avatar' },
      { name: 'email', type: 'String', default: "''", description: 'Shown under the name inside the menu' },
      { name: 'role', type: 'String', default: "''", description: "Short role under the name in the button, e.g. 'Admin'" },
      { name: 'items', type: 'Array<{ label, icon?, to? | onClick? }>', default: '[]', description: 'Links between the header and Sign out — RouterLinks when the app has vue-router' },
      { name: 'signOutLabel', type: 'String', default: "'Sign out'", description: 'Label of the last item' },
      { name: '@sign-out', type: 'Event', default: '—', description: 'Sign out was chosen' },
      { name: '#header', type: 'Slot', default: '—', description: 'Extra lines under name/email (e.g. the organisation)' },
    ],
    stories: [
      {
        name: 'In a topbar',
        description: 'Click the avatar. Closes on outside click, Esc (focus back on the button) and after choosing an item. Name and role show next to the avatar from lg.',
        snippet: `<AppUserMenu name="Luka Petrovic" email="luka.petrovic@example.com" role="Admin" :items="items" @sign-out="signOut" />`,
        demo: defineComponent({ setup() {
          const last = ref('')
          const say = (t) => () => { last.value = t }
          const items = [
            { label: 'My Profile', icon: UsersIcon, onClick: say('My Profile') },
            { label: 'Settings', icon: Cog6ToothIcon, onClick: say('Settings') },
            { label: 'Guide', icon: BookOpenIcon, onClick: say('Guide') },
          ]
          return () => h('div', { class: 'rounded-xl border border-line bg-page h-[360px]' }, [
            h('div', { class: 'h-16 px-4 border-b border-line bg-surface-1/60 rounded-t-xl flex items-center justify-between gap-3' }, [
              h('span', { class: 'text-sm text-fg-muted' }, last.value ? `Chose: ${last.value}` : 'Topbar'),
              h(AppUserMenu, {
                name: 'Luka Petrovic',
                email: 'luka.petrovic@example.com',
                role: 'Admin',
                items,
                onSignOut: say('Sign out'),
              }),
            ]),
          ])
        } }),
      },
      {
        name: 'Usage',
        description: 'Items with to are RouterLinks when the app has vue-router; items with onClick are buttons.',
        snippet: `<AppUserMenu
  :name="user.name"
  :email="user.email"
  role="Admin"
  :items="[
    { label: 'My Profile', icon: UserIcon, to: '/profile' },
    { label: 'Settings', icon: Cog6ToothIcon, to: '/settings' },
  ]"
  @sign-out="signOut"
/>`,
      },
    ],
  },

  // ── Composables ──────────────────────────────────────────────────────────
  composables: {
    title: 'Composables',
    description: 'Logic the components are built on, exported for app code: useInfiniteList for scroll-to-load lists, useStuck for sticky headers, useFloating for panels teleported to <body>.',
    stories: [
      {
        name: 'useInfiniteList',
        description: 'Show a long list in pages that load as you scroll — no Load more button. Put the sentinel after the list. Live demo: 60 items, 10 per page, 400ms fake delay.',
        snippet: `import { useInfiniteList } from '@nebojsab/vue-ui-kit'

const { shown, hasMore, loading, loadingMore, sentinel, reset, loadMore } =
  useInfiniteList(filtered, {
    pageSize: 20,                         // items per page
    resetOn: [() => route.query],         // back to page 1 when these change
    scroller: 'main',                     // element or selector; default the app shell's <main>
    firstDelay: 0, nextDelay: 0,          // fake network in prototypes (ms)
    rootMargin: 400,                      // load this many px before the end
  })

// shown        computed slice to render
// hasMore      more items left
// loading      first page (on mount + each reset) — show skeletons
// loadingMore  next page — show a spinner under the list
// sentinel     ref for <div ref="sentinel" /> after the list
// reset() / loadMore()  manual control

<ActivityRow v-for="a in shown" :key="a.id" :activity="a" />
<div ref="sentinel" />
<AppSpinner v-if="loadingMore" />`,
        demo: defineComponent({ setup() {
          const items = ref(Array.from({ length: 60 }, (_, i) => ({ id: i + 1, label: 'Activity #' + (i + 1) })))
          const { shown, hasMore, loading, loadingMore, sentinel } = useInfiniteList(items, { pageSize: 10, scroller: '#ds-infinite-scroller', firstDelay: 400, nextDelay: 400, rootMargin: 40 })
          return () => h('div', { class: 'space-y-2' }, [
            h('p', { class: 'text-xs text-fg-muted font-mono' }, `shown ${shown.value.length} / ${items.value.length} · hasMore ${hasMore.value}`),
            h('div', { id: 'ds-infinite-scroller', class: 'h-64 overflow-y-auto scroll-thin rounded-xl border border-line bg-page p-2 space-y-1' }, [
              loading.value
                ? h(AppSkeleton, { variant: 'text', lines: 4 })
                : shown.value.map((it) => h('div', { key: it.id, class: 'px-3 py-2 rounded-lg bg-surface-1 text-sm' }, it.label)),
              h('div', { ref: sentinel }),
              loadingMore.value ? h('div', { class: 'flex justify-center py-2' }, h(AppSpinner, { size: 'sm' })) : null,
              !loading.value && !hasMore.value ? h('p', { class: 'text-xs text-fg-muted text-center py-2' }, 'End of list') : null,
            ]),
          ])
        } }),
      },
      {
        name: 'useStuck',
        description: 'Is a sticky element stuck? Put the sentinel on an empty element right before it. Powers Sticky Bar.',
        snippet: `import { useStuck } from '@nebojsab/vue-ui-kit'

const { sentinel, stuck, update } = useStuck({ scroller: 'main' }) // element or selector, falls back to window

<div ref="sentinel" />
<div class="sticky top-0" :class="stuck && 'shadow-lg bg-page/90'">…</div>`,
      },
      {
        name: 'useFloating',
        description: 'Fixed coordinates for a panel teleported to <body>, so a modal\'s scrolling body or a card\'s overflow can\'t clip it. Opens below the anchor, or above when there is clearly more room there, and follows the anchor on scroll and resize. Used by Popover and Combobox.',
        snippet: `import { useFloating } from '@nebojsab/vue-ui-kit'

const anchor = ref(null)
const { style, placement, maxHeight, update, start, stop } = useFloating(anchor, {
  align: 'start',   // 'start' | 'end' | 'stretch' (match the anchor's width)
  gap: 8,           // px between anchor and panel
  width: null,      // px; null = anchor width for 'stretch', else the panel's own
  minBelow: 240,    // flip above when less than this fits below (and above has more)
})
watch(open, (v) => (v ? start() : stop()))

<button ref="anchor" @click="open = !open">…</button>
<Teleport to="body">
  <div v-if="open" class="z-[90]" :style="{ ...style, maxHeight: maxHeight + 'px' }">…</div>
</Teleport>
// placement: 'bottom' | 'top' — e.g. to pick the enter transition`,
      },
    ],
  },

  // ── Data Table ───────────────────────────────────────────────────────────
  'data-table': {
    title: 'Data Table',
    description: 'Simple table with per-cell slots. Columns can hide on small screens through their class, keep a visually hidden header (actions) and the table gets a screen-reader caption.',
    whenToUse: ['Comparing records across the same fields — users, standings'],
    whenNotTo: ["Don't use on phones for rich rows — switch to cards (see Activity table)"],
    props: [
      { name: 'columns', type: 'Array<{ key, label, align?, class?, srOnly? }>', default: '—', description: "class goes on th + td — e.g. 'hidden lg:table-cell'" },
      { name: 'rows', type: 'Array<Object>', default: '[]', description: 'Each row should have an id' },
      { name: 'caption', type: 'String', default: 'null', description: 'Screen-reader caption' },
      { name: 'clickable', type: 'Boolean', default: 'false', description: 'Emits row-click' },
      { name: '#cell-{key}="{ row, value }"', type: 'Slot', default: '—', description: 'Custom cell content' },
    ],
    stories: [
      {
        name: 'With slots and responsive columns',
        description: 'Territory hides below lg.',
        snippet: `<DataTable :columns="[
  { key: 'name', label: 'User' },
  { key: 'territory', label: 'Territory', class: 'hidden lg:table-cell' },
  { key: 'points', label: 'Points', align: 'right' },
]" :rows="users" caption="Users">
  <template #cell-points="{ value }">{{ value.toLocaleString() }}</template>
</DataTable>`,
        demo: defineComponent({ setup() { return () => h(DataTable, {
          caption: 'Users',
          columns: [{ key: 'name', label: 'User' }, { key: 'territory', label: 'Territory', class: 'hidden lg:table-cell' }, { key: 'points', label: 'Points', align: 'right' }],
          rows: [{ id: 1, name: 'Hannah Clarke', territory: territory('UK'), points: 32900 }, { id: 2, name: 'Lukas Brenner', territory: territory('DACH'), points: 1700 }, { id: 3, name: 'Luka Petrovic', territory: territory('UK'), points: 710 }],
        }, { 'cell-points': ({ value }) => h('span', { class: 'font-display font-bold text-reward tabular' }, value.toLocaleString('en-GB')) }) } }),
      },
    ],
  },
  // ── Copy Button ──────────────────────────────────────────────────────────
  'copy-button': {
    title: 'Copy Button',
    description: 'Copies a value to the clipboard. Reads like a text link next to the value; after a click it says "Copied" for two seconds and a toast confirms it. If the browser blocks the clipboard, a toast says to copy by hand.',
    whenToUse: ['IDs and links people paste elsewhere — client IDs, invite links, a secret shown once'],
    whenNotTo: ["Don't offer it for secrets you only show masked — there's nothing to copy; offer Replace", "Don't use for long text people read — let them select it"],
    props: [
      { name: 'text', type: 'String', default: '—', description: 'What goes on the clipboard (required)' },
      { name: 'what', type: 'String', default: "'Text'", description: 'Names it in the toast and aria-label: "Client ID copied"' },
      { name: 'label · copied-label', type: 'String', default: "'Copy' · 'Copied'", description: 'Button text before / after' },
      { name: 'icon-only', type: 'Boolean', default: 'false', description: 'Just the icon, for tight spots' },
      { name: 'notify', type: 'Boolean', default: 'true', description: 'Also show a toast' },
      { name: '@copied', type: 'Event', default: '—', description: 'After a successful copy' },
    ],
    stories: [
      {
        name: 'Next to a value',
        description: 'An integration settings page — same look as the Replace link beside it.',
        snippet: `<div class="rounded-xl bg-surface-2 px-4 py-3 flex items-center gap-2">
  <code class="text-[13px] text-fg truncate">{{ clientId }}</code>
  <AppCopyButton :text="clientId" what="Client ID" class="ml-auto" />
</div>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'max-w-md space-y-3' }, [
          h('div', { class: 'rounded-xl bg-surface-2 px-4 py-3 flex items-center gap-2' }, [
            h('code', { class: 'text-[13px] text-fg truncate' }, 'ign_live_7Kq2mX9pR4tW'),
            h(AppCopyButton, { text: 'ign_live_7Kq2mX9pR4tW', what: 'Client ID', class: 'ml-auto' }),
          ]),
          h('div', { class: 'rounded-xl bg-surface-2 px-4 py-3 flex items-center gap-2' }, [
            h('code', { class: 'text-[13px] text-fg truncate' }, 'https://portal.example/invite/8f2c'),
            h(AppCopyButton, { text: 'https://portal.example/invite/8f2c', what: 'Invite link', iconOnly: true, class: 'ml-auto' }),
          ]),
        ]) } }),
      },
    ],
  },

  // ── Toggle Group ─────────────────────────────────────────────────────────
  'toggle-group': {
    title: 'Toggle Group',
    description: 'Grouped on/off settings, one group under another, each the full width. A group\'s header strip opens and closes it and keeps n/total and — when closed — a one-line summary of what\'s on, so nothing hides behind the fold. Turn all on/off per group; Expand all / Collapse all above. The first group is open by default.',
    whenToUse: ['Long lists of switches in sections — permissions of a role or an API client, notification types'],
    whenNotTo: ["Don't use for a handful of settings — plain rows with AppToggle", "Don't use where changes wait for Save and the list is short — a form with checkboxes reads better"],
    props: [
      { name: 'groups', type: 'Array<{ key, label, items: [{ key, label, hint?, code?, locked? }] }>', default: '—', description: 'locked = always as it is (e.g. sign-in permission)' },
      { name: 'modelValue', type: 'Array<String>', default: '—', description: 'Keys that are on (v-model)' },
      { name: '@toggle', type: '(key, on)', default: '—', description: 'Once per change — save item by item' },
      { name: 'subject', type: 'String', default: "''", description: 'For screen readers: "Sales" → "Sales: Browse vendors"' },
      { name: 'show-codes', type: 'Boolean', default: 'false', description: 'Middle column with each item\'s code (md and up) — turn off in modals' },
      { name: 'open', type: "'first' | 'all' | 'none'", default: "'first'", description: 'Groups open at the start' },
      { name: 'inset', type: 'String', default: "'px-6 sm:px-7'", description: 'Side padding — match the card or modal around it' },
      { name: 'disabled · bulk', type: 'Boolean', default: 'false · true', description: 'Read-only · Turn all on/off' },
      { name: 'variant', type: "'flush' | 'cards'", default: "'flush'", description: 'flush — groups edge to edge; cards — each group its own card with a gap, the name as a title and n/total as a pill.' },
    ],
    stories: [
      {
        name: 'Permissions of a role',
        description: 'Inside a card, edge to edge (card overflow-hidden). Settings → Team → Roles & permissions.',
        snippet: `<section class="card overflow-hidden">
  <div class="p-6 border-b border-line">…role name…</div>
  <AppToggleGroup v-model="perms" :groups="PERMISSION_GROUPS" subject="Sales" show-codes variant="cards"
    @toggle="(key, on) => save(key, on)" />
</section>`,
        demo: defineComponent({ setup() { return () => h('section', { class: 'card overflow-hidden max-w-3xl' }, [
          h('div', { class: 'p-6 border-b border-line' }, [
            h('p', { class: 'text-lg font-semibold' }, 'Sales'),
            h('p', { class: 'text-[13.5px] text-fg-2 mt-1' }, `Can do ${demoPerms.value.length} of 6 things.`),
          ]),
          h(AppToggleGroup, { groups: DEMO_PERM_GROUPS, modelValue: demoPerms.value, 'onUpdate:modelValue': (v) => { demoPerms.value = v }, subject: 'Sales', showCodes: true, inset: 'px-6', variant: 'cards' }),
        ]) } }),
      },
    ],
  },

  // ── Card ─────────────────────────────────────────────────────────────────
  card: {
    title: 'Card',
    description: '.card is the surface for grouped content: surface-1, a line border, the card radius. Add .card-interactive when the whole card is a link or button — it lifts on hover and gets a brand ring on keyboard focus.',
    whenToUse: ['.card — sections of a page, panels, list containers', '.card-interactive — grids where each card opens something (documents, vendors)'],
    whenNotTo: ["Don't make a card interactive and also put buttons inside it — pick one", "Don't nest cards"],
    props: [
      { name: '.card', type: 'Class', default: '—', description: 'bg-surface-1 · border-line · rounded-card' },
      { name: '.card-interactive', type: 'Class', default: '—', description: 'Use with .card on an <a> / RouterLink / button' },
    ],
    stories: [
      {
        name: 'Grid of cards that open',
        description: 'Settings → Legal documents.',
        snippet: `<RouterLink :to="\`/documents/\${d.id}\`" class="card card-interactive p-5 flex flex-col">
  <span class="text-overline text-fg-muted">Terms of service</span>
  <span class="font-semibold text-fg">Customer terms of service</span>
  …
</RouterLink>`,
        demo: defineComponent({ setup() { return () => h('div', { class: 'grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl' }, [
          ['Terms of service', 'Customer terms of service', 'v3 · Updated 14 Oct 2026'],
          ['Policy', 'Acceptable use policy', 'Draft · Updated 2 Nov 2026'],
        ].map(([type, title, meta]) => h('a', { href: '#', class: 'card card-interactive p-5 flex flex-col', onClick: (e) => e.preventDefault() }, [
          h('span', { class: 'text-overline text-fg-muted' }, type),
          h('span', { class: 'mt-0.5 font-semibold text-[15px] text-fg' }, title),
          h('span', { class: 'mt-4 pt-3 border-t border-line text-[12px] text-fg-muted' }, meta),
        ]))) } }),
      },
    ],
  },
}

const current = computed(() => componentData[slug.value] ?? null)

// ── Copy ──────────────────────────────────────────────────────────────────
const copiedKey = ref('')
async function copyText(text, key) {
  try {
    await navigator.clipboard.writeText(text)
    copiedKey.value = key
    setTimeout(() => { copiedKey.value = '' }, 2000)
  } catch {}
}
</script>
