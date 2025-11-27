<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import proSubIcon from '@/assets/icons/pro-sub-icon.svg'
import freeSubIcon from '@/assets/icons/free-sub-icon.svg'
import FreePlusModal from '@/components/FreePlusModal.vue'

const router = useRouter()

const activeIndex = ref(0)
const isFreePlusModalOpen = ref(false)

const scrollTo = (index) => {
  activeIndex.value = index
  const container = document.querySelector('.tariffs-slider')
  const width = container.offsetWidth
  container.scrollTo({
    left: width * index,
    behavior: 'smooth'
  })
}

const onScroll = (e) => {
  const container = e.target
  const width = container.offsetWidth
  const scrollLeft = container.scrollLeft
  activeIndex.value = Math.round(scrollLeft / width)
}

const goBack = () => {
  router.back()
}

const openFreePlusModal = () => {
  isFreePlusModalOpen.value = true
}

const closeFreePlusModal = () => {
  isFreePlusModalOpen.value = false
}

const handleCheckSubscription = () => {
  console.log('Checking subscription...')
  // Logic to check subscription
  closeFreePlusModal()
}

// Mouse Drag Logic
const isDown = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

const onMouseDown = (e) => {
  isDown.value = true
  const container = e.currentTarget
  startX.value = e.pageX - container.offsetLeft
  scrollLeft.value = container.scrollLeft
  // container.style.cursor = 'grabbing'
  container.style.scrollBehavior = 'auto' // Disable smooth scroll while dragging
  container.style.scrollSnapType = 'none' // Disable snap while dragging
}

const onMouseLeave = (e) => {
  if (!isDown.value) return
  isDown.value = false
  handleSnap(e.currentTarget)
}

const onMouseUp = (e) => {
  if (!isDown.value) return
  isDown.value = false
  handleSnap(e.currentTarget)
}

const handleSnap = (container) => {
  const width = container.offsetWidth
  const scrollLeft = container.scrollLeft
  const nearestIndex = Math.round(scrollLeft / width)
  
  // Smooth scroll to nearest slide
  container.scrollTo({
    left: nearestIndex * width,
    behavior: 'smooth'
  })
  
  // Restore snap after animation
  setTimeout(() => {
    container.style.scrollSnapType = 'x mandatory'
    container.style.scrollBehavior = 'smooth'
  }, 500)
}

const onMouseMove = (e) => {
  if (!isDown.value) return
  e.preventDefault()
  const container = e.currentTarget
  const x = e.pageX - container.offsetLeft
  const walk = (x - startX.value) * 1 // Natural 1:1 scroll
  container.scrollLeft = scrollLeft.value - walk
}
</script>

<template>
  <div class="tariffs-page">
    <div class="header">
      <h1 class="page-title">Выберите тариф</h1>
    </div>

    <div 
      class="tariffs-slider" 
      @scroll="onScroll"
      @mousedown="onMouseDown"
      @mouseleave="onMouseLeave"
      @mouseup="onMouseUp"
      @mousemove="onMouseMove"
    >
      <!-- Pro Plan -->
      <div class="tariff-card pro-card">
        <div class="card-content">
          <div class="tariff-icon">
            <img :src="proSubIcon" alt="Pro" width="64" height="64" />
          </div>
          <h2 class="tariff-title">Pro</h2>
          <p class="tariff-subtitle">Роскошный максимум</p>

          <div class="tariff-price">
            <span class="price-value">499 ₽</span>
            <span class="price-period"> / месяц</span>
          </div>

          <button class="action-button pro-button">
            Оформить ✦ Pro
          </button>

          <ul class="features-list">
            <li>✓ Без интервалов между сообщениями</li>
            <li>✓ Голосовой ввод</li>
            <li>✓ Распознавание фото/файлов без лимита</li>
            <li>✓ Без рекламы</li>
            <li class="highlight">✦ 100 жетонов при оформлении</li>
            <li>✓ Скидка 5% на покупку жетонов</li>
          </ul>
        </div>
      </div>

      <!-- Free Plan -->
      <div class="tariff-card free-card">
        <div class="card-content">
          <div class="tariff-icon">
            <img :src="freeSubIcon" alt="Free" width="64" height="64" />
          </div>
          <h2 class="tariff-title">Free</h2>
          <p class="tariff-subtitle">Базовый минимум</p>

          <div class="tariff-price">
            <span class="price-value">0 ₽</span>
            <span class="price-period"> / месяц</span>
          </div>

          <div class="buttons-group">
            <button class="action-button secondary-button" disabled>
              Ваш текущий план
            </button>
            <button class="action-button pro-button" @click="openFreePlusModal">
              Перейти на Free+
            </button>
          </div>

          <ul class="features-list">
            <li>✓ Общение с нейросетью</li>
            <li>✓ Интервал между сообщениями: 10 сек</li>
            <li>✓ Распознавание фото/файлов: 1 в день</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="pagination">
      <div 
        class="dot" 
        :class="{ active: activeIndex === 0 }"
        @click="scrollTo(0)"
      ></div>
      <div 
        class="dot" 
        :class="{ active: activeIndex === 1 }"
        @click="scrollTo(1)"
      ></div>
    </div>

    <FreePlusModal 
      :is-open="isFreePlusModalOpen"
      @close="closeFreePlusModal"
      @check-subscription="handleCheckSubscription"
    />
  </div>
