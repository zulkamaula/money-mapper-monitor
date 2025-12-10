<script setup lang="ts">
import { computed } from 'vue'
import { useNotificationStore } from '../stores/notification'

const notificationStore = useNotificationStore()

const notificationConfig = computed(() => {
    const configs = {
        success: {
            color: 'success',
            icon: 'mdi-check-circle',
            bgColor: '#d1fae5',
            borderColor: '#10b981',
            textColor: '#065f46'
        },
        error: {
            color: 'error',
            icon: 'mdi-alert-circle',
            bgColor: '#fee2e2',
            borderColor: '#ef4444',
            textColor: '#991b1b'
        },
        warning: {
            color: 'warning',
            icon: 'mdi-alert',
            bgColor: '#fef3c7',
            borderColor: '#f59e0b',
            textColor: '#92400e'
        },
        info: {
            color: 'info',
            icon: 'mdi-information',
            bgColor: '#dbeafe',
            borderColor: '#3b82f6',
            textColor: '#1e40af'
        }
    }
    return configs[notificationStore.type]
})
</script>

<template>
    <VSnackbar v-model="notificationStore.show" :timeout="notificationStore.timeout" location="top" class="app-snackbar"
        :color="notificationConfig.color">
        <template v-slot:default>
            <div class="notification-content" :style="{
                backgroundColor: notificationConfig.bgColor,
                borderLeft: `4px solid ${notificationConfig.borderColor}`,
                color: notificationConfig.textColor
            }">
                <VIcon :icon="notificationConfig.icon" :color="notificationConfig.borderColor" size="24" class="mr-3" />
                <div class="notification-message">{{ notificationStore.message }}</div>
                <VBtn icon="mdi-close" size="small" variant="text" @click="notificationStore.hide"
                    class="notification-close" :style="{ color: notificationConfig.textColor }" />
            </div>
        </template>
    </VSnackbar>
</template>

<style scoped>
.app-snackbar :deep(.v-snackbar__wrapper) {
    background: transparent !important;
    box-shadow: none !important;
    padding: 0;
    min-width: 400px;
}

.app-snackbar :deep(.v-snackbar__content) {
    padding: 0 !important;
}

.notification-content {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    animation: slideInDown 0.3s ease-out;
}

.notification-message {
    flex: 1;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
}

.notification-close {
    opacity: 0.6;
    transition: opacity 0.2s;
}

.notification-close:hover {
    opacity: 1;
}

@keyframes slideInDown {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@media (max-width: 600px) {
    .app-snackbar :deep(.v-snackbar__wrapper) {
        min-width: auto;
        width: calc(100vw - 32px);
    }

    .notification-content {
        padding: 12px 16px;
    }

    .notification-message {
        font-size: 13px;
    }
}
</style>
