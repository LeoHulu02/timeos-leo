<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
      <div>
        <h2 class="text-2xl font-bold">Modeling Progress</h2>
        <p class="text-sm text-athlete-muted">
          Sistem buat track body, posture, dan confidence kayak season progress seorang model.
        </p>
      </div>
      <div class="shell-chip mt-2 sm:mt-0">
        Long Game · Presence
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="space-y-4 xl:col-span-2">
        <div class="shell-surface p-6 space-y-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-sm font-medium text-athlete-silver">Physical Progress</div>
              <p class="text-xs text-athlete-muted">
                Input weight, waist, dan body metrics sederhana untuk lihat lean progress vs dirty bulk.
              </p>
            </div>
            <div class="text-right text-xs text-athlete-muted">
              <div>Tanggal</div>
              <div class="font-medium text-athlete-textSoft">
                {{ todayLabel }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div class="space-y-1">
              <div class="text-athlete-muted">Weight (kg)</div>
              <input
                v-model.number="bodyForm.weight"
                type="number"
                step="0.1"
                min="0"
                class="w-full rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold"
              />
            </div>
            <div class="space-y-1">
              <div class="text-athlete-muted">Waist (cm)</div>
              <input
                v-model.number="bodyForm.waist"
                type="number"
                step="0.5"
                min="0"
                class="w-full rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold"
              />
            </div>
            <div class="space-y-1">
              <div class="text-athlete-muted">Chest (cm)</div>
              <input
                v-model.number="bodyForm.chest"
                type="number"
                step="0.5"
                min="0"
                class="w-full rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold"
              />
            </div>
            <div class="space-y-1">
              <div class="text-athlete-muted">Shoulder (cm)</div>
              <input
                v-model.number="bodyForm.shoulderWidth"
                type="number"
                step="0.5"
                min="0"
                class="w-full rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold"
              />
            </div>
            <div class="space-y-1">
              <div class="text-athlete-muted">Body fat (%)</div>
              <input
                v-model.number="bodyForm.bodyFatEstimate"
                type="number"
                step="0.5"
                min="0"
                max="40"
                class="w-full rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold"
              />
            </div>
            <div class="space-y-1">
              <div class="text-athlete-muted">Target weight (kg)</div>
              <input
                v-model.number="targetWeight"
                type="number"
                step="0.5"
                min="0"
                class="w-full rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold"
              />
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 text-xs">
            <button
              type="button"
              class="inline-flex items-center rounded-md border border-dashed border-athlete-border px-3 py-1.5 font-medium text-athlete-muted hover:border-athlete-gold/70 hover:text-athlete-textSoft"
              @click="saveBodyMetrics"
            >
              Simpan progres hari ini
            </button>
            <div class="text-right">
              <div class="text-athlete-muted">Physical Progress ke {{ targetWeight }} kg</div>
              <div class="text-lg font-semibold text-athlete-gold">
                {{ physicalProgressPercent }}%
              </div>
            </div>
          </div>

          <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-athlete-muted">
            <div class="rounded-md border border-athlete-border bg-athlete-surfaceSoft px-3 py-2">
              <div class="font-medium text-athlete-silver">Lean Gain Mode</div>
              <p class="mt-1">
                Status sekarang:
                <span
                  v-if="leanStatus.label"
                  :class="leanStatus.className"
                >
                  {{ leanStatus.label }}
                </span>
                <span v-else class="text-athlete-muted">
                  Butuh minimal 2 data hari untuk baca pola.
                </span>
              </p>
            </div>
            <div class="rounded-md border border-athlete-border bg-athlete-surfaceSoft px-3 py-2">
              <div class="font-medium text-athlete-silver">Last Entries</div>
              <p v-if="lastBodyEntries.length === 0" class="mt-1">
                Belum ada data tersimpan. Simpan minimal 2 hari untuk lihat pola.
              </p>
              <ul v-else class="mt-1 space-y-1">
                <li
                  v-for="entry in lastBodyEntries"
                  :key="entry.date"
                  class="flex items-center justify-between"
                >
                  <span>{{ entry.label }}</span>
                  <span class="tabular-nums">
                    {{ entry.weight }} kg · {{ entry.waist }} cm
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="shell-surface p-6 space-y-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-sm font-medium text-athlete-silver">Weekly Posture & Confidence</div>
              <p class="text-xs text-athlete-muted">
                Self-check postur + confidence score per minggu, kayak rating presence lo.
              </p>
            </div>
            <div class="text-right text-xs text-athlete-muted">
              <div>Minggu</div>
              <div class="font-medium text-athlete-textSoft">
                {{ currentWeekLabel }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="space-y-2">
              <div class="space-y-1">
                <div class="text-athlete-muted">Posture Score (1 – 10)</div>
                <input
                  v-model.number="weeklyForm.postureScore"
                  type="number"
                  min="1"
                  max="10"
                  class="w-full rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold"
                />
              </div>
              <div class="rounded-md border border-athlete-border bg-athlete-surfaceSoft px-3 py-2 text-[11px] text-athlete-muted">
                Checklist mental:
                bahu tegak, kepala tidak terlalu forward, perut masuk, dada terbuka.
              </div>
            </div>
            <div class="space-y-2">
              <div class="space-y-1">
                <div class="text-athlete-muted">Confidence (1 – 10)</div>
                <input
                  v-model.number="weeklyForm.confidence"
                  type="number"
                  min="1"
                  max="10"
                  class="w-full rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold"
                />
              </div>
              <div class="flex items-center gap-3 text-[11px] mt-1">
                <label class="inline-flex items-center gap-1">
                  <input
                    v-model="weeklyForm.posted"
                    type="checkbox"
                    class="h-3 w-3 rounded border-athlete-border bg-athlete-surface text-athlete-gold focus:ring-athlete-gold"
                  />
                  <span class="text-athlete-muted">Upload foto minggu ini?</span>
                </label>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div class="space-y-1">
              <div class="text-athlete-muted">Photo – Front (link / catatan)</div>
              <input
                v-model="weeklyForm.photoFront"
                type="text"
                class="w-full rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-[11px] text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold"
                placeholder="Contoh: folder/2026-02-17-front.jpg"
              />
            </div>
            <div class="space-y-1">
              <div class="text-athlete-muted">Photo – Side</div>
              <input
                v-model="weeklyForm.photoSide"
                type="text"
                class="w-full rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-[11px] text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold"
              />
            </div>
            <div class="space-y-1">
              <div class="text-athlete-muted">Photo – Back</div>
              <input
                v-model="weeklyForm.photoBack"
                type="text"
                class="w-full rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-[11px] text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold"
              />
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 text-xs">
            <button
              type="button"
              class="inline-flex items-center rounded-md border border-dashed border-athlete-border px-3 py-1.5 font-medium text-athlete-muted hover:border-athlete-gold/70 hover:text-athlete-textSoft"
              @click="saveWeekly"
            >
              Simpan weekly check-in
            </button>
            <div class="text-right">
              <div class="text-athlete-muted">Posture Score minggu ini</div>
              <div class="text-lg font-semibold text-athlete-silver">
                {{ weeklyForm.postureScore || 0 }}/10
              </div>
            </div>
          </div>

          <div class="mt-3">
            <div class="text-[11px] font-medium text-athlete-silver mb-1">
              History 6 minggu terakhir
            </div>
            <div class="space-y-1.5 text-[11px] text-athlete-muted">
              <div
                v-for="item in weeklyHistory"
                :key="item.week"
                class="space-y-0.5"
              >
                <div class="flex items-center justify-between">
                  <span>{{ item.label }}</span>
                  <span class="tabular-nums">
                    Posture {{ item.postureScore || 0 }}/10 · Conf {{ item.confidence || 0 }}/10
                  </span>
                </div>
                <div class="h-1.5 w-full rounded-full bg-athlete-surfaceSoft">
                  <div
                    class="h-full rounded-full bg-athlete-gold"
                    :style="{ width: item.postureScore ? (item.postureScore / 10) * 100 + '%' : '0%' }"
                  ></div>
                </div>
              </div>
              <div v-if="!weeklyHistory.length" class="text-[11px] text-athlete-muted">
                Belum ada weekly check-in. Isi minimal 1 minggu untuk mulai lihat trend.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="shell-surface p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-athlete-silver">Modeling Performance Index (MPI)</div>
              <p class="text-xs text-athlete-muted">
                Gabungan physical progress, posture, dan consistency jadi satu skor 0–100.
              </p>
            </div>
          </div>

          <div class="flex items-baseline gap-3">
            <div class="text-4xl font-semibold text-athlete-gold">
              {{ mpiScore }}
            </div>
            <div class="space-y-1 text-[11px] text-athlete-muted">
              <div>Physical: {{ physicalPercentRounded }}%</div>
              <div>Posture: {{ posturePercent }}%</div>
              <div>Consistency: {{ consistencyPercent }}%</div>
            </div>
          </div>

          <div class="h-2 w-full rounded-full bg-athlete-surfaceSoft">
            <div
              class="h-full rounded-full bg-athlete-gold transition-all"
              :style="{ width: mpiScore + '%' }"
            ></div>
          </div>

          <div
            class="mt-2 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium"
            :class="mpiBadgeClass"
          >
            <span class="mr-1 h-1.5 w-1.5 rounded-full" :class="mpiDotClass"></span>
            <span>{{ mpiStatusLabel }}</span>
          </div>

          <div class="text-[11px] text-athlete-muted">
            <p v-if="mpiStatusLabel === 'Amateur Mode'">
              Fondasi lagi dibangun. Fokus disiplin input data, jaga sleep, dan deep work untuk badan.
            </p>
            <p v-else-if="mpiStatusLabel === 'Improving Mode'">
              Progres jalan. Naikin consistency weekly check-in dan jaga waist sambil weight naik.
            </p>
            <p v-else-if="mpiStatusLabel === 'Rising Model'">
              Lo lagi masuk fase rising. Jaga momentum, jangan turunin posture dan confidence.
            </p>
            <p v-else-if="mpiStatusLabel === 'Elite Presence'">
              Elite presence mode. Tinggal mainkan detail kecil (pose, ekspresi, grooming).
            </p>
            <p v-else>
              Isi beberapa data dulu untuk lihat score dan status modeling lo.
            </p>
          </div>
        </div>

        <div class="shell-surface p-6 space-y-4">
          <div>
            <div class="text-sm font-medium text-athlete-silver">Consistency Overview</div>
            <p class="text-xs text-athlete-muted">
              Lihat seberapa sering lo check-in dan upload dalam 6 minggu terakhir.
            </p>
          </div>

          <div class="space-y-2 text-[11px] text-athlete-muted">
            <div class="flex items-center justify-between">
              <span>Minggu dengan data lengkap</span>
              <span class="tabular-nums">
                {{ completedWeeksCount }} / {{ consistencyWindow }} minggu
              </span>
            </div>
            <div class="h-2 w-full rounded-full bg-athlete-surfaceSoft">
              <div
                class="h-full rounded-full bg-emerald-400"
                :style="{ width: consistencyPercent + '%' }"
              ></div>
            </div>
          </div>

          <div class="space-y-1 text-[11px] text-athlete-muted">
            <div class="font-medium text-athlete-silver">Checklist weekly biar consistent:</div>
            <ul class="list-disc pl-4 space-y-0.5">
              <li>Input minimal 2 body metrics minggu ini.</li>
              <li>Isi posture score dan confidence 1x per minggu.</li>
              <li>Ambil 3 angle foto dan tandai sebagai posted.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

const STORAGE_KEY = 'timeos-modeling-progress'

const targetWeight = ref(70)

const bodyForm = ref({
  weight: null,
  chest: null,
  waist: null,
  shoulderWidth: null,
  bodyFatEstimate: null
})

const weeklyForm = ref({
  postureScore: null,
  confidence: null,
  posted: false,
  photoFront: '',
  photoSide: '',
  photoBack: ''
})

const store = ref({
  body: {},
  weekly: {}
})

onMounted(() => {
  loadFromStorage()
  hydrateForms()
})

watch(
  () => store.value,
  () => {
    saveToStorage()
  },
  { deep: true }
)

const todayKey = computed(() => {
  const d = new Date()
  return d.toISOString().slice(0, 10)
})

const todayLabel = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
})