</template>

<style scoped>
.tariffs-page {
  height: 100vh;
  background-color: #1c1c1e;
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  padding: 20px;
  text-align: center;
  flex-shrink: 0;
}

.page-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0;
}

.tariffs-slider {
  flex: 1;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  gap: 16px;
  padding: 0 16px;
  align-items: center;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
}

.tariffs-slider::-webkit-scrollbar {
  display: none;
}

.tariff-card {
  flex: 0 0 100%;
  scroll-snap-align: center;
  height: 100%;
  background: #2c2c2e;
  border-radius: 24px;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* Pro Card Gradient Border effect if needed, but screenshot shows solid dark card */
/* Adding subtle glow or specific styling for Pro if needed */

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tariff-icon {
  margin-bottom: 16px;
  width: 64px;
  height: 64px;
}

.tariff-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.tariff-subtitle {
  color: #8383F5; /* Blueish purple from screenshot */
  font-size: 15px;
  margin: 0 0 24px 0;
}

.tariff-price {
  margin-bottom: 24px;
  display: flex;
  align-items: baseline;
}

.price-value {
  font-size: 32px;
  font-weight: 700;
}

.price-period {
  color: #8E8E93;
  font-size: 15px;
  margin-left: 8px;
}

.action-button {
  width: 100%;
  padding: 12px 16px;
  border-radius: 14px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
}

.pro-button {
  background: #4845d2;
  color: white;
}

.secondary-button {
  background: #3a3a3c;
  color: #8E8E93;
}

.buttons-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.buttons-group .action-button {
  margin-bottom: 0;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.features-list li {
  color: #8E8E93;
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  line-height: 1.4;
}

.features-list li.highlight {
  color: #8383F5;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  flex-shrink: 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3a3a3c;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dot.active {
  background: white;
  width: 24px;
  border-radius: 4px;
}

@media (max-height: 660px) {
  .header {
    padding: 12px;
  }
  
  .tariff-card {
    padding: 20px;
  }

  .tariff-icon {
    width: 56px;
    height: 56px;
    margin-bottom: 12px;
  }

  .tariff-title {
    font-size: 28px;
  }

  .tariff-subtitle {
    font-size: 14px;
    margin-bottom: 16px;
  }

  .tariff-price {
    margin-bottom: 16px;
  }

  .price-value {
    font-size: 28px;
  }

  .action-button {
    padding: 12px;
    font-size: 15px;
    margin-bottom: 16px;
  }

  .buttons-group {
    margin-bottom: 16px;
    gap: 10px;
  }

  .features-list {
    gap: 10px;
  }

  .features-list li {
    font-size: 13px;
  }
  
  .pagination {
    padding: 12px;
  }
}
</style>
