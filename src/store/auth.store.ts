type AuthState = {
  email: string
  accessToken: string
  name: string
  privateKey: string
  walletAddress: string
  publicKey: string
}

const state: AuthState = {
  email: '',
  accessToken: '',
  name: '',
  privateKey: '',
  walletAddress: '',
  publicKey: '',
}

const getters = {
  accessToken: (state: AuthState) => state.accessToken,
  keys: (state: AuthState) => {
    return {
      privateKey: state.privateKey,
    }
  },
  walletAddress: (state: AuthState) => state.walletAddress,
  userInfo: (state: AuthState) => {
    return {
      email: state.email,
      name: state.name,
    }
  },
}

const mutations = {
  updateAccessToken(state: AuthState, access_token: string) {
    state.accessToken = access_token
  },

  updateKeys(state: AuthState, { privateKey }: { privateKey: string }) {
    state.privateKey = privateKey
  },

  updateWalletAddress(state: AuthState, walletAddress: string) {
    state.walletAddress = walletAddress
  },

  updateUserInfo(
    state: AuthState,
    { name, email }: { name: string; email: string }
  ) {
    state.name = name
    state.email = email
  },
  resetAuth(state: AuthState) {
    state.name = ''
    state.email = ''
    state.walletAddress = ''
    state.privateKey = ''
    state.publicKey = ''
    state.accessToken = ''
  },
}

const actions = {
  updateAccessToken({ commit }, access_token: string) {
    commit('updateAccessToken', access_token)
  },

  updateKeys({ commit }, { privateKey }: { privateKey: string }) {
    commit('updateKeys', { privateKey })
  },

  updateWalletAddress({ commit }, walletAddress: string) {
    commit('updateWalletAddress', walletAddress)
  },

  updateUserInfo({ commit }, { name, email }: { name: string; email: string }) {
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
