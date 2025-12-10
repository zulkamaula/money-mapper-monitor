<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'
import { useDialogStore } from '../stores/dialog'
import { listMoneyBooks, createMoneyBook, updateMoneyBook, deleteMoneyBook } from '../api/moneyBooks'
import { listPockets, createPocket, updatePocket, deletePocket } from '../api/pockets'
import { listAllocations, createAllocation, deleteAllocation } from '../api/allocations'
import type { MoneyBook, Pocket, Allocation } from '../types/models'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import MoneyBookSelector from '../components/dashboard/MoneyBookSelector.vue'
import StatsCards from '../components/dashboard/StatsCards.vue'
import PocketsManager from '../components/dashboard/PocketsManager.vue'
import AllocationsHistory from '../components/dashboard/AllocationsHistory.vue'
import AllocationDialog from '../components/dashboard/AllocationDialog.vue'

const auth = useAuthStore()
const notification = useNotificationStore()
const dialog = useDialogStore()

// State
const moneyBooks = ref<MoneyBook[]>([])
const selectedBook = ref<MoneyBook | null>(null)
const pockets = ref<Pocket[]>([])
const allocations = ref<Allocation[]>([])

// Loading states
const loading = ref(false)
const loadingPockets = ref(false)
const loadingAllocations = ref(false)
const creatingBook = ref(false)

// Dialog state
const showAllocationDialog = ref(false)

// Computed
const totalPercentage = computed(() => {
  return pockets.value.reduce((sum, p) => sum + p.percentage, 0)
})

const isPercentageValid = computed(() => {
  return Math.abs(totalPercentage.value - 100) < 0.01
})

