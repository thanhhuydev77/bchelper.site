import { createRouter, createWebHistory } from 'vue-router/auto'
import BCAddInstance from '../pages/BCAddInstance.vue'
import BCAddNewUser from '../pages/BCAddNewUser.vue'
import BCBuildApiUrl from '../pages/BCBuildApiUrl.vue'
import BCChangeAuthType from '../pages/BCChangeAuthType.vue'
import BCCreateDocker from '../pages/BCCreateDocker.vue'
import BCDatabaseBackup from '../pages/BCDatabaseBackup.vue'
import BCEnableDevMode from '../pages/BCEnableDevMode.vue'
import BCEnableIntegration from '../pages/BCEnableIntegration.vue'
import BCImportLicense from '../pages/BCImportLicense.vue'
import BCManageApp from '../pages/BCManageApp.vue'
import BlogDetail from '../pages/BlogDetail.vue'
import Home from '../pages/index.vue'
// import { routes } from 'vue-router/auto-routes'

const routes = [
  { path: '/', name: 'default', component: Home },
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
