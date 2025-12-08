import axios from 'axios';
import telegramService from './telegram';

// Создаём экземпляр axios с базовой конфигурацией
const api = axios.create({
    baseURL: 'https://promptly.freedynamicdns.org',
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

        // Development mode: use mock data if no initData
        if (!initData && import.meta.env.DEV) {
            console.log('🔧 Development mode: using mock authentication');
            return this.mockAuthenticate();
        }

        if (!initData) {
            throw new Error('Telegram initData отсутствует');
        }

        try {
            console.log('🔐 Authenticating with backend...', {
                url: '/users/auth/telegram',
                hasInitData: !!initData,
                initDataLength: initData.length,
                initDataPreview: initData.substring(0, 100) + '...'
            });

            console.log('📤 Sending to backend:', {
                initData: initData
            });

            // CRITICAL FIX: Backend expects camelCase (initData) as per user report
            const response = await api.post('/users/auth/telegram/', {
                initData: initData,
            });

            console.log('✅ Authentication successful:', response.data);

            // Сохраняем токен если есть
            if (response.data.token) {
                localStorage.setItem('auth_token', response.data.token);
            }

            return response.data;
        } catch (error) {
            // Extract meaningful error message from backend
            const errorMessage = error.response?.data?.error
                || error.response?.data?.detail
                || error.response?.data?.message
                || error.message;

            // Log full error details for debugging
            console.error('❌ Auth Error Details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                headers: error.response?.headers,
                url: error.response?.config?.url,
            });

            // Проверяем, не вернул ли сервер HTML вместо JSON
            if (error.response?.headers['content-type']?.includes('text/html')) {
                throw new Error(`Сервер вернул HTML вместо JSON. Status: ${error.response.status}`);
            }

            // Create a new error with the extracted message
            const enhancedError = new Error(errorMessage);
            // Attach the original response so the store can access it for debug info
            enhancedError.response = error.response;
            throw enhancedError;
        }
    }

    /**
     * Mock authentication for development
     */
    async mockAuthenticate() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockUser = {
            id: 123456789,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
            balance: 1000,
        };

        // Save mock token
        localStorage.setItem('auth_token', 'mock-token-dev');

        return {
            user: mockUser,
            token: 'mock-token-dev'
        };
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
     * Получить историю токенов (deprecated)
     */
    async getTokenHistory() {
        const response = await api.get('/users/token-history/');
        return response.data;
    }

    /**
     * Получить список пополнений
     */
    async getReplenishments() {
        // TODO: Verify endpoint with backend team
        const response = await api.get('/users/transactions/replenishments/');
        return response.data;
    }

    /**
     * Получить список списаний
     */
    async getWriteOffs() {
        // TODO: Verify endpoint with backend team
        const response = await api.get('/users/transactions/write-offs/');
        return response.data;
    }

    /**
     * Получить настройки пользователя
     */
    async getSettings() {
        // TODO: Verify endpoint with backend team
        const response = await api.get('/users/settings/');
        return response.data;
    }

    /**
     * Обновить настройки пользователя
     */
    async updateSettings(settings) {
        // TODO: Verify endpoint with backend team
        const response = await api.post('/users/settings/', settings);
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
