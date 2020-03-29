const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const yaml = require("js-yaml")
const fs = require("fs")
const path = require("path")

try {
    let fileContents = fs.readFileSync('./config.yaml', 'utf8');
    data = yaml.safeLoad(fileContents);

    console.log(data);
} catch (e) {
    console.log(e);
}

const SRC = data.SOURCE || "/public/src"
const DESTINATION = data.DESTINATION || "/public/wp-content/themes"
const CSS_OUTPUT_NAME = data.CSS_OUTPUT_NAME || "custom"
const JS_OUTPUT_NAME = data.JS_OUTPUT_NAME || "bundle"

module.exports = {
  
  mode: "production",
  entry: {
    [JS_OUTPUT_NAME]: path.join(__dirname, SRC, "/js/index.js"),
    [CSS_OUTPUT_NAME]: path.join(__dirname, SRC, "/scss/index.scss")
  },
  output: {
    path: path.join(__dirname, DESTINATION),
    filename: "./js/[name].js",
    library: '[name]',
    libraryTarget: 'umd'
  },
  resolve: {
      extensions: [".ts", ".tsx", ".js", ".scss", ".woff", ".woff2", ".eot", ".ttf"]
  },
  devtool: 'source-map',
  externals: [/(jQuery)/],
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader', 
            options: {
              sourceMap: true
            },
          },
          'resolve-url-loader', 
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sourceMap: true
            },
          }, 
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
  ],
}
