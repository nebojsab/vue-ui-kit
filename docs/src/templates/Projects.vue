<template>
  <div class="min-h-screen bg-page text-fg">
    <header class="border-b border-line bg-surface-1">
      <div class="max-w-6xl mx-auto h-16 px-4 sm:px-8 flex items-center gap-4">
        <KitLogo label="Acme" class="h-8 text-fg" />
        <div class="flex-1" />
        <AppUserMenu name="Ana Kovač" email="ana@acme.test" role="Admin" @sign-out="toast('Signed out')" />
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-5">
      <!-- Header -->
      <div>
        <AppBreadcrumbs :items="[{ label: 'Home', href: '#', icon: HomeIcon }, { label: 'Projects' }]" />
        <div class="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 class="font-display font-bold text-2xl sm:text-[28px] tracking-tight">Projects</h1>
            <p class="text-sm text-fg-muted mt-1">{{ all.length }} projects · {{ counts['At risk'] }} at risk</p>
          </div>
          <AppButton @click="openNew"><PlusIcon class="w-4 h-4" /> New project</AppButton>
        </div>
      </div>

      <!-- Toolbar: search + status filters -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-3">
        <div class="sm:w-72">
          <AppInput v-model="query" placeholder="Search projects…" clearable aria-label="Search projects">
            <template #leading><MagnifyingGlassIcon class="w-4 h-4 text-fg-muted" /></template>
          </AppInput>
        </div>
        <div class="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          <AppFilterChip
            v-for="s in STATUSES"
            :key="s.value"
            :label="`${s.value} · ${counts[s.value] ?? 0}`"
            :tone="s.tone"
            :icon="s.icon"
            :active="status === s.value"
            size="sm"
            @click="status = status === s.value ? null : s.value"
          />
        </div>
      </div>

      <!-- Table or empty state -->
      <template v-if="filtered.length">
        <DataTable :columns="columns" :rows="pageRows" clickable caption="Projects" @row-click="edit">
          <template #cell-name="{ row }">
            <div class="flex items-center gap-3 min-w-0">
              <span class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold" :class="TINT[row.category]">{{ row.name[0] }}</span>
              <!-- Narrower on phones so status and actions still fit -->
              <div class="min-w-0 max-w-[8.5rem] sm:max-w-none">
                <p class="font-semibold truncate">{{ row.name }}</p>
                <p class="text-xs text-fg-muted truncate">{{ row.client }} · {{ row.category }}</p>
              </div>
            </div>
          </template>
          <template #cell-status="{ value }">
            <AppBadge :color="STATUS_COLOR[value]" dot class="whitespace-nowrap">{{ value }}</AppBadge>
          </template>
          <template #cell-owner="{ value }">
            <div class="flex items-center gap-2"><AppAvatar :name="value" size="xs" /><span class="truncate">{{ value }}</span></div>
          </template>
          <template #cell-actions="{ row }">
            <!-- .stop: the menu shouldn't also open the row -->
            <div @click.stop>
              <AppDropdownMenu :label="`Actions for ${row.name}`" align="end" :items="rowActions(row)">
                <template #trigger="{ toggle, attrs }">
                  <button v-bind="attrs" type="button" class="w-8 h-8 flex items-center justify-center rounded-lg text-fg-muted hover:bg-surface-3 hover:text-fg" :aria-label="`Actions for ${row.name}`" @click="toggle">
                    <EllipsisHorizontalIcon class="w-5 h-5" />
                  </button>
                </template>
              </AppDropdownMenu>
            </div>
          </template>
        </DataTable>
        <AppPagination v-model="page" :total="filtered.length" :page-size="PAGE_SIZE" />
      </template>

      <div v-else class="card">
        <AppEmptyState title="No projects match" description="Try another search or clear the status filter." :icon="FolderOpenIcon">
          <template #action>
            <AppButton variant="secondary" size="sm" @click="clearFilters">Clear filters</AppButton>
          </template>
        </AppEmptyState>
      </div>
    </main>

    <!-- Create / edit -->
    <AppDrawer v-model="drawer" :title="editing ? 'Edit project' : 'New project'" :subtitle="editing ? editing.name : 'It shows up in the list right away'">
      <form id="project-form" class="space-y-5" novalidate @submit.prevent="saveProject">
        <AppFormField label="Name" input-id="p-name" required :error="formError">
          <AppInput id="p-name" v-model="draft.name" :error="!!formError" placeholder="e.g. Website redesign" />
        </AppFormField>
        <AppFormField label="Client" input-id="p-client">
          <AppInput id="p-client" v-model="draft.client" placeholder="e.g. Northwind" />
        </AppFormField>
        <div class="grid grid-cols-2 gap-4">
          <AppFormField label="Status" input-id="p-status">
            <AppSelect id="p-status" v-model="draft.status" :options="STATUSES.map((s) => s.value)" />
          </AppFormField>
          <AppFormField label="Category" input-id="p-cat">
            <AppSelect id="p-cat" v-model="draft.category" :options="Object.keys(TINT)" />
          </AppFormField>
        </div>
        <AppFormField label="Owner" input-id="p-owner">
          <AppSelect id="p-owner" v-model="draft.owner" :options="OWNERS" />
        </AppFormField>
        <AppFormField label="Notes" input-id="p-notes" hint="Optional">
          <AppTextarea id="p-notes" v-model="draft.notes" :rows="4" />
        </AppFormField>
      </form>
      <template #footer>
        <div class="flex gap-2 w-full">
          <AppButton v-if="editing" variant="ghost" class="text-danger" @click="askDelete(editing)">Delete</AppButton>
          <div class="flex-1" />
          <AppButton variant="secondary" @click="drawer = false">Cancel</AppButton>
          <AppButton type="submit" form="project-form">{{ editing ? 'Save' : 'Create' }}</AppButton>
        </div>
      </template>
    </AppDrawer>

    <AppConfirmDialog v-model="confirmOpen" title="Delete this project?" confirm-label="Delete project" @confirm="remove">
      <p><span class="font-semibold text-fg">{{ toDelete?.name }}</span> and its files will be gone. This can't be undone.</p>
    </AppConfirmDialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import {
  HomeIcon, PlusIcon, MagnifyingGlassIcon, EllipsisHorizontalIcon, FolderOpenIcon, PencilSquareIcon,
  DocumentDuplicateIcon, TrashIcon, CheckCircleIcon, ExclamationTriangleIcon, NoSymbolIcon, ArchiveBoxIcon,
} from '@heroicons/vue/24/outline'
import {
  AppBreadcrumbs, AppButton, AppInput, AppFilterChip, AppBadge, AppAvatar, AppDropdownMenu, AppPagination,
  AppEmptyState, AppDrawer, AppFormField, AppSelect, AppTextarea, AppConfirmDialog, AppUserMenu, DataTable, KitLogo, toast,
} from '@nebojsab/vue-ui-kit'

