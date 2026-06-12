// The dictionary DATA — deliberately separate from the command LOGIC in
// extension.ts. To grow the dictionary, you only ever edit this file.

export interface Entry {
  command: string;     // what we insert, e.g. "\\int"; empty {} become snippet tab stops
  name: string;        // primary human name, e.g. "integral"
  tags: string[];      // domains/types it belongs to — MANY-to-many
  symbol?: string;     // unicode preview shown in the list, e.g. "∫"
  example?: string;    // LaTeX rendered as a PREVIEW instead of `command` (e.g. font samples)
  pkg?: string;        // required non-standard LaTeX package (beyond amsmath/amssymb)
  snippet?: string;    // custom insert template; tokens #1, #{1:default}, #0 (see extension.ts)
  keywords?: string[]; // extra free-text search terms
}

// "Categorize the categories": every tag belongs to exactly one FACET.
// A symbol's `tags` may draw from several facets at once (e.g. a "relation"
// from "set theory"). The filter UI groups tags under these facet headers,
// and `facetOf()` lets the code look up which facet a tag lives in.
export const FACETS: { name: string; tags: string[] }[] = [
  {
    name: "Subjects",
    tags: [
      "algebra", "analysis", "calculus", "category theory", "combinatorics",
      "complex", "geometry", "group theory", "linear algebra", "logic",
      "number theory", "order theory", "probability", "set theory", "topology",
    ],
  },
  {
    name: "Symbol types",
    tags: [
      "accent", "arrow", "big operator", "bracket", "font", "misc",
      "operation", "operator", "quantifier", "relation", "structure",
    ],
  },
  {
    name: "Character class",
    tags: [
      "blackboard", "bold", "calligraphic", "fraktur", "greek", "hebrew",
      "monospace", "roman", "sans-serif", "script",
    ],
  },
  {
    name: "Document",
    tags: [
      "preamble", "page layout", "sectioning", "title", "theorem", "math display",
      "alignment", "spacing", "list", "table", "figure", "text style",
      "font size", "link & color", "reference", "index",
    ],
  },
];

export function facetOf(tag: string): string | undefined {
  return FACETS.find((f) => f.tags.includes(tag))?.name;
}

