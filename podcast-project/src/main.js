import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueDraggableNext } from 'vue-draggable-next';

const app = createApp(App);
app.use(router);
app.component('draggable', VueDraggableNext);  // Register component globally
app.mount('#app');