const STATUSES = [
  { value: 'On track', tone: 'brand', icon: CheckCircleIcon },
  { value: 'At risk', tone: 'amber', icon: ExclamationTriangleIcon },
  { value: 'Blocked', tone: 'pink', icon: NoSymbolIcon },
  { value: 'Done', tone: 'neutral', icon: ArchiveBoxIcon },
]
const STATUS_COLOR = { 'On track': 'success', 'At risk': 'warning', Blocked: 'danger', Done: 'neutral' }
const TINT = {
  Design: 'bg-accent-pink/15 text-accent-pink',
  Engineering: 'bg-accent-blue/15 text-accent-blue',
  Research: 'bg-accent-purple/15 text-accent-purple',
  Operations: 'bg-accent-amber/15 text-accent-amber',
}
const OWNERS = ['Ana Kovač', 'Marko Ilić', 'Sara Novak', 'Jonas Berg']
const PAGE_SIZE = 6

let nextId = 100
const seed = [
  ['Website redesign', 'Northwind', 'Design', 'On track', 'Ana Kovač', '12 Dec'],
  ['Mobile app v2', 'Brightwave', 'Engineering', 'At risk', 'Marko Ilić', '20 Dec'],
  ['Brand guidelines', 'Kessler & Co', 'Design', 'Done', 'Sara Novak', '28 Nov'],
  ['Data migration', 'Acme internal', 'Operations', 'Blocked', 'Jonas Berg', '9 Jan'],
  ['Customer interviews', 'Northwind', 'Research', 'On track', 'Sara Novak', '15 Dec'],
  ['Billing service', 'Acme internal', 'Engineering', 'On track', 'Marko Ilić', '3 Feb'],
  ['Onboarding flow', 'Brightwave', 'Design', 'At risk', 'Ana Kovač', '18 Dec'],
  ['Usability study', 'Compunet', 'Research', 'Done', 'Sara Novak', '21 Nov'],
  ['Office move', 'Acme internal', 'Operations', 'On track', 'Jonas Berg', '30 Jan'],
  ['API v3', 'Compunet', 'Engineering', 'On track', 'Marko Ilić', '14 Feb'],
]
const all = ref(seed.map(([name, client, category, status, owner, due], i) => ({ id: i + 1, name, client, category, status, owner, due, notes: '' })))

