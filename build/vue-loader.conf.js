'use strict'
// 导入 utils
const utils = require('./utils')

// 基本配置的参数
const config = require('../config')

// 判断是否为线上环境
const isProduction = process.env.NODE_ENV === 'production'

const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  // 配置在 .vue 文件中的 css 相关处理规则
  loaders: utils.cssLoaders({
    // 根据所处环境是否生成 sourceMap 用于代码调试
    sourceMap: sourceMapEnabled,
    // 是否将单独的 css 文件（一般为引入的外部文件）进行提取单独打包
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