const currentWeekKey = computed(() => {
  return getWeekKey(new Date())
})

const currentWeekLabel = computed(() => {
  const [year, week] = currentWeekKey.value.split('-W')
  return `W${week} · ${year}`
})

const lastBodyEntries = computed(() => {
  const entries = Object.keys(store.value.body || {}).map(dateKey => {
    const item = store.value.body[dateKey]
    const d = new Date(dateKey)
    return {
      date: dateKey,
      label: d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short'
      }),
      weight: item.weight || 0,
      waist: item.waist || 0
    }
  })
  entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  return entries.slice(0, 3)
})

const physicalProgressPercent = computed(() => {
  const entry = store.value.body[todayKey.value]
  if (!entry || !entry.weight || !targetWeight.value || targetWeight.value <= 0) {
    return 0
  }
  const raw = (entry.weight / targetWeight.value) * 100
  const clamped = Math.max(0, Math.min(120, raw))
  return Math.round(clamped)
})

const leanStatus = computed(() => {
  const entries = Object.keys(store.value.body || {}).map(dateKey => {
    const item = store.value.body[dateKey]
    return {
      date: dateKey,
      weight: item.weight,
      waist: item.waist
    }
  })
  entries.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
  if (entries.length < 2) {
    return {
      label: '',
      className: ''
    }
  }
  const prev = entries[entries.length - 2]
  const curr = entries[entries.length - 1]
  if (
    typeof prev.weight !== 'number' ||
    typeof curr.weight !== 'number' ||
    typeof prev.waist !== 'number' ||
    typeof curr.waist !== 'number'
  ) {
    return {
      label: '',
      className: ''
    }
  }
  if (curr.weight > prev.weight && curr.waist <= prev.waist + 1) {
    return {
      label: 'Lean Growth',
      className: 'text-emerald-300'
    }
  }
  if (curr.waist > prev.waist + 1) {
    return {
      label: 'Dirty Bulk Warning',
      className: 'text-red-300'
    }
  }
  return {
    label: 'Netral / Maintenance',
    className: 'text-athlete-muted'
  }
})

