import { RuntimeError } from "../errors/index.js";
import { generateValidatedOperators } from "../runtime-helpers.js";

/**
 * These are generated by non function syntax in the language.
 */
const langOperators = [
  {
    name: "literal",
    handler: (v) => v,
  },
  {
    name: "array",
    handler: (...v) => v,
  },
  {
    name: "+",
    handler: (a, b) => a + b,
    args: {
      length: 2,
      binaryExpression: true,
      def: ["number", "number"],
    },
  },
  {
    name: "-",
    handler: (a, b) => a - b,
    args: {
      length: 2,
      binaryExpression: true,
      def: ["number", "number"],
    },
  },
  {
    name: "*",
    handler: (a, b) => a * b,
    args: {
      length: 2,
      binaryExpression: true,
      def: ["number", "number"],
    },
  },
  {
    name: "/",
    handler: (a, b) => a / b,
    args: {
      length: 2,
      binaryExpression: true,
      def: ["number", "number"],
    },
  },
];

/**
 * There operators are for named functions, you can add anything you like here.
 */
const operators = generateValidatedOperators([
  ...langOperators,
  {
    name: "read",
    args: {
      length: 1,
      def: ["string"],
    },
    handler: function (key) {
      return this.lookupRef(key);
    },
  },
  {
    name: "len",
    args: {
      length: 1,
      def: ["string"],
    },
    handler: function (a, b) {
      return a.length;
    },
  },
  {
    name: "^",
    args: {
      length: 2,
      def: ["number", "number"],
    },
    handler: function (a, b) {
      return Math.pow(a, b);
    },
  },
  {
    name: "at",
    args: {
      length: 2,
      def: ["number", "array"],
    },
    handler: function (index, arr) {
      return arr.at(index);
    },
  },
  {
    name: "equals",
    args: {
      length: 2,
    },
    handler: (a, b) => a === b,
  },
  {
    name: "not_equals",
    args: {
      length: 2,
    },
    handler: (a, b) => a !== b,
  },
  {
    name: "all",
    handler: (...v) => v.every(Boolean),
  },
  {
    name: "any",
    handler: (...v) => !!v.find(Boolean),
  },
  {
    name: "none",
    handler: (...v) => !v.find(Boolean),
  },
]);

function _call(texprlInstance, arr, errors, path = [0]) {
  if (Array.isArray(arr)) {
    const [op] = arr;
    const args = arr.slice(1);

    if (operators[op]) {
      const argsToPass = args.map((i, index) =>
        _call(texprlInstance, i, errors, path.concat(index))
      );
      try {
        return operators[op].apply(
          {
            path,
            lookupRef: (v) => {
              const obj = texprlInstance.checkLookupFromBackendId(v);
              if (obj) {
                return obj.backendId;
              }
            },
          },
          argsToPass
        );
      } catch (err) {
        errors.push(err);
      }
    } else {
      // TODO: This should throw errors with positional info.
      errors.push(
        new RuntimeError(`No such function: ${op}`, {
          path,
        })
      );
    }
  } else {
    return arr;
  }
}

export default function call(instance, arr) {
  const errors = [];
  return {
    output: _call(instance, arr, errors),
    errors,
  };
}
