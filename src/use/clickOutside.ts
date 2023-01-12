import { onBeforeUnmount, onMounted } from 'vue'

function useClickOutside(el: any, callback: () => any) {
  if (!el) return

  function handleOutsideClick(ev: any) {
    if (ev.target === el || ev.composedPath().includes(el.value)) {
      return
    }

    callback()
  }

  onMounted(() => {
    window.addEventListener('click', handleOutsideClick)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('click', handleOutsideClick)
  })

  return {
    handleOutsideClick,
  }
}

export { useClickOutside }
