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

const commonResolve = {
  extensions: ['.js', '.jsx', '.json', '*'],
};

const configClient = {
  name: 'client',
  entry: './src/client/entry-client.js',
  output: {
    path: BUILD_PATH,
    filename: 'client.js',
    publicPath: '/',
  },
  resolve: commonResolve,
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
  name: 'server',
  target: 'node',
  externals: [nodeExternals({ whitelist: [/^antd/] })],
  entry: './src/client/entry-server.js',
  output: {
    path: BUILD_PATH,
    filename: 'server.js',
    publicPath: '/',
    libraryTarget: 'commonjs2',
  },
  resolve: commonResolve,
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

if (!PROD) {
  configClient.entry = [
    'webpack-hot-middleware/client?name=client',
    'react-hot-loader/patch',
  ].concat(configClient.entry);

  configClient.plugins = configClient.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
  ]);
}

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
