<script setup lang="ts">
import { ref } from 'vue'
import { loadImageFromFile } from '../utils/imageLoader'
import { useAudio } from '../composables/useAudio'
import { MAX_GRID_SIZE, MIN_GRID_SIZE } from '../config'
import { nailongPresets } from '../presets'
import type { StartGamePayload, NailongImage } from '../types'
import NailongHead from './NailongHead.vue'

const audio = useAudio()

const emit = defineEmits<{
  start: [payload: StartGamePayload]
}>()

const selectedCols = ref(3)
const selectedRows = ref(3)
const customMode = ref(false)
const customCols = ref(4)
const customRows = ref(4)
const customError = ref('')
const imageMode = ref('preset')
const imageFile = ref<File | null>(null)
const imageUrl = ref('')
const errorMsg = ref('')
const loading = ref(false)
const showCredits = ref(false)

const presets = [
  { cols: 3, rows: 3 },
  { cols: 4, rows: 4 },
]

function selectPreset(cols: number, rows: number) {
  customMode.value = false
  selectedCols.value = cols
  selectedRows.value = rows
  customError.value = ''
}

function enableCustom() {
  customMode.value = true
  customError.value = ''
}

function validateCustom(): string | null {
  if (customCols.value < MIN_GRID_SIZE || customCols.value > MAX_GRID_SIZE) {
    return `列数须为 ${MIN_GRID_SIZE}–${MAX_GRID_SIZE}`
  }
  if (customRows.value < MIN_GRID_SIZE || customRows.value > MAX_GRID_SIZE) {
    return `行数须为 ${MIN_GRID_SIZE}–${MAX_GRID_SIZE}`
  }
  return null
}

function getGridSize() {
  if (customMode.value) {
    return { cols: customCols.value, rows: customRows.value }
  }
  return { cols: selectedCols.value, rows: selectedRows.value }
}

function randomPick(presets: NailongImage[]): NailongImage {
  return presets[Math.floor(Math.random() * presets.length)]
}

function makeImage(url: string): NailongImage {
  return { displayName: '', imageUrl: url, description: '', audioUrl: '' }
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  imageFile.value = target.files?.[0] || null
  errorMsg.value = ''
}

