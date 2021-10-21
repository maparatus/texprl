import {RuntimeError} from '../texprl.js';

/**
 * These are generated by non function syntax in the language.
 */
const langOperators = {
  "array": (...v) => v,
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
}

/**
 * There operators are for named functions, you can add anything you like here.
 */
const operators = {
  ...langOperators,
  "pow": (a, b) => Math.pow(a,b),
  "at": (index, arr) => {
    if (!Array.isArray(arr)) {
      throw new Error("Argument not an list");
    }
    return arr.at(index);
  },
  "equals": (a, b) => a === b,
  "not_equals": (a, b) => a !== b,
  "all": (...v) => v.every(Boolean),
  "any": (...v) => !!v.find(Boolean),
  "none": (...v) => !v.find(Boolean),
}

export default function call (arr, path=[]) {
  if (Array.isArray(arr)) {
    const [op] = arr;
    const args = arr.slice(1);

    if (operators[op]) {
      const argsToPass = args.map((i, index) => call(i, path.concat(index)));
      return operators[op].apply(undefined, argsToPass);
    }
    else {
      // TODO: This should throw errors with positional info.
      throw new RuntimeError(`No such function: ${op}`, {
        path,
      });
    }
  }
  else {
    return arr;
  }
}

