<template>
  <v-card class="nav-card">
    <v-card-text class="pa-6">
      <!-- Search & Filter Controls -->
      <v-row class="mb-4" align="center">
        <v-col cols="12" md="7" lg="6">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search posts by title, excerpt, or tag..."
            clearable
            variant="outlined"
            density="compact"
            hide-details
            class="search-input"
            @click:clear="clearSearch"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="5" lg="6" class="d-flex align-center justify-md-end">
          <span class="text-caption text-medium-emphasis">
            Showing {{ filteredPosts.length }} of {{ blogPosts.length }} articles
          </span>
        </v-col>
      </v-row>

      <!-- Blog Cards Grid -->
      <v-row v-if="filteredPosts.length > 0">
        <v-col
          v-for="post in filteredPosts"
          :key="post.id"
          cols="12"
          md="6"
          class="mb-4"
        >
          <v-card
            class="blog-post-card"
            hover
            @click="navigateToBlog(post.id)"
            @mouseenter="prefetchBlog(post)"
            @touchstart="prefetchBlog(post)"
          >
            <v-card-item class="pb-2">
              <v-card-title class="blog-title" tag="h2">{{ post.title }}</v-card-title>
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
                  :variant="isTagSelected(tag) ? 'elevated' : 'outlined'"
                  :color="isTagSelected(tag) ? 'primary' : 'primary'"
                  class="mr-1 mb-1 clickable-tag"
                  @click.stop="filterByTag(tag)"
                >
                  {{ tag }}
                </v-chip>
              </div>
            </v-card-text>

            <v-card-actions class="pt-0">
              <span class="text-caption text-medium-emphasis pl-2">{{ post.date }}</span>
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

      <!-- No Results State -->
      <v-row v-else>
        <v-col cols="12" class="text-center py-12">
          <v-icon size="64" color="grey-lighten-1" class="mb-3">mdi-file-search-outline</v-icon>
          <h3 class="text-h6 font-weight-medium text-high-emphasis mb-1">No blog posts found</h3>
          <p class="text-body-2 text-medium-emphasis mb-4">
            No articles matched your search for "{{ searchQuery }}". Try searching with another keyword or tag.
          </p>
          <v-btn
            color="primary"
            variant="flat"
            size="small"
            prepend-icon="mdi-refresh"
            @click="clearSearch"
          >
            Reset Search
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { blogPosts } from '@/data/blogs'
import { useBlog } from '@/composables/useBlog'

export default {
  name: 'BlogTab',
  data() {
    return {
      blogPosts,
      searchQuery: ''
    }
  },
  setup() {
    const { prefetchBlogContent } = useBlog()
    return { prefetchBlogContent }
  },
  computed: {
    blogPostsReversed() {
      // Create a copy first, then reverse
      return [...this.blogPosts].reverse();
    },
    filteredPosts() {
      const posts = this.blogPostsReversed
      if (!this.searchQuery || !this.searchQuery.trim()) {
        return posts
      }
      const query = this.searchQuery.trim().toLowerCase()
      return posts.filter(post => {
        const titleMatch = post.title && post.title.toLowerCase().includes(query)
        const excerptMatch = post.excerpt && post.excerpt.toLowerCase().includes(query)
        const idMatch = post.id && post.id.toLowerCase().includes(query)
        const tagMatch = post.tags && post.tags.some(tag => tag.toLowerCase().includes(query))
        return titleMatch || excerptMatch || idMatch || tagMatch
      })
    }
  },
  watch: {
    searchQuery(newVal) {
      const currentSearch = this.$route.query.search || ''
      const queryVal = newVal ? newVal.trim() : ''
      if (currentSearch !== queryVal) {
        const newQuery = { ...this.$route.query }
        if (queryVal) {
          newQuery.search = queryVal
        } else {
          delete newQuery.search
        }
        this.$router.replace({ query: newQuery }).catch(() => {})
      }
    }
  },
  mounted() {
    if (this.$route.query.search) {
      this.searchQuery = this.$route.query.search
    }

    // Prefetch all blog contents in background on idle
    if (typeof window !== 'undefined') {
      const queue = [...this.blogPostsReversed]
      const runPrefetchQueue = () => {
        if (queue.length === 0) return
        const nextPost = queue.shift()
        this.prefetchBlogContent(nextPost.id, nextPost.contentFile).then(() => {
          // Schedule next prefetch with a gap to prevent blocking CPU
          setTimeout(runPrefetchQueue, 300)
        })
      }

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          setTimeout(runPrefetchQueue, 1000) // start prefetching 1s after idle
        })
      } else {
        setTimeout(runPrefetchQueue, 2000)
      }
    }
  },
  methods: {
    navigateToBlog(blogId) {
      this.$router.push(`/blog/${blogId}`)
    },
    prefetchBlog(post) {
      this.prefetchBlogContent(post.id, post.contentFile)
    },
    clearSearch() {
      this.searchQuery = ''
    },
    filterByTag(tag) {
      if (this.searchQuery && this.searchQuery.toLowerCase() === tag.toLowerCase()) {
        this.searchQuery = ''
      } else {
        this.searchQuery = tag
      }
    },
    isTagSelected(tag) {
      if (!this.searchQuery) return false
      return this.searchQuery.trim().toLowerCase() === tag.trim().toLowerCase()
    }
  },
}
</script>

<style scoped>
.nav-card {
  border-radius: 0 0 12px 12px;
  box-shadow: none;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

.search-input {
  max-width: 100%;
}

.clickable-tag {
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable-tag:hover {
  opacity: 0.85;
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
  line-clamp: 2;
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
  line-clamp: 3;
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
</style>