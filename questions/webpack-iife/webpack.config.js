const { join } = require("path");

module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: join(__dirname, "dist"),
    filename: "bundle.js",
    // iife: true,
    // chunkFormat: "array-push",
    // library: {
    //   name: "foo",
    //   type: "var"
    // },
  },
  // optimization: {
  //   concatenateModules: true,
  // }
}
