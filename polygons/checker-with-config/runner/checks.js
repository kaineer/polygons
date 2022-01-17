//

const { Checker } = require("@htmlacademy/checker");
const { join } = require("path");

const configPath = join(__dirname, "../config/config.json");
const checks = [
  { type: "foo/hello" }
];

const runChecks = () => {
  const tmpDir = join(__dirname, "tmp");
  const correctProjectPath = join(__dirname, "../projects/correct");
  const incorrectProjectPath = join(__dirname, "../projects/incorrect");

  const checker = new Checker({
    configPath,
    tmpDir
  });

  const display = (title) => (results) => {
    console.log("\n*** " + title);
    console.log(JSON.stringify(results, null, 2));
  }
  const runCheck = (projectPath) => checker.check({
    projectPath,
    checks,
    filesPath: "",
    imageMagickCompareBinPath: ""
  });

  return runCheck(correctProjectPath)
    .then(display("Correct project"))
    .then(() => runCheck(incorrectProjectPath))
    .then(display("Incorrect project"));
};

module.exports = {
  runChecks
};
