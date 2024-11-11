import { createApp } from 'vue'
import App from './App.vue'

// Router
import router from './router'

// @ts-ignore
import 'vuetify/styles'
// @ts-ignore
import { createVuetify } from 'vuetify'
// @ts-ignore
import * as components from 'vuetify/components'
// @ts-ignore
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
})

// VueDraggable for drag and drop
import { VueDraggableNext } from 'vue-draggable-next'

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.component('draggable', VueDraggableNext)  // Register component globally
app.mount('#app')