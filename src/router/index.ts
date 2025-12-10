// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../pages/Home.vue') },
    { path: '/dashboard', name: 'dashboard', component: () => import('../pages/Dashboard.vue') },
    { path: '/privacy', name: 'privacy', component: () => import('../pages/PrivacyPolicy.vue') },
    { path: '/terms', name: 'terms', component: () => import('../pages/Terms.vue') }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  // Wait for auth to initialize before proceeding
  if (auth.loading) return

  // Prevent unauthenticated users from accessing protected routes
  if (to.name === 'dashboard' && !auth.user) {
    return { name: 'home' }
  }
})
export default router
