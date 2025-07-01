// Usage: node download-vendor-files.js
// Downloads all vendor JS and CSS files needed for offline use

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const path = require('path');

const VENDOR_FILES = [
  // CSS files
  {
    url: 'https://use.typekit.net/kad3hcl.css',
    dest: 'css/vendor/typekit-kad3hcl.css'
  },
  {
    url: 'https://fonts.googleapis.com/icon?family=Material+Icons',
    dest: 'css/vendor/material-icons.css'
  },
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
    dest: 'css/vendor/font-awesome-4.7.0.min.css'
  },
  // JS files
  {
    url: 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js',
    dest: 'js/vendor/jquery-3.5.1.min.js'
  },
  {
    url: 'https://unpkg.com/@directus/sdk-js@5.3.4/dist/directus-sdk.umd.min.js',
    dest: 'js/vendor/directus-sdk.umd.min.js'
  },
  {
    url: 'https://kit.fontawesome.com/f713a12e61.js',
    dest: 'js/vendor/fontawesome-kit.js'
  },
  {
    url: 'https://unpkg.com/vue@2.0.3/dist/vue.js',
    dest: 'js/vendor/vue-2.0.3.js'
  },
  {
    url: 'https://unpkg.com/vue-meta/dist/vue-meta.min.js',
    dest: 'js/vendor/vue-meta.min.js'
  }
];

async function downloadFile(url, dest) {
  const destPath = path.join(__dirname, dest);
  const dir = path.dirname(destPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  try {
    console.log(`Downloading ${url} -> ${dest}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.buffer();
    fs.writeFileSync(destPath, buffer);
    console.log(`✓ Downloaded ${dest}`);
  } catch (error) {
    console.error(`✗ Failed to download ${url}:`, error.message);
  }
}

async function downloadAll() {
  console.log('Downloading vendor files...');
  for (const file of VENDOR_FILES) {
    await downloadFile(file.url, file.dest);
  }
  console.log('Vendor files download complete!');
}

downloadAll(); 