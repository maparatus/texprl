import {
  StateEffect,
  StateField,
  EditorState,
  SelectionRange,
  Compartment,
} from "@codemirror/state";
import { keymap, Decoration } from "@codemirror/view";
import { toArrayAst } from "../parser/index.js";
import { EditorView } from "@codemirror/basic-setup";
import { syntaxTree } from "@codemirror/language";

function walk(arr, path) {
  let out = arr;
  let idx = 0;
  let len = path.length;
  while (idx < len) {
    out = out.children[path[idx]];
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
  return StateField.define({
    // Start with an empty set of decorations
    create() {
      return Decoration.none;
    },
    // This is called whenever the editor updates—it computes the new set
    update(value, tr) {
      const ast = toArrayAst(tr.state.doc, syntaxTree(tr.state), texprl);
      const json = toJson(ast);
      const result = texprl.runtime(json[0]);

      // Move the decorations to account for document changes
      value = value.map(tr.changes);

      value = value.update({
        filter: () => false,
      });

      result.errors.forEach((error) => {
        const node = walk(ast, error.path);
        const { from, to } = node;

        const mark = addMarks.of([
          runtimeErrorMark.range(from < to ? from : from - 1, to),
        ]);
        value = value.update({
          add: mark.value,
        });
      });

      return value;
    },
    // Indicate that this field provides a set of decorations
    provide: (f) => EditorView.decorations.from(f),
  });
}
