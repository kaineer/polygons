const acornLoose = require("acorn-loose");
const acorn = require("acorn");
const jsx = require("acorn-jsx");

try {
const ast = acorn.Parser.extend(jsx()).parse(
  "<foo/> (1/)",
  { ecmaVersion: "latest" }
);
} catch (e) {
  console.error(e instanceof SyntaxError);
  console.error(e.message);
  console.error(e.name);
  console.log(Object.keys(e));
  // console.error(e.fileName);
  // console.error(e.lineNumber);
  // console.error(e.columnNumber);
  console.log({
    post: e.pos,
    loc: e.loc,
    raisedAt: e.raisedAt
  });
}

// console.log(ast);
