# Setting Up the Correct Google Place ID

## ⚠️ CRITICAL: The Current reviews.html Has a PLACEHOLDER Google Place ID

The reviews.html file currently uses this placeholder:
```
https://search.google.com/local/writereview?placeid=ChIJVVVVVVVVVVVVVVVVVVVVVVV
```

This is **NOT FUNCTIONAL**. All review links go nowhere.

---

## 🔍 How to Find Your Actual Google Place ID

### Method 1: From Google Business Profile (RECOMMENDED)
1. Go to [Google Business Profile](https://business.google.com)
2. Sign in with the account managing "Siesta Free Ride"
3. Find your business listing (should show "Siesta Free Ride" + address)
4. Click "Customers" → "Reviews"
5. OR click the "Write a review" link
6. Copy the URL from the browser address bar
7. Extract the `placeid=XXXXX` value

**Example URL:**
```
https://search.google.com/local/writereview?placeid=ChIJrb8UkGEyXIYRQKHJmgG-5Tw
                                                     ↑
                                        Your Place ID is here
```

### Method 2: From Google Maps
1. Go to [Google Maps](https://maps.google.com)
2. Search for "Siesta Free Ride"
3. Click on your business listing
4. Click "Write a review"
5. Copy the `placeid` from the URL

### Method 3: Using Google Places API
```bash
# If you have curl installed:
curl "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Siesta%20Free%20Ride&components=country:us&key=YOUR_API_KEY"
```

---

## ✅ Implementation Steps

### 1. Update reviews.html
Once you have your Place ID (example: `ChIJrb8UkGEyXIYRQKHJmgG-5Tw`):

**Old (Placeholder):**
```html
<a href="https://search.google.com/local/writereview?placeid=ChIJVVVVVVVVVVVVVVVVVVVVVVV">
```

**New (Your Place ID):**
```html
<a href="https://search.google.com/local/writereview?placeid=ChIJrb8UkGEyXIYRQKHJmgG-5Tw">
```

### 2. Update ALL occurrences
The reviews.html file has the placeholder in **3 locations**:
- Line ~69: Main CTA button at top
- Line ~100: Google platform card
- Line ~158: Bottom CTA button

**To update all at once (command line):**
```bash
sed -i 's/ChIJVVVVVVVVVVVVVVVVVVVVVVV/ChIJrb8UkGEyXIYRQKHJmgG-5Tw/g' reviews.html
```

Or find and replace in your editor:
- Find: `ChIJVVVVVVVVVVVVVVVVVVVVVVV`
- Replace: `ChIJrb8UkGEyXIYRQKHJmgG-5Tw` (your actual ID)

### 3. Test the link
1. Open reviews.html in a browser
2. Click any "Leave a Google Review" button
3. You should go to the Google review submission page
4. If you get a "Business not found" error, the Place ID is wrong

### 4. Verify in other files
Also check if reviews.html is embedded in:
- index.html
- contact.html
- blog.html
- Any other pages

Search for the placeholder ID:
```bash
grep -r "ChIJVVVVVVVVVVVVVVVVVVVVVVV" .
```

---

## 🔗 Related URLs to Update

### Facebook
**Current:** `href="#"` (broken)
**Should be:** `https://www.facebook.com/siestafreeride` or your actual URL

To find: Search "Siesta Free Ride" on Facebook, copy URL

### Yelp
**Current:** `href="#"` (broken)
**Should be:** `https://www.yelp.com/biz/siesta-free-ride` or search your business

To find: Go to Yelp.com, search "Siesta Free Ride", copy URL

### TripAdvisor
**Current:** `href="#"` (broken)
**Should be:** `https://www.tripadvisor.com/Search?q=Siesta+Free+Ride` or direct link to your business

To find: Go to TripAdvisor, search your business, copy URL

---

## 📋 Social Media Setup Checklist

- [ ] **Google Business Profile** - Verified and claimed
  - Link: https://business.google.com
  - Action: Ensure business info is complete

- [ ] **Google Maps** - Listing visible
  - Link: https://maps.google.com
  - Search: "Siesta Free Ride"
  - Check: Address, phone, hours, photos

- [ ] **Facebook** - Page created or updated
  - Link: https://www.facebook.com/siestafreeride
  - Check: Page is active and accepts reviews

- [ ] **Yelp** - Business listed
  - Link: https://www.yelp.com
  - Check: Business info is accurate

- [ ] **TripAdvisor** - Business listed
  - Link: https://www.tripadvisor.com
  - Check: Listed under "Transportation & Shuttles"

---

## 🚀 Deployment After Updates

Once all URLs are correct:

1. **Commit changes:**
```bash
git add reviews.html
git commit -m "Marketing: Update Google Place ID and social media URLs"
```

2. **Push to production:**
```bash
git push origin main
```

3. **Clear cache** (if using Netlify/CDN):
```bash
# This depends on your hosting provider
# Usually: Deploy > Trigger deploy
```

4. **Test all links** on the live site:
   - Click "Leave a Google Review" → Should open Google review form
   - Click "Facebook" → Should open Facebook page
   - Click "Yelp" → Should open Yelp page
   - Click "TripAdvisor" → Should open TripAdvisor page

---

## 🐛 Troubleshooting

### "Business not found" error
- ✓ Check Place ID is correct
- ✓ Check business is verified on Google
- ✓ Try the link from Google Business Profile directly

### Links go to wrong business
- ✓ Verify business name matches exactly
- ✓ Check address is correct
- ✓ Try claiming the business listing again

### Facebook/Yelp/TripAdvisor links dead
- ✓ Verify business is listed on these platforms
- ✓ Check URL format is correct
- ✓ Test link in browser directly

---

## 📊 Next Steps

After updating and deploying:

1. **Monitor review submissions** - Check back in 1 week
2. **Track metrics** - How many people are clicking?
3. **A/B test variations** - Try different button text/colors
4. **Promote the link** - Share /reviews.html on social media
5. **Respond to reviews** - Engage with new reviews promptly

---

## ❓ Questions?

For detailed setup help:
- Google: [Set up your business on Google](https://support.google.com/business/answer/3038063)
- Yelp: [Claim Your Business](https://biz.yelp.com)
- TripAdvisor: [Add Your Business](https://businesscenter.tripadvisor.com)

---

**Status:** 🔴 CRITICAL - Implementation Required  
**Priority:** HIGH - Blocks all review conversions  
**Estimated Time:** 10-15 minutes  
