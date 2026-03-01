#!/usr/bin/env node
/**
 * Pre-generates base64 image data for all public/images/ files.
 * Output: lib/generated-image-data.ts
 *
 * Run manually: node scripts/generate-image-data.js
 * Or automatically via package.json "prebuild" script.
 */

const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'images');
const outputFile = path.join(__dirname, '..', 'lib', 'generated-image-data.ts');

const files = fs.readdirSync(imagesDir).filter(f => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f));

const lines = [
  '// AUTO-GENERATED – do not edit manually.',
  '// Regenerate with: node scripts/generate-image-data.js',
  '',
  'export const GENERATED_IMAGES: Record<string, string> = {',
];

for (const file of files) {
  const filePath = path.join(imagesDir, file);
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');
  const ext = path.extname(file).slice(1).toLowerCase();
  const mime = (ext === 'jpg' || ext === 'jpeg') ? 'image/jpeg'
    : ext === 'svg' ? 'image/svg+xml'
    : ext === 'gif' ? 'image/gif'
    : ext === 'webp' ? 'image/webp'
    : 'image/png';
  lines.push(`  ${JSON.stringify(file)}: 'data:${mime};base64,${base64}',`);
}

lines.push('};', '');

fs.writeFileSync(outputFile, lines.join('\n'), 'utf8');
console.log(`Generated ${outputFile} with ${files.length} images.`);
