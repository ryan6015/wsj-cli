#!/usr/bin/env node
const path = require('path')
const { Command } = require('commander')
const chalk = require('chalk')

const program = new Command()

program
  .name('wsj')
  .version('1.0.0')
  // 指定独立子命令的搜索位置
  .executableDir(path.join(__dirname, '../lib/'))
  .command('clear <path>', '删除指定文件夹')
  .command('gitLog', '查看近期git日志')
  // 默认选项，进入下拉选择
  .action(selectCommand)

async function selectCommand() {
  console.log(chalk.green('Hi~'), '目前支持以下功能：')
  console.log(chalk.yellow('clear <path>'), '删除指定文件夹')
  console.log(chalk.yellow('gitLog'), '查看近期git日志')
}

program.parse(process.argv)
