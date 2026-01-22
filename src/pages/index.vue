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
          <v-tabs v-model="activeNavTab" class="nav-tabs-container">
            <v-tab value="generator" class="tab-generator">
              <v-icon left>mdi-script-text</v-icon>
              PS Script
            </v-tab>
            <v-tab value="blog" class="tab-blog">
              <v-icon left>mdi-book-open</v-icon>
              Blog
            </v-tab>
            <v-tab value="about" class="tab-about">
              <v-icon left>mdi-account-circle</v-icon>
              About Me
            </v-tab>
          </v-tabs>

          <!-- Navigation Tab Content -->
          <v-window v-model="activeNavTab" class="nav-tab-content">
            <!-- Power Shell Script Generator Tab -->
            <v-window-item value="generator">
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
            </v-window-item>

            <!-- Blog Tab -->
            <v-window-item value="blog">
              <v-card class="nav-card">
                <v-card-text class="pa-6">
                  <v-row>
                    <v-col
                      v-for="post in blogPosts"
                      :key="post.id"
                      cols="12"
                      md="6"
                      class="mb-4"
                    >
                      <v-card
                        class="blog-post-card"
                        hover
                        @click="navigateToBlog(post.id)"
                      >
                        <v-card-item class="pb-2">
                          <v-card-title class="blog-title">{{ post.title }}</v-card-title>
                        </v-card-item>

                        <v-card-text class="pt-0">
                          <div class="blog-excerpt">
                            {{ post.excerpt || 'Click to read this Business Central development article...' }}
                          </div>
                          <div class="blog-tags mt-3">
                            <v-chip
                              v-for="tag in post.tags"
                              :key="tag"
                              size="small"
                              variant="outlined"
                              color="primary"
                              class="mr-1 mb-1"
                            >
                              {{ tag }}
                            </v-chip>
                          </div>
                        </v-card-text>

                        <v-card-actions class="pt-0">
                          <v-spacer></v-spacer>
                          <v-btn
                            variant="text"
                            color="primary"
                            size="small"
                            append-icon="mdi-arrow-right"
                          >
                            Read More
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- About Me Tab -->
            <v-window-item value="about">
              <v-card class="nav-card">
                <v-card-text class="pa-6">
                  <v-row align="center" justify="center" class="mb-6">
                    <v-col cols="auto">
                      <v-avatar size="120">
                        <v-img :src="profileImage" alt="Profile" />
                      </v-avatar>
                    </v-col>
                  </v-row>
                  <h3 class="text-h5 text-center mb-4">About Me</h3>
                  <p class="text-body-1 mb-4">
                    I'm a Business Central developer with 5+ years of experience. I specialize in creating automation tools and solutions that streamline BC operations and improve efficiency.
                  </p>
                  <p class="text-body-1 mb-6">
                    This tool was built to help developers like me automate repetitive tasks and focus on what matters most - building great solutions for Business Central.
                  </p>
                  <v-divider class="my-6" />
                  <v-row justify="center" class="gap-3">
                    <v-col cols="auto">
                    <h5 class="text-h5 mb-4">Connect With Me</h5>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn
                        color="primary"
                        :href="socialLinks.linkedin"
                        target="_blank"
                        prepend-icon="mdi-linkedin"
                      >
                        LinkedIn
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeNavTab: 'generator',
      generatorContent: '# Enter your PowerShell script here\n\n',
      profileImage: '/avatar.jpg',
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/alexha77/',
        facebook: 'https://www.facebook.com/thanhhuydev',
      },
      blogPosts: [
        {
          id: 'BC-SOLUTIONS-001',
          title: 'View Attachment File Related to Sales Order on Archived Sales Order',
          excerpt: 'Create a Dynamics Link Factbox to view Attachment File base on complex condition.',
          tags: ['Factboxes','SetTableView','Page.Update']
        },
        {
          id: 'BC-SOLUTIONS-002',
          title: 'Handling Slow API Calls with Page Background Tasks',
          excerpt: 'Using Background Process to call parallel API and update result to Sales Order Realtime.',
          tags: ['CurrPage.EnqueueBackgroundTask','OnPageBackgroundTaskCompleted','OnPageBackgroundTaskError']
        },
        {
          id: 'BC-SOLUTIONS-003',
          title: 'Printing Attachment File(PDF) by Batch',
          excerpt: 'Print Multiple Sales Order Attachment File at the same time with specified Printer.',
          tags: ["Report.Print", "OnAfterDocumentReady", "RecRef"]
        },
      ],
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
  },
  methods: {
    navigateToBlog(blogId) {
      this.$router.push(`/blog/${blogId}`)
    },
    copyGeneratorScript() {
      navigator.clipboard.writeText(this.generatorContent).then(() => {
        alert('Script copied to clipboard!')
      }).catch(() => {
        alert('Failed to copy script')
      })
    },
    downloadGeneratorScript() {
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.generatorContent))
      element.setAttribute('download', 'script.ps1')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },
  },
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

.nav-card {
  border-radius: 0 0 12px 12px;
  box-shadow: none;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

.script-textarea {
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.script-actions {
  display: flex;
  gap: 12px;
}

/* Blog Styles */
.blog-header {
  text-align: center;
}

.blog-post-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 12px;
  height: 100%;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.blog-post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: var(--border-hover);
}

.blog-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-date {
  font-size: 14px;
  opacity: 0.8;
  display: flex;
  align-items: center;
}

.blog-excerpt {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8px;
}

.blog-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.blog-post-card :deep(.v-card-item) {
  padding: 16px 16px 8px 16px;
}

.blog-post-card :deep(.v-card-text) {
  padding: 0 16px 8px 16px;
}

.blog-post-card :deep(.v-card-actions) {
  padding: 0 16px 16px 16px;
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
