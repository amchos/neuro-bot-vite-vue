<script setup>
import WebApp from '@twa-dev/sdk'
import { ref, onMounted } from 'vue'

const user = ref(null)
onMounted(() => {
  console.log('initData:', WebApp.initData)
  console.log('initDataUnsafe:', WebApp.initDataUnsafe)
  user.value = WebApp.initDataUnsafe.user
})
</script>

<template>

    <div v-if="user">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Имя:</strong> {{ user.first_name }}</p>
      <p><strong>Фамилия:</strong> {{ user.last_name }}</p>
      <p><strong>Username:</strong> {{ user.username }}</p>
      <p><strong>Язык:</strong> {{ user.language_code }}</p>
    </div>

    <div v-else>
      <p>Нет данных — запусти внутри Telegram 📱</p>
    </div>
</template>