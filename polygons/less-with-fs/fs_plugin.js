//

const AbstractFileManager = require("less/lib/less/environment/abstract-file-manager").default;

const { join } = require("./path");

const createFileManager = (files) => {
  const baseFM = new AbstractFileManager();

  const dummy = {
    ...baseFM,
    supports() {
      return true;
    },
    getPath(filepath) {
      const ri = filepath.lastIndexOf("/");
      if (ri > -1) {
        return filepath.slice(0, ri);
      }
      return "";
    },
    loadFile(
      filename,
      currentDirectory,
      _options,
      _env
    ) {
      const newFilename = join(
        currentDirectory,
        baseFM.tryAppendLessExtension(filename)
      );

      return Promise.resolve({
        filename: newFilename,
        contents: files[newFilename]
      });
    }
  };

  return new Proxy(dummy, {
    get(target, prop, receiver) {
      if (prop in dummy && typeof dummy[prop] === "function") {
        return dummy[prop];
      }

      return (...args) => {
        // console.log("Called method [" + prop + "]");
        // console.log("  with parameters: " + JSON.stringify(args[3], null, 2));
      }
    }
  })
}

const createPlugin = (files) => {
  return {
    install(_less, pluginManager) {
      pluginManager.addFileManager(createFileManager(files));
    }
  }
}

module.exports = {
  createPlugin
};
