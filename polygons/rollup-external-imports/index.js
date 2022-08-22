const { rollup } = require("rollup");
const virtual = require("@rollup/plugin-virtual");
const cjs = require("@rollup/plugin-commonjs");
// const legacy = require("@rollup/plugin-legacy");
const { writeFileSync } = require("fs");
const { join } = require("path");

const index = `
import { hello } from "hello";

hello();
`;

const hello = `
  // module.exports = {
  //   hello: () => console.log("Hello from cjs + virtual")
  // }

  // exports.hello = () => console.log("Hello, it is cjs one");

  export const hello = () => console.log("That is not cjs export");
`;

const entry = "./cjs-test.js";

const files = {
  [entry]: index,
  "hello": hello,
};

const plugins = [
  virtual(files),
  cjs({
    // extensions: [".js", ""],
    // ignoreGlobal: true,
    // defaultIsModuleExports: "auto",
    // requireReturnsDefault: true,
    // transformMixedEsModules: true,
  }),
];

const inputOptions = {
  external: () => false,
  plugins,
  input: entry
};

const fn = async () => {
  const bundle = await rollup(inputOptions);
  const outputOptions = {
    exports: 'auto',
    format: 'esm',
  };
  const { output } = await bundle.generate(outputOptions);

  writeFileSync(
    join(__dirname, "dist/output.js"),
    output[0].code
  );
};

fn().then(() => console.log("bundle is generated."));

