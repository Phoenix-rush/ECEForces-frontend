const fs = require('fs');
const path = require('path');

const colorMap = {
    '#0D1512': '#0D1117', // Main BG
    '#131F1A': '#161B22', // Component BG
    '#1A2620': '#21262D', // Card BG
    '#24352C': '#30363D', // Borders
    '#E8EFE9': '#C9D1D9', // Text Primary
    '#8CA398': '#8B949E', // Text Muted
    '#C4D1CA': '#8B949E', // Text Muted alt
    '#6EE7B7': '#3FB950', // Green / AC
    '#34D399': '#2EA043', // Green Hover
    '#D98E4A': '#D29922', // Yellow/Orange
    '#C67D3C': '#A87A16', // Yellow Hover
    '#E2604F': '#F85149', // Red
    '#CC5242': '#DA3633', // Red hover
    '#7F1D1D': '#490202', // Dark red bg
    '#F87171': '#FF7B72', // Light red text
    '#DC2626': '#DA3633', // Red border
};

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // We do case-insensitive replace in case some are lowercase
    for (const [oldColor, newColor] of Object.entries(colorMap)) {
        const regex = new RegExp(oldColor, 'gi');
        if (regex.test(content)) {
            content = content.replace(regex, newColor);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css') || fullPath.endsWith('.js') || fullPath.endsWith('.html')) {
            replaceInFile(fullPath);
        }
    }
}

traverseDir(path.join(__dirname, 'src'));
// Also replace in App.jsx and index.html if outside src (wait, index.html is outside)
replaceInFile(path.join(__dirname, 'index.html'));
