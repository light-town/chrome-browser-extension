const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const CopyWebpackPlugin = require("copy-webpack-plugin");
/* const ExtensionBuildWebpackPlugin = require("extension-build-webpack-plugin"); */
/* const ChromeExtensionReloader = require("webpack-chrome-extension-reloader"); */

module.exports = {
  entry: {
    "popup/index": path.resolve(__dirname, "src", "popup/index.js"),
    "background/index": path.resolve(__dirname, "src", "background/index.js"),
  },
  mode: "development",
  plugins: [
    /* new ChromeExtensionReloader({
      port: 9090,
      reloadPage: true,
      entries: {
        contentScript: "content-script",
        background: "background",
      },
    }), */
    new HtmlWebpackPlugin({
      template: "./src/popup/index.html",
      filename: "popup/index.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/background/index.html",
      filename: "background/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, "src", "manifest.json") }],
    }),

    /*  new ExtensionBuildWebpackPlugin({
      devMode: true,
      name: "my-first-webpack.zip",
      directory: "src",
      updateType: "minor",
    }), */
    new VueLoaderPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
