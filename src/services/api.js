import axios from 'axios';
import telegramService from './telegram';

// Создаём экземпляр axios с базовой конфигурацией
const api = axios.create({
    baseURL: 'https://promptly.webhop.me',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor для запросов - добавляем токен если есть
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor для ответов - обработка ошибок
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Логируем ошибку
        console.error('API Error:', error);

        // Если 401 - очищаем токен
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
        }

        return Promise.reject(error);
    }
);

/**
 * API Service для работы с бэкендом
 */
class ApiService {
    /**
     * Авторизация через Telegram
     */
    async authenticateTelegram() {
        const initData = telegramService.getInitData();

        if (!initData) {
            throw new Error('Telegram initData отсутствует');
        }

        try {
            const response = await api.post('/users/auth/telegram/', {
                initData,
            });

            // Сохраняем токен если есть
            if (response.data.token) {
                localStorage.setItem('auth_token', response.data.token);
            }

            return response.data;
        } catch (error) {
            // Проверяем, не вернул ли сервер HTML вместо JSON
            if (error.response?.headers['content-type']?.includes('text/html')) {
                throw new Error(`Сервер вернул HTML вместо JSON. Status: ${error.response.status}`);
            }

            throw error;
        }
    }

    /**
     * Получить данные пользователя
     */
    async getUser() {
        const response = await api.get('/users/me/');
        return response.data;
    }

    /**
     * Получить баланс
     */
    async getBalance() {
        const response = await api.get('/users/balance/');
        return response.data;
    }

    /**
     * Получить историю токенов
     */
    async getTokenHistory() {
        const response = await api.get('/users/token-history/');
        return response.data;
    }

    /**
     * Получить список моделей
     */
    async getModels() {
        const response = await api.get('/models/');
        return response.data;
    }

    /**
     * Отправить сообщение в чат
     */
    async sendMessage(modelId, message) {
        const response = await api.post('/chat/send/', {
            model_id: modelId,
            message,
        });
        return response.data;
    }

    /**
     * Пополнить баланс
     */
    async addBalance(amount) {
        const response = await api.post('/users/add-balance/', {
            amount,
        });
        return response.data;
    }

    /**
     * Пригласить друга
     */
    async inviteFriend(friendId) {
        const response = await api.post('/users/invite/', {
            friend_id: friendId,
        });
        return response.data;
    }
}

// Экспортируем экземпляр
const apiService = new ApiService();
export default apiService;

// Экспортируем также сам axios instance для прямого использования
export { api };
