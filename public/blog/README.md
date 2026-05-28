# /public/blog

Per-page image folder. Drop images into `/public/blog/<slug>/` where `<slug>` matches the landing page route name (and the markdown filename in `content/landing/<slug>.md`).

In the page's `.md` file, reference images either by:

- bare filename — `![alt](hero.png)` — which the template resolves to `/blog/<slug>/hero.png`
- absolute path — `![alt](/some/global/asset.png)` — used as-is

The hero `image` field in the frontmatter follows the same resolution rules.
