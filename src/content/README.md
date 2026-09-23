# Blog posts (Markdown)

Posts in `blog/` are managed with [Sveltia CMS](https://github.com/sveltia/sveltia-cms) at `/admin/`
(config: `public/admin/config.yml`) and built into `/blog/<file>.html` by `build/blog-markdown.js`.
Saving in the CMS commits to GitHub, and Vercel redeploys automatically.

Signing in: locally (`npm run dev`, open `/admin/index.html` in Chrome/Edge) choose
"Work with Local Repository"; on the live site use "Sign In Using Access Token" with a GitHub
fine-grained token scoped to this repo (Contents: read & write).

How the editor content is rendered:

| In the editor | On the site |
| --- | --- |
| `## Heading` | New section (same card layout as older posts) |
| Quote block | Highlight box |
| Code block with language, e.g. `al` | Code window with a Copy button; title = language |
| Bold-only line (`**MyCodeunit.al**`) right above a code block | Code window titled `MyCodeunit.al` |
| Image on its own line | Framed image |
| Table | Styled, scrollable table |
| **Timeline step** block (`::: step Title` … `:::`) | Timeline item; consecutive steps join into one timeline |
| **Pros list** block (`::: pros` + list + `:::`) | Pro list with check icons |

Raw HTML (e.g. `<div class="tags-container">…</div>`) can be typed in the editor's Markdown mode
for layouts Markdown can't express. Keep it free of blank lines, or Markdown parsing resumes.

Drafts (`draft: true`) show in `npm run dev` but are not published.
