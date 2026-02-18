<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold">Time Distribution</h2>
        <p class="text-sm text-athlete-muted">
          Lihat 24 jam lo kebuang di mana dan seberapa besar porsi deep work vs distraction.
        </p>
      </div>
      <div class="shell-chip">
        Time Strategy
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="shell-surface p-6 space-y-4">
        <div>
          <div class="text-sm font-medium text-athlete-textSoft">Input 24 Jam</div>
          <p class="text-xs text-athlete-muted">
            V1: manual input per hari. Total semua kategori harus 24 jam.
          </p>
        </div>

        <div class="rounded-md border border-athlete-border bg-athlete-surfaceSoft p-3 text-[11px] text-athlete-muted">
          Isi jam untuk:
          Sleep, Work, Deep Work, Learning, Workout, Distraction, Personal/Social.
          Sistem cek apakah totalnya pas 24 jam.
        </div>

        <div class="space-y-2">
          <div
            v-for="cat in categories"
            :key="cat.key"
            class="flex items-center gap-3 text-sm"
          >
            <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: cat.color }"></div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span class="text-athlete-textSoft">{{ cat.label }}</span>
                <span class="text-[11px] text-athlete-muted">
                  {{ distribution[cat.key] || 0 }} jam
                </span>
              </div>
              <input
                v-model.number="state.distribution[cat.key]"
                type="number"
                min="0"
                step="0.25"
                class="mt-1 w-full rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-xs text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs mt-2">
          <div class="flex items-baseline gap-1">
            <span class="text-athlete-muted">Total</span>
            <span class="font-semibold text-athlete-textSoft">
              {{ totalHours.toFixed(2) }} jam
            </span>
            <span class="text-athlete-muted">/ 24 jam</span>
          </div>
          <div
            class="inline-flex items-center rounded-full px-2.5 py-1 font-medium"
            :class="totalValid ? 'bg-emerald-500/10 text-emerald-300 text-[11px]' : 'bg-red-500/10 text-red-300 text-[11px]'"
          >
            <span class="mr-1 h-1.5 w-1.5 rounded-full" :class="totalValid ? 'bg-emerald-400' : 'bg-red-400'"></span>
            <span>{{ totalValid ? 'Total pas 24 jam' : 'Total belum 24 jam' }}</span>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="shell-surface p-6 space-y-4">
          <div>
            <div class="text-sm font-medium text-athlete-textSoft">Pie Chart 24 Jam</div>
            <p class="text-xs text-athlete-muted">
              Semakin besar warna merah/oranye, semakin besar time leak dan non-productive hours.
            </p>
          </div>
          <div class="flex items-center gap-6">
            <div
              class="h-40 w-40 rounded-full border border-athlete-border shadow-inner"
              :style="{ backgroundImage: pieBackground }"
            ></div>
            <div class="flex-1 space-y-2 text-[11px] text-athlete-muted">
              <div class="flex items-center gap-2" v-for="cat in categories" :key="cat.key + '-legend'">
                <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: cat.color }"></span>
                <span class="flex-1">{{ cat.label }}</span>
                <span class="tabular-nums">
                  {{ (distribution[cat.key] || 0).toFixed(2) }} jam
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="shell-surface p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-athlete-textSoft">Weekly Trend</div>
              <p class="text-xs text-athlete-muted">
                Lihat tren Deep Work, Sleep, dan Distraction 7 hari terakhir.
              </p>
            </div>
          </div>
          <div class="space-y-2 text-[11px]">
            <div
              v-for="day in weeklyTrend.items"
              :key="day.key"
              class="space-y-1"
            >
              <div class="flex items-center justify-between text-athlete-muted">
                <span>{{ day.label }}</span>
                <span class="tabular-nums">
                  DW {{ day.deepWork.toFixed(1) }}j • Slp {{ day.sleep.toFixed(1) }}j • Dis {{ day.distraction.toFixed(1) }}j
                </span>
              </div>
              <div class="flex h-2 w-full items-center gap-1">
                <div
                  class="h-1 rounded-full bg-emerald-400/70"
                  :style="{ width: weeklyTrend.maxDeep > 0 ? (day.deepWork / weeklyTrend.maxDeep) * 100 + '%' : '0%' }"
                ></div>
                <div
                  class="h-1 rounded-full bg-sky-400/70"
                  :style="{ width: weeklyTrend.maxSleep > 0 ? (day.sleep / weeklyTrend.maxSleep) * 100 + '%' : '0%' }"
                ></div>
                <div
                  class="h-1 rounded-full bg-red-500/70"
                  :style="{ width: weeklyTrend.maxDistraction > 0 ? (day.distraction / weeklyTrend.maxDistraction) * 100 + '%' : '0%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="shell-surface p-6 space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-athlete-textSoft">Time Quality Score</div>
              <p class="text-xs text-athlete-muted">
                Skor berdasarkan jam produktif vs 24 jam total.
              </p>
            </div>
            <div class="text-right">
              <div class="text-3xl font-semibold text-athlete-gold">
                {{ timeQualityScore }}%
              </div>
              <div class="text-[11px] text-athlete-muted">
                {{ productiveHours.toFixed(2) }} jam produktif
              </div>
            </div>
          </div>

          <div v-if="hasTimeLeak" class="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
            <div class="font-medium">Time Leak Detected</div>
            <p>Distraction lebih dari 2 jam. Lihat lagi pola penggunaan HP / scroll.</p>
          </div>

          <div v-if="alerts.length" class="space-y-1 text-[11px] text-athlete-muted">
            <div class="font-medium text-athlete-silver">Target Harian</div>
            <ul class="list-disc pl-4 space-y-0.5">
              <li v-for="alert in alerts" :key="alert">{{ alert }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

const STORAGE_KEY = 'timeos-time-distribution'

const categories = [
  { key: 'sleep', label: 'Sleep', color: '#4b5563' },
  { key: 'work', label: 'Work', color: '#eab308' },
  { key: 'deepWork', label: 'Deep Work', color: '#22c55e' },
  { key: 'learning', label: 'Learning', color: '#38bdf8' },
  { key: 'workout', label: 'Workout', color: '#f97316' },
  { key: 'distraction', label: 'Distraction', color: '#ef4444' },
  { key: 'personal', label: 'Personal / Social', color: '#a855f7' }
]

const state = ref({
  date: getTodayKey(),
  distribution: {
    sleep: 0,
    work: 0,
    deepWork: 0,
    learning: 0,
    workout: 0,
    distraction: 0,
    personal: 0
  }
})

onMounted(() => {
  loadFromStorage()
})

watch(
  state,
  () => {
    saveToStorage()
  },
  { deep: true }
)

const distribution = computed(() => state.value.distribution)

const totalHours = computed(() => {
  return categories.reduce((sum, cat) => {
    const val = distribution.value[cat.key]
    return sum + (typeof val === 'number' && !isNaN(val) ? val : 0)
  }, 0)
})

const totalValid = computed(() => {
  const diff = Math.abs(totalHours.value - 24)
  return diff < 0.01
})

const pieBackground = computed(() => {
  const total = totalHours.value
  if (!total || total <= 0) {
    return 'radial-gradient(circle at center, #111827 0, #020617 70%)'
  }
  let current = 0
  const segments = []
  for (const cat of categories) {
    const hours = distribution.value[cat.key] || 0
    if (hours <= 0) {
      continue
    }
    const slice = (hours / total) * 360
    const start = current
    const end = current + slice
    current = end
    segments.push(`${cat.color} ${start}deg ${end}deg`)
  }
  if (!segments.length) {
    return 'radial-gradient(circle at center, #111827 0, #020617 70%)'
  }
  return `conic-gradient(${segments.join(', ')})`
})

const weeklyTrend = computed(() => {
  let parsed = {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    parsed = raw ? JSON.parse(raw) : {}
  } catch {
    parsed = {}
  }

  const today = new Date()
  const items = []
  let maxDeep = 0
  let maxSleep = 0
  let maxDistraction = 0

  for (let offset = 6; offset >= 0; offset -= 1) {
    const d = new Date(today)
    d.setDate(today.getDate() - offset)
    const key = d.toISOString().slice(0, 10)
    const entry = parsed[key]
    const deepWork = entry?.distribution?.deepWork ?? 0
    const sleep = entry?.distribution?.sleep ?? 0
    const distractionHours = entry?.distribution?.distraction ?? 0

    maxDeep = Math.max(maxDeep, deepWork)
    maxSleep = Math.max(maxSleep, sleep)
    maxDistraction = Math.max(maxDistraction, distractionHours)

    items.push({
      key,
      label: d.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: '2-digit'
      }),
      deepWork,
      sleep,
      distraction: distractionHours
    })
  }

  return {
    items,
    maxDeep,
    maxSleep,
    maxDistraction
  }
})

