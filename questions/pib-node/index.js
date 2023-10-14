const { Worker } = require("worker_threads")
const { join } = require("path")

console.log({
  filePath: join(__dirname, "wasm/pib-worker-asm.js")
});

const worker = new Worker(
  join(__dirname, "wasm/pib-worker-asm.js")
);


