import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import PodcastDetails from './components/PodcastDetails.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/podcast/:id',
    name: 'PodcastDetails',
    component: PodcastDetails,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router