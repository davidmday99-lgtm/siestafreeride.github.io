const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const excludedDirectories = new Set([
  '.git',
  'assets',
  'cashforkeysproperties.com',
  'images',
  'openrouter-proxy',
  'scripts'
]);

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (excludedDirectories.has(entry.name)) return [];
      return htmlFiles(fullPath);
    }
    return entry.isFile() && entry.name.endsWith('.html') ? [fullPath] : [];
  });
}

let updated = 0;
for (const file of htmlFiles(root)) {
  const source = fs.readFileSync(file, 'utf8');
  if (source.includes('meta-pixel.js')) continue;
  if (!source.includes('</head>')) {
    throw new Error(`Missing </head> in ${path.relative(root, file)}`);
  }

  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  const relativePrefix = path.relative(path.dirname(file), root).replaceAll('\\', '/');
  const scriptPath = relativePrefix ? `${relativePrefix}/meta-pixel.js` : 'meta-pixel.js';
  const tag = `  <script src="${scriptPath}" defer></script>${newline}`;
  const output = source.replace('</head>', `${tag}</head>`);
  fs.writeFileSync(file, output, 'utf8');
  updated += 1;
}

console.log(`Installed Meta Pixel loader in ${updated} HTML files.`);
