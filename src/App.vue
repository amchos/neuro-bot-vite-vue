<script setup>
import { ref, onMounted } from 'vue'
import WebApp from '@twa-dev/sdk'

const responseTest = ref('Загрузка...')
const responseDebug = ref({})

onMounted(async () => {
  WebApp.ready()
  
  if (!WebApp.initData) {
    responseTest.value = 'Ошибка: initData отсутствует'
    return
  }

  try {
    console.log('Отправка запроса...')
    
    const response = await fetch('https://promptly.webhop.me/users/auth/telegram/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        initData: WebApp.initData,
      }),
    })

    // ✅ Логируем всё о ответе
    console.log('Response status:', response.status)
    console.log('Response statusText:', response.statusText)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    console.log('Response URL:', response.url)
    console.log('Response type:', response.type)

    responseDebug.value = {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url,
      type: response.type
    }

    // ✅ Читаем как текст сначала
    const responseText = await response.text()
    console.log('Response text (first 500 chars):', responseText.substring(0, 500))

    // Пробуем распарсить JSON
    let result
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      console.error('Не удалось распарсить JSON:', e)
      console.error('Полный ответ:', responseText)
      throw new Error(`Сервер вернул HTML вместо JSON. Status: ${response.status}. Response: ${responseText.substring(0, 200)}`)
    }

    if (!response.ok || result.error) {
      throw new Error(result.error || `HTTP ${response.status}`)
    }

    responseTest.value = `✅ Успешно! ${JSON.stringify(result)}`
    console.log('✅ Успешная авторизация:', result)

  } catch (error) {
    responseTest.value = `❌ ${error.message}`
    console.error('❌ Полная ошибка:', error)
  }
})
</script>

<template>
  <div class="container">
    <h1>Telegram Auth Debug</h1>
    
    <div class="status">
      <h2>Статус:</h2>
      <p style="word-break: break-word;">{{ responseTest }}</p>
    </div>

    <div v-if="Object.keys(responseDebug).length" class="debug">
      <h2>Response Debug:</h2>
      <pre>{{ JSON.stringify(responseDebug, null, 2) }}</pre>
    </div>

    <div class="actions">
      <button @click="$router.go(0)">Повторить</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  font-family: system-ui;
  color: black;
}

.status, .debug {
  margin: 20px 0;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

pre {
  overflow-x: auto;
  font-size: 11px;
  white-space: pre-wrap;
}

.actions {
  margin: 20px 0;
}

button {
  padding: 10px 20px;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>