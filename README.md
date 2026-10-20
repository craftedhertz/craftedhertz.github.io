# Crafted Hertz website (static, GitHub Pages)

Pages: `/` MasterLoop (flagship), `/kinetic` (KINETIC, secondary), `/terms`, `/privacy`, `/refunds`, `404`.
Styles: `assets/masterloop.css` (home), `assets/style.css` (KINETIC and legal pages).

## Downloads (put files in `downloads/`, exact names)
- `MasterLoop-Setup-1.0.0.exe`, `MasterLoop-1.0.0-macOS.pkg`
- `KINETIC_v2.0.0_Windows_Setup.exe`, `KINETIC-2.0.0-macOS.pkg`
New version: replace the files and update the links and size labels in `index.html` / `kinetic.html`.

## Manuals
`assets/MasterLoop_User_Manual.pdf`, `assets/KINETIC-Manual.pdf`.

## Before going live
SEO files use `https://www.craftedhertz.com`. If your real URL differs:
`grep -rl "https://www.craftedhertz.com" . | xargs sed -i 's#https://www.craftedhertz.com#https://YOUR-URL#g'`
Then submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools, and test rich results (FAQ, SoftwareApplication) at search.google.com/test/rich-results.

## Checkout
MasterLoop: Creem `prod_3pxroHzhk0FmtakkiguxGU`, $49.90. KINETIC: `prod_1gk79Y8ObiGIPqUqzMyNq7`, $39.99. Update the price in the page text and in the JSON-LD `offers` if it changes.
