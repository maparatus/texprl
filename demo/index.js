import stringify from "json-stringify-pretty-compact";
import runtime from './runtime.js';

import "../texprl.css";
import {
  TexprlEditor,
  BooleanWidget,
  ColorWidget,
  DateTimeWidget,
  DateWidget,
  ReferenceWidget,
  toArrayAst,
  fromArrayAst,
} from "../texprl.js";

/**
 * ============================================================================
 * A simple abstract example showing off the features of the editor
 * ============================================================================
 */
const doc = `all(
  equals(rgb(255, 0, 0), hsl(0, 100, 50)),
  not_equals(1, 1.22),
  equals("hello", to_lower("HELLO")),
  not_equals(true, false),
  equals(read(#foobar), "testing"),
  not_equals("2020-10-01", "2020-10-01T12:30"),
  equals(length(["one",2,false]), 3),
)`;

const useRuntimeEl = document.querySelector("#action-use-runtime");
const debugEl = document.querySelector("#debug");
const sExprEl = document.querySelector("#s-expr");
const formattedEl = document.querySelector("#formatted");
const actionAutoformatButton = document.querySelector("#action-auto-format");

let useRuntime = false;
useRuntimeEl.addEventListener("change", (e) => {
  const {checked} = e.target;
  exprContainerEl.style.display = (checked ? 'block' : 'none');
  useRuntime = checked;
});

const exprContainerEl = document.querySelector("#expr-result-container");
const exprResultEl = document.querySelector("#expr-result");
const exprErrorEl = document.querySelector("#expr-error");

function showDebugInfo(texprl) {
  const json = toArrayAst(texprl.view, texprl);
  try {
    const formatted = fromArrayAst(json, texprl);
    formattedEl.value = formatted;
  } catch (err) {
    formattedEl.value = `Failed: ${err}`;
  }

  if (useRuntime) {
    try {
      const result = runtime(json[0]);
      console.log("result=", result);
      exprResultEl.value = JSON.stringify(result);
      exprErrorEl.innerText = "";
    } catch (err) {
      console.log("failed=", err);
      exprResultEl.value = "";
      exprErrorEl.innerText = err;
    }
  }

  debugEl.value = texprl.view.state.doc.text.join("\n");
  sExprEl.value = stringify(json);
}

const el = document.querySelector("#editor");
const editor = new TexprlEditor(el, doc, {
  onDispatch: showDebugInfo,
  features: {
    // You can disable reference types in the language, which will cause a
    // warning in the editor.
    reference: true,
  },
  widgets: [
    { type: "Boolean", widget: BooleanWidget },
    { type: "Color", widget: ColorWidget },
    { type: "DateTime", widget: DateTimeWidget },
    { type: "Date", widget: DateWidget },
    { type: "Reference", widget: ReferenceWidget },
  ],
  functions: [
    // {name: "foo"},
    // {name: "bar"},
    // {
    //   name: "read",
    //   lookup: {
    //     "0": "PERSON",
    //   }
    // }
  ],
});

actionAutoformatButton.addEventListener("click", () => {
  editor.autoFormat();
});

/**
 * ============================================================================
 * TODO: Add in a react speadsheet in here to add more data for autocomplete.
 * ============================================================================
 */

// Update lookups
editor.setLookup([
  {
    type: "PERSON",
    values: [
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
    ],
  },
]);
