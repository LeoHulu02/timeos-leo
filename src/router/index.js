import Dashboard from '../pages/Dashboard.vue'
import Productivity from '../pages/Productivity.vue'
import TimeDistribution from '../pages/TimeDistribution.vue'
import Finance from '../pages/Finance.vue'
import ModelingProgress from '../pages/ModelingProgress.vue'

export default [
  { path: '/', component: Dashboard },
  { path: '/productivity', component: Productivity },
  { path: '/time-distribution', component: TimeDistribution },
  { path: '/finance', component: Finance },
  { path: '/modeling-progress', component: ModelingProgress }
]
