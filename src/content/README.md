# Blog posts (Markdown)

Posts in this folder are managed with [Pages CMS](https://app.pagescms.org) (config: `/.pages.yml`)
and built into `/blog/<file>.html` by `build/blog-markdown.js`. Saving in Pages CMS commits to
GitHub, and Vercel redeploys automatically.

How the editor content is rendered:

| In the editor | On the site |
| --- | --- |
| `## Heading` | New section (same card layout as older posts) |
| Quote block | Highlight box |
| Code block with language, e.g. `al` | Code window with a Copy button; title = language |
| Code block with info `al MyCodeunit.al` (Source mode) | Code window titled `MyCodeunit.al` |
| Image on its own line | Framed image |
| Table | Styled, scrollable table |

Raw HTML (e.g. `<div class="timeline">…</div>`) can be pasted in Source mode for layouts Markdown can't express.

Drafts (`draft: true`) show in `npm run dev` but are not published.
