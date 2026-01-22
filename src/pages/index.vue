<template>
  <div class="home-container">
    <!-- Header Section -->
    <v-container class="header-section" fluid>
      <v-row align="center" justify="center" class="py-1">
        <v-col class="text-center" cols="7" md="7">
          <v-row align="center" justify="center" no-gutters class="mb-2">
            <v-col cols="auto" class="mr-3">
              <img src="/bclogo.svg" alt="BC Logo" class="bc-logo" />
            </v-col>
            <v-col cols="auto">
              <h5 class="text-h2 font-weight-bold" style="color: #0C74A1;">Alex & BC</h5>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Navigation Tabs Section -->
    <v-container class="nav-tabs-section" fluid>
      <v-row>
        <v-col cols="12">
          <v-tabs v-model="activeTab" class="nav-tabs-container">
            <v-tab :to="{ name: 'home-generator' }" value="generator" class="tab-generator">
              <v-icon left>mdi-script-text</v-icon>
              PS Script
            </v-tab>
            <v-tab :to="{ name: 'home-blog' }" value="blog" class="tab-blog">
              <v-icon left>mdi-book-open</v-icon>
              Blog
            </v-tab>
            <v-tab :to="{ name: 'home-about' }" value="about" class="tab-about">
              <v-icon left>mdi-account-circle</v-icon>
              About Me
            </v-tab>
          </v-tabs>

          <!-- Router View for Tab Content -->
          <div class="nav-tab-content">
            <router-view />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  computed: {
    activeTab() {
      // Map route names to tab values for v-tabs
      const routeTabMapping = {
        'home-generator': 'generator',
        'home-blog': 'blog',
        'home-about': 'about'
      }
      return routeTabMapping[this.$route.name] || 'generator'
    }
  }
}
</script>

<style scoped>
.home-container {
  background-color: var(--bg-primary);
  min-height: 50vh;
}

.header-section {
  background: linear-gradient(135deg, var(--header-gradient-1) 0%, var(--header-gradient-2) 100%);
  color: var(--text-primary);
  padding: 10px 0;
}

.header-section h1 {
  color: #0C74A1;
}

.header-section p {
  color: var(--text-secondary);
}

.bc-logo {
  height: 120px;
  width: auto;
  object-fit: contain;
}

.nav-tabs-section {
  padding: 0;
}

.nav-tabs-container {
  background-color: var(--bg-secondary);
  border-radius: 12px 12px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nav-tabs-container :deep(.v-tab) {
  color: var(--text-primary) !important;
}

.nav-tabs-container :deep(.tab-generator) {
  color: #1976d2 !important;
}

.nav-tabs-container :deep(.tab-blog) {
  color: #f57c00 !important;
}

.nav-tabs-container :deep(.tab-about) {
  color: #388e3c !important;
}

.nav-tab-content {
  background-color: var(--bg-secondary);
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

@media (max-width: 600px) {
  .header-section {
    padding: 20px 0;
  }

  .header-section h1 {
    font-size: 24px;
  }

  .nav-tabs-section {
    padding: 20px 0;
  }
}
</style>
