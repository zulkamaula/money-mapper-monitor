// src/stores/notification.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
    message: string
    type: NotificationType
    timeout?: number
}

export const useNotificationStore = defineStore('notification', () => {
    const show = ref(false)
    const message = ref('')
    const type = ref<NotificationType>('info')
    const timeout = ref(3000)

    function showNotification(notification: Notification) {
        message.value = notification.message
        type.value = notification.type
        timeout.value = notification.timeout || 3000
        show.value = true
    }

    function success(msg: string) {
        showNotification({ message: msg, type: 'success' })
    }

    function error(msg: string) {
        showNotification({ message: msg, type: 'error', timeout: 4000 })
    }

    function warning(msg: string) {
        showNotification({ message: msg, type: 'warning' })
    }

    function info(msg: string) {
        showNotification({ message: msg, type: 'info' })
    }

    function hide() {
        show.value = false
    }

    return {
        show,
        message,
        type,
        timeout,
        showNotification,
        success,
        error,
        warning,
        info,
        hide
    }
})
