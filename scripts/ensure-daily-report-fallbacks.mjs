import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const blogDir = resolve(scriptsDir, "..", "blog");
const reportFilePattern = /^\d{4}-\d{2}-\d{2}-daily-blog\.html$/;

let updated = 0;

for (const fileName of readdirSync(blogDir).filter((name) => reportFilePattern.test(name))) {
  const filePath = join(blogDir, fileName);
  const html = readFileSync(filePath, "utf8");

  if (/<h1(?:\s|>)/i.test(html)) continue;

  const bodyMatch = html.match(/<body\s+data-report-date="(\d{4}-\d{2}-\d{2})">(?=<script)/i);
  if (!bodyMatch) continue;

  const reportDate = new Date(`${bodyMatch[1]}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const fallback = `${bodyMatch[0]}<main class="daily-fallback"><h1>Siesta Key Daily Report &mdash; ${reportDate}</h1><p>Daily Siesta Key weather, Gulf water, beach planning and free local ride information.</p><p><a href="../blog.html">Browse all Siesta Free Ride reports</a> or <a href="../contact.html">request a ride</a>.</p></main>`;
  const updatedHtml = html.replace(bodyMatch[0], fallback);

  writeFileSync(filePath, updatedHtml, "utf8");
  updated += 1;
}

console.log(`Added crawlable HTML fallbacks to ${updated} daily report page(s).`);
