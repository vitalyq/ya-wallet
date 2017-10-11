const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabelWebpackPlugin = require('babel-minify-webpack-plugin');
const path = require('path');

const PROD = process.env.NODE_ENV === 'production';
const BUILD_PATH = path.join(__dirname, 'dist');

const commonLoaders = [{
  test: /\.jsx?$/,
  use: 'babel-loader',
  include: path.join(__dirname, 'src'),
}];

const configClient = {
  name: 'Client',
  entry: './src/client/entry-client.js',
  output: {
    path: BUILD_PATH,
    filename: 'bundle.client.js',
  },
  module: {
    rules: commonLoaders.concat([
      {
        test: /\.css$/,
        use: PROD ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader'],
        }) : ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ]),
  },
  plugins: [],
};

const configServer = {
  name: 'Server',
  target: 'node',
  externals: [nodeExternals()],
  entry: './src/client/entry-server.js',
  output: {
    path: BUILD_PATH,
    filename: 'bundle.server.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: commonLoaders.concat([
      {
        test: /\.css$/,
        use: 'null-loader',
      },
    ]),
  },
  plugins: [],
};

if (PROD) {
  configClient.plugins = configClient.plugins.concat([
    new CleanWebpackPlugin([BUILD_PATH]),
    new CopyWebpackPlugin([
      { from: 'src/client/icons' },
      { from: 'src/client/fonts', to: 'fonts' },
      { from: 'src/client/assets', to: 'assets' },
    ]),
    new ExtractTextPlugin('styles.css'),
    new BabelWebpackPlugin(),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ]);
}

module.exports = [configClient, configServer];