async function handleStart() {
  loading.value = true
  errorMsg.value = ''
  customError.value = ''

  const { cols, rows } = getGridSize()
  if (customMode.value) {
    const err = validateCustom()
    if (err) {
      customError.value = err
      loading.value = false
      return
    }
  }

  try {
    let nailong: NailongImage
    let ratio = 0

    if (imageMode.value === 'file' && imageFile.value) {
      const result = await loadImageFromFile(imageFile.value)
      ratio = result.ratio
      nailong = makeImage(result.url)
    } else if (imageMode.value === 'url' && imageUrl.value.trim()) {
      nailong = makeImage(imageUrl.value.trim())
    } else {
      nailong = randomPick(nailongPresets)
    }

    emit('start', { columns: cols, rows, nailong, imageRatio: ratio })
  } catch (err) {
    errorMsg.value = (err as Error).message
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="main-menu animate-fade-in">
    <div class="menu-card">
      <div class="title-row">
        <h1 class="title">奶拼</h1>
        <button class="btn-mute" :class="{ active: !audio.muted.value }" @click="audio.toggleMute()">
          <svg v-if="audio.muted.value" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/>
            <line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        </button>
      </div>
      <p class="subtitle">naipuzzle</p>

      <div class="menu-section">
        <label class="menu-label">拼图尺寸</label>
        <div class="size-selector">
          <button v-for="preset in presets" :key="`${preset.cols}x${preset.rows}`" class="size-btn" :class="{ active: !customMode && selectedCols === preset.cols && selectedRows === preset.rows }" @click="selectPreset(preset.cols, preset.rows)">{{ preset.cols }}&times;{{ preset.rows }}</button>
          <button class="size-btn" :class="{ active: customMode }" @click="enableCustom"          >自定义</button>
        </div>
        <div v-if="customMode" class="custom-row animate-fade-in">
          <input type="number" class="custom-input" v-model.number="customCols" :min="MIN_GRID_SIZE" :max="MAX_GRID_SIZE" placeholder="列" />
          <span class="custom-times">&times;</span>
          <input type="number" class="custom-input" v-model.number="customRows" :min="MIN_GRID_SIZE" :max="MAX_GRID_SIZE" placeholder="行" />
        </div>
        <div v-if="customError" class="error-msg">{{ customError }}</div>
      </div>

      <div class="menu-section">
        <label class="menu-label">图片来源</label>
        <div class="source-tabs">
          <button class="source-tab" :class="{ active: imageMode === 'preset' }" @click="imageMode = 'preset'"          >预设</button>
          <button class="source-tab" :class="{ active: imageMode === 'url' }" @click="imageMode = 'url'"          >网址</button>
          <button class="source-tab" :class="{ active: imageMode === 'file' }" @click="imageMode = 'file'"          >上传</button>
        </div>
        <div v-if="imageMode === 'url'" class="url-input-row animate-fade-in">
          <input v-model="imageUrl" type="url" class="text-input" placeholder="https://example.com/image.jpg" />
        </div>
        <div v-if="imageMode === 'file'" class="file-row animate-fade-in">
          <label class="file-label"><span>{{ imageFile ? imageFile.name : '选择图片...' }}</span><input type="file" accept="image/*" class="file-input-hidden" @change="onFileChange" /></label>
        </div>
      </div>

      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

      <button class="btn btn-primary btn-lg btn-full" :disabled="loading" @click="handleStart">
        <span v-if="loading" class="spinner"></span>{{ loading ? '加载中...' : '开始游戏' }}
      </button>

      <div class="nailong-trigger" @click="showCredits = true">
        <NailongHead size="48px"/>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="showCredits" class="credits-overlay" @click.self="showCredits = false">
      <div class="credits-card animate-fade-in-scale">
        <h3 class="credits-title">链接</h3>
        <a class="credits-link" href="https://github.com/Scarecrow928/naipuzzle" target="_blank" rel="noopener">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          Scarecrow928/naipuzzle
        </a>
        <p class="credits-footer">图片素材来源于全民制作人</p>
      </div>
    </div>
  </Teleport>
</template>
<style scoped>
.main-menu { display: flex; align-items: center; justify-content: center; height: 100%; position: relative; z-index: 1; padding: 24px; }
.menu-card { width: 100%; max-width: 380px; padding: 32px 28px; background: rgba(var(--color-bg-rgb), var(--panel-opacity)); backdrop-filter: blur(var(--panel-blur)); -webkit-backdrop-filter: blur(var(--panel-blur)); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius); }
.title-row { display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 4px; }
.title { font-size: 32px; font-weight: 800; text-align: center; color: var(--color-text); letter-spacing: -0.5px; margin-bottom: 4px; }
.subtitle { text-align: center; color: var(--color-text-dim); font-size: 14px; margin-bottom: 28px; }
.btn-mute { position: absolute; right: 0; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.08); color: var(--color-text-dim); transition: all var(--transition-fast); }
.btn-mute:hover { background: rgba(255,255,255,0.14); color: var(--color-text); }
.btn-mute.active { color: var(--color-primary); background: rgba(var(--color-primary-rgb), 0.15); }
.menu-section { margin-bottom: 20px; }
.menu-label { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-text-dim); margin-bottom: 10px; font-weight: 600; }
.size-selector { display: flex; gap: 6px; }
.size-btn { flex: 1; padding: 10px 0; border-radius: var(--radius-sm); background: rgba(255,255,255,0.06); color: var(--color-text-dim); font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; transition: all var(--transition-fast); border: 1px solid transparent; }
.size-btn:hover { background: rgba(255,255,255,0.1); color: var(--color-text); }
.size-btn.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.custom-row { display: flex; align-items: center; gap: 8px; margin-top: 10px; }
.custom-input { width: 70px; padding: 8px 10px; border-radius: var(--radius-sm); background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text); font-size: 14px; text-align: center; outline: none; font-variant-numeric: tabular-nums; -moz-appearance: textfield; }
.custom-input::-webkit-outer-spin-button, .custom-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.custom-input:focus { border-color: var(--color-primary); }
.custom-times { color: var(--color-text-dim); font-size: 16px; font-weight: 600; }
.source-tabs { display: flex; gap: 4px; margin-bottom: 12px; }
.source-tab { flex: 1; padding: 8px 0; border-radius: var(--radius-sm); background: rgba(255,255,255,0.05); color: var(--color-text-dim); font-size: 13px; font-weight: 500; transition: all var(--transition-fast); }
.source-tab:hover { background: rgba(255,255,255,0.1); color: var(--color-text); }
.source-tab.active { background: var(--color-secondary); color: #fff; }
.text-input { width: 100%; padding: 10px 14px; border-radius: var(--radius-sm); background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text); font-size: 14px; outline: none; transition: border-color var(--transition-fast); }
.text-input:focus { border-color: var(--color-primary); }
.file-row { margin-top: 8px; }
.file-label { display: flex; align-items: center; padding: 10px 14px; border-radius: var(--radius-sm); background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); cursor: pointer; color: var(--color-text-dim); font-size: 14px; transition: border-color var(--transition-fast); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.file-label:hover { border-color: var(--color-primary); }
.file-input-hidden { display: none; }
.error-msg { padding: 10px 14px; margin-bottom: 16px; border-radius: var(--radius-sm); background: rgba(248,113,113,0.15); color: var(--color-error); font-size: 13px; text-align: center; }
.mt-3 { margin-top: 12px; }
.spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 8px; vertical-align: middle; }
@keyframes spin { to { transform: rotate(360deg); } }
.nailong-trigger { display: flex; justify-content: center; margin-top: 28px; cursor: pointer; transition: transform var(--transition-fast); }
.nailong-trigger:hover { transform: scale(1.08); }
.credits-overlay { position: fixed; inset: 0; z-index: 60; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.credits-card { background: rgba(var(--color-bg-rgb), 0.9); border: 1px solid rgba(255,255,255,0.12); border-radius: var(--radius); padding: 32px; text-align: center; min-width: 240px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
.credits-title { font-size: 18px; font-weight: 700; color: var(--color-text); margin-bottom: 20px; }
.credits-link { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: var(--color-text); text-decoration: none; transition: opacity var(--transition-fast); }
.credits-link:hover { opacity: 0.7; }
.credits-footer { font-size: 12px; color: var(--color-text-dim); margin-top: 16px; }
</style>
