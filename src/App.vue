<script setup>
import { onMounted, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { useRouter, useRoute } from 'vue-router'
import telegramService from '@/services/telegram'

const appStore = useAppStore()
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  // Инициализируем приложение (Telegram + авторизация)
  await appStore.init()
})

// Управление кнопкой "Назад"
watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName && newRouteName !== 'home') {
      telegramService.showBackButton(() => {
        router.back()
      })
    } else {
      telegramService.hideBackButton()
    }
  }
)
</script>

<template>
  <div class="app">
    <!-- Показываем загрузку во время авторизации -->
    <div v-if="appStore.isAuthenticating" class="loading-screen">
      <div class="loading-content">
        <h1>Загрузка...</h1>
        <p>Авторизация в Telegram</p>
      </div>
    </div>

    <!-- Показываем ошибку если есть -->
    <div v-else-if="appStore.hasAuthError" class="error-screen">
      <div class="error-content">
        <h1>❌ Ошибка авторизации</h1>
        <p>{{ appStore.authError }}</p>
        
        <div v-if="appStore.debugInfo" class="debug-info">
          <h2>Debug информация:</h2>
          <pre>{{ JSON.stringify(appStore.debugInfo, null, 2) }}</pre>
        </div>
        
        <button @click="appStore.authenticate()" class="retry-button">
          Повторить
        </button>
      </div>
    </div>

    <!-- Основное приложение -->
    <router-view v-else />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
}

.loading-screen,
.error-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.loading-content,
.error-content {
  text-align: center;
  max-width: 500px;
}

.loading-content h1 {
  font-size: 24px;
  margin-bottom: 10px;
  color: var(--tg-text-color, #000);
}

.loading-content p {
  color: var(--tg-text-color, #666);
}

.error-content h1 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #ff3b30;
}

.error-content p {
  margin-bottom: 20px;
  color: var(--tg-text-color, #666);
  word-break: break-word;
}

.debug-info {
  margin: 20px 0;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: left;
}

.debug-info h2 {
  font-size: 14px;
  margin-bottom: 10px;
}

.debug-info pre {
  overflow-x: auto;
  font-size: 11px;
  white-space: pre-wrap;
  color: #333;
}

.retry-button {
  padding: 12px 24px;
  background: var(--tg-button-color, #007aff);
  color: var(--tg-button-text-color, white);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.retry-button:hover {
  opacity: 0.8;
}

.retry-button:active {
  opacity: 0.6;
}
</style>