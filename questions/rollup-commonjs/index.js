const { rollup } = require("rollup");
const cjs = require("@rollup/plugin-commonjs");
const virtual = require("@rollup/plugin-virtual");
const { nodeResolve: resolve } = require("@rollup/plugin-node-resolve");
const { join } = require("path");
const { writeFileSync } = require("fs");

const fn = async () => {
  const files = {
    "foo": `
      ((module, exports) => {
        exports.hello = () => console.log("Hello, iife, virtual, cjs")
      })(module, module.exports);
    `
  }
  const bundle = await rollup({
    input: join(__dirname, "src/index.js"),
    plugins: [
      virtual(files),
      cjs({
        defaultIsModuleExports: false,
      }),
      resolve(),
    ],
  });

  const { output: [{code}] } = await bundle.generate({
    exports: "auto",
    format: "iife",
    name: "output.js",
    dir: join(__dirname, "dist"),
  });

  writeFileSync(join(__dirname, "dist/output.js"), code);
}

fn().then(() => console.log("done"));
