import * as vscode from "vscode";
import { DICTIONARY, FACETS, Entry } from "./dictionary";

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
    detail: e.tags.join(", "),
    insertText: e.command,
  };
}

// Build symbol rows grouped under their PRIMARY tag (tags[0]) with separators.
function buildGroupedItems(entries: Entry[]): vscode.QuickPickItem[] {
  const items: vscode.QuickPickItem[] = [];
  let current: string | null = null;
  for (const e of entries) {
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
          editor.edit((builder) => {
            builder.insert(editor.selection.active, text);
          });
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
}

export function deactivate() {}
