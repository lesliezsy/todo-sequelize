// 總路由器
const express = require('express')
const router = express.Router()

// 引入各個模組的路由
const home = require('./modules/home')
const todos = require('./modules/todos')
const users = require('./modules/users')
const auth = require('./modules/auth')  

const { authenticator } = require('../middleware/auth') 

// 路由分流設定
router.use('/todos', authenticator, todos) // 加入驗證程序
router.use('/users', users)
router.use('/auth', auth) 
// 將網址結構符合 / 字串的 request 導向 home 模組
router.use('/', authenticator, home) // 加入驗證程序

// 匯出路由器
module.exports = router