import { createRouter, createWebHistory } from 'vue-router';
import { useAppStore } from '@/stores/app';
import HomeView from '@/views/HomeView.vue';
import InviteView from '@/views/InviteView.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: { requiresAuth: true },
    },
    {
        path: '/invite',
        name: 'invite',
        component: InviteView,
        meta: { requiresAuth: true },
    },
    // Добавьте другие маршруты здесь
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

// Navigation guard для проверки авторизации
router.beforeEach((to, from, next) => {
    const appStore = useAppStore();

    // Если маршрут требует авторизации
    if (to.meta.requiresAuth && !appStore.isAuthenticated) {
        // Если идёт процесс авторизации, ждём
        if (appStore.isAuthenticating) {
            // Можно показать загрузку или подождать
            console.log('⏳ Ожидание авторизации...');
        }
        // Если не авторизован и не идёт процесс - редирект не нужен,
        // т.к. авторизация происходит автоматически при инициализации
    }

    next();
});

export default router;
