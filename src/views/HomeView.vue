<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import apiService from '@/services/api'

const appStore = useAppStore()

// Computed properties
const userBalance = computed(() => appStore.userBalance || 0)

// Mock Data for Models (matching the screenshot)
const modelCategories = ref([
  {
    title: 'Быстрые',
    cost: 0,
    items: [
      { id: 'gpt-5-nano', name: 'GPT-5 nano', icon: 'gpt' },
      { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite', icon: 'gemini' },
      { id: 'grok-3-mini', name: 'Grok 3 Mini', icon: 'grok' }
    ]
  },
  {
    title: 'Базовые',
    cost: 1,
    items: [
      { id: 'gpt-5-mini', name: 'GPT-5 Mini', icon: 'gpt' },
      { id: 'claude-haiku-3.5', name: 'Claude Haiku 3.5', icon: 'claude' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', icon: 'gemini' },
      { id: 'deepseek-v3.1', name: 'DeepSeek V3.1', icon: 'deepseek' }
    ]
  },
  {
    title: 'Умные',
    cost: 2,
    items: [
      { id: 'gpt-5', name: 'GPT-5', icon: 'gpt' },
      { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', icon: 'claude' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', icon: 'gemini' },
      { id: 'grok-4', name: 'Grok 4', icon: 'grok' }
    ]
  }
])

// Actions
const handleTopUp = () => {
  console.log('Top up clicked')
  // TODO: Implement top up logic
}

const handleChats = () => {
  console.log('Chats clicked')
  // TODO: Navigate to chats
}

const handleInvite = () => {
  console.log('Invite clicked')
  // TODO: Implement invite logic
}

const handleModelSelect = (model) => {
  console.log('Selected model:', model)
  // TODO: Navigate to chat with model
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
      <div class="app-title">
        <span>Telegram MiniApp</span>
        <span class="subtitle">Mini app</span>
      </div>
      <button class="icon-button more-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="5" cy="12" r="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="19" cy="12" r="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Balance Section -->
    <div class="balance-section">
      <div class="balance-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#8E8E93" stroke-width="2"/>
          <path d="M12 8V16" stroke="#8E8E93" stroke-width="2" stroke-linecap="round"/>
          <path d="M8 12H16" stroke="#8E8E93" stroke-width="2" stroke-linecap="round"/>
          <path d="M12 7L10 17" stroke="#8E8E93" stroke-width="2" stroke-linecap="round"/>
          <path d="M14 7L12 17" stroke="#8E8E93" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="balance-amount">{{ userBalance }}</div>
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
              <!-- Placeholder Icons based on model type -->
              <svg v-if="model.icon === 'gpt'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="white"/>
              </svg>
              <svg v-else-if="model.icon === 'gemini'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="white"/>
              </svg>
              <svg v-else-if="model.icon === 'claude'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
                <path d="M12 6V18M6 12H18" stroke="white" stroke-width="2"/>
              </svg>
              <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="white" stroke-width="2"/>
              </svg>
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
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #1c1c1e;
  color: white;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* Top Bar */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.app-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 17px;
  font-weight: 600;
}

.subtitle {
  font-size: 12px;
  color: #8E8E93;
  font-weight: 400;
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

.balance-icon {
  margin-bottom: 12px;
}

.balance-amount {
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 4px;
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
  background: #1c1c1e; /* Transparent/Same as bg */
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
</style>