// Lifecycle
onMounted(async () => {
  if (auth.loading) {
    const checkAuth = setInterval(() => {
      if (!auth.loading) {
        clearInterval(checkAuth)
        initDashboard()
      }
    }, 100)
  } else {
    await initDashboard()
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Functions
async function initDashboard() {
  if (!auth.user) {
    console.warn('No authenticated user found')
    return
  }

  console.log('Loading dashboard for user:', auth.user.id)
  loading.value = true
  try {
    await loadMoneyBooks()
  } catch (error) {
    console.error('Failed to load dashboard:', error)
    notification.error('Failed to load dashboard data')
  } finally {
    loading.value = false
  }
}

function handleScroll() {
  const activeElement = document.activeElement as HTMLElement
  if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
    activeElement.blur()
  }
}

async function loadMoneyBooks() {
  if (!auth.user) return

  try {
    console.log('Fetching money books for user:', auth.user.id)
    moneyBooks.value = await listMoneyBooks(auth.user.id)
    console.log('Loaded money books:', moneyBooks.value.length)

    if (moneyBooks.value.length > 0 && !selectedBook.value) {
      const firstBook = moneyBooks.value[0]
      if (firstBook) {
        await selectBook(firstBook)
      }
    }
  } catch (error) {
    console.error('Error loading money books:', error)
    notification.error('Failed to load money books')
  }
}

async function selectBook(book: MoneyBook) {
  if (selectedBook.value?.id === book.id) return
  selectedBook.value = book
  await Promise.all([loadPockets(), loadAllocations()])
}

async function loadPockets() {
  if (!selectedBook.value) return
  loadingPockets.value = true
  try {
    pockets.value = await listPockets(selectedBook.value.id)
  } catch (error) {
    notification.error('Failed to load pockets')
    console.error(error)
  } finally {
    loadingPockets.value = false
  }
}

async function loadAllocations() {
  if (!selectedBook.value) return
  loadingAllocations.value = true
  try {
    allocations.value = await listAllocations(selectedBook.value.id)
  } catch (error) {
    notification.error('Failed to load allocations')
    console.error(error)
  } finally {
    loadingAllocations.value = false
  }
}

// Money Book handlers
async function handleCreateBook(name: string) {
  if (!auth.user) return
  creatingBook.value = true
  try {
    const book = await createMoneyBook(auth.user.id, name)
    moneyBooks.value.unshift(book)
    await selectBook(book)
    notification.success('Money Book created successfully')
  } catch (error) {
    notification.error('Failed to create Money Book')
    console.error(error)
  } finally {
    creatingBook.value = false
  }
}

async function handleUpdateBook(book: MoneyBook, name: string) {
  try {
    const updated = await updateMoneyBook(book.id, name)
    const index = moneyBooks.value.findIndex((b) => b.id === book.id)
    if (index !== -1) {
      moneyBooks.value[index] = updated
    }
    if (selectedBook.value?.id === book.id) {
      selectedBook.value = updated
    }
    notification.success('Money Book renamed')
  } catch (error) {
    notification.error('Failed to rename Money Book')
    console.error(error)
  }
}

function handleDeleteBook(book: MoneyBook) {
  dialog.showDialog({
    title: 'Delete Money Book',
    message: `Are you sure you want to delete "${book.name}"? All pockets and allocations will be deleted.`,
    icon: 'mdi-delete',
    iconColor: 'error',
    confirmText: 'Delete',
    confirmColor: 'error',
    onConfirm: async () => {
      try {
        await deleteMoneyBook(book.id)
        moneyBooks.value = moneyBooks.value.filter((b) => b.id !== book.id)
        if (selectedBook.value?.id === book.id) {
          selectedBook.value = moneyBooks.value[0] || null
          if (selectedBook.value) {
            await selectBook(selectedBook.value)
          } else {
            pockets.value = []
            allocations.value = []
          }
        }
        notification.success('Money Book deleted')
      } catch (error) {
        notification.error('Failed to delete Money Book')
        console.error(error)
      }
    }
  })
}

// Pocket handlers
async function handleCreatePocket(pocketData: { name: string; percentage: number }) {
  if (!selectedBook.value) return
  try {
    const pocket = await createPocket(
      selectedBook.value.id,
      pocketData.name.trim(),
      pocketData.percentage,
      pockets.value.length
    )
    pockets.value.push(pocket)
    notification.success('Pocket created successfully')
  } catch (error) {
    notification.error('Failed to create pocket')
    console.error(error)
  }
}

async function handleUpdatePocket(pocket: Pocket) {
  try {
    const updated = await updatePocket(pocket.id, pocket.name, pocket.percentage, pocket.order_index)
    const index = pockets.value.findIndex((p) => p.id === pocket.id)
    if (index !== -1) {
      pockets.value[index] = updated
    }
    notification.success('Pocket updated successfully')
  } catch (error) {
    notification.error('Failed to update pocket')
    console.error(error)
  }
}

function handleDeletePocket(pocketId: string) {
  dialog.showDialog({
    title: 'Delete Pocket',
    message: 'Are you sure you want to delete this pocket?',
    icon: 'mdi-delete',
    iconColor: 'error',
    confirmText: 'Delete',
    confirmColor: 'error',
    onConfirm: async () => {
      try {
        await deletePocket(pocketId)
        pockets.value = pockets.value.filter((p) => p.id !== pocketId)
        notification.success('Pocket deleted')
      } catch (error) {
        notification.error('Failed to delete pocket')
        console.error(error)
      }
    }
  })
}

// Allocation handlers
function openAllocationDialog() {
  showAllocationDialog.value = true
}

async function handleCreateAllocation(data: { sourceAmount: number; date: string; notes: string }) {
  if (!selectedBook.value) return
  try {
    const allocation = await createAllocation({
      moneyBookId: selectedBook.value.id,
      sourceAmount: data.sourceAmount,
      date: data.date,
      pockets: pockets.value,
      notes: data.notes
    })
    allocations.value.unshift(allocation)
    showAllocationDialog.value = false
    notification.success('Allocation created successfully')
  } catch (error) {
    notification.error('Failed to create allocation')
    console.error(error)
  }
}

function handleDeleteAllocation(id: string) {
  dialog.showDialog({
    title: 'Delete Allocation',
    message: 'Are you sure you want to delete this allocation?',
    icon: 'mdi-delete',
    iconColor: 'error',
    confirmText: 'Delete',
    confirmColor: 'error',
    onConfirm: async () => {
      try {
        await deleteAllocation(id)
        allocations.value = allocations.value.filter((a) => a.id !== id)
        notification.success('Allocation deleted')
      } catch (error) {
        notification.error('Failed to delete allocation')
        console.error(error)
      }
    }
  })
}
</script>

<template>
  <DefaultLayout>
    <div class="dashboard-main">
      <VContainer fluid class="dashboard-container px-6">
        <!-- Top Row: Money Book Selector + Stats Cards -->
        <VRow class="mb-6" justify="center">
          <!-- Money Book Selector (Left - Wider) -->
          <VCol cols="12" md="8">
            <MoneyBookSelector :books="moneyBooks" :selected-book="selectedBook" :loading="loading"
              :creating-book="creatingBook" @select="selectBook" @create="handleCreateBook" @update="handleUpdateBook"
              @delete="handleDeleteBook" />
          </VCol>

          <!-- Stats Cards (Right - Compact) -->
          <VCol cols="12" md="4" v-if="selectedBook">
            <StatsCards :total-pockets="pockets.length" :total-percentage="totalPercentage"
              :total-allocations="allocations.length" />
          </VCol>
        </VRow>

        <!-- Bottom Row: Pockets + Allocations (only show when book selected) -->
        <VRow v-if="selectedBook">
          <!-- Pockets Manager (Left) -->
          <VCol cols="12" md="4">
            <PocketsManager :pockets="pockets" :loading="loadingPockets" @create="handleCreatePocket"
              @update="handleUpdatePocket" @delete="handleDeletePocket" />
          </VCol>

          <!-- Allocations History (Right) -->
          <VCol cols="12" md="8">
            <AllocationsHistory :allocations="allocations" :loading="loadingAllocations"
              :is-percentage-valid="isPercentageValid" @create="openAllocationDialog"
              @delete="handleDeleteAllocation" />
          </VCol>
        </VRow>
      </VContainer>
    </div>

    <!-- Allocation Dialog -->
    <AllocationDialog v-model="showAllocationDialog" :pockets="pockets" @save="handleCreateAllocation" />
  </DefaultLayout>
</template>

<style scoped>
.dashboard-main {
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 25%, #80deea 75%, #4dd0e1 100%);
  min-height: 100%;
  padding-top: 30px;
  padding-bottom: 40px;
  overflow-x: hidden;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Hide number input spinners */
:deep(input[type="number"]) {
  -moz-appearance: textfield;
  appearance: textfield;
}

:deep(input[type="number"]::-webkit-outer-spin-button),
:deep(input[type="number"]::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

/* Responsive */
@media (max-width: 960px) {
  .dashboard-main {
    padding-top: 20px;
    padding-bottom: 70px;
  }
}
</style>
