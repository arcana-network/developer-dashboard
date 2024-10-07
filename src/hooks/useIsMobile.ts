import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useIsMobile(threshold: number) {
  const isMobile = ref(false)

  const checkIsMobile = () => {
    isMobile.value = window.innerWidth <= threshold
  }

  onMounted(() => {
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkIsMobile)
  })

  return { isMobile }
}
