<script setup lang="ts">
import { ENABLED_LANGUAGES } from '~~/config/languages'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()

const menuOpen = ref(false)
const aboutSubmenuOpen = ref(false)
const langDropdownOpen = ref(false)

const currentLang = computed(() =>
  ENABLED_LANGUAGES.find(l => l.code === locale.value) || ENABLED_LANGUAGES[0]
)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  if (!menuOpen.value) {
    aboutSubmenuOpen.value = false
  }
}

function closeMenu() {
  menuOpen.value = false
  aboutSubmenuOpen.value = false
}

function toggleAboutSubmenu(event: Event) {
  event.preventDefault()
  aboutSubmenuOpen.value = !aboutSubmenuOpen.value
}

function toggleLangDropdown() {
  langDropdownOpen.value = !langDropdownOpen.value
}

function closeLangDropdown() {
  langDropdownOpen.value = false
}

watch(() => route.fullPath, () => {
  closeMenu()
  closeLangDropdown()
})
</script>

<template>
  <header id="masthead" class="position-relative">
    <div
      class="hamburger-menu-overlay"
      :data-state="menuOpen ? 'open' : 'closed'"
      @click="closeMenu"
    />

    <nav
      id="hamburger-menu"
      class="hamburger-menu"
      aria-label="Hamburger menu"
      :data-state="menuOpen ? 'open' : 'closed'"
    >
      <ul class="role-list stack">
        <li>
          <NuxtLink :to="localePath('/about')" @click="closeMenu">
            {{ t('nav.about') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('/research')" @click="closeMenu">
            {{ t('nav.research') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('/pray')" @click="closeMenu">
            {{ t('nav.pray') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('/adopt')" @click="closeMenu">
            {{ t('nav.adopt') }}
          </NuxtLink>
        </li>
        <li>
          <a
            href="https://giving.ag.org/donate/600001-6C2327?utm_source=direct_link"
            target="_blank"
            rel="noopener noreferrer"
            @click="closeMenu"
          >
            {{ t('nav.give') }} ↗
          </a>
        </li>
        <li class="hamburger-lang-switcher">
          <button class="lang-toggle" @click="toggleLangDropdown">
            <span class="lang-flag">{{ currentLang.flag }}</span>
            {{ currentLang.nativeName }}
            <span class="lang-arrow">&#9660;</span>
          </button>
          <ul v-show="langDropdownOpen" class="role-list lang-dropdown-mobile">
            <li v-for="lang in ENABLED_LANGUAGES" :key="lang.code">
              <NuxtLink
                :to="switchLocalePath(lang.code)"
                @click="closeMenu"
              >
                <span class="lang-flag">{{ lang.flag }}</span>
                {{ lang.nativeName }}
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <div class="header">
      <div class="container">
        <div class="header-content">
          <div class="site-branding">
            <NuxtLink :to="localePath('/')" rel="home">
              <img
                src="/images/Small Banner/DOXA-small-light-banner.png"
                class="logo"
                alt="DOXA"
                width="250"
                height="auto"
              >
            </NuxtLink>
            <span class="wagf-text">{{ t('header.wagf') }}</span>
          </div>
          <div class="header-menu">
            <nav id="site-navigation" class="main-navigation">
              <ul class="role-list" id="primary-menu">
                <li>
                  <NuxtLink :to="localePath('/pray')">
                    {{ t('nav.pray') }}
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink :to="localePath('/adopt')">
                    {{ t('nav.adopt') }}
                  </NuxtLink>
                </li>
                <li class="lang-switcher" @mouseleave="closeLangDropdown">
                  <button class="lang-toggle" @click="toggleLangDropdown">
                    <span class="lang-flag">{{ currentLang.flag }}</span>
                    <span class="lang-arrow">&#9660;</span>
                  </button>
                  <ul v-show="langDropdownOpen" class="role-list lang-dropdown">
                    <li v-for="lang in ENABLED_LANGUAGES" :key="lang.code">
                      <NuxtLink
                        :to="switchLocalePath(lang.code)"
                        @click="closeLangDropdown"
                      >
                        <span class="lang-flag">{{ lang.flag }}</span>
                        {{ lang.nativeName }}
                      </NuxtLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
            <button
              class="mobile-menu-toggle"
              :class="{ open: menuOpen }"
              aria-label="Toggle navigation menu"
              @click="toggleMenu"
            >
              <span class="hamburger-line" />
              <span class="hamburger-line" />
              <span class="hamburger-line" />
              <span class="hamburger-line" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.lang-switcher {
  position: relative;
}

.lang-toggle {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--color-text-on-brand-light);
  padding: 0.25rem 0;
  font-size: 1rem;
}

.lang-flag {
  font-size: 1.75rem;
  line-height: 1;
}

.lang-arrow {
  font-size: 0.5rem;
  opacity: 0.7;
}

.lang-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-surface-default);
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
  border-radius: 5px;
  min-width: 180px;
  z-index: 2000;
  padding: 0.5rem 0;
  list-style: none;
  margin: 0;
  flex-direction: column !important;
  gap: 0 !important;

  li {
    list-style: none;
  }

  li::before {
    content: "";
  }

  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    color: var(--color-text-on-default);
    text-decoration: none;
    font-weight: 500;
    white-space: nowrap;

    &:hover {
      background: var(--color-surface-brand-lightest);
    }
  }
}

// Mobile: hide desktop language in hamburger
@media (max-width: 992px) {
  .lang-switcher {
    display: none;
  }
}

// Hamburger menu language switcher
.hamburger-lang-switcher {
  .lang-toggle {
    color: var(--color-text-on-default);
    font-weight: var(--font-weight-medium);
  }
}

.lang-dropdown-mobile {
  list-style: none;
  padding: 0.5rem 0 0 1rem;
  margin: 0;

  li {
    list-style: none;
  }

  li::before {
    content: "";
  }

  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0;
    color: var(--color-text-on-default);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      color: var(--color-brand-primary);
    }
  }
}
</style>
