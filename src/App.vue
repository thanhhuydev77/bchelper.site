<template>
  <v-app id="inspire">
    <v-main>
      <router-view />
    </v-main>
    
    <!-- Dark Mode Switch Button -->
    <v-btn
      class="fab-theme"
      color="primary"
      icon
      size="large"
      @click="toggleTheme"
      title="Toggle Dark Mode"
    >
      <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
      <v-tooltip activator="parent" location="start">
        {{ isDark ? 'Light Mode' : 'Dark Mode' }}
      </v-tooltip>
    </v-btn>
    
    <!-- Floating Action Button -->
    <v-btn
      v-if="!isHomePage"
      class="fab-home"
      color="primary"
      icon
      size="large"
      @click="goToHome"
      title="Back to Home"
    >
      <v-icon>mdi-home</v-icon>
      <v-tooltip activator="parent" location="start">
        Back to Home
      </v-tooltip>
    </v-btn>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      isDark: false,
      items: [
        {
          title: 'Enable Development',
          icon: 'mdi-dev-to',
          url: '/BCEnableDevMode',
        },
        {
          title: 'Apply License',
          icon: 'mdi-license',
          url: '/BCImportLicense',
        },
        {
          title: 'Enable Integration',
          icon: 'mdi-api',
          url: '/BCEnableIntegration',
        },
        {
          title: 'Change Authentication Type',
          icon: 'mdi-account-convert',
          url: '/BCChangeAuthType',
        },
        {
          title: 'Add BC Instance',
          icon: 'mdi-plus-circle',
          url: '/BCAddInstance',
        },
        {
          title: 'Add New User',
          icon: 'mdi-account-plus',
          url: '/BCAddNewUser',
        },
        {
          title: 'Build API URL',
          icon: 'mdi-link-variant',
          url: '/BCBuildApiUrl',
        },
        {
          title: 'Database Backup/Restore',
          icon: 'mdi-database',
          url: '/BCDatabaseBackup',
        },
        {
          title: 'Manage App (Publish/Install)',
          icon: 'mdi-package-variant',
          url: '/BCManageApp',
        },
        {
          title: 'Create Docker BC',
          icon: 'mdi-docker',
          url: '/BCCreateDocker',
        },
      ],
    }
  },
  computed: {
    isHomePage() {
      return this.$route.path === '/'
    },
  },
  methods: {
    goToHome() {
      this.$router.push('/')
    },
    toggleTheme() {
      this.isDark = !this.isDark
      this.$vuetify.theme.global.name = this.isDark ? 'dark' : 'light'
      if (this.isDark) {
        document.documentElement.classList.add('dark-mode')
      } else {
        document.documentElement.classList.remove('dark-mode')
      }
    },
  },
}
</script>

<style>
html {
  overflow-y: auto;
}

:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-card: #ffffff;
  --bg-hover: #f5f5f5;
  --text-primary: #333;
  --text-secondary: rgba(51, 51, 51, 0.7);
  --border-color: #e0e0e0;
  --border-hover: #d0d0d0;
  --header-gradient-1: #e8eaf6;
  --header-gradient-2: #f3e5f5;
}

html.dark-mode {
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --bg-card: #2a2a2a;
  --bg-hover: #333333;
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: #404040;
  --border-hover: #505050;
  --header-gradient-1: #1a237e;
  --header-gradient-2: #0d47a1;
}

.fab-theme {
  position: fixed !important;
  bottom: 24px !important;
  right: 88px !important;
  z-index: 1000;
}

.fab-home {
  position: fixed !important;
  bottom: 24px !important;
  right: 24px !important;
  z-index: 1000;
}

/* Responsive global padding/margin for mobile */
@media (max-width: 600px) {
  .pa-2, .ma-0, .v-container {
    padding-left: 4px !important;
    padding-right: 4px !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .fab-theme {
    bottom: 16px !important;
    right: 80px !important;
  }

  .fab-home {
    bottom: 16px !important;
    right: 16px !important;
  }
}
</style>
