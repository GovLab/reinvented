# ReinventED Offline Setup

This document explains how the ReinventED site has been configured for offline use.

## What Was Done

### 1. API Data Download
- Downloaded all Directus API collections as local JSON files:
  - `data/about.json`
  - `data/phases.json`
  - `data/people.json`
  - `data/communications.json`
  - `data/alert_banner.json`
  - `data/states.json`
  - `data/allourideas.json`
  - `data/aoi_tool.json`

### 2. Asset Download
- Downloaded all referenced assets (images, PDFs) from the API
- Assets are stored in `assets/` directory
- JSON files updated to reference local asset paths

### 3. Vendor Files Download
- Downloaded all external JS/CSS libraries:
  - jQuery, Vue.js, Directus SDK, FontAwesome, etc.
  - Stored in `js/vendor/` and `css/vendor/` directories

### 4. HTML Files Patched
- All HTML files updated to use local vendor files instead of CDN
- All image paths updated to use local assets
- Meta tags updated to use local paths

### 5. JavaScript Offline Mode
- `reinvented.js` and `allourideas.js` patched to support offline mode
- Automatically detects if DirectusSDK is available
- Falls back to loading from local JSON files if offline

## How It Works

### Offline Mode Detection
The site automatically detects offline mode when:
- `DirectusSDK` is not defined (SDK file missing)
- `window.OFFLINE_MODE` is set to `true`

### Data Loading
- **Online**: Uses Directus API via DirectusSDK
- **Offline**: Loads data from local JSON files in `data/` directory

### Asset Loading
- All images, PDFs, and other assets load from local `assets/` directory
- No external dependencies for core functionality

## Files Structure

```
reinvented/
├── data/                    # Local JSON data files
│   ├── about.json
│   ├── phases.json
│   ├── people.json
│   └── ...
├── assets/                  # Downloaded assets
│   ├── uploads_your-education-your-voice_originals_*.png
│   └── ...
├── js/
│   ├── vendor/             # Downloaded JS libraries
│   │   ├── jquery-3.5.1.min.js
│   │   ├── directus-sdk.umd.min.js
│   │   ├── vue-2.0.3.js
│   │   └── ...
│   ├── reinvented.js       # Patched for offline mode
│   ├── allourideas.js      # Patched for offline mode
│   └── fadein.js
├── css/
│   ├── vendor/             # Downloaded CSS libraries
│   │   ├── font-awesome-4.7.0.min.css
│   │   ├── material-icons.css
│   │   └── ...
│   └── styles.css
├── img/                    # Local images
│   ├── meta-image.jpeg
│   ├── the-govlab-logo.svg
│   └── ...
└── *.html                  # All HTML files patched for offline use
```

## Testing

### Test Offline Functionality
1. Open `test-offline.html` in a browser
2. It will check all required files and data loading
3. Shows pass/fail status for each component

### Manual Testing
1. Open any HTML file in a browser
2. Check browser console for offline mode messages
3. Verify data loads from local JSON files
4. Verify images and assets load from local paths

## Switching Between Online/Offline

### Force Offline Mode
```javascript
// Set before page loads
window.OFFLINE_MODE = true;
```

### Force Online Mode
```javascript
// Set before page loads
window.OFFLINE_MODE = false;
```

### Automatic Detection
- If DirectusSDK is available: Online mode
- If DirectusSDK is missing: Offline mode

## Scripts Available

### `download-api-data.js`
Downloads all API collections as JSON files.

### `download-assets-and-rewrite-json.js`
Downloads all referenced assets and updates JSON to use local paths.

### `download-vendor-files.js`
Downloads all vendor JS/CSS libraries.

### `patch-all-html.js`
Patches all HTML files for offline use.

## Troubleshooting

### Common Issues

1. **"DirectusSDK is not defined"**
   - This is expected in offline mode
   - Check console for "Offline mode: true" message

2. **Missing vendor files**
   - Run `node download-vendor-files.js`

3. **Missing data files**
   - Run `node download-api-data.js`

4. **Missing assets**
   - Run `node download-assets-and-rewrite-json.js`

5. **Image paths not working**
   - Check that assets are in `assets/` directory
   - Verify JSON files reference correct local paths

### Debug Mode
Check browser console for:
- `Offline mode: true/false`
- `Loading [type] data from local JSON...`
- `[Type] data loaded: [...]`

## Deployment

For full offline deployment:
1. Run all download scripts
2. Ensure all vendor files are present
3. Test with `test-offline.html`
4. Deploy entire directory structure

The site will work completely offline with no external dependencies. 