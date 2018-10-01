'use strict'

// 引入 path 模块
// https://nodejs.org/dist/latest-v10.x/docs/api/path.html
const path = require('path')

// 引入 utils 文件配置
const utils = require('./utils')

// 这里加载 ../config/index.js 文件里的配置
// 至于 index.js 为什么可以省略，可以看这里 http://www.ruanyifeng.com/blog/2015/05/require.html
const config = require('../config')

// vue-loader 的相关配置
const vueLoaderConfig = require('./vue-loader.conf')

// 获取绝对路径
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

// 定义 ellint-loader 代码检查的规则
// https://webpack.docschina.org/loaders/eslint-loader/#src/components/Sidebar/Sidebar.jsx
// 更多关于 loader 的理解，可以从这里开始 https://webpack.docschina.org/concepts/loaders
const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  // 上下文 基础目录，绝对路径，用于从配置中解析入口起点(entry point)和 loader
  context: path.resolve(__dirname, '../'),
  // 入口起点 指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始
  entry: {
    app: './src/main.js'
  },
  // output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    // 在编译时不知道最终输出文件的 publicPath 路径的情况下，publicPath 可以留空，并且在入口起点文件运行时动态设置。
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  // 设置模块如何被解析
  resolve: {
    // 自动解析确定的扩展，能够使引入模块时不带扩展
    extensions: ['.js', '.vue', '.json'],
    // 创建 import 或 require 的别名，来确保模块引入变得更简单
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  // 设置如何处理项目中的不同类型的模块
  module: {
    // 这些规则能够对模块(module)应用 loader，或者修改解析器(parser）
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      // 对所有.vue文件使用vue-loader进行编译
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      // 对src和test文件夹下的.js文件使用 babel-loader 将 es6+ 的代码转成 es5
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      // 对图片资源文件使用url-loader
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          // 小于10K的图片转成base64编码的dataURL字符串写到代码中
          limit: 10000,
          // 其他的图片转移到静态资源文件夹
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      // 对多媒体资源文件使用url-loader
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          // 小于10K的图片转成base64编码的dataURL字符串写到代码中
          limit: 10000,
          // 其他的图片转移到静态资源文件夹
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      // 对字体资源文件使用url-loader
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
