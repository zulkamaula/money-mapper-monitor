# Reusable Components Usage Guide

## ConfirmDialog Component

A reusable confirmation dialog component that can be used throughout the application.

### Usage

```typescript
import { useDialogStore } from '@/stores/dialog'

const dialog = useDialogStore()

// Show confirmation dialog
dialog.showDialog({
  title: 'Confirm Delete',
  message: 'Are you sure you want to delete this item?',
  icon: 'mdi-delete',
  iconColor: 'error',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  confirmColor: 'error',
  onConfirm: async () => {
    // Your confirm action here
    await deleteItem()
  },
  onCancel: () => {
    // Optional cancel action
    console.log('Cancelled')
  },
})
```

### Configuration Options

| Property       | Type     | Default              | Description                  |
| -------------- | -------- | -------------------- | ---------------------------- |
| `title`        | string   | Required             | Dialog title                 |
| `message`      | string   | Required             | Dialog message/description   |
| `icon`         | string   | `'mdi-alert-circle'` | Material Design Icon name    |
| `iconColor`    | string   | `'primary'`          | Icon and accent color        |
| `confirmText`  | string   | `'Confirm'`          | Confirm button text          |
| `cancelText`   | string   | `'Cancel'`           | Cancel button text           |
| `confirmColor` | string   | `'primary'`          | Confirm button color         |
| `onConfirm`    | function | -                    | Callback function on confirm |
| `onCancel`     | function | -                    | Callback function on cancel  |

### Examples

#### Delete Confirmation

```typescript
dialog.showDialog({
  title: 'Delete Envelope',
  message: 'This envelope and all its data will be permanently deleted.',
  icon: 'mdi-delete-forever',
  iconColor: 'error',
  confirmText: 'Delete',
  confirmColor: 'error',
  onConfirm: async () => {
    await deleteEnvelope(id)
  },
})
```

#### Warning Dialog

```typescript
dialog.showDialog({
  title: 'Unsaved Changes',
  message: 'You have unsaved changes. Are you sure you want to leave?',
  icon: 'mdi-alert',
  iconColor: 'warning',
  confirmText: 'Leave',
  confirmColor: 'warning',
  onConfirm: () => {
    router.push('/dashboard')
  },
})
```

---

## AppNotification Component

A toast notification system for displaying success, error, warning, and info messages.

### Usage

```typescript
import { useNotificationStore } from '@/stores/notification'

const notification = useNotificationStore()

// Show notifications
notification.success('Item saved successfully!')
notification.error('Failed to save item')
notification.warning('Please check your input')
notification.info('Processing your request...')
```

### Methods

| Method                     | Parameters           | Description                  |
| -------------------------- | -------------------- | ---------------------------- |
| `success(message)`         | message: string      | Show success notification    |
| `error(message)`           | message: string      | Show error notification (4s) |
| `warning(message)`         | message: string      | Show warning notification    |
| `info(message)`            | message: string      | Show info notification       |
| `showNotification(config)` | config: Notification | Show custom notification     |

### Custom Notification

```typescript
notification.showNotification({
  message: 'Custom notification message',
  type: 'success',
  timeout: 5000, // 5 seconds
})
```

### Features

- ✅ Auto-dismiss with configurable timeout
- 🎨 Color-coded by type (success, error, warning, info)
- 🔔 Icon per notification type
- ❌ Manual close button
- 📱 Responsive design
- ✨ Smooth slide-in animation

---

## Integration

Both components are globally registered in `App.vue`:

```vue
<template>
  <RouterView />
  <AppNotification />
  <ConfirmDialog />
</template>
```

No need to import them in individual components - just use the stores!
