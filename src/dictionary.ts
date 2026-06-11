// The dictionary DATA — deliberately separate from the command LOGIC in
// extension.ts. To grow the dictionary, you only ever edit this file.

export interface Entry {
  command: string;     // what we insert, e.g. "\\int"; empty {} become snippet tab stops
  name: string;        // primary human name, e.g. "integral"
  tags: string[];      // domains/types it belongs to — MANY-to-many
  symbol?: string;     // unicode preview shown in the list, e.g. "∫"
  example?: string;    // LaTeX rendered as a PREVIEW instead of `command` (e.g. font samples)
  pkg?: string;        // required non-standard LaTeX package (beyond amsmath/amssymb)
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
      "accent", "arrow", "big operator", "bracket", "font", "operation",
      "operator", "quantifier", "relation", "structure",
    ],
  },
  {
    name: "Character class",
    tags: [
      "blackboard", "bold", "calligraphic", "fraktur", "greek", "hebrew",
      "monospace", "roman", "sans-serif", "script",
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
];
