const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    "popup/index": path.resolve(__dirname, "src", "popup/index.js"),
    "background/index": path.resolve(__dirname, "src", "background/index.js"),
    "content/index": path.resolve(__dirname, "src", "content/index.js"),
  },
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/popup/index.html",
      filename: "popup/index.html",
      chunks: ["popup/index"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/background/index.html",
      filename: "background/index.html",
      chunks: ["background/index"],
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, "src", "manifest.json") }],
    }),
    new VueLoaderPlugin(),
  ],
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": path.resolve(__dirname, "src"),
      "~": path.resolve(__dirname, "src"),
    },
    extensions: ["*", ".js", ".vue", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ["babel-loader", "vue-svg-loader"],
      },
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
        use: [
          "vue-style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
};
