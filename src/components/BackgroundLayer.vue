<script setup lang="ts">
</script>
<template>
  <div class="background-layer"></div>
</template>
<style scoped>
.background-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-color: var(--color-bg);
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
