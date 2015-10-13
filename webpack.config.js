'use strict';

var path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'assets'),
    publicPath: 'assets/',
    filename: './app.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'eslint-loader',
      exclude: /node_modules/
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css', 'autoprefixer', 'sass']
    }, {
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=100000&name=[name].[ext]'
    }]
  },
  resolve: {
    modulesDirectories: [
      'node_modules',
      'bower_components'
    ]
  }
};