export const DICTIONARY: Entry[] = [
  // ── Calculus & Analysis ──────────────────────────────────────────────
  { command: "\\int", name: "integral", tags: ["calculus", "analysis", "big operator"], symbol: "∫", keywords: ["integration"] },
  { command: "\\iint", name: "double integral", tags: ["calculus", "analysis", "big operator"], symbol: "∬" },
  { command: "\\oint", name: "contour integral", tags: ["calculus", "analysis", "complex", "big operator"], symbol: "∮", keywords: ["line integral"] },
  { command: "\\sum", name: "summation", tags: ["calculus", "analysis", "algebra", "big operator"], symbol: "∑", keywords: ["sigma series"] },
  { command: "\\prod", name: "product", tags: ["calculus", "algebra", "big operator"], symbol: "∏", keywords: ["pi"] },
  { command: "\\lim", name: "limit", tags: ["calculus", "analysis", "topology", "operator"], symbol: "lim" },
  { command: "\\partial", name: "partial derivative", tags: ["calculus", "analysis", "operator"], symbol: "∂" },
  { command: "\\nabla", name: "gradient / nabla", tags: ["calculus", "analysis", "operator"], symbol: "∇", keywords: ["del", "divergence", "curl"] },
  { command: "\\infty", name: "infinity", tags: ["calculus", "analysis", "set theory"], symbol: "∞" },

  // ── Set Theory & Logic ───────────────────────────────────────────────
  { command: "\\forall", name: "for all", tags: ["logic", "set theory", "quantifier"], symbol: "∀", keywords: ["universal quantifier"] },
  { command: "\\exists", name: "there exists", tags: ["logic", "set theory", "quantifier"], symbol: "∃", keywords: ["existential quantifier"] },
  { command: "\\in", name: "element of", tags: ["set theory", "logic", "relation"], symbol: "∈", keywords: ["membership belongs"] },
  { command: "\\notin", name: "not an element of", tags: ["set theory", "logic", "relation"], symbol: "∉" },
  { command: "\\subseteq", name: "subset or equal", tags: ["set theory", "topology", "relation"], symbol: "⊆", keywords: ["subset"] },
  { command: "\\cup", name: "union", tags: ["set theory", "topology", "operation"], symbol: "∪" },
  { command: "\\cap", name: "intersection", tags: ["set theory", "topology", "operation"], symbol: "∩" },
  { command: "\\emptyset", name: "empty set", tags: ["set theory", "topology"], symbol: "∅", keywords: ["null set"] },
  { command: "\\setminus", name: "set difference", tags: ["set theory", "operation"], symbol: "∖", keywords: ["minus complement"] },
  { command: "\\neg", name: "logical not", tags: ["logic", "operation"], symbol: "¬", keywords: ["negation"] },
  { command: "\\land", name: "logical and", tags: ["logic", "operation"], symbol: "∧", keywords: ["conjunction wedge"] },
  { command: "\\lor", name: "logical or", tags: ["logic", "operation"], symbol: "∨", keywords: ["disjunction vee"] },
  { command: "\\implies", name: "implies", tags: ["logic", "arrow"], symbol: "⟹", keywords: ["implication"] },
  { command: "\\iff", name: "if and only if", tags: ["logic", "arrow"], symbol: "⟺", keywords: ["biconditional equivalence"] },

  // ── Group Theory & Algebra ───────────────────────────────────────────
  { command: "\\otimes", name: "tensor product", tags: ["algebra", "linear algebra", "category theory", "operation"], symbol: "⊗" },
  { command: "\\oplus", name: "direct sum", tags: ["algebra", "linear algebra", "operation"], symbol: "⊕", keywords: ["xor"] },
  { command: "\\times", name: "direct / cartesian product", tags: ["set theory", "group theory", "linear algebra", "operation"], symbol: "×", keywords: ["multiply cross product"] },
  { command: "\\rtimes", name: "semidirect product", tags: ["group theory", "operation"], symbol: "⋊" },
  { command: "\\triangleleft", name: "normal subgroup", tags: ["group theory", "relation"], symbol: "◁", keywords: ["normal"] },
  { command: "\\langle \\rangle", name: "angle brackets / generated by", tags: ["group theory", "linear algebra", "bracket"], symbol: "⟨⟩", keywords: ["span generated subgroup inner product"] },
  { command: "\\cong", name: "isomorphic / congruent", tags: ["group theory", "topology", "category theory", "relation"], symbol: "≅", keywords: ["isomorphism"] },
  { command: "\\cdot", name: "group operation / dot", tags: ["group theory", "algebra", "operation"], symbol: "·", keywords: ["multiply product"] },

  // ── Number sets (blackboard bold) ────────────────────────────────────
  { command: "\\mathbb{R}", name: "real numbers", tags: ["analysis", "blackboard"], symbol: "ℝ", keywords: ["reals"] },
  { command: "\\mathbb{Z}", name: "integers", tags: ["number theory", "algebra", "blackboard"], symbol: "ℤ" },
  { command: "\\mathbb{N}", name: "natural numbers", tags: ["number theory", "blackboard"], symbol: "ℕ" },
  { command: "\\mathbb{Q}", name: "rationals", tags: ["number theory", "blackboard"], symbol: "ℚ" },
  { command: "\\mathbb{C}", name: "complex numbers", tags: ["complex", "analysis", "blackboard"], symbol: "ℂ" },

  // ── Relations & Arrows ───────────────────────────────────────────────
  { command: "\\equiv", name: "equivalent / congruent mod", tags: ["number theory", "logic", "relation"], symbol: "≡" },
  { command: "\\leq", name: "less than or equal", tags: ["analysis", "relation"], symbol: "≤" },
  { command: "\\geq", name: "greater than or equal", tags: ["analysis", "relation"], symbol: "≥" },
  { command: "\\neq", name: "not equal", tags: ["relation"], symbol: "≠" },
  { command: "\\approx", name: "approximately equal", tags: ["analysis", "relation"], symbol: "≈" },
  { command: "\\to", name: "maps to / arrow", tags: ["analysis", "category theory", "arrow"], symbol: "→", keywords: ["rightarrow function morphism"] },
  { command: "\\mapsto", name: "maps to (bar arrow)", tags: ["category theory", "arrow"], symbol: "↦" },
  { command: "\\hookrightarrow", name: "injection / hooked arrow", tags: ["category theory", "algebra", "arrow"], symbol: "↪", keywords: ["embedding inclusion injective"] },
  { command: "\\twoheadrightarrow", name: "surjection", tags: ["category theory", "algebra", "arrow"], symbol: "↠", keywords: ["onto surjective"] },

  // ── Greek Letters ────────────────────────────────────────────────────
  { command: "\\alpha", name: "alpha", tags: ["greek"], symbol: "α" },
  { command: "\\beta", name: "beta", tags: ["greek"], symbol: "β" },
  { command: "\\gamma", name: "gamma", tags: ["greek"], symbol: "γ" },
  { command: "\\delta", name: "delta", tags: ["greek"], symbol: "δ" },
  { command: "\\epsilon", name: "epsilon", tags: ["greek"], symbol: "ε" },
  { command: "\\theta", name: "theta", tags: ["greek"], symbol: "θ" },
  { command: "\\lambda", name: "lambda", tags: ["greek"], symbol: "λ" },
  { command: "\\mu", name: "mu", tags: ["greek"], symbol: "μ" },
  { command: "\\pi", name: "pi", tags: ["greek"], symbol: "π" },
  { command: "\\sigma", name: "sigma", tags: ["greek"], symbol: "σ" },
  { command: "\\phi", name: "phi", tags: ["greek"], symbol: "φ" },
  { command: "\\omega", name: "omega", tags: ["greek"], symbol: "ω" },

  // ── Structures ───────────────────────────────────────────────────────
  { command: "\\frac{}{}", name: "fraction", tags: ["structure"], symbol: "½", keywords: ["over divide"] },
  { command: "\\sqrt{}", name: "square root", tags: ["structure"], symbol: "√", keywords: ["radical"] },
  { command: "\\begin{pmatrix} \\end{pmatrix}", name: "matrix (parentheses)", tags: ["linear algebra", "structure"], symbol: "⎡⎤", example: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}", keywords: ["pmatrix"] },

  // ── Logic, Proof Theory & Modal ──────────────────────────────────────
  { command: "\\top", name: "top / true", tags: ["logic", "order theory"], symbol: "⊤", keywords: ["true", "verum", "tautology", "top element"] },
  { command: "\\bot", name: "bottom / false", tags: ["logic", "order theory"], symbol: "⊥", keywords: ["false", "falsum", "contradiction", "bottom element"] },
  { command: "\\vdash", name: "proves / turnstile", tags: ["logic", "relation"], symbol: "⊢", keywords: ["entails", "derives", "sequent", "syntactic"] },
  { command: "\\dashv", name: "left adjoint / reversed turnstile", tags: ["category theory", "logic", "relation"], symbol: "⊣", keywords: ["adjoint", "adjunction"] },
  { command: "\\models", name: "models / satisfies", tags: ["logic", "relation"], symbol: "⊨", keywords: ["semantic entailment", "double turnstile"] },
  { command: "\\nvdash", name: "does not prove", tags: ["logic", "relation"], symbol: "⊬", keywords: ["not derivable"] },
  { command: "\\nexists", name: "there does not exist", tags: ["logic", "quantifier"], symbol: "∄" },
  { command: "\\therefore", name: "therefore", tags: ["logic"], symbol: "∴" },
  { command: "\\because", name: "because", tags: ["logic"], symbol: "∵" },
  { command: "\\blacksquare", name: "qed", tags: ["logic"], symbol: "∎", keywords: ["tombstone", "end of proof"] },
  { command: "\\Box", name: "necessarily / box", tags: ["logic"], symbol: "□", keywords: ["necessity", "modal"] },
  { command: "\\Diamond", name: "possibly / diamond", tags: ["logic"], symbol: "◇", keywords: ["possibility", "modal"] },
  { command: "\\coloneqq", name: "is defined as", tags: ["logic", "relation"], symbol: "≔", pkg: "mathtools", keywords: ["definition", "assignment"] },
  { command: "\\triangleq", name: "defined as (triangle)", tags: ["relation"], symbol: "≜", keywords: ["defined to be"] },
  { command: "\\downarrow", name: "converges / defined", tags: ["logic", "arrow"], symbol: "↓", keywords: ["halts", "computability"] },
  { command: "\\uparrow", name: "diverges / undefined", tags: ["logic", "arrow"], symbol: "↑", keywords: ["does not halt", "computability"] },

  // ── Set Theory & Cardinals ───────────────────────────────────────────
  { command: "\\subset", name: "proper subset", tags: ["set theory", "relation"], symbol: "⊂" },
  { command: "\\supset", name: "proper superset", tags: ["set theory", "relation"], symbol: "⊃" },
  { command: "\\supseteq", name: "superset or equal", tags: ["set theory", "relation"], symbol: "⊇" },
  { command: "\\subsetneq", name: "proper subset (strict)", tags: ["set theory", "relation"], symbol: "⊊" },
  { command: "\\ni", name: "contains as element", tags: ["set theory", "relation"], symbol: "∋", keywords: ["owns", "such that"] },
  { command: "\\complement", name: "complement", tags: ["set theory"], symbol: "∁" },
  { command: "\\{ \\}", name: "set braces", tags: ["set theory", "bracket"], symbol: "{}", keywords: ["set builder", "curly braces"] },
  { command: "\\aleph", name: "aleph", tags: ["set theory", "hebrew"], symbol: "ℵ", keywords: ["cardinality", "cardinal", "aleph null"] },
  { command: "\\beth", name: "beth", tags: ["set theory", "hebrew"], symbol: "ℶ", keywords: ["beth number", "cardinal"] },
  { command: "\\gimel", name: "gimel", tags: ["set theory", "hebrew"], symbol: "ℷ", keywords: ["gimel function", "cardinal"] },
  { command: "\\daleth", name: "daleth", tags: ["set theory", "hebrew"], symbol: "ℸ", keywords: ["cardinal"] },
  { command: "\\nsubseteq", name: "not a subset", tags: ["set theory", "relation"], symbol: "⊈" },
  { command: "\\Subset", name: "compactly contained", tags: ["analysis", "topology", "relation"], symbol: "⋐", keywords: ["compactly embedded"] },
  { command: "\\Supset", name: "compactly contains", tags: ["analysis", "topology", "relation"], symbol: "⋑" },

  // ── Order & Lattice Theory ───────────────────────────────────────────
  { command: "\\preceq", name: "precedes or equal", tags: ["order theory", "relation"], symbol: "⪯", keywords: ["partial order"] },
  { command: "\\succeq", name: "succeeds or equal", tags: ["order theory", "relation"], symbol: "⪰" },
  { command: "\\prec", name: "precedes", tags: ["order theory", "relation"], symbol: "≺" },
  { command: "\\succ", name: "succeeds", tags: ["order theory", "relation"], symbol: "≻" },
  { command: "\\sqsubseteq", name: "square subset / sublattice", tags: ["order theory", "relation"], symbol: "⊑", keywords: ["refines", "contained"] },
  { command: "\\sqsupseteq", name: "square superset", tags: ["order theory", "relation"], symbol: "⊒" },
  { command: "\\sqsubset", name: "square subset", tags: ["order theory", "relation"], symbol: "⊏" },
  { command: "\\sqsupset", name: "square superset", tags: ["order theory", "relation"], symbol: "⊐" },
  { command: "\\sqcup", name: "join / disjoint union", tags: ["order theory", "set theory", "operation"], symbol: "⊔", keywords: ["supremum", "lattice"] },
  { command: "\\sqcap", name: "meet", tags: ["order theory", "operation"], symbol: "⊓", keywords: ["infimum", "lattice"] },
  { command: "\\vee", name: "join / vee", tags: ["order theory", "logic", "operation"], symbol: "∨", keywords: ["supremum", "disjunction"] },
  { command: "\\wedge", name: "wedge / exterior product / meet", tags: ["algebra", "order theory", "operation"], symbol: "∧", keywords: ["exterior product", "differential form", "infimum"] },
  { command: "\\lessdot", name: "less than, covered by", tags: ["order theory", "relation"], symbol: "⋖", keywords: ["covers", "covering relation"] },
  { command: "\\gtrdot", name: "greater than, covers", tags: ["order theory", "relation"], symbol: "⋗" },

  // ── Relations & Comparison ───────────────────────────────────────────
  { command: "\\sim", name: "similar / distributed as", tags: ["analysis", "geometry", "relation"], symbol: "∼", keywords: ["asymptotic", "tilde"] },
  { command: "\\simeq", name: "homotopy equivalent / asymptotically equal", tags: ["topology", "relation"], symbol: "≃" },
  { command: "\\propto", name: "proportional to", tags: ["analysis", "relation"], symbol: "∝", keywords: ["varies as"] },
  { command: "\\ll", name: "much less than", tags: ["analysis", "number theory", "relation"], symbol: "≪", keywords: ["dominated by"] },
  { command: "\\gg", name: "much greater than", tags: ["analysis", "number theory", "relation"], symbol: "≫" },
  { command: "\\perp", name: "perpendicular / orthogonal", tags: ["geometry", "linear algebra", "relation"], symbol: "⊥", keywords: ["orthogonal", "independent"] },
  { command: "\\parallel", name: "parallel", tags: ["geometry", "relation"], symbol: "∥" },
  { command: "\\mid", name: "divides / such that", tags: ["number theory", "set theory", "relation"], symbol: "∣", keywords: ["divides", "given", "conditional"] },
  { command: "\\nmid", name: "does not divide", tags: ["number theory", "relation"], symbol: "∤" },
  { command: "\\doteq", name: "approaches the limit", tags: ["relation"], symbol: "≐", keywords: ["defined as", "approaches"] },
  { command: "\\asymp", name: "asymptotically equal", tags: ["analysis", "number theory", "relation"], symbol: "≍", keywords: ["same order", "comparable"] },
  { command: "\\approxeq", name: "approximately equal (with line)", tags: ["analysis", "relation"], symbol: "≊" },
  { command: "\\ncong", name: "not isomorphic", tags: ["group theory", "topology", "relation"], symbol: "≇" },
  { command: "\\nleq", name: "not less than or equal", tags: ["analysis", "relation"], symbol: "≰" },
  { command: "\\ngeq", name: "not greater than or equal", tags: ["analysis", "relation"], symbol: "≱" },
  { command: "\\lesssim", name: "less than or asymptotically", tags: ["analysis", "number theory", "relation"], symbol: "≲", keywords: ["bounded above", "big-o"] },
  { command: "\\gtrsim", name: "greater than or asymptotically", tags: ["analysis", "number theory", "relation"], symbol: "≳", keywords: ["bounded below"] },
  { command: "\\bowtie", name: "bowtie / join", tags: ["relation"], symbol: "⋈", keywords: ["natural join", "relational"] },
  { command: "\\pitchfork", name: "transversal", tags: ["topology", "relation"], symbol: "⋔", keywords: ["transversality", "transverse"] },
  { command: "\\frown", name: "frown / arc", tags: ["geometry", "relation"], symbol: "⌢", keywords: ["arc"] },
  { command: "\\smile", name: "smile / cup product", tags: ["topology", "relation"], symbol: "⌣", keywords: ["cup product"] },
  { command: "\\trianglelefteq", name: "normal subgroup or equal", tags: ["group theory", "relation"], symbol: "⊴", keywords: ["normal", "ideal"] },
  { command: "\\trianglerighteq", name: "contains normal subgroup", tags: ["group theory", "relation"], symbol: "⊵" },

  // ── Operations ───────────────────────────────────────────────────────
  { command: "\\pm", name: "plus or minus", tags: ["operation"], symbol: "±" },
  { command: "\\mp", name: "minus or plus", tags: ["operation"], symbol: "∓" },
  { command: "\\div", name: "division", tags: ["operation"], symbol: "÷", keywords: ["divide"] },
  { command: "\\ast", name: "convolution / star", tags: ["analysis", "operation"], symbol: "∗", keywords: ["convolution"] },
  { command: "\\star", name: "hodge star / star", tags: ["geometry", "operation"], symbol: "⋆", keywords: ["hodge star", "convolution"] },
  { command: "\\circ", name: "composition", tags: ["category theory", "algebra", "operation"], symbol: "∘", keywords: ["compose", "function composition"] },
  { command: "\\odot", name: "circled dot / hadamard product", tags: ["operation"], symbol: "⊙", keywords: ["tropical product", "elementwise"] },
  { command: "\\dagger", name: "adjoint / dagger", tags: ["analysis", "operation"], symbol: "†", keywords: ["hermitian conjugate", "conjugate transpose"] },
  { command: "\\uplus", name: "multiset / disjoint union", tags: ["combinatorics", "operation"], symbol: "⊎", keywords: ["multiset"] },
  { command: "\\ltimes", name: "left semidirect product", tags: ["group theory", "operation"], symbol: "⋉" },
  { command: "\\wr", name: "wreath product", tags: ["group theory", "operation"], symbol: "≀" },
  { command: "\\#", name: "connected sum", tags: ["topology", "operation"], symbol: "#", keywords: ["number", "cardinality"] },
  { command: "\\boxplus", name: "boxed plus", tags: ["algebra", "operation"], symbol: "⊞", keywords: ["whitney sum"] },
  { command: "\\boxminus", name: "boxed minus", tags: ["algebra", "operation"], symbol: "⊟" },
  { command: "\\boxtimes", name: "boxed times / external tensor", tags: ["algebra", "operation"], symbol: "⊠", keywords: ["external tensor product"] },
  { command: "\\boxdot", name: "boxed dot", tags: ["operation"], symbol: "⊡" },
  { command: "\\ominus", name: "circled minus", tags: ["algebra", "operation"], symbol: "⊖", keywords: ["symmetric difference"] },
  { command: "\\oslash", name: "circled slash", tags: ["operation"], symbol: "⊘" },
  { command: "\\amalg", name: "amalgamation / coproduct", tags: ["category theory", "algebra", "operation"], symbol: "⨿", keywords: ["free product", "disjoint union"] },
  { command: "\\dotplus", name: "dot plus", tags: ["operation"], symbol: "∔", keywords: ["disjoint sum"] },
  { command: "\\intercal", name: "transpose / intercal", tags: ["linear algebra", "operation"], symbol: "⊺", keywords: ["transpose"] },
  { command: "\\veebar", name: "exclusive or", tags: ["logic", "operation"], symbol: "⊻", keywords: ["xor"] },
  { command: "\\barwedge", name: "nand", tags: ["logic", "operation"], symbol: "⊼", keywords: ["not and"] },
  { command: "\\bullet", name: "bullet", tags: ["operation"], symbol: "•", keywords: ["dot", "filtered"] },
  { command: "\\diamond", name: "diamond operator", tags: ["operation"], symbol: "⋄" },

  // ── Linear Logic & Type Theory ───────────────────────────────────────
  { command: "\\Vdash", name: "forces", tags: ["logic", "set theory", "relation"], symbol: "⊩", keywords: ["forcing", "strong turnstile"] },
  { command: "\\nvDash", name: "does not satisfy", tags: ["logic", "relation"], symbol: "⊭", keywords: ["not model", "countermodel"] },
  { command: "\\multimap", name: "linear implication / lollipop", tags: ["logic", "category theory", "arrow"], symbol: "⊸", keywords: ["lollipop", "linear logic", "left adjoint"] },
  { command: "\\parr", name: "par", tags: ["logic", "operation"], symbol: "⅋", pkg: "stmaryrd", keywords: ["multiplicative disjunction", "linear logic"] },
  { command: "\\lightning", name: "contradiction", tags: ["logic"], symbol: "↯", pkg: "stmaryrd", keywords: ["absurdity", "falsum", "bottom"] },
  { command: "\\llbracket \\rrbracket", name: "semantic brackets", tags: ["logic", "bracket"], symbol: "⟦⟧", pkg: "stmaryrd", keywords: ["denotation", "oxford brackets", "interpretation", "list"] },

  // ── Big Operators ────────────────────────────────────────────────────
  { command: "\\bigcup", name: "n-ary union", tags: ["set theory", "big operator"], symbol: "⋃" },
  { command: "\\bigcap", name: "n-ary intersection", tags: ["set theory", "big operator"], symbol: "⋂" },
  { command: "\\bigoplus", name: "n-ary direct sum", tags: ["algebra", "linear algebra", "big operator"], symbol: "⨁" },
  { command: "\\bigotimes", name: "n-ary tensor product", tags: ["algebra", "big operator"], symbol: "⨂" },
  { command: "\\bigsqcup", name: "n-ary coproduct / join", tags: ["category theory", "order theory", "big operator"], symbol: "⨆", keywords: ["disjoint union", "supremum"] },
  { command: "\\bigwedge", name: "n-ary conjunction / exterior power", tags: ["logic", "algebra", "big operator"], symbol: "⋀", keywords: ["meet"] },
  { command: "\\bigvee", name: "n-ary disjunction / join", tags: ["logic", "order theory", "big operator"], symbol: "⋁", keywords: ["supremum"] },
  { command: "\\coprod", name: "coproduct", tags: ["category theory", "big operator"], symbol: "∐", keywords: ["disjoint union"] },
  { command: "\\iiint", name: "triple integral", tags: ["calculus", "analysis", "big operator"], symbol: "∭" },
  { command: "\\oiint", name: "surface integral", tags: ["calculus", "analysis", "big operator"], symbol: "∯", keywords: ["closed surface", "flux"] },
  { command: "\\biguplus", name: "n-ary multiset union", tags: ["combinatorics", "big operator"], symbol: "⨄", keywords: ["disjoint union"] },
  { command: "\\bigodot", name: "n-ary circled dot", tags: ["algebra", "big operator"], symbol: "⨀" },

  // ── Arrows & Category Theory ─────────────────────────────────────────
  { command: "\\Rightarrow", name: "implies / natural transformation", tags: ["logic", "category theory", "arrow"], symbol: "⇒", keywords: ["double arrow"] },
  { command: "\\Leftrightarrow", name: "iff (double arrow)", tags: ["logic", "arrow"], symbol: "⇔", keywords: ["equivalent", "biconditional"] },
  { command: "\\rightarrowtail", name: "monomorphism", tags: ["category theory", "arrow"], symbol: "↣", keywords: ["mono", "injection"] },
  { command: "\\rightharpoonup", name: "weak convergence", tags: ["analysis", "arrow"], symbol: "⇀", keywords: ["harpoon"] },
  { command: "\\leadsto", name: "leads to / reduces", tags: ["logic", "arrow"], symbol: "⇝", keywords: ["rewrites"] },
  { command: "\\leftarrow", name: "left arrow", tags: ["arrow"], symbol: "←", keywords: ["gets", "assignment"] },
  { command: "\\leftrightarrow", name: "left-right arrow", tags: ["arrow"], symbol: "↔", keywords: ["iff", "bijection"] },
  { command: "\\longrightarrow", name: "long right arrow", tags: ["category theory", "arrow"], symbol: "⟶", keywords: ["morphism", "map"] },
  { command: "\\longmapsto", name: "long maps to", tags: ["category theory", "arrow"], symbol: "⟼" },
  { command: "\\Leftarrow", name: "is implied by", tags: ["logic", "arrow"], symbol: "⇐", keywords: ["only if"] },
  { command: "\\hookleftarrow", name: "left hooked arrow", tags: ["category theory", "arrow"], symbol: "↩" },
  { command: "\\rightleftharpoons", name: "equilibrium / adjunction", tags: ["analysis", "category theory", "arrow"], symbol: "⇌", keywords: ["reversible", "harpoons"] },
  { command: "\\rightrightarrows", name: "parallel arrows", tags: ["category theory", "arrow"], symbol: "⇉", keywords: ["parallel morphisms", "fork"] },
  { command: "\\nrightarrow", name: "does not map to", tags: ["arrow"], symbol: "↛", keywords: ["not implies"] },
  { command: "\\curvearrowright", name: "group action", tags: ["group theory", "arrow"], symbol: "↷", keywords: ["acts on"] },
  { command: "\\xrightarrow{}", name: "labeled arrow", tags: ["category theory", "arrow", "structure"], symbol: "→", keywords: ["annotated", "map with label"] },

  // ── Number sets & blackboard bold ────────────────────────────────────
  { command: "\\mathbb{H}", name: "quaternions", tags: ["algebra", "blackboard"], symbol: "ℍ", keywords: ["upper half plane"] },
  { command: "\\mathbb{F}", name: "finite field", tags: ["algebra", "blackboard"], symbol: "𝔽", keywords: ["galois field"] },
  { command: "\\mathbb{K}", name: "field", tags: ["algebra", "blackboard"], symbol: "𝕂", keywords: ["ground field"] },
  { command: "\\mathbb{A}", name: "affine space / adeles", tags: ["geometry", "blackboard"], symbol: "𝔸" },
  { command: "\\mathbb{P}", name: "probability / projective space", tags: ["probability", "blackboard"], symbol: "ℙ", keywords: ["primes"] },
  { command: "\\mathbb{E}", name: "expectation", tags: ["probability", "blackboard"], symbol: "𝔼", keywords: ["expected value", "mean"] },
  { command: "\\mathbb{S}", name: "sphere / circle group", tags: ["topology", "blackboard"], symbol: "𝕊", keywords: ["sphere", "n-sphere"] },
  { command: "\\mathbb{T}", name: "torus / circle group", tags: ["topology", "blackboard"], symbol: "𝕋", keywords: ["torus", "circle group"] },
  { command: "\\mathbb{D}", name: "unit disk", tags: ["complex", "blackboard"], symbol: "𝔻", keywords: ["disk", "domain"] },
  { command: "\\mathbb{O}", name: "octonions", tags: ["algebra", "blackboard"], symbol: "𝕆" },

  // ── Complex & Functional Analysis ────────────────────────────────────
  { command: "\\Re", name: "real part", tags: ["complex", "analysis"], symbol: "ℜ", keywords: ["real"] },
  { command: "\\Im", name: "imaginary part", tags: ["complex", "analysis"], symbol: "ℑ", keywords: ["imaginary"] },
  { command: "\\wp", name: "weierstrass p", tags: ["complex", "analysis"], symbol: "℘", keywords: ["elliptic function", "power set"] },
  { command: "\\ell", name: "script l", tags: ["analysis"], symbol: "ℓ", keywords: ["length", "lp space", "sequence space"] },
  { command: "\\hbar", name: "reduced planck constant", tags: ["analysis"], symbol: "ℏ", keywords: ["h-bar", "planck"] },

  // ── Probability ──────────────────────────────────────────────────────
  { command: "\\perp\\!\\!\\!\\perp", name: "independent", tags: ["probability", "relation"], symbol: "⫫", keywords: ["statistical independence"] },
  { command: "\\mathcal{N}", name: "normal distribution", tags: ["probability", "calligraphic"], symbol: "𝒩", keywords: ["gaussian", "distribution"] },

  // ── Geometry ─────────────────────────────────────────────────────────
  { command: "\\angle", name: "angle", tags: ["geometry"], symbol: "∠" },
  { command: "\\measuredangle", name: "measured angle", tags: ["geometry"], symbol: "∡" },
  { command: "\\triangle", name: "triangle", tags: ["geometry"], symbol: "△" },
  { command: "\\flat", name: "flat / musical isomorphism", tags: ["geometry"], symbol: "♭", keywords: ["lower index"] },
  { command: "\\sharp", name: "sharp / musical isomorphism", tags: ["geometry"], symbol: "♯", keywords: ["raise index"] },

  // ── Brackets & Delimiters ────────────────────────────────────────────
  { command: "\\lvert \\rvert", name: "absolute value", tags: ["analysis", "bracket"], symbol: "|", keywords: ["modulus", "magnitude"] },
  { command: "\\lfloor \\rfloor", name: "floor", tags: ["bracket"], symbol: "⌊⌋", keywords: ["round down", "greatest integer"] },
  { command: "\\lceil \\rceil", name: "ceiling", tags: ["bracket"], symbol: "⌈⌉", keywords: ["round up"] },
  { command: "\\|", name: "norm", tags: ["analysis", "bracket"], symbol: "‖", keywords: ["magnitude", "length"] },

  // ── Structures ───────────────────────────────────────────────────────
  { command: "\\binom{}{}", name: "binomial coefficient", tags: ["combinatorics", "structure"], keywords: ["choose", "combination", "n choose k"] },
  { command: "\\begin{bmatrix} \\end{bmatrix}", name: "matrix (brackets)", tags: ["linear algebra", "structure"], symbol: "⎡⎤", example: "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}", keywords: ["bmatrix"] },
  { command: "\\begin{cases} \\end{cases}", name: "cases / piecewise", tags: ["structure"], symbol: "{", example: "f(x)=\\begin{cases} a & x>0 \\\\ b & x\\le 0 \\end{cases}", keywords: ["piecewise"] },
  { command: "\\cdots", name: "centered ellipsis", tags: ["structure"], symbol: "⋯", keywords: ["dots", "ellipsis"] },
  { command: "\\vdots", name: "vertical ellipsis", tags: ["structure"], symbol: "⋮", keywords: ["dots"] },
  { command: "\\ddots", name: "diagonal ellipsis", tags: ["structure"], symbol: "⋱", keywords: ["dots"] },
  { command: "\\ldots", name: "baseline ellipsis", tags: ["structure"], symbol: "…", keywords: ["dots"] },
  { command: "\\prime", name: "prime", tags: ["structure"], symbol: "′", keywords: ["derivative", "transpose", "minutes"] },
  { command: "\\overbrace{}", name: "overbrace", tags: ["structure"], symbol: "⏞", keywords: ["grouping"] },
  { command: "\\underbrace{}", name: "underbrace", tags: ["structure"], symbol: "⏟", keywords: ["grouping"] },

  // ── Accents ──────────────────────────────────────────────────────────
  { command: "\\hat{}", name: "hat", tags: ["accent", "structure"], keywords: ["unit vector", "estimator"] },
  { command: "\\vec{}", name: "vector", tags: ["accent", "structure"], keywords: ["arrow"] },
  { command: "\\bar{}", name: "bar", tags: ["accent", "structure"], keywords: ["mean", "average", "conjugate", "closure"] },
  { command: "\\overline{}", name: "overline", tags: ["accent", "structure"], keywords: ["closure", "complex conjugate", "mean"] },
  { command: "\\tilde{}", name: "tilde", tags: ["accent", "structure"], keywords: ["twiddle"] },
  { command: "\\dot{}", name: "dot", tags: ["accent", "structure"], keywords: ["time derivative"] },
  { command: "\\widehat{}", name: "wide hat", tags: ["accent", "structure"], keywords: ["estimator", "fourier transform"] },
  { command: "\\widetilde{}", name: "wide tilde", tags: ["accent", "structure"], keywords: ["universal cover", "lift"] },
  { command: "\\overrightarrow{}", name: "right arrow accent", tags: ["accent", "structure"], symbol: "→", keywords: ["vector", "displacement"] },
  { command: "\\check{}", name: "check / caron", tags: ["accent", "structure"], keywords: ["hacek", "cech"] },
  { command: "\\breve{}", name: "breve", tags: ["accent", "structure"] },
  { command: "\\mathring{}", name: "ring accent", tags: ["accent", "structure"], keywords: ["angstrom", "interior"] },

  // ── Greek Letters (lowercase) ────────────────────────────────────────
  { command: "\\zeta", name: "zeta", tags: ["greek"], symbol: "ζ", keywords: ["zeta function"] },
  { command: "\\eta", name: "eta", tags: ["greek"], symbol: "η" },
  { command: "\\iota", name: "iota", tags: ["greek"], symbol: "ι" },
  { command: "\\kappa", name: "kappa", tags: ["greek"], symbol: "κ" },
  { command: "\\nu", name: "nu", tags: ["greek"], symbol: "ν" },
  { command: "\\xi", name: "xi", tags: ["greek"], symbol: "ξ" },
  { command: "\\rho", name: "rho", tags: ["greek"], symbol: "ρ" },
  { command: "\\tau", name: "tau", tags: ["greek"], symbol: "τ" },
  { command: "\\upsilon", name: "upsilon", tags: ["greek"], symbol: "υ" },
  { command: "\\chi", name: "chi", tags: ["greek"], symbol: "χ", keywords: ["characteristic"] },
  { command: "\\psi", name: "psi", tags: ["greek"], symbol: "ψ" },
  { command: "\\varepsilon", name: "varepsilon", tags: ["greek"], symbol: "ε", keywords: ["epsilon"] },
  { command: "\\varphi", name: "varphi", tags: ["greek"], symbol: "ϕ", keywords: ["phi", "golden ratio"] },
  { command: "\\vartheta", name: "vartheta", tags: ["greek"], symbol: "ϑ", keywords: ["theta"] },
  { command: "\\varpi", name: "varpi", tags: ["greek"], symbol: "ϖ", keywords: ["pi"] },
  { command: "\\varrho", name: "varrho", tags: ["greek"], symbol: "ϱ", keywords: ["rho"] },
  { command: "\\varsigma", name: "varsigma / final sigma", tags: ["greek"], symbol: "ς", keywords: ["sigma"] },
  { command: "\\varkappa", name: "varkappa", tags: ["greek"], symbol: "ϰ", keywords: ["kappa"] },
  { command: "\\digamma", name: "digamma", tags: ["greek"], symbol: "ϝ" },

  // ── Greek Letters (uppercase) ────────────────────────────────────────
  { command: "\\Gamma", name: "capital gamma", tags: ["greek"], symbol: "Γ", keywords: ["gamma function"] },
  { command: "\\Delta", name: "capital delta", tags: ["greek"], symbol: "Δ", keywords: ["laplacian", "difference", "discriminant", "change"] },
  { command: "\\Theta", name: "capital theta", tags: ["greek"], symbol: "Θ", keywords: ["big theta", "asymptotic"] },
  { command: "\\Lambda", name: "capital lambda", tags: ["greek"], symbol: "Λ", keywords: ["exterior algebra", "cosmological constant"] },
  { command: "\\Xi", name: "capital xi", tags: ["greek"], symbol: "Ξ" },
  { command: "\\Pi", name: "capital pi", tags: ["greek"], symbol: "Π", keywords: ["dependent product", "product type"] },
  { command: "\\Sigma", name: "capital sigma", tags: ["greek"], symbol: "Σ", keywords: ["dependent sum", "sum type", "covariance"] },
  { command: "\\Phi", name: "capital phi", tags: ["greek"], symbol: "Φ", keywords: ["cdf", "golden ratio"] },
  { command: "\\Psi", name: "capital psi", tags: ["greek"], symbol: "Ψ", keywords: ["wave function"] },
  { command: "\\Omega", name: "capital omega", tags: ["greek"], symbol: "Ω", keywords: ["sample space", "big omega"] },

  // ── Script & Fraktur ─────────────────────────────────────────────────
  { command: "\\mathcal{O}", name: "calligraphic o / big-o", tags: ["analysis", "calligraphic"], symbol: "𝒪", keywords: ["landau", "order of growth", "structure sheaf"] },
  { command: "\\mathcal{P}", name: "power set", tags: ["set theory", "calligraphic"], symbol: "𝒫", keywords: ["powerset"] },
  { command: "\\mathcal{F}", name: "calligraphic f / sigma-algebra", tags: ["probability", "calligraphic"], symbol: "ℱ", keywords: ["filtration", "sheaf", "family"] },
  { command: "\\mathfrak{p}", name: "prime ideal", tags: ["algebra", "fraktur"], symbol: "𝔭" },
  { command: "\\mathfrak{m}", name: "maximal ideal", tags: ["algebra", "fraktur"], symbol: "𝔪" },
  { command: "\\mathfrak{g}", name: "lie algebra", tags: ["algebra", "fraktur"], symbol: "𝔤" },

  // ── Math Fonts ───────────────────────────────────────────────────────
  // One compact entry per font (instead of 26 letters each). The preview
  // renders an ABC sample; inserting drops the cursor inside the braces (via a
  // snippet), so you type your own letters.
  { command: "\\mathbb{}", name: "blackboard bold (font)", tags: ["blackboard", "font"], symbol: "𝔸𝔹ℂ", example: "\\mathbb{ABC}", pkg: "amssymb", keywords: ["double struck", "alphabet", "letters"] },
  { command: "\\mathfrak{}", name: "fraktur (font)", tags: ["fraktur", "font"], symbol: "𝔄𝔅ℭ", example: "\\mathfrak{ABC}", pkg: "amssymb", keywords: ["gothic", "alphabet", "letters"] },
  { command: "\\mathcal{}", name: "calligraphic (font)", tags: ["calligraphic", "font"], symbol: "𝒜ℬ𝒞", example: "\\mathcal{ABC}", keywords: ["script", "alphabet", "letters"] },
  { command: "\\mathscr{}", name: "script (font)", tags: ["script", "font"], symbol: "𝒜ℬ𝒞", example: "\\mathscr{ABC}", pkg: "mathrsfs", keywords: ["alphabet", "letters"] },
  { command: "\\mathbf{}", name: "bold (font)", tags: ["bold", "font"], symbol: "𝐀𝐁𝐂", example: "\\mathbf{ABC}", keywords: ["boldface", "vector", "alphabet"] },
  { command: "\\mathrm{}", name: "roman / upright (font)", tags: ["roman", "font"], symbol: "ABC", example: "\\mathrm{ABC}", keywords: ["upright", "text", "alphabet"] },
  { command: "\\mathsf{}", name: "sans-serif (font)", tags: ["sans-serif", "font"], symbol: "𝖠𝖡𝖢", example: "\\mathsf{ABC}", keywords: ["category", "alphabet"] },
  { command: "\\mathtt{}", name: "monospace (font)", tags: ["monospace", "font"], symbol: "𝙰𝙱𝙲", example: "\\mathtt{ABC}", keywords: ["typewriter", "code", "alphabet"] },

  // ── Arrows (more variants) ───────────────────────────────────────────
  { command: "\\longleftarrow", name: "long left arrow", tags: ["arrow"], symbol: "⟵" },
  { command: "\\longleftrightarrow", name: "long left-right arrow", tags: ["arrow"], symbol: "⟷" },
  { command: "\\Longrightarrow", name: "long double right arrow", tags: ["arrow", "logic"], symbol: "⟹", keywords: ["implies long"] },
  { command: "\\Longleftarrow", name: "long double left arrow", tags: ["arrow", "logic"], symbol: "⟸" },
  { command: "\\Longleftrightarrow", name: "long double left-right arrow", tags: ["arrow", "logic"], symbol: "⟺", keywords: ["iff long"] },
  { command: "\\Uparrow", name: "double up arrow", tags: ["arrow"], symbol: "⇑" },
  { command: "\\Downarrow", name: "double down arrow", tags: ["arrow"], symbol: "⇓" },
  { command: "\\updownarrow", name: "up-down arrow", tags: ["arrow"], symbol: "↕" },
  { command: "\\Updownarrow", name: "double up-down arrow", tags: ["arrow"], symbol: "⇕" },
  { command: "\\nearrow", name: "northeast arrow", tags: ["arrow", "analysis"], symbol: "↗", keywords: ["increases to", "monotone up"] },
  { command: "\\searrow", name: "southeast arrow", tags: ["arrow", "analysis"], symbol: "↘", keywords: ["decreases to", "monotone down"] },
  { command: "\\swarrow", name: "southwest arrow", tags: ["arrow"], symbol: "↙" },
  { command: "\\nwarrow", name: "northwest arrow", tags: ["arrow"], symbol: "↖" },
  { command: "\\rightsquigarrow", name: "squiggly right arrow", tags: ["arrow"], symbol: "⇝", keywords: ["leads to", "homotopy"] },
  { command: "\\leftrightsquigarrow", name: "squiggly left-right arrow", tags: ["arrow"], symbol: "↭" },
  { command: "\\dashrightarrow", name: "dashed right arrow", tags: ["arrow", "category theory"], symbol: "⇢", keywords: ["rational map", "partial"] },
  { command: "\\circlearrowleft", name: "circle arrow left", tags: ["arrow"], symbol: "↺", keywords: ["counterclockwise", "loop"] },
  { command: "\\circlearrowright", name: "circle arrow right", tags: ["arrow"], symbol: "↻", keywords: ["clockwise", "loop"] },
  { command: "\\curvearrowleft", name: "curved left arrow", tags: ["arrow"], symbol: "↶" },
  { command: "\\twoheadleftarrow", name: "two-headed left arrow", tags: ["arrow"], symbol: "↞" },
  { command: "\\nleftarrow", name: "negated left arrow", tags: ["arrow"], symbol: "↚" },
  { command: "\\nLeftarrow", name: "negated double left arrow", tags: ["arrow", "logic"], symbol: "⇍" },
  { command: "\\nRightarrow", name: "negated double right arrow", tags: ["arrow", "logic"], symbol: "⇏", keywords: ["does not imply"] },
  { command: "\\nleftrightarrow", name: "negated left-right arrow", tags: ["arrow"], symbol: "↮" },
  { command: "\\nLeftrightarrow", name: "negated double left-right arrow", tags: ["arrow", "logic"], symbol: "⇎", keywords: ["not equivalent"] },
  { command: "\\leftharpoonup", name: "left harpoon up", tags: ["arrow"], symbol: "↼" },
  { command: "\\rightharpoondown", name: "right harpoon down", tags: ["arrow"], symbol: "⇁" },
  { command: "\\leftrightarrows", name: "left over right arrows", tags: ["arrow"], symbol: "⇆", keywords: ["adjoint pair"] },
  { command: "\\upharpoonright", name: "restriction", tags: ["arrow", "set theory", "logic"], symbol: "↾", keywords: ["restrict", "function restriction"] },
  { command: "\\xleftarrow{}", name: "labeled left arrow", tags: ["arrow", "category theory", "structure"], symbol: "←", example: "\\xleftarrow{f}", keywords: ["annotated"] },

  // ── Relations (more & negated) ───────────────────────────────────────
  { command: "\\nless", name: "not less than", tags: ["relation", "order theory"], symbol: "≮" },
  { command: "\\ngtr", name: "not greater than", tags: ["relation", "order theory"], symbol: "≯" },
  { command: "\\lneq", name: "less than but not equal", tags: ["relation", "order theory"], symbol: "⪇" },
  { command: "\\gneq", name: "greater than but not equal", tags: ["relation", "order theory"], symbol: "⪈" },
  { command: "\\leqq", name: "less than or double equal", tags: ["relation", "order theory"], symbol: "≦" },
  { command: "\\geqq", name: "greater than or double equal", tags: ["relation", "order theory"], symbol: "≧" },
  { command: "\\leqslant", name: "less than or slanted equal", tags: ["relation", "order theory"], symbol: "⩽" },
  { command: "\\geqslant", name: "greater than or slanted equal", tags: ["relation", "order theory"], symbol: "⩾" },
  { command: "\\lll", name: "very much less than", tags: ["relation", "analysis"], symbol: "⋘" },
  { command: "\\ggg", name: "very much greater than", tags: ["relation", "analysis"], symbol: "⋙" },
  { command: "\\lessgtr", name: "less than or greater than", tags: ["relation", "order theory"], symbol: "≶" },
  { command: "\\gtrless", name: "greater than or less than", tags: ["relation", "order theory"], symbol: "≷" },
  { command: "\\nsim", name: "not similar", tags: ["relation"], symbol: "≁", keywords: ["not equivalent"] },
  { command: "\\nparallel", name: "not parallel", tags: ["relation", "geometry"], symbol: "∦" },
  { command: "\\nsupseteq", name: "not superset or equal", tags: ["relation", "set theory"], symbol: "⊉" },
  { command: "\\supsetneq", name: "proper superset", tags: ["relation", "set theory"], symbol: "⊋", keywords: ["strict superset"] },
  { command: "\\subsetneqq", name: "proper subset (double line)", tags: ["relation", "set theory"], symbol: "⫋" },
  { command: "\\supsetneqq", name: "proper superset (double line)", tags: ["relation", "set theory"], symbol: "⫌" },
  { command: "\\precsim", name: "precedes or similar", tags: ["relation", "order theory"], symbol: "≾" },
  { command: "\\succsim", name: "succeeds or similar", tags: ["relation", "order theory"], symbol: "≿" },
  { command: "\\preccurlyeq", name: "precedes or curly equal", tags: ["relation", "order theory"], symbol: "≼" },
  { command: "\\succcurlyeq", name: "succeeds or curly equal", tags: ["relation", "order theory"], symbol: "≽" },
  { command: "\\nprec", name: "does not precede", tags: ["relation", "order theory"], symbol: "⊀" },
  { command: "\\nsucc", name: "does not succeed", tags: ["relation", "order theory"], symbol: "⊁" },
  { command: "\\vDash", name: "true / satisfies", tags: ["relation", "logic"], symbol: "⊨", keywords: ["models", "semantic entailment"] },
  { command: "\\between", name: "between", tags: ["relation", "order theory"], symbol: "≬" },
  { command: "\\fallingdotseq", name: "falling dotted equal", tags: ["relation"], symbol: "≒", keywords: ["approximately equal"] },
  { command: "\\risingdotseq", name: "rising dotted equal", tags: ["relation"], symbol: "≓" },
  { command: "\\eqcirc", name: "equal with circle", tags: ["relation"], symbol: "≖", keywords: ["ring equal"] },
  { command: "\\bumpeq", name: "bumpy equal", tags: ["relation"], symbol: "≏" },

  // ── Operations (more variants) ───────────────────────────────────────
  { command: "\\smallsetminus", name: "small set minus", tags: ["operation", "set theory"], symbol: "∖", keywords: ["difference"] },
  { command: "\\divideontimes", name: "division times", tags: ["operation"], symbol: "⋇" },
  { command: "\\curlyvee", name: "curly or", tags: ["operation", "logic", "order theory"], symbol: "⋎" },
  { command: "\\curlywedge", name: "curly and", tags: ["operation", "logic", "order theory"], symbol: "⋏" },
  { command: "\\doublebarwedge", name: "double-bar nand", tags: ["operation", "logic"], symbol: "⩞" },
  { command: "\\circledast", name: "circled asterisk", tags: ["operation"], symbol: "⊛", keywords: ["convolution"] },
  { command: "\\circledcirc", name: "circled ring", tags: ["operation"], symbol: "⊚" },
  { command: "\\circleddash", name: "circled dash", tags: ["operation"], symbol: "⊝" },
  { command: "\\bigtriangleup", name: "big triangle up", tags: ["operation", "set theory"], symbol: "△", keywords: ["symmetric difference"] },
  { command: "\\bigtriangledown", name: "big triangle down", tags: ["operation"], symbol: "▽" },

  // ── Named operators (log, trig, limits) ──────────────────────────────
  { command: "\\sin", name: "sine", tags: ["operator", "calculus", "geometry"], symbol: "sin", keywords: ["trig"] },
  { command: "\\cos", name: "cosine", tags: ["operator", "calculus", "geometry"], symbol: "cos", keywords: ["trig"] },
  { command: "\\tan", name: "tangent", tags: ["operator", "calculus", "geometry"], symbol: "tan", keywords: ["trig"] },
  { command: "\\cot", name: "cotangent", tags: ["operator", "calculus"], symbol: "cot", keywords: ["trig"] },
  { command: "\\sec", name: "secant", tags: ["operator", "calculus"], symbol: "sec", keywords: ["trig"] },
  { command: "\\csc", name: "cosecant", tags: ["operator", "calculus"], symbol: "csc", keywords: ["trig"] },
  { command: "\\arcsin", name: "arcsine", tags: ["operator", "calculus"], symbol: "arcsin", keywords: ["inverse trig"] },
  { command: "\\arccos", name: "arccosine", tags: ["operator", "calculus"], symbol: "arccos", keywords: ["inverse trig"] },
  { command: "\\arctan", name: "arctangent", tags: ["operator", "calculus"], symbol: "arctan", keywords: ["inverse trig"] },
  { command: "\\sinh", name: "hyperbolic sine", tags: ["operator", "analysis"], symbol: "sinh" },
  { command: "\\cosh", name: "hyperbolic cosine", tags: ["operator", "analysis"], symbol: "cosh" },
  { command: "\\tanh", name: "hyperbolic tangent", tags: ["operator", "analysis"], symbol: "tanh" },
  { command: "\\log", name: "logarithm", tags: ["operator", "analysis"], symbol: "log" },
  { command: "\\ln", name: "natural logarithm", tags: ["operator", "analysis"], symbol: "ln" },
  { command: "\\exp", name: "exponential", tags: ["operator", "analysis"], symbol: "exp" },
  { command: "\\arg", name: "argument (complex)", tags: ["operator", "complex"], symbol: "arg", keywords: ["angle", "phase"] },
  { command: "\\deg", name: "degree (polynomial)", tags: ["operator", "algebra"], symbol: "deg" },
  { command: "\\sup", name: "supremum", tags: ["operator", "analysis", "order theory"], symbol: "sup", keywords: ["least upper bound"] },
  { command: "\\inf", name: "infimum", tags: ["operator", "analysis", "order theory"], symbol: "inf", keywords: ["greatest lower bound"] },
  { command: "\\limsup", name: "limit superior", tags: ["operator", "analysis"], symbol: "lim sup", keywords: ["upper limit"] },
  { command: "\\liminf", name: "limit inferior", tags: ["operator", "analysis"], symbol: "lim inf", keywords: ["lower limit"] },
  { command: "\\max", name: "maximum", tags: ["operator", "analysis", "order theory"], symbol: "max" },
  { command: "\\min", name: "minimum", tags: ["operator", "analysis", "order theory"], symbol: "min" },
  { command: "\\operatorname{}", name: "custom operator", tags: ["operator", "structure"], example: "\\operatorname{rank}", keywords: ["upright", "named function"] },

  // ── Brackets & delimiters (auto-sizing) ──────────────────────────────
  { command: "\\left(\\right)", name: "auto-sized parentheses", tags: ["bracket"], symbol: "( )", example: "\\left( \\tfrac{a}{b} \\right)", snippet: "\\left( #1 \\right)#0", keywords: ["scaling", "big"] },
  { command: "\\left[\\right]", name: "auto-sized square brackets", tags: ["bracket"], symbol: "[ ]", example: "\\left[ \\tfrac{a}{b} \\right]", snippet: "\\left[ #1 \\right]#0", keywords: ["scaling"] },
  { command: "\\left\\{\\right\\}", name: "auto-sized braces", tags: ["bracket", "set theory"], symbol: "{ }", example: "\\left\\{ \\tfrac{a}{b} \\right\\}", snippet: "\\left\\{ #1 \\right\\}#0", keywords: ["scaling", "set"] },
  { command: "\\left|\\right|", name: "auto-sized absolute value", tags: ["bracket", "analysis"], symbol: "| |", example: "\\left| \\tfrac{a}{b} \\right|", snippet: "\\left| #1 \\right|#0", keywords: ["modulus"] },
  { command: "\\left\\|\\right\\|", name: "auto-sized norm", tags: ["bracket", "analysis", "linear algebra"], symbol: "‖ ‖", example: "\\left\\| \\tfrac{a}{b} \\right\\|", snippet: "\\left\\| #1 \\right\\|#0" },
  { command: "\\left\\langle\\right\\rangle", name: "auto-sized angle brackets", tags: ["bracket", "linear algebra"], symbol: "⟨ ⟩", example: "\\left\\langle u, v \\right\\rangle", snippet: "\\left\\langle #1 \\right\\rangle#0", keywords: ["inner product"] },
  { command: "\\ulcorner", name: "upper left corner", tags: ["bracket", "logic"], symbol: "⌜", keywords: ["godel quote", "corner quote"] },
  { command: "\\urcorner", name: "upper right corner", tags: ["bracket", "logic"], symbol: "⌝", keywords: ["godel quote", "corner quote"] },

  // ── Accents (more) ───────────────────────────────────────────────────
  { command: "\\acute{}", name: "acute accent", tags: ["accent"] },
  { command: "\\grave{}", name: "grave accent", tags: ["accent"] },
  { command: "\\ddot{}", name: "double dot accent", tags: ["accent", "calculus"], keywords: ["second derivative", "time derivative"] },
  { command: "\\dddot{}", name: "triple dot accent", tags: ["accent", "calculus"], keywords: ["third derivative"] },

  // ── Probability (more) ───────────────────────────────────────────────
  { command: "\\Pr", name: "probability operator", tags: ["probability", "operator"], symbol: "Pr" },
  { command: "\\operatorname{Var}", name: "variance", tags: ["probability", "operator"], example: "\\operatorname{Var}(X)", snippet: "\\operatorname{Var}(#1)" },
  { command: "\\operatorname{Cov}", name: "covariance", tags: ["probability", "operator"], example: "\\operatorname{Cov}(X, Y)", snippet: "\\operatorname{Cov}(#1, #2)" },
  { command: "\\xrightarrow{d}", name: "converges in distribution", tags: ["probability", "arrow"], example: "X_n \\xrightarrow{d} X", keywords: ["convergence", "weak convergence"] },

  // ── Number theory (more) ─────────────────────────────────────────────
  { command: "\\pmod{}", name: "parenthesized mod", tags: ["number theory", "operator"], example: "a \\equiv b \\pmod{n}", keywords: ["modulo", "congruence"] },
  { command: "\\bmod", name: "binary mod", tags: ["number theory", "operator"], example: "a \\bmod n", keywords: ["modulo", "remainder"] },
  { command: "\\gcd", name: "greatest common divisor", tags: ["number theory", "operator"], symbol: "gcd", example: "\\gcd(a, b)" },
  { command: "\\operatorname{lcm}", name: "least common multiple", tags: ["number theory", "operator"], example: "\\operatorname{lcm}(a, b)", snippet: "\\operatorname{lcm}(#1, #2)" },

  // ── Linear algebra (more) ────────────────────────────────────────────
  { command: "\\det", name: "determinant", tags: ["linear algebra", "operator"], symbol: "det" },
  { command: "\\ker", name: "kernel", tags: ["linear algebra", "algebra", "operator"], symbol: "ker", keywords: ["null space"] },
  { command: "\\dim", name: "dimension", tags: ["linear algebra", "topology", "operator"], symbol: "dim" },
  { command: "\\operatorname{rank}", name: "rank", tags: ["linear algebra", "operator"], example: "\\operatorname{rank}(A)", snippet: "\\operatorname{rank}(#1)" },
  { command: "\\operatorname{tr}", name: "trace", tags: ["linear algebra", "operator"], example: "\\operatorname{tr}(A)", snippet: "\\operatorname{tr}(#1)" },
  { command: "\\operatorname{span}", name: "span", tags: ["linear algebra", "operator"], example: "\\operatorname{span}(v_1, v_2)", snippet: "\\operatorname{span}(#1)" },
  { command: "^{\\top}", name: "transpose", tags: ["linear algebra"], example: "A^{\\top}", keywords: ["matrix transpose"] },
  { command: "\\begin{vmatrix} \\end{vmatrix}", name: "determinant (vertical bars)", tags: ["linear algebra", "structure"], example: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}", snippet: "\\begin{vmatrix} #1 & #2 \\\\ #3 & #4 \\end{vmatrix}", keywords: ["vmatrix"] },
  { command: "\\begin{smallmatrix} \\end{smallmatrix}", name: "inline matrix", tags: ["linear algebra", "structure"], example: "\\bigl( \\begin{smallmatrix} a & b \\\\ c & d \\end{smallmatrix} \\bigr)", snippet: "\\bigl( \\begin{smallmatrix} #1 & #2 \\\\ #3 & #4 \\end{smallmatrix} \\bigr)", keywords: ["smallmatrix", "compact"] },

  // ── Structure (more) ─────────────────────────────────────────────────
  { command: "\\overset{}{}", name: "symbol over symbol", tags: ["structure"], example: "\\overset{!}{=}", snippet: "\\overset{#1}{#2}", keywords: ["stack above", "annotate"] },
  { command: "\\underset{}{}", name: "symbol under symbol", tags: ["structure"], example: "\\underset{n \\to \\infty}{\\lim}", snippet: "\\underset{#1}{#2}", keywords: ["stack below", "annotate"] },

  // ── Misc symbols ─────────────────────────────────────────────────────
  { command: "\\varnothing", name: "empty set (variant)", tags: ["set theory"], symbol: "∅", keywords: ["null set"] },
  { command: "\\imath", name: "dotless i", tags: ["misc"], symbol: "ı", keywords: ["accent base"] },
  { command: "\\jmath", name: "dotless j", tags: ["misc"], symbol: "ȷ", keywords: ["accent base"] },
  { command: "\\ddagger", name: "double dagger", tags: ["misc"], symbol: "‡", keywords: ["footnote marker"] },
  { command: "\\S", name: "section sign", tags: ["misc"], symbol: "§", keywords: ["paragraph", "reference"] },
  { command: "\\checkmark", name: "check mark", tags: ["misc"], symbol: "✓", keywords: ["tick", "done"] },
  { command: "\\surd", name: "radical symbol", tags: ["misc"], symbol: "√", keywords: ["square root sign"] },
  { command: "\\heartsuit", name: "heart suit", tags: ["misc"], symbol: "♡", keywords: ["card"] },
  { command: "\\spadesuit", name: "spade suit", tags: ["misc"], symbol: "♠", keywords: ["card"] },
  { command: "\\omicron", name: "omicron", tags: ["greek"], symbol: "ο" },

  // ══ Document & text-formatting commands ══════════════════════════════
  // Not math symbols: structural ones don't typeset (palette shows command
  // text); multi-part ones carry a `snippet` (tokens #1, #{1:default}, #0).

  // ── Preamble ─────────────────────────────────────────────────────────
  { command: "\\documentclass{}", name: "document class", tags: ["preamble"], snippet: "\\documentclass{#{1:article}}", keywords: ["article", "report", "book"] },
  { command: "\\usepackage{}", name: "use package", tags: ["preamble"], keywords: ["import", "library"] },
  { command: "\\usepackage[]{}", name: "use package (with options)", tags: ["preamble"], snippet: "\\usepackage[#1]{#2}", keywords: ["options"] },
  { command: "\\begin{document}", name: "document environment", tags: ["preamble"], snippet: "\\begin{document}\n\t#0\n\\end{document}", keywords: ["body"] },
  { command: "\\input{}", name: "input file", tags: ["preamble"], keywords: ["include"] },
  { command: "\\include{}", name: "include file", tags: ["preamble"], keywords: ["chapter"] },

  // ── Page layout ──────────────────────────────────────────────────────
  { command: "\\geometry{}", name: "page geometry", tags: ["page layout"], pkg: "geometry", snippet: "\\geometry{#{1:margin=1in}}", keywords: ["margins"] },
  { command: "\\newpage", name: "new page", tags: ["page layout"], keywords: ["break"] },
  { command: "\\clearpage", name: "clear page", tags: ["page layout"], keywords: ["flush floats"] },
  { command: "\\pagestyle{}", name: "page style", tags: ["page layout"], snippet: "\\pagestyle{#{1:plain}}", keywords: ["header", "footer"] },
  { command: "\\pagenumbering{}", name: "page numbering", tags: ["page layout"], snippet: "\\pagenumbering{#{1:roman}}", keywords: ["arabic", "roman"] },
  { command: "\\setlength{}{}", name: "set length", tags: ["page layout"], keywords: ["margin", "dimension"] },

  // ── Sectioning ───────────────────────────────────────────────────────
  { command: "\\section{}", name: "section", tags: ["sectioning"], keywords: ["heading"] },
  { command: "\\subsection{}", name: "subsection", tags: ["sectioning"] },
  { command: "\\subsubsection{}", name: "subsubsection", tags: ["sectioning"] },
  { command: "\\chapter{}", name: "chapter", tags: ["sectioning"], keywords: ["book", "report"] },
  { command: "\\paragraph{}", name: "paragraph heading", tags: ["sectioning"] },
  { command: "\\section*{}", name: "unnumbered section", tags: ["sectioning"], snippet: "\\section*{#1}", keywords: ["starred"] },
  { command: "\\tableofcontents", name: "table of contents", tags: ["sectioning"], keywords: ["toc"] },
  { command: "\\appendix", name: "appendix", tags: ["sectioning"] },

  // ── Title ────────────────────────────────────────────────────────────
  { command: "\\title{}", name: "title", tags: ["title"] },
  { command: "\\author{}", name: "author", tags: ["title"] },
  { command: "\\date{}", name: "date", tags: ["title"], snippet: "\\date{#{1:\\today}}" },
  { command: "\\maketitle", name: "make title", tags: ["title"], keywords: ["render title"] },
  { command: "\\today", name: "today's date", tags: ["title"], keywords: ["date"] },
  { command: "\\thanks{}", name: "thanks (title footnote)", tags: ["title"], keywords: ["acknowledgement"] },

  // ── Theorem & remarks ────────────────────────────────────────────────
  { command: "\\begin{theorem}", name: "theorem", tags: ["theorem"], pkg: "amsthm", snippet: "\\begin{theorem}\n\t#0\n\\end{theorem}" },
  { command: "\\begin{lemma}", name: "lemma", tags: ["theorem"], pkg: "amsthm", snippet: "\\begin{lemma}\n\t#0\n\\end{lemma}" },
  { command: "\\begin{corollary}", name: "corollary", tags: ["theorem"], pkg: "amsthm", snippet: "\\begin{corollary}\n\t#0\n\\end{corollary}" },
  { command: "\\begin{definition}", name: "definition", tags: ["theorem"], pkg: "amsthm", snippet: "\\begin{definition}\n\t#0\n\\end{definition}" },
  { command: "\\begin{remark}", name: "remark", tags: ["theorem"], pkg: "amsthm", snippet: "\\begin{remark}\n\t#0\n\\end{remark}" },
  { command: "\\begin{proof}", name: "proof", tags: ["theorem"], pkg: "amsthm", snippet: "\\begin{proof}\n\t#0\n\\end{proof}" },
  { command: "\\newtheorem{}{}", name: "declare theorem", tags: ["theorem"], pkg: "amsthm", snippet: "\\newtheorem{#1}{#2}", keywords: ["define environment"] },
  { command: "\\footnote{}", name: "footnote", tags: ["theorem"], keywords: ["note"] },
  { command: "\\marginpar{}", name: "margin note", tags: ["theorem"], keywords: ["margin"] },

  // ── Alignment ────────────────────────────────────────────────────────
  { command: "\\begin{center}", name: "center environment", tags: ["alignment"], snippet: "\\begin{center}\n\t#0\n\\end{center}" },
  { command: "\\begin{flushleft}", name: "flush left", tags: ["alignment"], snippet: "\\begin{flushleft}\n\t#0\n\\end{flushleft}", keywords: ["left align"] },
  { command: "\\begin{flushright}", name: "flush right", tags: ["alignment"], snippet: "\\begin{flushright}\n\t#0\n\\end{flushright}", keywords: ["right align"] },
  { command: "\\centering", name: "centering", tags: ["alignment"], keywords: ["center"] },
  { command: "\\raggedright", name: "ragged right (left align)", tags: ["alignment"] },
  { command: "\\raggedleft", name: "ragged left (right align)", tags: ["alignment"] },

  // ── Spacing ──────────────────────────────────────────────────────────
  { command: "\\quad", name: "quad space", tags: ["spacing"], keywords: ["space"] },
  { command: "\\qquad", name: "double quad space", tags: ["spacing"], keywords: ["space"] },
  { command: "\\,", name: "thin space", tags: ["spacing"], keywords: ["thinspace"] },
  { command: "\\;", name: "medium space", tags: ["spacing"], keywords: ["space"] },
  { command: "\\!", name: "negative thin space", tags: ["spacing"], keywords: ["negative space"] },
  { command: "\\hspace{}", name: "horizontal space", tags: ["spacing"], snippet: "\\hspace{#{1:1cm}}" },
  { command: "\\vspace{}", name: "vertical space", tags: ["spacing"], snippet: "\\vspace{#{1:1cm}}" },
  { command: "\\\\", name: "line break", tags: ["spacing"], keywords: ["newline", "new line"] },
  { command: "\\newline", name: "new line", tags: ["spacing"], keywords: ["break"] },
  { command: "\\smallskip", name: "small vertical skip", tags: ["spacing"] },
  { command: "\\medskip", name: "medium vertical skip", tags: ["spacing"] },
  { command: "\\bigskip", name: "big vertical skip", tags: ["spacing"] },
  { command: "\\noindent", name: "no indent", tags: ["spacing"], keywords: ["paragraph"] },
  { command: "\\hfill", name: "horizontal fill", tags: ["spacing"], keywords: ["push"] },
  { command: "\\vfill", name: "vertical fill", tags: ["spacing"] },

  // ── Tables ───────────────────────────────────────────────────────────
  { command: "\\begin{tabular}", name: "tabular", tags: ["table"], snippet: "\\begin{tabular}{#{1:c c}}\n\t#2 & #3 \\\\\n\\end{tabular}", keywords: ["table grid"] },
  { command: "\\begin{table}", name: "table (float)", tags: ["table"], snippet: "\\begin{table}[#{1:htbp}]\n\t\\centering\n\t#2\n\t\\caption{#3}\n\t\\label{tab:#4}\n\\end{table}", keywords: ["float"] },
  { command: "\\begin{array}", name: "array (math)", tags: ["table"], snippet: "\\begin{array}{#{1:cc}}\n\t#2 & #3 \\\\\n\\end{array}", keywords: ["matrix"] },
  { command: "\\hline", name: "horizontal line", tags: ["table"], keywords: ["rule"] },
  { command: "\\cline{}", name: "partial horizontal line", tags: ["table"], snippet: "\\cline{#{1:1-2}}" },
  { command: "\\multicolumn{}{}{}", name: "multicolumn cell", tags: ["table"], snippet: "\\multicolumn{#1}{#{2:c}}{#3}", keywords: ["span columns"] },
  { command: "\\caption{}", name: "caption", tags: ["table"], keywords: ["figure", "label"] },

  // ── Text style ───────────────────────────────────────────────────────
  { command: "\\textbf{}", name: "bold text", tags: ["text style"], example: "\\textbf{abc}", keywords: ["boldface"] },
  { command: "\\textit{}", name: "italic text", tags: ["text style"], example: "\\textit{abc}", keywords: ["italics"] },
  { command: "\\emph{}", name: "emphasis", tags: ["text style"], example: "\\textit{abc}", keywords: ["italic emphasize"] },
  { command: "\\underline{}", name: "underline", tags: ["text style"], example: "\\underline{abc}" },
  { command: "\\texttt{}", name: "typewriter text", tags: ["text style"], example: "\\texttt{abc}", keywords: ["monospace code"] },
  { command: "\\textsf{}", name: "sans-serif text", tags: ["text style"], example: "\\textsf{abc}" },
  { command: "\\textsc{}", name: "small caps", tags: ["text style"], keywords: ["smallcaps"] },
  { command: "\\textrm{}", name: "roman text", tags: ["text style"], example: "\\textrm{abc}", keywords: ["upright"] },
  { command: "\\text{}", name: "text in math mode", tags: ["text style"], example: "\\text{abc}", keywords: ["mbox"] },

  // ── Font size ────────────────────────────────────────────────────────
  { command: "\\tiny", name: "tiny", tags: ["font size"] },
  { command: "\\scriptsize", name: "script size", tags: ["font size"] },
  { command: "\\footnotesize", name: "footnote size", tags: ["font size"] },
  { command: "\\small", name: "small", tags: ["font size"] },
  { command: "\\normalsize", name: "normal size", tags: ["font size"] },
  { command: "\\large", name: "large", tags: ["font size"] },
  { command: "\\Large", name: "Large", tags: ["font size"] },
  { command: "\\LARGE", name: "LARGE", tags: ["font size"] },
  { command: "\\huge", name: "huge", tags: ["font size"] },
  { command: "\\Huge", name: "Huge", tags: ["font size"] },

  // ── References ───────────────────────────────────────────────────────
  { command: "\\label{}", name: "label", tags: ["reference"], keywords: ["anchor"] },
  { command: "\\ref{}", name: "reference", tags: ["reference"], keywords: ["cross reference"] },
  { command: "\\eqref{}", name: "equation reference", tags: ["reference"], pkg: "amsmath", keywords: ["equation"] },
  { command: "\\pageref{}", name: "page reference", tags: ["reference"] },
  { command: "\\cite{}", name: "citation", tags: ["reference"], keywords: ["bibliography"] },
  { command: "\\bibliography{}", name: "bibliography", tags: ["reference"], keywords: ["references"] },

  // ── Index ────────────────────────────────────────────────────────────
  { command: "\\index{}", name: "index entry", tags: ["index"], pkg: "makeidx" },
  { command: "\\makeindex", name: "make index", tags: ["index"], pkg: "makeidx", keywords: ["preamble"] },
  { command: "\\printindex", name: "print index", tags: ["index"], pkg: "makeidx" },

  // ── Math display environments ────────────────────────────────────────
  { command: "\\begin{equation}", name: "equation (numbered)", tags: ["math display"], snippet: "\\begin{equation}\n\t#1\n\\end{equation}", keywords: ["display math"] },
  { command: "\\begin{equation*}", name: "equation (unnumbered)", tags: ["math display"], snippet: "\\begin{equation*}\n\t#1\n\\end{equation*}", keywords: ["display math", "starred"] },
  { command: "\\begin{align}", name: "align (numbered)", tags: ["math display"], snippet: "\\begin{align}\n\t#1 &= #2 \\\\\n\t#3 &= #4\n\\end{align}", keywords: ["aligned equations", "multi-line"] },
  { command: "\\begin{align*}", name: "align (unnumbered)", tags: ["math display"], snippet: "\\begin{align*}\n\t#1 &= #2 \\\\\n\t#3 &= #4\n\\end{align*}", keywords: ["aligned equations", "starred"] },
  { command: "\\begin{gather}", name: "gather", tags: ["math display"], snippet: "\\begin{gather}\n\t#1 \\\\\n\t#2\n\\end{gather}", keywords: ["centered equations"] },
  { command: "\\begin{multline}", name: "multline", tags: ["math display"], snippet: "\\begin{multline}\n\t#1 \\\\\n\t#2\n\\end{multline}", keywords: ["long equation", "broken"] },
  { command: "\\begin{split}", name: "split", tags: ["math display"], snippet: "\\begin{split}\n\t#1 &= #2 \\\\\n\t&= #3\n\\end{split}", keywords: ["one number", "aligned"] },
  { command: "\\notag", name: "suppress equation number", tags: ["math display"], keywords: ["nonumber"] },
  { command: "\\tag{}", name: "custom equation tag", tags: ["math display"], snippet: "\\tag{#{1:*}}", keywords: ["number", "label"] },

  // ── Lists & text environments ────────────────────────────────────────
  { command: "\\begin{itemize}", name: "bulleted list", tags: ["list"], snippet: "\\begin{itemize}\n\t\\item #1\n\t\\item #2\n\\end{itemize}", keywords: ["bullets", "unordered"] },
  { command: "\\begin{enumerate}", name: "numbered list", tags: ["list"], snippet: "\\begin{enumerate}\n\t\\item #1\n\t\\item #2\n\\end{enumerate}", keywords: ["ordered"] },
  { command: "\\begin{description}", name: "description list", tags: ["list"], snippet: "\\begin{description}\n\t\\item[#{1:term}] #2\n\t\\item[#{3:term}] #4\n\\end{description}", keywords: ["definition list", "glossary"] },
  { command: "\\item", name: "list item", tags: ["list"] },
  { command: "\\item[]", name: "list item (custom label)", tags: ["list"], snippet: "\\item[#{1:label}] #0", keywords: ["custom bullet"] },
  { command: "\\begin{abstract}", name: "abstract", tags: ["list"], snippet: "\\begin{abstract}\n\t#1\n\\end{abstract}", keywords: ["summary"] },
  { command: "\\begin{quote}", name: "quote block", tags: ["list"], snippet: "\\begin{quote}\n\t#1\n\\end{quote}", keywords: ["quotation", "indent"] },
  { command: "\\begin{verbatim}", name: "verbatim block", tags: ["list"], snippet: "\\begin{verbatim}\n#1\n\\end{verbatim}", keywords: ["code", "literal"] },
  { command: "\\begin{minipage}", name: "minipage", tags: ["list"], snippet: "\\begin{minipage}{#{1:0.45}\\linewidth}\n\t#2\n\\end{minipage}", keywords: ["box", "side by side"] },

  // ── Figures & graphics ───────────────────────────────────────────────
  { command: "\\includegraphics[]{}", name: "include graphics", tags: ["figure"], pkg: "graphicx", snippet: "\\includegraphics[width=#{1:0.8}\\textwidth]{#2}", keywords: ["image", "picture"] },
  { command: "\\begin{figure}", name: "figure environment", tags: ["figure"], pkg: "graphicx", snippet: "\\begin{figure}[#{1:htbp}]\n\t\\centering\n\t\\includegraphics[width=#{2:0.8}\\textwidth]{#3}\n\t\\caption{#4}\n\t\\label{fig:#5}\n\\end{figure}", keywords: ["float", "image"] },
  { command: "\\graphicspath{}", name: "graphics path", tags: ["figure"], pkg: "graphicx", snippet: "\\graphicspath{{#{1:figures/}}}", keywords: ["image folder", "preamble"] },
  { command: "\\begin{subfigure}", name: "subfigure", tags: ["figure"], pkg: "subcaption", snippet: "\\begin{subfigure}{#{1:0.45}\\textwidth}\n\t\\centering\n\t\\includegraphics[width=\\textwidth]{#2}\n\t\\caption{#3}\n\\end{subfigure}", keywords: ["side by side", "subcaption"] },
  { command: "\\begin{wrapfigure}", name: "wrapped figure", tags: ["figure"], pkg: "wrapfig", snippet: "\\begin{wrapfigure}{#{1:r}}{#{2:0.4}\\textwidth}\n\t\\centering\n\t\\includegraphics[width=#{3:0.38}\\textwidth]{#4}\n\t\\caption{#5}\n\\end{wrapfigure}", keywords: ["text wrap", "inline figure"] },

  // ── Links, colors & boxes ────────────────────────────────────────────
  { command: "\\url{}", name: "URL", tags: ["link & color"], pkg: "hyperref", keywords: ["web address", "link"] },
  { command: "\\href{}{}", name: "hyperlink", tags: ["link & color"], pkg: "hyperref", snippet: "\\href{#{1:https://}}{#2}", keywords: ["link with text"] },
  { command: "\\textcolor{}{}", name: "colored text", tags: ["link & color"], pkg: "xcolor", snippet: "\\textcolor{#{1:red}}{#2}", keywords: ["color"] },
  { command: "\\colorbox{}{}", name: "color box", tags: ["link & color"], pkg: "xcolor", snippet: "\\colorbox{#{1:yellow}}{#2}", keywords: ["highlight", "background"] },
  { command: "\\fbox{}", name: "framed box", tags: ["link & color"], keywords: ["border", "frame"] },
  { command: "\\parbox{}{}", name: "paragraph box", tags: ["link & color"], snippet: "\\parbox{#{1:5cm}}{#2}", keywords: ["fixed width"] },
  { command: "\\verb", name: "inline verbatim", tags: ["link & color"], example: "\\verb|code|", snippet: "\\verb|#1|", keywords: ["inline code", "literal"] },
];
