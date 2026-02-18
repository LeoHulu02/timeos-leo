<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold">Finance</h2>
        <p class="text-sm text-athlete-muted">
          Bukan cuma catat angka. Ini mode CFO pribadi buat arahkan uang ke target.
        </p>
      </div>
      <div class="shell-chip">
        Financial Control System
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="space-y-4 xl:col-span-2">
        <div class="shell-surface p-6 space-y-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-sm font-medium text-athlete-silver">Income Bulanan</div>
              <p class="text-xs text-athlete-muted">
                Pecah sumber income biar kelihatan, bukan cuma total.
              </p>
            </div>
            <div class="text-right text-xs text-athlete-muted">
              <div>Bulan</div>
              <div class="font-medium text-athlete-textSoft">
                {{ currentMonthLabel }}
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div
              v-for="(row, index) in state.income"
              :key="'income-' + index"
              class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs"
            >
              <input
                v-model="row.source"
                type="text"
                class="w-full sm:w-2/5 rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold"
                placeholder="Sumber income"
              />
              <input
                v-model.number="row.amount"
                type="number"
                min="0"
                step="50000"
                class="w-full sm:w-2/5 rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold"
                placeholder="Jumlah (Rp)"
              />
              <button
                type="button"
                class="rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-[11px] text-athlete-muted hover:border-red-500/60 hover:text-red-300"
                @click="removeIncome(index)"
              >
                Hapus
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between gap-2 text-xs">
            <button
              type="button"
              class="inline-flex items-center rounded-md border border-dashed border-athlete-border px-3 py-1.5 font-medium text-athlete-muted hover:border-athlete-gold/70 hover:text-athlete-textSoft"
              @click="addIncome"
            >
              <span class="mr-1 text-base leading-none">+</span>
              Tambah sumber income
            </button>
            <div class="text-right">
              <div class="text-athlete-muted">Total Income</div>
              <div class="text-lg font-semibold text-athlete-silver">
                Rp {{ formatNumber(totalIncome) }}
              </div>
            </div>
          </div>
        </div>

        <div class="shell-surface p-6 space-y-4">
          <div>
            <div class="text-sm font-medium text-athlete-silver">Expenses Bulanan</div>
            <p class="text-xs text-athlete-muted">
              Bagi pengeluaran ke Needs, Wants, dan Investment. Ini yang bikin sadar pola.
            </p>
          </div>

          <div class="space-y-2 text-xs">
            <div
              v-for="(row, index) in state.expenses"
              :key="'expense-' + index"
              class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <select
                v-model="row.type"
                class="w-full sm:w-1/5 rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-[11px] text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold"
              >
                <option value="Needs">Needs</option>
                <option value="Wants">Wants</option>
                <option value="Investment">Investment</option>
              </select>
              <input
                v-model="row.category"
                type="text"
                class="w-full sm:w-2/5 rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold"
                placeholder="Kategori (Kos, Makan, Course, dst.)"
              />
              <input
                v-model.number="row.amount"
                type="number"
                min="0"
                step="50000"
                class="w-full sm:w-1/3 rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-athlete-textSoft focus:outline-none focus:ring-1 focus:ring-athlete-gold"
                placeholder="Jumlah (Rp)"
              />
              <button
                type="button"
                class="rounded-md border border-athlete-border bg-athlete-surface px-2 py-1 text-[11px] text-athlete-muted hover:border-red-500/60 hover:text-red-300"
                @click="removeExpense(index)"
              >
                Hapus
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between gap-2 text-xs">
            <button
              type="button"
              class="inline-flex items-center rounded-md border border-dashed border-athlete-border px-3 py-1.5 font-medium text-athlete-muted hover:border-athlete-gold/70 hover:text-athlete-textSoft"
              @click="addExpense"
            >
              <span class="mr-1 text-base leading-none">+</span>
              Tambah expense
            </button>
            <div class="text-right">
              <div class="text-athlete-muted">Total Expense</div>
              <div class="text-lg font-semibold text-athlete-silver">
                Rp {{ formatNumber(totalExpense) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="shell-surface p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-athlete-silver">Financial Snapshot</div>
              <p class="text-xs text-athlete-muted">
                Saving rate, status risiko, dan arah uang bulan ini.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="rounded-md border border-athlete-border bg-athlete-surfaceSoft px-3 py-2">
              <div class="text-athlete-muted">Net Saving</div>
              <div
                class="mt-1 text-sm font-semibold"
                :class="netSaving >= 0 ? 'text-emerald-300' : 'text-red-300'"
              >
                Rp {{ formatNumber(netSaving) }}
              </div>
            </div>
            <div class="rounded-md border border-athlete-border bg-athlete-surfaceSoft px-3 py-2">
              <div class="text-athlete-muted">Saving Rate</div>
              <div class="mt-1 text-sm font-semibold text-athlete-gold">
                {{ savingRate }}%
              </div>
            </div>
            <div class="rounded-md border border-athlete-border bg-athlete-surfaceSoft px-3 py-2">
              <div class="text-athlete-muted">Productive Spend</div>
              <div class="mt-1 text-sm font-semibold text-emerald-300">
                {{ investmentPercent }}% Invest
              </div>
            </div>
          </div>

          <div class="space-y-2 text-[11px]">
            <div class="flex items-center justify-between">
              <span class="text-athlete-muted">Needs</span>
              <span class="tabular-nums text-athlete-silver">
                Rp {{ formatNumber(totalsByType.Needs) }}
                <span class="text-athlete-muted"> ({{ needsPercent }}%)</span>
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-athlete-muted">Wants</span>
              <span class="tabular-nums text-athlete-silver">
                Rp {{ formatNumber(totalsByType.Wants) }}
                <span class="text-athlete-muted"> ({{ wantsPercent }}%)</span>
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-athlete-muted">Investment</span>
              <span class="tabular-nums text-athlete-silver">
                Rp {{ formatNumber(totalsByType.Investment) }}
                <span class="text-athlete-muted"> ({{ investmentPercent }}%)</span>
              </span>
            </div>
          </div>

          <div class="flex items-center gap-6 pt-1">
            <div
              class="h-32 w-32 rounded-full border border-athlete-border shadow-inner"
              :style="{ backgroundImage: expensePieBackground }"
            ></div>
            <div class="flex-1 space-y-1 text-[11px] text-athlete-muted">
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-slate-400"></span>
                <span class="flex-1">Needs</span>
                <span class="tabular-nums">{{ needsPercent }}%</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-sky-400"></span>
                <span class="flex-1">Wants</span>
                <span class="tabular-nums">{{ wantsPercent }}%</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span class="flex-1">Investment</span>
                <span class="tabular-nums">{{ investmentPercent }}%</span>
              </div>
            </div>
          </div>

          <div
            v-if="statusLabel"
            class="rounded-md border px-3 py-2 text-[11px]"
            :class="statusClass"
          >
            <div class="font-medium">{{ statusLabel }}</div>
            <p>{{ statusDescription }}</p>
          </div>
        </div>

        <div class="shell-surface p-6 space-y-4">
          <div>
            <div class="text-sm font-medium text-athlete-silver">Target & Progress</div>
            <p class="text-xs text-athlete-muted">
              Income ke 5 juta dan tabungan kumulatif ke 10 juta.
            </p>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <div class="flex items-center justify-between">
                <span class="text-athlete-muted">Income bulan ini</span>
                <span class="tabular-nums text-athlete-silver">
                  Rp {{ formatNumber(totalIncome) }} / Rp {{ formatNumber(TARGET_INCOME) }}
                </span>
              </div>
              <div class="mt-1 h-2 w-full rounded-full bg-athlete-surfaceSoft">
                <div
                  class="h-full rounded-full bg-athlete-gold transition-all"
                  :style="{ width: incomeProgress + '%' }"
                ></div>
              </div>
              <div class="mt-1 text-[11px] text-athlete-muted">
                {{ incomeProgress }}% menuju 5 juta.
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between">
                <span class="text-athlete-muted">Savings kumulatif</span>
                <span class="tabular-nums text-athlete-silver">
                  Rp {{ formatNumber(totalSavingsAllMonths) }} / Rp {{ formatNumber(TARGET_SAVINGS) }}
                </span>
              </div>
              <div class="mt-1 h-2 w-full rounded-full bg-athlete-surfaceSoft">
                <div
                  class="h-full rounded-full bg-emerald-400 transition-all"
                  :style="{ width: savingsProgress + '%' }"
                ></div>
              </div>
              <div class="mt-1 text-[11px] text-athlete-muted">
                {{ savingsProgress }}% menuju 10 juta.
              </div>
            </div>
          </div>

          <div class="pt-2">
            <div class="text-xs font-medium text-athlete-silver mb-1">
              Income Trend per Bulan
            </div>
            <div class="space-y-1.5 text-[11px] text-athlete-muted">
              <div
                v-for="item in incomeHistory"
                :key="item.month"
                class="space-y-0.5"
              >
                <div class="flex items-center justify-between">
                  <span>{{ item.label }}</span>
                  <span class="tabular-nums">Rp {{ formatNumber(item.totalIncome) }}</span>
                </div>
                <div class="h-1.5 w-full rounded-full bg-athlete-surfaceSoft">
                  <div
                    class="h-full rounded-full bg-athlete-gold"
                    :style="{ width: itemBarWidth(item.totalIncome) + '%' }"
                  ></div>
                </div>
              </div>
              <div v-if="!incomeHistory.length" class="text-[11px] text-athlete-muted">
                Belum ada data bulan lain. Isi income beberapa bulan ke depan untuk lihat trajectory.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

const STORAGE_KEY = 'timeos-finance-control'
const TARGET_INCOME = 5000000
const TARGET_SAVINGS = 10000000

const state = ref({
  month: getCurrentMonthKey(),
  income: [
    { source: 'Gaji', amount: 0 },
    { source: 'Freelance', amount: 0 }
  ],
  expenses: [
    { type: 'Needs', category: 'Kos', amount: 0 },
    { type: 'Needs', category: 'Makan', amount: 0 },
    { type: 'Needs', category: 'Transport', amount: 0 },
    { type: 'Investment', category: 'Course / Tools', amount: 0 },
    { type: 'Wants', category: 'Nongkrong / Entertainment', amount: 0 }
  ]
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

const currentMonthLabel = computed(() => formatMonthLabel(state.value.month))

const totalIncome = computed(() => {
  return state.value.income.reduce((sum, row) => {
    const val = typeof row.amount === 'number' ? row.amount : 0
    return sum + (isNaN(val) ? 0 : val)
  }, 0)
})

const totalExpense = computed(() => {
  return state.value.expenses.reduce((sum, row) => {
    const val = typeof row.amount === 'number' ? row.amount : 0
    return sum + (isNaN(val) ? 0 : val)
  }, 0)
})

const netSaving = computed(() => {
  return totalIncome.value - totalExpense.value
})

const savingRate = computed(() => {
  if (totalIncome.value <= 0) {
    return 0
  }
  const rate = (netSaving.value / totalIncome.value) * 100
  return Math.round(rate)
})

const totalsByType = computed(() => {
  const base = {
    Needs: 0,
    Wants: 0,
    Investment: 0
  }
  for (const row of state.value.expenses) {
    const key = row.type
    const val = typeof row.amount === 'number' ? row.amount : 0
    if (!isNaN(val) && base[key] !== undefined) {
      base[key] += val
    }
  }
  return base
})

const needsPercent = computed(() => {
  if (totalIncome.value <= 0) {
    return 0
  }
  const val = (totalsByType.value.Needs / totalIncome.value) * 100
  return Math.round(val)
})

const wantsPercent = computed(() => {
  if (totalIncome.value <= 0) {
    return 0
  }
  const val = (totalsByType.value.Wants / totalIncome.value) * 100
  return Math.round(val)
})

const investmentPercent = computed(() => {
  if (totalIncome.value <= 0) {
    return 0
  }
  const val = (totalsByType.value.Investment / totalIncome.value) * 100
  return Math.round(val)
})

const expensePieBackground = computed(() => {
  const incomeVal = totalIncome.value
  if (incomeVal <= 0) {
    return 'radial-gradient(circle at center, #111827 0, #020617 70%)'
  }
  const segments = []
  if (totalsByType.value.Needs > 0) {
    const slice = (totalsByType.value.Needs / incomeVal) * 360
    segments.push(`rgba(148, 163, 184, 1) 0deg ${slice}deg`)
  }
  if (totalsByType.value.Wants > 0) {
    const start = (totalsByType.value.Needs / incomeVal) * 360
    const end = start + (totalsByType.value.Wants / incomeVal) * 360
    segments.push(`rgba(56, 189, 248, 1) ${start}deg ${end}deg`)
  }
  if (totalsByType.value.Investment > 0) {
    const start =
      ((totalsByType.value.Needs + totalsByType.value.Wants) / incomeVal) * 360
    const end = start + (totalsByType.value.Investment / incomeVal) * 360
    segments.push(`rgba(52, 211, 153, 1) ${start}deg ${end}deg`)
  }
  if (!segments.length) {
    return 'radial-gradient(circle at center, #111827 0, #020617 70%)'
  }
  return `conic-gradient(${segments.join(', ')})`
})

const statusLabel = computed(() => {
  if (totalIncome.value <= 0) {
    return ''
  }
  if (savingRate.value >= 30 && investmentPercent.value >= 10) {
    return 'Wealth Builder Mode'
  }
  if (savingRate.value < 10) {
    return 'Financial Risk Mode'
  }
  if (totalsByType.value.Wants > totalIncome.value * 0.3) {
    return 'Lifestyle Overload'
  }
  if (totalsByType.value.Investment < totalIncome.value * 0.1) {
    return 'Growth Stagnant'
  }
  return ''
})

const statusDescription = computed(() => {
  if (!statusLabel.value) {
    return 'Pola pengeluaran masih netral. Lanjutkan tracking beberapa bulan untuk lihat pola.'
  }
  if (statusLabel.value === 'Wealth Builder Mode') {
    return 'Saving rate ≥ 30% dan investment ≥ 10%. Lo lagi main long game dengan sangat sehat.'
  }
  if (statusLabel.value === 'Financial Risk Mode') {
    return 'Saving rate di bawah 10%. Risiko finansial tinggi, perlu tekan pengeluaran dan naikin income.'
  }
  if (statusLabel.value === 'Lifestyle Overload') {
    return 'Porsi Wants lebih dari 30% income. Lifestyle lagi narik lebih keras dari target finansial.'
  }
  if (statusLabel.value === 'Growth Stagnant') {
    return 'Investment kurang dari 10% income. Growth spending buat naik level masih terlalu kecil.'
  }
  return ''
})

const statusClass = computed(() => {
  if (statusLabel.value === 'Wealth Builder Mode') {
    return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
  }
  if (statusLabel.value === 'Financial Risk Mode') {
    return 'border-red-500/40 bg-red-500/10 text-red-200'
  }
  if (statusLabel.value === 'Lifestyle Overload') {
    return 'border-amber-500/40 bg-amber-500/10 text-amber-100'
  }
  if (statusLabel.value === 'Growth Stagnant') {
    return 'border-sky-500/40 bg-sky-500/10 text-sky-100'
  }
  return 'border-athlete-border bg-athlete-surfaceSoft text-athlete-muted'
})

const incomeProgress = computed(() => {
  if (TARGET_INCOME <= 0) {
    return 0
  }
  const val = (totalIncome.value / TARGET_INCOME) * 100
  return Math.max(0, Math.min(100, Math.round(val)))
})

const totalSavingsAllMonths = computed(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return 0
    }
    const parsed = JSON.parse(raw)
    let total = 0
    for (const key of Object.keys(parsed)) {
      const entry = parsed[key]
      const incomeSum = (entry.income || []).reduce((sum, row) => {
        const val = typeof row.amount === 'number' ? row.amount : 0
        return sum + (isNaN(val) ? 0 : val)
      }, 0)
      const expenseSum = (entry.expenses || []).reduce((sum, row) => {
        const val = typeof row.amount === 'number' ? row.amount : 0
        return sum + (isNaN(val) ? 0 : val)
      }, 0)
      total += incomeSum - expenseSum
    }
    return total
  } catch {
    return 0
  }
})

const savingsProgress = computed(() => {
  if (TARGET_SAVINGS <= 0) {
    return 0
  }
  const val = (totalSavingsAllMonths.value / TARGET_SAVINGS) * 100
  return Math.max(0, Math.min(100, Math.round(val)))
})

const incomeHistory = computed(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw)
    const items = Object.keys(parsed).map(monthKey => {
      const entry = parsed[monthKey]
      const total = (entry.income || []).reduce((sum, row) => {
        const val = typeof row.amount === 'number' ? row.amount : 0
        return sum + (isNaN(val) ? 0 : val)
      }, 0)
      return {
        month: monthKey,
        label: formatMonthLabel(monthKey),
        totalIncome: total
      }
    })
    items.sort((a, b) => (a.month < b.month ? -1 : a.month > b.month ? 1 : 0))
    return items
  } catch {
    return []
  }
})

