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
      isUnlimited: true,
      limit: {
        value: 2,
        unit: "MB",
      },
    },
    bandwidth: {
      isUnlimited: true,
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
  isStorageUnlimited: (state) => state.userLimits.storage.isUnlimited,
  isBandwidthUnlimited: (state) => state.userLimits.bandwidth.isUnlimited,
  config: (state) => {
    let chain;
    let storage_limit, bandwidth_limit;
    if (state.userLimits.storage.isUnlimited) {
      storage_limit = bytes("10 TB");
    } else {
      storage_limit = bytes(
        state.userLimits.storage.limit.value +
          state.userLimits.storage.limit.unit
      );
    }
    if (state.userLimits.bandwidth.isUnlimited) {
      bandwidth_limit = bytes("10 TB");
    } else {
      bandwidth_limit = bytes(
        state.userLimits.bandwidth.limit.value +
          state.userLimits.bandwidth.limit.unit
      );
    }
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
        chain = 3;
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
  updateStorage(state, { unit = "MB", value = 2, isUnlimited }) {
    if (isUnlimited) {
      state.userLimits.storage.limit = { value, unit };
      state.userLimits.storage.isUnlimited = true;
    } else {
      state.userLimits.storage.limit = { value, unit };
      state.userLimits.storage.isUnlimited = false;
    }
  },
  updateBandwidth(state, { unit = "MB", value = 2, isUnlimited }) {
    if (isUnlimited) {
      state.userLimits.bandwidth.limit = { value, unit };
      state.userLimits.bandwidth.isUnlimited = true;
    } else {
      state.userLimits.bandwidth.limit = { value, unit };
      state.userLimits.bandwidth.isUnlimited = false;
    }
  },
  resetConfigStore(state) {
    state = {
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
          isUnlimited: true,
          limit: {
            value: "",
            unit: "",
          },
        },
        bandwidth: {
          isUnlimited: true,
          limit: {
            value: "",
            unit: "",
          },
        },
      },
      authDetails: [],
    };
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
  updateStorage({ commit }, { unit, value, isUnlimited }) {
    commit("updateStorage", { value, unit, isUnlimited });
  },
  updateBandwidth({ commit }, { unit, value, isUnlimited }) {
    commit("updateBandwidth", { value, unit, isUnlimited });
  },
  resetConfigStore({ commit }) {
    commit("resetConfigStore");
  },
};

export default {
  state: () => ({ ...state }),
  getters,
  mutations,
  actions,
};
