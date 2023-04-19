const webpack = require('webpack');
const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
    output: {
      filename: "main.js",
    },
    configure: (webpackConfig) => {
      webpackConfig.output = {
        ...webpackConfig.output,
        filename: "static/js/main.js",
      };
      // Change CSS filename
      webpackConfig.plugins[6].options = {
        ...webpackConfig.plugins[6].options,
        filename: "static/css/main.css",
      };
      return webpackConfig;
    },
  },
};