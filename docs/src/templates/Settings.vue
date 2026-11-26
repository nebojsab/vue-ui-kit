<template>
  <div class="min-h-screen bg-page text-fg">
    <!-- Simple topbar -->
    <header class="border-b border-line bg-surface-1">
      <div class="max-w-5xl mx-auto h-16 px-4 sm:px-8 flex items-center gap-4">
        <KitLogo label="Acme" class="h-8 text-fg" />
        <div class="flex-1" />
        <AppUserMenu name="Ana Kovač" email="ana@acme.test" role="Admin" @sign-out="toast('Signed out')" />
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
      <AppBreadcrumbs :items="[{ label: 'Home', href: '#', icon: HomeIcon }, { label: 'Account', href: '#' }, { label: 'Settings' }]" />
      <h1 class="mt-3 font-display font-bold text-2xl sm:text-[28px] tracking-tight">Settings</h1>
      <p class="text-sm text-fg-muted mt-1">Manage your profile, notifications and team.</p>

      <AppTabs v-model="tab" :tabs="tabs" aria-label="Settings sections" class="mt-6" panel-class="pt-6">
        <!-- Profile -->
        <template #profile>
          <form class="card p-5 sm:p-6 space-y-6" novalidate @submit.prevent="save">
            <div class="flex items-center gap-4">
              <AppAvatar :name="form.name || '?'" size="lg" />
              <div>
                <p class="font-semibold">Profile photo</p>
                <div class="mt-2 flex gap-2">
                  <AppButton size="sm" variant="secondary" @click="toast('Upload dialog would open')">Upload</AppButton>
                  <AppButton size="sm" variant="ghost" @click="toast('Photo removed')">Remove</AppButton>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <AppFormField label="Full name" input-id="s-name" required :error="errors.name">
                <AppInput id="s-name" v-model="form.name" :error="!!errors.name" autocomplete="name" />
              </AppFormField>
              <AppFormField label="Email" input-id="s-email" required :error="errors.email" helper="We'll send a link to confirm a new address.">
                <AppInput id="s-email" v-model="form.email" type="email" :error="!!errors.email" autocomplete="email" />
              </AppFormField>
              <AppFormField label="Role" input-id="s-role">
                <AppSelect id="s-role" v-model="form.role" :options="['Designer', 'Engineer', 'Product manager', 'Founder']" />
              </AppFormField>
              <AppFormField label="Time zone" input-id="s-tz">
                <AppSelect id="s-tz" v-model="form.tz" :options="['Europe/Belgrade', 'Europe/London', 'America/New_York', 'Asia/Tokyo']" />
              </AppFormField>
              <AppFormField label="Bio" input-id="s-bio" hint="Optional" helper="A sentence or two for your profile." class="sm:col-span-2">
                <AppTextarea id="s-bio" v-model="form.bio" :rows="3" />
              </AppFormField>
            </div>
            <div class="flex justify-end gap-2 pt-2 border-t border-line">
              <AppButton variant="ghost" @click="reset">Cancel</AppButton>
              <AppButton type="submit" :loading="saving">Save changes</AppButton>
            </div>
          </form>
        </template>

        <!-- Notifications -->
        <template #notifications>
          <section class="card divide-y divide-line" aria-label="Notification settings">
            <div v-for="n in notifications" :key="n.key" class="flex items-start justify-between gap-6 p-5">
              <div>
                <p :id="`n-${n.key}`" class="font-semibold">{{ n.label }}</p>
                <p class="text-sm text-fg-muted mt-0.5">{{ n.help }}</p>
              </div>
              <AppToggle v-model="n.on" :aria-labelledby="`n-${n.key}`" @update:model-value="(v) => toast(`${n.label} ${v ? 'on' : 'off'}`)" />
            </div>
          </section>
        </template>

        <!-- Team -->
        <template #team>
          <section class="card" aria-label="Team members">
            <div class="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-line">
              <div>
                <p class="font-semibold">Team members</p>
                <p class="text-sm text-fg-muted">{{ members.length }} people · Admins can change billing</p>
              </div>
              <AppButton size="sm" @click="toast('Invite sent')"><UserPlusIcon class="w-4 h-4" /> Invite</AppButton>
            </div>
            <ul class="divide-y divide-line">
              <li v-for="m in members" :key="m.email" class="flex items-center gap-3 px-5 py-3.5">
                <AppAvatar :name="m.name" size="sm" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold truncate">{{ m.name }} <span v-if="m.you" class="text-fg-muted font-normal">(you)</span></p>
                  <p class="text-xs text-fg-muted truncate">{{ m.email }}</p>
                </div>
                <AppBadge :color="m.role === 'Admin' ? 'brand' : 'neutral'">{{ m.role }}</AppBadge>
                <AppDropdownMenu :label="`Options for ${m.name}`" align="end" :items="memberActions(m)">
                  <template #trigger="{ toggle, attrs }">
                    <button v-bind="attrs" type="button" class="w-8 h-8 flex items-center justify-center rounded-lg text-fg-muted hover:bg-surface-2 hover:text-fg" :aria-label="`Options for ${m.name}`" @click="toggle">
                      <EllipsisHorizontalIcon class="w-5 h-5" />
                    </button>
                  </template>
                </AppDropdownMenu>
              </li>
            </ul>
          </section>
        </template>

        <!-- Danger zone -->
        <template #danger>
          <section class="rounded-card border border-danger/35 bg-danger/[0.04] p-5 sm:p-6" aria-labelledby="dz-title">
            <h2 id="dz-title" class="font-semibold text-danger">Delete account</h2>
            <p class="text-sm text-fg-2 mt-1 max-w-xl">Your projects, files and invoices will be deleted for good. Export anything you want to keep first.</p>
            <div class="mt-4 flex flex-wrap gap-2">
              <AppButton variant="secondary" @click="toast('Export started')">Export data</AppButton>
              <AppButton variant="danger" @click="confirmDelete = true">Delete account</AppButton>
            </div>
          </section>
        </template>
      </AppTabs>
    </main>

    <AppConfirmDialog v-model="confirmDelete" title="Delete your account?" confirm-label="Delete account" @confirm="toast('Account deleted', 'danger')">
      <p>Everything in <span class="font-semibold text-fg">Acme</span> will be gone. This can't be undone.</p>
    </AppConfirmDialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  HomeIcon, UserCircleIcon, BellIcon, UsersIcon, ExclamationTriangleIcon, UserPlusIcon, EllipsisHorizontalIcon,
  ShieldCheckIcon, TrashIcon,
} from '@heroicons/vue/24/outline'
import {
  AppBreadcrumbs, AppTabs, AppFormField, AppInput, AppSelect, AppTextarea, AppToggle, AppButton, AppAvatar,
  AppBadge, AppDropdownMenu, AppConfirmDialog, AppUserMenu, KitLogo, toast,
} from '@nebojsab/vue-ui-kit'

