#!/usr/bin/env node
const path = require('node:path')
const fsPromises = require('node:fs/promises')
const { Command } = require('commander')
const ora = require('ora')
const inquirer = require('inquirer')
const chalk = require('chalk')

const program = new Command()

program
  .argument('<path>', '文件夹路径')
  .option('-e, --empty', '清空文件夹，不删除文件夹本身')
  .action(execute)

program.parse(process.argv)

async function execute(dirPath, option) {
  const delPath = path.isAbsolute(dirPath) ? dirPath : path.join(process.cwd(), dirPath)

  const questions = [
    {
      type: 'confirm', // 使用 'confirm' 类型的问题
      name: 'isConfirmed', // 存储用户回答的键
      message: `确认删除文件(夹)吗？ ${delPath}`, // 显示给用户的提示信息
      default: false, // 默认值（可选）
    },
  ]
  const answers = await inquirer.prompt(questions)
  if (!answers.isConfirmed) {
    return console.log(chalk.red('已取消执行'))
  }
  await doDelete(delPath)
  if (option.empty) {
    fsPromises.mkdir(delPath)
  }
}

function doDelete(delPath) {
  console.log(chalk.green('开始删除'))
  const spinner = ora('正在删除...')
  spinner.start()
  const options = { recursive: true }
  return fsPromises
    .rm(delPath, options)
    .then(() => {
      console.log()
      console.log(chalk.green('删除完成'))
    })
    .catch((err) => {
      console.log()
      console.log(chalk.red('删除失败'))
      console.error(err)
      return Promise.reject(err)
    })
    .finally(() => spinner.stop())
}
