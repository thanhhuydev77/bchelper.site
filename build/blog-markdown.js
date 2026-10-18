// Vite plugin: turns Markdown posts in src/content/blog (written with Sveltia CMS)
// into the same /blog/<slug>.html files the hand-written posts use, exposes their
// metadata as `virtual:blog-posts`, and appends their URLs to sitemap.xml.
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'

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

  // **File.al** alone on the line above a code block -> code window title
  md.core.ruler.push('code_title', state => {
    const t = state.tokens
    for (let i = 3; i < t.length; i++) {
      if (t[i].type !== 'fence' || /\s/.test(t[i].info.trim())) continue
      const [open, inline, close] = t.slice(i - 3, i)
      const kids = (inline.children ?? []).filter(c => c.type !== 'text' || c.content.trim())
      const isTitle = open.type === 'paragraph_open' && close.type === 'paragraph_close'
        && open.level === t[i].level && kids.length === 3
        && kids[0].type === 'strong_open' && kids[1].type === 'text' && kids[2].type === 'strong_close'
      if (!isTitle) continue
      t[i].info = `${t[i].info.trim() || 'code'} ${kids[1].content}`
      t.splice(i - 3, 3)
      i -= 3
    }
  })

  // ::: step Title ... :::  -> timeline item (Sveltia "Timeline step" component)
  md.use(container, 'step', {
    render: (tokens, idx) => {
      if (tokens[idx].nesting === -1) return '</div></div>\n'
      const title = tokens[idx].info.trim().replace(/^step\s*/, '')
      const titleHtml = title ? `<span class="timeline-title">${md.renderInline(title)}</span>\n` : ''
      return `<div class="timeline"><div class="timeline-item">\n${titleHtml}`
    },
  })

  // ::: pros + bullet list + :::  -> pro-list with check icons (Sveltia "Pros list" component)
  md.use(container, 'pros', {
    render: (tokens, idx) => {
      const list = tokens[idx + 1]
      if (tokens[idx].nesting === 1 && list?.type === 'bullet_list_open') {
        list.attrJoin('class', 'pro-list')
        for (let i = idx + 2; i < tokens.length && tokens[i].level > list.level; i++) {
          if (tokens[i].type === 'list_item_open' && tokens[i].level === list.level + 1) tokens[i].meta = { pro: true }
        }
      }
      return ''
    },
  })
  md.renderer.rules.list_item_open = (tokens, idx, options, env, self) =>
    self.renderToken(tokens, idx, options) + (tokens[idx].meta?.pro ? '<i class="ri-check-line"></i> ' : '')

  return md
}

function renderMarkdown(md, body) {
  // Consecutive timeline steps share one .timeline so the connecting line is drawn
  return md.render(body)
    .replace(/<\/div><\/div>\s*<div class="timeline"><div class="timeline-item">/g, '</div>\n<div class="timeline-item">')
}

// Group content into <section> blocks, one per "## Heading", like the hand-written posts
function wrapSections(html) {
  return html
    .split(/(?=<h2[\s>])/)
    .filter(part => part.trim())
    .map(part => `<section>\n${part}</section>`)
    .join('\n')
}

// Hand-written posts are listed in src/data/blogs.js; read their metadata from source
function loadLegacyPosts(root) {
  const file = path.resolve(root, 'src/data/blogs.js')
  if (!fs.existsSync(file)) return []
  const match = fs.readFileSync(file, 'utf8').match(/const htmlPosts = (\[[\s\S]*?\n\])/)
  return match ? new Function(`return ${match[1]}`)() : []
}

// Rough HTML -> Markdown-ish plain text, good enough for LLMs
function htmlToText(html) {
  const strip = s => s.replace(/<[^>]+>/g, '')
  const decode = s => s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, '\'')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  // Code blocks are set aside so their indentation survives the whitespace cleanup
  const code = []
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html
  return decode(body
    .replace(/\r/g, '')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/<div class="code-title">([\s\S]*?)<\/div>/gi, '\n**$1**\n')
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, c) => `\n\0${code.push(strip(c).replace(/^\n+|\s+$/g, '')) - 1}\0\n`)
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, n, t) => `\n${'#'.repeat(Number(n))} ${strip(t).trim()}\n`)
    .replace(/<li[^>]*>\s*/gi, '\n- ')
    .replace(/<img[^>]*alt="([^"]*)"[^>]*>/gi, '[Image: $1]')
    .replace(/<\/(p|div|section|ul|ol|table|tr|header)>|<br\s*\/?>/gi, '\n')
    .replace(/<\/t[dh]>/gi, ' | ')
    .replace(/<[^>]+>/g, '')
    .replace(/^[ \t]+|[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim())
    .replace(/\0(\d+)\0/g, (_, i) => `\`\`\`\n${decode(code[i])}\n\`\`\``)
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

${post.format === 'html' ? bodyHtml : wrapSections(bodyHtml)}
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
        format: data.format === 'html' ? 'html' : 'markdown',
        body: content,
      })
    }
    return posts
  }

  const toMeta = ({ body, slug, format, ...meta }) => meta
  // HTML posts are used as-is; Markdown posts go through markdown-it
  const renderBody = post => post.format === 'html' ? post.body : renderMarkdown(md, post.body)

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
        res.end(renderPage(post, renderBody(post)))
      })
    },

    generateBundle() {
      const posts = loadPosts()
      for (const post of posts) {
        this.emitFile({
          type: 'asset',
          fileName: `blog/${post.slug}.html`,
          source: renderPage(post, renderBody(post)),
        })
      }

      // llms.txt / llms-full.txt: plain-text index and content for AI crawlers,
      // which usually don't run the Vue app behind /blog/<id>
      const all = [
        ...loadLegacyPosts(root).map(p => ({
          ...p,
          html: fs.readFileSync(path.resolve(root, legacyDir, path.basename(p.contentFile)), 'utf8'),
        })),
        ...posts.map(p => ({ ...p, html: renderPage(p, renderBody(p)) })),
      ].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))

      const header = '# BC Helper\n\n> Blog and PowerShell script generators for Microsoft Dynamics 365 Business Central developers: AL programming solutions, performance patterns, and on-premise/Docker administration.\n'
      const index = all.map(p => `- [${p.title}](${SITE_URL}${p.contentFile})${p.excerpt ? `: ${p.excerpt}` : ''} (${p.date})`)
      this.emitFile({
        type: 'asset',
        fileName: 'llms.txt',
        source: `${header}\nFull text of every post: ${SITE_URL}/llms-full.txt\n\n## Blog posts\n\n${index.join('\n')}\n`,
      })

      const full = all.map(p => [
        `# ${p.title}`,
        `URL: ${SITE_URL}/blog/${encodeURIComponent(p.id)}`,
        `Date: ${p.date}`,
        ...(p.tags?.length ? [`Tags: ${p.tags.join(', ')}`] : []),
        ...(p.excerpt ? [`Summary: ${p.excerpt}`] : []),
        '',
        htmlToText(p.html).replace(/^# .*\n+/, ''),
      ].join('\n'))
      this.emitFile({
        type: 'asset',
        fileName: 'llms-full.txt',
        source: `${header}\n${full.join('\n\n---\n\n')}\n`,
      })
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
