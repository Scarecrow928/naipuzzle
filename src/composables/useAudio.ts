import { ref, type Ref } from 'vue'

const B = import.meta.env.BASE_URL
const S = "https://scarecrow928.com/naipuzzle/"

export interface AudioAPI {
  muted: Ref<boolean>
  toggleMute: () => void
  playWin: () => void
  stopWin: () => void
}

const muted = ref(true)

const bgm = new Audio(`${S}assets/bgm.m4a`)
bgm.loop = true
bgm.volume = 0

const win = new Audio(`${S}assets/laugh.m4a`)
win.preload = 'auto'

export function useAudio(): AudioAPI {

  function toggleMute() {
    if (muted.value) {
      muted.value = false
      bgm.volume = 1
      bgm.currentTime = 0
      bgm.play().catch(() => { })

      const prevVol = win.volume
      win.volume = 0
      win.play().then(() => { win.pause(); win.currentTime = 0; win.volume = prevVol }).catch(() => { })
    } else {
      muted.value = true
      bgm.pause()
      bgm.currentTime = 0
      bgm.volume = 0
      win.pause()
      win.currentTime = 0
    }
  }

  function playWin() {
    if (muted.value) return
    win.currentTime = 0
    win.play().catch(() => { })
  }

  function stopWin() {
    win.pause()
    win.currentTime = 0
  }

  return { muted, toggleMute, playWin, stopWin }
}
