import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import StudentFormFetcher from '@/components/StudentFormFetch.vue'
import AdminFormFetcher from '@/components/AdminFormFetch.vue' 

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/studentForm',
    name: 'StudentForm',
    component: StudentFormFetcher
  },
  {
    path: '/adminForm',
    name: 'AdminForm',
    component: AdminFormFetcher
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router