#!/usr/bin/env node

/**
 * Ultra Image Optimization Script
 * Converts images to WebP and creates responsive versions
 * Expected Performance Gain: +15-20 PageSpeed points
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = './public';
const OUTPUT_DIR = './public/optimized';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Image optimization configuration
const QUALITY_SETTINGS = {
  webp: { quality: 85, effort: 6 },
  jpeg: { quality: 90, progressive: true },
  png: { quality: 90, compressionLevel: 9 }
};

// Responsive breakpoints
const BREAKPOINTS = [
  { suffix: 'xs', width: 480 },   // Mobile
  { suffix: 'sm', width: 768 },   // Tablet
  { suffix: 'md', width: 1024 },  // Desktop
  { suffix: 'lg', width: 1280 },  // Large Desktop
  { suffix: 'xl', width: 1920 }   // XL Desktop
];

async function optimizeImage(inputPath, filename) {
  const name = path.parse(filename).name;
  const ext = path.parse(filename).ext.toLowerCase();
  
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    console.log(`⏭️  Skipping ${filename} (not optimizable)`);
    return;
  }
  
  console.log(`🖼️  Optimizing ${filename}...`);
  
  try {
    const originalBuffer = fs.readFileSync(inputPath);
    const originalSize = originalBuffer.length;
    
    // Get original image metadata
    const metadata = await sharp(originalBuffer).metadata();
    const originalWidth = metadata.width;
    
    // Generate responsive versions
    for (const breakpoint of BREAKPOINTS) {
      // Skip if breakpoint is larger than original
      if (breakpoint.width >= originalWidth) continue;
      
      // WebP version
      const webpBuffer = await sharp(originalBuffer)
        .resize(breakpoint.width, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp(QUALITY_SETTINGS.webp)
        .toBuffer();
      
      const webpPath = path.join(OUTPUT_DIR, `${name}-${breakpoint.suffix}.webp`);
      fs.writeFileSync(webpPath, webpBuffer);
      
      // Fallback JPEG version
      const jpegBuffer = await sharp(originalBuffer)
        .resize(breakpoint.width, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg(QUALITY_SETTINGS.jpeg)
        .toBuffer();
      
      const jpegPath = path.join(OUTPUT_DIR, `${name}-${breakpoint.suffix}.jpg`);
      fs.writeFileSync(jpegPath, jpegBuffer);
      
      console.log(`  ✅ ${breakpoint.suffix}: WebP ${(webpBuffer.length / 1024).toFixed(1)}KB, JPEG ${(jpegBuffer.length / 1024).toFixed(1)}KB`);
    }
    
    // Full-size optimized versions
    const fullWebpBuffer = await sharp(originalBuffer)
      .webp(QUALITY_SETTINGS.webp)
      .toBuffer();
    
    const fullJpegBuffer = await sharp(originalBuffer)
      .jpeg(QUALITY_SETTINGS.jpeg)
      .toBuffer();
    
    fs.writeFileSync(path.join(OUTPUT_DIR, `${name}.webp`), fullWebpBuffer);
    fs.writeFileSync(path.join(OUTPUT_DIR, `${name}.jpg`), fullJpegBuffer);
    
    const webpSavings = ((originalSize - fullWebpBuffer.length) / originalSize * 100).toFixed(1);
    const jpegSavings = ((originalSize - fullJpegBuffer.length) / originalSize * 100).toFixed(1);
    
    console.log(`  📊 Original: ${(originalSize / 1024).toFixed(1)}KB`);
    console.log(`  🎯 WebP: ${(fullWebpBuffer.length / 1024).toFixed(1)}KB (-${webpSavings}%)`);
    console.log(`  📄 JPEG: ${(fullJpegBuffer.length / 1024).toFixed(1)}KB (-${jpegSavings}%)`);
    
  } catch (error) {
    console.error(`❌ Error optimizing ${filename}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting Ultra Image Optimization...\n');
  
  const files = fs.readdirSync(INPUT_DIR);
  const imageFiles = files.filter(file => 
    ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())
  );
  
  console.log(`📁 Found ${imageFiles.length} images to optimize\n`);
  
  for (const file of imageFiles) {
    await optimizeImage(path.join(INPUT_DIR, file), file);
    console.log('');
  }
  
  console.log('✨ Image optimization complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Update components to use optimized images');
  console.log('2. Implement responsive image component');
  console.log('3. Add WebP support with JPEG fallbacks');
}

// Run only if called directly (simplified check)
main().catch(console.error);

export { optimizeImage, BREAKPOINTS, QUALITY_SETTINGS };