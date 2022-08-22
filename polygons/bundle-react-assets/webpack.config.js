const { join } = require("path");

// const production = process.ENV !== "development";
// const mode = production ? "production" : "development";
// const mode = "production";
const mode = "development";

module.exports = {
  mode,
  devtool: false,
  entry: {
    react: "./node_modules/react/index.js",
    "react-dom": "./node_modules/react-dom/index.js",
  },
  output: {
    path: join(__dirname, "dist"),
    filename: "[name].js",
    library: {
      type: "module",
      export: "default",
    }
  },
  experiments: {
    outputModule: true
  }
}
