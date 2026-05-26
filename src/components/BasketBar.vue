<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { DragKey, type DragDropAPI, type HeldPiece } from '../types'
import { gridIndexToRowCol } from '../utils/puzzleMath'

const drag = inject<DragDropAPI>(DragKey)

const props = defineProps<{
  basket: number[]
  gridColumns: number
  gridRows: number
  imageUrl: string
  heldPiece: HeldPiece | null
}>()

const expanded = ref(false)

const count = computed(() => props.basket.length)

const isBasketHovered = computed(() => {
  if (!drag) return false
  return drag.hoverTarget.value?.type === 'basket'
})

function handleBasketPiecePointerDown(pieceId: number, event: PointerEvent) {
  drag?.onBasketPiecePointerDown(pieceId, event)
  expanded.value = false
}

function toggle() {
  expanded.value = !expanded.value
}

function handleBarPointerDown(event: PointerEvent) {
  if (props.heldPiece) {
    drag?.onBasketBarPointerDown(event)
  } else {
    event.preventDefault()
    toggle()
  }
}

function pieceStyle(pieceId: number) {
  const cols = props.gridColumns
  const rows = props.gridRows
  const { row, col } = gridIndexToRowCol(pieceId - 1, cols)
  const pctX = (col / (cols - 1)) * 100
  const pctY = (row / (rows - 1)) * 100
  return {
    backgroundImage: props.imageUrl ? `url(${props.imageUrl})` : 'none',
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${pctX}% ${pctY}%`,
  }
}
</script>
<template>
  <div class="basket-area">
    <div v-if="expanded" class="basket-expanded animate-fade-in">
      <button class="basket-close" @click="toggle">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
        Close
      </button>
      <div class="basket-list" v-if="basket.length > 0">
        <div
          v-for="pieceId in basket"
          :key="pieceId"
          class="basket-piece"
          :style="pieceStyle(pieceId)"
          @pointerdown="(ev: PointerEvent) => handleBasketPiecePointerDown(pieceId, ev)"
        >
          <span class="basket-piece-label">{{ pieceId }}</span>
        </div>
      </div>
      <div v-else class="basket-empty">Basket is empty</div>
    </div>
    <button
      class="basket-bar"
      :class="{
        'drop-target': heldPiece || isBasketHovered,
        'drag-hover': isBasketHovered,
      }"
      data-basket="true"
      @pointerdown="handleBarPointerDown"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 3v18h18"/>
        <path d="M3 12h18"/>
        <path d="M12 3v18"/>
      </svg>
      <span v-if="heldPiece && !isBasketHovered" class="basket-label">Drop here</span>
      <span v-else-if="isBasketHovered" class="basket-label">Release to basket</span>
      <span v-else class="basket-label">Basket ({{ count }})</span>
      <svg v-if="!heldPiece" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline v-if="!expanded" points="6 9 12 15 18 9"/>
        <polyline v-else points="18 15 12 9 6 15"/>
      </svg>
    </button>
  </div>
</template>
<style scoped>
.basket-area {
  position: relative;
  z-index: 10;
  flex-shrink: 0;
}
.basket-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 10px 16px;
  background: rgba(var(--color-bg-rgb), var(--panel-opacity));
  backdrop-filter: blur(var(--panel-blur));
  -webkit-backdrop-filter: blur(var(--panel-blur));
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-sm);
  color: var(--color-text-dim);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.basket-bar:hover {
  background: rgba(var(--color-bg-rgb), calc(var(--panel-opacity) + 0.05));
  color: var(--color-text);
}
.basket-bar.drop-target {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.basket-bar.drag-hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 12px rgba(var(--color-primary-rgb), 0.4);
  color: var(--color-primary);
}
.basket-label {
  flex: 1;
  text-align: left;
}
.basket-expanded {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  margin: 0 auto 4px;
  max-width: 500px;
  background: rgba(var(--color-bg-rgb), 0.95);
  backdrop-filter: blur(var(--panel-blur));
  -webkit-backdrop-filter: blur(var(--panel-blur));
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius);
  padding: 12px;
}
.basket-close {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 10px;
  background: none;
  color: var(--color-text-dim);
  font-size: 13px;
  transition: color var(--transition-fast);
}
.basket-close:hover {
  color: var(--color-text);
}
.basket-list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.basket-piece {
  width: 52px;
  height: 52px;
  border-radius: var(--tile-radius);
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  touch-action: none;
}
.basket-piece:hover {
  transform: scale(1.08);
  z-index: 1;
}
.basket-piece-label {
  background: rgba(0,0,0,0.5);
  color: #fff;
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 4px 4px 0 0;
  pointer-events: none;
}
.basket-empty {
  text-align: center;
  color: var(--color-text-dim);
  font-size: 13px;
  padding: 12px 0;
}
</style>
