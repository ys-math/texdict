import * as vscode from "vscode";
import { DICTIONARY, FACETS, Entry } from "./dictionary";
import { TexDictViewProvider } from "./panel";

// A QuickPick item that also carries the LaTeX command to insert.
interface SymbolItem extends vscode.QuickPickItem {
  insertText: string;
}

// A tag item used in the filter sub-picker.
interface TagItem extends vscode.QuickPickItem {
  tag?: string;
}

// Turn a dictionary entry into a selectable symbol item.
//   label       -> unicode glyph + the LaTeX command (the "LaTeX format" view)
//   description  -> human name + keywords (still searchable via matchOnDescription)
//   detail       -> the tags (searchable via matchOnDetail)
function toSymbolItem(e: Entry): SymbolItem {
  const keywords = (e.keywords ?? []).join(" ");
  const glyph = e.symbol ? `${e.symbol}  ` : "";
  return {
    label: `${glyph}${e.command}`,
    description: `${e.name}   ${keywords}`.trim(),
    detail: e.tags.join(", ") + (e.pkg ? ` · needs ${e.pkg}` : ""),
    insertText: e.command,
  };
}

// Build symbol rows grouped under their PRIMARY tag (tags[0]) with separators.
// Sort by primary tag first so each header appears exactly once (entries are
// authored in topic order, not tag order, so the same primary tag is scattered).
function buildGroupedItems(entries: Entry[]): vscode.QuickPickItem[] {
  const items: vscode.QuickPickItem[] = [];
  let current: string | null = null;
  const sorted = [...entries].sort((a, b) => a.tags[0].localeCompare(b.tags[0]));
  for (const e of sorted) {
    const primary = e.tags[0];
    if (primary !== current) {
      current = primary;
      items.push({ label: primary, kind: vscode.QuickPickItemKind.Separator });
    }
    items.push(toSymbolItem(e));
  }
  return items;
}

// The filter sub-picker: a multi-select list of tags, grouped by FACET.
// Returns the chosen tags, or undefined if the user cancelled (Esc).
async function pickFilterTags(active: string[]): Promise<string[] | undefined> {
  const used = new Set(DICTIONARY.flatMap((e) => e.tags));
  const items: TagItem[] = [];
  for (const facet of FACETS) {
    const tags = facet.tags.filter((t) => used.has(t));
    if (tags.length === 0) {
      continue;
    }
    items.push({ label: facet.name, kind: vscode.QuickPickItemKind.Separator });
    for (const t of tags) {
      items.push({
        label: t,
        tag: t,
        description: `${DICTIONARY.filter((e) => e.tags.includes(t)).length}`,
        picked: active.includes(t), // pre-check the currently active filters
      });
    }
  }
  const chosen = await vscode.window.showQuickPick(items, {
    canPickMany: true,
    placeHolder: "Filter symbols by tags (a symbol must match ALL checked tags)…",
  });
  if (!chosen) {
    return undefined;
  }
  return chosen.map((c) => c.tag!).filter(Boolean);
}

// Convert a command into a snippet body: each empty `{}` pair becomes a tab
// stop so the cursor lands inside (e.g. "\\mathbb{}" -> "\\mathbb{$1}",
// "\\frac{}{}" -> "\\frac{$1}{$2}"). Backslashes/dollars are escaped first so
// the literal LaTeX survives the snippet parser.
function toSnippet(command: string): string {
  let n = 0;
  const escaped = command.replace(/\\/g, "\\\\").replace(/\$/g, "\\$");
  return escaped.replace(/\{\}/g, () => `{$${++n}}`);
}

// Entries with a custom `snippet` (rich templates) insert it instead of the brace-fill.
const byCommand = new Map(DICTIONARY.map((e) => [e.command, e] as const));

