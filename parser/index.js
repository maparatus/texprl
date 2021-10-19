import {parser} from "./lang.js";
import {foldNodeProp, foldInside, indentNodeProp} from "@codemirror/language";
import {styleTags, tags} from "@codemirror/highlight";
import {LRLanguage} from "@codemirror/language";
import {LanguageSupport} from "@codemirror/language";
import {syntaxTree} from "@codemirror/language"


const MATH = ["+", "-", "/", "*"];

function isMath(v) {
  return MATH.includes(v[0]);
}

function toMath (v, texprl) {
  return [
    "(",
    convertExpr(v[1]),
    ,v[0],
    convertExpr(v[2]),
    ")"
  ].join("");
}

function convertExpr (v, texprl, sep=", ") {
  if (isMath(v)) {
    return toMath(v, texprl);
  }
  // TODO: FIXME
  else if (Array.isArray(v) && v[0] === "read") {
    const out = texprl.checkLookupFromBackendId(v[1]);
    if (out) {
      return `#${out.editorId}`;
    }
    else {
      return `#invalid`;
    }
  }
  else if (Array.isArray(v)) {
    const fnName = v[0];
    let beginSep = '';
    let endSep = '';
    if (["all", "any"].includes(fnName)) {
      beginSep = '\n  ';
      endSep = '\n';
      sep = ',\n  ';
    }
    const args = v.slice(1).map(iv => convertExpr(iv, texprl)).join(sep);
    return `${v[0]}(${beginSep}${args}${endSep})`;
  }
  else {
    return JSON.stringify(v);
  }
}

export function fromArrayAst(arr, texprl) {
  const foo =  arr.map((item) => convertExpr(item, texprl)).join("\n");
  console.log("FOO", foo);
  return foo;
}

function toObj (view, node, texprl) {
  if (node.type.name === "Number") {
    let value = view.state.doc.sliceString(node.from, node.to);
    return Number(value);
  }
  if (node.type.name === "Bool") {
    let value = view.state.doc.sliceString(node.from, node.to);
    return Boolean(value);
  }
  if (node.type.name === "Lookup") {
    let value = view.state.doc.sliceString(node.from, node.to);
    const found = texprl.checkLookup(value.replace(/^#/, ""));
    if (found) {
      return found.backendId;
    }
  }
  if (node.type.name === "String") {
    let value = view.state.doc.sliceString(node.from, node.to);
    return value.replace(/^"|"$/g, "");
  }
  if (node.type.name === "List") {
    return ["array"];
  }
  const MathSymbols = {
    "Div": "/",
    "Plus": "+",
    "Times": "*",
    "Minus": "-",
  }
  if (Object.keys(MathSymbols).includes(node.type.name)) {
    return [MathSymbols[node.type.name]];
  }
  if (node.type.name === "Program") {
    return [];
  }
  if (node.type.name === "FunctionExpr") {
    let value = view.state.doc.sliceString(node.from, node.to).replace(/[(][\s\S]+$/m, "");
    return [value];
  }
  if (node.type.name === "⚠") {
    return ["$$ERROR"];
  }
  return [node.type.name];
}

function collapseBinaryExpr (node) {
  const nodeIsArray = Array.isArray(node);
  if (nodeIsArray && node[0] === "BinaryExpression") {
    return [
      node[2][0],
      collapseBinaryExpr(node[1]),
      collapseBinaryExpr(node[3])
    ];
  }
  if (nodeIsArray) {
    return node.map(collapseBinaryExpr);
  }
  return node;
}

export function toArrayAst (view, texprl) {
  const map = new Map();
  let top;
  const tree = syntaxTree(view.state);

  const cursor = tree.cursor();
  do {
    const node = cursor.node;
    const obj = toObj(view, node, texprl);
    if (!top) {
      top = obj;
    }

    const parentObj = map.get(node.parent);
    if (parentObj) {
      parentObj.push(obj);
    }
    map.set(node, obj);
  } while (cursor.next())

  top = collapseBinaryExpr(top);
  return top;
}

export const exampleLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        "Name": tags.variableName,
        "Number": tags.number,
        "Bool": tags.bool,
        "String": tags.string,
        ",": tags.separator,
        "[ ]": tags.squareBracket,
        "{ }": tags.brace,
        "FnName": tags.number,
        "List": tags.list,
        "Lookup": tags.atom,
      }),
    ]
  }),
  languageData: {
    closeBrackets: {brackets: ["(", "[", '"']},
    indentOnInput: /^\s*[\}\]]$/,
  },
})

const pseudoClasses = [
  "and",
  "or",
  "not",
  "contains",
  "starts_with",
  "constant",
  "read",
  "dataset_field",
  "dataset_uniques",
  "device",
  "feature_field",
  "feature_well_known",
  "device",
  // ---- additional ----
  "rgb",
  "zoom",
].map(name => ({type: "class", label: name}))

const span = /^[\w-]*/;

const cssCompletionSource = (lookupCallback) => {
  return context => {
    const lookup = lookupCallback();
    let {state, pos} = context, node = syntaxTree(state).resolveInner(pos, -1);

    console.log("node=", node, pos);
    if (node.type.name === "Lookup") {
      console.log("node=HERE");
      return {
        from: node.from+1,
        options: lookup.map(({editorId, name}) => {
          const label = `${editorId}`;
          console.log("node=", {label});
          return {
            type: "class",
            label: label,
            detail: `— ${name}`,
          };
        }),
        filter: false,
        span
      };
    }
    else if (node.type.name === "FunctionExpr") {
      return {from: node.from, options: pseudoClasses, span};
    }
    else if (node.parent.type.name === "FunctionExpr") {
      let parentValue = state.doc.sliceString(node.parent.from, node.parent.to);
      console.log("node=value=", {parentValue});
      if (parentValue.match(/^device/)) {
        console.log("node=found");
        return {
          from: node.from+1,
          options: [
            {
              type: "class",
              label: "current_date_time",
              detail: "— date and time on the device",
            },
            {
              type: "class",
              label: "current_latitude",
              detail: "— latitude part of the devices location",
            },
            {
              type: "class",
              label: "current_longitude",
              detail: "— longitude part of the devices location",
            },
            {
              type: "class",
              label: "current_latitude_longitude",
              detail: "— longitude and latitude of the devices location",
            },
          ],
          filter: false,
          span
        };
      }
    }

    return null;
  };
}

export function wast (lookupCallback) {
  const completion = exampleLanguage.data.of({
    autocomplete: cssCompletionSource(lookupCallback)
  });
  return new LanguageSupport(
    exampleLanguage,
    [completion]
  );
}
