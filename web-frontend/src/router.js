import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import SearchView from '@/views/SearchView.vue';
import PodcastView from '@/views/PodcastView.vue';
import LikedPodcastsView from '@/views/LikedPodcastsView.vue';
import SavedEpisodesView from '@/views/SavedEpisodesView.vue';
import MyProfileView from './views/MyProfileView.vue';
import UserLoginView from './views/UserLoginView.vue';
import UserSignupView from './views/UserSignupView.vue';

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
        path: '/profile',
        name: 'MyProfileView',
        component: MyProfileView
    },
    {
        path: '/login',
        name: 'UserLoginView',
        component: UserLoginView
    },
    {
        path: '/signup',
        name: 'UserSignupView',
        component: UserSignupView
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

import { useUserStore } from './stores/user'
// reroute to home if user is logged in and tries to log in / sign up
router.beforeEach(async (to, from, next) => {
    const store = useUserStore()
    if (to.name === "UserLoginView" && store.isLoggedIn)
        next("/")
    else if (to.name === "UserSignupView" && store.isLoggedIn)
        next("/")
    else if (to.name === "MyProfileView" && !store.isLoggedIn)    
        next("/login")
    else
        next()
})

export default router;
