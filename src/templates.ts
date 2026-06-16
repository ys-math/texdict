// Built-in starter templates for the palette's Templates mode, plus the shape
// shared with user-saved templates (stored in globalState by panel.ts).
export interface Template {
  id: string;
  title: string;
  description: string;
  body: string;
  // Groups built-ins under a header in the Templates tab (the palette derives
  // the header order from first appearance, so array order = header order).
  // Omitted for user-saved templates — they live under "My templates".
  category?: string;
  // Insert the body literally (no #-token conversion). Required when the body
  // contains LaTeX macro parameters like #1, e.g. \newcommand definitions.
  plain?: boolean;
}

// Bodies use the snippet token convention from dictionary.ts: #1 = tab stop,
// #{1:default} = placeholder, #0 = final cursor. Converted by customSnippet()
// in extension.ts — defaults may contain at most ONE level of balanced braces.
export const BUILTIN_TEMPLATES: Template[] = [
  // ── Document skeletons ───────────────────────────────────────────────
  {
    id: "builtin-article",
    title: "Article skeleton",
    category: "Document skeletons",
    description:
      "A minimal article: documentclass, the AMS packages, a title block, and a first section. A good starting point for notes and papers.",
    body: "\\documentclass[#{1:12pt}]{article}\n\\usepackage{amsmath, amssymb, amsthm}\n\n\\title{#{2:Title}}\n\\author{#{3:Author}}\n\\date{\\today}\n\n\\begin{document}\n\\maketitle\n\n\\section{#{4:Introduction}}\n#0\n\n\\end{document}",
  },
  {
    id: "builtin-amsart",
    title: "Journal article (amsart)",
    category: "Document skeletons",
    description:
      "The AMS article class used by most math journals: title block with address/email, MSC subject classification, keywords, abstract (placed before \\maketitle — the amsart convention), theorem setup, and a bibliography.",
    body: "\\documentclass[#{1:11pt}]{amsart}\n\\usepackage{amssymb, mathtools}\n\n\\newtheorem{theorem}{Theorem}[section]\n\\newtheorem{lemma}[theorem]{Lemma}\n\\newtheorem{corollary}[theorem]{Corollary}\n\\theoremstyle{definition}\n\\newtheorem{definition}[theorem]{Definition}\n\n\\title{#{2:Title}}\n\\author{#{3:Author}}\n\\address{#{4:Department, University, City}}\n\\email{#{5:author@university.edu}}\n\\subjclass[2020]{#{6:Primary 00A05}}\n\\keywords{#{7:keyword one, keyword two}}\n\n\\begin{document}\n\n\\begin{abstract}\n#{8:Abstract.}\n\\end{abstract}\n\n\\maketitle\n\n\\section{Introduction}\n#0\n\n\\begin{thebibliography}{9}\n\\bibitem{key} Author, Title, Journal, Year.\n\\end{thebibliography}\n\n\\end{document}",
  },
  {
    id: "builtin-book",
    title: "Text book format",
    category: "Document skeletons",
    description:
      "A book-class skeleton: front matter with title page and table of contents, main matter with part/chapter/section structure, and back matter for the bibliography.",
    body: "\\documentclass[#{1:11pt}]{book}\n\\usepackage{amsmath, amssymb, amsthm}\n\n\\title{#{2:Title}}\n\\author{#{3:Author}}\n\\date{\\today}\n\n\\begin{document}\n\n\\frontmatter\n\\maketitle\n\\tableofcontents\n\n\\mainmatter\n\\part{#{4:Part One}}\n\\chapter{#{5:Introduction}}\n\\section{#{6:First section}}\n#0\n\n\\backmatter\n\\begin{thebibliography}{9}\n\\bibitem{key} Author, Title, Publisher, Year.\n\\end{thebibliography}\n\n\\end{document}",
  },

  // ── Preamble ─────────────────────────────────────────────────────────
  {
    id: "builtin-theorem-setup",
    title: "Theorem setup (preamble)",
    category: "Preamble",
    description:
      "Declares theorem, lemma, corollary, definition and remark environments sharing one counter, numbered per section. Put it in the preamble (needs amsthm).",
    body: "\\newtheorem{theorem}{Theorem}[section]\n\\newtheorem{lemma}[theorem]{Lemma}\n\\newtheorem{corollary}[theorem]{Corollary}\n\n\\theoremstyle{definition}\n\\newtheorem{definition}[theorem]{Definition}\n\n\\theoremstyle{remark}\n\\newtheorem{remark}[theorem]{Remark}",
  },
  {
    id: "builtin-macros",
    title: "Macro pack (preamble)",
    category: "Preamble",
    description:
      "Preamble shortcuts mathematicians keep redefining: \\R \\Z \\N \\Q \\C for the number sets, \\abs, \\norm, \\set, \\inner with auto-sizing delimiters, and a \\DeclareMathOperator example. Inserted literally — the #1 are macro parameters.",
    plain: true,
    body: "% number sets\n\\newcommand{\\R}{\\mathbb{R}}\n\\newcommand{\\Z}{\\mathbb{Z}}\n\\newcommand{\\N}{\\mathbb{N}}\n\\newcommand{\\Q}{\\mathbb{Q}}\n\\newcommand{\\C}{\\mathbb{C}}\n% delimiters\n\\newcommand{\\abs}[1]{\\left\\lvert #1 \\right\\rvert}\n\\newcommand{\\norm}[1]{\\left\\lVert #1 \\right\\rVert}\n\\newcommand{\\set}[1]{\\left\\{ #1 \\right\\}}\n\\newcommand{\\inner}[2]{\\left\\langle #1, #2 \\right\\rangle}\n% upright operators\n\\DeclareMathOperator{\\im}{im}\n\\DeclareMathOperator{\\id}{id}",
  },

  // ── Theorems & proofs ────────────────────────────────────────────────
  {
    id: "builtin-theorem-proof",
    title: "Theorem + proof",
    category: "Theorems & proofs",
    description:
      "A theorem statement followed by its proof (ends with the automatic QED box). Requires the environments from the theorem setup template.",
    body: "\\begin{theorem}\n\t#{1:Statement.}\n\\end{theorem}\n\n\\begin{proof}\n\t#{2:Proof.}\n\\end{proof}",
  },
  {
    id: "builtin-prooftree-nd",
    title: "Proof tree (natural deduction)",
    category: "Theorems & proofs",
    description:
      "A complete natural-deduction derivation in bussproofs (needs \\usepackage{bussproofs}) proving (A ∧ B) → (B ∧ A). The assumption [A ∧ B] is used on both branches (∧-elimination each side), recombined by ∧-introduction, then discharged by →-introduction — the ¹ on the rule matches the bracketed assumption. A and B are mirrored placeholders (rename one, every copy follows). It also shows the bussproofs stacking order: each \\AxiomC…\\…InfC subtree is finished before \\BinaryInfC joins two of them.",
    body: "\\begin{prooftree}\n\t\\AxiomC{$[#{1:A} \\land #{2:B}]^{1}$}\n\t\\RightLabel{$\\land$E}\n\t\\UnaryInfC{$#{2:B}$}\n\t\\AxiomC{$[#{1:A} \\land #{2:B}]^{1}$}\n\t\\RightLabel{$\\land$E}\n\t\\UnaryInfC{$#{1:A}$}\n\t\\RightLabel{$\\land$I}\n\t\\BinaryInfC{$#{2:B} \\land #{1:A}$}\n\t\\RightLabel{$\\to$I${}^{1}$}\n\t\\UnaryInfC{$(#{1:A} \\land #{2:B}) \\to (#{2:B} \\land #{1:A})$}\n\\end{prooftree}",
  },
  {
    id: "builtin-prooftree-sequent",
    title: "Proof tree (sequent calculus)",
    category: "Theorems & proofs",
    description:
      "A complete sequent-calculus derivation in bussproofs (needs \\usepackage{bussproofs}) proving A ∧ B ⊢ B ∧ A. Two ∧L branches pick B and A out of A ∧ B (the identity axioms are the leaves), then ∧R joins them. A and B are mirrored placeholders; \\vdash is the turnstile. Swap the rule labels and \\…InfC arity to build your own left/right rules.",
    body: "\\begin{prooftree}\n\t\\AxiomC{$#{1:A}, #{2:B} \\vdash #{2:B}$}\n\t\\RightLabel{$\\land$L}\n\t\\UnaryInfC{$#{1:A} \\land #{2:B} \\vdash #{2:B}$}\n\t\\AxiomC{$#{1:A}, #{2:B} \\vdash #{1:A}$}\n\t\\RightLabel{$\\land$L}\n\t\\UnaryInfC{$#{1:A} \\land #{2:B} \\vdash #{1:A}$}\n\t\\RightLabel{$\\land$R}\n\t\\BinaryInfC{$#{1:A} \\land #{2:B} \\vdash #{2:B} \\land #{1:A}$}\n\\end{prooftree}",
  },

  // ── Diagrams ─────────────────────────────────────────────────────────
  {
    id: "builtin-tikzcd",
    title: "Commutative diagram (square)",
    category: "Diagrams",
    description:
      "A commuting square in tikz-cd (needs the tikz-cd package). Adjustable: the first two stops set row/column sep (tiny, small, normal, large, huge — or e.g. 3em); arrow labels sit in quotes, a primed quote (\"g\"') flips the label to the other side; decorate arrows with hook, two heads, dashed (e.g. \\arrow[r, hook, \"f\"]). Extend with more rows/columns via & and \\\\.",
    body: "\\begin{tikzcd}[row sep=#{1:normal}, column sep=#{2:large}]\n\t#{3:A} \\arrow[r, \"#{4:f}\"] \\arrow[d, \"#{5:g}\"'] & #{6:B} \\arrow[d, \"#{7:h}\"] \\\\\n\t#{8:C} \\arrow[r, \"#{9:k}\"'] & #{10:D}\n\\end{tikzcd}",
  },
  {
    id: "builtin-tikzcd-cube",
    title: "Commutative diagram (3D cube)",
    category: "Diagrams",
    description:
      "A cubical commutative diagram in plain TikZ (needs \\usepackage{tikz}) — front and back squares joined by dashed depth arrows, with white underlays so front edges pass over back ones. Adjust spacing via \\dx \\dy \\dz \\dw, rename objects in the \\node lines and morphisms in the node[lbl, ...] parts; nodes are named (A)…(D) front and (A')…(D') back so you can attach extra arrows. Inserted literally.",
    plain: true,
    body: [
      "% Cubical commutative diagram (needs: \\usepackage{tikz})",
      "% Adjust spacing via \\dx \\dy \\dz \\dw; object names in the \\node lines;",
      "% morphism names in the node[lbl, ...] {...} parts. Nodes are named",
      "% (A) (B) (C) (D) front and (A') (B') (C') (D') back for extra arrows.",
      "\\begin{tikzpicture}[",
      "  face arrow/.style  = {->},",
      "  depth arrow/.style = {->, dashed},",
      "  % white underlay: this edge passes IN FRONT of earlier ones",
      "  crossing/.style    = {preaction={draw=white, -, line width=4pt}},",
      "  corner/.style      = {inner sep=2pt},",
      "  lbl/.style         = {font=\\small, inner sep=1.5pt},",
      "]",
      "\\def\\dx{2.6}   % horizontal spacing of a face",
      "\\def\\dy{2.6}   % vertical spacing of a face",
      "\\def\\dz{1.5}   % depth offset (x)",
      "\\def\\dw{1.0}   % depth offset (y)",
      "",
      "% --- corners: front face ---",
      "\\node[corner] (A)  at (0,0)        {$A$};",
      "\\node[corner] (B)  at (\\dx,0)      {$B$};",
      "\\node[corner] (C)  at (0,\\dy)      {$C$};",
      "\\node[corner] (D)  at (\\dx,\\dy)    {$D$};",
      "% --- corners: back face ---",
      "\\node[corner] (A') at (\\dz,\\dw)         {$A'$};",
      "\\node[corner] (B') at (\\dx+\\dz,\\dw)     {$B'$};",
      "\\node[corner] (C') at (\\dz,\\dy+\\dw)     {$C'$};",
      "\\node[corner] (D') at (\\dx+\\dz,\\dy+\\dw) {$D'$};",
      "",
      "% --- back face (drawn first) ---",
      "\\draw[face arrow] (A') -- node[lbl, below, pos=0.72] {$f'$} (B');",
      "\\draw[face arrow] (A') -- node[lbl, right, pos=0.28] {$g'$} (C');",
      "\\draw[face arrow] (B') -- node[lbl, right]            {$k'$} (D');",
      "\\draw[face arrow] (C') -- node[lbl, above]            {$h'$} (D');",
      "",
      "% --- depth edges (front corner -> back corner) ---",
      "\\draw[depth arrow, crossing] (A) -- node[lbl, above left=-2pt]  {$a$} (A');",
      "\\draw[depth arrow, crossing] (B) -- node[lbl, below right=-2pt] {$b$} (B');",
      "\\draw[depth arrow, crossing] (C) -- node[lbl, above left=-2pt]  {$c$} (C');",
      "\\draw[depth arrow, crossing] (D) -- node[lbl, below right=-2pt] {$d$} (D');",
      "",
      "% --- front face (drawn last, interrupts what it crosses) ---",
      "\\draw[face arrow, crossing] (A) -- node[lbl, below] {$f$} (B);",
      "\\draw[face arrow, crossing] (A) -- node[lbl, left]  {$g$} (C);",
      "\\draw[face arrow, crossing] (B) -- node[lbl, right, pos=0.62] {$k$} (D);",
      "\\draw[face arrow, crossing] (C) -- node[lbl, above] {$h$} (D);",
      "\\end{tikzpicture}",
    ].join("\n"),
  },
  {
    id: "builtin-ses",
    title: "Short exact sequence",
    category: "Diagrams",
    description:
      "0 → A → B → C → 0 in tikz-cd (needs the tikz-cd package). Exactness means f is injective, g is surjective, and im f = ker g. Tab through the objects and the arrow labels; add decorations like hook or two heads to the \\arrow options.",
    body: "\\begin{tikzcd}\n\t0 \\arrow[r] & #{1:A} \\arrow[r, \"#{2:f}\"] & #{3:B} \\arrow[r, \"#{4:g}\"] & #{5:C} \\arrow[r] & 0\n\\end{tikzcd}",
  },
  {
    id: "builtin-les",
    title: "Long exact sequence",
    category: "Diagrams",
    description:
      "A two-row long exact sequence in tikz-cd (needs tikz-cd), with the connecting morphism ∂ curving from the end of one row to the start of the next. A, B, C are mirrored placeholders — renaming one updates both rows. Replace H by your functor (e.g. \\pi for homotopy groups) and tune the curve via the out/in angles.",
    body: "\\begin{tikzcd}[column sep=#{1:normal}]\n\t\\cdots \\arrow[r] & H_n(#{2:A}) \\arrow[r, \"#{3:f}\"] & H_n(#{4:B}) \\arrow[r, \"#{5:g}\"] & H_n(#{6:C}) \\arrow[dll, \"\\partial\", out=-30, in=150] \\\\\n\t& H_{n-1}(#{2:A}) \\arrow[r] & H_{n-1}(#{4:B}) \\arrow[r] & \\cdots\n\\end{tikzcd}",
  },

  // ── Floats ───────────────────────────────────────────────────────────
  {
    id: "builtin-figure",
    title: "Figure",
    category: "Floats",
    description:
      "A floating figure with a centered image, caption, and label (needs graphicx for \\includegraphics). Reference it with \\ref{fig:…}.",
    body: "\\begin{figure}[#{1:htbp}]\n\t\\centering\n\t\\includegraphics[width=#{2:0.8}\\textwidth]{#{3:figure-file}}\n\t\\caption{#{4:Caption}}\n\t\\label{fig:#{5:name}}\n\\end{figure}",
  },
  {
    id: "builtin-table",
    title: "Table with caption",
    category: "Floats",
    description:
      "A floating table: centered tabular with rules, plus caption and label. Adjust the column spec (l/c/r per column) to fit your data.",
    body: "\\begin{table}[#{1:htbp}]\n\t\\centering\n\t\\begin{tabular}{#{2:c c}}\n\t\t\\hline\n\t\t#3 & #4 \\\\\n\t\t\\hline\n\t\\end{tabular}\n\t\\caption{#{5:Caption}}\n\t\\label{tab:#{6:name}}\n\\end{table}",
  },

  // ── Bibliography & notes ─────────────────────────────────────────────
  {
    id: "builtin-bibliography",
    title: "Bibliography (manual)",
    category: "Bibliography & notes",
    description:
      "A hand-written bibliography with one \\bibitem; cite it with \\cite{key}. The {9} sets the label width (use {99} for 10+ entries).",
    body: "\\begin{thebibliography}{9}\n\n\\bibitem{#{1:key}}\n#{2:Author, Title, Publisher, Year.}\n\n\\end{thebibliography}",
  },
  {
    id: "builtin-footnotes",
    title: "Footnote pack",
    category: "Bibliography & notes",
    description:
      "Footnotes three ways: the everyday inline \\footnote; the \\footnotemark + \\footnotetext split for places where \\footnote breaks (tables, captions, section titles); and a preamble line switching to symbol markers (* † ‡) instead of numbers.",
    body: "Some claim\\footnote{#{1:Why it holds, with a reference.}} in the text.\n\n% In tables, captions, or section titles \\footnote breaks — split it:\n% ... cell text\\footnotemark ...\n% \\footnotetext{The note text, placed right after the table or caption.}\n\n% Symbol footnotes (* † ‡) instead of numbers — put in the preamble:\n% \\renewcommand{\\thefootnote}{\\fnsymbol{footnote}}",
  },
];
