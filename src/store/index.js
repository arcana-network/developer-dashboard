import { createStore, createLogger } from "vuex";
import configureStore from "./configure.store";

const debug = process.env.NODE_ENV !== "production";

const state = {
  env: "test",
};

const getters = {
  env: (state) => state.env,
};

const mutations = {
  toggleEnv(state, isLive) {
    state.env = isLive === true ? "live" : "test";
  },
};

const actions = {
  toggleEnv({ commit }, { isLive }) {
    commit("toggleEnv", isLive);
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
