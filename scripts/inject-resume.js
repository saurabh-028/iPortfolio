// Rebuilds the Experience timeline in index.html from data/resume.json.
// Only the block between the RESUME:EXPERIENCE markers is touched.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "data", "resume.json"), "utf8"));
const file = path.join(root, "index.html");
let html = fs.readFileSync(file, "utf8");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// Resume text arrives with **bold** already stripped, so metrics are re-highlighted below.
const metric = /(\~?\d+(?:\.\d+)?\+?%|\d+\+ (?:prompt and guardrail configurations|engineers)|\d+-month)/g;
const bullet = (t) => esc(t).replace(metric, "<strong>$1</strong>");

// Split "A, B (x, y), C" on top-level commas only, drop parentheticals.
function tags(tech) {
  const out = []; let depth = 0, cur = "";
  for (const ch of tech) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) { out.push(cur); cur = ""; } else cur += ch;
  }
  out.push(cur);
  return out.map((t) => t.replace(/\(.*?\)/g, "").trim()).filter(Boolean).slice(0, 10);
}

const card = (w) => {
  const [from, to] = w.dates.split(" – ");
  const company = w.org.replace(/, /, " · ");
  return `          <div class="exp-card">
            <div class="exp-years">${esc(from)}<br>— ${esc(to)}</div>
            <div class="exp-content">
              <div class="exp-header">
                <div>
                  <h3 class="exp-role">${esc(w.title)}</h3>
                  <p class="exp-company">${esc(company)}</p>
                </div>
              </div>
              <ul class="exp-bullets">
${w.bullets.map((b) => `                <li>${bullet(b)}</li>`).join("\n")}
              </ul>
              <div class="exp-tags">
${tags(w.tech || "").map((t) => `                <span class="tag">${esc(t)}</span>`).join("\n")}
              </div>
            </div>
          </div>`;
};

const START = "<!-- RESUME:EXPERIENCE:START (generated from data/resume.json, do not edit by hand) -->";
const END = "<!-- RESUME:EXPERIENCE:END -->";
const re = /<!-- RESUME:EXPERIENCE:START[\s\S]*?<!-- RESUME:EXPERIENCE:END -->/;
if (!re.test(html)) { console.error("Markers not found in index.html"); process.exit(1); }
const block = `${START}\n${data.work.map(card).join("\n\n")}\n          ${END}`;
fs.writeFileSync(file, html.replace(re, () => block));
console.log(`Injected ${data.work.length} experience cards.`);
