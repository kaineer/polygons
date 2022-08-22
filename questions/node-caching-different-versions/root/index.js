const { join } = require("path");

const sink1 = join(__dirname, "../sink-1.0/index.js");
const sink2 = join(__dirname, "../sink-2.0/index.js");

const f = async () => {
  console.log((await import(sink1)).default());
  console.log((await import(sink2)).default());
  console.log((await import(sink1)).default());
  console.log((await import(sink2)).default());
}

f();
