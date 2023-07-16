import { createApp } from 'vue';
import './style.css';
import PrimeVue from 'primevue/config';
import App from './App.vue';
import 'primevue/resources/themes/md-dark-indigo/theme.css';
import 'primevue/resources/primevue.min.css';

/* eslint-disable-next-line */
import 'uno.css';

const app = createApp(App);
app.use(PrimeVue);
app.mount('#app');
