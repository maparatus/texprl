import assert from "assert";
import { parser, toArrayAst } from "../parser/index.js";
import assertions from "./assertions/index.js";

function hasError(expected) {
  return !!JSON.stringify(expected).match(/\$\$ERROR/);
}

describe("texprl", () => {
  describe("parser", () => {
    assertions.forEach(
      ({ only, input, expected, errors: expectedError }, index) => {
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
            actual = toArrayAst(input, tree);
          } catch (error) {
            actualError = error;
          }

          if (expectedError && actualError) {
            assert(actualError);
          } else if (expected) {
            assert.deepStrictEqual(actual, expected);
          } else {
            // console.log(JSON.stringify(actual, null, 2));
            throw "missing";
          }
        };
        if (only) {
          it.only(name, fn);
        } else {
          it(name, fn);
        }
      }
    );
  });
});
