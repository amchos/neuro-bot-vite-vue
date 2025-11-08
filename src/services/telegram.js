// Получаем объект Telegram WebApp
const tg = window.Telegram?.WebApp;

/**
 * Сервис для работы с Telegram WebApp API
 */
class TelegramService {
  constructor() {
    this.tg = tg;
    this.isAvailable = !!tg;
  }

  // ===== ИНИЦИАЛИЗАЦИЯ =====
  
  /**
   * Инициализировать приложение
   */
  init() {
    if (!this.isAvailable) {
      console.warn('Telegram WebApp is not available');
      return;
    }

    // Сообщаем Telegram что приложение готово
    this.tg.ready();
    
    // Разворачиваем на весь экран
    this.tg.expand();
    
    // Включаем подтверждение при закрытии
    this.tg.enableClosingConfirmation();
    
    // Применяем цвета темы
    this.applyTheme();
  }

  // ===== ДАННЫЕ ПОЛЬЗОВАТЕЛЯ =====
  
  /**
   * Получить initData (для отправки на бэкенд)
   */
  getInitData() {
    return this.tg?.initData || '';
  }

  /**
   * Получить данные пользователя
   */
  getUser() {
    return this.tg?.initDataUnsafe?.user || null;
  }

  /**
   * Получить start параметр
   */
  getStartParam() {
    return this.tg?.initDataUnsafe?.start_param || '';
  }

  /**
   * Получить ID пользователя
   */
  getUserId() {
    return this.getUser()?.id;
  }

  // ===== ТЕМА И UI =====
  
  /**
   * Получить цветовую схему
   */
  getColorScheme() {
    return this.tg?.colorScheme || 'dark';
  }

  /**
   * Получить цвета темы
   */
  getThemeParams() {
    return this.tg?.themeParams || {};
  }

  /**
   * Применить цвета темы к документу
   */
  applyTheme() {
    if (!this.isAvailable) return;

    const theme = this.getThemeParams();
    const root = document.documentElement;

    // Применяем CSS переменные
    if (theme.bg_color) {
      root.style.setProperty('--tg-bg-color', theme.bg_color);
    }
    if (theme.text_color) {
      root.style.setProperty('--tg-text-color', theme.text_color);
    }
    if (theme.button_color) {
      root.style.setProperty('--tg-button-color', theme.button_color);
    }
    if (theme.button_text_color) {
      root.style.setProperty('--tg-button-text-color', theme.button_text_color);
    }

    // Устанавливаем цвет фона
    document.body.style.backgroundColor = this.tg.backgroundColor;
  }

  /**
   * Установить цвет header
   */
  setHeaderColor(color) {
    this.tg?.setHeaderColor(color);
  }

  /**
   * Установить цвет фона
   */
  setBackgroundColor(color) {
    this.tg?.setBackgroundColor(color);
  }

  // ===== ГЛАВНАЯ КНОПКА (MainButton) =====
  
  /**
   * Показать главную кнопку
   */
  showMainButton(text, onClick) {
    if (!this.isAvailable) return;

    this.tg.MainButton.setText(text);
    this.tg.MainButton.show();
    
    if (onClick) {
      this.tg.MainButton.onClick(onClick);
    }
  }

  /**
   * Скрыть главную кнопку
   */
  hideMainButton() {
    this.tg?.MainButton.hide();
  }

  /**
   * Включить главную кнопку
   */
  enableMainButton() {
    this.tg?.MainButton.enable();
  }

  /**
   * Выключить главную кнопку
   */
  disableMainButton() {
    this.tg?.MainButton.disable();
  }

  /**
   * Показать прогресс на главной кнопке
   */
  showMainButtonProgress() {
    this.tg?.MainButton.showProgress();
  }

  /**
   * Скрыть прогресс на главной кнопке
   */
  hideMainButtonProgress() {
    this.tg?.MainButton.hideProgress();
  }

  // ===== КНОПКА НАЗАД (BackButton) =====
  
