<!-- src/pages/Home.vue -->
<script setup lang="ts">
import BlankLayout from '../layouts/BlankLayout.vue'
import LoginForm from '../components/LoginForm.vue'
</script>

<template>
  <BlankLayout>
    <VContainer fluid class="home-container d-flex align-center justify-center">
      <LoginForm />
    </VContainer>
  </BlankLayout>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 25%, #80deea 75%, #4dd0e1 100%);
  padding: 24px;
}
</style>
