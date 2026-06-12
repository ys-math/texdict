// Built-in starter templates for the palette's Templates mode, plus the shape
// shared with user-saved templates (stored in globalState by panel.ts).
export interface Template {
  id: string;
  title: string;
  description: string;
  body: string;
  // Insert the body literally (no #-token conversion). Required when the body
  // contains LaTeX macro parameters like #1, e.g. \newcommand definitions.
  plain?: boolean;
}

// Bodies use the snippet token convention from dictionary.ts: #1 = tab stop,
// #{1:default} = placeholder, #0 = final cursor. Converted by customSnippet()
// in extension.ts — so avoid { or } inside placeholder defaults.
export const BUILTIN_TEMPLATES: Template[] = [
  {
    id: "builtin-article",
    title: "Article skeleton",
    description:
      "A minimal article: documentclass, the AMS packages, a title block, and a first section. A good starting point for notes and papers.",
    body: "\\documentclass[#{1:12pt}]{article}\n\\usepackage{amsmath, amssymb, amsthm}\n\n\\title{#{2:Title}}\n\\author{#{3:Author}}\n\\date{\\today}\n\n\\begin{document}\n\\maketitle\n\n\\section{#{4:Introduction}}\n#0\n\n\\end{document}",
  },
  {
    id: "builtin-theorem-setup",
    title: "Theorem setup (preamble)",
    description:
      "Declares theorem, lemma, corollary, definition and remark environments sharing one counter, numbered per section. Put it in the preamble (needs amsthm).",
    body: "\\newtheorem{theorem}{Theorem}[section]\n\\newtheorem{lemma}[theorem]{Lemma}\n\\newtheorem{corollary}[theorem]{Corollary}\n\n\\theoremstyle{definition}\n\\newtheorem{definition}[theorem]{Definition}\n\n\\theoremstyle{remark}\n\\newtheorem{remark}[theorem]{Remark}",
  },
  {
    id: "builtin-theorem-proof",
    title: "Theorem + proof",
    description:
      "A theorem statement followed by its proof (ends with the automatic QED box). Requires the environments from the theorem setup template.",
    body: "\\begin{theorem}\n\t#{1:Statement.}\n\\end{theorem}\n\n\\begin{proof}\n\t#{2:Proof.}\n\\end{proof}",
  },
  {
    id: "builtin-figure",
    title: "Figure",
    description:
      "A floating figure with a centered image, caption, and label (needs graphicx for \\includegraphics). Reference it with \\ref{fig:…}.",
    body: "\\begin{figure}[#{1:htbp}]\n\t\\centering\n\t\\includegraphics[width=#{2:0.8}\\textwidth]{#{3:figure-file}}\n\t\\caption{#{4:Caption}}\n\t\\label{fig:#{5:name}}\n\\end{figure}",
  },
  {
    id: "builtin-table",
    title: "Table with caption",
    description:
      "A floating table: centered tabular with rules, plus caption and label. Adjust the column spec (l/c/r per column) to fit your data.",
    body: "\\begin{table}[#{1:htbp}]\n\t\\centering\n\t\\begin{tabular}{#{2:c c}}\n\t\t\\hline\n\t\t#3 & #4 \\\\\n\t\t\\hline\n\t\\end{tabular}\n\t\\caption{#{5:Caption}}\n\t\\label{tab:#{6:name}}\n\\end{table}",
  },
  {
    id: "builtin-bibliography",
    title: "Bibliography (manual)",
    description:
      "A hand-written bibliography with one \\bibitem; cite it with \\cite{key}. The {9} sets the label width (use {99} for 10+ entries).",
    body: "\\begin{thebibliography}{9}\n\n\\bibitem{#{1:key}}\n#{2:Author, Title, Publisher, Year.}\n\n\\end{thebibliography}",
  },
  {
    id: "builtin-macros",
    title: "Macro pack (preamble)",
    description:
      "Preamble shortcuts mathematicians keep redefining: \\R \\Z \\N \\Q \\C for the number sets, \\abs, \\norm, \\set, \\inner with auto-sizing delimiters, and a \\DeclareMathOperator example. Inserted literally — the #1 are macro parameters.",
    plain: true,
    body: "% number sets\n\\newcommand{\\R}{\\mathbb{R}}\n\\newcommand{\\Z}{\\mathbb{Z}}\n\\newcommand{\\N}{\\mathbb{N}}\n\\newcommand{\\Q}{\\mathbb{Q}}\n\\newcommand{\\C}{\\mathbb{C}}\n% delimiters\n\\newcommand{\\abs}[1]{\\left\\lvert #1 \\right\\rvert}\n\\newcommand{\\norm}[1]{\\left\\lVert #1 \\right\\rVert}\n\\newcommand{\\set}[1]{\\left\\{ #1 \\right\\}}\n\\newcommand{\\inner}[2]{\\left\\langle #1, #2 \\right\\rangle}\n% upright operators\n\\DeclareMathOperator{\\im}{im}\n\\DeclareMathOperator{\\id}{id}",
  },
  {
    id: "builtin-book",
    title: "Text book format",
    description:
      "A book-class skeleton: front matter with title page and table of contents, main matter with part/chapter/section structure, and back matter for the bibliography.",
    body: "\\documentclass[#{1:11pt}]{book}\n\\usepackage{amsmath, amssymb, amsthm}\n\n\\title{#{2:Title}}\n\\author{#{3:Author}}\n\\date{\\today}\n\n\\begin{document}\n\n\\frontmatter\n\\maketitle\n\\tableofcontents\n\n\\mainmatter\n\\part{#{4:Part One}}\n\\chapter{#{5:Introduction}}\n\\section{#{6:First section}}\n#0\n\n\\backmatter\n\\begin{thebibliography}{9}\n\\bibitem{key} Author, Title, Publisher, Year.\n\\end{thebibliography}\n\n\\end{document}",
  },
];
