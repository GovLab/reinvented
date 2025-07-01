// Usage: node download-assets-and-rewrite-json.js
// Scans all JSON files in data/, downloads referenced assets, and rewrites JSON to use local asset paths

const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const DATA_DIR = path.join(__dirname, 'data');
const ASSETS_DIR = path.join(__dirname, 'assets');
if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR);

// Regex to match asset URLs (images, pdfs, etc.)
const ASSET_REGEX = /(https?:[^\"'\s]+\.(?:jpg|jpeg|png|gif|svg|pdf))/ig;

function getAllJsonFiles() {
  return fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = await res.buffer();
  fs.writeFileSync(dest, buffer);
}

function getAssetFilename(url) {
  const urlObj = new URL(url);
  return urlObj.pathname.split('/').filter(Boolean).join('_');
}

async function processJsonFile(file) {
  const filePath = path.join(DATA_DIR, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let assets = [...content.matchAll(ASSET_REGEX)].map(m => m[1]);
  let urlToLocal = {};
  for (const url of assets) {
    const filename = getAssetFilename(url);
    const localPath = `assets/${filename}`;
    urlToLocal[url] = localPath;
    const assetDest = path.join(__dirname, localPath);
    if (!fs.existsSync(assetDest)) {
      try {
        console.log(`Downloading ${url} -> ${localPath}`);
        await download(url, assetDest);
      } catch (e) {
        console.error(`Failed to download ${url}:`, e);
      }
    }
  }
  // Rewrite JSON content
  let newContent = content;
  for (const [url, local] of Object.entries(urlToLocal)) {
    newContent = newContent.split(url).join(local);
  }
  fs.writeFileSync(filePath, newContent);
}

(async () => {
  const files = getAllJsonFiles();
  for (const file of files) {
    await processJsonFile(file);
  }
  console.log('All assets downloaded and JSON files rewritten.');
})(); 