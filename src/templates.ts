// Built-in starter templates for the palette's Templates mode, plus the shape
// shared with user-saved templates (stored in globalState by panel.ts).
export interface Template {
  id: string;
  title: string;
  description: string;
  body: string;
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
];
