// The dictionary DATA — deliberately separate from the command LOGIC in
// extension.ts. To grow the dictionary, you only ever edit this file.

export interface Entry {
  command: string;     // what we insert, e.g. "\\int"
  name: string;        // primary human name, e.g. "integral"
  tags: string[];      // domains/types it belongs to — MANY-to-many
  symbol?: string;     // unicode preview shown in the list, e.g. "∫"
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
      "algebra", "analysis", "calculus", "category theory", "complex",
      "group theory", "linear algebra", "logic", "number theory",
      "set theory", "topology",
    ],
  },
  {
    name: "Symbol types",
    tags: [
      "arrow", "big operator", "bracket", "operation", "operator",
      "quantifier", "relation", "structure",
    ],
  },
  {
    name: "Character class",
    tags: ["blackboard", "greek"],
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
  { command: "\\begin{pmatrix} \\end{pmatrix}", name: "matrix (parentheses)", tags: ["linear algebra", "structure"], symbol: "⎡⎤", keywords: ["pmatrix"] },
];
