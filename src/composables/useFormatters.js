import { computed } from 'vue';

/**
 * Composable для форматирования данных
 */
export function useFormatters() {
  
  /**
   * Форматирование валюты
   */
  const formatCurrency = (amount, currency = '₽') => {
    if (typeof amount !== 'number') return '0 ' + currency;
    
    return amount.toLocaleString('ru-RU') + ' ' + currency;
  };

  /**
   * Форматирование жетонов
   */
  const formatTokens = (amount) => {
    if (typeof amount !== 'number') return '0';
    
    return amount.toLocaleString('ru-RU');
  };

  /**
   * Форматирование даты
   */
  const formatDate = (date, format = 'full') => {
    if (!date) return '';
    
    const d = new Date(date);
    
    if (isNaN(d.getTime())) return '';
    
    switch (format) {
      case 'short':
        // 23.12.2002
        return d.toLocaleDateString('ru-RU');
        
      case 'medium':
        // 23 декабря
        return d.toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long'
        });
        
      case 'full':
        // 23 декабря 2002
        return d.toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        
      case 'datetime':
        // 23 декабря, 19:49
        return d.toLocaleString('ru-RU', {
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit'
        });
        
      case 'time':
        // 19:49
        return d.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        });
        
      default:
        return d.toLocaleDateString('ru-RU');
    }
  };

  /**
   * Форматирование относительной даты
   */
  const formatRelativeDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays === 1) return 'вчера';
    if (diffDays < 7) return `${diffDays} дн назад`;
    
    return formatDate(date, 'short');
  };

  /**
   * Форматирование срока действия
   */
  const formatExpiryDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    const now = new Date();
    const diffMs = d - now;
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffDays < 0) return 'Истёк';
    if (diffDays === 0) return 'Истекает сегодня';
    if (diffDays === 1) return 'Истекает завтра';
    if (diffDays < 30) return `Истекает через ${diffDays} дн`;
    
    return `до ${formatDate(date, 'short')}`;
  };

  /**
   * Форматирование числа с суффиксом
   */
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  /**
   * Склонение существительных
   */
  const pluralize = (count, one, few, many) => {
    const mod10 = count % 10;
    const mod100 = count % 100;
    
    if (mod10 === 1 && mod100 !== 11) {
      return `${count} ${one}`;
    }
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
      return `${count} ${few}`;
    }
    return `${count} ${many}`;
  };

  /**
   * Склонение для жетонов
   */
  const pluralizeTokens = (count) => {
    return pluralize(count, 'жетон', 'жетона', 'жетонов');
  };

  /**
   * Склонение для дней
   */
  const pluralizeDays = (count) => {
    return pluralize(count, 'день', 'дня', 'дней');
  };

  /**
   * Склонение для рефералов
   */
  const pluralizeReferrals = (count) => {
    return pluralize(count, 'реферал', 'реферала', 'рефералов');
  };

  /**
   * Обрезать текст
   */
  const truncate = (text, length = 50, suffix = '...') => {
    if (!text) return '';
    if (text.length <= length) return text;
    
    return text.substring(0, length).trim() + suffix;
  };

  /**
   * Форматирование процента
   */
  const formatPercent = (value, decimals = 0) => {
    return value.toFixed(decimals) + '%';
  };

  /**
   * Форматирование размера файла
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Б';
    
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
  };

  // ===== RETURN =====
  
  return {
    formatCurrency,
    formatTokens,
    formatDate,
    formatRelativeDate,
    formatExpiryDate,
    formatNumber,
    pluralize,
    pluralizeTokens,
    pluralizeDays,
    pluralizeReferrals,
    truncate,
    formatPercent,
    formatFileSize
  };
}