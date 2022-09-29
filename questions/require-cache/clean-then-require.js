const { resolve } = require("path");
const { writeFileSync } = require("fs");

const { mkdirpSync, rmdirSync } = require("fs-extra");

const modPath = "./tmp/mod.js";
const modFullPath = resolve(modPath);

const m1 = "module.exports = { f: () => 38 }";
const m2 = "module.exports = { f: () => 42 }";

const cleanThenRequire = (modPath) => {
  const fullPath = resolve(modPath);
  delete require.cache[fullPath];
  return require(modPath);
};

mkdirpSync("tmp");

writeFileSync(modFullPath, m1);
const modBefore = cleanThenRequire(modPath);
console.log(modBefore.f()); // => 38

writeFileSync(modFullPath, m2);
const modAfter = cleanThenRequire(modPath);
console.log(modAfter.f()); // => 42

rmdirSync("tmp", { recursive: true });