const productiveHours = computed(() => {
  const d = distribution.value
  return (d.deepWork || 0) + (d.learning || 0) + (d.workout || 0) + (d.work || 0)
})

const timeQualityScore = computed(() => {
  if (!totalHours.value || totalHours.value <= 0) {
    return 0
  }
  const raw = (productiveHours.value / 24) * 100
  return Math.round(raw)
})

const hasTimeLeak = computed(() => {
  return (distribution.value.distraction || 0) > 2
})

const alerts = computed(() => {
  const d = distribution.value
  const result = []
  if ((d.deepWork || 0) < 2) {
    result.push('Deep Work hari ini kurang dari 2 jam.')
  }
  if ((d.workout || 0) < 0.75) {
    result.push('Workout hari ini kurang dari 45 menit.')
  }
  if ((d.sleep || 0) < 6) {
    result.push('Sleep hari ini kurang dari 6 jam.')
  }
  return result
})

function getTodayKey() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return
    }
    const parsed = JSON.parse(raw)
    const today = parsed[getTodayKey()]
    if (today && today.distribution) {
      state.value = {
        date: today.date,
        distribution: {
          sleep: today.distribution.sleep ?? 0,
          work: today.distribution.work ?? 0,
          deepWork: today.distribution.deepWork ?? 0,
          learning: today.distribution.learning ?? 0,
          workout: today.distribution.workout ?? 0,
          distraction: today.distribution.distraction ?? 0,
          personal: today.distribution.personal ?? 0
        }
      }
    }
  } catch {
  }
}

function saveToStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    parsed[state.value.date] = {
      date: state.value.date,
      distribution: state.value.distribution
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
  } catch {
  }
}
</script>
