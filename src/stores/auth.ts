import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase, getCurrentUser, signInWithGoogle, signOut } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import router from '../router'
import { useNotificationStore } from './notification'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)

  function handleAuthSuccess(authUser: User, cleanUrl = false) {
    const notification = useNotificationStore()
    const userName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'User'
    notification.success(`Welcome, ${userName}!`)

    const routeMethod = cleanUrl ? router.replace : router.push
    routeMethod({ name: 'dashboard' })
  }

  async function init() {
    try {
      const isOAuthCallback = window.location.hash.includes('access_token')

      user.value = await getCurrentUser()

      // Handle OAuth callback (first login from redirect)
      if (isOAuthCallback && user.value) {
        handleAuthSuccess(user.value, true)
      }

      // Listen to subsequent auth state changes
      supabase.auth.onAuthStateChange((_event, session) => {
        const newUser = session?.user ?? null
        const oldUser = user.value
        user.value = newUser

        if (newUser && !oldUser) {
          handleAuthSuccess(newUser, false)
        } else if (!newUser && oldUser) {
          router.push({ name: 'login' })
        }
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
    } finally {
      loading.value = false
    }
  }

  async function loginGoogle() {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async function logout() {
    try {
      await signOut()
      user.value = null
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  return { user, loading, init, loginGoogle, logout }
})
