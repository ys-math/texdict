# TeXDict

A LaTeX dictionary for mathematicians. Search a symbol by its concept name
(e.g. *"integral"*, *"for all"*, *"reals"*) and insert the LaTeX command at your cursor —
**457 symbols + 128 document commands**, a package reference, and ready-made templates,
by keyboard or click.

## Features

- **Search by meaning** — type `integral` → insert `\int`, `tensor product` → `\otimes`,
  `reals` → `\mathbb{R}`. You don't need to remember the command, just the concept.
- **Four-mode palette** — a side panel (Activity Bar) with a
  `Symbols | Document | Templates | Packages` toggle:
  - **Symbols** — 457 symbols **typeset with KaTeX** in an organized grid: a **RECENT**
    section (your last 12 insertions) on top, then GREEK, FONTS, symbol types
    (operations, relations, arrows, brackets…) and subjects (algebra … topology).
    Subjects include **decorated variants** of the big operators in their idiomatic
    forms (`\sum_{d \mid n}` under number theory, `\prod_{x \in X}` under set theory,
    `\oint_{\gamma}` under analysis…), each inserting an adjustable snippet.
    Wide previews auto-scale to fit. One-click **tag-chip** filtering (OR semantics).
  - **Document** — 128 document/text commands (preamble, sectioning, theorems, proof trees,
    math display environments, lists, figures, tables, links & colors, references, index…)
    grouped by category. **Hovering a row shows an explanation** — what it does, caveats,
    and a **worked, copy-ready example** (multi-line for environments like `figure` or
    `align`) — in a **resizable** detail pane (drag its top edge).
  - **Templates** — 16 built-in starters **grouped by category** (Document skeletons,
    Preamble, Theorems & proofs, Diagrams, Floats, Bibliography & notes): article, journal
    article (amsart), book format, theorem setup, theorem + proof, **proof trees — worked
    natural-deduction & sequent-calculus derivations, via bussproofs**, commutative diagrams — tikz-cd square
    and a 3D TikZ cube —, short & long exact sequences, figure, table, bibliography, footnote
    pack, macro pack… plus **your own saved templates**, with a rotating 💡 strip of LaTeX
    best-practice tips.
  - **Packages** — a reference of 33 common packages (amsmath, hyperref, tikz, booktabs,
    bussproofs…)
    with what each does and a gotcha tip; clicking inserts the typical `\usepackage` line.
- **Save your own templates** — click **+ New** in the palette, or select LaTeX in the
  editor and run **"TeXDict: Save Selection as Template"** (title + description prompted).
  Saved globally; delete with ✕.
- **QuickPick search + tag filter** — the `TeXDict: Search` command lists everything,
  grouped by topic with your **recent** insertions on top; the funnel button filters
  by tag (AND across checked tags).
- **WYSIWYG insertion** — every symbol button inserts exactly what it renders: the
  displayed letters become selected placeholders you Tab through (`\frac{a}{b}` →
  `a` selected, Tab to `b`; the `a ≡ b (mod n)` preview inserts the whole congruence).
  Structural commands insert **rich snippets** (e.g. `\begin{align}` inserts an aligned
  two-row skeleton with placeholders).
- **Package hints** — entries needing a non-standard package show it (e.g. *needs `mathrsfs`*).
- **Clipboard fallback** — with no editor open, the chosen command is copied to the clipboard.

## Install

Download the latest `texdict-*.vsix` from the
[**Releases**](https://github.com/ys-math/texdict/releases) page, then either:

```bash
code --install-extension texdict-0.0.10.vsix
```

or in VSCode: **Extensions panel → `…` menu → Install from VSIX…** → pick the file →
reload the window.

## Usage

- **Palette:** click the **Σ TeXDict** icon in the Activity Bar → pick a mode
  (`Symbols | Document | Templates | Packages`) → browse/filter → click an item to insert
  it. Outside Symbols mode, hover an item to read how to use it; drag the divider above
  the explanation pane to resize it.
- **Command Palette:** **"TeXDict: Search LaTeX Dictionary"** (available anywhere), and
  **"TeXDict: Save Selection as Template"** to save selected LaTeX as a reusable template.
- **Keyboard:** **`Ctrl+Alt+L`** (`Cmd+Alt+L` on macOS) — active in `.tex` / LaTeX files.

> Note: a few entries require LaTeX packages in your document (e.g. `\mathbb`,
> `\mathfrak` → `amssymb`; theorem environments → `amsthm`; `\href` → `hyperref`) —
> check the **Packages** tab for what each one does.

## Extending the dictionary

Entries live in `src/dictionary.ts` as a list of
`{ command, name, tags, symbol?, example?, pkg?, snippet?, keywords? }` rows. Add a row and
recompile — search, the palette, and the tag filter re-derive themselves automatically.
The only rule: **every tag you use must be listed in `FACETS`** (top of the same file), or
it won't appear in the filter. Use `example` to control the palette preview, `pkg` to flag
a required package, and `snippet` (with `#1` / `#{1:default}` tokens) for rich templates.
Document-command explanations live in `src/descriptions.ts` (each a `{ what, example }`
pair — the example shows in the detail pane); tips in `src/tips.ts`;
built-in templates in `src/templates.ts`; the package reference in `src/packages.ts`.

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
