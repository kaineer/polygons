//
const { generateConfig } = require("./config");
const { runChecks } = require("./checks");

const { ensureDir, remove } = require("fs-extra");
const { join } = require("path");

generateConfig();

ensureDir(join(__dirname, "tmp")).
  then(runChecks).
  then(remove(join(__dirname, "tmp")));

