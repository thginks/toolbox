/**
 * 生成 Tauri 默认图标的修复版本
 * 运行: node src-tauri/generate-icons.cjs
 * 生成: src-tauri/icons/ 下的所有必需图标文件
 *
 * 生成的只是纯色占位图标，上线前请替换为正式设计稿。
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

// 生成正确的 PNG 文件
function createValidPng(width, height) {
  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8);  // bit depth
  ihdr.writeUInt8(2, 9);  // color type (RGB)
  ihdr.writeUInt8(0, 10); // compression method
  ihdr.writeUInt8(0, 11); // filter method
  ihdr.writeUInt8(0, 12); // interlace method
  
  // Create IDAT data (raw image data)
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0); // filter byte (none)
    for (let x = 0; x < width; x++) {
      // Blue pixel (#0ea5e9 = RGB: 14, 165, 233)
      rawData.push(14, 165, 233);
    }
  }
  
  const rawBuffer = Buffer.from(rawData);
  const compressed = zlib.deflateSync(rawBuffer);
  
  // Create chunks
  function createChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    
    const typeBuffer = Buffer.from(type, 'ascii');
    const crcData = Buffer.concat([typeBuffer, data]);
    
    // Calculate CRC
    const crc = crc32(crcData);
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc, 0);
    
    return Buffer.concat([length, typeBuffer, data, crcBuffer]);
  }
  
  // CRC32 implementation
  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = crc ^ buf[i];
      for (let j = 0; j < 8; j++) {
        if (crc & 1) {
          crc = (crc >>> 1) ^ 0xEDB88320;
        } else {
          crc = crc >>> 1;
        }
      }
    }
    return (crc ^ (-1)) >>> 0;
  }
  
  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// 写入 PNG 文件
function writePng(name, width, height) {
  const filePath = path.join(iconsDir, name);
  const pngData = createValidPng(width, height);
  fs.writeFileSync(filePath, pngData);
  console.log(`  ✓ ${name} (${width}x${height})`);
}

// 写入 ICO 文件（包含一个 PNG 图标）
function writeIco() {
  const icoPath = path.join(iconsDir, 'icon.ico');
  
  // 生成 32x32 的 PNG 数据
  const pngData = createValidPng(32, 32);
  
  // ICO header: reserved(2) + type(2) + count(2)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);     // reserved
  header.writeUInt16LE(1, 2);     // type = icon
  header.writeUInt16LE(1, 4);     // count = 1 image
  
  // ICO directory entry: w(1) + h(1) + colors(1) + reserved(1) + planes(2) + bpp(2) + size(4) + offset(4)
  const entry = Buffer.alloc(16);
  entry.writeUInt8(0, 0);         // width (0 = 256)
  entry.writeUInt8(0, 1);         // height (0 = 256)
  entry.writeUInt8(0, 2);         // colors
  entry.writeUInt8(0, 3);         // reserved
  entry.writeUInt16LE(1, 4);      // planes
  entry.writeUInt16LE(32, 6);     // bpp
  entry.writeUInt32LE(pngData.length, 8);  // size of image data
  entry.writeUInt32LE(22, 12);    // offset (6 + 16 = 22)
  
  fs.writeFileSync(icoPath, Buffer.concat([header, entry, pngData]));
  console.log(`  ✓ icon.ico`);
}

console.log('生成 Tauri 占位图标（修复版本）...\n');

writePng('32x32.png', 32, 32);
writePng('128x128.png', 128, 128);
writePng('128x128@2x.png', 256, 256);
writePng('icon.png', 512, 512);
writeIco();

// .icns 需要 macOS 工具链，跳过（Windows/Linux 不需要）
console.log('\n  ⚠ icon.icns 跳过（需 macOS 环境生成）');
console.log('\n✅ 图标生成完成！上线前请替换为正式设计稿。');
