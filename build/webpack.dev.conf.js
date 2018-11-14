'use strict'
const utils = require('./utils')
const webpack = require('webpack')

// 基本配置的参数
const config = require('../config')

// webpack-merge是一个可以合并数组和对象的插件
const merge = require('webpack-merge')
const path = require('path')

// webpack基本配置文件（开发和生产环境公用部分）
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// html-webpack-plugin 用于将 webpack 编译打包后的产品文件注入到 html 模板中
// 即在 index.html 里面加上<link>和<script>标签引用 webpack 打包后的文件
const HtmlWebpackPlugin = require('html-webpack-plugin')

// friendly-errors-webpack-plugin用于更友好地输出webpack的警告、错误等信息
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// 自动检索下一个可用端口
const portfinder = require('portfinder')

const HOST = process.env.HOST

// 读取系统环境变量的port
const PORT = process.env.PORT && Number(process.env.PORT)

// 合并baseWebpackConfig配置
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    // 对一些独立的css文件以及它的预处理文件做一个编译
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  // webpack-dev-server服务器配置
  devServer: {
    // console 控制台显示的消息，可能的值有 none, error, warning 或者 info
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
        }
      ]
    },
    // 开启热模块加载
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    // 代理设置
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    // 启用 Watch 模式。这意味着在初始构建之后，webpack 将继续监听任何已解析文件的更改
    watchOptions: {
      // 通过传递 true 开启 polling，或者指定毫秒为单位进行轮询。默认为false
      poll: config.dev.poll
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),

    // 模块热替换它允许在运行时更新各种模块，而无需进行完全刷新
    new webpack.HotModuleReplacementPlugin(),

    // 启用HMR时，此插件将显示模块的相对路径，而不是模块的id
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.

    // 跳过编译时出错的代码并记录下来，主要作用是使编译后运行时的包不出错
    new webpack.NoEmitOnErrorsPlugin(),

    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      // 指定编译后生成的 html 文件名
      filename: 'index.html',
      // 需要处理的模板
      template: 'index.html',
      // 打包过程中输出的 js、css 的路径添加到 html 文件中
      // css 文件插入到 head 中
      // js 文件插入到 body 中，可能的选项有 true, 'head', 'body', false
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  // 获取当前设定的端口
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      // 发布新的端口，对于e2e测试
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${
                devWebpackConfig.devServer.host
              }:${port}`
            ]
          },
          onErrors: config.dev.notifyOnErrors
            ? utils.createNotifierCallback()
            : undefined
        })
      )

      resolve(devWebpackConfig)
    }
  })
})
