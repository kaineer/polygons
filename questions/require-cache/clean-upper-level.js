const { resolve } = require("path");
const { writeFileSync } = require("fs");

const { mkdirpSync, rmdirSync } = require("fs-extra");

const a1 = "module.exports = { f: require('./b.js').f }";
const a2 = "module.exports = { f: () => (require('./b.js').f() + 1) }";

const b1 = "module.exports = { f: () => 38 }";
const b2 = "module.exports = { f: () => 42 }";

const { cleanThenRequire } = require("./utils/cache");

mkdirpSync("tmp");

writeFileSync("./tmp/a.js", a1);
writeFileSync("./tmp/b.js", b1);
const modBefore = cleanThenRequire("./tmp/a.js");
console.log(modBefore.f());

writeFileSync("./tmp/a.js", a2);
writeFileSync("./tmp/b.js", b2);
const modAfter = cleanThenRequire("./tmp/a.js");
console.log(modAfter.f());

rmdirSync("tmp", { recursive: true });

