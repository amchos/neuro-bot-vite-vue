<script setup>
import { useRouter } from 'vue-router'
import referalMainIcon from '@/assets/icons/referal-main-icon.svg'
import balanceIcon from '@/assets/icons/balance-icon.svg'
import longArrowIcon from '@/assets/icons/long-arrow-icon.svg'
import telegramService from '@/services/telegram'

const router = useRouter()

const handleBack = () => {
  router.back()
}

const handleInvite = () => {
  // TODO: Implement actual invite logic via Telegram
  console.log('Invite button clicked')
  telegramService.hapticLight()
}
</script>

<template>
  <div class="invite-page">
    <div class="content-wrapper">
      <!-- Header Icon -->
      <div class="header-icon">
        <img :src="referalMainIcon" alt="Friends" width="100%" height="100%" />
      </div>

      <!-- Title -->
      <h1 class="title">
        Приглашайте друзей 
        <img :src="longArrowIcon" class="arrow-icon" alt="->" />
        <br />
        <img :src="longArrowIcon" class="arrow-icon" alt="->" />
        получайте жетоны
      </h1>

      <!-- Stats -->
      <div class="stats">
        <div class="stat-row">
          <span class="stat-label">Приглашено:</span>
          <span class="stat-value">23</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Получено токенов:</span>
          <span class="stat-value">23</span>
        </div>
      </div>

      <!-- Invite Button -->
      <button class="invite-button" @click="handleInvite">
        Отправить приглашение
      </button>

      <!-- Rewards -->
      <div class="rewards-section">
        <!-- Reward 1 -->
        <div class="reward-item">
          <div class="reward-amount">
            1
            <img :src="balanceIcon" class="token-icon" alt="Token" />
          </div>
          <p class="reward-desc">
            за каждого друга,<br />
            который запустит бота
          </p>
        </div>

        <!-- Reward 2 -->
        <div class="reward-item">
          <div class="reward-amount">10%</div>
          <p class="reward-desc">
            от первого пополнения<br />
            баланса друга
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      * Жетоны можно тратить на использование любых нейросетей
    </div>
  </div>
</template>

<style scoped>
.invite-page {
  min-height: 100vh;
  background-color: #1c1c1e;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
}

.content-wrapper {
  /* flex: 1; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.header-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.title {
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 16px;
}

.arrow-icon {
  display: inline-block;
  width: 24px;
  height: 12px;
  vertical-align: middle;
  margin: 0 4px;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
  text-align: center;
}

.stat-row {
  font-size: 15px;
  color: #8E8E93;
}

.stat-value {
  color: white;
  font-weight: 600;
  margin-left: 4px;
}

.invite-button {
  width: 100%;
  background-color: #3F3F68; /* Matching the purple/blue button in design */
  color: white;
  border: none;
  border-radius: 14px;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 16px;
  transition: opacity 0.2s;
}

.invite-button:active {
  opacity: 0.8;
}

.rewards-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  text-align: center;
}

.reward-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.reward-amount {
  font-size: 48px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1;
}

.token-icon {
  width: 32px;
  height: 32px;
  opacity: 0.6;
}

.reward-desc {
  font-size: 15px;
  line-height: 1.3;
  color: white;
}

.footer {
  text-align: center;
  font-size: 13px;
  color: #8E8E93;
  padding-bottom: 20px;
  margin-top: auto;
}
</style>
