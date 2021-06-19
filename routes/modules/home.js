const express = require('express')
const router = express.Router()

// MySQL 資料庫載入
const db = require('../../models')
const { Todo } = db

// 設定首頁路由
router.get('/', (req, res) => {
  return Todo.findAll({
    // { raw: true } 把多筆資料轉換成乾淨的js物件
    raw: true,
    nest: true
  })
    .then((todos) => { return res.render('index', { todos: todos }) })
    .catch((error) => { return res.status(422).json(error) })
})

module.exports = router