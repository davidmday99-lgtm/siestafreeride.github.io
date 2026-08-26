import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SITE = 'https://siestafreeride.com';
const ROOT_PAGES = [
  'advertise.html',
  'beaches.html',
  'blog.html',
  'contact.html',
  'events.html',
  'faq.html',
  'guide.html',
  'index.html',
  'photos.html',
  'reviews.html',
  'service-area.html',
];

function urlFor(relativePath){
  const normalized = relativePath.replaceAll('\\', '/');
  return normalized === 'index.html' ? `${SITE}/` : `${SITE}/${normalized}`;
}

async function addCanonical(relativePath){
  const filePath = path.join(ROOT, relativePath);
  const html = await fs.readFile(filePath, 'utf8');
  if(/<link\s+[^>]*rel=["']canonical["']/i.test(html)) return false;
  const eol = html.includes('\r\n') ? '\r\n' : '\n';
  const tag = `<link rel="canonical" href="${urlFor(relativePath)}">`;
  const updated = html.replace(/<\/title>/i, (match) => `${match}${eol}${tag}`);
  if(updated === html) throw new Error(`Could not add canonical to ${relativePath}`);
  await fs.writeFile(filePath, updated);
  return true;
}

const blogFiles = (await fs.readdir(path.join(ROOT, 'blog')))
  .filter((name) => /^\d{4}-\d{2}-\d{2}-daily-blog\.html$/.test(name))
  .map((name) => path.join('blog', name));

let changed = 0;
for(const relativePath of [...ROOT_PAGES, ...blogFiles]){
  if(await addCanonical(relativePath)) changed += 1;
}

console.log(`Added ${changed} canonical tags.`);
