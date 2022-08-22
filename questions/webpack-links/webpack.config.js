const { join } = require("path");
const { readlink } = require("fs");

module.exports = async () => {
  return {
    mode: "development",
    entry: "./src/index.js",
    output: {
      filename: "script.js",
      path: join(__dirname, "dist"),
    }
  };
};
