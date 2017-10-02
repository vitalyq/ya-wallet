const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    'babel-polyfill',
    './src/client/index.js',
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          'eslint-loader',
        ],
        include: path.join(__dirname, 'src'),
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({ title: 'Wallet' }),
  ],
};
