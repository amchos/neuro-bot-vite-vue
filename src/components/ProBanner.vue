<script setup>
import { useRouter } from 'vue-router'
import geminiIcon from '@/assets/icons/gemini-icon.svg'
import arrowIcon from '@/assets/icons/arrow-icon.svg'

const props = defineProps({
  title: {
    type: String,
    default: 'Подписка Pro'
  },
  subtitle: {
    type: String,
    default: 'до 18.08.2025'
  },
  showArrow: {
    type: Boolean,
    default: false
  },
  iconSrc: {
    type: String,
    default: geminiIcon
  }
})

const router = useRouter()

const handleBannerClick = () => {
  router.push('/tariffs')
}
</script>

<template>
  <div class="pro-banner" @click="handleBannerClick">
    <div class="pro-content">
      <div class="pro-icon">
        <img :src="iconSrc" alt="Pro" width="100%" height="100%" />
      </div>
      <div class="text-content">
        <span class="pro-title">{{ title }}</span>
        <span class="pro-subtitle">{{ subtitle }}</span>
      </div>
    </div>
    <div v-if="showArrow" class="arrow-icon">
      <img :src="arrowIcon" alt="Arrow" width="100%" height="100%" />
    </div>
  </div>
</template>

<style scoped>
.pro-banner {
  position: relative;
  border-radius: 14px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
  z-index: 0;
  min-height: 48px;
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
  gap: 12px;
}

.pro-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pro-title {
  font-weight: 700;
  font-size: 16px;
  color: white;
  line-height: 1.2;
}

.pro-subtitle {
  color: #8E8E93;
  font-size: 13px;
  line-height: 1.2;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  opacity: 0.6;
}
</style>
