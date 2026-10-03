# Crafted Hertz website (static, GitHub Pages)

Files: `index.html`, `terms.html`, `privacy.html`, `refunds.html`, `404.html`, `robots.txt`, `sitemap.xml`, `assets/`.

## Publish
1. Create a GitHub repo, upload ALL files from this folder to the repo root (keep `.nojekyll`).
2. Settings -> Pages -> Source: *Deploy from a branch* -> `main` / `/ (root)`.
3. Custom domain (optional): Settings -> Pages -> Custom domain, add DNS records, tick *Enforce HTTPS*.

## Before going live: set your real URL
SEO files use the placeholder `https://www.craftedhertz.com`. Replace it everywhere with your real site address:
`grep -rl "https://www.craftedhertz.com" . | xargs sed -i 's#https://www.craftedhertz.com#https://YOUR-URL#g'`
(for a GitHub project page that is `https://USER.github.io/REPO`; then also change root-absolute links in `404.html` to include `/REPO/`).

## After going live
- Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- Test the Buy button (Creem overlay) and the rich results (search.google.com/test/rich-results).
- Add the site URL to your Creem store details; keep support email `craftedhertz@gmail.com` visible (it is in the header area of every page footer, contact section and legal pages).
