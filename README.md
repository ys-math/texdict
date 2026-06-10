# TeXDict

A LaTeX dictionary for mathematicians. Search a symbol by its concept name
(e.g. *"integral"*, *"for all"*, *"reals"*) and insert the LaTeX command at your cursor —
**263 symbols** across pure-math domains, all keyboard-driven.

## Features

- **Search by meaning** — type `integral` → insert `\int`, `tensor product` → `\otimes`,
  `reals` → `\mathbb{R}`. You don't need to remember the command, just the concept.
- **Browse everything** — the picker shows all symbols by default, grouped under topic
  headers. Each group header appears once.
- **Filter by tag** — click the filter (funnel) button to narrow by faceted tags:
  - **Subjects** — algebra, analysis, calculus, category theory, combinatorics, complex,
    geometry, group theory, linear algebra, logic, number theory, order theory,
    probability, set theory, topology
  - **Symbol types** — accent, arrow, big operator, bracket, operation, operator,
    quantifier, relation, structure
  - **Character class** — blackboard, fraktur, greek, hebrew, script

  Checking several tags filters with **AND** (a symbol must match all of them). A clear
  button resets.
- **LaTeX-format display** — each row shows the glyph and its command, e.g. `∫  \int`.
- **Searchable on everything** — names, keywords, and tags all match as you type.
- **Clipboard fallback** — with no editor open, the chosen command is copied to the clipboard.

## Install

Download the latest `texdict-*.vsix` from the
[**Releases**](https://github.com/ys-math/texdict/releases) page, then either:

```bash
code --install-extension texdict-0.0.3.vsix
```

or in VSCode: **Extensions panel → `…` menu → Install from VSIX…** → pick the file →
reload the window.

## Usage

- **Command Palette:** **"TeXDict: Search LaTeX Dictionary"** (available anywhere).
- **Keyboard:** **`Ctrl+Alt+L`** (`Cmd+Alt+L` on macOS) — active in `.tex` / LaTeX files.

Type to search, optionally click the funnel to filter by domain, press **Enter** to insert.

> Note: a few symbols require LaTeX packages to render in your document (e.g. `\mathbb`,
> `\mathfrak` → `amssymb`; `\coloneqq` → `mathtools`; `\llbracket` → `stmaryrd`).

## Extending the dictionary

Symbols live in `src/dictionary.ts` as a list of
`{ command, name, tags, symbol?, keywords? }` entries. Add a row and recompile — the
search and the tag filter re-derive themselves automatically. The only rule: **every tag
you use must be listed in `FACETS`** (top of the same file), or it won't appear in the filter.

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
