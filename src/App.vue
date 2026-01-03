<template>
  <v-app id="inspire">
    <v-main>
      <router-view />
    </v-main>
    
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
  },
}
</script>

<style>
html {
  overflow-y: auto;
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

  .fab-home {
    bottom: 16px !important;
    right: 16px !important;
  }
}
</style>
