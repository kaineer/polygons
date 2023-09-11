const { join } = require("path");
const { ProvidePlugin } = require("webpack");

module.exports = {
  mode: "development",
  entry: join(__dirname, "src/index.js"),
  output: {
    filename: "bundle.js",
    path: join(__dirname, "dist"),
  },
  plugins: [
    new ProvidePlugin({
      BrowserFS: 'bfsGlobal',
      process: 'processGlobal',
      Buffer: 'bufferGlobal',
    }),
  ],
  resolve: {
    alias: {
      fs: 'browserfs/dist/shims/fs.js',
      buffer: 'browserfs/dist/shims/buffer.js',
      path: 'browserfs/dist/shims/path.js',
      processGlobal: 'browserfs/dist/shims/process.js',
      bufferGlobal: 'browserfs/dist/shims/bufferGlobal.js',
      bfsGlobal: require.resolve('browserfs'),
    },
    fallback: {
      util: false,
    }
  },
  devtool: false,
};
