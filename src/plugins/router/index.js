import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')

  // Jika route butuh auth, tapi belum login
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ path: '/login' })
    } else {
      next()
    }
  }
  // Jika user sudah login, dan ingin ke halaman login atau register
  else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    next({ path: '/dashboard' }) // arahkan ke dashboard
  } else {
    next()
  }
})

export default function (app) {
  app.use(router)
}

export { router }
