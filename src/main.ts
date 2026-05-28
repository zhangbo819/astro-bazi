// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import pinia from './store';

const AppBase = createApp(App);
AppBase.use(router)
  // .use(vconsole as any)
  .use(pinia)
  .mount('#app');
