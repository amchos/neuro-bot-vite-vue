<script setup>
import gptIcon from '@/assets/icons/gpt-icon.svg'
import claudeIcon from '@/assets/icons/claude-icon.svg'
import deepseekIcon from '@/assets/icons/deepseek-icon.svg'
import geminiIcon from '@/assets/icons/gemini-icon.svg'
import grokIcon from '@/assets/icons/grok-icon.svg'

defineProps({
  category: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select-model'])

const onSelectModel = (model) => {
  emit('select-model', model)
}
</script>

<template>
  <div class="category-section">
    <div class="category-header">
      <span class="category-title">{{ category.title }}</span>
      <span class="category-cost">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="cost-icon">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M12 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        {{ category.cost }} за ответ
      </span>
    </div>

    <div class="models-grid">
      <div v-for="model in category.items" :key="model.id" class="model-item" @click="onSelectModel(model)">
        <div class="model-icon-wrapper">
          <img v-if="model.icon === 'gpt'" :src="gptIcon" alt="gpt Icon" width="24" height="24" />
          <img v-else-if="model.icon === 'claude'" :src="claudeIcon" alt="claude Icon" width="24" height="24" />
          <img v-else-if="model.icon === 'gemini'" width="24" height="24" :src="geminiIcon">
          <img v-else-if="model.icon === 'grok'" :src="grokIcon" alt="grok icon">
          <img v-else width="24" height="24" :src="deepseekIcon">
        </div>
        <span class="model-name">{{ model.name }}</span>
        <button class="model-more">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="1" fill="#666"/>
            <circle cx="5" cy="12" r="1" fill="#666"/>
            <circle cx="19" cy="12" r="1" fill="#666"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
}

.category-title {
  font-size: 16px;
  color: #8E8E93;
}

.category-cost {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #8E8E93;
}

.cost-icon {
  width: 14px;
  height: 14px;
}

.models-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.model-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #1c1c1e;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.model-item:hover {
  background: #2c2c2e;
}

.model-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2c2c2e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.model-name {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
}

.model-more {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #666;
}
</style>
