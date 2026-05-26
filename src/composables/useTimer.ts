import { ref, watch, onUnmounted, type Ref } from 'vue'

export interface TimerAPI {
  elapsedSeconds: Ref<number>
  running: Ref<boolean>
  reset: () => void
}

export function useTimer(): TimerAPI {
  const elapsedSeconds = ref(0)
  const running = ref(false)
  let intervalId: ReturnType<typeof setInterval> | null = null

  watch(running, (val) => {
    if (val) {
      intervalId = setInterval(() => {
        elapsedSeconds.value++
      }, 1000)
    } else {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
  })

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })

  function reset() {
    elapsedSeconds.value = 0
    running.value = false
  }

  return { elapsedSeconds, running, reset }
}
