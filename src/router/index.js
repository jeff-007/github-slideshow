import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/layout/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/meeting',
    children: [
      {
        path: 'meeting',
        name: 'Meeting',
        component: () => import('@/components/HelloWorld'),
        meta: { cache: true }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
]

const router = new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

router.beforeEach((to, from, next) => {
  console.log('route guiding')
  next()
})

router.afterEach((to, from) => {
  console.log('leave')
})

export default router
