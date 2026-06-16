// Help text for document commands, keyed by the entry's `command` string.
// Each entry: `what` explains the command (+ caveats); `example` is a short,
// realistic LaTeX usage snippet shown as a code block in the Document detail
// pane (src/panel.ts). Kept separate from dictionary.ts to keep that scannable.
export interface Description {
  what: string;
  example: string;
}

export const DESCRIPTIONS: Record<string, Description> = {
  // ── Preamble ────────────────────────────────────────────────────────
  "\\documentclass{}": { what: "The first line of every document; sets the overall layout (article, report, book, beamer…). Options like font size go in brackets.", example: "\\documentclass[12pt]{article}" },
  "\\usepackage{}": { what: "Loads a package that adds commands or features. Goes in the preamble (before \\begin{document}).", example: "\\usepackage{amsmath, amssymb}" },
  "\\usepackage[]{}": { what: "Loads a package with options in the brackets.", example: "\\usepackage[utf8]{inputenc}" },
  "\\begin{document}": { what: "Marks where the document body starts; everything before it is the preamble. Always paired with \\end{document}.", example: "\\documentclass{article}\n% preamble goes here\n\\begin{document}\nHello, world.\n\\end{document}" },
  "\\input{}": { what: "Inserts the contents of another .tex file inline at this point (no page break).", example: "\\input{sections/intro}" },
  "\\include{}": { what: "Like \\input but starts a new page and allows \\includeonly; best for chapters.", example: "\\include{chapter1}" },

  // ── Page layout ─────────────────────────────────────────────────────
  "\\geometry{}": { what: "Sets page margins and dimensions (needs the geometry package).", example: "\\usepackage{geometry}\n\\geometry{margin=1in}" },
  "\\newpage": { what: "Ends the current page and starts a new one.", example: "End of this page.\n\\newpage\nTop of the next page." },
  "\\clearpage": { what: "Starts a new page and flushes all pending floats (figures/tables) first.", example: "\\clearpage  % flush pending figures, then start a new page" },
  "\\pagestyle{}": { what: "Sets the header/footer style for the whole document (plain, empty, headings…).", example: "\\pagestyle{plain}  % page number centred in the footer" },
  "\\pagenumbering{}": { what: "Chooses the page-number style (arabic, roman, alph…) and resets the counter.", example: "\\frontmatter\n\\pagenumbering{roman}  % i, ii, iii, …" },
  "\\setlength{}{}": { what: "Sets a length parameter to a value.", example: "\\setlength{\\parindent}{0pt}\n\\setlength{\\parskip}{6pt}" },

  // ── Sectioning ──────────────────────────────────────────────────────
  "\\section{}": { what: "Starts a new numbered section titled by its argument; appears in the table of contents.", example: "\\section{Introduction}\nThe study of prime numbers \\dots" },
  "\\subsection{}": { what: "A second-level heading under a section.", example: "\\subsection{Background}" },
  "\\subsubsection{}": { what: "A third-level heading under a subsection.", example: "\\subsubsection{Notation}" },
  "\\chapter{}": { what: "Top-level division (only in book/report classes); starts a new page.", example: "\\chapter{Preliminaries}" },
  "\\paragraph{}": { what: "A small run-in heading below subsubsection level.", example: "\\paragraph{Remark.} The bound is sharp." },
  "\\section*{}": { what: "An unnumbered section that is not added to the table of contents.", example: "\\section*{Acknowledgements}\nThanks to \\dots" },
  "\\tableofcontents": { what: "Generates the table of contents from your sectioning commands. Requires a second compile to update.", example: "\\maketitle\n\\tableofcontents" },
  "\\appendix": { what: "Switches following \\section/\\chapter numbering to appendix style (A, B, C…).", example: "\\appendix\n\\section{Proof of the main lemma}" },

  // ── Title ───────────────────────────────────────────────────────────
  "\\title{}": { what: "Declares the document title (used later by \\maketitle).", example: "\\title{On the Distribution of Primes}" },
  "\\author{}": { what: "Declares the author(s); separate several with \\and.", example: "\\author{Ada Lovelace \\and Charles Babbage}" },
  "\\date{}": { what: "Sets the title date; use \\today for the current date or {} for none.", example: "\\date{\\today}" },
  "\\maketitle": { what: "Typesets the title block from \\title, \\author and \\date. Place it just after \\begin{document}.", example: "\\begin{document}\n\\maketitle" },
  "\\today": { what: "Prints the current date in the document's language.", example: "Compiled on \\today." },
  "\\thanks{}": { what: "Adds a footnote to the title or author (e.g. funding or affiliation). Used inside \\title or \\author.", example: "\\author{A. Author\\thanks{Supported by NSF grant 123.}}" },

  // ── Theorem & remarks ───────────────────────────────────────────────
  "\\begin{theorem}": { what: "A theorem block (needs amsthm + a \\newtheorem{theorem}{Theorem} declaration). Numbered automatically.", example: "\\begin{theorem}\\label{thm:main}\n    Every ideal is contained in a maximal ideal.\n\\end{theorem}" },
  "\\begin{lemma}": { what: "A lemma block (amsthm). Declare it with \\newtheorem{lemma}{Lemma}.", example: "\\begin{lemma}\n    If $p$ is prime and $p \\mid ab$, then $p \\mid a$ or $p \\mid b$.\n\\end{lemma}" },
  "\\begin{corollary}": { what: "A corollary block (amsthm). Declare with \\newtheorem{corollary}{Corollary}.", example: "\\begin{corollary}\n    There are infinitely many primes.\n\\end{corollary}" },
  "\\begin{definition}": { what: "A definition block (amsthm). Often declared with the 'definition' style for upright text.", example: "\\begin{definition}\n    A \\emph{group} is a set with an associative, invertible operation.\n\\end{definition}" },
  "\\begin{remark}": { what: "A remark block (amsthm); usually unnumbered or in the 'remark' style.", example: "\\begin{remark}\n    The converse fails when $X$ is non-compact.\n\\end{remark}" },
  "\\begin{proof}": { what: "A proof environment (amsthm) that ends with an automatic □ (QED) symbol.", example: "\\begin{proof}\n    Suppose not. Then \\dots, a contradiction.\n\\end{proof}" },
  "\\newtheorem{}{}": { what: "Declares a new theorem-like environment in the preamble: the first arg is the environment name, the second its printed label.", example: "\\newtheorem{theorem}{Theorem}[section]\n\\newtheorem{lemma}[theorem]{Lemma}" },
  "\\begin{prooftree}": { what: "The bussproofs environment that draws a proof tree (natural deduction or sequent calculus). Build it bottom-up: state each premise with \\AxiomC, then combine with a …InfC line.", example: "\\begin{prooftree}\n    \\AxiomC{$A$}\n    \\AxiomC{$A \\to B$}\n    \\RightLabel{$\\to$E}\n    \\BinaryInfC{$B$}\n\\end{prooftree}" },
  "\\AxiomC{}": { what: "A leaf of a proof tree (bussproofs): an axiom, hypothesis, or premise with no inference above it. Each pending premise must be stated before the inference that consumes it.", example: "\\begin{prooftree}\n    \\AxiomC{$\\Gamma \\vdash A$}\n    \\UnaryInfC{$\\Gamma \\vdash A \\lor B$}\n\\end{prooftree}" },
  "\\UnaryInfC{}": { what: "Draws an inference line under the single most recent \\AxiomC and prints the given conclusion below it (bussproofs).", example: "\\begin{prooftree}\n    \\AxiomC{$\\Gamma, A \\vdash B$}\n    \\RightLabel{$\\to$R}\n    \\UnaryInfC{$\\Gamma \\vdash A \\to B$}\n\\end{prooftree}" },
  "\\BinaryInfC{}": { what: "Draws an inference line under the two most recent \\AxiomC premises and prints the conclusion below them (bussproofs).", example: "\\begin{prooftree}\n    \\AxiomC{$A$}\n    \\AxiomC{$A \\to B$}\n    \\BinaryInfC{$B$}\n\\end{prooftree}" },
  "\\TrinaryInfC{}": { what: "Draws an inference line under the three most recent \\AxiomC premises and prints the conclusion below them (bussproofs).", example: "\\begin{prooftree}\n    \\AxiomC{$A$}\n    \\AxiomC{$B$}\n    \\AxiomC{$C$}\n    \\TrinaryInfC{$A \\land B \\land C$}\n\\end{prooftree}" },
  "\\RightLabel{}": { what: "Attaches a label (the rule's name) to the right of the next inference line in a proof tree (bussproofs). Place it just before the …InfC it annotates.", example: "\\AxiomC{$A$}\n\\AxiomC{$B$}\n\\RightLabel{$\\land$I}\n\\BinaryInfC{$A \\land B$}" },
  "\\LeftLabel{}": { what: "Attaches a label to the left of the next inference line in a proof tree (bussproofs). Place it just before the …InfC it annotates.", example: "\\AxiomC{$A \\land B$}\n\\LeftLabel{$\\land$E}\n\\UnaryInfC{$A$}" },
  "\\footnote{}": { what: "Adds a numbered footnote at the bottom of the page.", example: "This is well known\\footnote{See Hardy \\& Wright, Ch.~2.}." },
  "\\marginpar{}": { what: "Places a note in the page margin.", example: "The key step\\marginpar{see Fig.~2} follows." },

  // ── Alignment ───────────────────────────────────────────────────────
  "\\begin{center}": { what: "Centers its contents horizontally and adds vertical space around the block.", example: "\\begin{center}\n    A centred line of text.\n\\end{center}" },
  "\\begin{flushleft}": { what: "Left-aligns its contents with a ragged right edge.", example: "\\begin{flushleft}\n    Left-aligned, ragged right.\n\\end{flushleft}" },
  "\\begin{flushright}": { what: "Right-aligns its contents with a ragged left edge.", example: "\\begin{flushright}\n    Right-aligned, ragged left.\n\\end{flushright}" },
  "\\centering": { what: "Centers following content within the current box/column (no extra vertical space); use inside figures/tables.", example: "\\begin{figure}\n    \\centering\n    \\includegraphics{plot}\n\\end{figure}" },
  "\\raggedright": { what: "Switches to left alignment (ragged right) for the rest of the group.", example: "{\\raggedright This block is left-aligned, not justified.\\par}" },
  "\\raggedleft": { what: "Switches to right alignment (ragged left) for the rest of the group.", example: "{\\raggedleft This block is right-aligned.\\par}" },

  // ── Spacing ─────────────────────────────────────────────────────────
  "\\quad": { what: "A medium horizontal space (1 em), common between math expressions.", example: "$a \\equiv b \\quad (\\mathrm{mod}\\ n)$" },
  "\\qquad": { what: "A wide horizontal space (2 em).", example: "$f(x) = x^2 \\qquad x \\in \\mathbb{R}$" },
  "\\,": { what: "A thin space (3/18 em); handy before differentials.", example: "$\\int f(x)\\,dx$" },
  "\\;": { what: "A thick space, slightly wider than \\,.", example: "$\\{\\, x \\;:\\; x > 0 \\,\\}$" },
  "\\!": { what: "A negative thin space that pulls symbols closer together.", example: "$\\iint\\! f \\, dA$" },
  "\\hspace{}": { what: "Inserts horizontal space of a given length.", example: "a\\hspace{1cm}b" },
  "\\vspace{}": { what: "Inserts vertical space of a given length.", example: "First line.\\vspace{12pt}\n\nSecond line." },
  "\\\\": { what: "Forces a line break (ends a line in a paragraph, table row, or aligned math).", example: "First line \\\\\nSecond line" },
  "\\newline": { what: "Breaks the line within a paragraph without starting a new paragraph.", example: "Line one\\newline Line two" },
  "\\smallskip": { what: "A small vertical gap between paragraphs.", example: "Paragraph one.\n\\smallskip\nParagraph two." },
  "\\medskip": { what: "A medium vertical gap between paragraphs.", example: "Paragraph one.\n\\medskip\nParagraph two." },
  "\\bigskip": { what: "A large vertical gap between paragraphs.", example: "Paragraph one.\n\\bigskip\nParagraph two." },
  "\\noindent": { what: "Suppresses the indentation at the start of the following paragraph.", example: "\\noindent This paragraph is not indented." },
  "\\hfill": { what: "Stretchable horizontal space that pushes content apart.", example: "Left\\hfill Right" },
  "\\vfill": { what: "Stretchable vertical space that pushes content to the top and bottom of a page.", example: "Top of the page.\n\\vfill\nBottom of the page." },

  // ── Tables ──────────────────────────────────────────────────────────
  "\\begin{tabular}": { what: "A table of aligned columns. The column spec (e.g. {l c r}) sets each column's alignment; separate cells with & and end rows with \\\\.", example: "\\begin{tabular}{l c r}\n    \\hline\n    Name & Age & Score \\\\\n    \\hline\n    Ada & 28 & 95 \\\\\n\\end{tabular}" },
  "\\begin{table}": { what: "A floating container that lets a table drift to a good spot; holds \\centering, a tabular, \\caption and \\label.", example: "\\begin{table}[htbp]\n    \\centering\n    \\begin{tabular}{cc} a & b \\\\ c & d \\end{tabular}\n    \\caption{Results}\n    \\label{tab:results}\n\\end{table}" },
  "\\begin{array}": { what: "Like tabular but for math mode (inside $…$ or an equation); used for matrices and case-like layouts.", example: "\\left(\\begin{array}{cc}\n    a & b \\\\\n    c & d\n\\end{array}\\right)" },
  "\\hline": { what: "Draws a full horizontal rule between table rows.", example: "\\hline\nHeader \\\\\n\\hline" },
  "\\cline{}": { what: "Draws a partial horizontal rule spanning the given columns.", example: "a & b \\\\ \\cline{2-2}\nc & d \\\\" },
  "\\multicolumn{}{}{}": { what: "Merges columns in a table row: number of columns, alignment, then content.", example: "\\multicolumn{2}{c}{Summary} \\\\" },
  "\\caption{}": { what: "Adds a numbered caption to a figure or table (place inside the float).", example: "\\caption{Convergence of the iteration.}" },

  // ── Text style ──────────────────────────────────────────────────────
  "\\textbf{}": { what: "Sets its argument in bold (text mode).", example: "This is \\textbf{important}." },
  "\\textit{}": { what: "Sets its argument in italics (text mode).", example: "This is \\textit{emphasised}." },
  "\\emph{}": { what: "Emphasizes text — italic normally, but toggles to upright inside already-italic text. Prefer over \\textit for emphasis.", example: "A \\emph{key} idea." },
  "\\underline{}": { what: "Underlines its argument. Works in text and math.", example: "\\underline{Do not forget this.}" },
  "\\texttt{}": { what: "Sets its argument in a monospaced (typewriter) font; good for code.", example: "Run \\texttt{make all}." },
  "\\textsf{}": { what: "Sets its argument in a sans-serif font.", example: "\\textsf{Figure 1}" },
  "\\textsc{}": { what: "Sets its argument in Small Caps.", example: "\\textsc{Euclid} proved it." },
  "\\textrm{}": { what: "Sets its argument in the upright roman font (useful inside math).", example: "$v_{\\textrm{max}}$" },
  "\\text{}": { what: "Inserts upright prose inside math mode (needs amsmath).", example: "$x > 0 \\text{ for all } x \\in S$" },

  // ── Font size ───────────────────────────────────────────────────────
  "\\tiny": { what: "Switches to the smallest font size for the rest of the group.", example: "{\\tiny fine print}" },
  "\\scriptsize": { what: "A very small font size (about footnote-minus).", example: "{\\scriptsize a small note}" },
  "\\footnotesize": { what: "The font size used for footnotes.", example: "{\\footnotesize footnote-sized text}" },
  "\\small": { what: "Slightly smaller than the body text.", example: "{\\small slightly smaller}" },
  "\\normalsize": { what: "Resets to the document's normal body font size.", example: "{\\normalsize back to normal}" },
  "\\large": { what: "Slightly larger than body text.", example: "{\\large a bit larger}" },
  "\\Large": { what: "Larger than \\large.", example: "{\\Large larger still}" },
  "\\LARGE": { what: "Larger than \\Large.", example: "{\\LARGE quite large}" },
  "\\huge": { what: "Very large text.", example: "{\\huge very large}" },
  "\\Huge": { what: "The largest standard size.", example: "{\\Huge Title}" },

  // ── References ──────────────────────────────────────────────────────
  "\\label{}": { what: "Marks a section/figure/equation with a key so \\ref/\\eqref can point to it.", example: "\\section{Method}\\label{sec:method}" },
  "\\ref{}": { what: "Prints the number of whatever was \\label'd with this key.", example: "As shown in Section~\\ref{sec:method} \\dots" },
  "\\eqref{}": { what: "Prints an equation's number in parentheses (needs amsmath).", example: "By~\\eqref{eq:euler}, the sum converges." },
  "\\pageref{}": { what: "Prints the page number where the matching \\label appears.", example: "See the table on page~\\pageref{tab:data}." },
  "\\cite{}": { what: "Cites a bibliography entry by its key.", example: "The result is classical~\\cite{knuth1984}." },
  "\\bibliography{}": { what: "Includes a BibTeX .bib file's references (no extension).", example: "\\bibliographystyle{plain}\n\\bibliography{refs}" },

  // ── Index ───────────────────────────────────────────────────────────
  "\\index{}": { what: "Marks a term for the index (needs makeidx + \\makeindex).", example: "A matrix\\index{matrix} is a rectangular array." },
  "\\makeindex": { what: "Enables index collection; put it in the preamble (with makeidx). Pairs with \\printindex.", example: "\\usepackage{makeidx}\n\\makeindex" },
  "\\printindex": { what: "Prints the generated index, usually at the end of the document.", example: "\\printindex\n\\end{document}" },

  // ── Math display ────────────────────────────────────────────────────
  "\\begin{equation}": { what: "A single displayed, numbered equation. Don't put blank lines inside. Reference it with \\label + \\eqref.", example: "\\begin{equation}\\label{eq:euler}\n    e^{i\\pi} + 1 = 0\n\\end{equation}" },
  "\\begin{equation*}": { what: "A displayed equation without a number (needs amsmath). Prefer this over $$…$$.", example: "\\begin{equation*}\n    \\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}\n\\end{equation*}" },
  "\\begin{align}": { what: "Several equations aligned at the & marks (usually before =), each numbered; rows end with \\\\.", example: "\\begin{align}\n    (a+b)^2 &= a^2 + 2ab + b^2 \\\\\n           &= a^2 + b^2 + 2ab\n\\end{align}" },
  "\\begin{align*}": { what: "Like align but with no equation numbers — the everyday choice for multi-line derivations.", example: "\\begin{align*}\n    f(x) &= (x+1)^2 \\\\\n         &= x^2 + 2x + 1\n\\end{align*}" },
  "\\begin{gather}": { what: "Several displayed equations centered (not aligned), each numbered; rows end with \\\\.", example: "\\begin{gather}\n    a^2 + b^2 = c^2 \\\\\n    e^{i\\pi} = -1\n\\end{gather}" },
  "\\begin{multline}": { what: "One long equation broken across lines: first line left-aligned, last right-aligned, one number.", example: "\\begin{multline}\n    a + b + c + d \\\\\n    + e + f + g\n\\end{multline}" },
  "\\begin{split}": { what: "Splits one numbered equation across aligned lines; must sit inside equation (or similar). One number for the whole block.", example: "\\begin{equation}\n\\begin{split}\n    (a+b)^2 &= a^2 + 2ab + b^2 \\\\\n           &= c^2\n\\end{split}\n\\end{equation}" },
  "\\notag": { what: "Suppresses the number of the current line in align/equation.", example: "\\begin{align}\n    x &= y \\notag \\\\\n    y &= z\n\\end{align}" },
  "\\tag{}": { what: "Replaces the automatic equation number with your own symbol.", example: "\\begin{equation}\n    a^2 + b^2 = c^2 \\tag{$\\ast$}\n\\end{equation}" },

  // ── Lists ───────────────────────────────────────────────────────────
  "\\begin{itemize}": { what: "A bulleted (unordered) list; each entry starts with \\item. Nest up to four levels.", example: "\\begin{itemize}\n    \\item First point\n    \\item Second point\n\\end{itemize}" },
  "\\begin{enumerate}": { what: "A numbered (ordered) list; each entry starts with \\item. Use the enumitem package to customize numbering.", example: "\\begin{enumerate}\n    \\item First step\n    \\item Second step\n\\end{enumerate}" },
  "\\begin{description}": { what: "A list of term–definition pairs: \\item[term] description. Good for notation lists.", example: "\\begin{description}\n    \\item[Ring] a set with $+$ and $\\times$.\n    \\item[Field] a ring whose nonzero elements invert.\n\\end{description}" },
  "\\item": { what: "Starts one entry inside itemize/enumerate/description.", example: "\\begin{itemize}\n    \\item A single entry.\n\\end{itemize}" },
  "\\item[]": { what: "A list entry with a custom label instead of the bullet/number.", example: "\\begin{itemize}\n    \\item[(a)] first case\n    \\item[(b)] second case\n\\end{itemize}" },
  "\\begin{abstract}": { what: "The paper's abstract, placed after \\maketitle (article class). Typeset in a narrower block.", example: "\\begin{abstract}\n    We prove a sharper bound on \\dots\n\\end{abstract}" },
  "\\begin{quote}": { what: "An indented block for short quotations. Use quotation (with paragraph indents) for longer ones.", example: "\\begin{quote}\n    Mathematics is the queen of the sciences.\n\\end{quote}" },
  "\\begin{verbatim}": { what: "Prints its contents exactly as typed (monospace, no commands interpreted). For inline code use \\verb|…|.", example: "\\begin{verbatim}\nfor i in range(10):\n    print(i)\n\\end{verbatim}" },
  "\\begin{minipage}": { what: "A box of fixed width that behaves like a mini page — put two side by side for parallel content.", example: "\\begin{minipage}{0.45\\linewidth}\n    Left column.\n\\end{minipage}\\hfill\n\\begin{minipage}{0.45\\linewidth}\n    Right column.\n\\end{minipage}" },

  // ── Figures ─────────────────────────────────────────────────────────
  "\\includegraphics[]{}": { what: "Inserts an image file (PDF/PNG/JPG; needs graphicx). Set the size in the options.", example: "\\includegraphics[width=0.8\\textwidth]{plot}" },
  "\\begin{figure}": { what: "A floating container for images: \\centering + \\includegraphics + \\caption + \\label.", example: "\\begin{figure}[htbp]\n    \\centering\n    \\includegraphics[width=0.8\\textwidth]{plot}\n    \\caption{Energy vs.\\ time.}\n    \\label{fig:energy}\n\\end{figure}" },
  "\\graphicspath{}": { what: "Tells graphicx where to find images (note the double braces). Preamble.", example: "\\graphicspath{{figures/}{images/}}" },
  "\\begin{subfigure}": { what: "One sub-image (with its own caption) inside a figure; put two side by side for (a)/(b) panels. Needs subcaption.", example: "\\begin{figure}\n    \\begin{subfigure}{0.45\\textwidth}\n        \\includegraphics[width=\\linewidth]{a}\n        \\caption{First}\n    \\end{subfigure}\n    \\begin{subfigure}{0.45\\textwidth}\n        \\includegraphics[width=\\linewidth]{b}\n        \\caption{Second}\n    \\end{subfigure}\n\\end{figure}" },
  "\\begin{wrapfigure}": { what: "A figure that text wraps around: {r} or {l} side, then the width. Needs wrapfig; avoid near page breaks.", example: "\\begin{wrapfigure}{r}{0.4\\textwidth}\n    \\centering\n    \\includegraphics[width=0.38\\textwidth]{plot}\n    \\caption{Side figure.}\n\\end{wrapfigure}" },

  // ── Links, colors & boxes ───────────────────────────────────────────
  "\\url{}": { what: "Typesets a URL in monospace with sensible line breaks, clickable with hyperref.", example: "Available at \\url{https://arxiv.org}." },
  "\\href{}{}": { what: "A clickable link with display text (needs hyperref): first the URL, then the text.", example: "See \\href{https://arxiv.org}{the preprint}." },
  "\\textcolor{}{}": { what: "Colors its second argument (needs xcolor). Define colors with \\definecolor.", example: "\\textcolor{red}{This is important.}" },
  "\\colorbox{}{}": { what: "Puts its text on a colored background (needs xcolor).", example: "\\colorbox{yellow}{highlighted}" },
  "\\fbox{}": { what: "Draws a frame around its argument.", example: "\\fbox{boxed remark}" },
  "\\parbox{}{}": { what: "A box of fixed width whose contents wrap like a paragraph. For more control use minipage.", example: "\\parbox{5cm}{This text wraps inside a five-centimetre box.}" },
  "\\verb": { what: "Inline verbatim: \\verb|…| prints the text between the delimiters exactly as typed. The delimiter can be any character not in the text.", example: "Use \\verb|\\newpage| to break the page." },
};
