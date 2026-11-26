// Docs pages for the full-page templates. The demo is a live iframe of /preview/<name>,
// the snippet is the template's own source (loaded on demand).
import { ref, defineComponent, h } from 'vue'
import TemplateFrame from './TemplateFrame.vue'
import { templates } from '../../templates'

// The code block shows the real file; it loads lazily and fills in once fetched.
function lazySource(name) {
  const text = ref('// Loading the template source…')
  templates[name].source().then((m) => { text.value = m.default })
  return text
}

function page(name, { title, description, inside, notes }) {
  const source = lazySource(name)
  return {
    title: `${title} template`,
    description,
    whenToUse: inside,
    whenNotTo: notes,
    useLabel: "What's inside",
    notLabel: 'Before you ship',
    stories: [
      {
        name: 'Preview',
        description: 'Live, in an iframe. Switch the width to see the tablet and phone layouts, or open it full screen. The docs theme toggle applies here too.',
        get snippet() { return source.value },
        demo: defineComponent({ setup() { return () => h(TemplateFrame, { name, title }) } }),
      },
    ],
  }
}

export const templatesDocs = {
  'template-dashboard': page('dashboard', {
    title: 'Dashboard',
    description: 'An app home page with a collapsible sidebar, a topbar with search and the user menu, KPI cards, a revenue chart, team capacity and a recent projects table. On phones the sidebar becomes the bottom tab bar.',
    inside: [
      'AppSidebar (v-model:collapsed) and AppBottomNav for phones',
      'AppUserMenu, AppInput with a leading icon, AppSegmentControl for the range',
      'StatCard with deltas, AppProgressBar, DataTable with AppBadge and AppDropdownMenu row actions',
      'AppAlert (dismissible) for a one-off notice',
    ],
    notes: [
      'The chart is plain markup to keep the kit dependency-free; swap in your chart library',
      'Data is static; replace it with your API calls',
    ],
  }),
  'template-settings': page('settings', {
    title: 'Settings',
    description: 'An account settings page: breadcrumbs, Tabs for sections, form fields with helpers and validation, notification toggles, team members with roles, and a danger zone that asks before deleting. Save shows a toast.',
    inside: [
      'AppBreadcrumbs, AppTabs (underline), AppFormField + AppInput / AppSelect / AppTextarea',
      'AppToggle rows, AppAvatar, AppDropdownMenu per member, AppBadge',
      'AppConfirmDialog for destructive actions, toast() on save',
    ],
    notes: [
      'Validation here is client-side only — check again on the server',
      "Keep one Save per tab; don't auto-save some fields and not others",
    ],
  }),
  'template-sign-in': page('sign-in', {
    title: 'Sign in',
    description: 'A split sign-in screen: form on the left with email and password, "remember me", a two-step verification step with the OTP input, and a gradient hero panel on the right that hides on phones.',
    inside: [
      'AppFormField + AppInput (password with show/hide), AppCheckbox, AppButton loading state',
      'AppOtpInput for the second step, AppAlert for errors',
      'A bg-brand-hero gradient panel with a testimonial card (hidden below lg)',
    ],
    notes: [
      'Hook the submit up to your auth API; nothing here stores credentials',
      'Try a wrong code: entering 000000 shows the error state',
    ],
  }),
  'template-projects': page('projects', {
    title: 'Projects',
    description: 'A list and detail page: breadcrumbs, a search box and filter chips, a table with status badges, row menus and pagination, a drawer to create or edit a project, an empty state when nothing matches, and a confirm dialog before deleting.',
    inside: [
      'AppFilterChip, AppInput (clearable), DataTable (clickable rows), AppPagination',
      'AppDrawer with a form (AppFormField, AppSelect, AppTextarea), AppEmptyState',
      'AppDropdownMenu row actions, AppConfirmDialog, toast()',
    ],
    notes: [
      'Filtering and paging run in memory; move them to the server for large lists',
    ],
  }),
}
