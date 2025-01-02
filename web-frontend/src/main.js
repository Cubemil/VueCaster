import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { VueDraggableNext } from 'vue-draggable-next'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.component('draggable', VueDraggableNext) // registers a global component

app.mount('#app')

/*
const appReady = async () => {
  const store = useUserStore()
  const token = localStorage.getItem("token") || sessionStorage.getItem("token")
  if (token) {
    await authenticate(token)
  }
}
Promise.all([appReady()])
*/