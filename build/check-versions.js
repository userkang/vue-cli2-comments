'use strict'
// chalk 一个颜色插件，给输出内容上颜色
// https://github.com/chalk/chalk
const chalk = require('chalk')

// 语义化版本控制规范
// https://www.npmjs.com.cn/misc/semver/
const semver = require('semver')

// package.json 的配置
const packageConfig = require('../package.json')

// ShellJS 是在 node.js API 之上的 Unix shell 命令的可以移植的 (Windows/Linux/OS X) 实现
// https://github.com/shelljs/shelljs
const shell = require('shelljs')

function exec(cmd) {
  // 衍生一个 shell 并在 shell 中同步执行 command，且缓存任何产生的输出
  // https://nodejs.org/dist/latest-v10.x/docs/api/child_process.html#child_process_child_process_execsync_command_options
  return require('child_process').execSync(cmd).toString().trim()
}

// 版本要求
const versionRequirements = [
  {
    name: 'node',
    // 当前安装 node 版本
    currentVersion: semver.clean(process.version),
    // 项目 node 版本要求
    versionRequirement: packageConfig.engines.node
  }
]

// which linux命令 返回可执行程序的绝对路径 
if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    // 当前安装 npm 版本
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function () {
  const warnings = []

  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]

    // 判断当前系统安装版本是否满足项目要求版本
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      // 如果有不满足的，就保存一条警告
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  // 如果有警告，就打印出来
  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }

    console.log()
    // 退出当前进程 failure
    process.exit(1)
  }
}