const weeklyHistory = computed(() => {
  const entries = Object.keys(store.value.weekly || {}).map(key => {
    const item = store.value.weekly[key]
    return {
      week: key,
      postureScore: item.postureScore || 0,
      confidence: item.confidence || 0
    }
  })
  entries.sort((a, b) => (a.week < b.week ? 1 : a.week > b.week ? -1 : 0))
  const slice = entries.slice(0, 6)
  return slice
    .map(item => {
      const [year, week] = item.week.split('-W')
      return {
        ...item,
        label: `W${week} · ${year}`
      }
    })
    .reverse()
})

const physicalPercentRounded = computed(() => {
  return Math.min(100, Math.max(0, physicalProgressPercent.value))
})

const posturePercent = computed(() => {
  const current = store.value.weekly[currentWeekKey.value]
  if (!current || !current.postureScore) {
    return 0
  }
  const raw = (current.postureScore / 10) * 100
  return Math.round(Math.max(0, Math.min(100, raw)))
})

const consistencyWindow = 6

const consistencyPercent = computed(() => {
  const now = new Date()
  const weeks = []
  for (let i = 0; i < consistencyWindow; i += 1) {
    const d = new Date(now)
    d.setDate(now.getDate() - i * 7)
    weeks.push(getWeekKey(d))
  }
  let completed = 0
  for (const w of weeks) {
    const entry = store.value.weekly[w]
    if (entry && entry.postureScore && entry.confidence && entry.posted) {
      completed += 1
    }
  }
  const raw = (completed / consistencyWindow) * 100
  return Math.round(Math.max(0, Math.min(100, raw)))
})

