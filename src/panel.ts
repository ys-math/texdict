import * as vscode from "vscode";
import { DICTIONARY, FACETS, Entry } from "./dictionary";
import { DESCRIPTIONS } from "./descriptions";
import { BUILTIN_TEMPLATES, Template } from "./templates";
import { TIPS } from "./tips";
import { PACKAGES } from "./packages";

// globalState key holding the user's saved templates (Template[]).
const TEMPLATE_STORE_KEY = "texdict.userTemplates";
// globalState key holding recently inserted symbol commands (string[], MRU first).
const RECENTS_KEY = "texdict.recentSymbols";
const RECENTS_MAX = 12;
// globalState key holding the user-chosen height (px) of the detail pane.
const DETAIL_HEIGHT_KEY = "texdict.detailHeight";
const DETAIL_HEIGHT_DEFAULT = 140;

// Only math symbols count as recents — document commands have their own views.
const DOC_TAG_SET = new Set(FACETS.find((f) => f.name === "Document")?.tags ?? []);
const SYMBOL_COMMANDS = new Set(
  DICTIONARY.filter((e) => !e.tags.some((t) => DOC_TAG_SET.has(t))).map((e) => e.command)
);

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

// A Webview view (Activity Bar) with three modes: a typeset KaTeX grid of math
// SYMBOLS, a labeled list of DOCUMENT commands, and TEMPLATES (built-in +
// user-saved blocks, with a rotating tip strip). Clicking an item posts a
// message back to the extension, which inserts it (snippet-aware).
export class TexDictViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "texdict.palette";

  private view?: vscode.WebviewView;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly storage: vscode.Memento,
    private readonly insert: (command: string) => void,
    private readonly insertBody: (body: string, useTokens: boolean) => void
  ) {}

  private userTemplates(): Template[] {
    return this.storage.get<Template[]>(TEMPLATE_STORE_KEY, []);
  }

  // Append a user template (from the webview form or the saveTemplate command)
  // and push the updated list to the open palette, if any.
  async addTemplate(t: Omit<Template, "id">): Promise<void> {
    const items = [...this.userTemplates(), { ...t, id: Date.now().toString(36) }];
    await this.storage.update(TEMPLATE_STORE_KEY, items);
    this.refreshTemplates();
  }

  private async removeTemplate(id: string): Promise<void> {
    const target = this.userTemplates().find((t) => t.id === id);
    if (!target) {
      return;
    }
    const choice = await vscode.window.showWarningMessage(
      `Delete template "${target.title}"?`,
      { modal: true },
      "Delete"
    );
    if (choice !== "Delete") {
      return;
    }
    await this.storage.update(
      TEMPLATE_STORE_KEY,
      this.userTemplates().filter((t) => t.id !== id)
    );
    this.refreshTemplates();
  }

  refreshTemplates(): void {
    this.view?.webview.postMessage({ type: "templates", items: this.userTemplates() });
  }

  // Public: the QuickPick reads this to build its "recent" section too.
  recents(): string[] {
    return this.storage.get<string[]>(RECENTS_KEY, []);
  }

  // Record an inserted symbol (called from the palette's insert message and
  // the QuickPick accept) and push the updated list to the open palette.
  async recordRecent(command: string): Promise<void> {
    if (!SYMBOL_COMMANDS.has(command)) {
      return;
    }
    const items = [command, ...this.recents().filter((c) => c !== command)].slice(0, RECENTS_MAX);
    await this.storage.update(RECENTS_KEY, items);
    this.view?.webview.postMessage({ type: "recents", items });
  }

  resolveWebviewView(view: vscode.WebviewView): void {
    this.view = view;
    view.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, "media")],
    };
    view.webview.html = this.getHtml(view.webview);

    view.webview.onDidReceiveMessage(async (msg) => {
      if (msg?.type === "insert" && typeof msg.command === "string") {
        this.insert(msg.command);
        await this.recordRecent(msg.command);
      } else if (msg?.type === "insertTemplate" && typeof msg.body === "string") {
        this.insertBody(msg.body, msg.tokens === true);
      } else if (
        msg?.type === "saveTemplate" &&
        typeof msg.title === "string" &&
        typeof msg.body === "string" &&
        msg.title.trim() &&
        msg.body.trim()
      ) {
        await this.addTemplate({
          title: msg.title.trim(),
          description: typeof msg.description === "string" ? msg.description.trim() : "",
          body: msg.body,
        });
      } else if (msg?.type === "deleteTemplate" && typeof msg.id === "string") {
        await this.removeTemplate(msg.id);
      } else if (msg?.type === "detailHeight" && typeof msg.value === "number") {
        await this.storage.update(DETAIL_HEIGHT_KEY, Math.round(msg.value));
      }
    });
  }

  private getHtml(webview: vscode.Webview): string {
    const nonce = getNonce();
    const mediaUri = (...p: string[]) =>
      webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, "media", ...p));
    const katexCss = mediaUri("katex", "katex.min.css");
    const katexJs = mediaUri("katex", "katex.min.js");

    const data = JSON.stringify(
      DICTIONARY.map((e) => ({
        c: e.command,
        n: e.name,
        s: e.symbol ?? "",
        t: e.tags,
        k: e.keywords ?? [],
        pv: previewLatex(e), // LaTeX to render as the preview (symbol grid)
        x: e.example ?? "", // example to render as a small sample (document rows)
        p: e.pkg ?? "", // required non-standard package
        d: DESCRIPTIONS[e.command]?.what ?? "", // help text (document detail pane)
        dx: DESCRIPTIONS[e.command]?.example ?? "", // worked example (document detail pane)
      }))
    );

    // Tags actually used, grouped by facet — drives the clickable chip filters.
    const used = new Set(DICTIONARY.flatMap((e) => e.tags));
    const facetsData = JSON.stringify(
      FACETS.map((f) => ({ name: f.name, tags: f.tags.filter((t) => used.has(t)) })).filter(
        (f) => f.tags.length > 0
      )
    );

    // Section order for the grouped Symbols grid: most-used first — character
    // classes (greek, hebrew, fonts), then symbol types, then subjects.
    const subjects = FACETS.find((f) => f.name === "Subjects")?.tags ?? [];
    const symbolTypes = (FACETS.find((f) => f.name === "Symbol types")?.tags ?? []).filter(
      (t) => t !== "font" // the 8 font entries merge into one "fonts" group
    );
    const groupOrderData = JSON.stringify(["greek", "hebrew", "fonts", ...symbolTypes, ...subjects]);

    const builtinsData = JSON.stringify(BUILTIN_TEMPLATES);
    // Initial snapshots only — later changes arrive via postMessage.
    const userTplData = JSON.stringify(this.userTemplates());
    const recentsData = JSON.stringify(this.recents());
    const tipsData = JSON.stringify(TIPS);
    const packagesData = JSON.stringify(PACKAGES);
    const detailHeightData = JSON.stringify(
      this.storage.get<number>(DETAIL_HEIGHT_KEY, DETAIL_HEIGHT_DEFAULT)
    );

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
    html, body { height: 100%; }
    body { margin: 0; padding: 6px; box-sizing: border-box; display: flex; flex-direction: column; height: 100vh;
      color: var(--vscode-foreground); font-family: var(--vscode-font-family); }
    #bar { flex: 0 0 auto; background: var(--vscode-sideBar-background); padding-bottom: 6px; }
    #views { flex: 1 1 auto; overflow-y: auto; }
    /* Fixed height (not max-height): the pane must never resize on hover, or
       the list above it jumps while scrolling. Long text scrolls inside.
       The height itself is user-adjustable by dragging #dd-resize. */
    #doc-detail { flex: 0 0 auto; display: none; height: 100px; padding-top: 4px; overflow-y: auto;
      box-sizing: border-box; }
    #dd-resize { flex: 0 0 auto; display: none; height: 5px; margin-top: 4px; cursor: ns-resize;
      border-top: 1px solid var(--vscode-panel-border, rgba(128,128,128,.35)); }
    #dd-resize:hover, #dd-resize.dragging { border-top: 2px solid var(--vscode-focusBorder, #007fd4); }
    .dd-title { font-weight: 600; font-size: 12px; }
    .dd-pkg { font-size: 9px; font-style: italic; opacity: .6; margin-left: 6px; }
    .dd-cmd { font-family: var(--vscode-editor-font-family, monospace); font-size: 11px;
      color: var(--vscode-textPreformat-foreground); }
    .dd-desc { font-size: 12px; opacity: .85; margin-top: 4px; line-height: 1.4; }
    .dd-ex-label { font-size: 9px; text-transform: uppercase; letter-spacing: .5px;
      opacity: .5; margin-top: 8px; }
    .dd-hint { font-size: 11px; opacity: .5; }
    .dd-pre { margin: 4px 0 0; font-family: var(--vscode-editor-font-family, monospace); font-size: 10px;
      line-height: 1.4; white-space: pre-wrap; color: var(--vscode-textPreformat-foreground); }
    #seg { display: flex; gap: 3px; margin-bottom: 6px; }
    .seg { flex: 1; padding: 4px 2px; cursor: pointer; font-family: inherit; font-size: 11px;
      border: 1px solid var(--vscode-contrastBorder, transparent); border-radius: 4px;
      background: var(--vscode-button-secondaryBackground, var(--vscode-badge-background));
      color: var(--vscode-button-secondaryForeground, var(--vscode-foreground)); }
    .seg.active { background: var(--vscode-button-background); color: var(--vscode-button-foreground); }
    #search { width: 100%; box-sizing: border-box; padding: 4px 6px;
      color: var(--vscode-input-foreground); background: var(--vscode-input-background);
      border: 1px solid var(--vscode-input-border, transparent); border-radius: 2px; }
    #count { font-size: 11px; opacity: .7; margin-top: 6px; }
    .chips { margin-top: 6px; max-height: 140px; overflow-y: auto; }
    .chip-group { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin-bottom: 3px; }
    .chip-label { font-size: 9px; text-transform: uppercase; letter-spacing: .04em; opacity: .5; width: 100%; margin-top: 4px; }
    .chip { font-size: 11px; padding: 1px 8px; border-radius: 10px; cursor: pointer; user-select: none;
      background: var(--vscode-badge-background); color: var(--vscode-badge-foreground); opacity: .85; }
    .chip:hover { opacity: 1; }
    .chip.active { background: var(--vscode-button-background); color: var(--vscode-button-foreground);
      opacity: 1; outline: 1px solid var(--vscode-focusBorder); }
    .chip.clear { background: transparent; color: var(--vscode-textLink-foreground); text-decoration: underline; }
    /* Symbols grid (one .grid per group section) */
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(54px, 1fr)); gap: 4px; margin-top: 2px; }
    .cell { display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 3px; padding: 6px 2px; min-height: 56px; overflow: hidden; cursor: pointer;
      border: 1px solid var(--vscode-panel-border, transparent); border-radius: 4px; }
    .cell:hover { background: var(--vscode-list-hoverBackground); }
    .render { display: flex; align-items: center; min-height: 1.5em; transform-origin: center center; }
    .render.fallback { font-size: 1.4em; }
    .katex-display { margin: 0 !important; }
    .cap { font-size: 9px; opacity: .6; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .pkg { font-size: 8px; font-style: italic; opacity: .5; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    /* Document list */
    #doc-list { margin-top: 6px; }
    .doc-cat { font-size: 9px; text-transform: uppercase; letter-spacing: .05em; opacity: .55; margin: 8px 0 2px; }
    .doc-row { display: flex; align-items: center; justify-content: space-between; gap: 8px;
      padding: 4px 6px; border-radius: 4px; cursor: pointer; }
    .doc-row:hover { background: var(--vscode-list-hoverBackground); }
    .doc-name { font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .doc-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; max-width: 62%; }
    .doc-sample { font-size: .9em; opacity: .9; }
    .doc-cmd { font-family: var(--vscode-editor-font-family, monospace); font-size: 11px;
      color: var(--vscode-textPreformat-foreground); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .doc-pkg { font-size: 9px; font-style: italic; opacity: .5; white-space: nowrap; }
    /* Templates */
    #tip-bar { display: flex; align-items: flex-start; gap: 6px; margin-top: 6px; padding: 6px 8px;
      font-size: 11px; line-height: 1.45; border: 1px solid var(--vscode-panel-border, rgba(128,128,128,.35));
      border-radius: 4px; background: var(--vscode-textBlockQuote-background, transparent); }
    #tip-text { flex: 1 1 auto; }
    #tip-next { flex: 0 0 auto; cursor: pointer; border: none; background: none; padding: 0 2px;
      color: var(--vscode-textLink-foreground); font-size: 13px; }
    .tpl-head { display: flex; align-items: center; justify-content: space-between; }
    .btn { padding: 2px 10px; cursor: pointer; font-family: inherit; font-size: 11px;
      border: 1px solid var(--vscode-contrastBorder, transparent); border-radius: 4px;
      background: var(--vscode-button-secondaryBackground, var(--vscode-badge-background));
      color: var(--vscode-button-secondaryForeground, var(--vscode-foreground)); }
    .btn.primary { background: var(--vscode-button-background); color: var(--vscode-button-foreground); }
    #tpl-form { flex-direction: column; gap: 4px; margin: 4px 0; display: none; }
    #tpl-form input, #tpl-form textarea { width: 100%; box-sizing: border-box; padding: 4px 6px;
      color: var(--vscode-input-foreground); background: var(--vscode-input-background);
      border: 1px solid var(--vscode-input-border, transparent); border-radius: 2px; font-family: inherit; font-size: 12px; }
    #tpl-form textarea { font-family: var(--vscode-editor-font-family, monospace); resize: vertical; }
    .tpl-actions { display: flex; gap: 6px; }
    .tpl-del { flex: 0 0 auto; opacity: .55; cursor: pointer; font-size: 11px; padding: 0 4px; }
    .tpl-del:hover { opacity: 1; color: var(--vscode-errorForeground, inherit); }
    .tpl-empty { font-size: 11px; opacity: .55; margin: 4px 0; line-height: 1.4; }
  </style>
