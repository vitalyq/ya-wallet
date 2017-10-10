const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BabelWebpackPlugin = require('babel-minify-webpack-plugin');
const path = require('path');

module.exports = [(env) => {
  const prod = env && env.prod;
  const config = {
    name: 'Client build',

    entry: './src/client/index.js',

    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'index.js',
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: 'babel-loader',
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

    plugins: [],
    watch: true,
  };

  if (prod) {
    config.plugins = config.plugins.concat([
      new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new ExtractTextPlugin('styles.css'),
      new BabelWebpackPlugin(),
      new CopyWebpackPlugin([
        { from: 'src/client/icons' },
        { from: 'src/client/fonts', to: 'fonts' },
        { from: 'src/client/assets', to: 'assets' },
      ]),
    ]);
  }

  return config;
}];
