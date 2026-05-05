# BLOG.HTML - LOCKED VERSION

**Status**: STABLE AND LOCKED  
**Version**: blog-v1-stable-may5-2026 (Git tag)  
**Last Updated**: May 5, 2026 09:05 CDT  
**Created**: This file to prevent accidental overwrites

## What This Means

The `blog.html` file is **FROZEN** at the current stable state with:
- ✅ All 31 blog posts listed
- ✅ May 5th post as the first entry
- ✅ Proper date formatting (May 5, 2026 format)
- ✅ Dark theme preserved
- ✅ All CSS and JavaScript working correctly

## DO NOT MODIFY

**blog.html should NEVER be edited by automated jobs or manual edits without explicit intention.**

If you need to:
- **Add a new post to the index**: Edit the `posts` array manually in blog.html (add one entry at the top)
- **Change styling**: Edit the `<style>` section carefully, test in browser before committing
- **Regenerate from scratch**: DELETE THIS FILE FIRST and contact David PC for approval

## Git Tag for Recovery

If blog.html ever gets corrupted, recover it with:
```bash
git checkout blog-v1-stable-may5-2026 -- blog.html
git commit -m "Restored blog.html from stable tag"
git push
```

## Daily Blog Posts

**These ARE allowed to be modified by the Daily Blog Post Generation job**:
- `/blog/YYYY-MM-DD-daily-blog.html` files - safe to create/modify
- These are added to the posts array in blog.html manually, NOT auto-updated

**The job instructions have been updated** to:
- Create only individual daily post files
- NEVER modify blog.html
- Only commit the new post file, not blog.html