const tab = ref('profile')
const tabs = [
  { value: 'profile', label: 'Profile', icon: UserCircleIcon },
  { value: 'notifications', label: 'Notifications', icon: BellIcon },
  { value: 'team', label: 'Team', icon: UsersIcon, count: 4 },
  { value: 'danger', label: 'Danger zone', icon: ExclamationTriangleIcon },
]

const initial = { name: 'Ana Kovač', email: 'ana@acme.test', role: 'Designer', tz: 'Europe/Belgrade', bio: '' }
const form = reactive({ ...initial })
const errors = reactive({ name: '', email: '' })
const saving = ref(false)

function validate() {
  errors.name = form.name.trim() ? '' : 'Enter your name.'
  errors.email = /^\S+@\S+\.\S+$/.test(form.email) ? '' : 'Enter an email like name@company.com.'
  return !errors.name && !errors.email
}
async function save() {
  if (!validate()) return
  saving.value = true
  await new Promise((r) => setTimeout(r, 700)) // your API call
  saving.value = false
  toast('Profile saved')
}
function reset() {
  Object.assign(form, initial)
  errors.name = errors.email = ''
}

const notifications = reactive([
  { key: 'mentions', label: 'Mentions', help: 'When someone @mentions you in a comment.', on: true },
  { key: 'assign', label: 'Assignments', help: 'When a task is assigned to you.', on: true },
  { key: 'digest', label: 'Weekly digest', help: 'A Monday summary of your projects.', on: false },
  { key: 'product', label: 'Product news', help: 'New features, at most once a month.', on: false },
])

const members = [
  { name: 'Ana Kovač', email: 'ana@acme.test', role: 'Admin', you: true },
  { name: 'Marko Ilić', email: 'marko@acme.test', role: 'Admin' },
  { name: 'Sara Novak', email: 'sara@acme.test', role: 'Member' },
  { name: 'Jonas Berg', email: 'jonas@acme.test', role: 'Member' },
]
const memberActions = (m) => [
  { label: m.role === 'Admin' ? 'Make member' : 'Make admin', icon: ShieldCheckIcon, disabled: m.you, onClick: () => toast(`${m.name}: role changed`) },
  { divider: true },
  { label: 'Remove from team', icon: TrashIcon, danger: true, disabled: m.you, onClick: () => toast(`${m.name} removed`, 'danger') },
]

const confirmDelete = ref(false)
</script>
