import { createRouter, createWebHistory } from 'vue-router';
import SearchView from '@/views/SearchView.vue';
import CategoryView from '@/views/CategoryView.vue';
import PodcastView from '@/views/PodcastView.vue';

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
    {
        path: '/podcastview',
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