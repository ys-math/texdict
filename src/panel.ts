import * as vscode from "vscode";
import { DICTIONARY, FACETS, Entry } from "./dictionary";

// What to render as the palette preview: an explicit `example`, or the command
// with empty `{}` slots filled by sample letters a, b, c… so structural commands
// render as common examples (\frac{}{} → \frac{a}{b}) instead of blank.
function previewLatex(e: Entry): string {
  if (e.example) {
    return e.example;
  }
  let i = 0;
  const samples = "abcdefgh";
  return e.command.replace(/\{\}/g, () => `{${samples[i++] ?? "x"}}`);
}

// A Webview view (lives in the Activity Bar container declared in package.json)
// that renders every symbol TYPESET with KaTeX in a clickable grid. Clicking a
// symbol posts a message back to the extension, which inserts the command.
export class TexDictViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "texdict.palette";

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly insert: (command: string) => void
  ) {}

  resolveWebviewView(view: vscode.WebviewView): void {
    view.webview.options = {
      enableScripts: true,
      // The webview may only load resources from these folders.
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, "media")],
    };
    view.webview.html = this.getHtml(view.webview);

    // Receive click events from the webview and perform the insert.
    view.webview.onDidReceiveMessage((msg) => {
      if (msg?.type === "insert" && typeof msg.command === "string") {
        this.insert(msg.command);
      }
    });
  }

  private getHtml(webview: vscode.Webview): string {
    const nonce = getNonce();
    const mediaUri = (...p: string[]) =>
      webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, "media", ...p));
    const katexCss = mediaUri("katex", "katex.min.css");
    const katexJs = mediaUri("katex", "katex.min.js");

    // Compact payload: c=command, n=name, s=symbol, t=tags, k=keywords.
    const data = JSON.stringify(
      DICTIONARY.map((e) => ({
        c: e.command,
        n: e.name,
        s: e.symbol ?? "",
        t: e.tags,
        k: e.keywords ?? [],
        pv: previewLatex(e), // LaTeX to render as the preview
        p: e.pkg ?? "", // required non-standard package
      }))
    );

    // Tags actually used, grouped by facet — drives the clickable chip filters.
    const used = new Set(DICTIONARY.flatMap((e) => e.tags));
    const facetsData = JSON.stringify(
      FACETS.map((f) => ({ name: f.name, tags: f.tags.filter((t) => used.has(t)) })).filter(
        (f) => f.tags.length > 0
      )
    );

    // Content Security Policy: nothing loads unless explicitly allowed.
    const csp = [
      `default-src 'none'`,
      `style-src ${webview.cspSource} 'unsafe-inline'`,
      `font-src ${webview.cspSource}`,
      `script-src 'nonce-${nonce}'`,
    ].join("; ");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="${katexCss}" />
  <style>
    body { padding: 6px; color: var(--vscode-foreground); font-family: var(--vscode-font-family); }
    #bar { position: sticky; top: 0; z-index: 1; background: var(--vscode-sideBar-background); padding-bottom: 6px; }
    #search { width: 100%; box-sizing: border-box; padding: 4px 6px;
      color: var(--vscode-input-foreground); background: var(--vscode-input-background);
      border: 1px solid var(--vscode-input-border, transparent); border-radius: 2px; }
    #count { font-size: 11px; opacity: .7; margin-top: 6px; }
    #chips { margin-top: 6px; max-height: 140px; overflow-y: auto; }
    .chip-group { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin-bottom: 3px; }
    .chip-label { font-size: 9px; text-transform: uppercase; letter-spacing: .04em; opacity: .5; width: 100%; margin-top: 4px; }
    .chip { font-size: 11px; padding: 1px 8px; border-radius: 10px; cursor: pointer; user-select: none;
      background: var(--vscode-badge-background); color: var(--vscode-badge-foreground); opacity: .85; }
    .chip:hover { opacity: 1; }
    .chip.active { background: var(--vscode-button-background); color: var(--vscode-button-foreground);
      opacity: 1; outline: 1px solid var(--vscode-focusBorder); }
    .chip.clear { background: transparent; color: var(--vscode-textLink-foreground); text-decoration: underline; }
    #grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(54px, 1fr)); gap: 4px; margin-top: 6px; }
    .cell { display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 3px; padding: 6px 2px; min-height: 56px; overflow: hidden; cursor: pointer;
      border: 1px solid var(--vscode-panel-border, transparent); border-radius: 4px; }
    .cell:hover { background: var(--vscode-list-hoverBackground); }
    .render { display: flex; align-items: center; min-height: 1.5em; }
    .render.fallback { font-size: 1.4em; }
    .katex-display { margin: 0 !important; }
    .cap { font-size: 9px; opacity: .6; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .pkg { font-size: 8px; font-style: italic; opacity: .5; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  </style>
</head>
<body>
  <div id="bar">
    <input id="search" type="text" placeholder="Search symbols…" />
    <div id="chips"></div>
    <div id="count"></div>
  </div>
  <div id="grid"></div>

  <script nonce="${nonce}" src="${katexJs}"></script>
  <script nonce="${nonce}">
    const DICT = ${data};
    const FACETS = ${facetsData};
    const vscode = acquireVsCodeApi();
    const grid = document.getElementById('grid');
    const search = document.getElementById('search');
    const count = document.getElementById('count');
    const chipBar = document.getElementById('chips');
    const activeTags = new Set();

    function makeCell(e) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.title = e.n + '  —  ' + e.c + (e.p ? '  (needs ' + e.p + ')' : '');
      cell.dataset.q = (e.n + ' ' + e.c + ' ' + e.t.join(' ') + ' ' + e.k.join(' ') + ' ' + e.p).toLowerCase();
      cell._tags = e.t; // for OR tag-filtering

      const r = document.createElement('div');
      r.className = 'render';
      try {
        // Render the preview (example, or command with □ placeholders).
        katex.render(e.pv, r, { throwOnError: true, displayMode: true });
      } catch (err) {
        // KaTeX doesn't know this command (or it needs a package) — show the glyph.
        r.textContent = e.s || e.c;
        r.className = 'render fallback';
      }

      const cap = document.createElement('div');
      cap.className = 'cap';
      cap.textContent = e.c;
      cell.appendChild(r);
      cell.appendChild(cap);

      if (e.p) {
        const pk = document.createElement('div');
        pk.className = 'pkg';
        pk.textContent = e.p;
        cell.appendChild(pk);
      }

      cell.addEventListener('click', function () {
        vscode.postMessage({ type: 'insert', command: e.c });
      });
      return cell;
    }

    const cells = DICT.map(makeCell);
    cells.forEach(function (c) { grid.appendChild(c); });

    // A cell shows if it matches ANY active chip (OR) AND the search text.
    function applyFilter() {
      const q = search.value.trim().toLowerCase();
      const hasTags = activeTags.size > 0;
      let shown = 0;
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const tagMatch = !hasTags || cell._tags.some(function (t) { return activeTags.has(t); });
        const textMatch = !q || cell.dataset.q.indexOf(q) !== -1;
        const vis = tagMatch && textMatch;
        cell.style.display = vis ? '' : 'none';
        if (vis) shown++;
      }
      count.textContent = shown + ' / ' + DICT.length + ' symbols';
    }

    // Clear chip — only visible when at least one tag is active.
    const clearChip = document.createElement('span');
    clearChip.className = 'chip clear';
    clearChip.textContent = 'Clear';
    clearChip.style.display = 'none';
    clearChip.addEventListener('click', function () {
      activeTags.clear();
      const actives = chipBar.querySelectorAll('.chip.active');
      for (let i = 0; i < actives.length; i++) { actives[i].classList.remove('active'); }
      clearChip.style.display = 'none';
      applyFilter();
    });

    // Build the chips, grouped by facet.
    FACETS.forEach(function (facet) {
      const group = document.createElement('div');
      group.className = 'chip-group';
      const label = document.createElement('span');
      label.className = 'chip-label';
      label.textContent = facet.name;
      group.appendChild(label);
      facet.tags.forEach(function (tag) {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = tag;
        chip.addEventListener('click', function () {
          if (activeTags.has(tag)) { activeTags.delete(tag); chip.classList.remove('active'); }
          else { activeTags.add(tag); chip.classList.add('active'); }
          clearChip.style.display = activeTags.size ? '' : 'none';
          applyFilter();
        });
        group.appendChild(chip);
      });
      chipBar.appendChild(group);
    });
    chipBar.appendChild(clearChip);

    search.addEventListener('input', applyFilter);
    applyFilter();
  </script>
</body>
</html>`;
  }
}

function getNonce(): string {
  let text = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}
