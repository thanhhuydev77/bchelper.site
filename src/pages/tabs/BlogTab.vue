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
export default {
  name: 'BlogTab',
  data() {
    return {
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
    }
  },
  computed: {
    blogPostsReversed() {
      // Create a copy first, then reverse
      return [...this.blogPosts].reverse();
    }
  },
  methods: {
    navigateToBlog(blogId) {
      this.$router.push(`/blog/${blogId}`)
    },
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