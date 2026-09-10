import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { runInNewContext } from "node:vm";

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const blogDir = resolve(scriptsDir, "..", "blog");
const reportFilePattern = /^\d{4}-\d{2}-\d{2}-daily-blog\.html$/;
const reportsSource = readFileSync(join(blogDir, "daily-reports.js"), "utf8");
const reportsMatch = reportsSource.match(/const reports = (\{[\s\S]*?\r?\n\});\r?\n\r?\nconst reportDate/);

if (!reportsMatch) throw new Error("Could not read the report data from blog/daily-reports.js.");

const reports = runInNewContext(`(${reportsMatch[1]})`, Object.create(null));
const files = readdirSync(blogDir).filter((name) => reportFilePattern.test(name));
const descriptionPattern = /<meta\s+name=["']description["']\s+content=["']([^"']*)["']\s*\/?\s*>/i;
const titlePattern = /<title>([\s\S]*?)<\/title>/i;
const fallbackPattern = /<main\s+class=["']daily-fallback["']>[\s\S]*?<\/main>/i;

const descriptionCounts = new Map();
const titleCounts = new Map();
for (const fileName of files) {
  const html = readFileSync(join(blogDir, fileName), "utf8");
  const descriptionMatch = html.match(descriptionPattern);
  if (descriptionMatch) {
    const normalized = descriptionMatch[1].replace(/\s+/g, " ").trim();
    descriptionCounts.set(normalized, (descriptionCounts.get(normalized) ?? 0) + 1);
  }
  const titleMatch = html.match(titlePattern);
  if (titleMatch) {
    const normalized = titleMatch[1].replace(/\s+/g, " ").trim();
    titleCounts.set(normalized, (titleCounts.get(normalized) ?? 0) + 1);
  }
}

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const dateLabel = (date, month = "long") => new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
  month,
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const makeFallback = (date, report) => `<main class="daily-fallback">
  <article>
    <p class="eyebrow">Daily Siesta Key guide</p>
    <h1>${escapeHtml(report.headline)} ${escapeHtml(report.accent)}</h1>
    <p><time datetime="${date}">${escapeHtml(report.display)}</time></p>
    <p>${escapeHtml(report.intro)}</p>
    <section>
      <h2>Siesta Key weather and Gulf conditions</h2>
      <p>${escapeHtml(report.outlook)}</p>
      <p><strong>High:</strong> ${escapeHtml(report.high)} · <strong>Low:</strong> ${escapeHtml(report.low)} · <strong>Gulf water:</strong> ${escapeHtml(report.water)}</p>
      <p>${escapeHtml(report.source)}</p>
    </section>
    <section>
      <h2>${escapeHtml(report.adviceTitle)}</h2>
      <p>${escapeHtml(report.advice)}</p>
    </section>
    <section>
      <h2>${escapeHtml(report.rideTitle)}</h2>
      <p>${escapeHtml(report.ride)}</p>
    </section>
    <p>Check live radar, posted beach flags and lifeguard guidance before entering the water. Conditions can change quickly, especially during Florida's summer storm season.</p>
    <p><a href="../blog.html">Browse all Siesta Free Ride reports</a>, explore our <a href="../beaches.html">Siesta Key beach guide</a>, or <a href="../contact.html">request a free local ride</a>.</p>
  </article>
</main>`;

let updatedFiles = 0;
let updatedFallbacks = 0;
let updatedDescriptions = 0;
let updatedTitles = 0;

for (const fileName of files) {
  const filePath = join(blogDir, fileName);
  let html = readFileSync(filePath, "utf8");
  const originalHtml = html;
  const date = fileName.slice(0, 10);
  const report = reports[date];

  if (report && fallbackPattern.test(html)) {
    html = html.replace(fallbackPattern, makeFallback(date, report));
    updatedFallbacks += 1;
  } else if (report) {
    const bodyPattern = new RegExp(`<body\\s+data-report-date=["']${date}["']>(?=<script)`, "i");
    if (bodyPattern.test(html)) {
      html = html.replace(bodyPattern, (body) => `${body}${makeFallback(date, report)}`);
      updatedFallbacks += 1;
    }
  }

  const descriptionMatch = html.match(descriptionPattern);
  const currentDescription = descriptionMatch?.[1].replace(/\s+/g, " ").trim() ?? "";
  const descriptionNeedsRepair = !currentDescription
    || currentDescription.includes("�")
    || (descriptionCounts.get(currentDescription) ?? 0) > 1
    || currentDescription.length < 70
    || currentDescription.length > 160;

  if (descriptionNeedsRepair) {
    const description = `Siesta Key report for ${dateLabel(date)}: weather, Gulf water, beach planning tips and free local rides from Siesta Free Ride.`;
    const meta = `<meta name="description" content="${escapeHtml(description)}">`;
    if (descriptionMatch) {
      html = html.replace(descriptionPattern, meta);
    } else if (/<meta\s+name=["']viewport["'][^>]*>/i.test(html)) {
      html = html.replace(/(<meta\s+name=["']viewport["'][^>]*>)/i, `$1\n    ${meta}`);
    } else {
      html = html.replace(/<head>/i, `<head>\n    ${meta}`);
    }
    updatedDescriptions += 1;
  }

  const titleMatch = html.match(titlePattern);
  const currentTitle = titleMatch?.[1].replace(/\s+/g, " ").trim() ?? "";
  if (!currentTitle || currentTitle.includes("�") || currentTitle.length > 60 || (titleCounts.get(currentTitle) ?? 0) > 1) {
    const title = `${dateLabel(date, "short")} Siesta Key Report | Siesta Free Ride`;
    if (titleMatch) {
      html = html.replace(titlePattern, `<title>${escapeHtml(title)}</title>`);
    } else {
      html = html.replace(/<head>/i, `<head>\n    <title>${escapeHtml(title)}</title>`);
    }
    updatedTitles += 1;
  }

  html = html
    .replaceAll('href="../index.html"', 'href="../"')
    .replaceAll("href='../index.html'", "href='../'")
    .replaceAll('href="/index.html"', 'href="/"')
    .replaceAll("href='/index.html'", "href='/'");

  if (html !== originalHtml) {
    writeFileSync(filePath, html, "utf8");
    updatedFiles += 1;
  }
}

console.log(`Updated ${updatedFiles} daily report page(s): ${updatedFallbacks} crawlable fallbacks, ${updatedDescriptions} descriptions and ${updatedTitles} titles.`);
