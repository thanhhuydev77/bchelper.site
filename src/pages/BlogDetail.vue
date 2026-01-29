<template>
  <div class="blog-detail-container">
      <v-divider />
      <v-card-text class="blog-body">
        <div v-html="blog.content" />
      </v-card-text>
  </div>
</template>

<script>
export default {
  data() {
    return {
      blog: {
        id: '',
        title: '',
        date: '',
        content: '',
      },
    }
  },
  async mounted() {
    const blogId = this.$route.params.id
    
    // Blog data mapping
    const blogData = {
      'BC-SOLUTIONS-001': {
        title: 'View Attachment File Related to Sales Order on Archived Sales Order',
        date: 'January 18, 2026',
        contentFile: '/blog/bc001.html',
      },
      'BC-SOLUTIONS-002': {
        title: 'Handling Slow API Calls with Page Background Tasks',
        date: 'January 19, 2026',
        contentFile: '/blog/bc002.html',
      },
      'BC-SOLUTIONS-003': {
        title: 'Printing Attachment File(PDF) by Batch',
        date: 'January 22, 2026',
        contentFile: '/blog/bc003.html',
      },
      'BC-SOLUTIONS-004': {
        title: 'Delete History Data by Batch',
        date: 'January 29, 2026',
        contentFile: '/blog/bc004.html',
      },
    }
    
    if (blogData[blogId]) {
      this.blog.id = blogId
      this.blog.title = blogData[blogId].title
      this.blog.date = blogData[blogId].date
      
      // Load HTML content from file
      try {
        const response = await fetch(blogData[blogId].contentFile)
        this.blog.content = await response.text()
      } catch (error) {
        console.error('Error loading blog content:', error)
        this.blog.content = '<p>Error loading blog content</p>'
      }
    } else {
      this.blog.content = '<p>Blog post not found</p>'
    }
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
.blog-detail-container {
  background-color: var(--bg-primary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
}


.blog-card-fullscreen {
  background-color: var(--bg-secondary);
  border-radius: 0;
  box-shadow: none;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 20px 40px 40px 40px;
  max-width: 100%;
  width: 100%;
}

.blog-card-fullscreen :deep(.v-card-item) {
  padding: 0;
}

.blog-card-fullscreen :deep(.v-card-title) {
  color: var(--text-primary);
  word-break: break-word;
  padding: 0;
}

.blog-card-fullscreen :deep(.v-card-subtitle) {
  color: var(--text-secondary);
  padding: 0;
}

.blog-body {
  padding: 0;
  color: var(--text-primary);
  line-height: 1.8;
  flex: 1;
  overflow-y: auto;
}

.blog-body h3 {
  font-size: 20px;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.blog-body h4 {
  font-size: 16px;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.blog-body p {
  margin-bottom: 12px;
  color: var(--text-primary);
}

.blog-body ul,
.blog-body ol {
  margin-left: 24px;
  margin-bottom: 12px;
}

.blog-body li {
  margin-bottom: 8px;
  color: var(--text-primary);
}

@media (max-width: 600px) {
  .blog-card-fullscreen {
    padding: 60px 16px 16px 16px;
  }

  .back-btn {
    top: 8px;
    left: 8px;
  }
}
</style>
