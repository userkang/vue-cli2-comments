# vue-cli2.0

> 这是一个初始化的 vue-cli2.0 项目。
> 对其中 webpack 的配置做了注释。
> 共同学习，共同进步。

## Build Setup

```bash
# 安装依赖
npm install

# 启动服务
npm run dev

# 构建生产坏境
npm run build

# 构建生产坏境并生成分析报告
npm run build --report

# 单元测试
npm run unit

# 端对端测试
npm run e2e

# 总体测试
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

|-- build // 项目构建(webpack)相关代码  
| |-- build.js // 生产环境构建代码  
| |-- check-version.js // 检查 node、npm 等版本  
| |-- utils.js // 构建工具相关  
| |-- vue-loader.conf.js // webpack loader 配置  
| |-- webpack.base.conf.js // webpack 基础配置  
| |-- webpack.dev.conf.js // webpack 开发环境配置,构建开发本地服务器  
| |-- webpack.prod.conf.js // webpack 生产环境配置
|-- config // 项目开发环境配置  
| |-- dev.env.js // 开发环境变量  
| |-- index.js // 项目一些配置变量  
| |-- prod.env.js // 生产环境变量  
| |-- test.env.js // 测试脚本的配置  
|-- src // 源码目录  
| |-- components // vue 所有组件  
| |-- router // vue 的路由管理  
| |-- App.vue // 页面入口文件  
| |-- main.js // 程序入口文件，加载各种公共组件  
|-- static // 静态文件，比如一些图片，json 数据等  
|-- test // 测试文件  
| |-- e2e // e2e 测试  
| |-- unit // 单元测试  
|-- .babelrc // ES6 语法编译配置  
|-- .editorconfig // 定义代码格式  
|-- .eslintignore // eslint 检测代码忽略的文件（夹）  
|-- .eslintrc.js // 定义 eslint 的 plugins, extends,rules  
|-- .gitignore // git 上传需要忽略的文件格式  
|-- .postcsssrc // postcss 配置文件  
|-- README.md // 项目说明，markdown 文档  
|-- index.html // 访问的页面  
|-- package.json // 项目基本信息,包依赖信息等
