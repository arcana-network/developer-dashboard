const state = {
  email: '',
  accessToken: '',
  name: '',
  privateKey: '',
  walletAddress: '',
  publicKey: '',
}

const getters = {
  accessToken: (state) => state.accessToken,
  keys: (state) => {
    return {
      privateKey: state.privateKey,
    }
  },
  walletAddress: (state) => state.walletAddress,
  userInfo: (state) => {
    return {
      email: state.email,
      name: state.name,
    }
  },
}

const mutations = {
  updateAccessToken(state, access_token) {
    state.accessToken = access_token
  },

  updateKeys(state, { privateKey }) {
    state.privateKey = privateKey
  },

  updateWalletAddress(state, walletAddress) {
    state.walletAddress = walletAddress
  },

  updateUserInfo(state, { name, email }) {
    state.name = name
    state.email = email
  },
  resetAuth(state) {
    state.name = ''
    state.email = ''
    state.walletAddress = ''
    state.privateKey = ''
    state.publicKey = ''
    state.accessToken = ''
  },
}

const actions = {
  updateAccessToken({ commit }, access_token) {
    commit('updateAccessToken', access_token)
  },

  updateKeys({ commit }, { privateKey }) {
    commit('updateKeys', { privateKey })
  },

  updateWalletAddress({ commit }, walletAddress) {
    commit('updateWalletAddress', walletAddress)
  },

  updateUserInfo({ commit }, { name, email }) {
    commit('updateUserInfo', { name, email })
  },

  resetAuth({ commit }) {
    commit('resetAuth')
  },
}

const authStore = {
  state: () => ({ ...state }),
  getters,
  mutations,
  actions,
}

export default authStore
