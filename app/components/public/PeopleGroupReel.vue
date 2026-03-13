<template>
  <div
    ref="reelEl"
    class="reel"
    data-reel-mode="auto-scroll"
  >
    <NuxtLink
      v-for="group in reelGroups"
      :key="group.slug"
      :to="localePath(`/research/${group.slug}`)"
      target="_blank"
      class="stack stack--sm reel__item light-link"
    >
      <div>
        <img class="square rounded-md size-md" :src="group.picture_url" :alt="group.display_name">
      </div>
      <p class="text-center uppercase width-md">{{ group.display_name }}</p>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
interface PeopleGroup {
  slug: string
  display_name: string
  picture_url: string
  has_photo: boolean | string
}

const localePath = useLocalePath()
const reelEl = ref<HTMLElement | null>(null)
const reelGroups = ref<PeopleGroup[]>([])

let scrollInterval: ReturnType<typeof setInterval> | undefined

async function fetchPeopleGroups() {
  try {
    const { locale } = useI18n()
    const lang = locale.value || 'en'
    const response = await fetch(`https://uupg.doxa.life/wp-json/dt-public/disciple-tools-people-groups-api/v1/list?lang=${lang}`)
    const data = await response.json()

    const withPhotos = (data.posts || data)
      .filter((group: PeopleGroup) => group.has_photo === '1')

    // Randomize
    withPhotos.sort(() => Math.random() - 0.5)

    // Filter to max 1 deaf group
    let hasDeaf = false
    const filtered = withPhotos.filter((group: PeopleGroup) => {
      if (group.display_name.toLowerCase().includes('deaf')) {
        if (hasDeaf) return false
        hasDeaf = true
      }
      return true
    })

    reelGroups.value = filtered.slice(0, 20)
  }
  catch (e) {
    console.error('Failed to fetch people groups for reel:', e)
  }
}

function initSlideshow(reel: HTMLElement) {
  reel.classList.add('in')

  const isRtl = document.documentElement.getAttribute('dir') === 'rtl'
  const scrollDirection = isRtl ? -1 : 1

  scrollInterval = setInterval(() => {
    const children = [...reel.children] as HTMLElement[]
    if (children.length === 0) return

    const firstImage = children.reduce((prev, current) =>
      Number(prev.style.order) < Number(current.style.order) ? prev : current
    )

    if (firstImage.offsetWidth < reel.scrollLeft) {
      reel.scrollLeft = reel.scrollLeft - firstImage.offsetWidth * scrollDirection
      firstImage.style.order = String(reel.children.length)
      for (const child of children) {
        if (child !== firstImage) {
          child.style.order = String(Number(child.style.order) - 1)
        }
      }
    }
    else {
      reel.scrollLeft += 1 * scrollDirection
    }
  }, 20)
}

async function waitForImages(reel: HTMLElement) {
  const images = reel.querySelectorAll('img')
  for (const image of images) {
    if (!image.complete) {
      await new Promise<void>((resolve) => {
        image.onload = () => resolve()
        image.onerror = () => resolve()
      })
    }
  }
}

watch(reelGroups, async () => {
  await nextTick()
  const reel = reelEl.value
  if (!reel || reel.children.length === 0) return

  await waitForImages(reel)

  let index = 0
  for (const child of [...reel.children] as HTMLElement[]) {
    child.style.order = String(index)
    index++
  }

  initSlideshow(reel)
})

onMounted(() => {
  fetchPeopleGroups()
})

onUnmounted(() => {
  if (scrollInterval) {
    clearInterval(scrollInterval)
  }
})
</script>
