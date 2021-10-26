const state = {
  email: "",
  accessToken: "",
  name: "",
  privateKey: "",
  walletAddress: "",
  publicKey: "",
};

const getters = {
  accessToken: (state) => state.accessToken,
  keys: (state) => {
    return {
      privateKey: state.privateKey,
      publicKey: state.publicKey,
    };
  },
  walletAddress: (state) => state.walletAddress,
  userInfo: (state) => {
    return {
      email: state.email,
      name: state.name,
    };
  },
};

const mutations = {
  updateAccessToken(state, access_token) {
    state.accessToken = access_token;
  },

  updateKeys(state, { privateKey, publicKey }) {
    state.privateKey = privateKey;
    state.publicKey = publicKey;
  },

  updateWalletAddress(state, walletAddress) {
    state.walletAddress = walletAddress;
  },

  updateUserInfo(state, { name, email }) {
    state.name = name;
    state.email = email;
  },
};

const actions = {
  updateAccessToken({ commit }, access_token) {
    commit("updateAccessToken", access_token);
  },

  updateKeys({ commit }, { privateKey, publicKey }) {
    commit("updateKeys", { privateKey, publicKey });
  },

  updateWalletAddress({ commit }, walletAddress) {
    commit("updateWalletAddress", walletAddress);
  },

  updateUserInfo({ commit }, { name, email }) {
    commit("updateUserInfo", { name, email });
  },
};

export default {
  state: () => ({ ...state }),
  getters,
  mutations,
  actions,
};
