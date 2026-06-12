# TeXDict

A LaTeX dictionary for mathematicians. Search a symbol by its concept name
(e.g. *"integral"*, *"for all"*, *"reals"*) and insert the LaTeX command at your cursor —
**277 symbols + 91 document commands** plus ready-made templates, by keyboard or click.

## Features

- **Search by meaning** — type `integral` → insert `\int`, `tensor product` → `\otimes`,
  `reals` → `\mathbb{R}`. You don't need to remember the command, just the concept.
- **Three-mode palette** — a side panel (Activity Bar) with a `Symbols | Document | Templates`
  toggle:
  - **Symbols** — every symbol **typeset with KaTeX** in a clickable grid; filter with one
    click using **tag chips** grouped by facet (OR: click `greek` + `fraktur` to see both).
  - **Document** — 91 document/text commands (preamble, sectioning, theorems, tables,
    spacing, fonts, references, index…) as a labeled list grouped by category. **Hovering a
    row shows an explanation** — what it does, caveats, and a usage example — in a detail
    pane at the bottom.
  - **Templates** — built-in starter blocks (article skeleton, theorem setup, figure,
    table, bibliography…) plus **your own saved templates**, with a rotating 💡 strip of
    LaTeX best-practice tips.
- **Save your own templates** — click **+ New** in the palette, or select LaTeX in the
  editor and run **"TeXDict: Save Selection as Template"** (title + description prompted).
  Saved globally; delete with ✕.
- **QuickPick search + tag filter** — the `TeXDict: Search` command lists everything,
  grouped by topic; the funnel button filters by tag (AND across checked tags).
- **Faceted tags** — **Subjects** (algebra, analysis, calculus, …, topology),
  **Symbol types** (accent, arrow, font, operation, relation, …), **Character class**
  (blackboard, fraktur, greek, …), and **Document** (preamble, sectioning, theorem, table, …).
- **Smart insertion** — empty `{}` become snippet tab stops (`\frac{}{}` → cursor in the
  first slot); structural commands insert **rich snippets** (e.g. `\begin{tabular}` inserts
  a full row/column skeleton with placeholders you Tab through).
- **Package hints** — entries needing a non-standard package show it (e.g. *needs `mathrsfs`*).
- **Clipboard fallback** — with no editor open, the chosen command is copied to the clipboard.

## Install

Download the latest `texdict-*.vsix` from the
[**Releases**](https://github.com/ys-math/texdict/releases) page, then either:

```bash
code --install-extension texdict-0.0.5.vsix
```

or in VSCode: **Extensions panel → `…` menu → Install from VSIX…** → pick the file →
reload the window.

## Usage

- **Palette:** click the **Σ TeXDict** icon in the Activity Bar → pick a mode
  (`Symbols | Document | Templates`) → browse/filter → click an item to insert it.
  In Document and Templates modes, hover an item to read how to use it.
- **Command Palette:** **"TeXDict: Search LaTeX Dictionary"** (available anywhere), and
  **"TeXDict: Save Selection as Template"** to save selected LaTeX as a reusable template.
- **Keyboard:** **`Ctrl+Alt+L`** (`Cmd+Alt+L` on macOS) — active in `.tex` / LaTeX files.

> Note: a few entries require LaTeX packages in your document (e.g. `\mathbb`,
> `\mathfrak` → `amssymb`; theorem environments → `amsthm`; `\index` → `makeidx`).

## Extending the dictionary

Entries live in `src/dictionary.ts` as a list of
`{ command, name, tags, symbol?, example?, pkg?, snippet?, keywords? }` rows. Add a row and
recompile — search, the palette, and the tag filter re-derive themselves automatically.
The only rule: **every tag you use must be listed in `FACETS`** (top of the same file), or
it won't appear in the filter. Use `example` to control the palette preview, `pkg` to flag
a required package, and `snippet` (with `#1` / `#{1:default}` tokens) for rich templates.
Document-command explanations live in `src/descriptions.ts`; tips in `src/tips.ts`;
built-in templates in `src/templates.ts`.

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
