'use strict'
// node path模块
// https://nodejs.org/dist/latest-v10.x/docs/api/path.html
const path = require('path')

// 这里加载 ../config/index.js 文件里的配置
// 至于 index.js 为什么可以省略，可以看这里 http://www.ruanyifeng.com/blog/2015/05/require.html
const config = require('../config')

// extract-text-webpack-plugin 可以提取 bundle 中的特定文本，将提取后的文本单独存放到另外的文件
// 这里用来提取css样式
// https://www.webpackjs.com/plugins/extract-text-webpack-plugin/
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// package.json 的配置
const packageConfig = require('../package.json')

// 资源文件的存放路径
exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  // 以 posix 兼容的方式连接路径
  return path.posix.join(assetsSubDirectory, _path)
}

// 生成 css、sass、scss 等各种用来编写样式的语言所对应的 loader 配置
exports.cssLoaders = function (options) {
  options = options || {}
  // 定义 cssLoader
  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  // 生成各种loader配置，并且配置了 extract-text-pulgin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    // 例如 generateLoaders('less')，这里就会 push 一个 less-loader
    // less-loader 先将 less 编译成 css，然后再由 css-loader 去处理 css
    // 其他 sass、scss 等语言也是一样的过程
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      // 无需提取样式则简单使用vue-style-loader配合各种样式loader去处理<style>里面的样式
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
// 生成处理单独的.css、.sass、.scss等样式文件的规则
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  // 使用 node.js 实现跨平台通知
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
