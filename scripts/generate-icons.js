const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');

async function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = '#3B82F6';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();

  // Draw "W" text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${size * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('W', size / 2, size / 2);

  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`extension/icons/icon${size}.png`, buffer);
  console.log(`Generated icon${size}.png`);
}

// Generate icons for different sizes
[16, 48, 128].forEach(size => generateIcon(size));
