const { rollup } = require("rollup");
const virtual = require("@rollup/plugin-virtual");
// const cjs = require("@rollup/plugin-commonjs");
const { writeFileSync } = require("fs");
const { join } = require("path");

const fn = async () => {
  const files = {
    "foo": `
const module = { exports: {} };
const exports = module.exports;
////////////////////
((m, exports) => {
   exports.hello = () => console.log("Hello virtual, cjs and umd");
})(module, module.exports)
////////////////////
export const hello = exports.hello;
export default module;
    `,
    "./src.js": `
import { hello } from "foo";

hello();
    `
  }
  const bundle = await rollup({
    input: "./src.js",
    plugins: [
      virtual(files),
    ],
  });

  const { output: [{code}] } = await bundle.generate({
    exports: "auto",
    format: "iife",
  });

  writeFileSync(join(__dirname, "dist/output.js"), code);
}

fn().then(() => console.log("done"));

