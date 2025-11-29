<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/api';
import historyIcon from '@/assets/icons/history-main-icon.svg';
import balanceIcon from '@/assets/icons/balance-icon.svg'// Placeholder, need to check if exists or use generic
import settingsArrowIcon from '@/assets/icons/settings-arrow-icon.svg'; // Reusing arrow for now if needed, or just remove

const router = useRouter();
const activeTab = ref('write-offs'); // 'write-offs' or 'replenishments'
const transactions = ref([]);
const isLoading = ref(false);
const error = ref(null);

const tabs = [
  { id: 'replenishments', label: 'Пополнения' },
  { id: 'write-offs', label: 'Списания' }
];

const fetchTransactions = async () => {
  isLoading.value = true;
  error.value = null;
  transactions.value = [];
  
  try {
    if (activeTab.value === 'replenishments') {
      // Mock data for development until backend is ready
      if (import.meta.env.DEV) {
        transactions.value = [
          { id: 1, date: '23.12.2002', description: 'Покупка жетонов', amount: 223 },
          { id: 2, date: '23.12.2002', description: 'Подписки Pro', amount: 24 },
          { id: 3, date: '23.12.2002', description: 'Welcome-бонус', amount: 21 },
          { id: 4, date: '23.12.2002', description: 'Реферальная программа', amount: 2 },
        ];
      } else {
        transactions.value = await apiService.getReplenishments();
      }
    } else {
      // Mock data for development until backend is ready
      if (import.meta.env.DEV) {
        transactions.value = [
          { id: 1, date: '23.12.2002', description: 'Gemini 2.5 Pro', amount: -2 },
          { id: 2, date: '23.12.2002', description: 'DeepSeek V3.1', amount: -2 },
          { id: 3, date: '23.12.2002', description: 'DeepSeek V3.1', amount: -2 },
          { id: 4, date: '23.12.2002', description: 'DeepSeek V3.1', amount: -2 },
        ];
      } else {
        transactions.value = await apiService.getWriteOffs();
      }
    }
  } catch (err) {
    console.error('Failed to fetch transactions:', err);
    error.value = 'Не удалось загрузить историю';
  } finally {
    isLoading.value = false;
  }
};

const switchTab = (tabId) => {
  activeTab.value = tabId;
  fetchTransactions();
};

onMounted(() => {
  fetchTransactions();
});
</script>

<template>
  <div class="history-page">
    <div class="header">
      <div class="icon-container">
        <img :src="historyIcon" alt="History" width="40" height="40" />
      </div>
    </div>

    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-button"
        :class="{ active: activeTab === tab.id }"
        @click="switchTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="content">
      <div v-if="isLoading" class="loading">Загрузка...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      
      <div v-else-if="transactions.length === 0" class="empty-state">
        Истории нет
      </div>

      <div v-else class="transaction-list">
        <div 
          v-for="tx in transactions" 
          :key="tx.id" 
          class="transaction-item"
        >
          <div class="tx-left">
            <span class="tx-date">{{ tx.date }}</span>
            <span class="tx-desc">{{ tx.description }}</span>
          </div>
          <div class="tx-right">
            <span class="tx-amount" :class="{ positive: tx.amount > 0 }">
              {{ tx.amount > 0 ? '+ ' : '- ' }}{{ Math.abs(tx.amount) }}
              <span class="currency-icon"><img :src="balanceIcon" alt="Balance" width="16" height="16" /></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-page {
  min-height: 100vh;
  background-color: #1c1c1e;
  color: white;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: "Inter", sans-serif;
}

.header {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 10px;
}

.icon-container {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-container img {
  width: 100%;
  height: 100%;
}

.tabs {
  display: flex;
  gap: 12px;
}

.tab-button {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background-color: #2c2c2e;
  color: #8E8E93;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button.active {
  background-color: #3A3A3C; /* Slightly lighter for active, or use accent color */
  background-color: #363457; /* Matches the screenshot's dark blueish tint */
  color: white;
}

.content {
  flex: 1;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.transaction-item {
  background-color: #2c2c2e;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tx-left {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 12px;
  min-width: 0; /* Important for nested flex truncation */
}

.tx-date {
  color: white;
  font-size: 10px;
  font-weight: 400;
  flex-shrink: 0; /* Prevent date from shrinking */
}

.tx-desc {
  color: white;
  font-size: 12px;
  font-weight: 400;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* Количество строк */
  line-clamp: 1; /* Standard property for compatibility */
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1; /* Take available space */
  min-width: 0; /* Allow shrinking below content size */
  word-break: break-word;
}

.tx-right {
  display: flex;
  align-items: center;
}

.tx-amount {
  font-size: 14px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tx-amount.positive {
  /* color: #4CD964;  Green for positive if desired, but screenshot shows white */
  color: white; 
}

.currency-icon {
  font-size: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: normal;
}

.loading, .error, .empty-state {
  text-align: center;
  color: #8E8E93;
  padding: 40px;
  font-size: 16px;
}
</style>
