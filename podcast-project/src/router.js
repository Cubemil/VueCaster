import { createRouter, createWebHistory } from 'vue-router';
import SearchView from '@/views/SearchView.vue';
import CategoryView from '@/views/CategoryView.vue';

const routes = [
    {
        path: '/searchview',
        name: 'SearchView',
        component: SearchView
    },
    {
        path: '/categoryview',
        name: 'CategoryView',
        component: CategoryView
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;