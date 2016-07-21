var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './src/Dictaphone.js'
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    path: __dirname + '/lib/',
    publicPath: '/assets/',
    libraryTarget: 'umd'
  },

  debug: false,
  devtool: false,

  stats: {
    colors: true,
    reasons: false
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new ExtractTextPlugin('assets/style.css'),
  ],
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ },
      {
        test: /\.(css|scss)$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'sass-loader')
      }
    ]
  }
};
