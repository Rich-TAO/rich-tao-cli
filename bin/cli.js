#!/usr/bin/env node
const program = require('commander');
const download = require('download-git-repo')
const Handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const logSymbols = require('log-symbols')


const template = {
  'tpl-a':{
    url:'https://github.com/Rich-TAO/tpl-a',
    downloadUrl:'https://github.com:Rich-TAO/tpl-a#master',
    description:'模板a'
  },
  'tpl-b':{
    url:'https://github.com/Rich-TAO/tpl-b',
    downloadUrl:'https://github.com:Rich-TAO/tpl-b#master',
    description:'模板b'
  }
}

program.version('1.0.0')
program
    .command('init <templateName> <projectName>')
    .description('初始化项目')
    .action((templateName, projectName)=>{
      const spinner = ora(chalk.yellow('正在初始化项目...')).start()
      const {downloadUrl} = template[templateName]
      download(downloadUrl, projectName, { clone: true },(err)=> {
        if(err){
          spinner.fail(logSymbols.error , chalk.red(err))
        }else {
          spinner.succeed()
          inquirer
              .prompt([
                {
                  type:'input',
                  name:'name',
                  message:'请输入项目名称'
                },
                {
                  type:'input',
                  name:'author',
                  message:'请输入项目作者'
                },
                {
                  type:'input',
                  name:'description',
                  message:'请输入项目描述',
                  default:'A React project'
                }
              ])
              .then(answers => {
                let filename = `${projectName}/package.json`
                let data = fs.readFileSync(filename,'utf8')
                let result = Handlebars.compile(data)(answers)
                fs.writeFileSync(filename,result,'utf8')
                console.log(logSymbols.success , chalk.green('初始化项目成功'));
              });
        }
      })
    });

program
    .command('list')
    .description('查看可用模板')
    .action(()=>{
      for(let tpl in template){
        console.log(tpl,'-----',template[tpl].description)
      }
    })

program.parse(process.argv);