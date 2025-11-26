<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import balanceIcon from '@/assets/icons/balance-icon.svg'
import addBalanceIcon from '@/assets/icons/add-balance-icon.svg'
import chatsIcon from '@/assets/icons/chats-icon.svg'
import inviteIcon from '@/assets/icons/invite-icon.svg'
import settingsIcon from '@/assets/icons/settings-icon.svg'
import ModelCategory from '@/components/ModelCategory.vue'
import ModelDetailsModal from '@/components/ModelDetailsModal.vue'
import ProBanner from '@/components/ProBanner.vue'

import { useTelegram } from '@/composables/useTelegram'

const appStore = useAppStore()
const router = useRouter()
const { showAlert } = useTelegram()

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
  router.push('/add-balance')
}

const handleChats = () => {
  showAlert('Чаты находятся в разработке')
}

const handleInvite = () => {
  router.push('/invite')
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
        <button class="icon-button menu-button" @click="router.push('/menu')">
          <img :src="settingsIcon" alt="Menu" width="24" height="24" />
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
            <img :src="addBalanceIcon" alt="Top Up" width="24" height="24" />
          </div>
          <span>Пополнить</span>
        </button>

        <button class="action-card" @click="handleChats">
          <div class="action-icon">
            <img :src="chatsIcon" alt="Chats" width="24" height="24" />
          </div>
          <span>Чаты</span>
        </button>

        <button class="action-card" @click="handleInvite">
          <div class="action-icon">
            <img :src="inviteIcon" alt="Invite" width="24" height="24" />
          </div>
          <span>Пригласить</span>
        </button>
      </div>
      <!-- Pro Subscription Banner -->
      <ProBanner />
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

.pro-icon {
  width: 1rem;
  height: 1rem;
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
