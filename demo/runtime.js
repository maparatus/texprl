const fn = {
  "math": (v) => v,
  "pow": (a, b) => Math.pow(a,b),
  "at": (i, v) => v.at(i),
  "+": (a, b) => a+b,
  "-": (a, b) => a-b,
  "*": (a, b) => a*b,
  "/": (a, b) => a/b,
  "array": (...v) => v,
}

export default function call (arr) {
  if (Array.isArray(arr)) {
    const [op] = arr;
    const args = arr.slice(1);

    if (fn[op]) {
      const argsToPass = args.map(call);
      return fn[op].apply(undefined, argsToPass);
    }
    else {
      // TODO: This should throw errors with positional info.
      throw new Error(`No such function: ${op}`);
    }
  }
  else {
    return arr;
  }
}

