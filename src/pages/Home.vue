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
  position: relative;
  overflow: hidden;
}

/* Soft animated circles */
.home-container::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  top: -200px;
  right: -200px;
  animation: float-1 20s ease-in-out infinite;
}

.home-container::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  bottom: -100px;
  left: -100px;
  animation: float-2 15s ease-in-out infinite;
}

@keyframes float-1 {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  33% {
    transform: translate(-50px, 50px) scale(1.1);
  }

  66% {
    transform: translate(30px, -30px) scale(0.9);
  }
}

@keyframes float-2 {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(40px, -40px) scale(1.15);
  }
}
</style>