  /**
   * Показать кнопку назад
   */
  showBackButton(onClick) {
    if (!this.isAvailable) return;

    this.tg.BackButton.show();
    
    if (onClick) {
      this.tg.BackButton.onClick(onClick);
    }
  }

  /**
   * Скрыть кнопку назад
   */
  hideBackButton() {
    this.tg?.BackButton.hide();
  }

  // ===== ДИАЛОГИ =====
  
  /**
   * Показать alert
   */
  showAlert(message) {
    return new Promise((resolve) => {
      this.tg?.showAlert(message, resolve);
    });
  }

  /**
   * Показать confirm
   */
  showConfirm(message) {
    return new Promise((resolve) => {
      this.tg?.showConfirm(message, resolve);
    });
  }

  /**
   * Показать popup с кнопками
   */
  showPopup(params) {
    return new Promise((resolve) => {
      this.tg?.showPopup(params, resolve);
    });
  }

  // ===== HAPTIC FEEDBACK (вибрация) =====
  
  /**
   * Лёгкая вибрация (при нажатии)
   */
  hapticLight() {
    this.tg?.HapticFeedback.impactOccurred('light');
  }

  /**
   * Средняя вибрация
   */
  hapticMedium() {
    this.tg?.HapticFeedback.impactOccurred('medium');
  }

  /**
   * Сильная вибрация
   */
  hapticHeavy() {
    this.tg?.HapticFeedback.impactOccurred('heavy');
  }

  /**
   * Вибрация при выборе
   */
  hapticSelection() {
    this.tg?.HapticFeedback.selectionChanged();
  }

  /**
   * Вибрация успеха
   */
  hapticSuccess() {
    this.tg?.HapticFeedback.notificationOccurred('success');
  }

  /**
   * Вибрация ошибки
   */
  hapticError() {
    this.tg?.HapticFeedback.notificationOccurred('error');
  }

  /**
   * Вибрация предупреждения
   */
  hapticWarning() {
    this.tg?.HapticFeedback.notificationOccurred('warning');
  }

  // ===== НАВИГАЦИЯ =====
  
  /**
   * Закрыть приложение
   */
  close() {
    this.tg?.close();
  }

  /**
   * Открыть ссылку
   */
  openLink(url, options = {}) {
    this.tg?.openLink(url, options);
  }

  /**
   * Открыть Telegram ссылку
   */
  openTelegramLink(url) {
    this.tg?.openTelegramLink(url);
  }

  /**
   * Отправить данные боту
   */
  sendData(data) {
    this.tg?.sendData(JSON.stringify(data));
  }

  // ===== ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ =====
  
  /**
   * Проверить, запущено ли приложение в Telegram
   */
  isInTelegram() {
    return this.isAvailable;
  }

  /**
   * Получить версию WebApp API
   */
  getVersion() {
    return this.tg?.version || '0';
  }

  /**
   * Получить платформу
   */
  getPlatform() {
    return this.tg?.platform || 'unknown';
  }

  /**
   * Развёрнуто ли приложение
   */
  isExpanded() {
    return this.tg?.isExpanded || false;
  }

  /**
   * Высота viewport
   */
  getViewportHeight() {
    return this.tg?.viewportHeight || window.innerHeight;
  }

  /**
   * Стабильная высота viewport
   */
  getViewportStableHeight() {
    return this.tg?.viewportStableHeight || window.innerHeight;
  }

  // ===== СОБЫТИЯ =====
  
  /**
   * Подписаться на событие
   */
  on(eventName, callback) {
    this.tg?.onEvent(eventName, callback);
  }

  /**
   * Отписаться от события
   */
  off(eventName, callback) {
    this.tg?.offEvent(eventName, callback);
  }
}

// Создаём и экспортируем экземпляр
const telegramService = new TelegramService();

export default telegramService;

// Именованные экспорты для удобства
export const {
  init,
  getInitData,
  getUser,
  getUserId,
  showAlert,
  showConfirm,
  showPopup,
  hapticLight,
  hapticMedium,
  hapticHeavy,
  hapticSuccess,
  hapticError,
  close,
  openLink,
  openTelegramLink
} = telegramService;