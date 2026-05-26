<script setup lang="ts">
import { onMounted } from 'vue'
import { formatTime } from '../utils/format'

defineProps<{
  elapsedSeconds: number
  moves: number
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
      <div class="win-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <h2 class="win-title">Completed!</h2>
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
  background: rgba(0,0,0,0.4);
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
  padding: 40px 32px;
  text-align: center;
  min-width: 280px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.win-icon {
  margin-bottom: 16px;
}
.win-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 24px;
}
.win-stats {
  display: flex;
  gap: 32px;
  justify-content: center;
  margin-bottom: 28px;
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
