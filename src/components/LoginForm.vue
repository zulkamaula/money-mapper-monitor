<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import logoIcon from '@/assets/icon-m3-transparent.webp'

const auth = useAuthStore()

const features = [
  { icon: 'mdi-wallet-outline', text: 'Smart Envelope System' },
  { icon: 'mdi-chart-timeline-variant', text: 'Real-time Tracking' },
  { icon: 'mdi-lock-outline', text: 'Secure & Private' }
]
</script>

<template>
  <VCard elevation="0" rounded="xl" max-width="480" class="mx-auto login-card">
    <VCardText class="pa-8 pa-sm-10">
      <!-- Minimalist Logo -->
      <div class="text-center mb-10 d-flex gap-2 align-center">
        <div class="logo-wrapper">
          <img :src="logoIcon" alt="M3 App Logo" class="logo-image" />
        </div>

        <div class="text-left mr-3">
          <h1 class="app-title">
            M3 App
          </h1>

          <p class="app-subtitle">
            Money Mapper Monitor
          </p>
        </div>
      </div>

      <!-- Minimalist Features -->
      <div class="features-list mb-10">
        <div v-for="(feature, idx) in features" :key="idx" class="feature-item">
          <VIcon :icon="feature.icon" size="20" class="feature-icon" />
          <span class="feature-text">{{ feature.text }}</span>
        </div>
      </div>

      <!-- Clean CTA -->
      <p class="disclaimer">
        Free forever - No credit card required
      </p>

      <VBtn color="primary" size="large" rounded="lg" elevation="0" block height="56" class="google-btn text-none"
        @click="auth.loginGoogle">
        <VIcon icon="mdi-google" size="20" class="mr-3" />
        Continue with Google
      </VBtn>

      <div class="legal-links">
        <RouterLink to="/privacy" class="legal-link">Privacy Policy</RouterLink>
        <span class="separator">|</span>
        <RouterLink to="/terms" class="legal-link">Terms of Service</RouterLink>
      </div>
    </VCardText>
  </VCard>
</template>

<style scoped>
.login-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08) !important;
}

/* Minimalist Logo */
.logo-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  animation: subtle-float 4s ease-in-out infinite;
}

.logo-image {
  width: 96px;
  height: 96px;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
}

@keyframes subtle-float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

/* Typography */
.app-title {
  font-size: 28px;
  font-weight: 800;
  color: #1c2d5e;
  letter-spacing: -0.5px;
}

.app-subtitle {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  letter-spacing: 0.5px;
}

/* Features List */
.features-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(102, 234, 186, 0.1);
  transform: translateX(4px);
}

.feature-icon {
  color: #24914e;
  flex-shrink: 0;
}

.feature-text {
  font-size: 14px;
  font-weight: 600;
  color: rgb(51, 51, 51, .8);
}

/* Google Button */
.google-btn {
  font-size: 15px !important;
  font-weight: 600 !important;
  letter-spacing: 0.2px !important;
  margin: 16px 0;
}

.disclaimer {
  text-align: center;
  font-size: 13px;
  color: #999;
  margin: 0;
  font-weight: 500;
}

.legal-links {
  text-align: center;
  margin-top: 16px;
  font-size: 10px;
}

.legal-link {
  color: rgba(var(--v-theme-primary), 0.6);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.legal-link:hover {
  color: #0f766e;
}

.separator {
  margin: 0 8px;
  color: #ccc;
}

/* Mobile Responsive */
@media (max-width: 600px) {
  .login-card :deep(.v-card-text) {
    padding: 32px 24px !important;
  }

  .app-title {
    font-size: 24px;
  }

  .logo-image {
    width: 80px;
    height: 80px;
  }
}
</style>
