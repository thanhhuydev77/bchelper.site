<template>
  <v-card class="nav-card">
    <v-card-text class="pa-6">
      <v-row>
        <v-col
          v-for="post in blogPostsReversed"
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
</template>

<script>
import { blogPosts } from '@/data/blogs'
import { useBlog } from '@/composables/useBlog'

export default {
  name: 'BlogTab',
  data() {
    return {
      blogPosts
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
    }
  },
  mounted() {
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