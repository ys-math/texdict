// Curated LaTeX best-practice tips, shown one at a time in the palette's
// Templates mode (💡 strip with a "next tip" button). Plain strings — rendered
// with textContent, so backslashes appear literally.
export const TIPS: string[] = [
  "Use \\( … \\) and \\[ … \\] for inline and display math instead of $ … $ and $$ … $$ — they are more robust and give clearer error messages.",
  "Tie references to their labels with a non-breaking space: Section~\\ref{sec:intro}, equation~\\eqref{eq:euler} — the line never breaks between them.",
  "Prefer \\emph{…} over \\textit{…} for emphasis: it switches back to upright type inside text that is already italic.",
  "A blank line starts a new paragraph; \\\\ only breaks the line. Don't end paragraphs with \\\\.",
  "Put a thin space before differentials: \\int f(x)\\,dx reads better than \\int f(x)dx.",
  "Compile twice after adding labels, citations, or sections — the first pass records them, the second resolves \\ref and the table of contents.",
  "Prefix labels by type — eq: sec: fig: tab: thm: — so \\ref{fig:plot} tells you what it points to.",
  "Use \\text{…} (amsmath) for words inside math: \\( x > 0 \\text{ for all } x \\) keeps the words upright and properly spaced.",
  "Inside a figure or table float use \\centering, not \\begin{center} — the center environment adds unwanted vertical space.",
  "The characters # $ % & _ { } are special. To print them, escape with a backslash: \\%, \\&, \\_ …",
  "Define multi-letter operators with \\DeclareMathOperator{\\rank}{rank} in the preamble — upright type and correct spacing, unlike writing rank in math italic.",
  "Use \\eqref{…} (amsmath) for equation references: it adds the parentheses for you and keeps the style consistent.",
  "\\clearpage also flushes pending figures and tables; \\newpage just starts a new page.",
  "Group font-size switches with braces — {\\Large title} — or the size change runs on to the end of the environment.",
  "Use ~ for a non-breaking space anywhere a line break would look wrong: Theorem~2, Dr.~Knuth.",
];
