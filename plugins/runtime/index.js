import { StateEffect, StateField } from "@codemirror/state";
import { Decoration } from "@codemirror/view";
import { toArrayAst, astHasError } from "../../parser/index.js";
import { EditorView } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { showPanel } from "@codemirror/panel";

function getErrors(errors) {
  return errors
    .map((error) => {
      return `
      <div class="cm-error-panel__message">
        ${error.error.message}
      </div>
    `;
    })
    .join("");
}

const errorPanelTheme = EditorView.baseTheme({
  ".cm-error-panel": {
    "background-color": "#ffcdd2",
    "font-family": "monospace",
    "font-size": "12px",
    "border-top": "solid 1px hsl(354deg 100% 85%)",
    "border-bottom": "solid 1px hsl(354deg 100% 85%)",
  },
  ".cm-error-panel__message": {
    padding: "5px",
  },
  ".cm-error-panel__message:not(:last-child)": {
    "border-bottom": "solid 1px hsl(354deg 100% 85%)",
  },
  ".cm-error-panel:empty": {
    display: "none",
  },
});

function errorPanel(ctx) {
  return (view) => {
    const dom = document.createElement("div");
    dom.innerHTML = getErrors(ctx.errors);
    dom.className = "cm-error-panel";
    return {
      dom,
      update(update) {
        if (update.docChanged) {
          dom.innerHTML = getErrors(ctx.errors);
        }
      },
    };
  };
}

function errorPanelExt(ctx) {
  return showPanel.of(errorPanel(ctx));
}

function walk(arr, path) {
  let out = arr;
  let idx = 0;
  let len = path.length;
  while (idx < len) {
    const newOut = out.children[path[idx]];
    if (!newOut) {
      return out;
    }
    out = newOut;
    idx++;
  }
  return out;
}

function toJson(obj) {
  if (Array.isArray(obj.value)) {
    return obj.value.concat(obj.children.map(toJson));
  } else {
    return obj.value;
  }
}

// Effects can be attached to transactions to communicate with the extension
const addMarks = StateEffect.define();

const runtimeErrorMark = Decoration.mark({
  attributes: {
    style: "border-bottom: dotted 2px red;",
  },
});

// This value must be added to the set of extensions to enable this
export default function runtimeMarks(texprl) {
  let ctx = {
    errors: [],
  };

  return [
    StateField.define({
      // Start with an empty set of decorations
      create() {
        return Decoration.none;
      },
      // This is called whenever the editor updates—it computes the new set
      update(value, tr) {
        if (tr.state.doc.length === 0) {
          return value;
        }

        const ast = toArrayAst(tr.state.doc, syntaxTree(tr.state), texprl);
        const hasError = astHasError(ast);

        value = value.update({
          filter: () => false,
        });

        if (hasError) {
          return value;
        }

        const json = toJson(ast);
        const result = texprl.runtime(json[0]);

        // Move the decorations to account for document changes
        value = value.map(tr.changes);

        if (!texprl.runtimeEnabled) {
          return value;
        }

        ctx.errors = result.errors || [];

        result.errors.forEach((error) => {
          const node = walk(ast, error.path);

          if (!node) {
            console.debug("TODO: No node for error", {
              error: error,
              path: error.path,
            });
            return;
          }

          const { from, to } = node;

          const markFrom = from < to ? from : Math.max(0, from - 1);
          const markTo = to;

          if (markFrom !== markTo) {
            const mark = addMarks.of([
              runtimeErrorMark.range(
                from < to ? from : Math.max(0, from - 1),
                to
              ),
            ]);
            value = value.update({
              add: mark.value,
            });
          } else {
            console.warn("skipping node=", node);
          }
        });

        return value;
      },
      // Indicate that this field provides a set of decorations
      provide: (f) => EditorView.decorations.from(f),
    }),
    errorPanelExt(ctx),
    errorPanelTheme,
  ];
}
