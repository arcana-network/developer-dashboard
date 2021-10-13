const state = {
  appName: "",
  region: {
    any: false,
    asia: false,
    africa: false,
    austrialia: false,
    europe: false,
    northAmerica: false,
    southAmerica: false,
  },
  chainType: "",
  loginTypes: [],
  userLimits: {
    storage: {
      isUnlimited: false,
      limit: {
        value: 2,
        unit: "MB",
      },
    },
    bandwidth: {
      isUnlimited: false,
      limit: {
        value: 2,
        unit: "MB",
      },
    },
  },
  onChange: false,
};

const getters = {
  appName: (state) => state.appName,
  region: (state) => state.region,
  onChange: (state) => state.onChange,
};

const mutations = {
  updateAppName(state, appName) {
    state.appName = appName;
  },
  changeDetected(state) {
    state.onChange = true;
  },
  changeReset(state) {
    state.onChange = false;
  },
  updateRegion(
    state,
    { any, asia, africa, austrialia, europe, northAmerica, southAmerica }
  ) {
    state.region = {
      any,
      asia,
      africa,
      austrialia,
      europe,
      northAmerica,
      southAmerica,
    };
  },
};

const actions = {
  updateAppName({ commit }, { appName }) {
    commit("updateAppName", appName);
  },
  changeDetected({ commit }) {
    commit("changeDetected");
  },
  changeReset({ commit }) {
    commit("changeReset");
  },
  updateRegion({ commit }, { region }) {
    commit("updateRegion", region);
  },
};

export default {
  state: () => ({ ...state }),
  getters,
  mutations,
  actions,
};
