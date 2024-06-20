import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import SearchView from '@/views/SearchView.vue';
import CategoryView from '@/views/CategoryView.vue';
import PodcastView from '@/views/PodcastView.vue';

const routes = [
    {
        path: '/',
        redirect: { path: "/home" } // Correct use of redirect
    },
    {
        path: '/home',
        name: 'HomeView',
        component: HomeView
    },
    {
        path: '/search',
        name: 'SearchView',
        component: SearchView
    },
    {
        path: '/category',
        name: 'CategoryView',
        component: CategoryView
    },
    {
        path: '/podcast',
        name: 'PodcastView',
        component: PodcastView,
        props: true
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
