import { createApp } from "vue";
import VueGtag from "vue-gtag";
import VWave from "v-wave";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import { sentry as sentryConfig } from "./utils/constants";

import "vue3-circle-progress/dist/circle-progress.css";
import "./components/lib/styles.css";

function getDSN() {
  if (import.meta.env.PROD) {
    return sentryConfig.dsn;
  }
  return null;
}

const app = createApp(App);
Sentry.init({
  app,
  dsn: getDSN(),
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: sentryConfig.tracingOrigins,
    }),
  ],
  tracesSampleRate: 1.0,
});
app.use(router);
app.use(store);
app.use(VWave);

if (process.env.NODE_ENV === "production") {
  app.use(VueGtag, {
    config: { id: VITE_GOOGLE_ANALYTICS_ID },
  });
}

app.mount("#app");
