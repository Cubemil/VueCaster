import { createApp } from 'vue'
import App from './App.vue'

// Router
import router from './router'

// VueDraggable for drag and drop
import { VueDraggableNext } from 'vue-draggable-next'

const app = createApp(App)
app.use(router)
app.component('draggable', VueDraggableNext)  // Register component globally
app.mount('#app')