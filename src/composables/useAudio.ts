import { ref, type Ref } from 'vue'

export interface AudioAPI {
  muted: Ref<boolean>
  preloadWin: (audioUrl: string) => Promise<void>
  playWin: () => void
  stopWin: () => void
}

export function useAudio(): AudioAPI {
  const muted = ref(false)
  let audioContext: AudioContext | null = null
  let winBuffer: AudioBuffer | null = null

  function getContext(): AudioContext {
    if (!audioContext) {
      audioContext = new AudioContext()
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }
    return audioContext
  }

  async function preloadWin(audioUrl: string): Promise<void> {
    if (!audioUrl) return
    try {
      const response = await fetch(audioUrl)
      const arrayBuffer = await response.arrayBuffer()
      winBuffer = await getContext().decodeAudioData(arrayBuffer)
    } catch {
      winBuffer = null
    }
  }

  function playWin(): void {
    if (muted.value || !winBuffer) return
    try {
      const ctx = getContext()
      const source = ctx.createBufferSource()
      source.buffer = winBuffer
      source.connect(ctx.destination)
      source.start(0)
    } catch {}
  }

  function stopWin(): void {
    if (audioContext) {
      audioContext.suspend().catch(() => {})
    }
  }

  return { muted, preloadWin, playWin, stopWin }
}
