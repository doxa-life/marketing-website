<template>
  <div>
    <div class="video-modal-overlay" :data-state="state" @click="close"></div>
    <div class="video-modal" :data-state="state">
      <div style="padding: 41.89% 0 0 0; position: relative;">
        <iframe
          ref="iframe"
          :src="iframeSrc"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          title="Doxa Video"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  videoId: string
  videoHash: string
}>()

const state = ref<'open' | 'closed'>('closed')

const baseSrc = computed(() =>
  `https://player.vimeo.com/video/${props.videoId}?h=${props.videoHash}&badge=0&autopause=0&player_id=0&app_id=58479`
)

const iframeSrc = ref(baseSrc.value)

function open() {
  state.value = 'open'
  iframeSrc.value = baseSrc.value + '&autoplay=1'
  history.pushState(null, '', '#playing-video')
}

function close() {
  state.value = 'closed'
  // Reset iframe src to stop playback
  iframeSrc.value = ''
  nextTick(() => {
    iframeSrc.value = baseSrc.value
  })
}

function onKeydown(e: KeyboardEvent) {
  if (state.value === 'open' && e.key === 'Escape') {
    close()
  }
}

function onPopstate() {
  if (state.value === 'open') {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('popstate', onPopstate)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('popstate', onPopstate)
})

defineExpose({ open, close })
</script>
