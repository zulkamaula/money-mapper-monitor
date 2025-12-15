import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: () => import('../pages/Dashboard.vue'), meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: () => import('../pages/Home.vue'), meta: { public: true } },
    { path: '/privacy', name: 'privacy', component: () => import('../pages/PrivacyPolicy.vue'), meta: { public: true } },
    { path: '/terms', name: 'terms', component: () => import('../pages/Terms.vue'), meta: { public: true } }
  ]
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Wait for auth initialization to complete
  if (auth.loading) {
    await new Promise<void>((resolve) => {
      const unwatch = auth.$subscribe(() => {
        if (!auth.loading) {
          unwatch()
          resolve()
        }
      })
    })
  }

  const isAuthenticated = !!auth.user
  const requiresAuth = to.meta.requiresAuth

  // Redirect authenticated users from login page to dashboard
  if (to.name === 'login' && isAuthenticated) {
    return { name: 'dashboard' }
  }

  // Redirect unauthenticated users trying to access protected routes
  if (requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }
})

export default router
