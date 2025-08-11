export const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'categories',
        component: () => import('@/pages/categories/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'categories/create',
        component: () => import('@/pages/categories/create.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'categories/:id/edit',
        component: () => import('@/pages/categories/edit.vue'),
        meta: { requiresAuth: true },
        props: true,
      },
      {
        path: 'transaction',
        component: () => import('@/pages/transaction/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'transaction/create',
        component: () => import('@/pages/transaction/create.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'transaction/:id/edit',
        component: () => import('@/pages/transaction/edit.vue'),
        meta: { requiresAuth: true },
        props: true,
      },
      {
        path: 'account-settings',
        component: () => import('@/pages/account-settings.vue'),
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
      },
      {
        path: 'icons',
        component: () => import('@/pages/icons.vue'),
      },
      {
        path: 'cards',
        component: () => import('@/pages/cards.vue'),
      },
      {
        path: 'tables',
        component: () => import('@/pages/tables.vue'),
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
