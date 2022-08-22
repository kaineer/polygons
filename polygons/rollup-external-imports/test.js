const virtual = require("@rollup/plugin-virtual");

const plugin = virtual({
  hello: `
    module.exports = {
      hello: () => console.log("What is this")
    }
  `
});

const resolved = plugin.resolveId("hello");

console.log(resolved);
console.log(plugin.load(resolved));

