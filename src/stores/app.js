import { defineStore } from 'pinia';
import apiService from '@/services/api';
import telegramService from '@/services/telegram';

export const useAppStore = defineStore('app', {
    state: () => ({
        // Пользователь
        user: null,
        isAuthenticated: false,

        // Состояния загрузки
        isAuthenticating: false,
        isLoading: false,

        // Ошибки
        authError: null,
        error: null,

        // Debug информация
        debugInfo: null,
    }),

    getters: {
        /**
         * Имя пользователя
         */
        userName: (state) => state.user?.first_name || '',

        /**
         * ID пользователя
         */
        userId: (state) => state.user?.id || null,

        /**
         * Баланс пользователя
         */
        userBalance: (state) => state.user?.balance || 0,

        /**
         * Есть ли ошибка аутентификации
         */
        hasAuthError: (state) => !!state.authError,

        /**
         * Есть ли ошибка
         */
        hasError: (state) => !!state.error,
    },

    actions: {
        /**
         * Авторизация через Telegram
         */
        async authenticate() {
            this.isAuthenticating = true;
            this.authError = null;
            this.debugInfo = null;

            try {
                console.log('🔐 Начинаем авторизацию...');

                // Получаем данные от API
                const data = await apiService.authenticateTelegram();

                console.log('✅ Авторизация успешна:', data);

                // Сохраняем данные пользователя
                this.user = data.user || data;
                this.isAuthenticated = true;

                return data;
            } catch (error) {
                console.error('❌ Ошибка авторизации:', error);

                // Show actual error message from backend
                this.authError = error.message || 'Ошибка авторизации';
                this.isAuthenticated = false;

                // Enhanced debug info with actual backend response
                if (error.response) {
                    this.debugInfo = {
                        status: error.response.status,
                        statusText: error.response.statusText,
                        data: error.response.data, // Show actual backend response
                        url: error.response.config?.url,
                        method: error.response.config?.method,
                    };
                } else {
                    // Network error or no response
                    this.debugInfo = {
                        message: error.message,
                        type: 'Network Error or No Response',
                    };
                }

                throw error;
            } finally {
                this.isAuthenticating = false;
            }
        },

        /**
         * Выход из системы
         */
        logout() {
            this.user = null;
            this.isAuthenticated = false;
            this.authError = null;
            localStorage.removeItem('auth_token');
        },

        /**
         * Очистить ошибку
         */
        clearError() {
            this.error = null;
            this.authError = null;
        },

        /**
         * Обновить данные пользователя
         */
        async refreshUser() {
            this.isLoading = true;
            this.error = null;

            try {
                const data = await apiService.getUser();
                this.user = data;
                return data;
            } catch (error) {
                console.error('Ошибка обновления пользователя:', error);
                this.error = error.message;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Инициализация приложения
         */
        async init() {
            console.log('🚀 Инициализация приложения...');

            // Инициализируем Telegram WebApp
            telegramService.init();

            // Проверяем, есть ли сохранённый токен
            const token = localStorage.getItem('auth_token');

            if (token) {
                // Пробуем получить данные пользователя
                try {
                    await this.refreshUser();
                    this.isAuthenticated = true;
                    console.log('✅ Пользователь авторизован из токена');
                } catch (error) {
                    // Токен невалиден, авторизуемся заново
                    console.log('⚠️ Токен невалиден, авторизуемся заново');
                    await this.authenticate();
                }
            } else {
                // Авторизуемся
                await this.authenticate();
            }
        },
    },
});
