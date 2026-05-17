#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const IMAGE_QUALITY = 50;
const WEBP_QUALITY = 45;
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1280;

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n');

  const imageDir = path.join(__dirname, 'assets', 'photos');
  const assetDir = path.join(__dirname, 'assets');
  const imageDir2 = path.join(__dirname, 'images');

  const stats = {
    processed: 0,
    skipped: 0,
    compressed: 0,
    webpConverted: 0,
    savedBytes: 0,
    beforeSize: 0,
    afterSize: 0,
  };

  // Process each directory
  for (const dir of [assetDir, imageDir, imageDir2]) {
    if (!fs.existsSync(dir)) continue;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) continue;
      
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      stats.beforeSize += stat.size;

      try {
        // Only process if larger than 100KB
        if (stat.size > 100000) {
          const result = await compressImage(filePath, ext, stats);
          if (result.converted) {
            stats.webpConverted++;
          }
          stats.compressed++;
        }
        stats.processed++;
      } catch (err) {
        console.log(`⚠️  Error processing ${file}: ${err.message}`);
        stats.skipped++;
      }
    }
  }

  console.log(`\n✅ Optimization complete!`);
  console.log(`📊 Stats:`);
  console.log(`   Processed: ${stats.processed}`);
  console.log(`   Skipped: ${stats.skipped}`);
  console.log(`   Compressed: ${stats.compressed}`);
  console.log(`   WebP converted: ${stats.webpConverted}`);
  console.log(`   Before: ${(stats.beforeSize / 1024 / 1024).toFixed(2)} MiB`);
  console.log(`   After: ${(stats.afterSize / 1024 / 1024).toFixed(2)} MiB`);
  console.log(`   Saved: ${((stats.beforeSize - stats.afterSize) / 1024 / 1024).toFixed(2)} MiB`);
}

async function compressImage(filePath, ext, stats) {
  const fileName = path.basename(filePath);
  const dirName = path.dirname(filePath);
  let converted = false;
  const originalSize = fs.statSync(filePath).size;

  try {
    // For JPG/JPEG: compress aggressively and create WebP
    if (['.jpg', '.jpeg'].includes(ext)) {
      const tempPath = filePath + '.temp.jpg';
      const webpPath = path.join(dirName, fileName.replace(/\.[^.]+$/, '.webp'));

      // Compress original JPG to temp first
      await sharp(filePath)
        .resize(MAX_WIDTH, MAX_HEIGHT, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: IMAGE_QUALITY, progressive: true })
        .toFile(tempPath);

      // Create WebP version
      await sharp(tempPath)
        .webp({ quality: WEBP_QUALITY })
        .toFile(webpPath);

      // Replace original with compressed version
      fs.unlinkSync(filePath);
      fs.renameSync(tempPath, filePath);

      const jpgSize = fs.statSync(filePath).size;
      const webpSize = fs.statSync(webpPath).size;
      const finalSize = Math.min(jpgSize, webpSize);
      stats.afterSize += finalSize;
      stats.savedBytes += originalSize - finalSize;
      converted = true;

      console.log(`✨ ${fileName}`);
      console.log(`   → JPG: ${(jpgSize / 1024).toFixed(1)}KB | WebP: ${(webpSize / 1024).toFixed(1)}KB`);
    }
    // For PNG: compress and create WebP
    else if (ext === '.png') {
      const tempPath = filePath + '.temp.png';
      const webpPath = path.join(dirName, fileName.replace(/\.[^.]+$/, '.webp'));

      // Compress PNG to temp
      await sharp(filePath)
        .resize(MAX_WIDTH, MAX_HEIGHT, { fit: 'inside', withoutEnlargement: true })
        .png({ compressionLevel: 9 })
        .toFile(tempPath);

      // Create WebP
      await sharp(tempPath)
        .webp({ quality: WEBP_QUALITY })
        .toFile(webpPath);

      // Replace original
      fs.unlinkSync(filePath);
      fs.renameSync(tempPath, filePath);

      const pngSize = fs.statSync(filePath).size;
      const webpSize = fs.statSync(webpPath).size;
      const finalSize = Math.min(pngSize, webpSize);
      stats.afterSize += finalSize;
      stats.savedBytes += originalSize - finalSize;
      converted = true;

      console.log(`✨ ${fileName}`);
      console.log(`   → PNG: ${(pngSize / 1024).toFixed(1)}KB | WebP: ${(webpSize / 1024).toFixed(1)}KB`);
    }
  } catch (err) {
    console.log(`   ❌ Failed: ${err.message}`);
    throw err;
  }

  return { converted };
}

optimizeImages().catch(console.error);
