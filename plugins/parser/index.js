import { LRLanguage } from "@codemirror/language";
import { Compartment } from "@codemirror/state";
import { LanguageSupport } from "@codemirror/language";
import parser from "../../parser";
import { syntaxTree } from "@codemirror/language";

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
const completionSource = (lookupCallback) => {
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
      if (parentValue.toString().match(/^device/)) {
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

function pluginSetup(lookupCallback) {
  const completion = exampleLanguage.data.of({
    autocomplete: completionSource(lookupCallback),
  });
  return new LanguageSupport(exampleLanguage, [completion]);
}

export default function plugin (lookupCallback) {
  const language = new Compartment();
  return language.of(pluginSetup(lookupCallback));
}

