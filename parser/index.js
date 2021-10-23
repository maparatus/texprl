import { parser as parserSetup } from "./lang.js";
import { foldNodeProp, foldInside, indentNodeProp } from "@codemirror/language";
import { styleTags, tags } from "@codemirror/highlight";
import { LRLanguage } from "@codemirror/language";
import { LanguageSupport } from "@codemirror/language";
import { syntaxTree } from "@codemirror/language";


const parser = parserSetup.configure({
  props: [
    styleTags({
      Name: tags.variableName,
      Number: tags.number,
      Bool: tags.bool,
      String: tags.string,
      ",": tags.separator,
      "[ ]": tags.squareBracket,
      "{ }": tags.brace,
      FnName: tags.number,
      List: tags.list,
      Lookup: tags.atom,
    }),
  ],
});

export {parser};

const MATH = ["+", "-", "/", "*"];

function isMath(v) {
  return MATH.includes(v[0]);
}

function getPrecedence (node) {
  if (!node) return -1;
  if (node[0] === "+" || node[0] === "-") return 0;
  if (node[0] === "*" || node[0] === "/") return 1;
}

// TODO: Make math better...
function toMath(v, texprl, parent) {
  const parentPrecedence = getPrecedence(parent);
  const currentPrecedence = getPrecedence(v);
  const out = [
    convertExpr(v[1], texprl, v), 
    v[0],
    convertExpr(v[2], texprl, v)
  ].join("");

  if (parentPrecedence > currentPrecedence) {
    return `(${out})`;
  }
  return out;
}

function convertExpr(v, texprl, parent) {
  let sep = ", ";
  if (isMath(v)) {
    return toMath(v, texprl, parent);
  }
  // TODO: FIXME
  else if (Array.isArray(v) && v[0] === "read") {
    const out = texprl.checkLookupFromBackendId(v[1]);
    if (out) {
      return `#${out.editorId}`;
    } else {
      return `#invalid`;
    }
  } else if (Array.isArray(v)) {
    const fnName = v[0];
    let beginSep = "";
    let endSep = "";
    if (["all", "any"].includes(fnName)) {
      beginSep = "\n  ";
      endSep = "\n";
      sep = ",\n  ";
    }
    const args = v
      .slice(1)
      .map((iv) => convertExpr(iv, texprl, v))
      .join(sep);
    return `${v[0]}(${beginSep}${args}${endSep})`;
  } else {
    return JSON.stringify(v);
  }
}

export function fromArrayAst(arr, texprl) {
  const foo = arr.map((item) => convertExpr(item, texprl, null)).join("\n");
  return foo;
}

function toObj(doc, node, texprl) {
  if (node.type.name === "Number") {
    let value = doc.slice(node.from, node.to);
    return Number(value);
  }
  if (node.type.name === "Bool") {
    let value = doc.slice(node.from, node.to);
    return value === "true" ? true : false;
  }
  if (node.type.name === "Lookup") {
    let value = doc.slice(node.from, node.to);
    const found = texprl.checkLookup(value.replace(/^#/, ""));
    if (found) {
      return found.backendId;
    }
  }
  if (node.type.name === "String") {
    let value = doc.slice(node.from, node.to);
    return value.replace(/^"|"$/g, "");
  }
  if (node.type.name === "List") {
    return ["array"];
  }
  const MathSymbols = {
    Div: "/",
    Plus: "+",
    Times: "*",
    Minus: "-",
  };
  if (Object.keys(MathSymbols).includes(node.type.name)) {
    return [MathSymbols[node.type.name]];
  }
  if (node.type.name === "Program") {
    return [];
  }
  if (node.type.name === "FunctionExpr") {
    let value = doc
      .slice(node.from, node.to)
      .toString()
      .replace(/[(][\s\S]+$/m, "");
    return [value];
  }
  if (node.type.name === "⚠") {
    return ["$$ERROR"];
  }
  return [node.type.name];
}

function collapseBinaryExpr(node) {
  const nodeIsArray = Array.isArray(node.value);
  if (nodeIsArray && (node.value[0] === "BinaryExpression" || node.value[0] === "BinaryExpressionWrap")) {
    const children = [];
    if (node.children[0]) children.push(collapseBinaryExpr(node.children[0]));
    if (node.children[2]) children.push(collapseBinaryExpr(node.children[2]));
    return {
      ...node.children[1],
      children: children,
    };
  }
  else {
    return {
      ...node,
      children: node.children.map(collapseBinaryExpr),
    };
  }
}

export function toArrayAst(doc, tree, texprl) {
  const map = new Map();
  let top;

  const cursor = tree.cursor();
  do {
    const node = cursor.node;
    const obj = {
      from: node.from,
      to: node.to,
      value: toObj(doc, node, texprl),
      children: [],
    };
    if (!top) {
      top = obj;
    }

    const parentObj = map.get(node.parent);
    if (parentObj) {
      parentObj.children.push(obj);
    }
    map.set(node, obj);
  } while (cursor.next());

  top = collapseBinaryExpr(top);
  return top;
}

export const exampleLanguage = LRLanguage.define({
  parser,
  languageData: {
    closeBrackets: { brackets: ["(", "[", '"'] },
    indentOnInput: /^\s*[\}\]]$/,
  },
});

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
].map((name) => ({ type: "class", label: name }));

const span = /^[\w-]*/;

const cssCompletionSource = (lookupCallback) => {
  return (context) => {
    const lookup = lookupCallback();
    let { state, pos } = context,
      node = syntaxTree(state).resolveInner(pos, -1);

    if (node.type.name === "Lookup") {
      return {
        from: node.from + 1,
        options: lookup.map(({ editorId, name }) => {
          const label = `${editorId}`;
          return {
            type: "class",
            label: label,
            detail: `— ${name}`,
          };
        }),
        filter: false,
        span,
      };
    } else if (node.type.name === "FunctionExpr") {
      return { from: node.from, options: pseudoClasses, span };
    } else if (node.parent && node.parent.type.name === "FunctionExpr") {
      let parentValue = state.doc.slice(node.parent.from, node.parent.to);
      if (parentValue.match(/^device/)) {
        return {
          from: node.from + 1,
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
          span,
        };
      }
    }

    return null;
  };
};

export function wast(lookupCallback) {
  const completion = exampleLanguage.data.of({
    autocomplete: cssCompletionSource(lookupCallback),
  });
  return new LanguageSupport(exampleLanguage, [completion]);
}