const completedWeeksCount = computed(() => {
  const now = new Date()
  let completed = 0
  for (let i = 0; i < consistencyWindow; i += 1) {
    const d = new Date(now)
    d.setDate(now.getDate() - i * 7)
    const key = getWeekKey(d)
    const entry = store.value.weekly[key]
    if (entry && entry.postureScore && entry.confidence && entry.posted) {
      completed += 1
    }
  }
  return completed
})

const mpiScore = computed(() => {
  const physical = physicalPercentRounded.value
  const posture = posturePercent.value
  const consistency = consistencyPercent.value
  const raw = physical * 0.4 + posture * 0.3 + consistency * 0.3
  return Math.round(Math.max(0, Math.min(100, raw)))
})

const mpiStatusLabel = computed(() => {
  if (mpiScore.value < 1) {
    return ''
  }
  if (mpiScore.value < 50) {
    return 'Amateur Mode'
  }
  if (mpiScore.value < 70) {
    return 'Improving Mode'
  }
  if (mpiScore.value < 85) {
    return 'Rising Model'
  }
  return 'Elite Presence'
})

const mpiBadgeClass = computed(() => {
  if (!mpiStatusLabel.value) {
    return 'border-athlete-border bg-athlete-surfaceSoft text-athlete-muted'
  }
  if (mpiStatusLabel.value === 'Amateur Mode') {
    return 'border-red-500/40 bg-red-500/10 text-red-200'
  }
  if (mpiStatusLabel.value === 'Improving Mode') {
    return 'border-amber-500/40 bg-amber-500/10 text-amber-100'
  }
  if (mpiStatusLabel.value === 'Rising Model') {
    return 'border-sky-500/40 bg-sky-500/10 text-sky-100'
  }
  return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
})

