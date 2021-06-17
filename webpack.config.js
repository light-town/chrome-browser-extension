const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    "popup/index": path.resolve(__dirname, "src", "popup/index.ts"),
    "background/index": path.resolve(__dirname, "src", "background/index.ts"),
    "content/proposal/index": path.resolve(
      __dirname,
      "src",
      "content/proposal/index.ts"
    ),
    "content/autofill/index": path.resolve(
      __dirname,
      "src",
      "content/autofill/index.ts"
    ),
    "options/index": path.resolve(__dirname, "src", "options/index.ts"),
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
    new HtmlWebpackPlugin({
      template: "./src/options/index.html",
      filename: "options/index.html",
      chunks: ["options/index"],
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, "src", "manifest.json") }],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets/logo"),
          to: path.resolve(__dirname, "dist", "assets/logo"),
        },
      ],
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin(),
  ],
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@/": path.resolve(__dirname, "src"),
      "~/": path.resolve(__dirname, "src"),
    },
    extensions: ["*", ".js", ".vue", ".json", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ["babel-loader", "vue-svg-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.ts$/,
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: { appendTsSuffixTo: [/\.vue$/] },
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            scss: [
              "vue-style-loader",
              "css-loader",
              "postcss-loader",
              "sass-loader",
            ],
            sass: [
              "vue-style-loader",
              "css-loader",
              "postcss-loader",
              "sass-loader?indentedSyntax",
            ],
            ts: "babel-loader!ts-loader",
          },
        },
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          "vue-style-loader",
          "css-loader",
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              additionalData: `
                @import "@light-town/ui/src/scss/variables.scss";
                @import "@light-town/ui/src/scss/functions.scss";
                @import "@light-town/ui/src/scss/mixins.scss";
                @import "@light-town/ui/src/scss/utilities.scss";
              `,
            },
          },
        ],
      },
      {
        test: /\.sass$/,
        use: [
          "vue-style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader?indentedSyntax",
        ],
      },
    ],
  },
};
