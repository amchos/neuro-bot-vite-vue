<script setup>
import { ref, onMounted } from 'vue'
import WebApp from '@twa-dev/sdk'

const allData = ref({})
const responseTest = ref('Загрузка...')

onMounted(() => {
  WebApp.ready()
  
  // Получаем все данные из Telegram
  const data = {
    initData: WebApp.initData,
    initDataUnsafe: WebApp.initDataUnsafe,
  }

  allData.value = data

  console.log('=== ДИАГНОСТИКА ===')
  console.log('initData exists:', !!WebApp.initData)
  console.log('initData length:', WebApp.initData?.length)
  console.log('initData:', WebApp.initData)
  console.log('Parsed initDataUnsafe:', WebApp.initDataUnsafe)

  // Проверка наличия initData
  if (!WebApp.initData) {
    responseTest.value = 'Ошибка: initData отсутствует. Откройте приложение через Telegram!'
    console.error('WebApp.initData пустой')
    return
  }

  // Отправляем initData на сервер
  fetch('https://promptly.webhop.me/users/auth/telegram/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      initData: WebApp.initData,
    }),
  })
    .then(async (response) => {
      const result = await response.json()
      
      // ✅ ВАЖНО: проверяем статус И содержимое ответа
      if (!response.ok || result.error) {
        throw new Error(result.error || `HTTP ${response.status}`)
      }
      
      responseTest.value = `✅ Успешно! Ответ: ${JSON.stringify(result)}`
      console.log('✅ Успешная авторизация:', result)
      
      // Здесь можно сохранить токен, перенаправить пользователя и т.д.
      // localStorage.setItem('token', result.token)
    })
    .catch((error) => {
      responseTest.value = `❌ Ошибка авторизации: ${error.message}`
      console.error('❌ Ошибка при авторизации:', error)
      
      // Дополнительная диагностика
      console.log('Проверьте:')
      console.log('1. Bot token на сервере корректный?')
      console.log('2. Приложение открыто через Telegram?')
      console.log('3. initData содержит hash?', WebApp.initData?.includes('hash='))
    })
})
</script>

<template>
  <div class="container">
    <h1>Telegram Web App Auth</h1>
    
    <div class="status">
      <h2>Статус:</h2>
      <p>{{ responseTest }}</p>
    </div>
    
    <div class="debug">
      <h2>Debug Info:</h2>
      <pre>{{ JSON.stringify(allData, null, 2) }}</pre>
    </div>
      <div>
        <p>initData length: {{ allData.initData?.length }}</p>
        <p>Has hash: {{ allData.initData?.includes('hash=') }}</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  font-family: system-ui;
  color: black;
}

.status {
  margin: 20px 0;
  padding: 15px;
  background: #f0f0f0;
  border-radius: 8px;
}

.debug {
  margin: 20px 0;
  padding: 15px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
}

pre {
  overflow-x: auto;
  font-size: 12px;
}
</style>