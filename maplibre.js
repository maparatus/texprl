const definition = {
  features: {
    lookup: false,
    array: true,
    dictionary: true,
  },
  functions: {
    // TODO: This should probably be split out to autocomplete
    //  - function names
    //  - argument names
    autocomplete: (fnName, index) => {
      return [];
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
