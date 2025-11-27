// Получаем объект Telegram WebApp
const tg = window.Telegram?.WebApp;

/**
 * Сервис для работы с Telegram WebApp API
 */
class TelegramService {
  constructor() {
    this.tg = tg;
    this.isAvailable = !!tg;
    this.debugLogs = []; // Временное хранилище логов для отладки
  }

  // Временный метод для логирования с сохранением
  debugLog(message, data = null) {
    const logEntry = data ? `${message} ${JSON.stringify(data)}` : message;
    console.log(logEntry);
    this.debugLogs.push(logEntry);
  }

  // Показать все собранные логи в popup
  async showDebugLogs() {
    const logs = this.debugLogs.join('\n');
    await this.showPopup({
      title: 'Debug Logs',
      message: logs || 'No logs collected',
      buttons: [{ type: 'ok', text: 'OK' }]
    });
    // Очищаем логи после показа
    this.debugLogs = [];
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
    // this.tg.enableClosingConfirmation();
    
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

    // Удаляем предыдущий обработчик если он был
    if (this._backButtonHandler) {
      this.tg.BackButton.offClick(this._backButtonHandler);
    }

    this.tg.BackButton.show();
    
    if (onClick) {
      this._backButtonHandler = onClick;
      this.tg.BackButton.onClick(onClick);
    }
  }

  /**
   * Скрыть кнопку назад
   */
  hideBackButton() {
    if (!this.isAvailable) return;
    
    // Удаляем обработчик перед скрытием
    if (this._backButtonHandler) {
      this.tg.BackButton.offClick(this._backButtonHandler);
      this._backButtonHandler = null;
    }
    
    this.tg.BackButton.hide();
  }

  /**
   * Удалить обработчик кнопки назад
   */
  offBackButtonClick() {
    if (!this.isAvailable) return;
    
    if (this._backButtonHandler) {
      this.tg.BackButton.offClick(this._backButtonHandler);
      this._backButtonHandler = null;
    }
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
  // ===== ДОБАВЛЕНИЕ НА ГЛАВНЫЙ ЭКРАН =====

  /**
   * Добавить на главный экран
   */
  addToHomeScreen() {
    this.debugLog('[AddToHome] Calling tg.addToHomeScreen()');
    this.debugLog('[AddToHome] Method type:', typeof this.tg?.addToHomeScreen);
    this.tg?.addToHomeScreen();
    this.debugLog('[AddToHome] Method called');
  }

  /**
   * Проверить статус добавления на главный экран
   */
  checkHomeScreenStatus(callback) {
    this.tg?.checkHomeScreenStatus(callback);
  }

  /**
   * Попытаться добавить на главный экран с проверкой поддержки
   * Если не поддерживается - показать инструкцию
   */
  async addToHomeScreenWithFallback() {
    this.debugLogs = []; // Очищаем предыдущие логи
    this.debugLog('[AddToHome] Starting');
    this.debugLog('[AddToHome] isAvailable:', this.isAvailable);
    this.debugLog('[AddToHome] Platform:', this.getPlatform());
    
    if (!this.isAvailable) {
      this.debugLog('[AddToHome] Telegram not available');
      await this.showDebugLogs();
      await this.showAddToHomeInstructions();
      return;
    }

    // Проверяем, доступен ли метод checkHomeScreenStatus
    const hasCheckStatus = typeof this.tg.checkHomeScreenStatus === 'function';
    const hasAddToHome = typeof this.tg.addToHomeScreen === 'function';
    
    this.debugLog('[AddToHome] checkHomeScreenStatus exists:', hasCheckStatus);
    this.debugLog('[AddToHome] addToHomeScreen exists:', hasAddToHome);
    
    if (!hasCheckStatus) {
      this.debugLog('[AddToHome] checkHomeScreenStatus not available');
      
      if (hasAddToHome) {
        this.debugLog('[AddToHome] Calling addToHomeScreen directly');
        this.addToHomeScreen();
        await this.showDebugLogs();
      } else {
        this.debugLog('[AddToHome] addToHomeScreen not available');
        await this.showDebugLogs();
        await this.showAddToHomeInstructions();
      }
      return;
    }

    // Проверяем статус поддержки
    this.debugLog('[AddToHome] Checking status...');
    
    return new Promise((resolve) => {
      this.checkHomeScreenStatus((status) => {
        this.debugLog('[AddToHome] Status:', status);
        
        if (status === 'unsupported') {
          this.debugLog('[AddToHome] Unsupported');
          this.showDebugLogs().then(() => {
            this.showAddToHomeInstructions();
            resolve(false);
          });
        } else if (status === 'added') {
          this.debugLog('[AddToHome] Already added');
          this.showDebugLogs().then(() => {
            this.showAlert('Бот уже добавлен на главный экран! 🎉');
            resolve(true);
          });
        } else {
          this.debugLog('[AddToHome] Calling addToHomeScreen');
          this.addToHomeScreen();
          this.showDebugLogs().then(() => {
            resolve(true);
          });
        }
      });
    });
  }

  /**
   * Показать инструкцию по добавлению на главный экран
   */
  async showAddToHomeInstructions() {
    const platform = this.getPlatform();
    let message = '';

    if (platform === 'ios') {
      message = `📱 Инструкция для iOS:\n\n1. Откройте бота в Safari\n2. Нажмите кнопку "Поделиться" (квадрат со стрелкой)\n3. Выберите "На экран Домой"\n4. Нажмите "Добавить"`;
    } else if (platform === 'android') {
      message = `📱 Инструкция для Android:\n\n1. Откройте меню браузера (три точки)\n2. Выберите "Добавить на главный экран"\n3. Подтвердите добавление`;
    } else {
      message = `📱 Как добавить на главный экран:\n\nК сожалению, ваше устройство не поддерживает автоматическое добавление.\n\nВы можете добавить бота вручную через настройки браузера:\n• Найдите опцию "Добавить на главный экран"\n• Или создайте закладку для быстрого доступа`;
    }

    await this.showPopup({
      title: 'Добавить на главный экран',
      message: message,
      buttons: [{ type: 'ok', text: 'Понятно' }]
    });
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
  openTelegramLink,
  addToHomeScreen,
  checkHomeScreenStatus
} = telegramService;
