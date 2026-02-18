<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold">Elite Athlete Mode</h2>
        <p class="text-sm text-athlete-muted">
          Satu layar buat lihat eksekusi harian, distribusi waktu, kondisi finansial, dan modeling presence.
        </p>
      </div>
      <div class="shell-chip">
        <span class="mr-2 h-1.5 w-1.5 rounded-full bg-athlete-gold"></span>
        Live Performance Dashboard
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <RouterLink
        to="/productivity"
        class="shell-surface p-6 hover:border-athlete-gold/70 hover:shadow-athlete transition"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs uppercase tracking-wide text-athlete-muted">Execution Engine</div>
            <div class="mt-2 text-lg font-semibold text-athlete-textSoft">Productivity</div>
          </div>
          <div class="text-right text-xs">
            <div class="text-athlete-muted">Daily Score</div>
            <div class="text-xl font-semibold text-athlete-gold">
              {{ dashboard.productivityScore }}%
            </div>
          </div>
        </div>
        <p class="mt-3 text-sm text-athlete-muted">
          3 prioritas harian. Minimal 1–3 kemenangan per hari.
        </p>
      </RouterLink>

      <RouterLink
        to="/time-distribution"
        class="shell-surface p-6 hover:border-athlete-gold/70 hover:shadow-athlete transition"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs uppercase tracking-wide text-athlete-muted">Time Strategy</div>
            <div class="mt-2 text-lg font-semibold text-athlete-textSoft">Time Distribution</div>
          </div>
          <div class="text-right text-xs">
            <div class="text-athlete-muted">Time Quality</div>
            <div class="text-xl font-semibold text-athlete-gold">
              {{ dashboard.timeQualityScore }}%
            </div>
          </div>
        </div>
        <p class="mt-3 text-sm text-athlete-muted">
          {{ dashboard.timeLeakWarning || 'Lihat porsi deep work vs distraction hari ini.' }}
        </p>
      </RouterLink>

      <RouterLink
        to="/finance"
        class="shell-surface p-6 hover:border-athlete-gold/70 hover:shadow-athlete transition"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs uppercase tracking-wide text-athlete-muted">Power Capital</div>
            <div class="mt-2 text-lg font-semibold text-athlete-textSoft">Finance</div>
          </div>
          <div class="text-right text-xs">
            <div class="text-athlete-muted">Saving Rate</div>
            <div class="text-xl font-semibold text-athlete-gold">
              {{ dashboard.savingRate }}%
            </div>
          </div>
        </div>
        <p class="mt-3 text-sm text-athlete-muted">
          {{ dashboard.financeStatus || 'Monitor income, expense, dan tabungan kumulatif.' }}
        </p>
      </RouterLink>

      <RouterLink
        to="/modeling-progress"
        class="shell-surface p-6 hover:border-athlete-gold/70 hover:shadow-athlete transition"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs uppercase tracking-wide text-athlete-muted">Long Game</div>
            <div class="mt-2 text-lg font-semibold text-athlete-textSoft">Modeling Progress</div>
          </div>
          <div class="text-right text-xs">
            <div class="text-athlete-muted">MPI</div>
            <div class="text-xl font-semibold text-athlete-gold">
              {{ dashboard.mpiScore }}
            </div>
          </div>
        </div>
        <p class="mt-3 text-sm text-athlete-muted">
          {{ dashboard.mpiStatus || 'Physical, posture, dan consistency digabung jadi satu skor.' }}
        </p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'

const dashboard = reactive({
  productivityScore: 0,
  timeQualityScore: 0,
  timeLeakWarning: '',
  savingRate: 0,
  financeStatus: '',
  mpiScore: 0,
  mpiStatus: ''
})

onMounted(() => {
  loadProductivity()
  loadTimeDistribution()
  loadFinance()
  loadModeling()
})

function loadProductivity() {
  try {
    const raw = localStorage.getItem('timeos-daily-priorities')
    if (!raw) {
      return
    }
    const parsed = JSON.parse(raw)
    const todayKey = new Date().toISOString().slice(0, 10)
    const today = parsed[todayKey]
    if (!today || !Array.isArray(today.priorities)) {
      return
    }
    const doneCount = today.priorities.filter(
      p => p.done && p.text && typeof p.text === 'string' && p.text.trim().length
    ).length
    const table = [0, 50, 75, 100]
    const index = Math.min(doneCount, 3)
    dashboard.productivityScore = table[index]
  } catch {
  }
}

