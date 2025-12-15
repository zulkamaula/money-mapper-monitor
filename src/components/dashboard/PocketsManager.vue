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
const isExpanded = ref(true)

const totalPercentage = computed(() => {
  return props.pockets.reduce((sum, p) => sum + p.percentage, 0)
})

const percentageColor = computed(() => {
  const total = totalPercentage.value
  if (Math.abs(total - 100) < 0.01) return 'success'
  if (total < 100) return 'warning'
  return 'error'
})

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

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
    <VCardTitle class="card-header pa-5" @click="toggleExpand">
      <div class="header-content">
        <div class="title-section">
          <div class="d-flex align-center">
            <VIcon icon="mdi-wallet-outline" class="mr-2" color="primary" />
            Pockets
          </div>
          <!-- Mobile: Stats below title -->
          <div class="subtitle-stats d-md-none mt-1">
            {{ pockets.length }} pockets
            <VChip :color="percentageColor" size="x-small" variant="flat" class="percentage-chip">
              {{ totalPercentage.toFixed(2) }}%
            </VChip>
          </div>
        </div>
        <!-- Desktop: Stats on right -->
        <div class="subtitle-stats-desktop d-none d-md-flex">
          {{ pockets.length }} pockets
          <VChip :color="percentageColor" size="x-small" variant="flat" class="percentage-chip ml-2">
            {{ totalPercentage.toFixed(2) }}%
          </VChip>
        </div>
        <!-- Mobile: Toggle button -->
        <VBtn class="d-md-none" :icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="small"
          variant="text" />
      </div>
    </VCardTitle>

    <VDivider />

    <!-- Shared Content: Desktop always visible, Mobile collapsible -->
    <Transition name="expand">
      <VCardText v-show="isExpanded" class="pa-6 pockets-content">
        <!-- Add New Button -->
        <VBtn v-if="pockets.length > 0" color="primary" variant="flat" rounded="pill" block class="mb-4 text-none"
          @click="openDialog">
          <VIcon icon="mdi-plus" start />
          Add New Pocket
        </VBtn>

        <div v-if="loading" class="py-4">
          <VSkeletonLoader type="list-item" v-for="i in 3" :key="i" class="mb-2" />
        </div>
        <div v-else-if="pockets.length === 0" class="empty-state text-center py-8">
          <VIcon icon="mdi-wallet-outline" size="48" color="grey-lighten-1" class="mb-3" />
          <div class="text-grey-darken-1">
            No pockets yet.
            <VBtn color="primary" variant="flat" rounded="pill" size="small" class="text-none" @click="openDialog">
              Create your first pocket!
            </VBtn>
          </div>
        </div>
        <VList v-else class="pocket-list">
          <VListItem v-for="pocket in pockets" :key="pocket.id" class="pocket-item mb-2">
            <template v-if="editingPocket === pocket.id">
              <div class="edit-row">
                <VTextField v-model="pocket.name" variant="outlined" density="compact" hide-details
                  class="flex-grow-1" />
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
                  <VChip color="primary" size="small" variant="flat" class="mr-2 ml-1">
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
    </Transition>

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

.card-header {
  user-select: none;
  padding: 20px;
  padding-bottom: 16px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.title-section {
  flex: 1;
}

.pockets-content {
  flex: 1;
  overflow-y: auto;
  max-height: 500px;
}

/* Mobile: Collapsible content */
@media (max-width: 959px) {
  .pockets-content {
    transition: all 0.3s ease;
  }
}

/* Desktop: Always show content, override v-show */
@media (min-width: 960px) {
  .pockets-content {
    display: block !important;
    opacity: 1 !important;
    max-height: none !important;
  }
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
  border-radius: 12px !important;
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

.subtitle-stats {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.subtitle-stats-desktop {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
  display: flex;
  align-items: center;
}

.percentage-chip {
  font-weight: 600;
}

/* Expand Animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1000px;
}
</style>
