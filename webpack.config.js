const path = require("path");

module.exports = {
  mode: "development",
  entry: ['./src/index.js', './src/auth.js', './src/request.js'],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  watch: true,
};