function loadTimeDistribution() {
  try {
    const raw = localStorage.getItem('timeos-time-distribution')
    if (!raw) {
      return
    }
    const parsed = JSON.parse(raw)
    const todayKey = new Date().toISOString().slice(0, 10)
    const today = parsed[todayKey]
    if (!today || !today.distribution) {
      return
    }
    const d = today.distribution
    const total =
      (d.sleep || 0) +
      (d.work || 0) +
      (d.deepWork || 0) +
      (d.learning || 0) +
      (d.workout || 0) +
      (d.distraction || 0) +
      (d.personal || 0)
    if (!total || total <= 0) {
      return
    }
    const productive =
      (d.deepWork || 0) + (d.learning || 0) + (d.workout || 0) + (d.work || 0)
    const score = (productive / 24) * 100
    dashboard.timeQualityScore = Math.round(score)
    if ((d.distraction || 0) > 2) {
      dashboard.timeLeakWarning = 'Time Leak Detected: distraction hari ini > 2 jam.'
    }
  } catch {
  }
}

function loadFinance() {
  try {
    const raw = localStorage.getItem('timeos-finance-control')
    if (!raw) {
      return
    }
    const parsed = JSON.parse(raw)
    const monthKey = getCurrentMonthKey()
    const entry = parsed[monthKey]
    if (!entry) {
      return
    }
    const totalIncome = (entry.income || []).reduce((sum, row) => {
      const val = typeof row.amount === 'number' ? row.amount : 0
      return sum + (isNaN(val) ? 0 : val)
    }, 0)
    const totalExpense = (entry.expenses || []).reduce((sum, row) => {
      const val = typeof row.amount === 'number' ? row.amount : 0
      return sum + (isNaN(val) ? 0 : val)
    }, 0)
    if (totalIncome <= 0) {
      return
    }
    const net = totalIncome - totalExpense
    const rate = (net / totalIncome) * 100
    dashboard.savingRate = Math.round(rate)

    const totalsByType = { Needs: 0, Wants: 0, Investment: 0 }
    for (const row of entry.expenses || []) {
      const key = row.type
      const val = typeof row.amount === 'number' ? row.amount : 0
      if (!isNaN(val) && totalsByType[key] !== undefined) {
        totalsByType[key] += val
      }
    }

    if (dashboard.savingRate >= 30 && totalsByType.Investment >= totalIncome * 0.1) {
      dashboard.financeStatus = 'Wealth Builder Mode'
    } else if (dashboard.savingRate < 10) {
      dashboard.financeStatus = 'Financial Risk Mode'
    } else if (totalsByType.Wants > totalIncome * 0.3) {
      dashboard.financeStatus = 'Lifestyle Overload'
    } else if (totalsByType.Investment < totalIncome * 0.1) {
      dashboard.financeStatus = 'Growth Stagnant'
    } else {
      dashboard.financeStatus = 'Neutral – pola pengeluaran masih seimbang.'
    }
  } catch {
  }
}

function loadModeling() {
  try {
    const raw = localStorage.getItem('timeos-modeling-progress')
    if (!raw) {
      return
    }
    const parsed = JSON.parse(raw)
    const body = parsed.body || {}
    const weekly = parsed.weekly || {}
    let targetWeight = parsed.targetWeight
    if (!targetWeight || typeof targetWeight !== 'number') {
      targetWeight = 70
    }

    const todayKey = new Date().toISOString().slice(0, 10)
    const bodyEntry = body[todayKey]
    let physicalPercent = 0
    if (bodyEntry && bodyEntry.weight && targetWeight > 0) {
      const rawPhysical = (bodyEntry.weight / targetWeight) * 100
      physicalPercent = Math.round(Math.max(0, Math.min(100, rawPhysical)))
    }

    const weekKey = getWeekKey(new Date())
    const weeklyEntry = weekly[weekKey]
    let posturePercent = 0
    if (weeklyEntry && weeklyEntry.postureScore) {
      const rawPosture = (weeklyEntry.postureScore / 10) * 100
      posturePercent = Math.round(Math.max(0, Math.min(100, rawPosture)))
    }

    const consistencyWindow = 6
    const now = new Date()
    let completed = 0
    for (let i = 0; i < consistencyWindow; i += 1) {
      const d = new Date(now)
      d.setDate(now.getDate() - i * 7)
      const key = getWeekKey(d)
      const entry = weekly[key]
      if (entry && entry.postureScore && entry.confidence && entry.posted) {
        completed += 1
      }
    }
    const consistencyPercent = Math.round(
      Math.max(0, Math.min(100, (completed / consistencyWindow) * 100))
    )

    const mpi = physicalPercent * 0.4 + posturePercent * 0.3 + consistencyPercent * 0.3
    const mpiClamped = Math.round(Math.max(0, Math.min(100, mpi)))
    dashboard.mpiScore = mpiClamped

    if (mpiClamped < 50) {
      dashboard.mpiStatus = 'Amateur Mode'
    } else if (mpiClamped < 70) {
      dashboard.mpiStatus = 'Improving Mode'
    } else if (mpiClamped < 85) {
      dashboard.mpiStatus = 'Rising Model'
    } else {
      dashboard.mpiStatus = 'Elite Presence'
    }
  } catch {
  }
}

function getCurrentMonthKey() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
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
