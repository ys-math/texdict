# TeXDict — LaTeX dictionary VSCode extension

A learning project: a VSCode extension that lets mathematicians search a LaTeX command
by its concept name (e.g. "integral" → \int) and insert it at the cursor.

## Status
Built step-by-step in phases. Done: Phases 0–3 (v1 feature-complete). Next: optional
Phase 4 (package as .vsix). Side panel (Tree/Webview) considered and deferred.

## Architecture
- `package.json`     — manifest: command `texdict.search`, LaTeX-scoped keybinding
  (`cmd+alt+l`), and a `.tex` → `latex` language mapping.
- `src/extension.ts` — `activate()` registers the command, which opens an interactive
  `createQuickPick()` (all symbols shown, grouped) with a facet-grouped tag **filter
  button** and a **clear** button. Inserts at cursor, or copies to clipboard if no editor.
- `src/dictionary.ts`— curated `Entry[]` (`command/name/tags/symbol/keywords`) plus
  `FACETS` and `facetOf()`. Tags are faceted: Subjects / Symbol types / Character class.

## Conventions
- TypeScript. Keep dictionary DATA separate from command LOGIC.
- Command id prefix: `texdict.*`. Scope features to `.tex` (language id `latex`).
- Rows display LaTeX-format labels (`∫  \int`); name/keywords searchable via
  `matchOnDescription`, tags via `matchOnDetail`.

## Run / debug
- Press F5 → Extension Development Host. Reload (↻) after edits.
- Command: "TeXDict: Search LaTeX Dictionary".

## Phases
0. Setup & Hello World
1. First insert command
2. QuickPick search
3. Polish (keybinding, scope, fallback)
4. Package as .vsix
