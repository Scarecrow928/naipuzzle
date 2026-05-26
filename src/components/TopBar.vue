<script setup lang="ts">
import { ref } from 'vue'
import { formatTime } from '../utils/format'
import { gridIndexToRowCol } from '../utils/puzzleMath'
import type { HeldPiece } from '../types'

const props = defineProps<{
  elapsedSeconds: number
  moves: number
  heldPiece: HeldPiece | null
  imageUrl: string
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
  if (!props.heldPiece || !props.imageUrl) return {}
  const pieceId = props.heldPiece.pieceId
  const cols = props.gridColumns
  const rows = props.gridRows
  const { row, col } = gridIndexToRowCol(pieceId - 1, cols)
  const pctX = (col / (cols - 1)) * 100
  const pctY = (row / (rows - 1)) * 100
  return {
    backgroundImage: `url(${props.imageUrl})`,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${pctX}% ${pctY}%`,
  }
}
</script>
<template>
  <div class="top-bar">
    <div class="top-bar-inner">
      <div class="stat">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>{{ formatTime(elapsedSeconds) }}</span>
      </div>
      <div class="stat">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
        <span>{{ moves }} moves</span>
      </div>
      <div v-if="heldPiece" class="held-indicator">
        <div class="held-thumb" :style="heldPieceStyle()"></div>
        <span v-if="isDragging" class="held-label dragging">Dragging...</span>
        <span v-else class="held-label">Place piece {{ heldPiece.pieceId }}</span>
        <button v-if="!isDragging" class="btn btn-ghost btn-xs" @click="$emit('cancel-hold')">Cancel</button>
      </div>
      <div class="actions">
        <button class="btn btn-secondary btn-sm" @click="$emit('restart')">Restart</button>
        <button class="btn btn-ghost btn-sm" @click="confirmBack">Menu</button>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 500px;
  margin: 0 auto;
  padding: 8px 16px;
  background: rgba(var(--color-bg-rgb), var(--panel-opacity));
  backdrop-filter: blur(var(--panel-blur));
  -webkit-backdrop-filter: blur(var(--panel-blur));
  border-radius: var(--radius);
  border: 1px solid rgba(255,255,255,0.08);
  flex-wrap: wrap;
}
.stat {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-dim);
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}
.stat span {
  color: var(--color-text);
  font-weight: 500;
}
.held-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}
.held-thumb {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  flex-shrink: 0;
}
.held-label {
  font-size: 12px;
  color: var(--color-primary);
  font-weight: 600;
  white-space: nowrap;
}
.held-label.dragging {
  color: var(--color-success);
}
.actions {
  display: flex;
  gap: 6px;
}
.btn-xs {
  padding: 4px 10px;
  font-size: 12px;
}
.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
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
