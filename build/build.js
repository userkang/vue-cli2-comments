'use strict'

// 检查当前 node 和 npm 版本，引入并执行
require('./check-versions')()

// 设置 node 环境变量为线上
process.env.NODE_ENV = 'production'

// 主要用来实现 node.js 命令行环境的 loading 效果，和显示各种状态的图标等
// https://github.com/sindresorhus/ora
const ora = require('ora')

// 以包的形式包装 rm -rf 命令，用来删除文件和文件夹
// https://github.com/isaacs/rimraf
const rm = require('rimraf')

// node path模块
// https://nodejs.org/dist/latest-v10.x/docs/api/path.html
const path = require('path')

// chalk 一个颜色插件，给输出内容上颜色
// https://github.com/chalk/chalk
const chalk = require('chalk')

// webpack 一个处理依赖，打包编译的工具 
// https://webpack.docschina.org/concepts/
const webpack = require('webpack')

// 这里加载 ../config/index.js 文件里的配置
// 至于 index.js 为什么可以省略，可以看这里 http://www.ruanyifeng.com/blog/2015/05/require.html
const config = require('../config')

// 引入 webpack 线上配置
const webpackConfig = require('./webpack.prod.conf')

// 在控制台打印一个 loading 效果
const spinner = ora('building for production...')
spinner.start()

// 删除 dist/static 文件夹，并执行回调，如果有错误把错误传入
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {

  // 抛出删除文件异常
  if (err) throw err

  // webpack 提供了 Node.js API，可以在 Node.js 运行时下直接使用
  // 详细的请看 https://webpack.docschina.org/api/node/#webpack-
  webpack(webpackConfig, (err, stats) => {

    // 停止 loading 效果
    spinner.stop()

    // 抛出打包时发生的异常
    if (err) throw err

    // 标准输出，可以当成 console.log 理解
    process.stdout.write(stats.toString({
      // stats 对象会被作为 webpack() 回调函数的第二个参数传入，可以通过它获取到代码编译过程中的有用信息
      // 详细请看 https://webpack.docschina.org/api/node/#stats-%E5%AF%B9%E8%B1%A1-stats-object-
      colors: true, // 让打包信息带颜色显示
      modules: false, // 去掉内置模块信息
      children: false, // 去掉子模块 如果你在应用 ts-loader， 需要把这项设置为 true 才能在编译中显示 ts 报错 
      chunks: false, // 不显示包信息
      chunkModules: false //  去除包里内置模块的信息                                                                                    
    }) + '\n\n')

    // 这里会判断是否有编译错误
    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    // 最后建议用 http 服务来访问页面，而不要直接打开文件访问
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
