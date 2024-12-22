const fs = require('fs');
const path = require('path');

// Custom build logic here
console.log('Building the project...');

// Example: Copy files from src to dist
const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

fs.readdirSync(srcDir).forEach(file => {
  const srcFile = path.join(srcDir, file);
  const distFile = path.join(distDir, file);
  fs.copyFileSync(srcFile, distFile);
  console.log(`Copied ${file} to dist`);
});

console.log('Build completed.');
