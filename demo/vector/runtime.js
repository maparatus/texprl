import { RuntimeError } from "../../errors/index.js";
import { generateValidatedOperators } from "../../runtime-helpers.js";
import Vector from "./Vector.js";

/**
 * There operators are for named functions, you can add anything you like here.
 */
const operators = generateValidatedOperators([
  {
    name: "vec",
    handler: (x, y) => {
      return new Vector(x, y);
    },
  },
  {
    name: "+",
    handler: (a, b) => {
      console.log("?????", { a, b });
      if (typeof a === "number") {
        return a + b;
      }
      return a.add(b);
    },
    args: {
      length: 2,
      binaryExpression: true,
    },
  },
  {
    name: "-",
    handler: (a, b) => {
      if (typeof a === "number") {
        return a - b;
      }
      return a.substract(b);
    },
    args: {
      length: 2,
      binaryExpression: true,
    },
  },
  {
    name: "/",
    handler: (a, b) => {
      if (typeof a === "number") {
        return a / b;
      }
      return a.divide(b);
    },
    args: {
      length: 2,
      binaryExpression: true,
    },
  },
  {
    name: "*",
    handler: (a, b) => {
      if (typeof a === "number") {
        return a * b;
      }
      return a.multiply(b);
    },
    args: {
      length: 2,
      binaryExpression: true,
    },
  },
  {
    name: "lenSq",
    handler: (a) => {
      return a.lenSq();
    },
    args: {
      length: 1,
    },
  },
  {
    name: "len",
    handler: (a) => {
      if (a) {
        const out = a.len();
        console.log("len:out", out);
        return out;
      }
    },
    args: {
      length: 1,
    },
  },
  {
    name: "norm",
    handler: (a) => {
      return a.norm();
    },
    args: {
      length: 1,
      def: [Vector],
    },
  },
  {
    name: "equals",
    handler: (a, b) => {
      return a.equals(b);
    },
    args: {
      length: 2,
    },
  },
]);

function _call(arr, errors, path = [0]) {
  if (Array.isArray(arr)) {
    const [op] = arr;
    console.log("_call args=", arr);
    const args = arr.slice(1);

    if (operators[op]) {
      const argsToPass = args.map((i, index) =>
        _call(i, errors, path.concat(index))
      );
      try {
        return operators[op].apply({ path }, argsToPass);
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

export default function call(arr) {
  const errors = [];
  return {
    output: _call(arr, errors),
    errors,
  };
}
