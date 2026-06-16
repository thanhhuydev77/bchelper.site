import { createRouter, createWebHistory } from 'vue-router/auto'
import Home from '../pages/index.vue'
import GeneratorTab from '../pages/tabs/GeneratorTab.vue'

// Lazy load other views to optimize initial bundle size
const BlogTab = () => import('../pages/tabs/BlogTab.vue')
const AboutTab = () => import('../pages/tabs/AboutTab.vue')
const BlogDetail = () => import('../pages/BlogDetail.vue')
const BCAddInstance = () => import('../pages/BCAddInstance.vue')
const BCAddNewUser = () => import('../pages/BCAddNewUser.vue')
const BCBuildApiUrl = () => import('../pages/BCBuildApiUrl.vue')
const BCChangeAuthType = () => import('../pages/BCChangeAuthType.vue')
const BCCreateDocker = () => import('../pages/BCCreateDocker.vue')
const BCDatabaseBackup = () => import('../pages/BCDatabaseBackup.vue')
const BCEnableDevMode = () => import('../pages/BCEnableDevMode.vue')
const BCEnableIntegration = () => import('../pages/BCEnableIntegration.vue')
const BCImportLicense = () => import('../pages/BCImportLicense.vue')
const BCManageApp = () => import('../pages/BCManageApp.vue')
// import { routes } from 'vue-router/auto-routes'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        path: '',
        name: 'home-generator',
        component: GeneratorTab
      },
      {
        path: 'blog',
        name: 'home-blog',
        component: BlogTab
      },
      {
        path: 'about',
        name: 'home-about',
        component: AboutTab
      }
    ]
  },
  { path: '/blog/:id', name: 'BlogDetail', component: BlogDetail },
  { path: '/BCAddInstance', name: 'BCAddInstance', component: BCAddInstance },
  { path: '/BCAddNewUser', name: 'BCAddNewUser', component: BCAddNewUser },
  { path: '/BCBuildApiUrl', name: 'BCBuildApiUrl', component: BCBuildApiUrl },
  { path: '/BCChangeAuthType', name: 'BCChangeAuthType', component: BCChangeAuthType },
  { path: '/BCEnableDevMode', name: 'BCEnableDevMode', component: BCEnableDevMode },
  { path: '/BCEnableIntegration', name: 'BCEnableIntegration', component: BCEnableIntegration },
  { path: '/BCImportLicense', name: 'BCImportLicense', component: BCImportLicense },
  { path: '/BCManageApp', name: 'BCManageApp', component: BCManageApp },
  { path: '/BCDatabaseBackup', name: 'BCDatabaseBackup', component: BCDatabaseBackup },
  { path: '/BCCreateDocker', name: 'BCCreateDocker', component: BCCreateDocker },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
  routes.push(
    {
      path: '/BCEnableDevMode',
      name: 'BCEnableDevMode',
      component: BCEnableDevMode,
    },
  )
})

export default router
