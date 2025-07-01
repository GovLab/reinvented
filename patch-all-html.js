// Usage: node patch-all-html.js
// Patches all HTML files for offline use

const fs = require('fs');
const path = require('path');

const HTML_FILES = [
  // Root HTML files
  'about.html',
  'communications-kit.html', 
  'contact.html',
  'information-collection-statement.html',
  'reinvented.html',
  'student-council.html',
  'team.html',
  // Phase subfolder HTML files
  'phases/all-your-ideas/index.html',
  'phases/all-your-ideas/es/index.html',
  'phases/my-skills-my-future/index.html',
  'phases/student-council/index.html',
  'phases/the-assembly/index.html'
];

// Replacements to make
const REPLACEMENTS = [
  // External CSS/JS to local vendor files
  {
    from: 'https://use.typekit.net/kad3hcl.css',
    to: 'css/vendor/typekit-kad3hcl.css'
  },
  {
    from: 'https://fonts.googleapis.com/icon?family=Material+Icons',
    to: 'css/vendor/material-icons.css'
  },
  {
    from: 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js',
    to: 'js/vendor/jquery-3.5.1.min.js'
  },
  {
    from: 'https://unpkg.com/@directus/sdk-js@5.3.4/dist/directus-sdk.umd.min.js',
    to: 'js/vendor/directus-sdk.umd.min.js'
  },
  {
    from: 'https://kit.fontawesome.com/f713a12e61.js',
    to: 'js/vendor/fontawesome-kit.js'
  },
  {
    from: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
    to: 'css/vendor/font-awesome-4.7.0.min.css'
  },
  {
    from: 'https://unpkg.com/vue@2.0.3/dist/vue.js',
    to: 'js/vendor/vue-2.0.3.js'
  },
  {
    from: 'https://unpkg.com/vue-meta/dist/vue-meta.min.js',
    to: 'js/vendor/vue-meta.min.js'
  },
  // Meta image URLs to local
  {
    from: 'https://youreducationyourvoice.org/img/meta-image.jpeg',
    to: 'img/meta-image.jpeg'
  },
  {
    from: 'https://youreducationyourvoice.org',
    to: 'index.html'
  },
  // Creative Commons logo
  {
    from: 'https://africa.multicitychallenge.org/images/cc-logo.png',
    to: 'img/cc-logo.png'
  }
];

function patchFile(filename) {
  console.log(`Patching ${filename}...`);
  const filePath = path.join(__dirname, filename);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Determine relative path prefix based on file location
  const depth = filename.split('/').length - 1;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  
  let changes = 0;
  for (const replacement of REPLACEMENTS) {
    const before = content;
    // Adjust paths for subfolders
    let adjustedTo = replacement.to;
    if (replacement.to.startsWith('css/') || replacement.to.startsWith('js/') || 
        replacement.to.startsWith('data/') || replacement.to.startsWith('assets/') ||
        replacement.to.startsWith('img/')) {
      adjustedTo = prefix + replacement.to;
    }
    content = content.replace(new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), adjustedTo);
    if (content !== before) {
      changes++;
    }
  }
  
  // Also fix image paths in Vue templates
  content = content.replace(/team\.headshot\.data\.thumbnails\[3\]\.url/g, `'${prefix}assets/uploads_your-education-your-voice_originals_' + team.headshot.filename_disk`);
  content = content.replace(/phase\.graphic\.data\.full_url/g, `'${prefix}assets/uploads_your-education-your-voice_originals_' + phase.graphic.filename_disk`);
  
  fs.writeFileSync(filePath, content);
  console.log(`✓ Patched ${filename} (${changes} changes) - prefix: ${prefix}`);
}

function patchAll() {
  console.log('Patching all HTML files for offline use...');
  for (const file of HTML_FILES) {
    if (fs.existsSync(file)) {
      patchFile(file);
    } else {
      console.log(`⚠ File ${file} not found, skipping`);
    }
  }
  console.log('All HTML files patched!');
}

patchAll(); 