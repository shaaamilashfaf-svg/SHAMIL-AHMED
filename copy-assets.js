import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('assets/images');
const destDir = path.resolve('public/assets/images');

if (fs.existsSync(srcDir)) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  const files = fs.readdirSync(srcDir);
  files.forEach(file => {
    if (!file.includes('_original')) {
      const srcFile = path.join(srcDir, file);
      const destFile = path.join(destDir, file);
      fs.copyFileSync(srcFile, destFile);
      console.log(`Synced: ${file} -> public/assets/images/`);
    }
  });
}
