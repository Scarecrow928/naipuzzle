import { ref, type Ref } from 'vue'

const B = import.meta.env.BASE_URL

export interface AudioAPI {
  muted: Ref<boolean>
  toggleMute: () => Promise<void>
  playWin: () => void
  stopAll: () => void
}

export function useAudio(): AudioAPI {
  const muted = ref(true)
  let audioContext: AudioContext | null = null
  let bgmBuffer: AudioBuffer | null = null
  let winBuffer: AudioBuffer | null = null
  let bgmTimer: ReturnType<typeof setTimeout> | null = null
  let bgmSource: AudioBufferSourceNode | null = null
  let loaded = false

  function getContext(): AudioContext {
    if (!audioContext) {
      audioContext = new AudioContext()
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }
    return audioContext
  }

  function unlockIOS() {
    const ctx = getContext()
    const buf = ctx.createBuffer(1, 1, 22050)
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.connect(ctx.destination)
    src.start(0)
    src.stop(ctx.currentTime + 0.01)
  }

  async function loadBuffers() {
    try {
      const [bgmResp, winResp] = await Promise.all([
        fetch(`${B}assets/bgm.m4a`),
        fetch(`${B}assets/laugh.m4a`),
      ])
      const ctx = getContext()
      const [bgmData, winData] = await Promise.all([
        bgmResp.arrayBuffer(),
        winResp.arrayBuffer(),
      ])
      bgmBuffer = await ctx.decodeAudioData(bgmData)
      winBuffer = await ctx.decodeAudioData(winData)
      loaded = true
    } catch {
      loaded = false
    }
  }

  function playBgm() {
    if (!bgmBuffer || muted.value || !audioContext) return
    try {
      if (bgmSource) { try { bgmSource.stop() } catch {} bgmSource = null }
      const source = audioContext.createBufferSource()
      source.buffer = bgmBuffer
      source.connect(audioContext.destination)
      source.start(0)
      bgmSource = source
      source.onended = () => {
        bgmSource = null
        if (!muted.value) {
          bgmTimer = setTimeout(playBgm, 1000)
        }
      }
    } catch {}
  }

  function stopBgm() {
    if (bgmTimer) {
      clearTimeout(bgmTimer)
      bgmTimer = null
    }
    if (bgmSource) {
      try { bgmSource.stop() } catch {}
      bgmSource = null
    }
  }

  async function toggleMute() {
    if (muted.value) {
      muted.value = false
      unlockIOS()
      if (!loaded) {
        await loadBuffers()
      }
      playBgm()
    } else {
      muted.value = true
      stopBgm()
      if (audioContext) {
        await audioContext.suspend()
      }
    }
  }

  function playWin() {
    if (muted.value || !winBuffer || !audioContext) return
    try {
      const source = audioContext.createBufferSource()
      source.buffer = winBuffer
      source.connect(audioContext.destination)
      source.start(0)
    } catch {}
  }

  function stopAll() {
    stopBgm()
    if (audioContext) {
      audioContext.suspend().catch(() => {})
    }
  }

  return { muted, toggleMute, playWin, stopAll }
}
