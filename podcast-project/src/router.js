import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import SearchView from '@/views/SearchView.vue';
import PodcastView from '@/views/PodcastView.vue';

//TODO #-router 
const routes = [
    {
        path: '/',
        redirect: {path: "/home"}
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
        path: '/podcast/:podcastId',
        name: 'PodcastView',
        component: PodcastView,
        props: true
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/home'
    }
];


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
