const index = "@import 'css/main';";
const main = "@import './colors'; .bluish { color: @main-color; }; @import '../rule';";
const colors = "@main-color: #00f0f0;"
const rule = ".rule { color: #f0f; }";

const { createPlugin } = require("./fs_plugin");

const files = {
  "index.less": index,
  "css/main.less": main,
  "css/colors.less": colors,
  "rule.less": rule,
};

const less = require("less");
const plugins = [ createPlugin(files) ];
const options = { plugins };

less.render(index, options).then((result) => {
  console.log(result.css);
}).catch((err) => {
  console.log("Error: " + err.toString());
});
