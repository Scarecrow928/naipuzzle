<script setup lang="ts">
import { inject, computed } from 'vue'
import { DragKey, type HeldPiece, type DragDropAPI } from '../types'
import PuzzleTile from './PuzzleTile.vue'

const drag = inject<DragDropAPI>(DragKey)

const props = defineProps<{
  grid: (number | null)[]
  gridColumns: number
  gridRows: number
  imageUrl: string
  imageRatio: number
  heldPiece: HeldPiece | null
}>()

const dropTargetIndex = computed(() => {
  if (!drag) return -1
  const t = drag.hoverTarget.value
  if (t?.type === 'grid') return t.index
  return -1
})
</script>
<template>
  <div
    class="puzzle-board"
    :style="{
      '--image-ratio': imageRatio,
      gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
      gridTemplateRows: `repeat(${gridRows}, 1fr)`,
      gap: `var(--tile-gap)`,
    }"
  >
    <PuzzleTile
      v-for="(value, index) in grid"
      :key="index"
      :value="value"
      :index="index"
      :gridColumns="gridColumns"
      :gridRows="gridRows"
      :imageUrl="imageUrl"
      :isEmpty="value == null"
      :isSource="heldPiece?.fromGridIndex === index"
      :isDropTarget="dropTargetIndex === index"
      @pointerdown="(idx, ev) => drag?.onTilePointerDown(idx, ev)"
    />
  </div>
</template>
<style scoped>
.puzzle-board {
  display: grid;
  width: 100%;
  aspect-ratio: var(--image-ratio);
  max-width: min(90vw, 500px);
  max-height: calc(90vh - 160px);
  margin: 0 auto;
  padding: 8px;
  touch-action: none;
}
</style>
