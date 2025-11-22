<script setup>
import { ref, watch, onUnmounted } from 'vue'
import botChannelIcon from '@/assets/icons/bot-channel-icon.svg'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'check-subscription'])

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

const handleCheckSubscription = () => {
  emit('check-subscription')
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
        
        <div class="modal-body">
          <h2 class="modal-title">Подпишитесь на канал и получите Free+</h2>
          
          <ul class="features-list">
            <li>✓ Интервал: 5 сек</li>
            <li>✓ Распознавание: 2 в день</li>
            <li class="highlight">✦ 10 бесплатных жетонов ежемесячно</li>
          </ul>

          <div class="channel-link">
            <div class="channel-icon">
              <!-- Placeholder circle as in screenshot -->
              <div class="circle-placeholder"></div>
            </div>
            <span class="channel-name">@ccilkanakanal</span>
          </div>

          <button class="check-button" @click="handleCheckSubscription">
            Проверить подписку
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
  max-width: 500px;
  background: #1c1c1e;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  padding-bottom: 40px;
  position: relative;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
  transition: transform 0.1s ease-out;
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

.modal-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 24px 0;
  line-height: 1.4;
  max-width: 80%;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  width: 100%;
  padding-left: 20px; /* Indent slightly */
}

.features-list li {
  color: #8E8E93;
  font-size: 14px;
  text-align: left;
}

.features-list li.highlight {
  color: #8383F5;
}

.channel-link {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.channel-icon {
  width: 32px;
  height: 32px;
}

.circle-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #D9D9D9; /* Light gray placeholder */
}

.channel-name {
  font-size: 16px;
  font-weight: 500;
  color: white;
}

.check-button {
  width: 100%;
  padding: 16px;
  background: #4845d2;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.check-button:active {
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
