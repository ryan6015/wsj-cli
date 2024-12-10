#!/usr/bin/env node
const { Command } = require('commander')
const chalk = require('chalk')
const { exec } = require('child_process')

const program = new Command()

program.option('-d, --date <date>', '查看从date开始到现在的所有日志，如：2024-11-08').action(execute)

program.parse(process.argv)

function execute(option) {
  let since = option.date
  if (!since) {
    // 如果今天不是周一就获取这周一的日期，如果今天是周一就获取上周一的日期
    since = getLastMonday()
  }

  console.log(chalk.yellow(`since: ${since}`))

  const projects = [
    {
      path: 'E:\\cuavcloudweb\\cuavcloudcusweb',
      branch: 'remotes/origin/feature/develop',
    },
    {
      path: 'E:\\otafile_manager\\ota_manager_backend',
      branch: 'remotes/origin/user/wsj',
    },
  ]

  projects.forEach(({ path, branch }) => {
    getProjectGitLog(path, branch, since)
  })
}

/**
 * 如果今天不是周一就获取这周一的日期，如果今天是周一就获取上周一的日期
 * @returns {string}
 */
function getLastMonday() {
  const today = new Date()
  const dayOfWeek = today.getDay() // 获取当前是周几（0-周日, 1-周一, ... 6-周六）

  const daysToSubtract = dayOfWeek === 1 ? 7 : dayOfWeek // 如果今天是周一，减去 7 天，否则减去 dayOfWeek 天

  const lastMonday = new Date(today) // 创建一个当前日期的副本
  lastMonday.setDate(today.getDate() - daysToSubtract + 1) // 获取上周一的日期

  return `${lastMonday.getFullYear()}-${lastMonday.getMonth() + 1}-${lastMonday.getDate()}`
}

/**
 * 获取项目日志
 */
function getProjectGitLog(path, branch, since) {
  const gitLogCommand = `git log ${branch} --oneline --since="${since}" --format="%cd  %s" --date=short --no-merges --author=wangshujin@skyfend.cn`
  const shellOptions = {
    cwd: path,
  }

  exec(gitLogCommand, shellOptions, (error, stdout, stderr) => {
    console.log('==================================================')
    console.log(chalk.green(`项目目录：${path}`))
    console.log(gitLogCommand)
    console.log('==================================================')

    if (error) {
      console.error(`执行错误: ${error}`)
      return
    }

    if (stderr) {
      console.error(`标准错误: ${stderr}`)
      return
    }

    if (stdout) {
      console.log(stdout)
    } else {
      console.log('无提交')
    }
  })
}
