'use strict';

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  context: path.resolve(__dirname, "../"),
  entry: {
    home: './src/home.js',
    app: './src/index.js'
  },
  output: {
    filename: '[name].[chunkhash:8].js',
    path: path.resolve(__dirname, '../views'),
    publicPath: '/'
  },
  plugins: [
    new CleanWebpackPlugin(['views'], {
      root: path.resolve(__dirname, "../"),
      verbose: true
    }),    
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      chunks : ['manifest', 'commons', 'app']
    }),
    new HtmlWebpackPlugin({
      filename: 'home.ejs',
      template: '!!html-loader!./src/home.ejs',      
      chunks : ['manifest', 'commons', 'home']
    }),
    new webpack.HashedModuleIdsPlugin(),
    new CopyWebpackPlugin([{
        from: 'src/static',
        to:'../views'
      }], {
        ignore: [],
        copyUnmodified: true,
        debug:"debug"
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
            loader: 'babel-loader',            
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'less-loader', options: { javascriptEnabled: true } }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader'
        ]
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader'
        ]
      }
    ]
  },
  resolve: {    
    modules: [
      path.resolve(__dirname, "../node_modules"),
      path.resolve(__dirname, "../src")
    ],    
    extensions: [".js", ".json", ".jsx", ".css"]
  }
};
