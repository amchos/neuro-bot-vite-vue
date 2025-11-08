<script setup>
import { ref, onMounted } from 'vue'
import WebApp from '@twa-dev/sdk'

const allData = ref({})

onMounted(() => {
  WebApp.ready() // обязательно — сообщает Telegram, что WebApp загрузился
  // Получаем все данные из Telegram
  const data = {
    initData: WebApp.initData,
    initDataUnsafe: WebApp.initDataUnsafe,
    themeParams: WebApp.themeParams,
    colorScheme: WebApp.colorScheme,
    viewportHeight: WebApp.viewportHeight,
    viewportStableHeight: WebApp.viewportStableHeight,
    isExpanded: WebApp.isExpanded,
    platform: WebApp.platform,
    version: WebApp.version,
    headerColor: WebApp.headerColor,
    backgroundColor: WebApp.backgroundColor,
  }

  allData.value = data

  console.log('Все данные Telegram WebApp:', data)
  // Отправляем initData на сервер
  fetch('https://promptly.webhop.me/users/auth/telegram/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      initData: WebApp.initData, // строка с hash и user данными
    }),
  })
    .then(async (response) => {
      const result = await response.json()
      console.log('Успешно. Ответ сервера:', result)

    })
    .catch((error) => {
      console.error('фейл. Ошибка при авторизации через Telegram:', error)
    })



})
</script>

<template>
  <div v-if="allData.initData" class="container">
    <h1>📦 Все данные Telegram WebApp</h1>
    <pre>{{ allData }}</pre>
  </div>

  <div v-if="allData.initData === ''"> <a href="https://t.me/test_of_testbot">Open the bot in telegram</a></div>
</template>

<style scoped>
.container {
  font-family: monospace;
  padding: 20px;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>