<template>
  <div class="min-h-screen bg-page text-fg">
    <!-- Sidebar (md and up). Links are placeholders: this template keeps navigation local. -->
    <div @click.capture="onNav">
      <AppSidebar v-model:collapsed="collapsed" :groups="groups" :footer-items="footer" :is-active="(i) => i.to === active">
        <template #logo="{ collapsed: rail }">
          <KitLogo :variant="rail ? 'mark' : 'full'" label="Acme" :class="rail ? 'h-8' : 'h-8 text-fg'" />
        </template>
      </AppSidebar>
    </div>

    <div :class="['transition-[margin] duration-200 md:ml-[88px]', !collapsed && 'lg:ml-[280px]']">
      <!-- Topbar -->
      <header class="sticky top-0 z-10 border-b border-line bg-page/85 backdrop-blur-md">
        <div class="h-16 px-4 sm:px-8 flex items-center gap-3">
          <KitLogo variant="mark" class="h-8 md:hidden" />
          <div class="hidden sm:block flex-1 max-w-md">
            <AppInput v-model="query" placeholder="Search projects, people…" aria-label="Search">
              <template #leading><MagnifyingGlassIcon class="w-4 h-4 text-fg-muted" /></template>
            </AppInput>
          </div>
          <div class="flex-1" />
          <button
            type="button"
            class="relative w-10 h-10 flex items-center justify-center rounded-control text-fg-2 hover:bg-surface-2 hover:text-fg"
            aria-label="Notifications, 3 unread"
            @click="toast('3 new notifications')"
          >
            <BellIcon class="w-5 h-5" />
            <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger ring-2 ring-page" />
          </button>
          <AppUserMenu name="Ana Kovač" email="ana@acme.test" role="Admin" :items="userItems" @sign-out="toast('Signed out')" />
        </div>
      </header>

      <main class="px-4 sm:px-8 py-6 pb-32 md:pb-10 space-y-6 max-w-7xl">
        <!-- Title row -->
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 class="font-display font-bold text-2xl sm:text-[28px] tracking-tight">Good morning, Ana</h1>
            <p class="text-sm text-fg-muted mt-1">Here's what's happening across your workspace.</p>
          </div>
          <div class="flex items-center gap-2">
            <AppSegmentControl v-model="range" :options="ranges" size="sm" aria-label="Date range" />
            <AppButton class="hidden sm:inline-flex" size="sm" @click="toast('New project')">
              <PlusIcon class="w-4 h-4" /> New project
            </AppButton>
          </div>
        </div>

        <AppAlert v-if="showTrial" tone="brand" title="Your trial ends in 5 days" dismissible @dismiss="showTrial = false">
          Upgrade to keep unlimited projects and priority support.
          <template #actions><AppButton size="sm" variant="secondary" @click="toast('Plans would open')">See plans</AppButton></template>
        </AppAlert>

        <!-- KPIs -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <StatCard v-for="k in kpis" :key="k.label" v-bind="k" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Revenue chart (plain markup — swap in your chart library) -->
          <section class="card p-5 lg:col-span-2" aria-labelledby="rev-title">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h2 id="rev-title" class="font-semibold">Revenue</h2>
                <p class="text-sm text-fg-muted">€48,250 this year · <span class="text-success font-semibold">+12.4%</span></p>
              </div>
              <AppBadge color="brand">2026</AppBadge>
            </div>
            <div class="mt-6 h-48 flex items-end gap-1.5 sm:gap-3" role="img" aria-label="Monthly revenue, highest in October">
              <div v-for="m in months" :key="m.label" class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  class="w-full rounded-t-md transition-[height] duration-500"
                  :class="m.current ? 'bg-brand' : 'bg-brand/25 hover:bg-brand/40'"
                  :style="{ height: `${m.value}%` }"
                  :title="`${m.label}: ${m.value}k`"
                />
                <span class="text-[11px] text-fg-muted">{{ m.label }}</span>
              </div>
            </div>
          </section>

          <!-- Team capacity -->
          <section class="card p-5" aria-labelledby="team-title">
            <h2 id="team-title" class="font-semibold">Team capacity</h2>
            <p class="text-sm text-fg-muted">This sprint</p>
            <ul class="mt-4 space-y-4">
              <li v-for="p in team" :key="p.name" class="flex items-center gap-3">
                <AppAvatar :name="p.name" size="sm" />
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between text-sm">
                    <span class="font-semibold truncate">{{ p.name }}</span>
                    <span class="tabular text-fg-muted">{{ p.load }}%</span>
                  </div>
                  <AppProgressBar :value="p.load" size="sm" :color="p.load > 90 ? 'warning' : 'brand'" class="mt-1.5" />
                </div>
              </li>
            </ul>
          </section>
        </div>

        <!-- Recent projects -->
        <section aria-labelledby="projects-title" class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 id="projects-title" class="font-semibold">Recent projects</h2>
            <a href="#" class="text-sm font-semibold text-brand hover:underline" @click.prevent="toast('All projects')">View all</a>
          </div>
          <DataTable :columns="columns" :rows="projects" caption="Recent projects">
            <template #cell-name="{ row }">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" :class="row.tint">{{ row.name[0] }}</span>
                <div class="min-w-0">
                  <p class="font-semibold truncate">{{ row.name }}</p>
                  <p class="text-xs text-fg-muted truncate">{{ row.client }}</p>
                </div>
              </div>
            </template>
            <template #cell-status="{ value }">
              <AppBadge :color="STATUS[value]" dot class="whitespace-nowrap">{{ value }}</AppBadge>
            </template>
            <template #cell-progress="{ value }">
              <div class="flex items-center gap-2 min-w-[100px]">
                <AppProgressBar :value="value" size="sm" class="flex-1" />
                <span class="text-xs tabular text-fg-muted w-8 text-right">{{ value }}%</span>
              </div>
            </template>
            <template #cell-actions="{ row }">
              <AppDropdownMenu :label="`Actions for ${row.name}`" align="end" :items="rowActions(row)">
                <template #trigger="{ toggle, attrs }">
                  <button v-bind="attrs" type="button" class="w-8 h-8 flex items-center justify-center rounded-lg text-fg-muted hover:bg-surface-2 hover:text-fg" :aria-label="`Actions for ${row.name}`" @click="toggle">
                    <EllipsisHorizontalIcon class="w-5 h-5" />
                  </button>
                </template>
              </AppDropdownMenu>
            </template>
          </DataTable>
        </section>
      </main>
    </div>

    <!-- Phones: tab bar instead of the sidebar -->
    <AppBottomNav :tabs="tabs" :more="more" :action="{ label: 'New project' }" @action="toast('New project')" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  HomeIcon, FolderIcon, UsersIcon, ChartBarIcon, InboxIcon, Cog6ToothIcon, BookOpenIcon, BellIcon,
  MagnifyingGlassIcon, PlusIcon, EllipsisHorizontalIcon, CurrencyEuroIcon, CheckCircleIcon, ClockIcon,
  UserCircleIcon, PencilSquareIcon, ArchiveBoxIcon, TrashIcon,
} from '@heroicons/vue/24/outline'
import {
  AppSidebar, AppBottomNav, AppUserMenu, AppInput, AppButton, AppBadge, AppAvatar, AppAlert,
  AppSegmentControl, AppProgressBar, AppDropdownMenu, StatCard, DataTable, KitLogo, toast,
} from '@nebojsab/vue-ui-kit'

