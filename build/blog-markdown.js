// Vite plugin: turns Markdown posts in src/content/blog (written with Pages CMS)
// into the same /blog/<slug>.html files the hand-written posts use, exposes their
// metadata as `virtual:blog-posts`, and appends their URLs to sitemap.xml.
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

const VIRTUAL_ID = 'virtual:blog-posts'
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_ID
const SITE_URL = 'https://alexxbc.site'

const escapeHtml = MarkdownIt().utils.escapeHtml

function createRenderer() {
  const md = new MarkdownIt({ html: true, linkify: true })

  // ```al TokenCache.al  ->  code window with dots + title (copy button is added by useBlog)
  md.renderer.rules.fence = (tokens, idx) => {
    const [lang = '', ...rest] = tokens[idx].info.trim().split(/\s+/)
    const title = rest.join(' ') || lang.toUpperCase() || 'Code'
    const langClass = lang ? ` class="language-${escapeHtml(lang)}"` : ''
    return `<div class="code-wrapper">
  <div class="code-header">
    <div class="dot red"></div>
    <div class="dot yellow"></div>
    <div class="dot green"></div>
    <div class="code-title">${escapeHtml(title)}</div>
  </div>
  <pre><code${langClass}>${escapeHtml(tokens[idx].content)}</code></pre>
</div>\n`
  }

  // Quote block in the editor -> highlight box
  md.renderer.rules.blockquote_open = () => '<div class="highlight-box">\n'
  md.renderer.rules.blockquote_close = () => '</div>\n'

  // Horizontally scrollable tables on mobile
  md.renderer.rules.table_open = () => '<div class="table-wrapper"><table>\n'
  md.renderer.rules.table_close = () => '</table></div>\n'

  // A paragraph containing only images -> img-container
  const isImageOnly = inline => inline?.type === 'inline' && inline.children?.length > 0
    && inline.children.every(c => c.type === 'image' || c.type === 'softbreak'
      || (c.type === 'text' && !c.content.trim()))
  md.renderer.rules.paragraph_open = (tokens, idx, options, env, self) =>
    isImageOnly(tokens[idx + 1]) ? '<div class="img-container">' : self.renderToken(tokens, idx, options)
  md.renderer.rules.paragraph_close = (tokens, idx, options, env, self) =>
    isImageOnly(tokens[idx - 1]) ? '</div>\n' : self.renderToken(tokens, idx, options)

  return md
}

// Group content into <section> blocks, one per "## Heading", like the hand-written posts
function wrapSections(html) {
  return html
    .split(/(?=<h2[\s>])/)
    .filter(part => part.trim())
    .map(part => `<section>\n${part}</section>`)
    .join('\n')
}

function formatDate(value) {
  const date = value instanceof Date ? value : new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

function renderPage(post, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(post.title)}</title>
    <meta name="description" content="${escapeHtml(post.excerpt)}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">
    <link href="/blogAsset/style.css" rel="stylesheet">
</head>

<body>
    <div class="container">
        <header>
            <h1>${escapeHtml(post.title)}</h1>
        </header>

${wrapSections(bodyHtml)}
    </div>
</body>

</html>
`
}

export default function blogMarkdown({ contentDir = 'src/content/blog', legacyDir = 'public/blog' } = {}) {
  let root = process.cwd()
  let isBuild = false
  let outDir = 'dist'
  const md = createRenderer()

  function loadPosts() {
    const dir = path.resolve(root, contentDir)
    if (!fs.existsSync(dir)) return []

    const legacySlugs = new Set(
      fs.existsSync(path.resolve(root, legacyDir))
        ? fs.readdirSync(path.resolve(root, legacyDir)).map(f => path.parse(f).name)
        : [],
    )
    const seenIds = new Set()
    const posts = []

    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'README.md')) {
      const slug = path.parse(file).name
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf8'))
      // Drafts are visible in `npm run dev` only
      if (data.draft && isBuild) continue

      const fail = msg => { throw new Error(`[blog-markdown] ${contentDir}/${file}: ${msg}`) }
      const id = String(data.id || slug).trim()
      if (!data.title) fail('missing "title"')
      const date = formatDate(data.date)
      if (!date) fail(`invalid "date" (${data.date}); use YYYY-MM-DD`)
      if (seenIds.has(id)) fail(`duplicate id "${id}"`)
      if (legacySlugs.has(slug)) fail(`public/blog/${slug}.html already exists; rename this file`)
      seenIds.add(id)

      posts.push({
        id,
        slug,
        title: String(data.title),
        date,
        excerpt: data.excerpt ? String(data.excerpt) : '',
        tags: Array.isArray(data.tags) ? data.tags.map(String).filter(Boolean) : [],
        contentFile: `/blog/${slug}.html`,
        draft: Boolean(data.draft),
        body: content,
      })
    }
    return posts
  }

  const toMeta = ({ body, slug, ...meta }) => meta

  return {
    name: 'blog-markdown',

    configResolved(config) {
      root = config.root
      isBuild = config.command === 'build'
      outDir = path.resolve(config.root, config.build.outDir)
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID
    },

    load(id) {
      if (id !== RESOLVED_VIRTUAL_ID) return
      return `export default ${JSON.stringify(loadPosts().map(toMeta))}`
    },

    configureServer(server) {
      const dir = path.resolve(root, contentDir)
      server.watcher.add(dir)
      const reload = file => {
        if (!path.resolve(file).startsWith(dir)) return
        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', reload)
      server.watcher.on('change', reload)
      server.watcher.on('unlink', reload)

      server.middlewares.use((req, res, next) => {
        const match = req.url?.split('?')[0].match(/^\/blog\/([^/]+)\.html$/)
        if (!match) return next()
        let post
        try {
          post = loadPosts().find(p => p.slug === decodeURIComponent(match[1]))
        } catch (err) {
          return next(err)
        }
        if (!post) return next()
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(renderPage(post, md.render(post.body)))
      })
    },

    generateBundle() {
      for (const post of loadPosts()) {
        this.emitFile({
          type: 'asset',
          fileName: `blog/${post.slug}.html`,
          source: renderPage(post, md.render(post.body)),
        })
      }
    },

    writeBundle() {
      const sitemapPath = path.join(outDir, 'sitemap.xml')
      if (!fs.existsSync(sitemapPath)) return
      const sitemap = fs.readFileSync(sitemapPath, 'utf8')
      const entries = loadPosts()
        .map(p => `${SITE_URL}/blog/${encodeURIComponent(p.id)}`)
        .filter(loc => !sitemap.includes(`<loc>${loc}</loc>`))
        .map(loc => `  <url><loc>${loc}</loc><priority>0.8</priority></url>`)
      if (entries.length === 0) return
      fs.writeFileSync(sitemapPath, sitemap.replace('</urlset>', `${entries.join('\n')}\n</urlset>`))
    },
  }
}
