#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Image dimensions mapping
const imageDimensions = {
  'shuttle-1.jpg': { w: 1920, h: 1280 },
  'shuttle-2-blurred.jpg': { w: 1920, h: 1280 },
  'shuttle-3-blurred.jpg': { w: 1920, h: 1280 },
  'shuttle-4-blurred.jpg': { w: 1920, h: 1280 },
  'shuttle-4.jpg': { w: 1920, h: 1280 },
  'IMG_0693.jpeg': { w: 1200, h: 800 },
  'IMG_7303.jpeg': { w: 1200, h: 800 },
  'Venmo.jpeg': { w: 1080, h: 720 },
  'logo.png': { w: 200, h: 100 },
  'das-logo.png': { w: 200, h: 100 },
  'Ditwiler-building-photo.png': { w: 200, h: 150 },
  'qr-code.png': { w: 300, h: 300 },
  'Air-Banner 1920x400.png': { w: 1920, h: 400 },
  'banner.png': { w: 1920, h: 560 },
  'air-conditioned.png': { w: 300, h: 200 },
  'air-conditioned-banner.png': { w: 1920, h: 200 },
  'contact-photo.jpg': { w: 600, h: 400 },
  'detwilers.jpg': { w: 600, h: 400 },
  'contact-photo.jpg': { w: 600, h: 400 }
};

// Default dimensions for images
const defaultDimensions = { w: 600, h: 400 };

function getImageDimensions(imageName) {
  return imageDimensions[imageName] || defaultDimensions;
}

function enhanceHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace img tags to add lazy loading and dimensions
  content = content.replace(/<img\s+([^>]*?)src="([^"]+)"([^>]*?)>/g, (match, before, src, after) => {
    // Extract image name
    const imageName = src.split('/').pop();
    const dims = getImageDimensions(imageName);

    // Check if already has loading attribute
    if (/loading=/i.test(match)) {
      return match;
    }

    // Check if it's above fold (logo, header images, hero images)
    const isAboveFold = /logo|banner|Air-Banner|header|hero/i.test(src);
    const loading = isAboveFold ? 'loading="eager"' : 'loading="lazy"';

    // Check if already has width/height
    const hasWidth = /width=/i.test(match);
    const hasHeight = /height=/i.test(match);
    let dimensions = '';

    if (!hasWidth || !hasHeight) {
      dimensions = ` width="${dims.w}" height="${dims.h}"`;
    }

    // Reconstruct the tag
    const newTag = `<img ${before}src="${src}"${after}${loading}${dimensions}>`;
    modified = true;
    return newTag;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${path.basename(filePath)}`);
    return true;
  }
  return false;
}

async function enhanceAllHtml() {
  console.log('🎯 Enhancing HTML files with lazy-loading & dimensions...\n');

  const repoDir = __dirname;
  let updated = 0;
  let total = 0;

  // Get all HTML files
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (file.endsWith('.html')) {
        total++;
        if (enhanceHtmlFile(fullPath)) {
          updated++;
        }
      }
    }
  }

  walkDir(repoDir);

  console.log(`\n✅ Complete!`);
  console.log(`📊 Updated: ${updated} / ${total} files`);
}

enhanceAllHtml().catch(console.error);
