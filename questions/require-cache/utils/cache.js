// utils/cache.js

const { resolve } = require("path");

const cleanChildren = (fullPath) => {
  const module = require.cache[fullPath];
  if (module) {
    for (const child of module.children) {
      cleanCache(child.filename, true);
    }
  }
}

const cleanCache = (fullPath, recursive = false) => {
  if (recursive) {
    cleanChildren(fullPath);
  }
 
  delete require.cache[fullPath];
}

// const wrongWayToDo = (fullPath) => {
//   delete require.cache[fullPath];
// }

const rightWayToDo = (fullPath) => {
  cleanCache(fullPath, true);
}

const cleanThenRequire = (modPath) => {
  const fullPath = resolve(modPath);
  rightWayToDo(fullPath);
  return require(fullPath);
}

module.exports = {
  cleanThenRequire,
};
