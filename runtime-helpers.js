import { RuntimeError } from "./errors/index.js";

function asString(input) {
  if (typeof input === "function") {
    return input.name;
  }
  return String(input);
}

function checkArgs(def, args, context) {
  if (!def.args) {
    return;
  }

  // Check number of arguments...
  if (def.args.length && args.length !== def.args.length) {
    throw new RuntimeError(
      `'${def.name}' expects ${def.args.length} args, found ${args.length}`,
      {
        path: context.path,
      }
    );
  }

  // Check types of arguments...
  if (def.args.def) {
    const errAt = def.args.def.findIndex((t, idx) => {
      if (typeof t === "function" && t.prototype) {
        return !(args[idx] instanceof t);
      }
      if (t === "*") {
        return false;
      }
      if (t === "Array") {
        return !Array.isArray(args[idx]);
      }
      return typeof args[idx] !== t;
    });

    if (errAt > -1) {
      const expectedType = asString(def.args.def[errAt]);
      let message = `Argument ${errAt} must be ${expectedType}`;
      if (def.args.binaryExpression) {
        message = `Expected ${expectedType}`;
      }
      throw new RuntimeError(message, {
        path: context.path.concat(errAt),
      });
    }
  }
}

export function generateValidatedOperators(ops = []) {
  const out = {};
  ops.forEach((op) => {
    out[op.name] = function (...args) {
      checkArgs(op, args, this);
      return op.handler.apply(this, args);
    };
  });
  return out;
}
