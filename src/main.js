import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VWave from "v-wave";
import "./components/lib/styles.css";
import "vue3-circle-progress/dist/circle-progress.css";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";
import { sentry as sentryConfig } from "./utils/constants";
import { Buffer } from "buffer";
import { Stream } from "stream-browserify";

window.global = window;
window.Buffer = window.Buffer || Buffer;
window.Stream = Stream;

const app = createApp(App);
// Sentry.init({
//   app,
//   dsn: sentryConfig.dsn,
//   integrations: [
//     new Integrations.BrowserTracing({
//       routingInstrumentation: Sentry.vueRouterInstrumentation(router),
//       tracingOrigins: sentryConfig.tracingOrigins,
//     }),
//   ],
//   tracesSampleRate: 1.0,
// });
app.use(router);
app.use(store);
app.use(VWave);
app.mount("#app");
