<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import AppNotification from './components/AppNotification.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'

const auth = useAuthStore()

onMounted(() => {
  // Initialize auth store - redirect logic handled inside the store
  auth.init()
})
</script>

<template>
  <RouterView />
  <AppNotification />
  <ConfirmDialog />
</template>
