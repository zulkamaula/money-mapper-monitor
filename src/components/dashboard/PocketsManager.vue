<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Pocket } from '../../types/models'

interface Props {
  pockets: Pocket[]
  loading?: boolean
}

interface Emits {
  (e: 'create', pocket: { name: string; percentage: number }): void
  (e: 'update', pocket: Pocket): void
  (e: 'delete', pocketId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showDialog = ref(false)
const newPocket = ref({ name: '', percentage: 0 })
const editingPocket = ref<string | null>(null)

const totalPercentage = computed(() => {
  return props.pockets.reduce((sum, p) => sum + p.percentage, 0)
})

const canAddPocket = computed(() => {
  const wouldBeTotal = totalPercentage.value + newPocket.value.percentage
  return wouldBeTotal <= 100.01
})

function openDialog() {
  newPocket.value = { name: '', percentage: 0 }
  showDialog.value = true
}

function handleCreate() {
  if (!newPocket.value.name.trim() || newPocket.value.percentage <= 0 || !canAddPocket.value) {
    return
  }
  emit('create', { ...newPocket.value })
  showDialog.value = false
  newPocket.value = { name: '', percentage: 0 }
}

function startEdit(pocketId: string) {
  editingPocket.value = pocketId
}

function cancelEdit() {
  editingPocket.value = null
}

function saveEdit(pocket: Pocket) {
  emit('update', pocket)
  cancelEdit()
}

function handleDelete(pocketId: string) {
  emit('delete', pocketId)
}
</script>

<template>
  <VCard class="pockets-card" elevation="0">
    <VCardTitle class="d-flex align-center justify-space-between pa-5 pb-4">
      <div class="d-flex align-center">
        <VIcon icon="mdi-wallet-outline" class="mr-2" color="primary" />
        Pockets
      </div>
      <VBtn color="primary" size="small" @click="openDialog">
        <VIcon icon="mdi-plus" start />
        New
      </VBtn>
    </VCardTitle>

    <VDivider />

    <VCardText class="pa-6 pockets-content">
      <div v-if="loading" class="py-4">
        <VSkeletonLoader type="list-item" v-for="i in 3" :key="i" class="mb-2" />
      </div>
      <div v-else-if="pockets.length === 0" class="empty-state text-center py-8">
        <VIcon icon="mdi-wallet-outline" size="48" color="grey-lighten-1" class="mb-3" />
        <div class="text-grey-darken-1">No pockets yet. Create your first pocket!</div>
      </div>
      <VList v-else class="pocket-list">
        <VListItem v-for="pocket in pockets" :key="pocket.id" class="pocket-item mb-2">
          <template v-if="editingPocket === pocket.id">
            <div class="edit-row">
              <VTextField v-model="pocket.name" variant="outlined" density="compact" hide-details class="flex-grow-1" />
              <VTextField v-model.number="pocket.percentage" type="number" variant="outlined" density="compact"
                hide-details style="max-width: 100px;" suffix="%" />
              <div class="mx-auto">
                <VBtn icon="mdi-check" size="small" color="success" variant="text" @click="saveEdit(pocket)" />
                <VBtn icon="mdi-close" size="small" color="grey" variant="text" @click="cancelEdit" />
              </div>
            </div>
          </template>
          <template v-else>
            <VListItemTitle class="d-flex align-center justify-space-between">
              <span class="pocket-name">{{ pocket.name }}</span>
              <div class="pocket-actions">
                <VChip color="primary" size="small" variant="flat" class="mr-2">
                  {{ pocket.percentage.toFixed(2) }}%
                </VChip>
                <VMenu>
                  <template v-slot:activator="{ props }">
                    <VBtn icon="mdi-dots-vertical" size="small" variant="text" v-bind="props" />
                  </template>
                  <VList density="compact">
                    <VListItem @click="startEdit(pocket.id)">
                      <template v-slot:prepend>
                        <VIcon icon="mdi-pencil" />
                      </template>
                      <VListItemTitle>Edit</VListItemTitle>
                    </VListItem>
                    <VListItem @click="handleDelete(pocket.id)">
                      <template v-slot:prepend>
                        <VIcon icon="mdi-delete" color="error" />
                      </template>
                      <VListItemTitle class="text-error">Delete</VListItemTitle>
                    </VListItem>
                  </VList>
                </VMenu>
              </div>
            </VListItemTitle>
          </template>
        </VListItem>
      </VList>
    </VCardText>

    <!-- Add Pocket Dialog -->
    <VDialog v-model="showDialog" max-width="500">
      <VCard>
        <VCardTitle class="pa-5">
          <VIcon icon="mdi-wallet-plus" class="mr-2" />
          Add New Pocket
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-5">
          <VTextField v-model="newPocket.name" label="Pocket Name" variant="outlined" class="mb-4" autofocus />
          <VTextField v-model.number="newPocket.percentage" label="Percentage" type="number" variant="outlined"
            suffix="%" :hint="`Available: ${(100 - totalPercentage).toFixed(2)}%`" persistent-hint />

          <div v-if="!canAddPocket && newPocket.percentage > 0" class="text-error text-caption mt-2">
            Cannot exceed 100%. Current: {{ totalPercentage.toFixed(2) }}%, Would be: {{
              (totalPercentage + newPocket.percentage).toFixed(2) }}%
          </div>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn color="grey" variant="outlined" @click="showDialog = false">Cancel</VBtn>
          <VBtn color="primary" variant="flat" @click="handleCreate"
            :disabled="!newPocket.name.trim() || newPocket.percentage <= 0 || !canAddPocket">
            Add Pocket
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>
</template>

<style scoped>
.pockets-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(15, 118, 110, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.pockets-content {
  max-height: 600px;
  overflow-y: auto;
  flex: 1;
}

.pockets-content::-webkit-scrollbar {
  width: 6px;
}

.pockets-content::-webkit-scrollbar-track {
  background: rgba(15, 118, 110, 0.05);
  border-radius: 3px;
}

.pockets-content::-webkit-scrollbar-thumb {
  background: rgba(15, 118, 110, 0.2);
  border-radius: 3px;
}

.pockets-content::-webkit-scrollbar-thumb:hover {
  background: rgba(15, 118, 110, 0.3);
}

.pocket-list {
  background: transparent !important;
}

.pocket-item {
  background: rgba(15, 118, 110, 0.05);
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid rgba(15, 118, 110, 0.1);
  transition: all 0.2s;
}

.pocket-item:hover {
  background: rgba(15, 118, 110, 0.08);
  border-color: rgba(15, 118, 110, 0.2);
}

.pocket-name {
  font-weight: 600;
  color: rgba(15, 118, 110, 0.9);
}

.pocket-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.edit-row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
}

.edit-row :deep(.v-field) {
  border-radius: 8px;
}

.empty-state {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
