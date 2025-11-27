<script setup>
import { ref, onMounted, computed } from 'vue';
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

const originalSettings = ref(null);
const showUnsavedModal = ref(false);
const pendingNavigation = ref(null);

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
    originalSettings.value = {
      name: name.value,
      instructions: instructions.value,
      style: selectedStyle.value
    };
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
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      await apiService.updateSettings(settings);
    }
    // Optionally show success or navigate back
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

const hasChanges = computed(() => {
  if (!originalSettings.value) return false;
  return (
    name.value !== originalSettings.value.name ||
    instructions.value !== originalSettings.value.instructions ||
    selectedStyle.value !== originalSettings.value.style
  );
});

onBeforeRouteLeave((to, from, next) => {
  if (hasChanges.value && !isSaving.value) {
    showUnsavedModal.value = true;
    pendingNavigation.value = next;
  } else {
    next();
  }
});

const confirmExit = () => {
  showUnsavedModal.value = false;
  if (pendingNavigation.value) pendingNavigation.value();
};

const confirmSaveAndExit = async () => {
  showUnsavedModal.value = false;
  await saveSettings();
  if (pendingNavigation.value) pendingNavigation.value();
};
</script>

<template>
  <div class="settings-page">
    <div class="content">
      <div class="form-group">
        <label class="label">Как нейросети к вам обращаться?</label>
        <input v-model="name" type="text" class="input-field" placeholder="Имя" />
      </div>

      <div class="form-group">
        <label class="label">Инструкции для нейросети</label>
        <textarea v-model="instructions" class="textarea-field" placeholder="Здесь можно прописать базовые правила поведения нейросети и настроить её под себя. Например, указать какую роль играть, как структурировать ответы и какие подходы использовать. Эти настройки работают в фоновом режиме и влияют на все ответы системы."></textarea>
      </div>

      <div class="form-group">
        <label class="label">Выберите стиль ответов:</label>
        <div class="styles-list">
          <button v-for="style in styles" :key="style.id" class="style-option" :class="{ active: selectedStyle === style.id }" @click="selectedStyle = style.id">
            <span class="style-label">{{ style.label }}</span>
            <span class="style-desc">{{ style.description }}</span>
          </button>
        </div>
      </div>

      <button class="save-button" :disabled="isSaving" @click="saveSettings">
        {{ isSaving ? 'Сохранение...' : 'Сохранить изменения' }}
      </button>

      <div v-if="error" class="error-message">{{ error }}</div>
    </div>

    <div v-if="showUnsavedModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Настройки не сохранены</h3>
        <p>Вы хотите сохранить изменения перед выходом?</p>
        <div class="modal-buttons">
          <button class="modal-btn save" @click="confirmSaveAndExit">Сохранить</button>
          <button class="modal-btn exit" @click="confirmExit">Выйти</button>
        </div>
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
  background-color: #363457;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #2c2c2e;
  padding: 24px;
  border-radius: 16px;
  width: 80%;
  max-width: 320px;
  text-align: center;
}

.modal-content h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
}

.modal-content p {
  margin: 0 0 24px 0;
  color: #8E8E93;
  font-size: 14px;
  line-height: 1.4;
}

.modal-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.modal-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.modal-btn.save {
  background-color: #363457;
  color: white;
}

.modal-btn.exit {
  background-color: rgba(255, 69, 58, 0.1);
  color: #FF453A;
}
</style>
