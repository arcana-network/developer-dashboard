type ToastMessage = {
  type: 'success' | 'error'
  message: string
  id: number
}

type ToastState = {
  messages: ToastMessage[]
}

const toastTimeout = 25300

const state: ToastState = {
  messages: [],
}

const getters = {
  toastMessages: (state: ToastState) => state.messages,
}

const mutations = {
  createToast(state: ToastState, message: ToastMessage) {
    state.messages.unshift(message)
  },
  removeToast(state: ToastState, message: ToastMessage) {
    state.messages = state.messages.filter((msg) => msg.id !== message.id)
  },
}

const actions = {
  showSuccessToast({ commit }, message: string) {
    const successToastMessage = {
      type: 'success',
      id: Date.now(),
      message,
      show: false,
    }
    commit('createToast', successToastMessage)
    setTimeout(() => commit('removeToast', successToastMessage), toastTimeout)
  },
  showErrorToast({ commit }, message: string) {
    const errorToastMessage = {
      type: 'error',
      id: Date.now(),
      message,
    }
    commit('createToast', errorToastMessage)
    setTimeout(() => commit('removeToast', errorToastMessage), toastTimeout)
  },
  closeToast({ commit }, toastMessage: ToastMessage) {
    commit('removeToast', toastMessage)
  },
}

const toastStore = {
  state: () => ({ ...state }),
  getters,
  mutations,
  actions,
}

export default toastStore

export type { ToastMessage }
