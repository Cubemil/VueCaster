import { createRouter, createWebHistory } from 'vue-router';
import Homepage from '@/components/Homepage.vue';
import Categories from '@/components/Categories.vue';

const routes = [
    {
        path: '/',
        name: 'Homepage',
        component: Homepage
    },
    {
        path: '/categories',
        name: 'Categories',
        component: Categories
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;