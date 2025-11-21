<script setup>
import geminiIcon from '@/assets/icons/gemini-icon.svg'
</script>

<template>
  <div class="pro-banner">
    <div class="pro-content">
      <div class="pro-icon">
        <img :src="geminiIcon" alt="Pro" width="100%" height="100%" />
      </div>
      <span class="pro-title">Подписка Pro</span>
    </div>
    <span class="pro-date">до 18.08.2025</span>
  </div>
</template>

<style scoped>
.pro-banner {
  position: relative;
  border-radius: 14px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
  z-index: 0;
}

.pro-banner::before {
  content: "";
  position: absolute;
  inset: -1px;
  z-index: -1;
  background: linear-gradient(90deg, #8E44AD, #ff00cc, #8E44AD, #ff00cc);
  background-size: 300% 100%;
  border-radius: 15px;
  animation: border-shimmer 3s linear infinite;
}

.pro-banner::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(90deg, #2c2c2e 0%, #3a3a3c 100%);
  border-radius: 14px;
}

@keyframes border-shimmer {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 0%; }
}

.pro-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pro-icon {
  width: 1rem;
  height: 1rem;
}

.pro-title {
  font-weight: 600;
  font-size: 15px;
  color: white;
}

.pro-date {
  color: #8E8E93;
  font-size: 13px;
}
</style>
