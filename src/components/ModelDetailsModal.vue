<script setup>
import { ref, watch } from 'vue'
import gptIcon from '@/assets/icons/gpt-icon.svg'
import claudeIcon from '@/assets/icons/claude-icon.svg'
import deepseekIcon from '@/assets/icons/deepseek-icon.svg'
import geminiIcon from '@/assets/icons/gemini-icon.svg'
import grokIcon from '@/assets/icons/grok-icon.svg'

const props = defineProps({
  isOpen: Boolean,
  model: Object
})

const emit = defineEmits(['close', 'select'])

// Swipe to close logic
const touchStartY = ref(0)
const touchCurrentY = ref(0)
const modalTranslateY = ref(0)
const isDragging = ref(false)

// Reset translate when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    modalTranslateY.value = 0
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Clean up on unmount
import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.body.style.overflow = ''
})

const onTouchStart = (e) => {
  touchStartY.value = e.touches[0].clientY
  isDragging.value = true
}

const onTouchMove = (e) => {
  if (!isDragging.value) return
  
  touchCurrentY.value = e.touches[0].clientY
  const diff = touchCurrentY.value - touchStartY.value
  
  // Only allow dragging downwards
  if (diff > 0) {
    modalTranslateY.value = diff
  }
}

const onTouchEnd = () => {
  handleDragEnd()
}

// Mouse events
const onMouseDown = (e) => {
  touchStartY.value = e.clientY
  isDragging.value = true
}

const onMouseMove = (e) => {
  if (!isDragging.value) return
  
  touchCurrentY.value = e.clientY
  const diff = touchCurrentY.value - touchStartY.value
  
  // Only allow dragging downwards
  if (diff > 0) {
    modalTranslateY.value = diff
  }
}

const onMouseUp = () => {
  handleDragEnd()
}

const onMouseLeave = () => {
  if (isDragging.value) {
    handleDragEnd()
  }
}

const handleDragEnd = () => {
  isDragging.value = false
  
  // Threshold to close (e.g., 100px)
  if (modalTranslateY.value > 100) {
    emit('close')
  } else {
    // Reset position
    modalTranslateY.value = 0
  }
}

const handleSelect = () => {
  emit('select', props.model)
}
</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-backdrop" @click="$emit('close')">
      <div 
        class="modal-content" 
        @click.stop
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseLeave"
        :style="{ transform: `translateY(${modalTranslateY}px)` }"
      >
        <div class="modal-handle-bar">
          <div class="modal-handle"></div>
        </div>
        
        <div v-if="model" class="modal-body">
          <div class="modal-icon-large">
            <img v-if="model.icon === 'gpt'" :src="gptIcon" alt="gpt Icon" width="64" height="64" />
            <img v-else-if="model.icon === 'claude'" :src="claudeIcon" alt="claude Icon" width="64" height="64" />
            <img v-else-if="model.icon === 'gemini'" width="64" height="64" :src="geminiIcon">
            <img v-else-if="model.icon === 'grok'" :src="grokIcon" alt="grok icon">
            <img v-else width="64" height="64" :src="deepseekIcon">
          </div>
          
          <h2 class="modal-title">{{ model.name }}</h2>
          <p class="modal-company">Компания: {{ model.company }}</p>
          
          <div class="modal-description">
            <p class="description-label">Кто это:</p>
            <p class="description-text">{{ model.description }}</p>
          </div>

          <div class="modal-cost">
            <span class="cost-value">{{ model.cost || 0 }}</span>
            <span class="cost-unit">за ответ</span>
          </div>

          <button class="select-button" @click="handleSelect">
            Выбрать
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal-content {
  width: 100%;
  max-width: 500px; /* Limit width on tablets */
  background: #1c1c1e;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  padding-bottom: 40px; /* Safe area for bottom */
  position: relative;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
  transition: transform 0.1s ease-out; /* Smooth drag */
}

.modal-handle-bar {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.modal-handle {
  width: 40px;
  height: 4px;
  background: #3a3a3c;
  border-radius: 2px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.modal-icon-large {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.modal-company {
  color: #8E8E93;
  font-size: 14px;
  margin-bottom: 24px;
}

.modal-description {
  text-align: center;
  margin-bottom: 24px;
  max-width: 90%;
}

.description-label {
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.description-text {
  color: #8E8E93;
  font-size: 14px;
  line-height: 1.4;
}

.modal-cost {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 24px;
}

.cost-value {
  font-size: 20px;
  font-weight: 700;
}

.cost-unit {
  color: #8E8E93;
  font-size: 14px;
}

.select-button {
  width: 100%;
  padding: 16px;
  background: #4845d2; /* Purple-ish color from screenshot */
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.select-button:active {
  opacity: 0.8;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(100%);
}
</style>
