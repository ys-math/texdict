# TeXDict

A LaTeX dictionary for mathematicians. Search a symbol by its concept name
(e.g. *"integral"*, *"for all"*, *"reals"*) and insert the LaTeX command at your cursor —
**277 symbols** across pure-math domains, by keyboard or click.

## Features

- **Search by meaning** — type `integral` → insert `\int`, `tensor product` → `\otimes`,
  `reals` → `\mathbb{R}`. You don't need to remember the command, just the concept.
- **Typeset symbol palette** — a side panel (Activity Bar) renders every symbol **typeset
  with KaTeX** in a clickable grid; click one to insert it. Filter with one click using
  **tag chips** grouped by facet (OR: click `greek` + `fraktur` to see both), plus a search box.
- **QuickPick search + tag filter** — the `TeXDict: Search` command lists all symbols,
  grouped by topic; the funnel button filters by tag (AND across checked tags).
- **Faceted tags** — **Subjects** (algebra, analysis, calculus, …, topology),
  **Symbol types** (accent, arrow, font, operation, relation, …), and **Character class**
  (blackboard, bold, calligraphic, fraktur, greek, hebrew, monospace, roman, sans-serif, script).
- **Compact font entries** — one entry per math font (`\mathbb{}`, `\mathfrak{}`, …) with an
  `ABC` preview, instead of 26 letters each. Inserting drops your cursor inside the braces.
- **Smart insertion** — empty `{}` become snippet tab stops (`\frac{}{}` → cursor in the
  first slot).
- **Package hints** — symbols needing a non-standard package show it (e.g. *needs `mathrsfs`*).
- **Clipboard fallback** — with no editor open, the chosen command is copied to the clipboard.

## Install

Download the latest `texdict-*.vsix` from the
[**Releases**](https://github.com/ys-math/texdict/releases) page, then either:

```bash
code --install-extension texdict-0.0.4.vsix
```

or in VSCode: **Extensions panel → `…` menu → Install from VSIX…** → pick the file →
reload the window.

## Usage

- **Palette:** click the **Σ TeXDict** icon in the Activity Bar → browse/filter the typeset
  grid → click a symbol to insert it.
- **Command Palette:** **"TeXDict: Search LaTeX Dictionary"** (available anywhere).
- **Keyboard:** **`Ctrl+Alt+L`** (`Cmd+Alt+L` on macOS) — active in `.tex` / LaTeX files.

> Note: a few symbols require LaTeX packages to render in your document (e.g. `\mathbb`,
> `\mathfrak` → `amssymb`; `\coloneqq` → `mathtools`; `\llbracket` → `stmaryrd`).

## Extending the dictionary

Symbols live in `src/dictionary.ts` as a list of
`{ command, name, tags, symbol?, example?, pkg?, keywords? }` entries. Add a row and
recompile — search, the palette, and the tag filter re-derive themselves automatically.
The only rule: **every tag you use must be listed in `FACETS`** (top of the same file), or
it won't appear in the filter. Use `example` to control the palette preview and `pkg` to
flag a required non-standard LaTeX package.

## Development

```bash
npm install
npm run compile     # or: npm run watch
```

Press **F5** in VSCode to launch an Extension Development Host with TeXDict loaded.

### Releasing

Releases are built and published automatically by GitHub Actions on a version tag:

```bash
npm version patch        # bump version, commit, create the v-tag
git push --follow-tags   # the tag push triggers CI → builds + publishes the .vsix
```

## License

MIT
