import { createRouter, createWebHistory } from 'vue-router';
import InicioView from '../views/InicioView.vue';
import ECMView from '../views/ECMView.vue';

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: InicioView,
  },
 
  {
    path: '/ecm',
    name: 'ECM',
    component: ECMView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;