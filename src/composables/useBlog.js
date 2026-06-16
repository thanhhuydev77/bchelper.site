import { reactive, ref } from 'vue'

const blogCache = reactive({})

export function useBlog() {
  const loading = ref(false)
  const error = ref(null)

  async function getBlogContent(blogId, contentFile) {
    if (blogCache[blogId]) {
      return blogCache[blogId]
    }

    loading.value = true
    error.value = null
    try {
      const response = await fetch(contentFile)
      if (!response.ok) {
        throw new Error(`Failed to fetch blog content: ${response.statusText}`)
      }
      const html = await response.text()

      // Parse HTML and extract only the relevant `.container` DOM block
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const container = doc.querySelector('.container') || doc.body

      // Force lazy loading on all nested images
      container.querySelectorAll('img').forEach(img => {
        img.setAttribute('loading', 'lazy')
      })

      // Inject copy buttons to code blocks
      container.querySelectorAll('.code-wrapper').forEach(wrapper => {
        const header = wrapper.querySelector('.code-header')
        if (header && !header.querySelector('.copy-code-btn')) {
          const copyBtn = doc.createElement('button')
          copyBtn.className = 'copy-code-btn'
          copyBtn.type = 'button'
          copyBtn.innerHTML = '<i class="ri-file-copy-line"></i> Copy'
          header.appendChild(copyBtn)
        }
      })

      const cleanedContent = container.outerHTML
      blogCache[blogId] = cleanedContent
      return cleanedContent
    } catch (err) {
      console.error(`Error loading blog content for ${blogId}:`, err)
      error.value = err.message || 'Error loading blog content'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function prefetchBlogContent(blogId, contentFile) {
    if (blogCache[blogId]) return

    try {
      const response = await fetch(contentFile)
      if (response.ok) {
        const html = await response.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const container = doc.querySelector('.container') || doc.body
        
        container.querySelectorAll('img').forEach(img => {
          img.setAttribute('loading', 'lazy')
        })

        container.querySelectorAll('.code-wrapper').forEach(wrapper => {
          const header = wrapper.querySelector('.code-header')
          if (header && !header.querySelector('.copy-code-btn')) {
            const copyBtn = doc.createElement('button')
            copyBtn.className = 'copy-code-btn'
            copyBtn.type = 'button'
            copyBtn.innerHTML = '<i class="ri-file-copy-line"></i> Copy'
            header.appendChild(copyBtn)
          }
        })
        
        blogCache[blogId] = container.outerHTML
      }
    } catch (err) {
      console.warn(`Error prefetching blog content for ${blogId}:`, err)
    }
  }

  return {
    loading,
    error,
    getBlogContent,
    prefetchBlogContent,
    blogCache
  }
}
