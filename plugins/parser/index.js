import { LRLanguage } from "../../_snowpack/pkg/@codemirror/language.js";
import { Compartment } from "../../_snowpack/pkg/@codemirror/state.js";
import { LanguageSupport } from "../../_snowpack/pkg/@codemirror/language.js";
import parser from "../../parser/index.js";
import { syntaxTree } from "../../_snowpack/pkg/@codemirror/language.js";

export const exampleLanguage = LRLanguage.define({
  parser,
  languageData: {
    closeBrackets: {
      brackets: ["(", "[", '"', "{"],
      before: ',)]}"',
    },
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

function getIndex(node) {
  let index = 0;
  while ((node = node.prevSibling)) {
    index++;
  }
  return index;
}

const span = /^[\w]*/;
const completionSource = (texprl) => {
  const lookupCallback = texprl.lookup;

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
      const options = texprl.functionAutocomplete();
      return {
        from: node.from,
        options: options,
        span,
      };
    } else if (node.parent && node.parent.type.name === "FunctionExpr") {
      let parentValue = state.doc.slice(node.parent.from, node.parent.to);

      const index = getIndex(node);
      const [, fnName] = parentValue.toString().match(/^(.*)\(/);
      const options = texprl.argAutocomplete(fnName, index);

      return {
        from: node.from + 1,
        options: options,
        filter: false,
        span,
      };
    }

    return null;
  };
};

function pluginSetup(texprl) {
  const completion = exampleLanguage.data.of({
    autocomplete: completionSource(texprl),
  });
  return new LanguageSupport(exampleLanguage, [completion]);
}

export default function plugin(lookupCallback) {
  const language = new Compartment();
  return language.of(pluginSetup(lookupCallback));
}
