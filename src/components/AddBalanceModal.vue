<script setup>
import { ref, watch, computed, onUnmounted } from 'vue'
import starsIcon from '@/assets/icons/stars-icon.svg'
import bankCardIcon from '@/assets/icons/bank-card-icon.svg'

const props = defineProps({
  isOpen: Boolean,
  package: Object
})

const emit = defineEmits(['close', 'pay-stars', 'pay-card'])

// Swipe to close logic
const touchStartY = ref(0)
const touchCurrentY = ref(0)
const modalTranslateY = ref(0)
const isDragging = ref(false)

const scrollPosition = ref(0)

// Reset translate when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    modalTranslateY.value = 0
    scrollPosition.value = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollPosition.value}px`
    document.body.style.width = '100%'
    document.body.style.overflowY = 'scroll'
  } else {
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflowY = ''
    window.scrollTo(0, scrollPosition.value)
  }
})

onUnmounted(() => {
  if (props.isOpen) {
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflowY = ''
    window.scrollTo(0, scrollPosition.value)
  }
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

const starsPrice = computed(() => {
    if (!props.package) return 0
    return Math.ceil(props.package.price * 0.7)
})

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
        
        <div v-if="package" class="modal-body">
          <h2 class="modal-title">Выберите способ оплаты</h2>
          
          <div class="price-display">
            {{ package.price }} ₽
          </div>

          <div class="actions">
            <button class="pay-button stars-button" @click="$emit('pay-stars', package)">
                <div class="button-content">
                    <span>Оплатить</span>
                    <img :src="starsIcon" alt="Stars" width="20" height="20" class="star-icon" />
                    <span>{{ starsPrice }}</span>
                </div>
            </button>

            <button class="pay-button card-button" @click="$emit('pay-card', package)">
                 <div class="button-content">
                    <img :src="bankCardIcon" alt="Card" width="24" height="24" class="card-icon" />
                    <span>Оплатить банковской картой РФ</span>
                 </div>
            </button>
          </div>
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
  font-weight: 500;
  margin: 0 0 20px 0;
  color: #fff;
}

.price-display {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 30px;
    color: white;
}

.actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.pay-button {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pay-button:active {
  opacity: 0.8;
}

.stars-button {
    background: #5856D6; /* Purple for Stars */
    color: white;
}

.card-button {
    background: rgba(88, 86, 214, 0.15); /* Light purple tint */
    color: #5856D6;
}

.button-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

.star-icon {
    margin-bottom: 2px; /* Visual alignment */
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
