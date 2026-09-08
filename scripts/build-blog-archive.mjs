import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(scriptsDir, "..");
const blogDir = resolve(siteRoot, "blog");
const blogIndex = resolve(siteRoot, "blog.html");
const startMarker = "<!-- report-archive:start -->";
const endMarker = "<!-- report-archive:end -->";
const filePattern = /^(\d{4})-(\d{2})-(\d{2})-daily-blog\.html$/;

const reports = readdirSync(blogDir)
  .map((fileName) => ({ fileName, match: fileName.match(filePattern) }))
  .filter(({ match }) => match)
  .map(({ fileName, match }) => ({
    fileName,
    date: `${match[1]}-${match[2]}-${match[3]}`,
    month: `${match[1]}-${match[2]}`,
  }))
  .sort((a, b) => b.date.localeCompare(a.date));

const monthGroups = new Map();
for (const report of reports) {
  if (!monthGroups.has(report.month)) monthGroups.set(report.month, []);
  monthGroups.get(report.month).push(report);
}

const archiveHtml = [...monthGroups.entries()].map(([month, monthReports], index) => {
  const monthLabel = new Date(`${month}-01T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const links = monthReports.map((report) => {
    const dateLabel = new Date(`${report.date}T12:00:00Z`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
    return `              <a href="blog/${report.fileName}"><time datetime="${report.date}">${dateLabel}</time><span>Siesta Key daily report</span></a>`;
  }).join("\n");

  return `          <details id="archive-${month}"${index === 0 ? " open" : ""}>\n            <summary><span>${monthLabel}</span><strong>${monthReports.length} reports</strong></summary>\n            <div class="report-archive-links">\n${links}\n            </div>\n          </details>`;
}).join("\n");

const html = readFileSync(blogIndex, "utf8");
const markerPattern = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`);
if (!markerPattern.test(html)) {
  throw new Error("Archive markers are missing from blog.html");
}

const updatedHtml = html.replace(markerPattern, `${startMarker}\n${archiveHtml}\n          ${endMarker}`);
writeFileSync(blogIndex, updatedHtml, "utf8");
console.log(`Built crawlable archive links for ${reports.length} daily reports.`);
