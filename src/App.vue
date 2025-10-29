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
})
</script>

<template>
  <div class="container">
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