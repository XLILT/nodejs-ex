'use strict';

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    //contentBase: './dist',
    contentBase: '../views',
    host: "0.0.0.0",
    port: 8080,
    hot: true,
    open: true,
    proxy:{
    '/': {
        target: '127.0.0.1:8080',
        // changeOrigin: true,
        // pathRewrite: {
        //   '^/test_proxy': '/'
        // }
    }
  }
  }
});
