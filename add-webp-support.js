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
  'logo.png': { w: 200, h: 100 },
  'qr-code.png': { w: 300, h: 300 },
  'banner.png': { w: 1920, h: 560 },
  'Air-Banner 1920x400.png': { w: 1920, h: 400 },
};

const defaultDimensions = { w: 600, h: 400 };

function getImageDimensions(imageName) {
  return imageDimensions[imageName] || defaultDimensions;
}

function convertToWebPPicture(src, alt, before, after) {
  const imageName = src.split('/').pop();
  const base = src.replace(/\.[^.]+$/, '');
  const webpSrc = base + '.webp';
  const dims = getImageDimensions(imageName);

  const isAboveFold = /logo|banner|Air-Banner|header|hero/i.test(src);
  const loading = isAboveFold ? 'eager' : 'lazy';

  return `<picture>
        <source srcset="${webpSrc}" type="image/webp">
        <img ${before}src="${src}"${after}loading="${loading}" width="${dims.w}" height="${dims.h}">
      </picture>`;
}

function enhanceHtmlWithWebP(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Don't convert img tags that are already in picture elements
  content = content.replace(/<img\s+([^>]*?)src="([^"]+\.(jpg|jpeg|png))"([^>]*?)>/g, (match, before, src, ext, after) => {
    // Skip if already in picture element or if it's a background-image
    if (/picture/i.test(content) && content.indexOf(match) > content.lastIndexOf('</picture>')) {
      return match;
    }

    // Skip certain images that shouldn't be converted yet
    if (/background|inline|data:/i.test(src)) {
      return match;
    }

    const imageName = src.split('/').pop();

    // Convert to picture element
    const newTag = convertToWebPPicture(src, alt, before, after);
    modified = true;
    console.log(`  → Picture element: ${imageName}`);
    return newTag;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

async function addWebPSupport() {
  console.log('🎨 Adding WebP picture element support...\n');

  const repoDir = __dirname;
  let updated = 0;
  let total = 0;

  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !['node_modules', '.git', 'assets/photos', 'images'].includes(file)) {
        walkDir(fullPath);
      } else if (file.endsWith('.html')) {
        total++;
        try {
          if (enhanceHtmlWithWebP(fullPath)) {
            updated++;
            console.log(`✅ ${path.basename(fullPath)}`);
          }
        } catch (err) {
          console.log(`⚠️  Error: ${path.basename(fullPath)}: ${err.message}`);
        }
      }
    }
  }

  walkDir(repoDir);

  console.log(`\n✅ Complete!`);
  console.log(`📊 Updated: ${updated} / ${total} files`);
}

addWebPSupport().catch(console.error);
