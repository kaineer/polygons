//
const { join } = require("path");
const { writeFileSync } = require("fs");

const configPath = join(__dirname, "../config/config.json");

module.exports = {
  generateConfig() {
    const fooPackagePath = join(__dirname, "../foo-checks");

    writeFileSync(configPath, JSON.stringify([
      {
        namespace: "foo",
        path: fooPackagePath
      }
    ], null, 2));
  }
};
