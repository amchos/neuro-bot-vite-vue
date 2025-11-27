<script setup>
import { useRouter } from 'vue-router'
import ProBanner from '@/components/ProBanner.vue'
import neuroSettingsIcon from '@/assets/icons/neuro-settings-icon.svg'
import historyIcon from '@/assets/icons/history-main-icon.svg'
import addHomeIcon from '@/assets/icons/add-home-icon.svg'
import botChannelIcon from '@/assets/icons/bot-channel-icon.svg'
import newsChannelIcon from '@/assets/icons/referal-menu-icon.svg'
import supportIcon from '@/assets/icons/support-icon.svg'
import settingsArrowIcon from '@/assets/icons/settings-arrow-icon.svg'

const router = useRouter()

const menuItems = [
  { id: 'settings', title: 'Настройки нейросети', icon: neuroSettingsIcon, route: '/settings' },
  { id: 'history', title: 'История операций', icon: historyIcon, route: '/history' },
  { id: 'add-home', title: 'Добавить на экран "Домой"', icon: addHomeIcon, action: 'addToHome' },
  { id: 'channel', title: 'Канал бота', icon: botChannelIcon, url: 'https://t.me/bot_channel' },
  { id: 'news', title: 'Новостной канал про нейросети', icon: newsChannelIcon, url: 'https://t.me/news_channel' },
  { id: 'support', title: 'Поддержка', icon: supportIcon, url: 'https://t.me/support' }
]

const footerItems = [
  { id: 'terms', title: 'Пользовательское соглашение', url: '/terms' },
  { id: 'privacy', title: 'Политика конфиденциальности', url: '/privacy' }
]

const handleItemClick = (item) => {
  if (item.route) {
    // router.push(item.route) // Routes not implemented yet
    console.log('Navigate to', item.route)
  } else if (item.url) {
    window.open(item.url, '_blank')
  } else if (item.action) {
    console.log('Action:', item.action)
  }
}
</script>

<template>
  <div class="menu-page">
    <div class="menu-content">
      <ProBanner />

      <div class="menu-list">
        <button 
          v-for="item in menuItems" 
          :key="item.id" 
          class="menu-item"
          @click="handleItemClick(item)"
        >
          <div class="item-left">
            <div class="item-icon">
              <img :src="item.icon" :alt="item.title" width="24" height="24" />
            </div>
            <span class="item-title">{{ item.title }}</span>
          </div>
          <div class="item-right">
            <img :src="settingsArrowIcon" alt=">" width="11" height="12" class="arrow-right" />
          </div>
        </button>
      </div>

      <div class="footer-list">
        <button 
          v-for="item in footerItems" 
          :key="item.id" 
          class="menu-item footer-item"
          @click="handleItemClick(item)"
        >
          <span class="item-title">{{ item.title }}</span>
          <div class="item-right">
            <img :src="settingsArrowIcon" alt=">" width="11" height="12" class="arrow-right" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-page {
  min-height: 100vh;
  background-color: #1c1c1e;
  color: white;
  padding: 16px;
  box-sizing: border-box;
}

.menu-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.menu-list, .footer-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  background: #2c2c2e;
  border: none;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

.menu-item:active {
  background: #3a3a3c;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-title {
  font-size: 16px;
  color: white;
  font-weight: 500;
}

.footer-item .item-title {
  color: #8E8E93;
}

.arrow-right {
  opacity: 0.5;
}

.menu-list .menu-item:nth-child(-n+3) {
  margin-bottom: 15px;
}
</style>
