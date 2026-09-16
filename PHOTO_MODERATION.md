# Customer photo moderation

Customer photos from `share-photos.html` upload to Cloudinary using the unsigned preset `siesta_community_pending` and enter manual moderation. FormSubmit sends the private contact details to `siestafreeride@gmail.com`. The email address is not stored in Cloudinary.

Before approving a photo:

1. Confirm the submission includes the required ownership, consent and publication permission.
2. Reject photos containing unsafe behavior, private information, copyrighted material, offensive content or identifiable children without guardian permission.
3. Open Cloudinary's **Moderation** page and approve or reject the pending asset.
4. The Cloudinary automation adds the `siesta-community-approved` tag to approved assets.
5. The public gallery reads that approved-only tag list and updates automatically (Cloudinary may cache the list for about one minute).

`community-photos.json` remains as a fallback for any photos added directly to the repository.

Do not add an admin password or approval token to browser-side HTML or JavaScript. Anything committed to this static site is public.
