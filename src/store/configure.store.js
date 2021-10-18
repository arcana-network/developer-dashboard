const state = {
  region: {
    any: false,
    asia: false,
    africa: false,
    australia: false,
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
};

const getters = {
  region: (state) => state.region,
};

const mutations = {
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
  updateRegion({ commit }, region) {
    commit("updateRegion", region);
  },
};

export default {
  state: () => ({ ...state }),
  getters,
  mutations,
  actions,
};
