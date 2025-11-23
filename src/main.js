import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Global error handler for debugging
app.config.errorHandler = (err, instance, info) => {
    console.error('Global Error:', err);
    console.error('Info:', info);
    alert(`Error: ${err.message}\nInfo: ${info}`);
};

app.mount('#app');