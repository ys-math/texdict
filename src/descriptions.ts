// Help text for document commands, keyed by the entry's `command` string.
// Each value: what the command does (+ caveats) and a short usage example.
// Kept separate from dictionary.ts to keep that file scannable. Shown in the
// palette's Document detail pane (src/panel.ts).
export const DESCRIPTIONS: Record<string, string> = {
  // ── Preamble ─────────────────────────────────────────────────────────
  "\\documentclass{}": "The first line of every document; sets the overall layout (article, report, book, beamer…). Options like font size go in brackets. e.g. \\documentclass[12pt]{article}",
  "\\usepackage{}": "Loads a package that adds commands or features. Goes in the preamble (before \\begin{document}). e.g. \\usepackage{amsmath}",
  "\\usepackage[]{}": "Loads a package with options in the brackets. e.g. \\usepackage[utf8]{inputenc}",
  "\\begin{document}": "Marks where the document body starts; everything before it is the preamble. Always paired with \\end{document}.",
  "\\input{}": "Inserts the contents of another .tex file inline at this point (no page break). e.g. \\input{sections/intro}",
  "\\include{}": "Like \\input but starts a new page and allows \\includeonly; best for chapters. e.g. \\include{chapter1}",

  // ── Page layout ──────────────────────────────────────────────────────
  "\\geometry{}": "Sets page margins and dimensions (needs the geometry package). e.g. \\geometry{margin=1in}",
  "\\newpage": "Ends the current page and starts a new one.",
  "\\clearpage": "Starts a new page and flushes all pending floats (figures/tables) first.",
  "\\pagestyle{}": "Sets the header/footer style for the whole document (plain, empty, headings…). e.g. \\pagestyle{plain}",
  "\\pagenumbering{}": "Chooses the page-number style (arabic, roman, alph…) and resets the counter. e.g. \\pagenumbering{roman}",
  "\\setlength{}{}": "Sets a length parameter to a value. e.g. \\setlength{\\parindent}{0pt}",

  // ── Sectioning ───────────────────────────────────────────────────────
  "\\section{}": "Starts a new numbered section titled by its argument; appears in the table of contents. e.g. \\section{Introduction}",
  "\\subsection{}": "A second-level heading under a section. e.g. \\subsection{Background}",
  "\\subsubsection{}": "A third-level heading under a subsection.",
  "\\chapter{}": "Top-level division (only in book/report classes); starts a new page. e.g. \\chapter{Preliminaries}",
  "\\paragraph{}": "A small run-in heading below subsubsection level.",
  "\\section*{}": "An unnumbered section that is not added to the table of contents. e.g. \\section*{Acknowledgements}",
  "\\tableofcontents": "Generates the table of contents from your sectioning commands. Requires a second compile to update.",
  "\\appendix": "Switches following \\section/\\chapter numbering to appendix style (A, B, C…).",

  // ── Title ────────────────────────────────────────────────────────────
  "\\title{}": "Declares the document title (used later by \\maketitle). e.g. \\title{My Paper}",
  "\\author{}": "Declares the author(s); separate several with \\and. e.g. \\author{Ada Lovelace}",
  "\\date{}": "Sets the title date; use \\today for the current date or {} for none. e.g. \\date{\\today}",
  "\\maketitle": "Typesets the title block from \\title, \\author and \\date. Place it just after \\begin{document}.",
  "\\today": "Prints the current date in the document's language. e.g. Compiled on \\today.",
  "\\thanks{}": "Adds a footnote to the title or author (e.g. funding/affiliation). Used inside \\title or \\author.",

  // ── Theorem & remarks ────────────────────────────────────────────────
  "\\begin{theorem}": "A theorem block (needs amsthm + a \\newtheorem{theorem}{Theorem} declaration). Numbered automatically.",
  "\\begin{lemma}": "A lemma block (amsthm). Declare it with \\newtheorem{lemma}{Lemma}.",
  "\\begin{corollary}": "A corollary block (amsthm). Declare with \\newtheorem{corollary}{Corollary}.",
  "\\begin{definition}": "A definition block (amsthm). Often declared with the 'definition' style for upright text.",
  "\\begin{remark}": "A remark block (amsthm); usually unnumbered or in the 'remark' style.",
  "\\begin{proof}": "A proof environment (amsthm) that ends with an automatic □ (QED) symbol.",
  "\\newtheorem{}{}": "Declares a new theorem-like environment in the preamble: the first arg is the environment name, the second its printed label. e.g. \\newtheorem{theorem}{Theorem}",
  "\\footnote{}": "Adds a numbered footnote at the bottom of the page. e.g. text\\footnote{a note here}.",
  "\\marginpar{}": "Places a note in the page margin. e.g. \\marginpar{see fig. 2}",

  // ── Alignment ────────────────────────────────────────────────────────
  "\\begin{center}": "Centers its contents horizontally and adds vertical space around the block.",
  "\\begin{flushleft}": "Left-aligns its contents with a ragged right edge.",
  "\\begin{flushright}": "Right-aligns its contents with a ragged left edge.",
  "\\centering": "Centers following content within the current box/column (no extra vertical space); use inside figures/tables.",
  "\\raggedright": "Switches to left alignment (ragged right) for the rest of the group.",
  "\\raggedleft": "Switches to right alignment (ragged left) for the rest of the group.",

  // ── Spacing ──────────────────────────────────────────────────────────
  "\\quad": "A medium horizontal space (1 em), common between math expressions. e.g. a \\quad b",
  "\\qquad": "A wide horizontal space (2 em).",
  "\\,": "A thin space (3/18 em); handy before differentials. e.g. \\int f\\,dx",
  "\\;": "A thick space, slightly wider than \\,.",
  "\\!": "A negative thin space that pulls symbols closer together.",
  "\\hspace{}": "Inserts horizontal space of a given length. e.g. \\hspace{1cm}",
  "\\vspace{}": "Inserts vertical space of a given length. e.g. \\vspace{12pt}",
  "\\\\": "Forces a line break (ends a line in a paragraph, table row, or aligned math).",
  "\\newline": "Breaks the line within a paragraph without starting a new paragraph.",
  "\\smallskip": "A small vertical gap between paragraphs.",
  "\\medskip": "A medium vertical gap between paragraphs.",
  "\\bigskip": "A large vertical gap between paragraphs.",
  "\\noindent": "Suppresses the indentation at the start of the following paragraph.",
  "\\hfill": "Stretchable horizontal space that pushes content apart. e.g. left\\hfill right",
  "\\vfill": "Stretchable vertical space that pushes content to the top and bottom of a page.",

  // ── Tables ───────────────────────────────────────────────────────────
  "\\begin{tabular}": "A table of aligned columns. The column spec (e.g. {l c r}) sets each column's alignment; separate cells with & and end rows with \\\\.",
  "\\begin{table}": "A floating container that lets a table drift to a good spot; holds \\centering, a tabular, \\caption and \\label. Placement e.g. [htbp].",
  "\\begin{array}": "Like tabular but for math mode (inside $…$ or an equation); used for matrices and case-like layouts.",
  "\\hline": "Draws a full horizontal rule between table rows.",
  "\\cline{}": "Draws a partial horizontal rule spanning the given columns. e.g. \\cline{2-3}",
  "\\multicolumn{}{}{}": "Merges columns in a table row: number of columns, alignment, then content. e.g. \\multicolumn{2}{c}{Header}",
  "\\caption{}": "Adds a numbered caption to a figure or table (place inside the float). e.g. \\caption{Results}",

  // ── Text style ───────────────────────────────────────────────────────
  "\\textbf{}": "Sets its argument in bold (text mode). e.g. \\textbf{important}",
  "\\textit{}": "Sets its argument in italics (text mode). e.g. \\textit{emphasis}",
  "\\emph{}": "Emphasizes text — italic normally, but toggles to upright inside already-italic text. Prefer over \\textit for emphasis.",
  "\\underline{}": "Underlines its argument. Works in text and math. e.g. \\underline{note}",
  "\\texttt{}": "Sets its argument in a monospaced (typewriter) font; good for code. e.g. \\texttt{main()}",
  "\\textsf{}": "Sets its argument in a sans-serif font.",
  "\\textsc{}": "Sets its argument in Small Caps. e.g. \\textsc{Acme}",
  "\\textrm{}": "Sets its argument in the upright roman font (useful inside math). e.g. $\\textrm{const}$",
  "\\text{}": "Inserts upright prose inside math mode (needs amsmath). e.g. $x>0 \\text{ for all } x$",

  // ── Font size ────────────────────────────────────────────────────────
  "\\tiny": "Switches to the smallest font size for the rest of the group. e.g. {\\tiny small print}",
  "\\scriptsize": "A very small font size (about footnote-minus).",
  "\\footnotesize": "The font size used for footnotes.",
  "\\small": "Slightly smaller than the body text.",
  "\\normalsize": "Resets to the document's normal body font size.",
  "\\large": "Slightly larger than body text.",
  "\\Large": "Larger than \\large.",
  "\\LARGE": "Larger than \\Large.",
  "\\huge": "Very large text.",
  "\\Huge": "The largest standard size. e.g. {\\Huge Title}",

  // ── References ───────────────────────────────────────────────────────
  "\\label{}": "Marks a section/figure/equation with a key so \\ref/\\eqref can point to it. e.g. \\label{eq:euler}",
  "\\ref{}": "Prints the number of whatever was \\label'd with this key. e.g. see Section~\\ref{sec:intro}",
  "\\eqref{}": "Prints an equation's number in parentheses (needs amsmath). e.g. by \\eqref{eq:euler}",
  "\\pageref{}": "Prints the page number where the matching \\label appears.",
  "\\cite{}": "Cites a bibliography entry by its key. e.g. \\cite{knuth1984}",
  "\\bibliography{}": "Includes a BibTeX .bib file's references (no extension). e.g. \\bibliography{refs}",

  // ── Index ────────────────────────────────────────────────────────────
  "\\index{}": "Marks a term for the index (needs makeidx + \\makeindex). e.g. \\index{matrix}",
  "\\makeindex": "Enables index collection; put it in the preamble (with makeidx). Pairs with \\printindex.",
  "\\printindex": "Prints the generated index, usually at the end of the document.",
};
