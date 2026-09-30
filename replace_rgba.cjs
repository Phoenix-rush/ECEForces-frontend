const fs = require('fs');
const path = require('path');

const rgbaMap = {
    '110,231,183': '63,185,80', // green
    '217,142,74': '210,153,34', // orange
    '226,96,79': '248,81,73', // red
};

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    for (const [oldRgb, newRgb] of Object.entries(rgbaMap)) {
        const regex = new RegExp(oldRgb, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, newRgb);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated RGBA in ${filePath}`);
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css') || fullPath.endsWith('.js')) {
            replaceInFile(fullPath);
        }
    }
}

traverseDir(path.join(__dirname, 'src'));
