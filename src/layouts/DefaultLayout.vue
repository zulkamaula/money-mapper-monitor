<script setup lang="ts">
import AppNavbar from '../components/AppNavbar.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<template>
    <VApp>
        <AppNavbar />
        <VMain>
            <slot />
        </VMain>
        <AppFooter />
    </VApp>
</template>

<style scoped>
/* Layout-specific styles if needed */
</style>
