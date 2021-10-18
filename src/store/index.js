import { createStore, createLogger } from "vuex";
import configureStore from "./configure.store";

const debug = process.env.NODE_ENV !== "production";

const state = {
  env: "test",
  appName: "",
  onConfigChange: false,
};

const getters = {
  env: (state) => state.env,
  appName: (state) => state.appName,
  onConfigChange: (state) => state.onConfigChange,
};

const mutations = {
  toggleEnv(state) {
    state.env = state.env === "test" ? "live" : "test";
  },
  updateAppName(state, appName) {
    state.appName = appName;
  },
  configChangeDetected(state) {
    state.onConfigChange = true;
  },
  configChangeReset(state) {
    state.onConfigChange = false;
  },
};

const actions = {
  toggleEnv({ commit }) {
    commit("toggleEnv");
  },
  updateAppName({ commit }, appName) {
    commit("updateAppName", appName);
  },
  configChangeDetected({ commit }) {
    commit("configChangeDetected");
  },
  configChangeReset({ commit }) {
    commit("configChangeReset");
  },
};

const store = createStore({
  modules: {
    test: {
      namespaced: true,
      modules: {
        configureStore,
      },
    },
    live: {
      namespaced: true,
      modules: {
        configureStore,
      },
    },
  },
  state,
  mutations,
  actions,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

export default store;
