<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'

interface Props {
  totalPockets: number
  totalPercentage: number
  totalAllocations: number
}

const props = defineProps<Props>()

const currentDate = computed(() => dayjs().format('DD'))
const currentMonth = computed(() => dayjs().format('MMMM YYYY'))

const percentageColor = computed(() => {
  if (props.totalPercentage < 100) return 'warning'
  if (props.totalPercentage === 100) return 'success'
  return 'error'
})
</script>

<template>
  <VCard class="stats-card" elevation="0">
    <VCardText class="pa-4">
      <div class="stats-container">
        <!-- Pockets Stat -->
        <div class="stat-row">
          <VIcon icon="mdi-wallet-outline" size="24" class="stat-icon" color="primary" />
          <div class="stat-content">
            <div class="stat-header">
              <div class="stat-value">{{ totalPockets }}</div>
              <div class="stat-label">Total Pockets</div>
            </div>
            <div class="stat-extra">
              <VChip :color="percentageColor" size="small" variant="flat" class="percentage-chip">
                {{ totalPercentage.toFixed(2) }}%
              </VChip>
            </div>
          </div>
        </div>

        <VDivider />

        <!-- Allocations Stat -->
        <div class="stat-row">
          <VIcon icon="mdi-chart-arc" size="24" class="stat-icon" color="success" />
          <div class="stat-content">
            <div class="stat-header">
              <div class="stat-value">{{ totalAllocations }}</div>
              <div class="stat-label">Total Allocations</div>
            </div>
          </div>
        </div>

        <VDivider />

        <!-- Date Stat -->
        <div class="stat-row">
          <VIcon icon="mdi-calendar-today" size="24" class="stat-icon" color="info" />
          <div class="stat-content">
            <div class="stat-header">
              <div class="stat-value">{{ currentDate }}</div>
              <div class="stat-label">{{ currentMonth }}</div>
            </div>
          </div>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<style scoped>
.stats-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(15, 118, 110, 0.1);
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
}

.stat-icon {
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
  color: rgba(15, 118, 110, 0.9);
}

.stat-label {
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
}

.stat-extra {
  display: flex;
  align-items: center;
}

.percentage-chip {
  font-weight: 600;
  font-size: 13px;
}
</style>
