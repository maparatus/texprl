import { v8 } from "./_snowpack/pkg/maplibre-gl/dist/style-spec.js";

let specFns = Object.entries(v8.expression_name.values).map(([key, value]) => {
  return {
    name: key,
    doc: value.doc,
  };
});

/**
 * Add in some missing functions and docs
 */
specFns = specFns.concat([
  {
    name: "linear",
    doc: "Interpolates linearly between the pair of stops just less than and just greater than the input.",
  },
  {
    name: "exponential",
    doc: "Interpolates exponentially between the stops just less than and just greater than the input.",
  },
  {
    name: "cubic-bezier",
    doc: "Interpolates using the cubic bezier curve defined by the given control points.",
  },
]);

const expressionFns = specFns.map(({ name, doc }) => {
  const renameFn = (name) => {
    if (name === "-") {
      return name;
    }
    return name.replace(/-/g, "_");
  };

  return {
    type: "class",
    label: renameFn(name),
    detail: `— ${doc}`,
  };
});

const definition = {
  features: {
    lookup: false,
    array: true,
    dictionary: true,
  },
  functions: {
    argAutocomplete: () => {
      return [];
    },
    functionAutocomplete: () => {
      return expressionFns;
    },
    renames: [
      ["%", "mod"],
      ["^", "pow"],
      ["!", "not"],
      ["!=", "ne"],
      ["==", "eq"],
      ["<", "lt"],
      ["<=", "le"],
      [">", "gt"],
      [">=", "ge"],
      ["interpolate-hcl", "interpolate_hcl"],
      ["number-format", "number_format"],
      ["to-boolean", "to_boolean"],
      ["to-color", "to_color"],
      ["to-number", "to_number"],
      ["to-string", "to_string"],
      ["feature-state", "feature_state"],
      ["geometry-type", "geometry_type"],
      ["line-progress", "line_progress"],
      ["index-of", "index_of"],
      ["interpolate-hcl", "interpolate_hcl"],
      ["interpolate-lab", "interpolate_lab"],
      ["is-supported-script", "is_supported_script"],
      ["resolved-locale", "resolved_locale"],
      ["to-rgba", "to_tgba"],
      ["heatmap-density", "heatmap_density"],
    ],
    types: {
      format: (index) => {
        if (index % 2 === 1) {
          return ["object"];
        }
      },
      "number-format": (index) => {
        if (index % 2 === 1) {
          return ["object"];
        }
      },
      collator: (index) => {
        if (index % 2 === 1) {
          return ["object"];
        }
      },
      literal: (index) => {
        return ["object", "array", "any"];
      },
    },
    format: [
      {
        name: "all",
        breakAfter: true,
      },
      {
        name: "format",
        breakAfter: (length, index) => {
          if (index === 0) {
            return true;
          } else if (length - 1 === index) {
            return true;
          } else if ((index - 1) % 2 === 1) {
            return true;
          }
          return false;
        },
      },
    ],
  },
};

export default definition;
