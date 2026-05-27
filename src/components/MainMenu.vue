<script setup lang="ts">
import { ref } from 'vue'
import { loadImageFromFile } from '../utils/imageLoader'
import { useAudio } from '../composables/useAudio'
import { MAX_GRID_SIZE, MIN_GRID_SIZE } from '../config'
import { nailongPresets } from '../presets'
import type { StartGamePayload, NailongImage } from '../types'

const audio = useAudio()

const emit = defineEmits<{
  start: [payload: StartGamePayload]
}>()

const selectedCols = ref(4)
const selectedRows = ref(4)
const customMode = ref(false)
const customCols = ref(4)
const customRows = ref(4)
const customError = ref('')
const imageMode = ref('preset')
const imageFile = ref<File | null>(null)
const imageUrl = ref('')
const errorMsg = ref('')
const loading = ref(false)

const presets = [
  { cols: 4, rows: 4 },
  { cols: 5, rows: 5 },
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
    return `Columns must be ${MIN_GRID_SIZE}–${MAX_GRID_SIZE}`
  }
  if (customRows.value < MIN_GRID_SIZE || customRows.value > MAX_GRID_SIZE) {
    return `Rows must be ${MIN_GRID_SIZE}–${MAX_GRID_SIZE}`
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
  errorMsg.value = ''
  customError.value = ''

  const { cols, rows } = getGridSize()
  if (customMode.value) {
    const err = validateCustom()
    if (err) {
      customError.value = err
      return
    }
  }

  loading.value = true

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
        <h1 class="title">naipuzzle</h1>
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

      <div class="menu-section">
        <label class="menu-label">Grid Size</label>
        <div class="size-selector">
          <button
            v-for="preset in presets"
            :key="`${preset.cols}x${preset.rows}`"
            class="size-btn"
            :class="{ active: !customMode && selectedCols === preset.cols && selectedRows === preset.rows }"
            @click="selectPreset(preset.cols, preset.rows)"
          >
            {{ preset.cols }}&times;{{ preset.rows }}
          </button>
          <button
            class="size-btn"
            :class="{ active: customMode }"
            @click="enableCustom"
          >
            Custom
          </button>
        </div>
        <div v-if="customMode" class="custom-row animate-fade-in">
          <input
            type="number"
            class="custom-input"
            v-model.number="customCols"
            :min="MIN_GRID_SIZE"
            :max="MAX_GRID_SIZE"
            placeholder="Cols"
          />
          <span class="custom-times">&times;</span>
          <input
            type="number"
            class="custom-input"
            v-model.number="customRows"
            :min="MIN_GRID_SIZE"
            :max="MAX_GRID_SIZE"
            placeholder="Rows"
          />
        </div>
        <div v-if="customError" class="error-msg">{{ customError }}</div>
      </div>

      <div class="menu-section">
        <label class="menu-label">Image Source</label>
        <div class="source-tabs">
          <button
            class="source-tab"
            :class="{ active: imageMode === 'preset' }"
            @click="imageMode = 'preset'"
          >Preset</button>
          <button
            class="source-tab"
            :class="{ active: imageMode === 'url' }"
            @click="imageMode = 'url'"
          >URL</button>
          <button
            class="source-tab"
            :class="{ active: imageMode === 'file' }"
            @click="imageMode = 'file'"
          >Upload</button>
        </div>

        <div v-if="imageMode === 'url'" class="url-input-row animate-fade-in">
          <input
            v-model="imageUrl"
            type="url"
            class="text-input"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div v-if="imageMode === 'file'" class="file-row animate-fade-in">
          <label class="file-label">
            <span>{{ imageFile ? imageFile.name : 'Choose image...' }}</span>
            <input type="file" accept="image/*" class="file-input-hidden" @change="onFileChange" />
          </label>
        </div>
      </div>

      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

      <button class="btn btn-primary btn-lg btn-full" :disabled="loading" @click="handleStart">
        {{ loading ? 'Loading...' : 'Start Game' }}
      </button>
    </div>
  </div>
</template>
<style scoped>
.main-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
  z-index: 1;
  padding: 24px;
}
.menu-card {
  width: 100%;
  max-width: 380px;
  padding: 32px 28px;
  background: rgba(var(--color-bg-rgb), var(--panel-opacity));
  backdrop-filter: blur(var(--panel-blur));
  -webkit-backdrop-filter: blur(var(--panel-blur));
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius);
}
.title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 4px;
}
.title {
  font-size: 32px;
  font-weight: 800;
  text-align: center;
  color: var(--color-text);
  letter-spacing: -0.5px;
  margin-bottom: 4px;
}
.subtitle {
  text-align: center;
  color: var(--color-text-dim);
  font-size: 14px;
  margin-bottom: 28px;
}
.btn-mute {
  position: absolute;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.08);
  color: var(--color-text-dim);
  transition: all var(--transition-fast);
}
.btn-mute:hover {
  background: rgba(255,255,255,0.14);
  color: var(--color-text);
}
.btn-mute.active {
  color: var(--color-primary);
  background: rgba(var(--color-primary-rgb), 0.15);
}
.menu-section {
  margin-bottom: 20px;
}
.menu-label {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-dim);
  margin-bottom: 10px;
  font-weight: 600;
}
.size-selector {
  display: flex;
  gap: 6px;
}
.size-btn {
  flex: 1;
  padding: 10px 0;
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.06);
  color: var(--color-text-dim);
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}
.size-btn:hover {
  background: rgba(255,255,255,0.1);
  color: var(--color-text);
}
.size-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
.custom-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}
.custom-input {
  width: 70px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--color-text);
  font-size: 14px;
  text-align: center;
  outline: none;
  font-variant-numeric: tabular-nums;
  -moz-appearance: textfield;
}
.custom-input::-webkit-outer-spin-button,
.custom-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.custom-input:focus {
  border-color: var(--color-primary);
}
.custom-times {
  color: var(--color-text-dim);
  font-size: 16px;
  font-weight: 600;
}
.source-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}
.source-tab {
  flex: 1;
  padding: 8px 0;
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.05);
  color: var(--color-text-dim);
  font-size: 13px;
  font-weight: 500;
  transition: all var(--transition-fast);
}
.source-tab:hover {
  background: rgba(255,255,255,0.1);
  color: var(--color-text);
}
.source-tab.active {
  background: var(--color-secondary);
  color: #fff;
}
.text-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--color-text);
  font-size: 14px;
  outline: none;
  transition: border-color var(--transition-fast);
}
.text-input:focus {
  border-color: var(--color-primary);
}
.file-row {
  margin-top: 8px;
}
.file-label {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  color: var(--color-text-dim);
  font-size: 14px;
  transition: border-color var(--transition-fast);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.file-label:hover {
  border-color: var(--color-primary);
}
.file-input-hidden {
  display: none;
}
.error-msg {
  padding: 10px 14px;
  margin-bottom: 16px;
  border-radius: var(--radius-sm);
  background: rgba(248,113,113,0.15);
  color: var(--color-error);
  font-size: 13px;
  text-align: center;
}
.mt-3 {
  margin-top: 12px;
}
</style>