// ── Filtering + paging (in memory; move to the server for big lists) ─────────
const query = ref('')
const status = ref(null)
const page = ref(1)
const counts = computed(() => all.value.reduce((c, p) => ({ ...c, [p.status]: (c[p.status] ?? 0) + 1 }), {}))
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return all.value.filter((p) =>
    (!status.value || p.status === status.value) &&
    (!q || `${p.name} ${p.client} ${p.owner}`.toLowerCase().includes(q)))
})
const pageRows = computed(() => filtered.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))
watch([query, status], () => { page.value = 1 })
function clearFilters() { query.value = ''; status.value = null }

const columns = [
  { key: 'name', label: 'Project' },
  { key: 'status', label: 'Status' },
  { key: 'owner', label: 'Owner', class: 'hidden md:table-cell' },
  { key: 'due', label: 'Due', class: 'hidden sm:table-cell' },
  { key: 'actions', label: 'Actions', srOnly: true, align: 'right', class: 'hidden sm:table-cell' }, // phones: open the row instead
]

// ── Create / edit ──────────────────────────────────────────────────────────
const drawer = ref(false)
const editing = ref(null)
const blank = () => ({ name: '', client: '', status: 'On track', category: 'Design', owner: OWNERS[0], notes: '' })
const draft = reactive(blank())
const formError = ref('')

function openNew() {
  editing.value = null
  Object.assign(draft, blank())
  formError.value = ''
  drawer.value = true
}
function edit(row) {
  editing.value = row
  Object.assign(draft, { ...row })
  formError.value = ''
  drawer.value = true
}
function saveProject() {
  if (!draft.name.trim()) { formError.value = 'Give the project a name.'; return }
  if (editing.value) {
    Object.assign(editing.value, { ...draft })
    toast('Project saved')
  } else {
    all.value.unshift({ ...draft, id: nextId++, due: '—' })
    clearFilters()
    toast('Project created')
  }
  drawer.value = false
}

// ── Row actions + delete ───────────────────────────────────────────────────
const confirmOpen = ref(false)
const toDelete = ref(null)
const rowActions = (row) => [
  { label: 'Edit', icon: PencilSquareIcon, onClick: () => edit(row) },
  { label: 'Duplicate', icon: DocumentDuplicateIcon, onClick: () => { all.value.unshift({ ...row, id: nextId++, name: `${row.name} (copy)` }); toast('Project duplicated') } },
  { divider: true },
  { label: 'Delete', icon: TrashIcon, danger: true, onClick: () => askDelete(row) },
]
function askDelete(row) {
  toDelete.value = row
  confirmOpen.value = true
}
function remove() {
  all.value = all.value.filter((p) => p.id !== toDelete.value.id)
  drawer.value = false
  toast(`${toDelete.value.name} deleted`, 'danger')
}
</script>
