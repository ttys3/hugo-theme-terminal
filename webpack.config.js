const Webpack = require("webpack");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const path = require("path");

const join = (...paths) => path.join(__dirname, ...paths);

const entryPoints = {
  "main.js": [
    join("source", "js", "main.js"),
    join("source", "js", "menu.js"),
    join("source", "js", "languageSelector.js")
  ],
  "prism.js": join("source", "js", "prism.js"),
}

const postcssStyles = [
  { name: "style.css", path: join("source", "css", "style.css") },
  { name: "red.css", path: join("source", "css", "color", "red.css") },
  { name: "blue.css", path: join("source", "css", "color", "blue.css") },
  { name: "green.css", path: join("source", "css", "color", "green.css") },
  { name: "pink.css", path: join("source", "css", "color", "pink.css") },
]

postcssStyles.forEach(entry => {
  entryPoints[entry.name] = entry.path;
});

// console.info("%o", entryPoints)

module.exports = {
  resolve: {
    extensions: [".js", ".css"],
    modules: ["source", "node_modules"],
  },
  entry: entryPoints,
  output: {
    filename: "[name]",
    path: join("static/assets"),
    publicPath: "",
  },
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|jpg|woff|woff2|ttf|eot|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              minimize: true,
              modules: true,
              importLoaders: 1,
              localIdentName: "[local]",
            },
          },
          {
            loader: "postcss-loader",
            options: {
              config: {
                path: "postcss.config.js",
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      minChunks: 2,
    },
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
      }),
    ],
  },
  plugins: [
    new CleanPlugin(join("static/assets")),
    new MiniCssExtractPlugin({
      // since entry filename is also xxx.css, which actully is a js file,
      // we need to use another extension for extracted css to avoid error
      moduleFilename: (chunk) => {
        const name = chunk.name.replace(/.css/, '');
        return `${name}.min.css`;
      },
    })
  ],
};
