// src/stores/dialog.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface DialogConfig {
    title: string
    message: string
    icon?: string
    iconColor?: string
    confirmText?: string
    cancelText?: string
    confirmColor?: string
    onConfirm?: () => void | Promise<void>
    onCancel?: () => void
}

export const useDialogStore = defineStore('dialog', () => {
    const show = ref(false)
    const config = ref<DialogConfig>({
        title: '',
        message: '',
        icon: 'mdi-alert-circle',
        iconColor: 'primary',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        confirmColor: 'primary'
    })

    function showDialog(dialogConfig: DialogConfig) {
        config.value = {
            ...config.value,
            ...dialogConfig
        }
        show.value = true
    }

    function confirm(action: 'confirm' | 'cancel') {
        if (action === 'confirm' && config.value.onConfirm) {
            config.value.onConfirm()
        } else if (action === 'cancel' && config.value.onCancel) {
            config.value.onCancel()
        }
        hide()
    }

    function hide() {
        show.value = false
    }

    return {
        show,
        config,
        showDialog,
        confirm,
        hide
    }
})
