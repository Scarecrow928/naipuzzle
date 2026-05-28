<script setup lang="ts">
import { ref } from 'vue'
import { formatTime } from '../utils/format'
import { gridIndexToRowCol } from '../utils/puzzleMath'
import type { HeldPiece, NailongImage } from '../types'

const props = defineProps<{
  elapsedSeconds: number
  moves: number
  heldPiece: HeldPiece | null
  currentImage: NailongImage
  gridColumns: number
  gridRows: number
  isDragging?: boolean
}>()

const emit = defineEmits<{
  restart: []
  'back-to-menu': []
  'cancel-hold': []
}>()

const showConfirm = ref(false)

function confirmBack() {
  showConfirm.value = true
}

function doBack() {
  showConfirm.value = false
  emit('back-to-menu')
}

function cancelBack() {
  showConfirm.value = false
}

function heldPieceStyle() {
  if (!props.heldPiece || !props.currentImage.imageUrl) return {}
  const pieceId = props.heldPiece.pieceId
  const cols = props.gridColumns
  const rows = props.gridRows
  const { row, col } = gridIndexToRowCol(pieceId - 1, cols)
  const pctX = (col / (cols - 1)) * 100
  const pctY = (row / (rows - 1)) * 100
  return {
    backgroundImage: `url(${props.currentImage.imageUrl})`,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${pctX}% ${pctY}%`,
  }
}
</script>
<template>
  <div class="top-bar">
    <div class="top-bar-inner">
      <span class="image-name">{{ currentImage.displayName }}</span>
      <div class="stat">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>{{ formatTime(elapsedSeconds) }}</span>
      </div>
      <div class="stat stat-moves">
        <span>🦶{{ moves }}</span>
      </div>
      <div class="held-slot">
        <div v-if="heldPiece" class="held-indicator">
          <div class="held-thumb" :style="heldPieceStyle()"></div>
          <span v-if="isDragging" class="held-label dragging">↔️</span>
          <span v-else class="held-label">{{ heldPiece.pieceId }}</span>
          <button v-if="!isDragging" title="Cancel" class="btn btn-ghost btn-xs" @click="$emit('cancel-hold')">✕</button>
        </div>
      </div>
      <div class="actions">
        <button title="Restart" class="btn btn-secondary btn-sm" @click="$emit('restart')">↺</button>
        <button title="Menu" class="btn btn-ghost btn-sm" @click="confirmBack">☰</button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showConfirm" class="confirm-overlay" @click.self="cancelBack">
        <div class="confirm-dialog animate-fade-in-scale">
          <p>Current progress will be lost.<br>Return to menu?</p>
          <div class="confirm-actions">
            <button class="btn btn-secondary" @click="cancelBack">Cancel</button>
            <button class="btn btn-danger" @click="doBack">Yes, leave</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
<style scoped>
.top-bar {
  padding: 8px 16px 4px;
  z-index: 10;
  position: relative;
  flex-shrink: 0;
}
.top-bar-inner {
  display: grid;
  grid-template-columns: auto auto auto 1fr auto;
  align-items: center;
  gap: 8px;
  max-width: 500px;
  margin: 0 auto;
  padding: 6px 12px;
  background: rgba(var(--color-bg-rgb), var(--panel-opacity));
  backdrop-filter: blur(var(--panel-blur));
  -webkit-backdrop-filter: blur(var(--panel-blur));
  border-radius: var(--radius);
  border: 1px solid rgba(255,255,255,0.08);
}
.image-name {
  font-size: 12px;
  color: var(--color-text-dim);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}
.held-slot {
  min-width: 0;
}
.held-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}
.image-name {
  font-size: 12px;
  color: var(--color-text-dim);
  font-weight: 500;
  white-space: nowrap;
}
.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-dim);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}
.stat span {
  color: var(--color-text);
  font-weight: 500;
}
.held-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}
.held-thumb {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  flex-shrink: 0;
}
.held-label {
  font-size: 11px;
  color: var(--color-primary);
  font-weight: 600;
  white-space: nowrap;
}
.held-label.dragging {
  color: var(--color-success);
}
.actions {
  display: flex;
  gap: 4px;
}
.btn-xs {
  padding: 3px 8px;
  font-size: 11px;
}
.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}
.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
}
.confirm-dialog {
  background: var(--color-bg);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius);
  padding: 24px;
  max-width: 320px;
  text-align: center;
  color: var(--color-text);
}
.confirm-dialog p {
  margin-bottom: 20px;
  line-height: 1.6;
}
.confirm-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