</head>
<body>
  <div id="bar">
    <div id="seg">
      <button id="seg-sym" class="seg active">Symbols</button>
      <button id="seg-doc" class="seg">Document</button>
      <button id="seg-tpl" class="seg">Templates</button>
      <button id="seg-pkg" class="seg">Packages</button>
    </div>
    <input id="search" type="text" placeholder="Search symbols…" />
    <div id="count"></div>
  </div>

  <div id="views">
    <div id="symbols-view">
      <div id="sym-chips" class="chips"></div>
      <div id="sym-groups"></div>
    </div>

    <div id="document-view" style="display:none">
      <div id="doc-chips" class="chips"></div>
      <div id="doc-list"></div>
    </div>

    <div id="templates-view" style="display:none">
      <div id="tip-bar">
        <span>💡</span>
        <span id="tip-text"></span>
        <button id="tip-next" title="Next tip">→</button>
      </div>
      <div id="builtin-list"></div>
      <div class="tpl-head">
        <span class="doc-cat">My templates</span>
        <button id="tpl-new" class="btn">+ New</button>
      </div>
      <div id="tpl-form">
        <input id="tpl-title" type="text" placeholder="Title" />
        <input id="tpl-desc" type="text" placeholder="Description (optional)" />
        <textarea id="tpl-body" rows="5" placeholder="LaTeX body — empty {} become tab stops on insert"></textarea>
        <div class="tpl-actions">
          <button id="tpl-save" class="btn primary">Save</button>
          <button id="tpl-cancel" class="btn">Cancel</button>
        </div>
      </div>
      <div id="user-list"></div>
    </div>

    <div id="packages-view" style="display:none">
      <div id="pkg-list"></div>
    </div>
  </div>

  <div id="dd-resize" title="Drag to resize"></div>
  <div id="doc-detail"></div>

  <script nonce="${nonce}" src="${katexJs}"></script>
  <script nonce="${nonce}">
    const DICT = ${data};
    const FACETS = ${facetsData};
    const GROUP_ORDER = ${groupOrderData};
    const BUILTINS = ${builtinsData};
    let USER_TPLS = ${userTplData};
    let RECENTS = ${recentsData};
    const TIPS = ${tipsData};
    const PKGS = ${packagesData};
    const vscode = acquireVsCodeApi();
    const search = document.getElementById('search');
    const count = document.getElementById('count');
    const docDetail = document.getElementById('doc-detail');
    const ddResize = document.getElementById('dd-resize');

    // Apply the saved pane height, and let the user drag the divider to
    // adjust it (clamped); the final height is persisted via the extension.
    docDetail.style.height = ${detailHeightData} + 'px';
    let ddDragging = false, ddStartY = 0, ddStartH = 0;
    ddResize.addEventListener('mousedown', function (ev) {
      ddDragging = true;
      ddStartY = ev.clientY;
      ddStartH = docDetail.offsetHeight;
      ddResize.classList.add('dragging');
      ev.preventDefault();
    });
    window.addEventListener('mousemove', function (ev) {
      if (!ddDragging) { return; }
      const max = Math.round(window.innerHeight * 0.7);
      const h = Math.max(48, Math.min(max, ddStartH + (ddStartY - ev.clientY)));
      docDetail.style.height = h + 'px';
    });
    window.addEventListener('mouseup', function () {
      if (!ddDragging) { return; }
      ddDragging = false;
      ddResize.classList.remove('dragging');
      vscode.postMessage({ type: 'detailHeight', value: docDetail.offsetHeight });
    });

    // ── Partition: math symbols vs document commands ────────────────────
    const docFacet = FACETS.filter(function (f) { return f.name === 'Document'; });
    const DOC_TAGS = new Set(docFacet.length ? docFacet[0].tags : []);
    const isDoc = function (e) { return e.t.some(function (t) { return DOC_TAGS.has(t); }); };
    const symbolDict = DICT.filter(function (e) { return !isDoc(e); });
    const docDict = DICT.filter(isDoc);
    const symbolFacets = FACETS.filter(function (f) { return f.name !== 'Document'; });
    const DICT_BY_CMD = {};
    DICT.forEach(function (e) { DICT_BY_CMD[e.c] = e; });

    function titleCase(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

    // Fill the bottom detail pane with a document command's help.
    function showDetail(e) {
      docDetail.innerHTML = '';
      const title = document.createElement('div');
      title.className = 'dd-title';
      title.textContent = titleCase(e.n);
      if (e.p) {
        const pk = document.createElement('span');
        pk.className = 'dd-pkg';
        pk.textContent = 'needs ' + e.p;
        title.appendChild(pk);
      }
      const cmd = document.createElement('div');
      const code = document.createElement('code');
      code.className = 'dd-cmd';
      code.textContent = e.c;
      cmd.appendChild(code);
      const desc = document.createElement('div');
      desc.className = 'dd-desc';
      desc.textContent = e.d || 'No description yet.';
      docDetail.appendChild(title);
      docDetail.appendChild(cmd);
      docDetail.appendChild(desc);
      if (e.dx) {
        const exLabel = document.createElement('div');
        exLabel.className = 'dd-ex-label';
        exLabel.textContent = 'Example';
        const pre = document.createElement('pre');
        pre.className = 'dd-pre';
        pre.textContent = e.dx;
        docDetail.appendChild(exLabel);
        docDetail.appendChild(pre);
      }
    }
    // Same pane, for a template: title, description, and the body as code.
    function showTplDetail(t) {
      docDetail.innerHTML = '';
      const title = document.createElement('div');
      title.className = 'dd-title';
      title.textContent = t.title;
      const desc = document.createElement('div');
      desc.className = 'dd-desc';
      desc.textContent = t.description || 'No description.';
      const pre = document.createElement('pre');
      pre.className = 'dd-pre';
      pre.textContent = t.body;
      docDetail.appendChild(title);
      docDetail.appendChild(desc);
      docDetail.appendChild(pre);
    }
    function showDetailHint() {
      docDetail.innerHTML = '';
      const hint = document.createElement('div');
      hint.className = 'dd-hint';
      hint.textContent = 'Hover an item to see how to use it.';
      docDetail.appendChild(hint);
    }
    // Same pane, for a package: name, the usepackage line, description, tip.
    function showPkgDetail(p) {
      docDetail.innerHTML = '';
      const title = document.createElement('div');
      title.className = 'dd-title';
      title.textContent = p.name;
      const cmd = document.createElement('div');
      const code = document.createElement('code');
      code.className = 'dd-cmd';
      code.textContent = p.load;
      cmd.appendChild(code);
      const desc = document.createElement('div');
      desc.className = 'dd-desc';
      desc.textContent = p.description;
      docDetail.appendChild(title);
      docDetail.appendChild(cmd);
      docDetail.appendChild(desc);
      if (p.tip) {
        const tip = document.createElement('div');
        tip.className = 'dd-desc';
        tip.textContent = '💡 ' + p.tip;
        docDetail.appendChild(tip);
      }
    }

    // ── Reusable chip bar (OR filtering) ────────────────────────────────
    function buildChips(container, facets, activeTags, onChange) {
      const clearChip = document.createElement('span');
      clearChip.className = 'chip clear';
      clearChip.textContent = 'Clear';
      clearChip.style.display = 'none';
      clearChip.addEventListener('click', function () {
        activeTags.clear();
        const a = container.querySelectorAll('.chip.active');
        for (let i = 0; i < a.length; i++) { a[i].classList.remove('active'); }
        clearChip.style.display = 'none';
        onChange();
      });
      facets.forEach(function (facet) {
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
            onChange();
          });
          group.appendChild(chip);
        });
        container.appendChild(group);
      });
      container.appendChild(clearChip);
    }

    // ── Symbols view (typeset grid, grouped by primary tag) ─────────────
    const symGroupsEl = document.getElementById('sym-groups');
    const symActive = new Set();

    function makeCell(e) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.title = e.n + '  —  ' + e.c + (e.p ? '  (needs ' + e.p + ')' : '');
      cell.dataset.q = (e.n + ' ' + e.c + ' ' + e.t.join(' ') + ' ' + e.k.join(' ') + ' ' + e.p).toLowerCase();
      cell._tags = e.t;

      const r = document.createElement('div');
      r.className = 'render';
      try {
        katex.render(e.pv, r, { throwOnError: true, displayMode: true });
      } catch (err) {
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

    // Scale down previews that are wider than their cell so nothing gets
    // clipped (transform keeps the layout box, so row heights stay uniform).
    function fitCell(cell) {
      const r = cell.querySelector('.render');
      if (!r) { return; }
      r.style.transform = '';
      const avail = cell.clientWidth - 6;
      if (avail <= 0) { return; } // hidden view — measured again on setMode
      const w = r.scrollWidth;
      if (w > avail) { r.style.transform = 'scale(' + Math.max(0.45, avail / w) + ')'; }
    }
    function fitAllCells() {
      requestAnimationFrame(function () {
        const cells = document.querySelectorAll('#sym-groups .cell');
        for (let i = 0; i < cells.length; i++) { fitCell(cells[i]); }
      });
    }
    window.addEventListener('resize', fitAllCells);

    // RECENT section: appended first so it sits above all groups. Shown only
    // when there are recents AND no chip/search filter is active (it's a
    // shortcut row, not part of filtering).
    const recentHeader = document.createElement('div');
    recentHeader.className = 'doc-cat';
    recentHeader.textContent = 'RECENT';
    const recentGrid = document.createElement('div');
    recentGrid.className = 'grid';
    symGroupsEl.appendChild(recentHeader);
    symGroupsEl.appendChild(recentGrid);

    function updateRecentVisibility() {
      const vis = recentGrid.childElementCount > 0 && symActive.size === 0 && !search.value.trim();
      recentHeader.style.display = vis ? '' : 'none';
      recentGrid.style.display = vis ? '' : 'none';
    }
    function renderRecents() {
      recentGrid.innerHTML = '';
      RECENTS.forEach(function (c) {
        const e = DICT_BY_CMD[c];
        if (e) { recentGrid.appendChild(makeCell(e)); }
      });
      updateRecentVisibility();
      fitAllCells();
    }

    // Group cells under headers: font entries merge into 'fonts'; everything
    // else groups by its primary tag, in GROUP_ORDER (unknown groups appended).
    const groupOf = function (e) { return e.t.indexOf('font') !== -1 ? 'fonts' : e.t[0]; };
    const byGroup = {};
    symbolDict.forEach(function (e) {
      const g = groupOf(e);
      (byGroup[g] = byGroup[g] || []).push(e);
    });
    const groupOrder = GROUP_ORDER.slice();
    Object.keys(byGroup).forEach(function (g) {
      if (groupOrder.indexOf(g) === -1) { groupOrder.push(g); }
    });
    const symGroups = [];
    groupOrder.forEach(function (g) {
      const entries = byGroup[g];
      if (!entries) { return; }
      const header = document.createElement('div');
      header.className = 'doc-cat';
      header.textContent = g.toUpperCase();
      const gridEl = document.createElement('div');
      gridEl.className = 'grid';
      const cells = entries.map(makeCell);
      cells.forEach(function (c) { gridEl.appendChild(c); });
      symGroupsEl.appendChild(header);
      symGroupsEl.appendChild(gridEl);
      symGroups.push({ header: header, grid: gridEl, cells: cells });
    });
    fitAllCells();

    function applySymbolFilter() {
      updateRecentVisibility();
      const q = search.value.trim().toLowerCase();
      const hasTags = symActive.size > 0;
      let shown = 0;
      symGroups.forEach(function (g) {
        let groupShown = 0;
        g.cells.forEach(function (cell) {
          const tagMatch = !hasTags || cell._tags.some(function (t) { return symActive.has(t); });
          const textMatch = !q || cell.dataset.q.indexOf(q) !== -1;
          const vis = tagMatch && textMatch;
          cell.style.display = vis ? '' : 'none';
          if (vis) { groupShown++; shown++; }
        });
        g.header.style.display = groupShown ? '' : 'none';
        g.grid.style.display = groupShown ? '' : 'none';
      });
      if (mode === 'symbols') { count.textContent = shown + ' / ' + symbolDict.length + ' symbols'; }
    }
    buildChips(document.getElementById('sym-chips'), symbolFacets, symActive, applySymbolFilter);

    // ── Document view (labeled list grouped by category) ────────────────
    const docList = document.getElementById('doc-list');
    const docActive = new Set();
    const docTagOrder = docFacet.length ? docFacet[0].tags : [];
    const docGroups = [];

    docTagOrder.forEach(function (tag) {
      const entries = docDict.filter(function (e) { return e.t[0] === tag; });
      if (!entries.length) { return; }
      const header = document.createElement('div');
      header.className = 'doc-cat';
      header.textContent = tag.toUpperCase();
      docList.appendChild(header);
      const rows = [];
      entries.forEach(function (e) {
        const row = document.createElement('div');
        row.className = 'doc-row';
        row.title = e.n + '  —  ' + e.c + (e.p ? '  (needs ' + e.p + ')' : '');

        const left = document.createElement('span');
        left.className = 'doc-name';
        left.textContent = titleCase(e.n);

        const right = document.createElement('span');
        right.className = 'doc-right';
        if (e.x) {
          const samp = document.createElement('span');
          samp.className = 'doc-sample';
          try { katex.render(e.x, samp, { throwOnError: true }); } catch (err) { samp.textContent = ''; }
          right.appendChild(samp);
        }
        const codeEl = document.createElement('code');
        codeEl.className = 'doc-cmd';
        codeEl.textContent = e.c;
        right.appendChild(codeEl);
        if (e.p) {
          const pk = document.createElement('span');
          pk.className = 'doc-pkg';
          pk.textContent = '· ' + e.p;
          right.appendChild(pk);
        }

        row.appendChild(left);
        row.appendChild(right);
        row.addEventListener('click', function () {
          vscode.postMessage({ type: 'insert', command: e.c });
        });
        row.addEventListener('mouseenter', function () { showDetail(e); });
        docList.appendChild(row);
        rows.push({ el: row, tag: tag, q: (e.n + ' ' + e.c + ' ' + e.t.join(' ') + ' ' + e.k.join(' ') + ' ' + e.p).toLowerCase() });
      });
      docGroups.push({ header: header, rows: rows });
    });

    function applyDocFilter() {
      const q = search.value.trim().toLowerCase();
      const hasTags = docActive.size > 0;
      let shown = 0;
      docGroups.forEach(function (g) {
        let groupShown = 0;
        g.rows.forEach(function (r) {
          const tagMatch = !hasTags || docActive.has(r.tag);
          const textMatch = !q || r.q.indexOf(q) !== -1;
          const vis = tagMatch && textMatch;
          r.el.style.display = vis ? '' : 'none';
          if (vis) { groupShown++; shown++; }
        });
        g.header.style.display = groupShown ? '' : 'none';
      });
      if (mode === 'document') { count.textContent = shown + ' / ' + docDict.length + ' commands'; }
    }
    buildChips(document.getElementById('doc-chips'), docFacet, docActive, applyDocFilter);

    // ── Templates view (tip strip + built-in + user templates) ──────────
    const builtinList = document.getElementById('builtin-list');
    const userList = document.getElementById('user-list');
    const tipText = document.getElementById('tip-text');
    let builtinRows = [];
    let userRows = [];

    let tipIdx = Math.floor(Math.random() * TIPS.length);
    function showTip() { tipText.textContent = TIPS[tipIdx] || ''; }
    document.getElementById('tip-next').addEventListener('click', function () {
      tipIdx = (tipIdx + 1) % TIPS.length;
      showTip();
    });

    // builtin templates carry #1/#{1:default} tokens; user templates are plain text.
    function makeTplRow(t, builtin) {
      const row = document.createElement('div');
      row.className = 'doc-row';
      row.title = t.title + (t.description ? '  —  ' + t.description : '');

      const left = document.createElement('span');
      left.className = 'doc-name';
      left.textContent = t.title;
      row.appendChild(left);

      if (!builtin) {
        const del = document.createElement('span');
        del.className = 'tpl-del';
        del.textContent = '✕';
        del.title = 'Delete this template';
        del.addEventListener('click', function (ev) {
          ev.stopPropagation();
          vscode.postMessage({ type: 'deleteTemplate', id: t.id });
        });
        row.appendChild(del);
      }

      row.addEventListener('click', function () {
        // plain built-ins (e.g. the macro pack) contain literal LaTeX #1
        // parameters — insert them without token conversion.
        vscode.postMessage({ type: 'insertTemplate', body: t.body, tokens: builtin && !t.plain });
      });
      row.addEventListener('mouseenter', function () { showTplDetail(t); });
      return { el: row, q: (t.title + ' ' + t.description).toLowerCase() };
    }

    // Group built-ins under category headers (order = first appearance in
    // BUILTINS), mirroring the Packages tab. builtinGroups drives header
    // hide/show on filtering; builtinRows stays a flat list for the count.
    const builtinGroups = [];
    const builtinCats = [];
    BUILTINS.forEach(function (t) {
      const cat = t.category || 'Built-in';
      if (builtinCats.indexOf(cat) === -1) { builtinCats.push(cat); }
    });
    builtinCats.forEach(function (cat) {
      const header = document.createElement('div');
      header.className = 'doc-cat';
      header.textContent = cat.toUpperCase();
      builtinList.appendChild(header);
      const rows = [];
      BUILTINS.filter(function (t) { return (t.category || 'Built-in') === cat; }).forEach(function (t) {
        const r = makeTplRow(t, true);
        builtinList.appendChild(r.el);
        rows.push(r);
        builtinRows.push(r);
      });
      builtinGroups.push({ header: header, rows: rows });
    });

    function renderUserList() {
      userList.innerHTML = '';
      userRows = [];
      if (!USER_TPLS.length) {
        const empty = document.createElement('div');
        empty.className = 'tpl-empty';
        empty.textContent = "No saved templates yet — use + New, or select text in the editor and run 'TeXDict: Save Selection as Template'.";
        userList.appendChild(empty);
        return;
      }
      USER_TPLS.forEach(function (t) {
        const r = makeTplRow(t, false);
        userRows.push(r);
        userList.appendChild(r.el);
      });
    }
    renderUserList();

    function applyTplFilter() {
      const q = search.value.trim().toLowerCase();
      let shown = 0;
      builtinGroups.forEach(function (g) {
        let groupShown = 0;
        g.rows.forEach(function (r) {
          const vis = !q || r.q.indexOf(q) !== -1;
          r.el.style.display = vis ? '' : 'none';
          if (vis) { groupShown++; shown++; }
        });
        g.header.style.display = groupShown ? '' : 'none';
      });
      userRows.forEach(function (r) {
        const vis = !q || r.q.indexOf(q) !== -1;
        r.el.style.display = vis ? '' : 'none';
        if (vis) shown++;
      });
      const total = builtinRows.length + userRows.length;
      if (mode === 'templates') { count.textContent = shown + ' / ' + total + ' templates'; }
    }

    // The "+ New" form.
    const tplForm = document.getElementById('tpl-form');
    const tplTitle = document.getElementById('tpl-title');
    const tplDesc = document.getElementById('tpl-desc');
    const tplBody = document.getElementById('tpl-body');
    function clearForm() {
      tplTitle.value = ''; tplDesc.value = ''; tplBody.value = '';
      tplForm.style.display = 'none';
    }
    document.getElementById('tpl-new').addEventListener('click', function () {
      tplForm.style.display = tplForm.style.display === 'flex' ? 'none' : 'flex';
      if (tplForm.style.display === 'flex') { tplTitle.focus(); }
    });
    document.getElementById('tpl-cancel').addEventListener('click', clearForm);
    document.getElementById('tpl-save').addEventListener('click', function () {
      if (!tplTitle.value.trim()) { tplTitle.focus(); return; }
      if (!tplBody.value.trim()) { tplBody.focus(); return; }
      vscode.postMessage({
        type: 'saveTemplate',
        title: tplTitle.value,
        description: tplDesc.value,
        body: tplBody.value,
      });
      clearForm();
    });

    // ── Packages view (reference list grouped by category) ──────────────
    const pkgList = document.getElementById('pkg-list');
    const pkgGroups = [];
    const pkgCats = [];
    PKGS.forEach(function (p) { if (pkgCats.indexOf(p.category) === -1) { pkgCats.push(p.category); } });
    pkgCats.forEach(function (cat) {
      const header = document.createElement('div');
      header.className = 'doc-cat';
      header.textContent = cat.toUpperCase();
      pkgList.appendChild(header);
      const rows = [];
      PKGS.filter(function (p) { return p.category === cat; }).forEach(function (p) {
        const row = document.createElement('div');
        row.className = 'doc-row';
        row.title = p.name + ' — ' + p.description;
        const name = document.createElement('code');
        name.className = 'doc-cmd';
        name.textContent = p.name;
        row.appendChild(name);
        row.addEventListener('click', function () {
          vscode.postMessage({ type: 'insertTemplate', body: p.load, tokens: false });
        });
        row.addEventListener('mouseenter', function () { showPkgDetail(p); });
        pkgList.appendChild(row);
        rows.push({ el: row, q: (p.name + ' ' + p.category + ' ' + p.description).toLowerCase() });
      });
      pkgGroups.push({ header: header, rows: rows });
    });

    function applyPkgFilter() {
      const q = search.value.trim().toLowerCase();
      let shown = 0;
      pkgGroups.forEach(function (g) {
        let groupShown = 0;
        g.rows.forEach(function (r) {
          const vis = !q || r.q.indexOf(q) !== -1;
          r.el.style.display = vis ? '' : 'none';
          if (vis) { groupShown++; shown++; }
        });
        g.header.style.display = groupShown ? '' : 'none';
      });
      if (mode === 'packages') { count.textContent = shown + ' / ' + PKGS.length + ' packages'; }
    }

    // Saves/deletes/inserts round-trip through the extension (globalState),
    // which posts the authoritative lists back here.
    window.addEventListener('message', function (ev) {
      const msg = ev.data;
      if (msg && msg.type === 'templates') {
        USER_TPLS = msg.items || [];
        renderUserList();
        applyTplFilter();
      } else if (msg && msg.type === 'recents') {
        RECENTS = msg.items || [];
        renderRecents();
      }
    });

    // ── Mode toggle ─────────────────────────────────────────────────────
    let mode = 'symbols';
    const segs = {
      symbols: document.getElementById('seg-sym'),
      document: document.getElementById('seg-doc'),
      templates: document.getElementById('seg-tpl'),
      packages: document.getElementById('seg-pkg'),
    };
    const views = {
      symbols: document.getElementById('symbols-view'),
      document: document.getElementById('document-view'),
      templates: document.getElementById('templates-view'),
      packages: document.getElementById('packages-view'),
    };
    const placeholders = {
      symbols: 'Search symbols…',
      document: 'Search document commands…',
      templates: 'Search templates…',
      packages: 'Search packages…',
    };
    const filters = {
      symbols: applySymbolFilter,
      document: applyDocFilter,
      templates: applyTplFilter,
      packages: applyPkgFilter,
    };

    function setMode(m) {
      mode = m;
      Object.keys(segs).forEach(function (k) {
        segs[k].classList.toggle('active', k === m);
        views[k].style.display = k === m ? '' : 'none';
      });
      docDetail.style.display = m === 'symbols' ? 'none' : 'block';
      ddResize.style.display = m === 'symbols' ? 'none' : 'block';
      search.placeholder = placeholders[m];
      filters[m]();
      // Cells added while this view was hidden measured 0 wide — refit now.
      if (m === 'symbols') { fitAllCells(); }
    }
    Object.keys(segs).forEach(function (k) {
      segs[k].addEventListener('click', function () { setMode(k); });
    });
    search.addEventListener('input', function () { filters[mode](); });

    showDetailHint();
    showTip();
    renderRecents();
    applySymbolFilter();
    applyDocFilter();
    applyTplFilter();
    applyPkgFilter();
    setMode('symbols');
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
