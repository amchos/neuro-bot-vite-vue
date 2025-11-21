<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import apiService from '@/services/api'
import balanceIcon from '@/assets/icons/balance-icon.svg'
import gptIcon from '@/assets/icons/gpt-icon.svg'
import claudeIcon from '@/assets/icons/claude-icon.svg'
import deepseekIcon from '@/assets/icons/deepseek-icon.svg'
import geminiIcon from '@/assets/icons/gemini-icon.svg'

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

const handleModelSelect = (model) => {
  selectedModel.value = model
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  // Delay clearing selected model to allow animation to finish
  setTimeout(() => {
    selectedModel.value = null
  }, 300)
}

const handleSelectModel = () => {
  console.log('Selected model for chat:', selectedModel.value)
  closeModal()
  // TODO: Navigate to chat
}
</script>

<template>
  <div class="home">
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

    <!-- Models List -->
    <div class="models-list">
      <div v-for="(category, index) in modelCategories" :key="index" class="category-section">
        <div class="category-header">
          <span class="category-title">{{ category.title }}</span>
          <span class="category-cost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="cost-icon">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            {{ category.cost }} за ответ
          </span>
        </div>

        <div class="models-grid">
          <div v-for="model in category.items" :key="model.id" class="model-item" @click="handleModelSelect(model)">
            <div class="model-icon-wrapper">
              <img v-if="model.icon === 'gpt'" :src="gptIcon" alt="gpt Icon" width="24" height="24" />
              <img v-else-if="model.icon === 'claude'" :src="claudeIcon" alt="claude Icon" width="24" height="24" />
              <img v-else-if="model.icon === 'gemini'" width="24" height="24" :src="geminiIcon">
              <img v-else width="24" height="24" :src="deepseekIcon">
            </div>
            <span class="model-name">{{ model.name }}</span>
            <button class="model-more">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="1" fill="#666"/>
                <circle cx="5" cy="12" r="1" fill="#666"/>
                <circle cx="19" cy="12" r="1" fill="#666"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Model Details Modal -->
    <Transition name="modal">
      <div v-if="isModalOpen" class="modal-backdrop" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-handle-bar">
            <div class="modal-handle"></div>
          </div>
          
          <div v-if="selectedModel" class="modal-body">
            <div class="modal-icon-large">
              <img v-if="selectedModel.icon === 'gpt'" :src="gptIcon" alt="gpt Icon" width="64" height="64" />
              <img v-else-if="selectedModel.icon === 'claude'" :src="claudeIcon" alt="claude Icon" width="64" height="64" />
              <img v-else-if="selectedModel.icon === 'gemini'" width="64" height="64" :src="geminiIcon">
              <img v-else width="64" height="64" :src="deepseekIcon">
            </div>
            
            <h2 class="modal-title">{{ selectedModel.name }}</h2>
            <p class="modal-company">Компания: {{ selectedModel.company }}</p>
            
            <div class="modal-description">
              <p class="description-label">Кто это:</p>
              <p class="description-text">{{ selectedModel.description }}</p>
            </div>

            <div class="modal-cost">
              <span class="cost-value">{{ selectedModel.cost || 0 }}</span>
              <span class="cost-unit">за ответ</span>
            </div>

            <button class="select-button" @click="handleSelectModel">
              Выбрать
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #1c1c1e;
  color: white;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  padding-bottom: 40px; /* Space for scrolling past bottom */
}

/* Top Bar */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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
  margin-bottom: 32px;
}

.balance-section-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.balance-icon {
  width: 3rem;
  height: 3rem;
}

.balance-amount {
  font-size: 3rem;
  font-weight: 700;
}

.balance-label {
  color: #8E8E93;
  font-size: 16px;
}

/* Actions Grid */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.action-card {
  background: #2c2c2e;
  border: none;
  border-radius: 14px;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-card:active {
  background: #3a3a3c;
}

.action-card span {
  color: #fff;
  font-size: 13px;
  font-weight: 500;
}

.action-icon {
  color: #fff;
}

/* Pro Banner */
.pro-banner {
  background: linear-gradient(90deg, #2c2c2e 0%, #3a3a3c 100%);
  border: 1px solid #8E44AD;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  cursor: pointer;
}

.pro-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pro-title {
  font-weight: 600;
  font-size: 16px;
}

.pro-date {
  color: #8E8E93;
  font-size: 14px;
}

/* Models List */
.models-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
}

.category-title {
  font-size: 16px;
  color: #8E8E93;
}

.category-cost {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #8E8E93;
}

.cost-icon {
  width: 14px;
  height: 14px;
}

.models-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.model-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #1c1c1e;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.model-item:hover {
  background: #2c2c2e;
}

.model-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2c2c2e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.model-name {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
}

.model-more {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #666;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal-content {
  width: 100%;
  max-width: 500px; /* Limit width on tablets */
  background: #1c1c1e;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  padding-bottom: 40px; /* Safe area for bottom */
  position: relative;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
}

.modal-handle-bar {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.modal-handle {
  width: 40px;
  height: 4px;
  background: #3a3a3c;
  border-radius: 2px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.modal-icon-large {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.modal-company {
  color: #8E8E93;
  font-size: 14px;
  margin-bottom: 24px;
}

.modal-description {
  text-align: center;
  margin-bottom: 24px;
  max-width: 90%;
}

.description-label {
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.description-text {
  color: #8E8E93;
  font-size: 14px;
  line-height: 1.4;
}

.modal-cost {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 24px;
}

.cost-value {
  font-size: 20px;
  font-weight: 700;
}

.cost-unit {
  color: #8E8E93;
  font-size: 14px;
}

.select-button {
  width: 100%;
  padding: 16px;
  background: #4845d2; /* Purple-ish color from screenshot */
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.select-button:active {
  opacity: 0.8;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(100%);
}
</style>
