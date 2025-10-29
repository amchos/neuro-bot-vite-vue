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
  <div>
    <h1>Telegram WebApp InitData Test</h1>
    <h2>{{ JSON.parse(user) }}</h2>
    <h2>{{ user }}</h2>
    <h2>{{ user.text }}</h2>
  </div>
</template>