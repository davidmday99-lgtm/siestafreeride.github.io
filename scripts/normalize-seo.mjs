import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { extname, dirname, join, relative, resolve } from "node:path";

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const siteDir = resolve(scriptsDir, "..");
const textExtensions = new Set([".html", ".js"]);
const excludedDirectories = new Set([".git", "cashforkeysproperties.com"]);
const sponsorDomains = "driveagainsecrets\\.com|cashforkeysproperties\\.com|moondoggys\\.com|detwilermarket\\.com|homemortgageguys\\.com";
const sponsorAnchorPattern = new RegExp(`<a\\b[^>]*href=["']https?://(?:www\\.)?(?:${sponsorDomains})[^"']*["'][^>]*>`, "gi");
const titleUpdates = new Map([
  ["siesta-key-village-landing.html", "Siesta Key Village Guide 2026 | Free Rides"],
  ["blog/top-5-things-to-do-siesta-key.html", "Top 5 Things to Do in Siesta Key | Free Rides"],
  ["siesta-key-guide.html", "Siesta Key Village & Beaches Guide | Free Rides"],
  ["siesta-key-free-beach-rides.html", "Free Beach Rides in Siesta Key | Siesta Free Ride"],
  ["srq-airport-shuttle.html", "SRQ Airport Shuttle from Siesta Key | Siesta Free Ride"],
  ["blog/why-pre-booking-airport-ride-saves-stress.html", "Why Pre-Book Your Airport Ride | Siesta Free Ride"],
  ["siesta-key-transportation.html", "Siesta Key Transportation & Free Shuttle Guide"],
  ["blog/locals-guide-siesta-key-village.html", "Siesta Key Village Guide | Dining, Shops & Rides"],
]);
const descriptionUpdates = new Map([
  ["privacy.html", "Read the Siesta Free Ride privacy policy, including how site data, advertising choices and contact information are handled."],
  ["siesta-key-transportation.html", "Compare free rides, beach transportation and SRQ airport options in this practical guide to getting around Siesta Key without parking stress."],
]);

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const path = join(dir, entry.name);
  if (entry.isDirectory()) return excludedDirectories.has(entry.name) ? [] : walk(path);
  return textExtensions.has(extname(entry.name)) ? [path] : [];
});

const qualifySponsoredLinks = (text) => text.replace(sponsorAnchorPattern, (anchor) => {
  const relPattern = /\srel=(["'])([^"']*)\1/i;
  const relMatch = anchor.match(relPattern);

  if (!relMatch) return anchor.replace(/>$/, ' rel="sponsored">');

  const values = relMatch[2].split(/\s+/).filter(Boolean);
  if (!values.includes("sponsored")) values.push("sponsored");
  return anchor.replace(relPattern, ` rel=${relMatch[1]}${values.join(" ")}${relMatch[1]}`);
});

const repairEncoding = (text) => text
  .replace(/caf�/gi, (match) => match[0] === "C" ? "Café" : "café")
  .replace(/Blas�/g, "Blasé")
  .replace(/([A-Za-z])�(s|re|ve|ll|d|t)\b/g, "$1’$2")
  .replace(/(\d)�F\b/g, "$1°F")
  .replace(/(\d\s*(?:am|pm|AM|PM)?)\s*�\s*(\d)/g, "$1–$2")
  .replace(/<li>�\s*/g, "<li>✓ ")
  .replaceAll("�", "—");

let updated = 0;
for (const filePath of walk(siteDir)) {
  const rel = relative(siteDir, filePath).replaceAll("\\", "/");
  let text = readFileSync(filePath, "utf8");
  const original = text;

  text = repairEncoding(text)
    .replaceAll("https://www.driveagainsecrets.com", "https://driveagainsecrets.com")
    .replaceAll('href="index.html"', 'href="/"')
    .replaceAll("href='index.html'", "href='/'")
    .replaceAll('href="../index.html"', 'href="../"')
    .replaceAll("href='../index.html'", "href='../'")
    .replaceAll('href="/index.html"', 'href="/"')
    .replaceAll("href='/index.html'", "href='/'")
    .replaceAll('href="https://siestafreeride.com/contact"', 'href="https://siestafreeride.com/contact.html"')
    .replaceAll("href='https://siestafreeride.com/contact'", "href='https://siestafreeride.com/contact.html'");

  text = qualifySponsoredLinks(text);

  const title = titleUpdates.get(rel);
  if (title) text = text.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

  const description = descriptionUpdates.get(rel);
  if (description) {
    text = text.replace(
      /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?\s*>/i,
      `<meta name="description" content="${description}">`,
    );
  }

  if (text !== original) {
    writeFileSync(filePath, text, "utf8");
    updated += 1;
  }
}

console.log(`Normalized links, metadata and encoding in ${updated} file(s).`);
