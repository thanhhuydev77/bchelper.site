<template>
  <v-card class="nav-card">
    <v-card-text class="pa-6">
      <v-row class="mb-8">
        <v-col
          v-for="item in items"
          :key="item.title"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            class="feature-tile"
            :to="item.url"
            hover
          >
            <v-card-item class="pb-0">
              <v-row align="center" class="w-100" no-gutters>
                <v-col cols="auto" class="mr-3">
                  <v-icon size="48" :color="item.color">
                    {{ item.icon }}
                  </v-icon>
                </v-col>
                <v-col>
                  <v-card-title :class="`${item.color}-text`" style="padding: 0; font-size: 18px; word-break: break-word; white-space: normal;">{{ item.title }}</v-card-title>
                </v-col>
              </v-row>
            </v-card-item>
            <v-card-text class="text-caption text-grey">
              {{ item.description }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'GeneratorTab',
  data() {
    return {
      items: [
        {
          title: 'Enable Development',
          icon: 'mdi-dev-to',
          color: 'blue',
          url: '/BCEnableDevMode',
          description: 'Enable development mode for your BC instance',
        },
        {
          title: 'Apply License',
          icon: 'mdi-license',
          color: 'green',
          url: '/BCImportLicense',
          description: 'Import and apply BC licenses',
        },
        {
          title: 'Enable Integration',
          icon: 'mdi-api',
          color: 'purple',
          url: '/BCEnableIntegration',
          description: 'Configure API integration settings',
        },
        {
          title: 'Change Authentication Type',
          icon: 'mdi-account-convert',
          color: 'orange',
          url: '/BCChangeAuthType',
          description: 'Switch between authentication methods',
        },
        {
          title: 'Add BC Instance',
          icon: 'mdi-plus-circle',
          color: 'red',
          url: '/BCAddInstance',
          description: 'Create a new BC instance',
        },
        {
          title: 'Add New User',
          icon: 'mdi-account-plus',
          color: 'teal',
          url: '/BCAddNewUser',
          description: 'Add new users to your BC system',
        },
        {
          title: 'Build API URL',
          icon: 'mdi-link-variant',
          color: 'indigo',
          url: '/BCBuildApiUrl',
          description: 'Generate and configure API URLs',
        },
        {
          title: 'Database Backup/Restore',
          icon: 'mdi-database',
          color: 'cyan',
          url: '/BCDatabaseBackup',
          description: 'Manage database backups and restores',
        },
        {
          title: 'Manage App (Publish/Install)',
          icon: 'mdi-package-variant',
          color: 'lime',
          url: '/BCManageApp',
          description: 'Publish and install BC applications',
        },
        {
          title: 'Create Docker BC',
          icon: 'mdi-docker',
          color: 'deep-orange',
          url: '/BCCreateDocker',
          description: 'Set up BC in Docker containers',
        },
      ],
    }
  }
}
</script>

<style scoped>
.nav-card {
  border-radius: 0 0 12px 12px;
  box-shadow: none;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

.feature-tile {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 8px;
  height: 100%;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
}

.feature-tile:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--border-hover);
}

.feature-tile :deep(.v-card-item) {
  padding: 16px 16px 0 16px;
  align-items: flex-start;
}

.feature-tile :deep(.v-card-title) {
  font-size: 18px;
  font-weight: 600;
  padding: 0;
  line-height: 1.2;
}

.feature-tile :deep(.v-card-title.blue-text) {
  color: #1976d2;
}

.feature-tile :deep(.v-card-title.green-text) {
  color: #388e3c;
}

.feature-tile :deep(.v-card-title.purple-text) {
  color: #7b1fa2;
}

.feature-tile :deep(.v-card-title.orange-text) {
  color: #f57c00;
}

.feature-tile :deep(.v-card-title.red-text) {
  color: #d32f2f;
}

.feature-tile :deep(.v-card-title.teal-text) {
  color: #00796b;
}

.feature-tile :deep(.v-card-title.indigo-text) {
  color: #3f51b5;
}

.feature-tile :deep(.v-card-title.cyan-text) {
  color: #0097a7;
}

.feature-tile :deep(.v-card-title.lime-text) {
  color: #558b2f;
}

.feature-tile :deep(.v-card-title.deep-orange-text) {
  color: #e64a19;
}

.feature-tile :deep(.v-card-text) {
  padding: 0 16px 12px 16px;
  min-height: 40px;
}
</style>