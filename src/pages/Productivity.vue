<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
      <div>
        <h2 class="text-2xl font-bold">Productivity</h2>
        <p class="text-sm text-athlete-muted">Eksekusi 3 prioritas harian yang paling penting.</p>
      </div>
      <div class="text-right text-xs sm:text-sm">
        <div class="text-xs uppercase tracking-wide text-athlete-muted">Tanggal</div>
        <div class="text-sm font-medium text-athlete-textSoft">{{ formattedDate }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="xl:col-span-2 space-y-4">
        <div class="shell-surface p-6 space-y-4">
          <div class="flex items-center justify-between gap-4">
            <div>
              <div class="text-sm font-medium text-athlete-textSoft">Daily Priority System</div>
              <p class="text-xs text-athlete-muted">
                Pilih maksimal 3 prioritas yang bisa diukur jelas (durasi atau output).
              </p>
            </div>
            <div
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border"
              :class="isLocked ? 'border-athlete-gold bg-athlete-goldSoft/50 text-athlete-gold' : 'border-emerald-500/80 bg-emerald-500/10 text-emerald-300'"
            >
              <span
                class="mr-1 inline-block h-2 w-2 rounded-full"
                :class="isLocked ? 'bg-athlete-gold' : 'bg-emerald-400'"
              ></span>
              <span>{{ isLocked ? 'Locked setelah 12.00' : 'Masih bisa diubah sebelum 12.00' }}</span>
            </div>
          </div>

          <div class="rounded-md bg-athlete-surfaceSoft border border-dashed border-athlete-border p-3 text-xs text-athlete-muted">
            Gunakan angka atau output jelas. Contoh:
            <span class="font-medium">"Belajar Vue 2 jam"</span>,
            <span class="font-medium">"Selesaikan 1 fitur cart"</span>,
            <span class="font-medium">"Kirim 5 proposal freelance"</span>.
          </div>

          <div class="space-y-3">
            <div
              v-for="(priority, index) in state.priorities"
              :key="index"
              class="flex items-center gap-3 rounded-lg border border-athlete-border bg-athlete-surfaceSoft px-3 py-2"
            >
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-athlete-gold text-xs font-semibold text-athlete-bg">
                {{ index + 1 }}
              </div>
              <div class="flex-1 space-y-1">
                <input
                  v-model="priority.text"
                  :disabled="isLocked"
                  type="text"
                  class="w-full border-0 bg-transparent text-sm text-athlete-textSoft placeholder:text-athlete-muted focus:outline-none focus:ring-0 disabled:text-athlete-muted"
                  :placeholder="placeholders[index]"
                />
                <p class="text-[11px] text-athlete-muted">
                  Pastikan ada angka atau target jelas.
                </p>
              </div>
              <div class="flex flex-col items-end gap-1">
                <button
                  type="button"
                  class="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition"
                  :class="priority.done ? 'border-athlete-gold bg-athlete-goldSoft/60 text-athlete-gold' : 'border-athlete-border bg-athlete-surface text-athlete-muted hover:border-athlete-gold/70 hover:text-athlete-textSoft'"
                  @click="toggleDone(index)"
                  :disabled="!priority.text.trim().length"
                >
                  <span
                    class="mr-1 inline-block h-2 w-2 rounded-full"
                    :class="priority.done ? 'bg-athlete-gold' : 'bg-athlete-border'"
                  ></span>
                  {{ priority.done ? 'Selesai' : 'Belum' }}
                </button>
              </div>
            </div>

            <button
              type="button"
              class="inline-flex items-center rounded-md border border-dashed border-athlete-border px-3 py-1.5 text-xs font-medium text-athlete-muted hover:border-athlete-gold/70 hover:text-athlete-textSoft disabled:cursor-not-allowed disabled:opacity-50"
              @click="addPriority"
              :disabled="isLocked || state.priorities.length >= 3"
            >
              <span class="mr-1 text-base leading-none">+</span>
              Tambah prioritas (maks. 3)
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="shell-surface p-6 space-y-4">
          <div>
            <div class="text-sm font-medium text-athlete-textSoft">Daily Score</div>
            <p class="text-xs text-athlete-muted">
              Nilai berdasarkan jumlah prioritas yang benar-benar tereksekusi hari ini.
            </p>
          </div>
          <div class="flex items-baseline gap-2">
            <div class="text-4xl font-semibold text-athlete-gold">{{ completionPercent }}%</div>
            <div class="text-xs text-athlete-muted">
              {{ doneCount }} dari 3 prioritas harian.
            </div>
          </div>
          <div class="relative h-2 w-full overflow-hidden rounded-full bg-athlete-surfaceSoft">
            <div
              class="h-full rounded-full bg-athlete-gold transition-all"
              :style="{ width: completionPercent + '%' }"
            ></div>
          </div>
          <ul class="space-y-1 text-xs text-athlete-muted">
            <li>0/3 selesai → 0%</li>
            <li>1/3 selesai → 50%</li>
            <li>2/3 selesai → 75%</li>
            <li>3/3 selesai → 100%</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const STORAGE_KEY = 'timeos-daily-priorities'

const state = ref({
  date: getTodayKey(),
  priorities: []
})

const placeholders = [
  'Prioritas #1 — contoh: Deep work frontend 2 jam',
  'Prioritas #2 — contoh: Workout upper body',
  'Prioritas #3 — contoh: Kirim 5 proposal freelance'
]

const now = ref(new Date())
let timerId

onMounted(() => {
  loadFromStorage()
  timerId = setInterval(() => {
    now.value = new Date()
  }, 60000)
})

onUnmounted(() => {
  if (timerId) {
    clearInterval(timerId)
  }
})

watch(
  state,
  () => {
    saveToStorage()
  },
  { deep: true }
)

const formattedDate = computed(() => {
  const date = new Date(state.value.date)
  return date.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
})

const isLocked = computed(() => {
  const current = now.value
  const currentDateKey = current.toISOString().slice(0, 10)
  if (currentDateKey !== state.value.date) {
    return true
  }
  return current.getHours() >= 12
})

const doneCount = computed(() => {
  return state.value.priorities.filter(p => p.done && p.text && p.text.trim().length).length
})

const completionPercent = computed(() => {
  const table = [0, 50, 75, 100]
  const index = Math.min(doneCount.value, 3)
  return table[index]
})

function getTodayKey() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      ensureInitialPriorities()
      return
    }
    const parsed = JSON.parse(raw)
    const today = parsed[getTodayKey()]
    if (today && Array.isArray(today.priorities)) {
      state.value = {
        date: today.date,
        priorities: today.priorities.slice(0, 3)
      }
      if (state.value.priorities.length === 0) {
        ensureInitialPriorities()
      }
    } else {
      ensureInitialPriorities()
    }
  } catch {
    ensureInitialPriorities()
  }
}

function saveToStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    parsed[state.value.date] = {
      date: state.value.date,
      priorities: state.value.priorities.slice(0, 3)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
  } catch {
  }
}

function ensureInitialPriorities() {
  state.value = {
    date: getTodayKey(),
    priorities: []
  }
}

function addPriority() {
  if (isLocked.value) {
    return
  }
  if (state.value.priorities.length >= 3) {
    return
  }
  state.value.priorities.push({
    text: '',
    done: false
  })
}

function toggleDone(index) {
  const item = state.value.priorities[index]
  if (!item || !item.text || !item.text.trim().length) {
    return
  }
  item.done = !item.done
}
</script>
