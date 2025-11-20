<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// Computed properties для отображения
const userName = computed(() => appStore.userName || 'Пользователь')
const userBalance = computed(() => appStore.userBalance || 0)
</script>

<template>
  <div class="home">
    <div class="header">
      <h1>👋 Привет, {{ userName }}!</h1>
      <p class="balance">Баланс: {{ userBalance }} токенов</p>
    </div>

    <div class="content">
      <div class="card">
        <h2>🤖 Neuro Bot</h2>
        <p>Добро пожаловать в Telegram Mini App!</p>
        <p>Авторизация прошла успешно.</p>
      </div>

      <div class="info">
        <h3>Информация о пользователе:</h3>
        <pre>{{ JSON.stringify(appStore.user, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  padding: 20px;
  background: var(--tg-bg-color, #fff);
  color: var(--tg-text-color, #000);
}

.header {
  margin-bottom: 30px;
}

.header h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.balance {
  font-size: 16px;
  color: var(--tg-button-color, #007aff);
  font-weight: 600;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  padding: 20px;
  background: var(--tg-button-color, #007aff);
  color: var(--tg-button-text-color, white);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.card p {
  margin: 5px 0;
  line-height: 1.5;
}

.info {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 12px;
}

.info h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}

.info pre {
  overflow-x: auto;
  font-size: 12px;
  white-space: pre-wrap;
  color: #333;
  background: white;
  padding: 15px;
  border-radius: 8px;
}
</style>
