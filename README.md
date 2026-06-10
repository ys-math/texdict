# TeXDict

> A VS Code extension for mathematicians. Search any LaTeX symbol by its concept
> name — *"integral"*, *"for all"*, *"tensor product"* — and insert the command
> directly at your cursor.

## Installation

### From a release (end users)

1. Go to the [Releases](https://github.com/ys-math/texdict/releases) page and
   download `texdict-0.0.1.vsix`.
2. In VS Code open the Extensions panel (`Ctrl+Shift+X` / `Cmd+Shift+X`).
3. Click the **`⋯`** menu (top-right of the panel) → **Install from VSIX…** and
   select the downloaded file.

Or from the terminal:

```bash
code --install-extension texdict-0.0.1.vsix
```

**Requirements:** VS Code ≥ 1.90.

### Build from source

```bash
git clone https://github.com/ys-math/texdict.git
cd texdict
npm install
npm run compile
```

Then install the compiled folder as an extension:

```bash
# copy the folder to your VS Code extensions directory, e.g.:
cp -r . ~/.vscode/extensions/texdict-0.0.1
```

Or press **F5** inside VS Code to launch an Extension Development Host with
TeXDict already loaded — no installation step required.

**Requirements:** VS Code ≥ 1.90, Node.js ≥ 18.

---

## Features

- **Search by meaning** — type `integral` and get `\int`; type `tensor product`
  and get `\otimes`. Name, keywords, and tags are all searchable.
- **Browse all symbols** — the picker opens with all 57 symbols visible, grouped
  by topic (Calculus, Set Theory, Group Theory, …).
- **Filter by tag** — click the **⏚** (funnel) button to narrow by faceted tags:
  - *Subjects:* algebra, analysis, calculus, category theory, complex, group
    theory, linear algebra, logic, number theory, set theory, topology
  - *Symbol types:* arrow, big operator, bracket, operation, operator,
    quantifier, relation, structure
  - *Character class:* blackboard, greek
  
  Filters are AND-combined: a symbol must match **all** checked tags.
- **LaTeX-format display** — each row shows the unicode glyph and the LaTeX
  command side by side, e.g. `∫  \int`.
- **Clipboard fallback** — if no editor is focused, the chosen command is copied
  to the clipboard automatically.

## Usage

| How | Action |
|---|---|
| Command Palette | `Ctrl+Shift+P` → **TeXDict: Search LaTeX Dictionary** |
| Keyboard shortcut | `Ctrl+Alt+L` (Windows/Linux) · `Cmd+Alt+L` (macOS) — in `.tex` files |

1. Open the picker.
2. Type any part of a symbol's name, keyword, or tag to search.
3. Optionally click **⏚** to filter by subject or symbol type.
4. Press **Enter** to insert at the cursor (or copy to clipboard).

## Extending the dictionary

All symbols live in [`src/dictionary.ts`](src/dictionary.ts) as a plain list of
`{ command, name, tags, symbol?, keywords? }` entries. To add a symbol, append a
row — no other code changes are needed:

```typescript
{ command: "\\forall", name: "for all", tags: ["logic", "set theory", "quantifier"], symbol: "∀", keywords: ["universal quantifier"] },
```

Recompile with `npm run compile` (or let `npm run watch` pick it up automatically).

## Packaging a `.vsix`

Install [`@vscode/vsce`](https://github.com/microsoft/vscode-vsce), then run:

```bash
npm install -g @vscode/vsce
vsce package
```

This compiles the extension (via `vscode:prepublish`) and produces
`texdict-0.0.1.vsix` in the project root.

## Development

```bash
npm install
npm run watch    # incremental TypeScript compilation
```

Press **F5** in VS Code to launch the Extension Development Host. After editing
source files, click **↻ Reload** in the host window to pick up changes.

## License

[MIT](LICENSE)
