<template>
  <div class="progress-bar" :data-size="size">
    <div class="progress-bar__slider" :style="{ width: percentage + '%' }"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  percentage: number
  size?: 'sm' | 'md' | 'lg'
}>()
</script>
