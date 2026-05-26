import { ref, type Ref } from 'vue'

export interface AudioAPI {
  muted: Ref<boolean>
  playWin: () => void
}

export function useAudio(): AudioAPI {
  const muted = ref(false)

  function playWin() {
    if (muted.value) return
    try {
      const audio = new Audio('/assets/win.mp3')
      audio.volume = 0.6
      audio.play().catch(() => {})
    } catch {}
  }

  return { muted, playWin }
}