// Build a SnippetString body from a custom template: escape backslashes/dollars for the
// snippet parser, then convert tokens #{n:default} → ${n:default} and #n → $n.
function customSnippet(body: string): string {
  return body
    .replace(/\\/g, "\\\\")
    .replace(/\$/g, () => "\\$")
    .replace(/#\{(\d+):([^}]*)\}/g, (_m, n, d) => "${" + n + ":" + d + "}")
    .replace(/#(\d+)/g, (_m, n) => "$" + n);
}

// What to insert for a command: its custom snippet, else the brace-fill of the command.
function snippetFor(command: string): string {
  const entry = byCommand.get(command);
  return entry?.snippet ? customSnippet(entry.snippet) : toSnippet(command);
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("texdict.search", () => {
    // May be undefined if no file is focused — we handle that on accept by
    // falling back to the clipboard, so we no longer bail out here.
    const editor = vscode.window.activeTextEditor;

    // createQuickPick() gives an interactive picker that STAYS OPEN and lets
    // us react to events — unlike the one-shot showQuickPick().
    const qp = vscode.window.createQuickPick();
    qp.matchOnDescription = true; // search command + keywords
    qp.matchOnDetail = true; // search symbol + tags

    // Filter state + the two toolbar buttons (top-right corner of the picker).
    let activeTags: string[] = [];
    const filterButton: vscode.QuickInputButton = {
      iconPath: new vscode.ThemeIcon("filter"),
      tooltip: "Filter by tag",
    };
    const clearButton: vscode.QuickInputButton = {
      iconPath: new vscode.ThemeIcon("clear-all"),
      tooltip: "Clear filters",
    };

    // Recompute the visible symbols from the current filter state.
    const render = () => {
      const entries =
        activeTags.length === 0
          ? DICTIONARY
          : DICTIONARY.filter((e) => activeTags.every((t) => e.tags.includes(t)));
      qp.items = buildGroupedItems(entries);
      qp.title =
        activeTags.length === 0
          ? `TeXDict — all symbols (${entries.length})`
          : `TeXDict — ${activeTags.join(" + ")} (${entries.length})`;
      qp.placeholder = "Search by name, keyword, or tag — or filter with the ⏚ button…";
      // Show the clear button only when a filter is active.
      qp.buttons = activeTags.length === 0 ? [filterButton] : [clearButton, filterButton];
    };

    // When we open the filter sub-picker, qp hides momentarily; this flag tells
    // onDidHide NOT to dispose the picker during that round-trip.
    let pickingTags = false;

    qp.onDidTriggerButton(async (button) => {
      if (button === clearButton) {
        activeTags = [];
        render();
        return;
      }
      if (button === filterButton) {
        pickingTags = true;
        const chosen = await pickFilterTags(activeTags);
        pickingTags = false;
        if (chosen) {
          activeTags = chosen;
          render();
        }
        qp.show(); // bring the main picker back
      }
    });

    // Enter on a symbol inserts it — or, if no editor is open, copies it to
    // the clipboard so the action is never a dead end. (Separators aren't selectable.)
    qp.onDidAccept(async () => {
      const picked = qp.selectedItems[0];
      if (picked && "insertText" in picked) {
        const text = (picked as SymbolItem).insertText;
        if (editor) {
          editor.insertSnippet(new vscode.SnippetString(snippetFor(text)));
        } else {
          await vscode.env.clipboard.writeText(text);
          vscode.window.showInformationMessage(`TeXDict: copied ${text} to clipboard.`);
        }
      }
      qp.hide();
    });

    // Esc (or insert) hides the picker; dispose it then — unless we only hid it
    // to show the filter sub-picker.
    qp.onDidHide(() => {
      if (!pickingTags) {
        qp.dispose();
      }
    });

    render();
    qp.show();
  });

  context.subscriptions.push(disposable);

  // --- Typeset symbol palette (Webview view) ---
  // Clicking the palette steals focus from the editor, so activeTextEditor
  // becomes undefined. We remember the last real editor and insert into that.
  let lastEditor = vscode.window.activeTextEditor;
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((e) => {
      if (e) {
        lastEditor = e;
      }
    })
  );

  const insert = async (text: string) => {
    if (lastEditor) {
      await lastEditor.insertSnippet(new vscode.SnippetString(snippetFor(text)));
    } else {
      await vscode.env.clipboard.writeText(text);
      vscode.window.showInformationMessage(`TeXDict: copied ${text} to clipboard.`);
    }
  };

  // Insert a raw template body. Built-in templates use the #1/#{1:default}
  // token convention (customSnippet); user templates are plain text, where
  // empty {} pairs still become tab stops (toSnippet).
  const insertBody = async (body: string, useTokens: boolean) => {
    const snippet = useTokens ? customSnippet(body) : toSnippet(body);
    if (lastEditor) {
      await lastEditor.insertSnippet(new vscode.SnippetString(snippet));
    } else {
      await vscode.env.clipboard.writeText(body);
      vscode.window.showInformationMessage("TeXDict: copied the template to the clipboard.");
    }
  };

  const provider = new TexDictViewProvider(
    context.extensionUri,
    context.globalState,
    insert,
    insertBody
  );
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(TexDictViewProvider.viewType, provider, {
      webviewOptions: { retainContextWhenHidden: true },
    })
  );

  // Save the current editor selection as a user template (title + description
  // via input boxes); it appears in the palette's Templates mode immediately.
  context.subscriptions.push(
    vscode.commands.registerCommand("texdict.saveTemplate", async () => {
      const editor = vscode.window.activeTextEditor;
      const body = editor ? editor.document.getText(editor.selection) : "";
      if (!body.trim()) {
        vscode.window.showWarningMessage("TeXDict: select some LaTeX in the editor first.");
        return;
      }
      const title = await vscode.window.showInputBox({
        prompt: "Template title",
        placeHolder: "e.g. Homework header",
        validateInput: (v) => (v.trim() ? undefined : "Title is required"),
      });
      if (!title) {
        return;
      }
      const description = await vscode.window.showInputBox({
        prompt: "Template description (optional)",
        placeHolder: "What is it for? Any caveats?",
      });
      if (description === undefined) {
        return; // Esc on the description cancels the whole save
      }
      await provider.addTemplate({ title: title.trim(), description: description.trim(), body });
      vscode.window.showInformationMessage(`TeXDict: saved template "${title.trim()}".`);
    })
  );
}

export function deactivate() {}
