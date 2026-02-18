<template>
  <div class="shell-layout">
    <header class="border-b border-athlete-border bg-athlete-surface/80 backdrop-blur">
      <div class="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div class="flex items-center justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 min-w-0">
            <div class="h-8 w-8 rounded-xl bg-gradient-to-br from-athlete-gold to-athlete-silver flex items-center justify-center text-xs font-semibold text-athlete-bg">
              TL
            </div>
            <div>
              <h1 class="text-lg sm:text-xl font-semibold leading-tight">TimeOs Leo</h1>
              <p class="text-xs text-athlete-muted">Elite Athlete Mode · Modeling + Performance</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <nav
              class="hidden md:flex items-center gap-3 lg:gap-4 text-xs sm:text-sm font-medium"
            >
              <RouterLink
                to="/"
                class="shell-link"
                active-class="shell-link-active"
                exact-active-class="shell-link-active"
              >
                Dashboard
              </RouterLink>
              <RouterLink
                to="/productivity"
                class="shell-link"
                active-class="shell-link-active"
              >
                Productivity
              </RouterLink>
              <RouterLink
                to="/time-distribution"
                class="shell-link"
                active-class="shell-link-active"
              >
                Time Distribution
              </RouterLink>
              <RouterLink
                to="/finance"
                class="shell-link"
                active-class="shell-link-active"
              >
                Finance
              </RouterLink>
              <RouterLink
                to="/modeling-progress"
                class="shell-link"
                active-class="shell-link-active"
              >
                Modeling Progress
              </RouterLink>
            </nav>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-md border border-athlete-border bg-athlete-surface px-2.5 py-1.5 text-xs font-medium text-athlete-muted hover:border-athlete-gold/70 hover:text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold md:hidden"
              @click="isNavOpen = !isNavOpen"
            >
              <span class="mr-1">Menu</span>
              <span class="relative flex h-3 w-3 items-center justify-center">
                <span
                  v-if="!isNavOpen"
                  class="block h-[2px] w-3 bg-athlete-silver shadow-[0_4px_0_0_rgba(148,163,184,1),0_-4px_0_0_rgba(148,163,184,1)]"
                ></span>
                <span
                  v-else
                  class="block h-3 w-3 rotate-45 border-b border-athlete-silver border-l"
                ></span>
              </span>
            </button>
          </div>
        </div>
        <div v-if="isNavOpen" class="mt-3 md:hidden">
          <nav class="flex flex-col gap-1 text-xs font-medium">
            <RouterLink
              to="/"
              class="shell-link"
              active-class="shell-link-active"
              exact-active-class="shell-link-active"
              @click="isNavOpen = false"
            >
              Dashboard
            </RouterLink>
            <RouterLink
              to="/productivity"
              class="shell-link"
              active-class="shell-link-active"
              @click="isNavOpen = false"
            >
              Productivity
            </RouterLink>
            <RouterLink
              to="/time-distribution"
              class="shell-link"
              active-class="shell-link-active"
              @click="isNavOpen = false"
            >
              Time Distribution
            </RouterLink>
            <RouterLink
              to="/finance"
              class="shell-link"
              active-class="shell-link-active"
              @click="isNavOpen = false"
            >
              Finance
            </RouterLink>
            <RouterLink
              to="/modeling-progress"
              class="shell-link"
              active-class="shell-link-active"
              @click="isNavOpen = false"
            >
              Modeling Progress
            </RouterLink>
          </nav>
        </div>
      </div>
    </header>
    <main class="shell-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isNavOpen = ref(false)
</script>