function itemBarWidth(value) {
  if (!incomeHistory.value.length) {
    return 0
  }
  const max = Math.max(...incomeHistory.value.map(i => i.totalIncome))
  if (max <= 0) {
    return 0
  }
  const val = (value / max) * 100
  return Math.max(5, Math.min(100, Math.round(val)))
}

function getCurrentMonthKey() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function formatMonthLabel(key) {
  if (!key || typeof key !== 'string' || !key.includes('-')) {
    return ''
  }
  const [y, m] = key.split('-')
  const date = new Date(Number(y), Number(m) - 1, 1)
  return date.toLocaleDateString('id-ID', {
    month: 'short',
    year: 'numeric'
  })
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return
    }
    const parsed = JSON.parse(raw)
    const current = parsed[state.value.month]
    if (current) {
      state.value = {
        month: current.month,
        income: current.income || [],
        expenses: current.expenses || []
      }
    }
  } catch {
  }
}

function saveToStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    parsed[state.value.month] = {
      month: state.value.month,
      income: state.value.income,
      expenses: state.value.expenses
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
  } catch {
  }
}

function addIncome() {
  state.value.income.push({
    source: '',
    amount: 0
  })
}

function removeIncome(index) {
  if (state.value.income.length <= 1) {
    state.value.income = state.value.income.slice(0, 1)
    state.value.income[0].source = ''
    state.value.income[0].amount = 0
    return
  }
  state.value.income.splice(index, 1)
}

function addExpense() {
  state.value.expenses.push({
    type: 'Needs',
    category: '',
    amount: 0
  })
}

function removeExpense(index) {
  if (state.value.expenses.length <= 1) {
    state.value.expenses = state.value.expenses.slice(0, 1)
    state.value.expenses[0].type = 'Needs'
    state.value.expenses[0].category = ''
    state.value.expenses[0].amount = 0
    return
  }
  state.value.expenses.splice(index, 1)
}

function formatNumber(value) {
  const v = typeof value === 'number' ? value : 0
  return v.toLocaleString('id-ID', {
    maximumFractionDigits: 0
  })
}
</script>
