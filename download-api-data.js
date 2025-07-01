// Usage: node download-api-data.js
// Downloads all relevant Directus API collections as JSON files for offline use

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const path = require('path');

const API_BASE = 'https://directus.thegovlab.com/your-education-your-voice/items';
const COLLECTIONS = [
  'about',
  'phases',
  'people',
  'communications',
  'alert_banner',
  'states',
  'allourideas',
  'aoi_tool',
  'faq',
];

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

async function fetchAndSave(collection) {
  const url = `${API_BASE}/${collection}?fields=*.*`;
  console.log(`Fetching ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const data = await res.json();
  fs.writeFileSync(path.join(DATA_DIR, `${collection}.json`), JSON.stringify(data, null, 2));
  console.log(`Saved ${collection}.json`);
}

(async () => {
  for (const collection of COLLECTIONS) {
    try {
      await fetchAndSave(collection);
    } catch (e) {
      console.error(e);
    }
  }
  console.log('All collections downloaded.');
})(); 