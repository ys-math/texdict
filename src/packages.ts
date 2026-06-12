// Reference data for the palette's Packages tab: what each common package
// does, the typical \usepackage line (inserted on click), and gotchas.
// Pure data — no vscode imports.
export interface Pkg {
  name: string;
  category: string;
  description: string;
  load: string; // typical preamble line, inserted literally
  tip?: string; // caveat / best practice shown in the detail pane
}

export const PACKAGES: Pkg[] = [
  // ── Math ──────────────────────────────────────────────────────────────
  { name: "amsmath", category: "math", load: "\\usepackage{amsmath}", description: "The essential math package: align/gather/multline environments, \\text, \\eqref, \\operatorname, matrices, \\tfrac and much more.", tip: "Load it in virtually every math document." },
  { name: "amssymb", category: "math", load: "\\usepackage{amssymb}", description: "Extra math symbols: \\mathbb blackboard bold, \\mathfrak, negated relations (\\nleq), arrows, and the AMS symbol fonts.", tip: "Implies amsfonts; no need to load both." },
  { name: "amsthm", category: "math", load: "\\usepackage{amsthm}", description: "Theorem environments: \\newtheorem with styles (plain/definition/remark) and the proof environment with its QED box.", tip: "Load after amsmath." },
  { name: "mathtools", category: "math", load: "\\usepackage{mathtools}", description: "Fixes and extends amsmath: \\coloneqq, \\DeclarePairedDelimiter for \\abs/\\norm, \\prescript, better \\smashoperator.", tip: "Loads amsmath itself — use it instead of plain amsmath." },
  { name: "mathrsfs", category: "math", load: "\\usepackage{mathrsfs}", description: "Provides \\mathscr — the formal script alphabet (distinct from \\mathcal), common for sheaves and categories." },
  { name: "bm", category: "math", load: "\\usepackage{bm}", description: "\\bm{} for proper bold math symbols (vectors, matrices) — bolder and more reliable than \\mathbf for greek and operators." },
  { name: "stmaryrd", category: "math", load: "\\usepackage{stmaryrd}", description: "St Mary Road symbols: \\llbracket/\\rrbracket semantic brackets, \\lightning, and other CS/logic symbols." },

  // ── Layout & typography ──────────────────────────────────────────────
  { name: "geometry", category: "layout & typography", load: "\\usepackage[margin=1in]{geometry}", description: "Sets the page dimensions and margins with readable options.", tip: "One margin=… option usually replaces a pile of \\setlength calls." },
  { name: "fancyhdr", category: "layout & typography", load: "\\usepackage{fancyhdr}", description: "Custom headers and footers: \\pagestyle{fancy}, then \\lhead, \\rhead, \\cfoot etc." },
  { name: "setspace", category: "layout & typography", load: "\\usepackage{setspace}", description: "Line spacing: \\onehalfspacing, \\doublespacing, or the spacing environment for parts of the text." },
  { name: "enumitem", category: "layout & typography", load: "\\usepackage{enumitem}", description: "Full control over itemize/enumerate/description: labels, spacing, resume counters. e.g. \\begin{enumerate}[label=(\\alph*)]", tip: "The clean way to get (a), (b), (c) labels." },
  { name: "microtype", category: "layout & typography", load: "\\usepackage{microtype}", description: "Subtle typographic refinements (character protrusion, font expansion) — better-looking pages and fewer overfull boxes, for free.", tip: "Just load it; no configuration needed." },
  { name: "parskip", category: "layout & typography", load: "\\usepackage{parskip}", description: "Paragraphs separated by vertical space instead of first-line indents." },

  // ── Graphics & figures ───────────────────────────────────────────────
  { name: "graphicx", category: "graphics & figures", load: "\\usepackage{graphicx}", description: "\\includegraphics for images (PDF/PNG/JPG), plus \\scalebox and \\rotatebox." },
  { name: "xcolor", category: "graphics & figures", load: "\\usepackage{xcolor}", description: "Colors: \\textcolor, \\colorbox, \\definecolor, and named color models (e.g. red!20 mixes)." },
  { name: "tikz", category: "graphics & figures", load: "\\usepackage{tikz}", description: "The standard drawing language: diagrams, plots, graphs, annotations — all programmatic, in your document's fonts.", tip: "Steep learning curve but worth it; load libraries with \\usetikzlibrary." },
  { name: "tikz-cd", category: "graphics & figures", load: "\\usepackage{tikz-cd}", description: "Commutative diagrams via the tikzcd environment: nodes in a grid, \\arrow[r, \"f\"] between them.", tip: "The modern replacement for xymatrix." },
  { name: "subcaption", category: "graphics & figures", load: "\\usepackage{subcaption}", description: "Sub-figures/sub-tables with their own (a)/(b) captions inside one float, via the subfigure environment.", tip: "Use instead of the obsolete subfigure/subfig packages." },
  { name: "wrapfig", category: "graphics & figures", load: "\\usepackage{wrapfig}", description: "wrapfigure: a figure that body text flows around.", tip: "Fragile near page breaks and lists — place carefully." },
  { name: "float", category: "graphics & figures", load: "\\usepackage{float}", description: "Adds the [H] float placement: put the figure/table exactly HERE, no floating." },

  // ── Tables ───────────────────────────────────────────────────────────
  { name: "booktabs", category: "tables", load: "\\usepackage{booktabs}", description: "Professional tables: \\toprule, \\midrule, \\bottomrule with proper spacing.", tip: "Use rules sparingly and never vertical lines — that's the booktabs philosophy." },
  { name: "longtable", category: "tables", load: "\\usepackage{longtable}", description: "Tables that break across pages, with repeated headers." },
  { name: "multirow", category: "tables", load: "\\usepackage{multirow}", description: "\\multirow: a cell spanning several rows (the row analogue of \\multicolumn)." },

  // ── References & links ───────────────────────────────────────────────
  { name: "hyperref", category: "references & links", load: "\\usepackage[colorlinks=true, linkcolor=blue, citecolor=blue]{hyperref}", description: "Makes \\ref, \\cite, \\url and the table of contents clickable; adds PDF bookmarks and metadata.", tip: "Load it LAST in the preamble (except cleveref, which goes after)." },
  { name: "cleveref", category: "references & links", load: "\\usepackage{cleveref}", description: "\\cref{eq:euler} prints \"equation (1)\" — the reference type is added automatically and consistently.", tip: "Load after hyperref. Use \\Cref at sentence start." },
  { name: "biblatex", category: "references & links", load: "\\usepackage[backend=biber]{biblatex}", description: "Modern bibliographies: \\addbibresource{refs.bib}, \\printbibliography, flexible citation styles.", tip: "Compile with biber, not bibtex. The classic alternative is natbib." },
  { name: "csquotes", category: "references & links", load: "\\usepackage{csquotes}", description: "Context-sensitive quotation marks: \\enquote{…} picks the right quotes for the language.", tip: "Recommended whenever you use babel + biblatex." },

  // ── Code & misc ──────────────────────────────────────────────────────
  { name: "listings", category: "code & misc", load: "\\usepackage{listings}", description: "Source-code listings with syntax highlighting: the lstlisting environment and \\lstinline.", tip: "minted highlights better but needs Python/pygments and -shell-escape." },
  { name: "siunitx", category: "code & misc", load: "\\usepackage{siunitx}", description: "Numbers and units done right: \\SI{9.81}{m/s^2}, \\num{1e-5}, aligned decimal columns in tables." },
  { name: "todonotes", category: "code & misc", load: "\\usepackage{todonotes}", description: "\\todo{fix this} margin notes and \\listoftodos — handy while drafting.", tip: "\\usepackage[disable]{todonotes} hides them all for submission." },
  { name: "makeidx", category: "code & misc", load: "\\usepackage{makeidx}", description: "Index support: \\makeindex in the preamble, \\index{} entries, \\printindex at the end." },
  { name: "babel", category: "code & misc", load: "\\usepackage[english]{babel}", description: "Language support: hyphenation patterns and translated names (Chapter, Contents…) per language." },
];
