<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import apiService from '@/services/api';
import telegramService from '@/services/telegram';

const router = useRouter();
const isLoading = ref(false);
const isSaving = ref(false);
const error = ref(null);

const name = ref('');
const instructions = ref('');
const selectedStyle = ref('ordinary');

const styles = [
  { id: 'ordinary', label: 'Обычный', description: 'стандартные ответы' },
  { id: 'educational', label: 'Обучающий', description: 'пошаговое объяснение с акцентом на основы' },
  { id: 'concise', label: 'Лаконичный', description: 'краткие и сжатые ответы по сути' },
  { id: 'formal', label: 'Официальный', description: 'чёткие и хорошо структурированные ответы' }
];

const initialSettings = ref(null);

const fetchSettings = async () => {
  isLoading.value = true;
  error.value = null;
  console.log('fetchSettings started. DEV mode:', import.meta.env.DEV);
  
  try {
    if (import.meta.env.DEV) {
      console.log('Using mock data for settings');
      name.value = 'Пользователь';
      instructions.value = '';
      selectedStyle.value = 'ordinary';
    } else {
      console.log('Fetching settings from API...');
      const data = await apiService.getSettings();
      console.log('API Response:', data);
      
      // If name is empty, try to get from Telegram
      if (!data?.name && telegramService.isAvailable) {
        const tgUser = telegramService.getUser();
        if (tgUser) {
          const firstName = tgUser.first_name || '';
          const lastName = tgUser.last_name || '';
          name.value = `${firstName} ${lastName}`.trim();
        } else {
          name.value = '';
        }
      } else {
        name.value = data?.name || '';
      }
      
      instructions.value = data?.instructions || '';
      selectedStyle.value = data?.style || 'ordinary';
    }
  } catch (err) {
    console.error('Failed to fetch settings:', err);
    error.value = 'Не удалось загрузить настройки';
    
    // Even on error, we should probably set initial values to current (empty) 
    // so that we don't block navigation if they just leave.
    // OR we can leave it as null to indicate "not loaded".
    // But if we want to allow editing "from scratch" even if load failed:
  } finally {
    // Always set initial settings to what we have now, 
    // so that "no changes" is the baseline state.
    initialSettings.value = {
      name: name.value,
      instructions: instructions.value,
      style: selectedStyle.value
    };
    console.log('Initial settings set to:', initialSettings.value);
    isLoading.value = false;
  }
};

const saveSettings = async () => {
  isSaving.value = true;
  error.value = null;
  
  try {
    const settings = {
      name: name.value,
      instructions: instructions.value,
      style: selectedStyle.value
    };

    if (import.meta.env.DEV) {
      console.log('Saving settings (mock):', settings);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    } else {
      await apiService.updateSettings(settings);
    }
    
    // Update initial settings to match saved state
    initialSettings.value = { ...settings };
    
    // Optional: Show success message or navigate back
    // router.push('/menu'); 
  } catch (err) {
    console.error('Failed to save settings:', err);
    error.value = 'Не удалось сохранить настройки';
  } finally {
    isSaving.value = false;
  }
};

const hasUnsavedChanges = computed(() => {
  if (!initialSettings.value) return false;
  const isDirty = name.value !== initialSettings.value.name ||
                  instructions.value !== initialSettings.value.instructions ||
                  selectedStyle.value !== initialSettings.value.style;
  console.log('hasUnsavedChanges:', isDirty, {
    current: { name: name.value, instructions: instructions.value, style: selectedStyle.value },
    initial: initialSettings.value
  });
  return isDirty;
});

watch(hasUnsavedChanges, (newValue) => {
  console.log('Unsaved changes state changed:', newValue);
  if (newValue) {
    telegramService.enableClosingConfirmation();
  } else {
    telegramService.disableClosingConfirmation();
  }
});

const showUnsavedChangesPopup = (onConfirm, onDiscard, onCancel) => {
  console.log('Showing unsaved changes popup');
  telegramService.showPopup({
    title: 'Несохраненные изменения',
    message: 'У вас есть несохраненные изменения. Сохранить их перед выходом?',
    buttons: [
      { id: 'save', type: 'default', text: 'Сохранить' },
      { id: 'discard', type: 'destructive', text: 'Оставить как есть' },
      { id: 'cancel', type: 'cancel', text: 'Отмена' }
    ]
  }).then(async (buttonId) => {
    console.log('Popup button clicked:', buttonId);
    if (buttonId === 'save') {
      await saveSettings();
      if (!error.value) {
        onConfirm();
      } else {
        // If save failed, we should probably cancel navigation so user can fix it
        if (onCancel) onCancel();
      }
    } else if (buttonId === 'discard') {
      onDiscard();
    } else {
      // Cancel or close
      if (onCancel) onCancel();
    }
  });
};

