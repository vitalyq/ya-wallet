const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabelWebpackPlugin = require('babel-minify-webpack-plugin');
const path = require('path');

const prod = process.env.NODE_ENV === 'production';

const config = {
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
        use: ['babel-loader', 'eslint-loader'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.css$/,
        use: prod ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader'],
        }) : ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({ title: 'Wallet' }),
  ],
};

if (prod) {
  config.plugins = config.plugins.concat([
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin('styles.css'),
    new BabelWebpackPlugin(),
  ]);
}

module.exports = config;