const mpiDotClass = computed(() => {
  if (!mpiStatusLabel.value) {
    return 'bg-athlete-border'
  }
  if (mpiStatusLabel.value === 'Amateur Mode') {
    return 'bg-red-400'
  }
  if (mpiStatusLabel.value === 'Improving Mode') {
    return 'bg-amber-400'
  }
  if (mpiStatusLabel.value === 'Rising Model') {
    return 'bg-sky-400'
  }
  return 'bg-emerald-400'
})

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return
    }
    const parsed = JSON.parse(raw)
    store.value.body = parsed.body || {}
    store.value.weekly = parsed.weekly || {}
    if (parsed.targetWeight && typeof parsed.targetWeight === 'number') {
      targetWeight.value = parsed.targetWeight
    }
  } catch {
  }
}

function saveToStorage() {
  try {
    const payload = {
      body: store.value.body,
      weekly: store.value.weekly,
      targetWeight: targetWeight.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
  }
}

function hydrateForms() {
  const bodyEntry = store.value.body[todayKey.value]
  if (bodyEntry) {
    bodyForm.value.weight = bodyEntry.weight ?? null
    bodyForm.value.chest = bodyEntry.chest ?? null
    bodyForm.value.waist = bodyEntry.waist ?? null
    bodyForm.value.shoulderWidth = bodyEntry.shoulderWidth ?? null
    bodyForm.value.bodyFatEstimate = bodyEntry.bodyFatEstimate ?? null
  }
  const weeklyEntry = store.value.weekly[currentWeekKey.value]
  if (weeklyEntry) {
    weeklyForm.value.postureScore = weeklyEntry.postureScore ?? null
    weeklyForm.value.confidence = weeklyEntry.confidence ?? null
    weeklyForm.value.posted = !!weeklyEntry.posted
    weeklyForm.value.photoFront = weeklyEntry.photoFront ?? ''
    weeklyForm.value.photoSide = weeklyEntry.photoSide ?? ''
    weeklyForm.value.photoBack = weeklyEntry.photoBack ?? ''
  }
}

function saveBodyMetrics() {
  store.value.body[todayKey.value] = {
    date: todayKey.value,
    weight: bodyForm.value.weight ?? null,
    chest: bodyForm.value.chest ?? null,
    waist: bodyForm.value.waist ?? null,
    shoulderWidth: bodyForm.value.shoulderWidth ?? null,
    bodyFatEstimate: bodyForm.value.bodyFatEstimate ?? null
  }
}

function saveWeekly() {
  store.value.weekly[currentWeekKey.value] = {
    week: currentWeekKey.value,
    postureScore: weeklyForm.value.postureScore ?? null,
    confidence: weeklyForm.value.confidence ?? null,
    posted: !!weeklyForm.value.posted,
    photoFront: weeklyForm.value.photoFront || '',
    photoSide: weeklyForm.value.photoSide || '',
    photoBack: weeklyForm.value.photoBack || ''
  }
}

function getWeekKey(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  const year = d.getUTCFullYear()
  const weekStr = String(weekNo).padStart(2, '0')
  return `${year}-W${weekStr}`
}
</script>
