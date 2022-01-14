//

const { Checker } = require("@htmlacademy/checker");
const { join } = require("path");

const configPath = join(__dirname, "../config/config.json");
const checks = [
  { type: "foo/hello" }
];

const runChecks = () => {
  const tmpDir = join(__dirname, "tmp");
  const projectPath = join(__dirname, "../projects/incorrect");

  const checker = new Checker({
    configPath,
    tmpDir
  });

  return checker.check({
    projectPath,
    checks,
    filesPath: "",
    imageMagickCompareBinPath: ""
  }).then((results) => console.log({ results }));
};

module.exports = {
  runChecks
};
