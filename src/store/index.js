import { createStore, createLogger } from "vuex";
import configureStore from "./configure.store";
import authStore from "./auth.store";

const debug = process.env.NODE_ENV !== "production";

const state = {
  env: "test",
  appName: "",
  appId: null,
  onConfigChange: false,
  isAppConfigured: false,
};

const getters = {
  env: (state) => state.env,
  appName: (state) => state.appName,
  appId: (state) => state.appId,
  onConfigChange: (state) => state.onConfigChange,
  isAppConfigured: (state) => state.isAppConfigured,
};

const mutations = {
  toggleEnv(state) {
    state.env = state.env === "test" ? "live" : "test";
  },
  updateAppName(state, appName) {
    state.appName = appName;
  },
  updateAppId(state, appId) {
    state.appId = appId;
  },
  configChangeDetected(state) {
    state.onConfigChange = true;
  },
  configChangeReset(state) {
    state.onConfigChange = false;
  },
  updateAppConfigurationStatus(state, isAppConfigured) {
    state.isAppConfigured = isAppConfigured;
  },
};

const actions = {
  toggleEnv({ commit }) {
    commit("toggleEnv");
  },
  updateAppName({ commit }, appName) {
    commit("updateAppName", appName);
  },
  updateAppId({ commit }, appId) {
    commit("updateAppId", appId);
  },
  configChangeDetected({ commit }) {
    commit("configChangeDetected");
  },
  configChangeReset({ commit }) {
    commit("configChangeReset");
  },
  updateAppConfigurationStatus({ commit }, isAppConfigured) {
    commit("updateAppConfigurationStatus", isAppConfigured);
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
    authStore,
  },
  state,
  mutations,
  actions,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

export default store;
