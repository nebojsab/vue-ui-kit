<template>
  <div class="min-h-screen bg-page text-fg grid lg:grid-cols-2">
    <!-- Form side -->
    <main class="flex flex-col px-6 sm:px-12 py-8">
      <KitLogo label="Acme" class="h-8 text-fg self-start" />

      <div class="flex-1 flex items-center">
        <div class="w-full max-w-sm mx-auto py-10">
          <!-- Step 1: email + password -->
          <form v-if="step === 'password'" novalidate class="space-y-5" @submit.prevent="signIn">
            <div>
              <h1 class="font-display font-bold text-[28px] tracking-tight">Welcome back</h1>
              <p class="text-sm text-fg-muted mt-1">Sign in to continue to your workspace.</p>
            </div>

            <AppAlert v-if="failed" tone="danger" title="That didn't work">Check your email and password and try again.</AppAlert>

            <AppFormField label="Email" input-id="si-email" :error="errors.email">
              <AppInput id="si-email" v-model="email" type="email" autocomplete="email" placeholder="you@company.com" :error="!!errors.email" />
            </AppFormField>

            <AppFormField label="Password" input-id="si-password" :error="errors.password">
              <AppInput id="si-password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" :error="!!errors.password">
                <template #trailing>
                  <button
                    type="button"
                    class="w-8 h-8 -mr-1 flex items-center justify-center rounded-lg text-fg-muted hover:text-fg"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    :aria-pressed="showPassword"
                    @click="showPassword = !showPassword"
                  >
                    <EyeSlashIcon v-if="showPassword" class="w-4 h-4" /><EyeIcon v-else class="w-4 h-4" />
                  </button>
                </template>
              </AppInput>
            </AppFormField>

            <div class="flex items-center justify-between gap-3">
              <AppCheckbox v-model="remember">Remember me</AppCheckbox>
              <a href="#" class="text-sm font-semibold text-brand hover:underline" @click.prevent="toast('Reset link sent')">Forgot password?</a>
            </div>

            <AppButton type="submit" full-width :loading="loading">Sign in</AppButton>

            <p class="text-sm text-center text-fg-muted">
              New here? <a href="#" class="font-semibold text-brand hover:underline" @click.prevent="toast('Sign-up would open')">Create an account</a>
            </p>
          </form>

          <!-- Step 2: one-time code -->
          <div v-else class="space-y-6 text-center">
            <span class="mx-auto w-12 h-12 rounded-2xl bg-brand/15 text-brand flex items-center justify-center">
              <ShieldCheckIcon class="w-6 h-6" />
            </span>
            <div>
              <h1 class="font-display font-bold text-2xl tracking-tight">Check your phone</h1>
              <p class="text-sm text-fg-muted mt-1">Enter the 6-digit code from your authenticator app.</p>
            </div>
            <AppOtpInput v-model="code" :error="codeError" @complete="verify" />
            <p class="text-sm min-h-5" :class="codeError ? 'text-danger' : 'text-fg-muted'" aria-live="polite">
              {{ codeError ? "That code isn't right — try again." : loading ? 'Checking…' : '' }}
            </p>
            <div class="flex flex-col gap-2">
              <AppButton full-width :disabled="code.length < 6" :loading="loading" @click="verify(code)">Verify</AppButton>
              <AppButton full-width variant="ghost" @click="back">Use a different account</AppButton>
            </div>
          </div>
        </div>
      </div>

      <p class="text-xs text-fg-muted">© 2026 Acme Inc. · <a href="#" class="hover:text-fg" @click.prevent>Privacy</a> · <a href="#" class="hover:text-fg" @click.prevent>Terms</a></p>
    </main>

    <!-- Hero side (lg and up) -->
    <aside class="hidden lg:flex relative overflow-hidden m-3 rounded-panel border border-line bg-brand-hero p-12 flex-col justify-between" aria-hidden="true">
      <p class="text-overline text-brand">Acme workspace</p>
      <div>
        <p class="font-display font-bold text-[40px] leading-[1.05] tracking-tight max-w-md">Plan, ship and track every project in one place.</p>
        <div class="mt-10 card p-5 max-w-sm shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)]">
          <p class="text-sm text-fg-2">“We moved four teams over in a week. Nobody asked for the old tool back.”</p>
          <div class="mt-4 flex items-center gap-3">
            <AppAvatar name="Sara Novak" size="sm" />
            <div class="text-sm"><p class="font-semibold">Sara Novak</p><p class="text-fg-muted text-xs">Head of Product, Northwind</p></div>
          </div>
        </div>
      </div>
      <div class="flex gap-6 text-sm text-fg-2">
        <span><b class="text-fg tabular">12k+</b> teams</span>
        <span><b class="text-fg tabular">99.9%</b> uptime</span>
        <span><b class="text-fg">SOC 2</b> ready</span>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'
import {
  AppFormField, AppInput, AppCheckbox, AppButton, AppAlert, AppOtpInput, AppAvatar, KitLogo, toast,
} from '@nebojsab/vue-ui-kit'

const step = ref('password')
const email = ref('ana@acme.test')
const password = ref('')
const remember = ref(true)
const showPassword = ref(false)
const loading = ref(false)
const failed = ref(false)
const errors = reactive({ email: '', password: '' })
const code = ref('')
const codeError = ref(false)

const wait = (ms) => new Promise((r) => setTimeout(r, ms)) // stands in for your API

async function signIn() {
  errors.email = /^\S+@\S+\.\S+$/.test(email.value) ? '' : 'Enter an email like name@company.com.'
  errors.password = password.value ? '' : 'Enter your password.'
  failed.value = false
  if (errors.email || errors.password) return
  loading.value = true
  await wait(700)
  loading.value = false
  step.value = 'code'
}

async function verify(value) {
  if (value.length < 6 || loading.value) return
  loading.value = true
  codeError.value = false
  await wait(600)
  loading.value = false
  if (value === '000000') { codeError.value = true; return }
  toast('Signed in')
}

function back() {
  step.value = 'password'
  code.value = ''
  codeError.value = false
}
</script>