const collapsed = ref(false)
const active = ref('#home')
const query = ref('')
const range = ref('30d')
const showTrial = ref(true)

const groups = [
  { title: 'Workspace', items: [
    { to: '#home', label: 'Home', icon: HomeIcon },
    { to: '#projects', label: 'Projects', icon: FolderIcon, tag: '12' },
    { to: '#inbox', label: 'Inbox', icon: InboxIcon, alert: true },
    { to: '#reports', label: 'Reports', icon: ChartBarIcon },
  ] },
  { title: 'Team', items: [{ to: '#people', label: 'People', icon: UsersIcon }] },
]
const footer = [
  { to: '#docs', label: 'Docs', icon: BookOpenIcon },
  { to: '#settings', label: 'Settings', icon: Cog6ToothIcon },
]
// Keep the demo on this page: stop the links, just move the active item
function onNav(e) {
  const a = e.target.closest('a[href^="#"]')
  if (!a) return
  e.preventDefault()
  active.value = a.getAttribute('href')
}

const tabs = [
  { label: 'Home', icon: HomeIcon, active: true },
  { label: 'Projects', icon: FolderIcon, onClick: () => toast('Projects') },
  { label: 'Inbox', icon: InboxIcon, onClick: () => toast('Inbox') },
]
const more = [
  { label: 'Reports', icon: ChartBarIcon, onClick: () => toast('Reports') },
  { label: 'People', icon: UsersIcon, onClick: () => toast('People') },
  { label: 'Settings', icon: Cog6ToothIcon, onClick: () => toast('Settings') },
]
const userItems = [
  { label: 'Profile', icon: UserCircleIcon, onClick: () => toast('Profile') },
  { label: 'Settings', icon: Cog6ToothIcon, onClick: () => toast('Settings') },
]

