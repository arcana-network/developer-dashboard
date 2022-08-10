import { Integrations } from '@sentry/tracing'
import { init as SentryInit, vueRouterInstrumentation } from '@sentry/vue'
import { createPinia } from 'pinia'
import VWave from 'v-wave'
import { createApp } from 'vue'
import VueGtag from 'vue-gtag'

import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import constants from '@/utils/constants'

import 'vue3-circle-progress/dist/circle-progress.css'
import '@/components/lib/styles.css'

const sentryConfig = constants.sentry

function getDSN() {
  if (import.meta.env.PROD) {
    return sentryConfig.dsn
  }
  sentryConfig.tracingOrigins = []
  return null
}

const app = createApp(App)
SentryInit({
  app,
  dsn: getDSN(),
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: vueRouterInstrumentation(router),
      tracingOrigins: sentryConfig.tracingOrigins,
    }),
  ],
  tracesSampleRate: 1.0,
})
app.use(router)
app.use(createPinia())
app.use(store)
app.use(VWave)

if (import.meta.env.PROD) {
  app.use(VueGtag, {
    config: { id: import.meta.env.VITE_GOOGLE_ANALYTICS_ID },
  })
}

app.mount('#app')
