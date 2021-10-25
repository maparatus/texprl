import assert from "assert";
import { parser, toArrayAst } from "../parser/index.js";
import parseTests from "./assertions/parse.js";
import formatTests from "./assertions/format.js";

function hasError(expected) {
  return !!JSON.stringify(expected).match(/\$\$ERROR/);
}

function wrap (input) {
  const lines = ["", ...input.split(/\n/), ""];
  
  return lines.map((line, idx) => {
    let mark;
    if (idx === 0) mark = '├──'
    else if (idx === lines.length-1) mark = '└──';
    else mark = '│';
    return `        ${mark} ${line}`;
  }).join("\n");
}

describe("texprl", () => {
  describe("parse", () => {
    parseTests.forEach(
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
        let name;
        if (input.match(/\n/)) {
          name = `test #${indexStr} ${statusStr}\n${wrap(input)}`;
        }
        else {
          name = `test #${indexStr} ${statusStr} — '${input}'`;
        }

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

  describe("format", () => {
    formatTests.forEach(
      ({ skip, only, input, expected, errors: expectedError, checkLookup }, index) => {
        const indexStr = `${index}`.padStart(3, "0");
        let name;
        if (input.match(/\n/)) {
          name = `test #${indexStr}\n${wrap(input)}`;
        }
        else {
          name = `test #${indexStr} — '${input}'`;
        }

        const fn = () => {
          let formattedText;
          let actualError;

          try {
            const tree = parser.parse(input);
            const actual = toArrayAst(input, tree, { checkLookup });
            formattedText = fromArrayAst(actual, this);
          } catch (error) {
            actualError = error;
          }

          console.log("formattedText", formattedText);

          throw new Error("arrgh");

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
