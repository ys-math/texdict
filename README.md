# TeXDict

A LaTeX dictionary for mathematicians. Search a symbol by its concept name
(e.g. *"integral"*, *"for all"*, *"reals"*) and insert the LaTeX command at your cursor.

## Features

- **Search by meaning** — type `integral` → insert `\int`, `tensor product` → `\otimes`.
- **Browse all symbols** — the picker shows every symbol by default, grouped by topic.
- **Filter by tag** — click the filter (funnel) button to narrow by faceted tags:
  **Subjects** (set theory, calculus, group theory…), **Symbol types** (operation,
  relation, arrow…), and **Character class** (Greek, blackboard-bold). Filtering is
  AND across the tags you check.
- **LaTeX-format display** — each row shows the glyph and its command, e.g. `∫  \int`.
- **Clipboard fallback** — with no editor open, the chosen command is copied to the clipboard.

## Usage

- Command Palette: **"TeXDict: Search LaTeX Dictionary"** (available anywhere).
- Keyboard: **`Ctrl+Alt+L`** (`Cmd+Alt+L` on macOS) — in `.tex` / LaTeX files.

## Extending the dictionary

Symbols live in `src/dictionary.ts` as a simple list of
`{ command, name, tags, symbol, keywords }` entries. Add a row and recompile —
no other code changes needed.

## Development

```bash
npm install
npm run compile     # or: npm run watch
```

Press **F5** in VSCode to launch an Extension Development Host with TeXDict loaded.

## License

MIT
