import assert from "assert";
import { parser, toArrayAst } from "../parser/index.js";
import assertions from "./assertions/index.js";

function hasError(expected) {
  return !!JSON.stringify(expected).match(/\$\$ERROR/);
}

describe("texprl", () => {
  describe("parser", () => {
    assertions.forEach(
      ({ skip, only, input, expected, errors: expectedError, checkLookup }, index) => {
        const indexStr = `${index}`.padStart(3, "0");
        let statusStr;
        if (expectedError) {
          statusStr = "hard_err ";
        } else if (hasError(expected)) {
          statusStr = "parse_err";
        } else {
          statusStr = "parse_ok ";
        }
        const name = `test #${indexStr} ${statusStr} — '${input}'`;

        const fn = () => {
          let actual;
          let actualError;

          try {
            const tree = parser.parse(input);
            actual = toArrayAst(input, tree, { checkLookup });
          } catch (error) {
            actualError = error;
          }

          // setTimeout(() => {
          //   console.log(JSON.stringify(actual, null, 2));
          // }, 100)

          if (expectedError && actualError) {
            assert(actualError);
          } else if (expected) {
            assert.deepStrictEqual(actual, expected);
          } else {
            // console.log(JSON.stringify(actual, null, 2));
            console.error(actualError);
            throw "missing";
          }
        };
        if (skip) {
          it.skip(name, fn);
        }
        else if (only) {
          it.only(name, fn);
        } else {
          it(name, fn);
        }
      }
    );
  });
});
