import { parser as parserSetup } from "./lang.js";
import { styleTags, tags } from "@codemirror/highlight";

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

export default parser;

const MATH = ["+", "-", "/", "*"];

function isMath(v) {
  return MATH.includes(v[0]);
}

function getPrecedence(node) {
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
    convertExpr(v[2], texprl, v),
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

function tryit(fn, dflt) {
  try {
    return fn();
  } catch (err) {
    // console.debug(err);
  }
  return dflt;
}

function toObj(doc, node, texprl) {
  // if (node.parent && node.parent.type && (node.parent.type.name === "Dictionary" || node.parent.type.name === "List")) {
  //   let value = doc.slice(node.from, node.to).toString();
  //   const out = tryit(() => JSON.parse(value), {});
  //   console.log("??? out=", out, value);
  //   return out;
  // }
  if (node.type.name === "Dictionary") {
    return ["literal"];
  }
  if (node.type.name === "Number") {
    let value = doc.slice(node.from, node.to);
    return Number(value.toString());
  }
  if (node.type.name === "Bool") {
    let value = doc.slice(node.from, node.to);
    return value.toString() === "true" ? true : false;
  }
  if (node.type.name === "Lookup") {
    let value = doc.slice(node.from, node.to);
    const found = texprl.checkLookup(value.toString().replace(/^#/, ""));
    if (found) {
      return found.backendId;
    }
  }
  if (node.type.name === "String") {
    let value = doc.slice(node.from, node.to);
    return value.toString().replace(/^"|"$/g, "");
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
  if (
    nodeIsArray &&
    (node.value[0] === "BinaryExpression" ||
      node.value[0] === "BinaryExpressionWrap")
  ) {
    const children = [];
    if (node.children[0]) children.push(collapseBinaryExpr(node.children[0]));
    if (node.children[2]) children.push(collapseBinaryExpr(node.children[2]));
    return {
      ...node.children[1],
      children: children,
    };
  } else {
    return {
      ...node,
      children: node.children.map(collapseBinaryExpr),
    };
  }
}

function renameFunc (expr, renames) {
  if (Array.isArray(expr.value)) {
    const currentFunctionName = expr.value[0];
    const found = renames.find(([astName, textName]) => {
      return textName === currentFunctionName
    });

    if (found) {
      const [astName] = found;
      return {
        ...expr,
        value: [astName],
      };
    }
  }
  return expr;
}

function renameFunctions (expr, renames) {
  const out = renameFunc({
    ...expr,
    children: expr.children.map((subExpr) => renameFunctions(subExpr, renames)),
  }, renames);

  return out ;
}

export function toArrayAst(doc, tree, texprl) {
  const map = new Map();
  let top;

  const cursor = tree.cursor();
  do {
    const node = cursor.node;
    const obj = {
      from: node.from,
      to: Math.min(node.to, tree.length - 1),
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
  top = renameFunctions(top, texprl.functionRenames);
  return top;
}
