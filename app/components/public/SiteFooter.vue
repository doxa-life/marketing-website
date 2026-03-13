<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer id="colophon" class="footer">
    <div class="container | footer__content">
      <div class="footer__left stack stack--xs">
        <div>
          <img
            src="/images/DOXA-logo-light-with-text.png"
            alt="DOXA Logo"
            class="mx-auto"
            width="120"
            height="auto"
          >
        </div>
      </div>
      <div class="footer__center">
        <div class="footer__description">
          <h3>DOXA.LIFE</h3>
          <p>{{ t('footer.tagline') }}</p>
        </div>
        <nav class="main-navigation">
          <ul class="main-navigation role-list">
            <li>
              <a
                href="https://giving.ag.org/donate/600001-6C2327?utm_source=direct_link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ t('nav.give') }} ↗
              </a>
            </li>
            <li>
              <NuxtLink :to="localePath('/about/vision')">
                {{ t('nav.vision') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/about/documents')">
                {{ t('nav.documents') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/privacy-policy')">
                {{ t('nav.privacy_policy') }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
      <div class="footer__right">
        <NuxtLink :to="localePath('/contact-us')" class="button compact white">
          {{ t('nav.contact_us') }}
        </NuxtLink>
      </div>
    </div>
    <div class="center | footer__copyright">
      <p>&copy; {{ currentYear }} Doxa.life. {{ t('footer.rights') }}</p>
    </div>
  </footer>
</template>
