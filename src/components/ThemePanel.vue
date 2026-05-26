<script setup lang="ts">
import { ref, inject } from 'vue'
import { ThemeKey, type ThemeAPI } from '../types'

const theme = inject<ThemeAPI>(ThemeKey)

const emit = defineEmits<{
  close: []
}>()

const presetBgUrl = ref('')
const panelOpacity = ref(0.15)
const panelBlur = ref(20)

const presetNames = Object.keys(theme?.presets ?? {})

import { onMounted } from 'vue'

onMounted(() => {
  syncFromCSS()
})

function syncFromCSS() {
  const opacity = getComputedStyle(document.documentElement).getPropertyValue('--panel-opacity').trim()
  const blur = getComputedStyle(document.documentElement).getPropertyValue('--panel-blur').trim()
  if (opacity) panelOpacity.value = parseFloat(opacity)
  if (blur) panelBlur.value = parseInt(blur)
}

function hexToRgb(hex: string): string {
  hex = hex.replace('#', '')
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

function handleBgFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  theme?.setBgImage(url)
}

function handleBgUrlApply() {
  const url = presetBgUrl.value.trim()
  if (!url) return
  theme?.setBgImage(url)
}

function onOpacityInput(e: Event) {
  const target = e.target as HTMLInputElement
  panelOpacity.value = parseFloat(target.value)
  theme?.setCustomVar('--panel-opacity', target.value)
}

function onBlurInput(e: Event) {
  const target = e.target as HTMLInputElement
  panelBlur.value = parseInt(target.value)
  theme?.setCustomVar('--panel-blur', target.value + 'px')
}

function selectPreset(name: string) {
  theme?.applyPreset(name)
  setTimeout(syncFromCSS, 50)
}
</script>
<template>
  <Teleport to="body">
    <div class="theme-panel-overlay" @click.self="$emit('close')">
      <div class="theme-panel animate-fade-in-up">
        <div class="theme-panel-header">
          <h2>Theme</h2>
          <button class="btn-close" @click="$emit('close')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="theme-section">
          <label class="theme-label">Preset</label>
          <div class="preset-grid">
            <button
              v-for="name in presetNames"
              :key="name"
              class="preset-btn"
              :class="{ active: theme?.currentPreset.value === name }"
              @click="selectPreset(name)"
            >
              {{ name.charAt(0).toUpperCase() + name.slice(1) }}
            </button>
          </div>
        </div>

        <div class="theme-section">
          <label class="theme-label">Primary Color</label>
          <div class="color-row">
            <input
              type="color"
              class="color-input"
              :value="theme?.presets[theme?.currentPreset.value]?.['--color-primary'] || '#6366f1'"
              @input="theme?.setCustomVar('--color-primary', ($event.target as HTMLInputElement).value); theme?.setCustomVar('--color-primary-rgb', hexToRgb(($event.target as HTMLInputElement).value))"
            />
            <span class="color-value">{{ theme?.presets[theme?.currentPreset.value]?.['--color-primary'] || '#6366f1' }}</span>
          </div>
        </div>

        <div class="theme-section">
          <label class="theme-label">Secondary Color</label>
          <div class="color-row">
            <input
              type="color"
              class="color-input"
              :value="theme?.presets[theme?.currentPreset.value]?.['--color-secondary'] || '#a78bfa'"
              @input="theme?.setCustomVar('--color-secondary', ($event.target as HTMLInputElement).value); theme?.setCustomVar('--color-secondary-rgb', hexToRgb(($event.target as HTMLInputElement).value))"
            />
            <span class="color-value">{{ theme?.presets[theme?.currentPreset.value]?.['--color-secondary'] || '#a78bfa' }}</span>
          </div>
        </div>

        <div class="theme-section">
          <label class="theme-label">Background Color</label>
          <div class="color-row">
            <input
              type="color"
              class="color-input"
              :value="theme?.presets[theme?.currentPreset.value]?.['--color-bg'] || '#0f0f14'"
              @input="theme?.setCustomVar('--color-bg', ($event.target as HTMLInputElement).value); theme?.setCustomVar('--color-bg-rgb', hexToRgb(($event.target as HTMLInputElement).value))"
            />
            <span class="color-value">{{ theme?.presets[theme?.currentPreset.value]?.['--color-bg'] || '#0f0f14' }}</span>
          </div>
        </div>

        <div class="theme-section">
          <label class="theme-label">Background Image URL</label>
          <div class="input-row">
            <input v-model="presetBgUrl" type="text" class="text-input" placeholder="https://..." />
            <button class="btn btn-secondary btn-sm" @click="handleBgUrlApply">Apply</button>
          </div>
        </div>

        <div class="theme-section">
          <label class="theme-label">Background Image File</label>
          <input type="file" accept="image/*" class="file-input" @change="handleBgFileUpload" />
        </div>

        <div class="theme-section">
          <label class="theme-label">Panel Opacity: {{ Math.round(panelOpacity * 100) }}%</label>
          <input
            type="range"
            min="0"
            max="0.6"
            step="0.01"
            class="range-input"
            :value="panelOpacity"
            @input="onOpacityInput"
          />
        </div>

        <div class="theme-section">
          <label class="theme-label">Blur: {{ panelBlur }}px</label>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            class="range-input"
            :value="panelBlur"
            @input="onBlurInput"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped>
.theme-panel-overlay {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  justify-content: flex-end;
  background: rgba(0,0,0,0.3);
}
.theme-panel {
  width: min(100vw, 360px);
  height: 100%;
  overflow-y: auto;
  background: var(--color-bg);
  border-left: 1px solid rgba(255,255,255,0.1);
  padding: 24px 20px;
  color: var(--color-text);
}
.theme-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.theme-panel-header h2 {
  font-size: 20px;
  font-weight: 700;
}
.btn-close {
  background: none;
  color: var(--color-text-dim);
  padding: 4px;
  border-radius: 6px;
  transition: color var(--transition-fast);
}
.btn-close:hover {
  color: var(--color-text);
}
.theme-section {
  margin-bottom: 20px;
}
.theme-label {
  display: block;
  font-size: 13px;
  color: var(--color-text-dim);
  margin-bottom: 8px;
  font-weight: 500;
}
.preset-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.preset-btn {
  padding: 8px 4px;
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.06);
  color: var(--color-text-dim);
  font-size: 13px;
  font-weight: 500;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}
.preset-btn:hover {
  background: rgba(255,255,255,0.1);
  color: var(--color-text);
}
.preset-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
.color-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.color-input {
  width: 40px;
  height: 36px;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  background: none;
  padding: 2px;
}
.color-value {
  font-size: 13px;
  color: var(--color-text-dim);
  font-variant-numeric: tabular-nums;
}
.input-row {
  display: flex;
  gap: 8px;
}
.text-input {
  flex: 1;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--color-text);
  font-size: 13px;
  outline: none;
  transition: border-color var(--transition-fast);
}
.text-input:focus {
  border-color: var(--color-primary);
}
.file-input {
  font-size: 13px;
  color: var(--color-text-dim);
}
.range-input {
  width: 100%;
  accent-color: var(--color-primary);
}
.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
  white-space: nowrap;
}
</style>
