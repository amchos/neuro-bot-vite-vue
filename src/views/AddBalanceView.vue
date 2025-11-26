<script setup>
import { ref } from 'vue'
import ProBanner from '@/components/ProBanner.vue'
import balanceIcon from '@/assets/icons/balance-icon.svg'
import fireIcon from '@/assets/icons/fire-icon.svg'
import proSubIcon from '@/assets/icons/pro-sub-icon.svg'

// Token Packages Data
const tokenPackages = [
  {
    id: 'tokens-60',
    amount: 60,
    description: 'хватит на ≈30 — 60 ответов нейросети',
    price: 600,
    pricePerToken: 23,
    icon: 'balance',
    isPopular: false
  },
  {
    id: 'tokens-110',
    amount: 110,
    description: 'хватит на ≈55 — 110 ответов нейросети',
    price: 600,
    pricePerToken: 23,
    icon: 'balance',
    isPopular: false
  },
  {
    id: 'tokens-230',
    amount: 230,
    description: 'хватит на ≈115 — 230 ответов нейросети',
    price: 600,
    pricePerToken: 23,
    icon: 'balance',
    isPopular: false
  },
  {
    id: 'tokens-480',
    amount: 480,
    description: 'хватит на ≈240 — 480 ответов нейросети',
    price: 600,
    pricePerToken: 23,
    icon: 'fire',
    isPopular: true
  },
  {
    id: 'tokens-1000',
    amount: 1000,
    description: 'хватит на ≈500 — 1000 ответов нейросети',
    price: 600,
    pricePerToken: 23,
    icon: 'balance',
    isPopular: false
  }
]

const selectedPackage = ref(null)

const selectPackage = (pkg) => {
  selectedPackage.value = pkg
}

const handleBuy = () => {
  if (selectedPackage.value) {
    console.log('Buying package:', selectedPackage.value)
    // Implement buy logic here
  }
}
</script>

<template>
  <div class="add-balance-page">
    <div class="header">
      <h1 class="page-title">Пополнение баланса</h1>
    </div>

    <div class="content">
      <!-- Subscription Section -->
      <div class="section-header">Подписка</div>
      <ProBanner 
        title="PRO" 
        subtitle="Нажмите, чтобы выбрать тариф" 
        :show-arrow="true"
      />

      <!-- Tokens Section -->
      <div class="section-header">Жетоны</div>
      <div class="tokens-list">
        <div 
          v-for="pkg in tokenPackages" 
          :key="pkg.id"
          class="token-card"
          :class="{ 'selected': selectedPackage?.id === pkg.id }"
          @click="selectPackage(pkg)"
        >
          <div class="icon-placeholder">
            <img v-if="pkg.icon === 'fire'" :src="fireIcon" alt="Popular" class="fire-icon-img" />
          </div>
          
          <div class="card-content-wrapper">
            <div class="top-row">
              <div class="amount-container">
                <span class="token-amount">{{ pkg.amount }}</span>
                <div class="token-icon-small">
                  <img :src="balanceIcon" alt="Token" width="100%" height="100%" />
                </div>
              </div>
              <div class="token-price">{{ pkg.price }} ₽</div>
            </div>

            <div class="bottom-row">
              <div class="token-desc">{{ pkg.description }}</div>
              <div class="token-price-per">{{ pkg.pricePerToken }} ₽ за жетон</div>
            </div>
          </div>
          <div class="icon-placeholder">
          </div>
        </div>
      </div>
    </div>

    <!-- Buy Button Container -->
    <div class="buy-container">
      <Transition name="fade-slide">
        <button 
          v-if="selectedPackage" 
          class="buy-button" 
          @click="handleBuy"
        >
          Купить
        </button>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.add-balance-page {
  min-height: 100vh;
  background-color: #1c1c1e;
  color: white;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  padding-bottom: 80px; /* Space for button */
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

.content {
  padding: 0 16px;
  flex: 1;
}

.section-header {
  font-size: 20px;
  font-weight: 600;
  color: #8E8E93;
  margin-bottom: 12px;
  margin-top: 12px;
}

.section-header:first-child {
  margin-top: 0;
}

.tokens-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.token-card {
  display: flex;
  align-items: center;
  height: 90px;
  background: #2c2c2e;
  border-radius: 16px;
  padding: 11px 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.token-card.selected {
  background: #4845d2; /* Selected background color */
  border-color: #5e5ce6;
}

.icon-placeholder { 
  width: 25px;
  height: 25px;
}

.fire-icon-img {
    width: 100%;
    height: 100%;
}

.card-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding: 0 5px;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.amount-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.token-amount {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
}

.token-icon-small {
  width: 16px;
  height: 16px;
  opacity: 0.8;
}

.token-desc {
  font-size: 0.6rem;
  color: #8E8E93;
  width: 60%;
}

.token-card.selected .token-desc {
  color: rgba(255, 255, 255, 0.7);
}

.token-price {
  font-size: 1rem;
  font-weight: 600;
  color: white;
}

.token-price-per {
  font-size: 0.6rem;
  color: #8E8E93;
  text-align: right;
}

.token-card.selected .token-price-per {
  color: rgba(255, 255, 255, 0.7);
}

.buy-container {
  position: fixed;
  bottom: 20px;
  left: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  pointer-events: none;
  z-index: 10;
}

.buy-button {
  width: 100%;
  padding: 16px;
  background: #5856D6;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(88, 86, 214, 0.4);
  pointer-events: auto;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
