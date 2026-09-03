import fs from 'fs';
import path from 'path';

const sourceDir = 'C:\\Users\\LOQ\\.gemini\\antigravity-ide\\brain\\0bec3d44-85e2-488d-b4fa-adbff628273f';
const targetDir = 'd:\\shamil anti\\assets\\images';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = [
  { src: 'haus_preview_1788167688424.jpg', dest: 'haus.jpg' },
  { src: 'gandaura_preview_1788167724254.jpg', dest: 'gandaura.jpg' },
  { src: 'rentbiz_preview_1788167746042.jpg', dest: 'rentbiz.jpg' },
  { src: 'noviindus_preview_1788167768455.jpg', dest: 'noviindus.jpg' },
  { src: 'design_philosophy_visual_1788167819430.jpg', dest: 'philosophy.jpg' }
];

files.forEach(({ src, dest }) => {
  const srcPath = path.join(sourceDir, src);
  const destPath = path.join(targetDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${src} -> ${dest}`);
  } else {
    console.warn(`Source file not found: ${srcPath}`);
  }
});