const ranges = [
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '90d', value: '90d' },
]

const kpis = [
  { label: 'Revenue', value: '€12.4k', sublabel: 'vs last 30 days', delta: 8, icon: CurrencyEuroIcon },
  { label: 'Active projects', value: 12, sublabel: '3 due this week', delta: 2, icon: FolderIcon },
  { label: 'Tasks done', value: 148, sublabel: 'vs last 30 days', delta: 15, icon: CheckCircleIcon },
  { label: 'Avg. response', value: '2.4h', sublabel: 'vs last 30 days', delta: -6, icon: ClockIcon },
]

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  .map((label, i) => ({ label, value: [38, 45, 41, 52, 58, 49, 63, 71, 66, 88, 74, 30][i], current: i === 9 }))

const team = [
  { name: 'Ana Kovač', load: 72 },
  { name: 'Marko Ilić', load: 94 },
  { name: 'Sara Novak', load: 58 },
  { name: 'Jonas Berg', load: 81 },
]

const STATUS = { 'On track': 'success', 'At risk': 'warning', Blocked: 'danger', Done: 'neutral' }
const columns = [
  { key: 'name', label: 'Project' },
  { key: 'status', label: 'Status' },
  { key: 'progress', label: 'Progress', class: 'hidden md:table-cell' },
  { key: 'due', label: 'Due', class: 'hidden lg:table-cell' },
  { key: 'actions', label: 'Actions', srOnly: true, align: 'right', class: 'hidden sm:table-cell' }, // phones: "View all" instead
]
const projects = [
  { id: 1, name: 'Website redesign', client: 'Northwind', status: 'On track', progress: 68, due: '12 Dec', tint: 'bg-accent-blue/15 text-accent-blue' },
  { id: 2, name: 'Mobile app v2', client: 'Brightwave', status: 'At risk', progress: 41, due: '20 Dec', tint: 'bg-accent-purple/15 text-accent-purple' },
  { id: 3, name: 'Brand guidelines', client: 'Kessler & Co', status: 'Done', progress: 100, due: '28 Nov', tint: 'bg-accent-pink/15 text-accent-pink' },
  { id: 4, name: 'Data migration', client: 'Acme internal', status: 'Blocked', progress: 23, due: '9 Jan', tint: 'bg-accent-amber/15 text-accent-amber' },
]
const rowActions = (row) => [
  { label: 'Edit', icon: PencilSquareIcon, onClick: () => toast(`Edit ${row.name}`) },
  { label: 'Archive', icon: ArchiveBoxIcon, onClick: () => toast(`${row.name} archived`) },
  { divider: true },
  { label: 'Delete', icon: TrashIcon, danger: true, onClick: () => toast(`${row.name} deleted`, 'danger') },
]
</script>
