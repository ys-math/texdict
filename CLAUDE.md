# TeXDict — LaTeX dictionary VSCode extension

A learning project: a VSCode extension that lets mathematicians search a LaTeX command
by its concept name (e.g. "integral" → `\int`) and insert it at the cursor.

## Status

Phases 0–3 complete (v0.0.1, feature-complete). Phase 4 (package as `.vsix`) is
optional and not yet started. Side panel (Tree/Webview) was considered and deferred.

## File structure

```
texdict/
├── src/
│   ├── extension.ts      — activation, QuickPick UI, insert/clipboard logic
│   └── dictionary.ts     — Entry[], FACETS, facetOf() — pure data, no VS Code imports
├── out/                  — compiled JS (gitignored, built by tsc)
├── .vscode/
│   ├── launch.json       — F5 debug config (Extension Development Host)
│   └── tasks.json        — "npm: compile" as default build task
├── package.json          — extension manifest
├── tsconfig.json         — strict, ES2022, Node16 modules, outDir=out
└── .vscodeignore         — excludes src/, .vscode/, *.ts, *.map from .vsix
```

No test files exist. There is no linter config (no `.eslintrc`).

## Architecture

### `src/dictionary.ts` — data layer

Three exports:

```typescript
interface Entry {
  command:   string;    // inserted text, e.g. "\\int"
  name:      string;    // human label, e.g. "integral"
  tags:      string[];  // many-to-many; tags[0] is the PRIMARY grouping tag
  symbol?:   string;    // unicode preview, e.g. "∫"
  keywords?: string[];  // extra search terms
}

const FACETS: { name: string; tags: string[] }[]
// Three facets: "Subjects" | "Symbol types" | "Character class"

function facetOf(tag: string): string | undefined
```

`DICTIONARY` has 57 entries across 7 comment-delimited sections:
Calculus & Analysis, Set Theory & Logic, Group Theory & Algebra, Number Sets
(blackboard bold), Relations & Arrows, Greek Letters, Structures.

**To add symbols**: only edit `dictionary.ts`. The UI re-derives everything from `DICTIONARY`.

### `src/extension.ts` — command layer

Key private types:

```typescript
interface SymbolItem extends vscode.QuickPickItem { insertText: string; }
interface TagItem    extends vscode.QuickPickItem { tag?: string; }
```

Key functions:

| Function | What it does |
|---|---|
| `toSymbolItem(e)` | Converts `Entry` → `SymbolItem`. label = `${symbol}  ${command}`, description = `${name}   ${keywords}`, detail = comma-joined tags. |
| `buildGroupedItems(entries)` | Groups entries by `tags[0]`; inserts `QuickPickItemKind.Separator` rows between groups. |
| `pickFilterTags(active)` | Opens a multi-select sub-picker grouped by FACET. Returns chosen tags, or `undefined` on Esc. |
| `activate(context)` | Registers `texdict.search`. Creates a persistent `createQuickPick()` with filter + clear toolbar buttons. |

**Filter logic**: AND-semantics — a symbol must match ALL checked tags.

**Toolbar buttons**:
- Filter button (`filter` ThemeIcon) — always shown; opens `pickFilterTags`.
- Clear button (`clear-all` ThemeIcon) — shown only when `activeTags.length > 0`.

**Picker lifecycle**: A `pickingTags` flag prevents `onDidHide` from disposing the main
picker while the filter sub-picker is open. After the sub-picker resolves, `qp.show()`
brings the main picker back.

**Insert / clipboard fallback**: On `onDidAccept`, if `vscode.window.activeTextEditor` is
defined, inserts at `editor.selection.active`. Otherwise writes to clipboard and shows an
information message. The editor reference is captured at command invocation time (not at
accept time), which is fine because the sub-picker usage is the only case where focus can
shift.

## `package.json` highlights

```jsonc
"main":       "./out/extension.js",
"engines":    { "vscode": "^1.90.0" },
"publisher":  "yutosasaki",
"version":    "0.0.1"
```

Contributions:
- **Command**: `texdict.search` — "TeXDict: Search LaTeX Dictionary"
- **Keybinding**: `ctrl+alt+l` / `cmd+alt+l` (mac), active `when: editorLangId == latex`
- **Language mapping**: `.tex` → language id `latex` (so the keybinding fires in `.tex` files)

Scripts: `compile` (`tsc -p ./`) and `watch` (`tsc -watch -p ./`). No test script.

## Build & run

```bash
npm run compile      # one-shot build → out/
npm run watch        # incremental watch build
```

Press **F5** in VS Code to launch the Extension Development Host (uses `.vscode/launch.json`,
which runs the `compile` task first). After editing source, hit **↻ Reload** in the host.

Invoke the command via: **Cmd/Ctrl+Shift+P → "TeXDict: Search LaTeX Dictionary"** or the
`cmd+alt+l` / `ctrl+alt+l` keybinding inside a `.tex` file.

## Conventions

- **Data / logic separation**: dictionary data lives exclusively in `dictionary.ts`. All
  VS Code API usage lives in `extension.ts`. Never import `vscode` in `dictionary.ts`.
- **Command id prefix**: `texdict.*`.
- **Language scope**: features are scoped to language id `latex` (mapped from `.tex`).
- **QuickPick display format**: `${symbol}  ${command}` in `label`; name + keywords in
  `description` (searchable via `matchOnDescription`); tags in `detail` (searchable via
  `matchOnDetail`).
- **Tag ordering in entries**: `tags[0]` is the primary grouping tag shown as a separator
  header. Put the most specific/natural subject tag first.
- **TypeScript**: strict mode, ES2022, no `any`, no eslint (not configured).
- **No comments on obvious code** — the existing inline comments document non-obvious
  invariants (e.g. the `pickingTags` flag, the clipboard fallback rationale).

## Phases

| Phase | Description | Status |
|---|---|---|
| 0 | Setup & Hello World | Done |
| 1 | First insert command | Done |
| 2 | QuickPick search | Done |
| 3 | Polish (keybinding, scope, fallback) | Done |
| 4 | Package as `.vsix` | Not started (optional) |
