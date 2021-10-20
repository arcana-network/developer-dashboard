import bytes from "bytes";

const state = {
  region: {
    any: true,
    asia: false,
    africa: false,
    australia: false,
    europe: false,
    northAmerica: false,
    southAmerica: false,
  },
  chainType: "",
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
  authDetails: [],
};

const getters = {
  region: (state) => state.region,
  chainType: (state) => state.chainType,
  authDetails: (state) => state.authDetails,
  storage: (state) => state.userLimits.storage.limit,
  bandwidth: (state) => state.userLimits.bandwidth.limit,
  config: (state) => {
    let chain;
    const storage_limit = bytes(
      state.userLimits.storage.limit.value + state.userLimits.storage.limit.unit
    );
    const bandwidth_limit = bytes(
      state.userLimits.bandwidth.limit.value +
        state.userLimits.bandwidth.limit.unit
    );
    switch (state.chainType) {
      case "ethereum":
        chain = 0;
        break;
      case "polygon":
        chain = 1;
        break;
      case "binance":
        chain = 2;
        break;
      default:
        chain = null;
    }

    return {
      region: 0,
      chain,
      cred: state.authDetails.map((authDetail) => {
        return {
          verifier: authDetail.verifier,
          clientId: authDetail.clientId,
          clientSecret: authDetail.clientSecret,
          redirectUrl: authDetail.redirectUrl,
        };
      }),
      storage_limit,
      bandwidth_limit,
    };
  },
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

  updateChainType(state, chainType) {
    state.chainType = chainType;
  },
  updateAuthDetails(state, authDetails) {
    state.authDetails = [...authDetails];
  },
  updateStorage(state, { unit, value }) {
    state.userLimits.storage.limit = { value, unit };
  },
  updateBandwidth(state, { unit, value }) {
    state.userLimits.bandwidth.limit = { value, unit };
  },
};

const actions = {
  updateRegion({ commit }, region) {
    commit("updateRegion", region);
  },

  updateChainType({ commit }, chainType) {
    commit("updateChainType", chainType);
  },

  updateAuthDetails({ commit }, authDetails) {
    commit("updateAuthDetails", authDetails);
  },
  updateStorage({ commit }, { unit, value }) {
    commit("updateStorage", { value, unit });
  },
  updateBandwidth({ commit }, { unit, value }) {
    commit("updateBandwidth", { value, unit });
  },
};

export default {
  state: () => ({ ...state }),
  getters,
  mutations,
  actions,
};
