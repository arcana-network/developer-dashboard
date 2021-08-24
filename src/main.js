import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VWave from "v-wave";
import "./components/lib/styles.css";
import "vue3-circle-progress/dist/circle-progress.css";

const app = createApp(App);
app.use(router);
app.use(store);
app.use(VWave);
app.mount("#app");
