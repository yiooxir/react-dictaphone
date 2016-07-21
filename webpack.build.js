var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './src/Dictaphone.js'
  ],

  output: {
    filename: 'index.js',
    path: __dirname + '/lib/',
    publicPath: '/assets/',
    ignore: ['React', 'react-dom'],
    libraryTarget: 'umd',
    library: 'react-dictaphone',
    umdNamedDefine: true
  },

  debug: false,
  devtool: false,

  stats: {
    colors: true,
    reasons: false
  },

  externals: {
    // Use external version of React
    "react": "React",
    "react-dom": "react-dom"
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
      { test: /\.js$/, loader: 'babel', exclude: [/node_modules/] },
      {
        test: /\.(css|scss)$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'sass-loader')
      }
    ]
  }
};
