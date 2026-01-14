import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/evenements',
    name: 'evenements',
    component: () => import(/* webpackChunkName: "evenements" */ '../views/EvenementsView.vue')
  },
  {
    path: '/evenement/:id',
    name: 'evenement-detail',
    component: () => import(/* webpackChunkName: "evenement-detail" */ '../views/EvenementDetailView.vue')
  },
  {
    path: '/mes-tickets',
    name: 'mes-tickets',
    component: () => import(/* webpackChunkName: "mes-tickets" */ '../views/MesTicketsView.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import(/* webpackChunkName: "contact" */ '../views/ContactView.vue')
  },
  {
    path: '/createurs',
    name: 'createurs',
    component: () => import(/* webpackChunkName: "createurs" */ '../views/CreateursView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
