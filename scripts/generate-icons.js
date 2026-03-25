#!/usr/bin/env node
/**
 * Generates AttachMatch PWA icons as valid PNG files using only Node built-ins.
 * Creates a pink rounded-square with a white heart shape.
 */
const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

function u32(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n, 0);
  return b;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeB = Buffer.from(type, 'ascii');
  const crcB  = u32(crc32(Buffer.concat([typeB, data])));
  return Buffer.concat([u32(data.length), typeB, data, crcB]);
}

function makePNG(size) {
  const cx = size / 2, cy = size / 2;

  // Background: brand pink #be185d
  const BR = 0xbe, BG = 0x18, BB = 0x5d;
  // Heart: white
  const HR = 0xff, HG = 0xff, HB = 0xff;

  // Heart check using standard parametric heart equation
  // Scale heart to ~55% of icon
  const hScale = size * 0.28;
  const hOffY  = size * 0.06; // shift down slightly

  function isHeart(px, py) {
    const x = (px - cx) / hScale;
    const y = -((py - cy - hOffY) / hScale);
    // Heart curve: (x²+y²-1)³ - x²y³ ≤ 0
    const v = x * x + y * y - 1;
    return v * v * v - x * x * y * y * y <= 0.02;
  }

  // Corner radius for rounded square background (~18%)
  const r = Math.round(size * 0.18);

  function isInRoundedSquare(px, py) {
    const dx = Math.max(0, Math.abs(px - cx) - (size / 2 - r));
    const dy = Math.max(0, Math.abs(py - cy) - (size / 2 - r));
    return dx * dx + dy * dy <= r * r;
  }

  const rows = [];
  for (let y = 0; y < size; y++) {
    // filter byte = 0 (None)
    const row = Buffer.alloc(1 + size * 4); // RGBA
    for (let x = 0; x < size; x++) {
      const offset = 1 + x * 4;
      if (!isInRoundedSquare(x, y)) {
        // Transparent outside rounded square
        row[offset]     = 0;
        row[offset + 1] = 0;
        row[offset + 2] = 0;
        row[offset + 3] = 0;
      } else if (isHeart(x, y)) {
        row[offset]     = HR;
        row[offset + 1] = HG;
        row[offset + 2] = HB;
        row[offset + 3] = 255;
      } else {
        row[offset]     = BR;
        row[offset + 1] = BG;
        row[offset + 2] = BB;
        row[offset + 3] = 255;
      }
    }
    rows.push(row);
  }

  const raw        = Buffer.concat(rows);
  const compressed = zlib.deflateSync(raw, { level: 9 });

  const sig  = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = chunk('IHDR', Buffer.concat([
    u32(size), u32(size),
    Buffer.from([8, 6, 0, 0, 0]), // 8-bit RGBA
  ]));
  const idat = chunk('IDAT', compressed);
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

const outDir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(outDir, { recursive: true });

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
for (const s of sizes) {
  const buf  = makePNG(s);
  const file = path.join(outDir, `icon-${s}.png`);
  fs.writeFileSync(file, buf);
  console.log(`✓ icon-${s}.png  (${buf.length} bytes)`);
}

// Also write apple-touch-icon (180px)
const apple = makePNG(180);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'), apple);
console.log('✓ apple-touch-icon.png');

// Favicon (32px)
const fav = makePNG(32);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.png'), fav);
console.log('✓ favicon.png');

console.log('\nAll icons generated successfully!');
