import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Import Pinia
import App from './App.vue';
import router from './router';
import './style.css';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

const app = createApp(App);
const pinia = createPinia(); // Create Pinia instance

app.use(pinia); // Use Pinia
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
