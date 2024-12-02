import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { VueDraggableNext } from 'vue-draggable-next'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.component('draggable', VueDraggableNext) // registers a global component
app.mount('#app')

/*
import { useUserStore } from './stores/user'

const appReady = async () => {
  const store = useUserStore()
  const token = localStorage.getItem("token") || sessionStorage.getItem("token")
  if (token) {
    await authenticate(token)
  }
}

Promise.all([appReady()])

router.beforeEach(async (to, from, next) => {
  const store = useUserStore()
  console.log("logged in: " + store.isLoggedIn)

  if (to.name === "login" && store.isLoggedIn)
    next("/")
  else if (to.name === "register" && store.isLoggedIn)
    next("/")
  else
    next()
})
*/