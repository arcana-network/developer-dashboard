type ToastMessage = {
  type: 'success' | 'error'
  message: string
  id: number
  show: boolean
}

type ToastState = {
  messages: ToastMessage[]
}

const toastTimeout = 5000
const timeToAnimateToast = 300
const timeToShowToast = 100
const timeToHideToast: number =
  timeToShowToast + timeToAnimateToast + toastTimeout
const timeToRemoveToast: number = timeToHideToast + timeToAnimateToast

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
  showToast(state: ToastState, message: ToastMessage) {
    const messageIndex = state.messages.findIndex(
      (msg) => msg.id === message.id
    )
    if (messageIndex > -1) {
      state.messages[messageIndex].show = true
    }
  },
  hideToast(state: ToastState, message: ToastMessage) {
    const messageIndex = state.messages.findIndex(
      (msg) => msg.id === message.id
    )
    if (messageIndex > -1) {
      state.messages[messageIndex].show = false
    }
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
    setTimeout(() => commit('showToast', successToastMessage), timeToShowToast)
    setTimeout(() => commit('hideToast', successToastMessage), timeToHideToast)
    setTimeout(
      () => commit('removeToast', successToastMessage),
      timeToRemoveToast
    )
  },
  showErrorToast({ commit }, message: string) {
    const errorToastMessage = {
      type: 'error',
      id: Date.now(),
      message,
    }
    commit('createToast', errorToastMessage)
    setTimeout(() => commit('showToast', errorToastMessage), timeToShowToast)
    setTimeout(() => commit('hideToast', errorToastMessage), timeToHideToast)
    setTimeout(
      () => commit('removeToast', errorToastMessage),
      timeToRemoveToast
    )
  },
  closeToast({ commit }, toastMessage: ToastMessage) {
    commit('hideToast', toastMessage)
    setTimeout(() => commit('removeToast', toastMessage), timeToAnimateToast)
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
