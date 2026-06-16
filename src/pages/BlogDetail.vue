<template>
  <div class="blog-detail-container">
    <v-divider />
    <v-card-text class="blog-body">
      <!-- Loading Skeleton State -->
      <v-container v-if="loading" class="container pa-6">
        <v-skeleton-loader
          type="article, image, paragraph, paragraph"
          class="bg-transparent"
        ></v-skeleton-loader>
      </v-container>
      
      <!-- Error / Fallback State -->
      <v-container v-else-if="error" class="container text-center py-12">
        <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
        <h3 class="text-h5 mb-2">Error Loading Blog Content</h3>
        <p class="text-body-1 text-medium-emphasis mb-6">{{ error }}</p>
        <v-btn color="primary" @click="goBack">Back to Home</v-btn>
      </v-container>

      <!-- Blog HTML Content -->
      <div v-else v-html="blog.content" />
    </v-card-text>
  </div>
</template>

<script>
import { blogDataMap } from '@/data/blogs'
import { useBlog } from '@/composables/useBlog'

export default {
  name: 'BlogDetail',
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
  setup() {
    const { getBlogContent, loading, error } = useBlog()
    return { getBlogContent, loading, error }
  },
  async mounted() {
    const blogId = this.$route.params.id
    
    if (blogDataMap[blogId]) {
      const post = blogDataMap[blogId]
      this.blog.id = post.id
      this.blog.title = post.title
      this.blog.date = post.date
      
      try {
        this.blog.content = await this.getBlogContent(post.id, post.contentFile)
      } catch (err) {
        // Handled by loading/error ref in setup()
      }
    } else {
      this.blog.content = '<div class="container"><p>Blog post not found</p></div>'
    }
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
  },
}
</script>

<style lang="scss">
// Import isolated styles for the blog post layout
@import '@/styles/blog.scss';

.blog-detail-container {
  background-color: var(--bg-primary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
}

.blog-body {
  padding: 0;
  color: var(--text-primary);
  line-height: 1.8;
  flex: 1;
  overflow-y: auto;
}

@media (max-width: 600px) {
  .blog-detail-container {
    padding: 0;
  }
}
</style>

