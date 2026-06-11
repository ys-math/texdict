// Copies the KaTeX runtime (JS + CSS + woff2 fonts) from node_modules into
// media/katex/ so it can be bundled into the .vsix and loaded by the webview.
// (node_modules itself is excluded from the package via .vscodeignore.)
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "node_modules", "katex", "dist");
const dest = path.join(__dirname, "..", "media", "katex");

if (!fs.existsSync(src)) {
  console.error("katex not found in node_modules — run `npm install` first.");
  process.exit(1);
}

fs.mkdirSync(path.join(dest, "fonts"), { recursive: true });
for (const file of ["katex.min.css", "katex.min.js"]) {
  fs.copyFileSync(path.join(src, file), path.join(dest, file));
}

// Only woff2 fonts — modern Chromium (the webview) uses them; skips .woff/.ttf
// referenced by the CSS to keep the package small.
let fonts = 0;
for (const file of fs.readdirSync(path.join(src, "fonts"))) {
  if (file.endsWith(".woff2")) {
    fs.copyFileSync(path.join(src, "fonts", file), path.join(dest, "fonts", file));
    fonts++;
  }
}

console.log(`copied katex.min.css, katex.min.js, and ${fonts} woff2 fonts -> media/katex/`);
