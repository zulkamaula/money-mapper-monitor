<script setup lang="ts">
import { useDialogStore } from '../stores/dialog'

const dialog = useDialogStore()
</script>

<template>
    <VDialog v-model="dialog.show" max-width="440" persistent class="confirm-dialog">
        <VCard class="confirm-dialog-card" elevation="0">
            <VCardText class="pa-0">
                <!-- Icon Section -->
                <div class="dialog-header">
                    <div class="dialog-icon-wrapper" :style="{
                        backgroundColor: `rgba(var(--v-theme-${dialog.config.iconColor}), 0.1)`
                    }">
                        <VIcon :icon="dialog.config.icon" :color="dialog.config.iconColor" size="40" />
                    </div>
                </div>

                <!-- Content Section -->
                <div class="dialog-content">
                    <h3 class="dialog-title">{{ dialog.config.title }}</h3>
                    <p class="dialog-message">{{ dialog.config.message }}</p>
                </div>

                <!-- Actions Section -->
                <div class="dialog-actions">
                    <VBtn variant="outlined" color="grey-darken-1" size="large" @click="dialog.confirm('cancel')"
                        class="text-none flex-grow-1" rounded="lg">
                        {{ dialog.config.cancelText }}
                    </VBtn>
                    <VBtn :color="dialog.config.confirmColor" size="large" @click="dialog.confirm('confirm')"
                        class="text-none flex-grow-1" rounded="lg" elevation="0">
                        {{ dialog.config.confirmText }}
                    </VBtn>
                </div>
            </VCardText>
        </VCard>
    </VDialog>
</template>

<style scoped>
.confirm-dialog :deep(.v-overlay__content) {
    margin: 24px;
}

.confirm-dialog-card {
    border-radius: 24px !important;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
    border: 1px solid rgba(15, 118, 110, 0.1);
}

.dialog-header {
    background: linear-gradient(135deg, rgba(15, 118, 110, 0.03) 0%, rgba(8, 145, 178, 0.03) 100%);
    padding: 32px 24px 24px 24px;
    text-align: center;
}

.dialog-icon-wrapper {
    width: 88px;
    height: 88px;
    margin: 0 auto;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
    from {
        transform: scale(0.8);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

.dialog-content {
    padding: 24px 32px;
    text-align: center;
}

.dialog-title {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 12px;
    line-height: 1.3;
    letter-spacing: -0.02em;
}

.dialog-message {
    font-size: 15px;
    color: #64748b;
    line-height: 1.6;
    margin: 0;
}

.dialog-actions {
    padding: 0 24px 24px 24px;
    display: flex;
    gap: 12px;
}

/* Responsive */
@media (max-width: 600px) {
    .confirm-dialog :deep(.v-overlay__content) {
        margin: 16px;
    }

    .dialog-header {
        padding: 24px 20px 20px 20px;
    }

    .dialog-icon-wrapper {
        width: 72px;
        height: 72px;
    }

    .dialog-icon-wrapper :deep(.v-icon) {
        font-size: 32px !important;
    }

    .dialog-content {
        padding: 20px 24px;
    }

    .dialog-title {
        font-size: 20px;
    }

    .dialog-message {
        font-size: 14px;
    }

    .dialog-actions {
        padding: 0 20px 20px 20px;
        flex-direction: column;
    }
}
</style>
