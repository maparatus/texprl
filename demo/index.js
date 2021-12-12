import { basicSetup } from "../codemirror";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import stringify from "json-stringify-pretty-compact";
import runtime from "./runtime.js";
import { syntaxTree } from "@codemirror/language";
import maplibreDefinition from "../maplibre";

import "../texprl.css";
import texprl, { toArrayAst, fromArrayAst } from "../texprl.js";

const qs = document.querySelector.bind(document);
const useRuntimeEl = qs("#action-use-runtime");
const debugEl = qs("#debug");
const sExprEl = qs("#s-expr");
const formattedEl = qs("#formatted");
const actionAutoformatButton = qs("#action-auto-format");
const exprContainerEl = qs("#expr-result-container");
const exprResultEl = qs("#expr-result");
const exprErrorEl = qs("#expr-error");
const el = qs("#editor");

function toJson(obj) {
  if (Array.isArray(obj.value)) {
    return obj.value.concat(obj.children.map(toJson));
  } else {
    return obj.value;
  }
}

function showDebugInfo(texprl) {
  console.log("showDebugInfo", texprl);
  return (view) => {
    const ast = toArrayAst(view.state.doc, syntaxTree(view.state), texprl);

    const json = toJson(ast);
    try {
      const formatted = fromArrayAst(json, texprl);
      formattedEl.value = formatted;
    } catch (err) {
      formattedEl.value = `Failed: ${err}`;
    }

    if (useRuntime) {
      try {
        const result = runtime(texprlInstance, json[0]);

        if (result.errors.length > 0) {
          exprResultEl.value = "";
          exprErrorEl.innerHTML = result.errors
            .map((err) => "Error: " + err.message)
            .join("<br>");
        } else {
          exprResultEl.value = JSON.stringify(result.output);
          exprErrorEl.innerText = "";
        }
      } catch (err) {
        console.log("failed=", err);
        exprResultEl.value = "";
        exprErrorEl.innerText = err;
      }
    }

    debugEl.value = view.state.doc.text.join("\n");
    sExprEl.value = stringify(ast);
  };
}

const texprlInstance = texprl({
  ...maplibreDefinition,
  runtime: runtime,
  lookup: () => {
    return [
      {
        editorId: "jane",
        backendId: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
        name: "Jane Austen",
      },
      {
        editorId: "allen",
        backendId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        name: "Allen Ginsberg",
      },
    ];
  },
});

let useRuntime = false;
useRuntimeEl.addEventListener("change", (e) => {
  const { checked } = e.target;
  exprContainerEl.style.display = checked ? "block" : "none";
  texprlInstance.setRuntimeEnabled(checked);
  useRuntime = checked;
});

const state = EditorState.create({
  // doc: "1-1-1+9+pow(2, 2)",
  doc: "#jane",
  extensions: [
    basicSetup,
    texprlInstance.plugin(),
    EditorView.updateListener.of(showDebugInfo(texprlInstance)),
  ],
});

const view = new EditorView({
  state: state,
  parent: el,
});

actionAutoformatButton.addEventListener("click", () => {
  const ast = toArrayAst(
    view.state.doc,
    syntaxTree(view.state),
    texprlInstance
  );
  const json = toJson(ast);
  const formatted = fromArrayAst(json, texprlInstance);

  const tx = view.state.update({
    changes: {
      from: 0,
      to: view.state.doc.length,
      insert: formatted,
    },
  });
  view.update([tx]);
});
