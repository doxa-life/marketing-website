<template>
  <div class="admin-layout">
    <!-- Mobile header with hamburger -->
    <div class="mobile-header">
      <UButton
        icon="i-lucide-menu"
        variant="ghost"
        @click="sidebarOpen = true"
      />
      <span class="mobile-title">DOXA Admin</span>
    </div>

    <nav class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <h1 class="logo">DOXA Admin</h1>
      </div>

      <ul class="nav-menu">
        <li>
          <NuxtLink to="/admin" class="nav-link" :class="{ 'router-link-active': route.path === '/admin' }">
            <UIcon name="i-lucide-layout-dashboard" /> Dashboard
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin/pages" class="nav-link">
            <UIcon name="i-lucide-file-text" /> Pages
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin/users" class="nav-link">
            <UIcon name="i-lucide-users" /> Users
          </NuxtLink>
        </li>
      </ul>

      <div class="sidebar-footer">
        <span v-if="user" class="user-name">{{ user.display_name || user.email }}</span>
        <UButton icon="i-lucide-log-out" variant="ghost" size="sm" @click="logout" />
      </div>
    </nav>

    <!-- Mobile backdrop -->
    <div
      v-if="sidebarOpen"
      class="sidebar-backdrop"
      @click="sidebarOpen = false"
    />

    <div class="main-wrapper">
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const route = useRoute()
const sidebarOpen = ref(false)

watch(() => route.path, () => {
  sidebarOpen.value = false
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--ui-bg);
  color: var(--ui-text);
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
  background-color: var(--ui-bg-elevated);
  border-right: 1px solid var(--ui-border);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid var(--ui-border);
}

.logo {
  font-size: 1.25rem;
  margin: 0;
  color: var(--ui-text);
}

.nav-menu {
  list-style: none;
  padding: 1rem 0;
  margin: 0;
  flex: 1;
}

.nav-menu li {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--ui-text);
  text-decoration: none;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: var(--ui-bg);
}

.nav-link.router-link-active {
  background-color: var(--ui-bg);
  border-right: 3px solid var(--ui-text);
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--ui-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.user-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--ui-text);
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--ui-bg);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Mobile header - hidden on desktop */
.mobile-header {
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--ui-bg-elevated);
  border-bottom: 1px solid var(--ui-border);
}

.mobile-title {
  font-weight: 600;
  font-size: 1rem;
}

/* Mobile backdrop */
.sidebar-backdrop {
  display: none;
}

/* Mobile responsive styles */
@media (max-width: 1024px) {
  .admin-layout {
    flex-direction: column;
  }

  .mobile-header {
    display: flex;
  }

  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 40;
  }

  .main-content {
    padding: 1rem;
  }
}
</style>
