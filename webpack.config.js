const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, './src'),  // The base directory (absolute path!)
  entry: {
    // 将第三方库打成一个包
    vendor: [
      'angular',
      'angular-animate',
      'angular-aria',
      'angular-messages',
      'angular-ui-router',
      'angular-material'
    ],
    // app 入口文件
    app: 'app/app.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '', // webpack-dev-server配置，引用文件时使用的地址
  },
  devServer: {
    contentBase: path.resolve(__dirname, './src'),  // webpack-dev-server配置
  },
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'], //import 文件默认先从src目录找，没有再去node_modules，减少import src目录文件层级
    extensions: ['.js', '.css'],  // import js和css 文件时不需要写文件后缀名
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      use: [{
        loader: 'babel-loader',   // 处理js文件，将ES6代码转换成ES5
        options: { presets: ['es2015'] }
      }]
    }, {
      test: /\.css$/,   // 处理css文件，增加css loader后可以直接在js文件中import css文件，加载的时候会将样式通过style element的形式增加到dom树中
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: { modules: true }
        },
      ],
    }, {
      test: /\.(png|jpg)$/, // 将小的图pain处理成base64编码的方式，减少网页请求（暂未实测）
      use: [
        'url-loader?limit=8192'
      ],
    }, 
    // {
    //  test: /\.scss$/,  // 处理scss文件，在js文件中可以直接import
    //  use: [{
    //    loader: "style-loader" // creates style nodes from JS strings
    //  }, {
    //    loader: "css-loader" // translates CSS into CommonJS
    //  }, {
    //    loader: "sass-loader" // compiles Sass to CSS
    //  }]
    //}, 
    {
      test: /\.html$/,  // 处理html文件，在js文件中直接import angular template文件
      use: [
        'raw-loader'
      ]
    }],
  },
  plugins: [
    // 提取公共代码
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'commons']
    }),
    // 压缩代码
    // new webpack.optimize.UglifyJsPlugin(),
    // 提取公共css
    new ExtractTextPlugin({
      filename: '[name].bundle.css',
      allChunks: true,
    }),
    // 根据模板自动生成html文件
    new HtmlWebpackPlugin({ template: 'index.html' })
  ]
};
