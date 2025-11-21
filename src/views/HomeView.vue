<script setup>
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import balanceIcon from '@/assets/icons/balance-icon.svg'
import ModelCategory from '@/components/ModelCategory.vue'
import ModelDetailsModal from '@/components/ModelDetailsModal.vue'

const appStore = useAppStore()

// Computed properties
const userBalance = computed(() => appStore.userBalance || 0)

// Modal State
const isModalOpen = ref(false)
const selectedModel = ref(null)

// Mock Data for Models (matching the screenshot)
const modelCategories = ref([
  {
    title: 'Быстрые',
    cost: 0,
    items: [
      { 
        id: 'gpt-5-nano', 
        name: 'GPT-5 nano', 
        icon: 'gpt',
        company: 'OpenAI',
        description: 'Младшая модель семейства GPT-5; приоритет — минимальная задержка и низкая стоимость.'
      },
      { 
        id: 'gemini-2.5-flash-lite', 
        name: 'Gemini 2.5 Flash-Lite', 
        icon: 'gemini',
        company: 'Google',
        description: 'Легкая и быстрая модель от Google, оптимизированная для простых задач.'
      },
      { 
        id: 'grok-3-mini', 
        name: 'Grok 3 Mini', 
        icon: 'grok',
        company: 'xAI',
        description: 'Компактная версия Grok, предназначенная для быстрых ответов.'
      }
    ]
  },
  {
    title: 'Базовые',
    cost: 1,
    items: [
      { 
        id: 'gpt-5-mini', 
        name: 'GPT-5 Mini', 
        icon: 'gpt',
        company: 'OpenAI',
        description: 'Сбалансированная модель для повседневных задач.'
      },
      { 
        id: 'claude-haiku-3.5', 
        name: 'Claude Haiku 3.5', 
        icon: 'claude',
        company: 'Anthropic',
        description: 'Быстрая и эффективная модель от Anthropic.'
      },
      { 
        id: 'gemini-2.5-flash', 
        name: 'Gemini 2.5 Flash', 
        icon: 'gemini',
        company: 'Google',
        description: 'Универсальная модель с высокой скоростью работы.'
      },
      { 
        id: 'deepseek-v3.1', 
        name: 'DeepSeek V3.1', 
        icon: 'deepseek',
        company: 'DeepSeek',
        description: 'Мощная открытая модель для кода и текста.'
      }
    ]
  },
  {
    title: 'Умные',
    cost: 2,
    items: [
      { 
        id: 'gpt-5', 
        name: 'GPT-5', 
        icon: 'gpt',
        company: 'OpenAI',
        description: 'Флагманская модель с передовыми возможностями рассуждения.'
      },
      { 
        id: 'claude-sonnet-4', 
        name: 'Claude Sonnet 4', 
        icon: 'claude',
        company: 'Anthropic',
        description: 'Продвинутая модель для сложных аналитических задач.'
      },
      { 
        id: 'gemini-2.5-pro', 
        name: 'Gemini 2.5 Pro', 
        icon: 'gemini',
        company: 'Google',
        description: 'Профессиональная модель для мультимодальных задач.'
      },
      { 
        id: 'grok-4', 
        name: 'Grok 4', 
        icon: 'grok',
        company: 'xAI',
        description: 'Самая мощная модель от xAI с доступом к реальным данным.'
      }
    ]
  }
])

// Actions
const handleTopUp = () => {
  console.log('Top up clicked')
}

const handleChats = () => {
  console.log('Chats clicked')
}

const handleInvite = () => {
  console.log('Invite clicked')
}

const handleModelSelect = (model, categoryCost) => {
  selectedModel.value = { ...model, cost: categoryCost }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    selectedModel.value = null
  }, 300)
}

const handleSelectModel = (model) => {
  console.log('Selected model for chat:', model)
  closeModal()
  // TODO: Navigate to chat
}
</script>

<template>
  <div class="home">
    <div class="fixed-header">
      <!-- Header / Top Bar -->
      <div class="top-bar">
        <button class="icon-button menu-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Balance Section -->
      <div class="balance-section">
        <div class="balance-section-wrapper">
          <div class="balance-icon">
            <img :src="balanceIcon" alt="Balance" width="100%" height="100%" />
          </div>
          <div class="balance-amount">{{ userBalance }}</div>
        </div>
        <div class="balance-label">Баланс</div>
      </div>

      <!-- Action Buttons -->
      <div class="actions-grid">
        <button class="action-card" @click="handleTopUp">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <span>Пополнить</span>
        </button>

        <button class="action-card" @click="handleChats">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span>Чаты</span>
        </button>

        <button class="action-card" @click="handleInvite">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M20 8V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23 11H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span>Пригласить</span>
        </button>
      </div>

      <!-- Pro Subscription Banner -->
      <div class="pro-banner">
        <div class="pro-content">
          <div class="pro-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
            </svg>
          </div>
          <span class="pro-title">Подписка Pro</span>
        </div>
        <span class="pro-date">до 18.08.2025</span>
      </div>
    </div>

    <!-- Models List -->
    <div class="models-list">
      <ModelCategory 
        v-for="(category, index) in modelCategories" 
        :key="index" 
        :category="category"
        @select-model="(model) => handleModelSelect(model, category.cost)"
      />
    </div>

    <!-- Model Details Modal -->
    <ModelDetailsModal 
      :is-open="isModalOpen"
      :model="selectedModel"
      @close="closeModal"
      @select="handleSelectModel"
    />
  </div>
</template>

<style scoped>
.home {
  height: 100vh;
  background-color: #1c1c1e;
  color: white;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 0; /* Remove bottom padding from container */
}

.fixed-header {
  flex-shrink: 0;
}

/* Top Bar */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.icon-button {
  background: none;
  border: none;
  color: white;
  padding: 8px;
  cursor: pointer;
}

/* Balance Section */
.balance-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.balance-section-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.balance-icon {
  width: 2.5rem;
  height: 2.5rem;
}

.balance-amount {
  font-size: 2.5rem;
  font-weight: 700;
}

.balance-label {
  color: #8E8E93;
  font-size: 14px;
}

/* Actions Grid */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.action-card {
  background: #2c2c2e;
  border: none;
  border-radius: 14px;
  padding: 12px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-card:active {
  background: #3a3a3c;
  border: none;
  border-radius: 14px;
}

.action-card span {
  color: #fff;
  font-size: 12px;
  font-weight: 500;
}

.action-icon {
  color: #fff;
  transform: scale(0.9);
}

/* Pro Banner */
.pro-banner {
  background: linear-gradient(90deg, #2c2c2e 0%, #3a3a3c 100%);
  border: 1px solid #8E44AD;
  border-radius: 14px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
}

.pro-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pro-title {
  font-weight: 600;
  font-size: 15px;
}

.pro-date {
  color: #8E8E93;
  font-size: 13px;
}

/* Models List */
.models-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  overflow-y: auto;
  /* Hide scrollbar for cleaner look */
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding-bottom: 40px; /* Space for bottom */
}

.models-list::-webkit-scrollbar {
  display: none;
}
</style>
