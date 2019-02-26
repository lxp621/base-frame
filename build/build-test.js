'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'testing'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.test.conf')
const program = require('commander')

// 获取命令行参数
program
  .version('0.0.1')
  .option('-s --start', 'Start Service')
  .option('-p, --port', 'Service Port')
  .option('-pub, --publish', 'Publish Test Codes')
  .parse(process.argv)
// 是否需要启动服务
var isNeedStart = program.start
// 服务的端口号
var port = program.port || 8888

const spinner = ora('building for testing...')
spinner.start()

rm(path.join(config.test.assetsRoot, config.test.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build testing failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build testing complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))

    // 启动测试环境的服务
    if(isNeedStart){
      var express = require('express')
      var app = express()
      /*app.get('/m', function (req, res) {
        var fs = require('fs')
        var data= fs.readFileSync( path.join(__dirname , '../dist/test/index.html'),'utf-8')
        res.send(data)
        res.end()
      })*/
      app.use(express.static(path.join(__dirname , '../dist/test')))
      app.listen(port)
      console.log(chalk.cyan('启动测试服务，端口号为:'+port))
      var opn = require('opn')
      var uri = 'http://localhost:' + port
      opn(uri)
    }
  })
})
