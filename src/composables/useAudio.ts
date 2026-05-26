import { ref, type Ref } from 'vue'

export interface AudioAPI {
  muted: Ref<boolean>
  playWin: (audioUrl: string) => void
  stopWin: () => void
}

export function useAudio(): AudioAPI {
  const muted = ref(false)
  let currentAudio: HTMLAudioElement | null = null

  function playWin(audioUrl: string) {
    if (muted.value || !audioUrl) return
    stopWin()
    try {
      currentAudio = new Audio(audioUrl)
      currentAudio.volume = 0.6
      currentAudio.onended = () => { currentAudio = null }
      currentAudio.play().catch(() => { currentAudio = null })
    } catch {}
  }

  function stopWin() {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      currentAudio = null
    }
  }

  return { muted, playWin, stopWin }
}
