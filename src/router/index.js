import { createRouter, createWebHistory } from 'vue-router/auto'
import { blogDataMap } from '../data/blogs.js'
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

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        path: '',
        name: 'home-generator',
        component: GeneratorTab,
        meta: {
          title: 'BC Helper - PowerShell Script Generator for Business Central',
          description: 'Quickly generate PowerShell scripts to manage, configure, backup, and customize Business Central instances on-premise and Docker.'
        }
      },
      {
        path: 'blog',
        name: 'home-blog',
        component: BlogTab,
        meta: {
          title: 'Blog - Dynamics 365 Business Central Development Solutions',
          description: 'In-depth tutorials, tips, performance tweaks, and coding patterns for AL Language and MS Dynamics 365 Business Central.'
        }
      },
      {
        path: 'about',
        name: 'home-about',
        component: AboutTab,
        meta: {
          title: 'About Me - Alex & Business Central Developer',
          description: 'About Alex, an experienced Microsoft Dynamics 365 Business Central developer passionate about automation, efficiency, and writing clean AL code.'
        }
      }
    ]
  },
  {
    path: '/blog/:id',
    name: 'BlogDetail',
    component: BlogDetail,
    meta: {
      title: 'Blog Post - BC Helper',
      description: 'Read the latest technical guide for Business Central development.'
    }
  },
  {
    path: '/BCAddInstance',
    name: 'BCAddInstance',
    component: BCAddInstance,
    meta: {
      title: 'Add Business Central Instance - Script Generator',
      description: 'Generate PowerShell commands to create new Dynamics 365 Business Central instances.'
    }
  },
  {
    path: '/BCAddNewUser',
    name: 'BCAddNewUser',
    component: BCAddNewUser,
    meta: {
      title: 'Add New User - Business Central Script Generator',
      description: 'Generate scripts to add new users to Dynamics 365 Business Central.'
    }
  },
  {
    path: '/BCBuildApiUrl',
    name: 'BCBuildApiUrl',
    component: BCBuildApiUrl,
    meta: {
      title: 'Build API URL - Business Central API Generator',
      description: 'Quickly construct and validate standard OData and API URLs for Microsoft Dynamics 365 Business Central.'
    }
  },
  {
    path: '/BCChangeAuthType',
    name: 'BCChangeAuthType',
    component: BCChangeAuthType,
    meta: {
      title: 'Change Authentication Type - BC Script Generator',
      description: 'Change credentials types and configuration for Dynamics 365 Business Central instances.'
    }
  },
  {
    path: '/BCEnableDevMode',
    name: 'BCEnableDevMode',
    component: BCEnableDevMode,
    meta: {
      title: 'Enable Development Mode - BC Script Generator',
      description: 'Configure and enable debugging and developer services for Business Central Server Instances.'
    }
  },
  {
    path: '/BCEnableIntegration',
    name: 'BCEnableIntegration',
    component: BCEnableIntegration,
    meta: {
      title: 'Enable OData/SOAP/API Integration - BC Script Generator',
      description: 'Enable SOAP, OData, and API endpoints for your Business Central server instance.'
    }
  },
  {
    path: '/BCImportLicense',
    name: 'BCImportLicense',
    component: BCImportLicense,
    meta: {
      title: 'Apply / Import License - BC Script Generator',
      description: 'Generate PowerShell command to import a new license file (.flf) to a Business Central database.'
    }
  },
  {
    path: '/BCManageApp',
    name: 'BCManageApp',
    component: BCManageApp,
    meta: {
      title: 'Manage AL Apps (Publish/Install) - BC Script Generator',
      description: 'Publish, install, upgrade or uninstall AL language extension applications for Business Central.'
    }
  },
  {
    path: '/BCDatabaseBackup',
    name: 'BCDatabaseBackup',
    component: BCDatabaseBackup,
    meta: {
      title: 'Database Backup/Restore - BC Script Generator',
      description: 'Generate SQL Server/PowerShell scripts to backup, copy, or restore Business Central databases.'
    }
  },
  {
    path: '/BCCreateDocker',
    name: 'BCCreateDocker',
    component: BCCreateDocker,
    meta: {
      title: 'Create Docker Business Central - Container Generator',
      description: 'Configure Docker PowerShell scripts to run local Business Central developer environments using BC Container Helper.'
    }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  let title = to.meta?.title || 'BC Helper'
  let description = to.meta?.description || 'Utilities and blogs for Microsoft Dynamics 365 Business Central developers.'

  // Dynamic override for blog detail pages
  if (to.name === 'BlogDetail' && to.params.id) {
    const post = blogDataMap[to.params.id]
    if (post) {
      title = `${post.title} - BC Helper Blog`
      description = post.excerpt || description
    }
  }

  document.title = title

  let metaDesc = document.querySelector('meta[name="description"]')
  if (!metaDesc) {
    metaDesc = document.createElement('meta')
    metaDesc.setAttribute('name', 'description')
    document.head.appendChild(metaDesc)
  }
  metaDesc.setAttribute('content', description)

  next()
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
