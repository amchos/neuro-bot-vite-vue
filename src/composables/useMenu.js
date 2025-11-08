import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTelegram } from './useTelegram';

/**
 * Composable для управления меню
 */
export function useMenu() {
  const router = useRouter();
  const { hapticLight, openTelegramLink } = useTelegram();
  
  // ===== STATE =====
  
  const isMenuOpen = ref(false);
  
  // ===== MENU ITEMS =====
  
  const menuItems = ref([
    {
      id: 'subscription',
      label: 'Подписка Pro',
      icon: '✦',
      route: '/subscriptions',
      badge: null
    },
    {
      id: 'tokens',
      label: 'Жетоны',
      icon: '🪙',
      route: '/tokens',
      badge: null
    },
    {
      id: 'settings',
      label: 'Настройки нейросети',
      icon: '⚙️',
      route: '/settings/neural',
      badge: null
    },
    {
      id: 'history',
      label: 'История операций',
      icon: '📋',
      route: '/history',
      badge: null
    },
    {
      id: 'home',
      label: 'Добавить на экран "Домой"',
      icon: '🏠',
      action: 'addToHomeScreen'
    },
    {
      id: 'bot',
      label: 'Канал бота',
      icon: '👤',
      action: 'openBotChannel',
      link: 'https://t.me/your_bot_channel'
    },
    {
      id: 'news',
      label: 'Новостной канал про нейросети',
      icon: '👥',
      action: 'openNewsChannel',
      link: 'https://t.me/ccilkanakanal'
    },
    {
      id: 'support',
      label: 'Поддержка',
      icon: '🎧',
      action: 'openSupport',
      link: 'https://t.me/support_bot'
    },
    {
      type: 'divider'
    },
    {
      id: 'terms',
      label: 'Пользовательское соглашение',
      icon: '📄',
      action: 'openTerms',
      link: '/terms'
    },
    {
      id: 'privacy',
      label: 'Политика конфиденциальности',
      icon: '🔒',
      action: 'openPrivacy',
      link: '/privacy'
    }
  ]);
  
  // ===== МЕТОДЫ =====
  
  /**
   * Открыть меню
   */
  const openMenu = () => {
    hapticLight();
    isMenuOpen.value = true;
  };

  /**
   * Закрыть меню
   */
  const closeMenu = () => {
    hapticLight();
    isMenuOpen.value = false;
  };

  /**
   * Переключить меню
   */
  const toggleMenu = () => {
    if (isMenuOpen.value) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  /**
   * Обработать клик по пункту меню
   */
  const handleMenuItemClick = (item) => {
    hapticLight();
    
    // Если это разделитель, ничего не делаем
    if (item.type === 'divider') return;
    
    // Если есть маршрут
    if (item.route) {
      router.push(item.route);
      closeMenu();
      return;
    }
    
    // Если есть действие
    if (item.action) {
      handleAction(item.action, item);
      closeMenu();
      return;
    }
  };

  /**
   * Обработать действие
   */
  const handleAction = (action, item) => {
    switch (action) {
      case 'addToHomeScreen':
        // Логика добавления на главный экран
        addToHomeScreen();
        break;
        
      case 'openBotChannel':
      case 'openNewsChannel':
      case 'openSupport':
        if (item.link) {
          openTelegramLink(item.link);
        }
        break;
        
      case 'openTerms':
      case 'openPrivacy':
        if (item.link) {
          router.push(item.link);
        }
        break;
        
      default:
        console.warn('Unknown action:', action);
    }
  };

  /**
   * Добавить на главный экран (для iOS/Android)
   */
  const addToHomeScreen = () => {
    const tg = window.Telegram?.WebApp;
    
    // Telegram WebApp API может добавить shortcut
    if (tg?.addToHomeScreen) {
      tg.addToHomeScreen();
    } else {
      // Показываем инструкцию
      alert('Используйте меню браузера для добавления на главный экран');
    }
  };

  /**
   * Обновить badge у пункта меню
   */
  const updateMenuBadge = (itemId, badge) => {
    const item = menuItems.value.find(i => i.id === itemId);
    if (item) {
      item.badge = badge;
    }
  };

  // ===== RETURN =====
  
  return {
    // State
    isMenuOpen,
    menuItems,
    
    // Методы
    openMenu,
    closeMenu,
    toggleMenu,
    handleMenuItemClick,
    updateMenuBadge
  };
}