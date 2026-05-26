<script setup lang="ts">
import { onMounted } from 'vue'
import { formatTime } from '../utils/format'
import type { NailongImage } from '../types'

defineProps<{
  elapsedSeconds: number
  moves: number
  currentImage: NailongImage
}>()

defineEmits<{
  'back-to-menu': []
}>()

onMounted(() => {
  // placeholder for audio
})
</script>
<template>
  <div class="win-overlay animate-fade-in">
    <div class="win-glow animate-win-pulse"></div>
    <div class="win-card animate-fade-in-scale">
      <img
        v-if="currentImage.imageUrl"
        class="win-image"
        :src="currentImage.imageUrl"
        alt="Completed puzzle"
      />
      <h2 class="win-title">Completed!</h2>
      <p v-if="currentImage.displayName" class="win-name">{{ currentImage.displayName }}</p>
      <div class="win-stats">
        <div class="win-stat">
          <span class="win-stat-label">Time</span>
          <span class="win-stat-value">{{ formatTime(elapsedSeconds) }}</span>
        </div>
        <div class="win-stat">
          <span class="win-stat-label">Moves</span>
          <span class="win-stat-value">{{ moves }}</span>
        </div>
      </div>
      <button class="btn btn-primary" @click="$emit('back-to-menu')">Back to Menu</button>
    </div>
  </div>
</template>
<style scoped>
.win-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.win-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(var(--color-primary-rgb), 0.15) 0%, transparent 70%);
  pointer-events: none;
}
.win-card {
  position: relative;
  background: rgba(var(--color-bg-rgb), 0.9);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius);
  padding: 32px;
  text-align: center;
  max-width: 360px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.win-image {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: var(--radius-sm);
  margin-bottom: 20px;
  border: 1px solid rgba(255,255,255,0.1);
}
.win-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 4px;
}
.win-name {
  font-size: 14px;
  color: var(--color-text-dim);
  margin-bottom: 20px;
}
.win-stats {
  display: flex;
  gap: 32px;
  justify-content: center;
  margin-bottom: 24px;
}
.win-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.win-stat-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-dim);
}
.win-stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
}
</style>
