# Customer photo moderation

Customer photo submissions from `share-photos.html` are delivered privately to `siestafreeride@gmail.com` through FormSubmit. They never publish automatically.

Before approving a photo:

1. Confirm the submission includes the required ownership, consent and publication permission.
2. Reject photos containing unsafe behavior, private information, copyrighted material, offensive content or identifiable children without guardian permission.
3. Download an approved JPEG or PNG and optimize it for the web before adding it to `assets/community-photos/`.
4. Add one item to `community-photos.json` with `src`, `alt`, `caption`, `location` and, only when allowed, `credit`.
5. Preview the gallery and publish the site update.

Do not add an admin password or approval token to browser-side HTML or JavaScript. Anything committed to this static site is public.
