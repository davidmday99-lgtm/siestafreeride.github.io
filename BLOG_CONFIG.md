# Blog Site Configuration - DO NOT EDIT WITHOUT CARE

This file defines the exact directory paths for each blog site. 
Subagents MUST use these paths when generating blog posts.

## Site Configurations

### 1. Siesta Free Ride
- **GitHub Repo:** https://github.com/davidmday99-lgtm/siestafreeride.github.io
- **Blog Directory:** `C:\Users\David PC\.openclaw\workspace\siestafreeride\blog\`
- **File Format:** `blog/YYYY-MM-DD-daily-blog.html`
- **Content:** Beach weather, activities, transportation tips (941-600-8380)
- **Updates:** Daily at 7:00 AM

### 2. FreeRatesUpdate
- **GitHub Repo:** https://github.com/davidmday99-lgtm/freeratesupdate.com
- **Blog Directory:** `C:\Users\David PC\.openclaw\workspace\freeratesupdate.com\blog\posts\`
- **Index File:** `posts/index.json`
- **File Format:** `blog/posts/YYYY-MM-DD-slug.html`
- **Content:** Mortgage tips, rates, loan advice
- **Updates:** Daily at 7:00 AM

### 3. ProAutoTek
- **GitHub Repo:** (check workspace)
- **Blog Directory:** `C:\Users\David PC\.openclaw\workspace\proautotek\blog\posts\`
- **File Format:** `blog/posts/YYYY-MM-DD-slug.html`
- **Content:** Car diagnostics, repair tips, software updates
- **Updates:** Daily at 7:15 AM

### 4. STL Public Adjusting
- **GitHub Repo:** https://github.com/davidmday99-lgtm/stlpublic
- **Blog Directory:** `C:\Users\David PC\.openclaw\workspace\STLPublicAdjusting\posts\`
- **File Format:** `posts/YYYY-MM-DD-slug.html`
- **Content:** Property damage claims, insurance tips
- **Updates:** Daily at 7:00 AM

### 5. Drive Again Secrets
- **GitHub Repo:** https://github.com/davidmday99-lgtm/driveagainsecrets
- **Blog Directory:** `C:\Users\David PC\.openclaw\workspace\driveagainsecrets\blog\`
- **Index File:** `blog.html` or `blog/posts.js`
- **File Format:** `blog/YYYY-MM-DD-slug.html`
- **Content:** License reinstatement tips, DMV guides
- **Updates:** Daily at 7:00 AM
- **Status:** Currently paused on Netlify (needs upgrade or migration to GitHub Pages)

---

## Critical Rules for Subagents

1. **ALWAYS use the exact directory path listed above**
2. **NEVER save to** `C:\Users\David PC\.openclaw\workspace\blog\` (generic directory - WRONG)
3. **ALWAYS verify the post is in the correct repo directory before committing**
4. **ALWAYS update the correct index file** (index.json, blog.html, etc.)
5. **ALWAYS push to the correct GitHub repo**

## Prevention Checklist

Before committing any blog post, verify:
- [ ] File is in the correct site directory (not generic /blog/)
- [ ] File matches the site's naming convention
- [ ] Index file (if applicable) has been updated
- [ ] Commit message is descriptive
- [ ] Push is to the correct GitHub repo
- [ ] Post is live on the website within 5 minutes

---

Last Updated: 2026-05-22 12:07 CDT
