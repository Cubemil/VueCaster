import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import SearchView from '@/views/SearchView.vue';
import PodcastView from '@/views/PodcastView.vue';
import LikedPodcastsView from '@/views/LikedPodcastsView.vue';
import SavedEpisodesView from '@/views/SavedEpisodesView.vue';
import UserLoginView from './views/UserLoginView.vue';

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
        path: '/liked-podcasts',
        name: 'LikedPodcastsView',
        component: LikedPodcastsView
    },
    { 
        path: '/saved-episodes',
        name: 'SavedEpisodesView',
        component: SavedEpisodesView
    },
    {
        path: '/login',
        name: 'UserLoginView',
        component: UserLoginView
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
