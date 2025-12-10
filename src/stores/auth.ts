// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase, getCurrentUser, signInWithGoogle, signOut } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import router from '../router'
import { useNotificationStore } from './notification'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)

  async function init() {
    try {
      user.value = await getCurrentUser()
      loading.value = false

      // Handle OAuth callback redirect
      if (user.value && router.currentRoute.value.name === 'home') {
        const notification = useNotificationStore()
        const userName = user.value.user_metadata?.full_name || user.value.user_metadata?.name || 'User'
        notification.success(`Welcome back, ${userName}!`)
        router.push({ name: 'dashboard' })
      }

      // Listen to auth state changes
      supabase.auth.onAuthStateChange((_event, session) => {
        const newUser = session?.user ?? null
        const oldUser = user.value
        user.value = newUser

        // Auto redirect based on auth state
        if (newUser && !oldUser && router.currentRoute.value.name === 'home') {
          // User just logged in from home page
          const notification = useNotificationStore()
          const userName = newUser.user_metadata?.full_name || newUser.user_metadata?.name || 'User'
          notification.success(`Welcome, ${userName}!`)
          router.push({ name: 'dashboard' })
        } else if (!newUser && oldUser && router.currentRoute.value.name === 'dashboard') {
          // User just logged out from dashboard
          router.push({ name: 'home' })
        }
      })
    } catch (error) {
      const notification = useNotificationStore()
      notification.error('Failed to initialize authentication')
      console.error('Auth initialization error:', error)
      loading.value = false
    }
  }

  async function loginGoogle() {
    try {
      await signInWithGoogle()
    } catch (error) {
      const notification = useNotificationStore()
      notification.error('Failed to login with Google')
      console.error('Google login error:', error)
    }
  }

  async function logout() {
    try {
      await signOut()
    } catch (error) {
      const notification = useNotificationStore()
      notification.error('Failed to logout')
      console.error('Logout error:', error)
    }
  }

  return { user, loading, init, loginGoogle, logout }
})
