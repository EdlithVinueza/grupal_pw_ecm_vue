import { createRouter, createWebHistory } from 'vue-router';
import InicioView from '../views/InicioView.vue';
import BienvenidaView from '../views/BienvenidaView.vue';
import ECMView from '../views/ECMView.vue';

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: InicioView,
  },
  {
    path: '/bienvenida',
    name: 'Bienvenida',
    component: BienvenidaView,
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