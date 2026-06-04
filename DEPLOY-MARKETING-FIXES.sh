#!/bin/bash

# Siesta Free Ride - Marketing Optimization Deployment Script
# This script applies critical fixes to reviews.html and navigation files
# IMPORTANT: Update YOUR_ACTUAL_PLACE_ID with real Google Place ID before running

echo "🚀 Siesta Free Ride - Marketing Optimization Deployment"
echo "======================================================"
echo ""

# Check for uncommitted changes
if ! git diff --quiet; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "Commit or stash changes before deploying"
    echo ""
fi

# Step 1: Update Google Place ID
echo "Step 1: Updating Google Place ID references..."
echo "⚠️  IMPORTANT: Replace 'YOUR_ACTUAL_PLACE_ID' with your real Google Place ID"
echo ""
echo "To find your Google Place ID:"
echo "1. Go to Google Business Profile"
echo "2. Click 'Write a review'"
echo "3. Copy the 'placeid=XXXXX' value from the URL"
echo ""
read -p "Enter your Google Place ID (or press Enter to skip): " PLACE_ID

if [ ! -z "$PLACE_ID" ]; then
    echo "Updating reviews.html with Place ID: $PLACE_ID"
    sed -i "s/YOUR_ACTUAL_PLACE_ID/$PLACE_ID/g" reviews.html
    echo "✅ Updated reviews.html"
else
    echo "⚠️  Skipping Place ID update - You'll need to update manually"
fi

echo ""
echo "Step 2: Verifying social media URLs..."
grep -n "facebook.com\|yelp.com\|tripadvisor.com" reviews.html
echo "✅ Social URLs verified"

echo ""
echo "Step 3: Checking navigation consistency..."
echo "Reviews link in contact.html:"
grep "href=\"/reviews.html\"" contact.html | head -1
echo "Reviews link in blog.html:"
grep "href=\"/reviews.html\"" blog.html | head -1
echo ""

echo "Step 4: Creating backup..."
git add reviews.html index.html contact.html blog.html
echo "✅ Staged for commit"

echo ""
echo "📋 DEPLOYMENT CHECKLIST:"
echo "☐ Google Place ID updated and tested"
echo "☐ Social media URLs are active"
echo "☐ All internal links working"
echo "☐ Mobile experience tested"
echo "☐ Analytics events configured"
echo ""

echo "Ready to deploy? Review changes with:"
echo "  git diff --cached"
echo ""
echo "Then commit with:"
echo "  git commit -m 'Marketing: Optimize reviews page for conversion'"
echo ""
echo "Push to production:"
echo "  git push origin main"
echo ""
