const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

const friendlyErrors = new FriendlyErrorsWebpackPlugin();

module.exports = {
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          emitWarning: true,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
    ]
  },
  resolve: {
    alias: {
      'components': path.join(__dirname, 'src/components'),
      'consts': path.join(__dirname, 'src/consts')
    },
    extensions: ['.js']
  },
  devServer: {
    historyApiFallback: true
  },
  plugins: [
    htmlPlugin,
    friendlyErrors
  ]
};
