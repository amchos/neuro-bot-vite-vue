<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
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

const fetchSettings = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    if (import.meta.env.DEV) {
      // Mock data
      name.value = 'Пользователь';
      instructions.value = '';
      selectedStyle.value = 'ordinary';
    } else {
      const data = await apiService.getSettings();
      
      // If name is empty, try to get from Telegram
      if (!data.name && telegramService.isAvailable) {
        const tgUser = telegramService.getUser();
        if (tgUser) {
          const firstName = tgUser.first_name || '';
          const lastName = tgUser.last_name || '';
          name.value = `${firstName} ${lastName}`.trim();
        } else {
          name.value = '';
        }
      } else {
        name.value = data.name || '';
      }
      
      instructions.value = data.instructions || '';
      selectedStyle.value = data.style || 'ordinary';
    }
  } catch (err) {
    console.error('Failed to fetch settings:', err);
    error.value = 'Не удалось загрузить настройки';
  } finally {
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
    
    // Optional: Show success message or navigate back
    // router.push('/menu'); 
  } catch (err) {
    console.error('Failed to save settings:', err);
    error.value = 'Не удалось сохранить настройки';
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchSettings();
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
