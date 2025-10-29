<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const tg = window.Telegram.WebApp
  tg.ready() // сигнал Telegram, что WebApp готов
  alert('initData:', tg.initData)
  alert('initDataUnsafe:', tg.initDataUnsafe)
})
</script>

<template>
  <div>
    <h1>Telegram WebApp Init Test</h1>
  </div>
</template>