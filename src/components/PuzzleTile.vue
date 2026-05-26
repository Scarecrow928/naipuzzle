<script setup lang="ts">
import { computed } from 'vue'
import { gridIndexToRowCol } from '../utils/puzzleMath'

const props = defineProps<{
  value: number | null
  index: number
  gridColumns: number
  gridRows: number
  imageUrl: string
  isEmpty?: boolean
  isSource?: boolean
  isDropTarget?: boolean
}>()

const emit = defineEmits<{
  pointerdown: [index: number, event: PointerEvent]
}>()

const style = computed(() => {
  if (props.isEmpty || props.value == null || !props.imageUrl) {
    return {}
  }
  const cols = props.gridColumns
  const rows = props.gridRows
  const value = props.value
  const { row, col } = gridIndexToRowCol(value - 1, cols)
  const pctX = (col / (cols - 1)) * 100
  const pctY = (row / (rows - 1)) * 100
  return {
    backgroundImage: `url(${props.imageUrl})`,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${pctX}% ${pctY}%`,
  }
})

function onPointerDown(event: PointerEvent) {
  emit('pointerdown', props.index, event)
}
</script>
<template>
  <div
    class="puzzle-tile"
    :class="{
      empty: isEmpty,
      source: isSource,
      occupied: !isEmpty && value != null,
      'drop-target': isDropTarget,
    }"
    :style="style"
    :data-grid-cell="index"
    @pointerdown="onPointerDown"
  >
    <div v-if="isEmpty" class="tile-placeholder"></div>
  </div>
</template>
<style scoped>
.puzzle-tile {
  border-radius: var(--tile-radius);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  touch-action: none;
}
.puzzle-tile.occupied {
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.puzzle-tile.empty {
  border: 2px dashed rgba(255,255,255,0.15);
  border-radius: var(--tile-radius);
}
.puzzle-tile.empty.source {
  border-color: var(--color-primary);
  box-shadow: 0 0 12px rgba(var(--color-primary-rgb), 0.3);
}
.puzzle-tile.drop-target {
  border-color: var(--color-primary);
  box-shadow: 0 0 12px rgba(var(--color-primary-rgb), 0.5);
  z-index: 2;
}
.puzzle-tile.occupied.drop-target {
  filter: brightness(0.9);
}
.tile-placeholder {
  width: 100%;
  height: 100%;
}
</style>
