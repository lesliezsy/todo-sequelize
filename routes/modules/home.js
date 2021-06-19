const express = require('express')
const router = express.Router()

// MySQL 資料庫載入
const db = require('../../models')
const { User, Todo } = db

// 設定首頁路由
router.get('/', (req, res) => {
  const { id:UserId } = req.user
  User.findByPk(UserId)
    .then((user) => {
      if (!user) throw new Error('User not found.')

      return Todo.findAll({
        // { raw: true } 把多筆資料轉換成乾淨的js物件
        raw: true,
        nest: true,
        where: { UserId }
      })

    })
    .then((todos) => { return res.render('index', { todos }) })
    .catch((error) => { return res.status(422).json(error) })
})

module.exports = router