const handleBackClick = () => {
  console.log('Back button clicked');
  router.back();
};

onMounted(() => {
  fetchSettings();
  telegramService.showBackButton(handleBackClick);
});

onUnmounted(() => {
  telegramService.disableClosingConfirmation();
  telegramService.hideBackButton();
});

onBeforeRouteLeave((to, from, next) => {
  console.log('onBeforeRouteLeave triggered');
  if (hasUnsavedChanges.value) {
    console.log('Preventing navigation due to unsaved changes');
    showUnsavedChangesPopup(
      () => {
        console.log('Confirmed save, proceeding navigation');
        next();
      },
      () => {
        console.log('Discarded changes, proceeding navigation');
        next();
      },
      () => {
        console.log('Cancelled navigation');
        next(false);
      }
    );
  } else {
    console.log('No unsaved changes, proceeding navigation');
    next();
  }
});
</script>

<template>
  <div class="settings-page">
    <div class="content">
      <div class="form-group">
        <label class="label">Как нейросети к вам обращаться?</label>
        <input 
          v-model="name" 
          type="text" 
          class="input-field" 
          placeholder="Имя"
        />
      </div>

      <div class="form-group">
        <label class="label">Инструкции для нейросети</label>
        <textarea 
          v-model="instructions" 
          class="textarea-field" 
          placeholder="Здесь можно прописать базовые правила поведения нейросети и настроить её под себя. Например, указать какую роль играть, как структурировать ответы и какие подходы использовать. Эти настройки работают в фоновом режиме и влияют на все ответы системы."
        ></textarea>
      </div>

      <div class="form-group">
        <label class="label">Выберите стиль ответов:</label>
        <div class="styles-list">
          <button 
            v-for="style in styles" 
            :key="style.id"
            class="style-option"
            :class="{ active: selectedStyle === style.id }"
            @click="selectedStyle = style.id"
          >
            <span class="style-label">{{ style.label }}</span>
            <span class="style-desc">{{ style.description }}</span>
          </button>
        </div>
      </div>

      <button 
        class="save-button" 
        :disabled="isSaving"
        @click="saveSettings"
      >
        {{ isSaving ? 'Сохранение...' : 'Сохранить изменения' }}
      </button>

      <div v-if="error" class="error-message">{{ error }}</div>

      <!-- DEBUG INFO -->
      <div style="margin-top: 20px; padding: 10px; background: #333; font-size: 10px; font-family: monospace;">
        <p>Has Unsaved Changes: {{ hasUnsavedChanges }}</p>
        <p>Name: '{{ name }}' (Initial: '{{ initialSettings?.name }}')</p>
        <p>Instructions: '{{ instructions }}' (Initial: '{{ initialSettings?.instructions }}')</p>
        <p>Style: '{{ selectedStyle }}' (Initial: '{{ initialSettings?.style }}')</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  min-height: 100vh;
  background-color: #1c1c1e;
  color: white;
  padding: 20px;
  font-family: "Inter", sans-serif;
  box-sizing: border-box;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.label {
  font-size: 16px;
  color: #8E8E93;
  font-weight: 400;
}

.input-field {
  background-color: #2c2c2e;
  border: none;
  border-radius: 12px;
  padding: 16px;
  color: white;
  font-size: 16px;
  outline: none;
}

.input-field::placeholder {
  color: #48484A;
}

.textarea-field {
  background-color: #2c2c2e;
  border: none;
  border-radius: 12px;
  padding: 16px;
  color: white;
  font-size: 14px;
  outline: none;
  min-height: 150px;
  resize: none;
  line-height: 1.5;
}

.textarea-field::placeholder {
  color: #48484A;
}

.styles-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.style-option {
  height: 60px;
  background-color: #2c2c2e;
  border: none;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.style-option.active {
  background-color: #363457; /* Matches the screenshot's dark blueish tint */
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.style-label {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.style-desc {
  font-size: 12px;
  color: #8E8E93;
  max-width: 60%;
  text-align: right;
}

.save-button {
  background-color: #363457;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
  transition: opacity 0.2s;
}

.save-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #FF453A;
  text-align: center;
  font-size: 14px;
}
</style>
