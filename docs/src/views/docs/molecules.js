// Docs for the newer molecules — same shape as componentData entries in ComponentView.vue
import { ref, defineComponent, h } from 'vue'
import {
  Squares2X2Icon, ChartBarIcon, Cog6ToothIcon, UserGroupIcon, ShieldCheckIcon, CreditCardIcon,
  PencilSquareIcon, DocumentDuplicateIcon, ArrowDownTrayIcon, TrashIcon, ArchiveBoxIcon, HomeIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/vue/24/outline'
import AppTabs from '@ds/components/AppTabs.vue'
import AppAccordion from '@ds/components/AppAccordion.vue'
import AppAlert from '@ds/components/AppAlert.vue'
import AppDropdownMenu from '@ds/components/AppDropdownMenu.vue'
import AppPagination from '@ds/components/AppPagination.vue'
import AppBreadcrumbs from '@ds/components/AppBreadcrumbs.vue'
import AppButton from '@ds/components/AppButton.vue'
import AppSkeleton from '@ds/components/AppSkeleton.vue'
import { toast } from '@ds/toast.js'

const panel = (text) => h('div', { class: 'rounded-xl border border-dashed border-line p-5 text-sm text-fg-2' }, text)

export const moleculesDocs = {
  // ── Tabs ─────────────────────────────────────────────────────────────────
  tabs: {
    title: 'Tabs',
    description: 'Tabs with their own panels, following the WAI-ARIA tabs pattern. Each panel is a named slot that matches the tab value. Arrow keys, Home and End move between tabs, and disabled tabs are skipped. Two looks: underline for page sections, pills for compact cards.',
    whenToUse: [
      'Splitting one page into sections people switch between — Overview / Members / Settings',
      'Pills inside a card or a panel where an underline would be too heavy',
      'Up to about 6 tabs; labels of one or two words',
    ],
    whenNotTo: [
      "Don't use tabs for steps that must happen in order — use a stepper",
      "Don't use them to switch a list's view (table / calendar) — AppViewTabs or AppSegmentControl fit better",
      "Don't hide something people need to compare side by side behind two tabs",
    ],
    props: [
      { name: 'v-model', type: 'String', default: 'first enabled tab', description: 'Active tab value' },
      { name: 'tabs', type: 'Array<{ value, label, icon?, count?, disabled? }>', default: '—', description: 'Tabs in order' },
      { name: 'variant', type: "'underline' | 'pills'", default: "'underline'", description: 'Look of the tab list' },
      { name: 'ariaLabel', type: 'String', default: 'null', description: 'Name of the tab list for screen readers' },
      { name: 'panelClass', type: 'String', default: "'pt-5'", description: 'Classes on every panel' },
      { name: '#<value>="{ tab }"', type: 'Slot', default: '—', description: 'Panel for the tab with that value' },
    ],
    stories: [
      {
        name: 'Underline',
        description: 'Page sections. Use ← → to move between tabs; "Billing" is disabled.',
        snippet: `<AppTabs v-model="tab" :tabs="[
  { value: 'overview', label: 'Overview', icon: Squares2X2Icon },
  { value: 'members', label: 'Members', icon: UserGroupIcon, count: 12 },
  { value: 'settings', label: 'Settings', icon: Cog6ToothIcon },
  { value: 'billing', label: 'Billing', icon: CreditCardIcon, disabled: true },
]">
  <template #overview>…</template>
  <template #members>…</template>
  <template #settings>…</template>
</AppTabs>`,
        demo: defineComponent({ setup() {
          const tab = ref('overview')
          return () => h(AppTabs, {
            modelValue: tab.value, 'onUpdate:modelValue': (v) => { tab.value = v }, ariaLabel: 'Project',
            tabs: [
              { value: 'overview', label: 'Overview', icon: Squares2X2Icon },
              { value: 'members', label: 'Members', icon: UserGroupIcon, count: 12 },
              { value: 'settings', label: 'Settings', icon: Cog6ToothIcon },
              { value: 'billing', label: 'Billing', icon: CreditCardIcon, disabled: true },
            ],
          }, {
            overview: () => h(AppSkeleton, { variant: 'card' }),
            members: () => panel('12 members — the list goes here.'),
            settings: () => panel('Project settings go here.'),
          })
        } }),
      },
      {
        name: 'Pills',
        description: 'Compact tabs inside a card.',
        snippet: `<AppTabs v-model="range" variant="pills" :tabs="[
  { value: 'usage', label: 'Usage', icon: ChartBarIcon },
  { value: 'security', label: 'Security', icon: ShieldCheckIcon },
]" panel-class="pt-4">…</AppTabs>`,
        demo: defineComponent({ setup() {
          const tab = ref('usage')
          return () => h('div', { class: 'card p-5 max-w-md' }, [
            h(AppTabs, {
              modelValue: tab.value, 'onUpdate:modelValue': (v) => { tab.value = v }, variant: 'pills', panelClass: 'pt-4', ariaLabel: 'Account',
              tabs: [{ value: 'usage', label: 'Usage', icon: ChartBarIcon }, { value: 'security', label: 'Security', icon: ShieldCheckIcon }],
            }, {
              usage: () => panel('1,284 API calls this week.'),
              security: () => panel('Two-factor authentication is on.'),
            }),
          ])
        } }),
      },
    ],
  },

  // ── Accordion ────────────────────────────────────────────────────────────
  accordion: {
    title: 'Accordion',
    description: 'Stacked sections that expand and collapse. Each header is a real button with aria-expanded, and the panel animates to its real height. Content comes from item.content, a named slot, or the default slot. Works with or without v-model.',
    whenToUse: [
      'FAQs and help content people scan for one answer',
      'Long settings pages split into groups, where most people need one group',
      'multiple when people compare sections; single when one at a time keeps focus',
    ],
    whenNotTo: [
      "Don't hide the one thing everyone needs — show it open, or don't collapse it",
      "Don't nest accordions inside accordions",
      "Don't put primary form actions inside a collapsed panel",
    ],
    props: [
      { name: 'items', type: 'Array<{ value, title, subtitle?, content?, icon?, disabled? }>', default: '—', description: 'Sections in order' },
      { name: 'v-model', type: 'String | Array', default: 'all closed', description: 'Open item, or items when multiple' },
      { name: 'multiple', type: 'Boolean', default: 'false', description: 'Allow several open at once' },
      { name: 'variant', type: "'plain' | 'card'", default: "'plain'", description: 'Rules between items, or inside a card' },
      { name: '#<value>="{ item }"', type: 'Slot', default: '—', description: 'Rich content for one item' },
    ],
    stories: [
      {
        name: 'FAQ',
        description: 'Plain variant, one item open at a time.',
        snippet: `<AppAccordion v-model="open" :items="faqs" />
// faqs: [{ value: 'install', title: 'How do I install it?', content: '…' }, …]`,
        demo: defineComponent({ setup() {
          const open = ref('install')
          return () => h('div', { class: 'max-w-2xl' }, h(AppAccordion, {
            modelValue: open.value, 'onUpdate:modelValue': (v) => { open.value = v },
            items: [
              { value: 'install', title: 'How do I install it?', content: 'Install it from GitHub or npm, add the Tailwind preset and import styles.css. The README has the three steps.' },
              { value: 'theme', title: 'Can I change the colours?', content: 'Yes. Every colour is a CSS variable (--ui-brand, --ui-surface-1…). Override them in your own CSS and the whole kit follows.' },
              { value: 'dark', title: 'Does it support dark mode?', content: 'Toggle the dark class on <html>. Every token has a light and a dark value.' },
              { value: 'ts', title: 'Is there TypeScript support?', content: 'The package ships type declarations for every component, so editors autocomplete props.' },
            ],
          }))
        } }),
      },
      {
        name: 'Settings groups',
        description: 'Card variant with icons and subtitles; several open at once.',
        snippet: `<AppAccordion v-model="open" :items="groups" variant="card" multiple>
  <template #profile>…form…</template>
</AppAccordion>`,
        demo: defineComponent({ setup() {
          const open = ref(['profile'])
          return () => h('div', { class: 'max-w-2xl' }, h(AppAccordion, {
            modelValue: open.value, 'onUpdate:modelValue': (v) => { open.value = v }, variant: 'card', multiple: true,
            items: [
              { value: 'profile', title: 'Profile', subtitle: 'Name, photo and contact details', icon: UserGroupIcon },
              { value: 'security', title: 'Security', subtitle: 'Password and two-factor', icon: ShieldCheckIcon },
              { value: 'billing', title: 'Billing', subtitle: 'Plan and invoices', icon: CreditCardIcon, disabled: true },
            ],
          }, {
            profile: () => h(AppSkeleton, { variant: 'text', lines: 3 }),
            security: () => 'Two-factor authentication is on for this account.',
          }))
        } }),
      },
    ],
  },

  // ── Alert ────────────────────────────────────────────────────────────────
  alert: {
    title: 'Alert',
    description: 'An inline message in the page flow. It is not a toast, which disappears after a few seconds, and not a modal, which blocks the page. Danger and warning alerts are announced right away (role="alert"); the others are announced politely (role="status"). Each tone comes with an icon, so the meaning never depends on colour alone.',
    whenToUse: [
      'Something about this page or form people should read before going on',
      'Results that stay on screen — "3 rows could not be imported"',
      'brand for tips and new features, info for neutral notes',
    ],
    whenNotTo: [
      "Don't use it for a short confirmation after an action — that's a toast",
      "Don't stack several alerts — merge them or show the most important one",
      "Don't make every alert dismissible; errors stay until fixed",
    ],
    props: [
      { name: 'tone', type: "'info' | 'success' | 'warning' | 'danger' | 'brand'", default: "'info'", description: 'Colour, icon and how urgently it is announced' },
      { name: 'title', type: 'String', default: 'null', description: 'Bold first line' },
      { name: 'icon', type: 'Component | false', default: 'per tone', description: 'Custom icon, or false for none' },
      { name: 'dismissible', type: 'Boolean', default: 'false', description: 'Show × — emits dismiss and hides itself' },
      { name: '#default / #actions', type: 'Slots', default: '—', description: 'Body text · buttons under it' },
    ],
    stories: [
      {
        name: 'Tones',
        snippet: `<AppAlert tone="info" title="Scheduled maintenance">Sunday 02:00–03:00 UTC.</AppAlert>
<AppAlert tone="success" title="Import finished">312 rows added.</AppAlert>
<AppAlert tone="warning" title="Trial ends in 3 days" dismissible />
<AppAlert tone="danger" title="Payment failed">Update your card to keep access.
  <template #actions><AppButton size="sm">Update card</AppButton></template>
</AppAlert>
<AppAlert tone="brand" title="New: dark mode">Switch it on in Settings.</AppAlert>`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-3 max-w-2xl' }, [
            h(AppAlert, { tone: 'info', title: 'Scheduled maintenance' }, () => 'Sunday 02:00–03:00 UTC. Saving may be slow.'),
            h(AppAlert, { tone: 'success', title: 'Import finished' }, () => '312 rows added, 3 skipped as duplicates.'),
            h(AppAlert, { tone: 'warning', title: 'Trial ends in 3 days', dismissible: true }),
            h(AppAlert, { tone: 'danger', title: 'Payment failed' }, {
              default: () => 'Update your card to keep access to the workspace.',
              actions: () => [h(AppButton, { size: 'sm', onClick: () => toast('Card form would open') }, () => 'Update card'), h(AppButton, { size: 'sm', variant: 'ghost' }, () => 'Contact support')],
            }),
            h(AppAlert, { tone: 'brand', title: 'New: dark mode' }, () => 'Switch it on in Settings → Appearance.'),
          ])
        } }),
      },
    ],
  },

  // ── Dropdown Menu ────────────────────────────────────────────────────────
  'dropdown-menu': {
    title: 'Dropdown Menu',
    description: 'A menu of actions under a button (the WAI-ARIA menu button pattern). It opens with a click, Enter, Space or ↓. Arrow keys, Home and End move through the items, typing a letter jumps to a matching label, and Esc closes the menu and returns focus to the button. It is teleported like Popover, so a card or modal can\'t clip it.',
    whenToUse: [
      'Row actions in tables and cards — Edit, Duplicate, Delete',
      'A "More" button when there are more actions than space',
      'Group with headings and dividers; put destructive actions last, in danger',
    ],
    whenNotTo: [
      "Don't use it to pick a value for a form — that's Select or Combobox",
      "Don't hide the one main action in a menu — make it a button",
      "Don't nest submenus; open a modal or drawer for anything bigger",
    ],
    props: [
      { name: 'items', type: 'Array<{ label, icon?, shortcut?, danger?, disabled?, onClick? } | { divider } | { heading }>', default: '—', description: 'Menu content in order' },
      { name: 'label', type: 'String', default: "'Actions'", description: 'Default trigger text and the menu name' },
      { name: 'align', type: "'start' | 'end'", default: "'start'", description: 'Edge of the trigger the menu lines up with' },
      { name: '@select', type: '(item) => void', default: '—', description: 'Fires with the chosen item' },
      { name: '#trigger="{ toggle, open, attrs }"', type: 'Slot', default: '—', description: 'Custom trigger — v-bind attrs for ARIA and keyboard' },
    ],
    stories: [
      {
        name: 'Row actions',
        description: 'Default trigger, and an icon-only trigger aligned to the end.',
        snippet: `<AppDropdownMenu label="Actions" :items="[
  { heading: 'Document' },
  { label: 'Edit', icon: PencilSquareIcon, shortcut: '⌘E' },
  { label: 'Duplicate', icon: DocumentDuplicateIcon },
  { label: 'Download', icon: ArrowDownTrayIcon },
  { divider: true },
  { label: 'Archive', icon: ArchiveBoxIcon, disabled: true },
  { label: 'Delete', icon: TrashIcon, danger: true },
]" @select="(i) => toast(i.label)" />

<AppDropdownMenu label="More" align="end" :items="items">
  <template #trigger="{ toggle, attrs }">
    <button v-bind="attrs" aria-label="More" @click="toggle"><EllipsisHorizontalIcon /></button>
  </template>
</AppDropdownMenu>`,
        demo: defineComponent({ setup() {
          const items = [
            { heading: 'Document' },
            { label: 'Edit', icon: PencilSquareIcon, shortcut: '⌘E' },
            { label: 'Duplicate', icon: DocumentDuplicateIcon },
            { label: 'Download', icon: ArrowDownTrayIcon },
            { divider: true },
            { label: 'Archive', icon: ArchiveBoxIcon, disabled: true },
            { label: 'Delete', icon: TrashIcon, danger: true },
          ]
          const onSelect = (i) => toast(i.label)
          return () => h('div', { class: 'flex items-center gap-6' }, [
            h(AppDropdownMenu, { label: 'Actions', items, onSelect }),
            h(AppDropdownMenu, { label: 'More', align: 'end', items, onSelect }, {
              trigger: ({ toggle, attrs }) => h('button', {
                ...attrs, type: 'button', 'aria-label': 'More',
                class: 'w-10 h-10 flex items-center justify-center rounded-control border border-line bg-surface-1 text-fg-2 hover:bg-surface-2 hover:text-fg',
                onClick: toggle,
              }, h(EllipsisHorizontalIcon, { class: 'w-5 h-5' })),
            }),
          ])
        } }),
      },
    ],
  },

  // ── Pagination ───────────────────────────────────────────────────────────
  pagination: {
    title: 'Pagination',
    description: 'Page numbers for long lists and tables. It always shows the first page, the last page and the pages around the current one, and replaces gaps with "…". On phones it shrinks to "3 / 12". The summary on the left ("21–40 of 312") updates politely for screen readers.',
    whenToUse: [
      'Tables and lists where people jump to a page or come back to the same spot',
      'Under a DataTable, aligned with its edges',
    ],
    whenNotTo: [
      "Don't paginate feeds people scroll through — use useInfiniteList",
      "Don't show it when everything fits on one page",
    ],
    props: [
      { name: 'v-model', type: 'Number', default: '1', description: 'Current page, 1-based' },
      { name: 'total', type: 'Number', default: '—', description: 'Total number of items' },
      { name: 'pageSize', type: 'Number', default: '20', description: 'Items per page' },
      { name: 'siblings', type: 'Number', default: '1', description: 'Pages shown on each side of the current one' },
      { name: 'showSummary', type: 'Boolean', default: 'true', description: '"21–40 of 312" on the left' },
    ],
    stories: [
      {
        name: 'Under a table',
        snippet: `<AppPagination v-model="page" :total="312" :page-size="20" />`,
        demo: defineComponent({ setup() {
          const page = ref(4)
          return () => h(AppPagination, { modelValue: page.value, 'onUpdate:modelValue': (v) => { page.value = v }, total: 312, pageSize: 20 })
        } }),
      },
      {
        name: 'Few pages, no summary',
        snippet: `<AppPagination v-model="page" :total="48" :page-size="10" :show-summary="false" />`,
        demo: defineComponent({ setup() {
          const page = ref(1)
          return () => h(AppPagination, { modelValue: page.value, 'onUpdate:modelValue': (v) => { page.value = v }, total: 48, pageSize: 10, showSummary: false })
        } }),
      },
    ],
  },

  // ── Breadcrumbs ──────────────────────────────────────────────────────────
  breadcrumbs: {
    title: 'Breadcrumbs',
    description: 'Shows where the current page sits in a hierarchy. The last item is the current page, marked with aria-current="page" and not a link. Long trails collapse the middle into "…", which expands on click. Links use RouterLink when the app has vue-router, and a plain <a> otherwise.',
    whenToUse: [
      'Pages two or more levels deep — Projects › Acme › Settings',
      'Above the page title, small and quiet',
    ],
    whenNotTo: [
      "Don't use them as the main navigation — they complement the sidebar",
      "Don't show them on top-level pages with nothing above",
    ],
    props: [
      { name: 'items', type: 'Array<{ label, to?, href?, icon? }>', default: '—', description: 'From the root to the current page' },
      { name: 'maxItems', type: 'Number', default: '4', description: 'Collapse the middle above this many (0 = never)' },
      { name: 'ariaLabel', type: 'String', default: "'Breadcrumb'", description: 'Name of the nav landmark' },
    ],
    stories: [
      {
        name: 'Short and collapsed',
        description: 'The second trail has six levels; click "…" to expand it.',
        snippet: `<AppBreadcrumbs :items="[
  { label: 'Home', to: '/', icon: HomeIcon },
  { label: 'Projects', to: '/projects' },
  { label: 'Acme website' },
]" />`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'space-y-4' }, [
            h(AppBreadcrumbs, { items: [{ label: 'Home', href: '#', icon: HomeIcon }, { label: 'Projects', href: '#' }, { label: 'Acme website' }] }),
            h(AppBreadcrumbs, { items: [{ label: 'Home', href: '#', icon: HomeIcon }, { label: 'Workspaces', href: '#' }, { label: 'Acme', href: '#' }, { label: 'Projects', href: '#' }, { label: 'Website', href: '#' }, { label: 'Settings' }] }),
          ])
        } }),
      },
    ],
  },
}
