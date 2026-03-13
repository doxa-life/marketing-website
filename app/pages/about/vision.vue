<template>
  <div class="container page-content">
    <div class="with-sidebar">
      <AboutSidebar current-slug="vision" />
      <article class="page-body">
        <h2>Vision</h2>

        <div class="scripture-block surface-brand">
          <h5 class="font-size-lg">A great multitude of all nations and families and peoples and tongues standing before the Lamb.</h5>
          <h5 class="text-right">&ndash; Revelation 7:9</h5>
        </div>

        <h2>Mission</h2>

        <div class="scripture-block surface-brand">
          <h5 class="font-size-lg">For the glory of God, to make disciples of all the nations by going, baptizing, and teaching.</h5>
          <h5 class="text-right">&ndash; Matthew 28:19-20</h5>
        </div>

        <h2>Priority</h2>

        <p>To engage every Unengaged People Group by 2033</p>

        <h2>Values</h2>

        <ul>
          <li>Abide in Jesus (John 15:5)</li>
          <li>Pray without ceasing (1 Thessalonians 5:17)</li>
          <li>Deny yourself (Luke 9:23)</li>
          <li>Engage the regions beyond (2 Corinthians 10:16)</li>
        </ul>

        <h2>Goals</h2>

        <h3>Prayer</h3>

        <ol>
          <li>Daily prayer for each of the 2,085 UUPGs</li>
          <li>At least 144 intercessors praying for each UUPG 10 minutes a day (which equals 24-hour prayer coverage)</li>
          <li>Over 1,000 intercessors for each UUPG (2,085,000+ intercessors)</li>
        </ol>

        <h3>Engagement</h3>

        <ol>
          <li>By 2033 every unengaged people group is engaged</li>
          <li>Post 2033 every unreached people group on earth is fruitfully engaged</li>
          <li>There is an indigenous church planted among every people group on earth</li>
        </ol>

        <h3>What is Engagement?</h3>

        <ul>
          <li>There is sustained activity* to share Christ and make disciples</li>
          <li>There are efforts to establish self-sustaining churches</li>
          <li>The work occurs in culturally appropriate and locally relevant ways</li>
        </ul>

        <p><em>* For WAGF understanding, this means cross-cultural workers are resident&hellip;</em></p>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

definePageMeta({ layout: 'default' })
useHead({ title: 'Vision' })
</script>

<style scoped>
.scripture-block {
  padding: var(--spacing-lg) var(--spacing-xl);
  border-radius: var(--border-radius-md);
}

.text-right {
  text-align: right;
}
</style>
