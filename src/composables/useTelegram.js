import { ref, computed, onMounted, onUnmounted } from 'vue';
import telegramService from '@/services/telegram';

/**
 * Composable для работы с Telegram WebApp
 * Предоставляет reactive данные и методы для работы с Telegram
 */
export function useTelegram() {
  // ===== REACTIVE STATE =====
  
  const tg = telegramService.tg;
  const isAvailable = ref(telegramService.isAvailable);
  
  // Данные пользователя
  const user = ref(null);
  const userId = ref(null);
  const initData = ref('');
  const startParam = ref('');
  
  // UI состояние
  const colorScheme = ref('dark');
  const themeParams = ref({});
  const isExpanded = ref(false);
  const viewportHeight = ref(0);
  
  // ===== COMPUTED =====
  
  const userName = computed(() => user.value?.first_name || '');
  const userUsername = computed(() => user.value?.username || '');
  const isPremium = computed(() => user.value?.is_premium || false);
  const languageCode = computed(() => user.value?.language_code || 'ru');
  
  const isDarkTheme = computed(() => colorScheme.value === 'dark');
  const isLightTheme = computed(() => colorScheme.value === 'light');
  
  // ===== МЕТОДЫ =====
  
  /**
   * Инициализация Telegram WebApp
   */
  const init = () => {
    if (!isAvailable.value) {
      console.warn('Telegram WebApp недоступен');
      return;
    }

    // Инициализация через сервис
    telegramService.init();
    
    // Получаем данные пользователя
    user.value = telegramService.getUser();
    userId.value = telegramService.getUserId();
    initData.value = telegramService.getInitData();
    startParam.value = telegramService.getStartParam();
    
    // Получаем параметры UI
    colorScheme.value = telegramService.getColorScheme();
    themeParams.value = telegramService.getThemeParams();
    isExpanded.value = telegramService.isExpanded();
    viewportHeight.value = telegramService.getViewportHeight();
  };

  /**
   * Показать Alert
   */
  const showAlert = async (message) => {
    hapticLight();
    return await telegramService.showAlert(message);
  };

  /**
   * Показать Confirm
   */
  const showConfirm = async (message) => {
    hapticLight();
    return await telegramService.showConfirm(message);
  };

  /**
   * Показать Popup с кнопками
   */
  const showPopup = async (params) => {
    hapticLight();
    return await telegramService.showPopup(params);
  };

  // ===== HAPTIC FEEDBACK =====
  
  const hapticLight = () => telegramService.hapticLight();
  const hapticMedium = () => telegramService.hapticMedium();
  const hapticHeavy = () => telegramService.hapticHeavy();
  const hapticSelection = () => telegramService.hapticSelection();
  const hapticSuccess = () => telegramService.hapticSuccess();
  const hapticError = () => telegramService.hapticError();
  const hapticWarning = () => telegramService.hapticWarning();

  // ===== ГЛАВНАЯ КНОПКА =====
  
  const showMainButton = (text, onClick) => {
    telegramService.showMainButton(text, onClick);
  };

  const hideMainButton = () => {
    telegramService.hideMainButton();
  };

  const setMainButtonText = (text) => {
    tg?.MainButton.setText(text);
  };

  const enableMainButton = () => {
    telegramService.enableMainButton();
  };

  const disableMainButton = () => {
    telegramService.disableMainButton();
  };

  const showMainButtonProgress = () => {
    telegramService.showMainButtonProgress();
  };

  const hideMainButtonProgress = () => {
    telegramService.hideMainButtonProgress();
  };

  // ===== КНОПКА НАЗАД =====
  
  const showBackButton = (onClick) => {
    telegramService.showBackButton(onClick);
  };

  const hideBackButton = () => {
    telegramService.hideBackButton();
  };

  // ===== НАВИГАЦИЯ =====
  
  const close = () => {
    telegramService.close();
  };

  const openLink = (url, options) => {
    hapticLight();
    telegramService.openLink(url, options);
  };

  const openTelegramLink = (url) => {
    hapticLight();
    telegramService.openTelegramLink(url);
  };

  const sendData = (data) => {
    telegramService.sendData(data);
  };

  // ===== СОБЫТИЯ =====
  
  const handleThemeChange = () => {
    colorScheme.value = telegramService.getColorScheme();
    themeParams.value = telegramService.getThemeParams();
    telegramService.applyTheme();
  };

  const handleViewportChange = () => {
    viewportHeight.value = telegramService.getViewportHeight();
    isExpanded.value = telegramService.isExpanded();
  };

  // ===== LIFECYCLE =====
  
  onMounted(() => {
    init();
    
    // Подписываемся на события
    telegramService.on('themeChanged', handleThemeChange);
    telegramService.on('viewportChanged', handleViewportChange);
  });

  onUnmounted(() => {
    // Отписываемся от событий
    telegramService.off('themeChanged', handleThemeChange);
    telegramService.off('viewportChanged', handleViewportChange);
  });

  // ===== RETURN =====
  
  return {
    // Объект Telegram
    tg,
    isAvailable,
    
    // Данные пользователя
    user,
    userId,
    userName,
    userUsername,
    isPremium,
    languageCode,
    initData,
    startParam,
    
    // UI состояние
    colorScheme,
    themeParams,
    isDarkTheme,
    isLightTheme,
    isExpanded,
    viewportHeight,
    
    // Методы
    init,
    showAlert,
    showConfirm,
    showPopup,
    
    // Haptic
    hapticLight,
    hapticMedium,
    hapticHeavy,
    hapticSelection,
    hapticSuccess,
    hapticError,
    hapticWarning,
    
    // Главная кнопка
    showMainButton,
    hideMainButton,
    setMainButtonText,
    enableMainButton,
    disableMainButton,
    showMainButtonProgress,
    hideMainButtonProgress,
    
    // Кнопка назад
    showBackButton,
    hideBackButton,
    
    // Навигация
    close,
    openLink,
    openTelegramLink,
    sendData
  };
}