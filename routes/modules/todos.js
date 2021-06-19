const express = require('express')
const router = express.Router()

const db = require('../../models')
const { Todo } = db

// 新增一筆 todo
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const { id:UserId } = req.user
  const name = req.body.name

  return Todo.create({ name, UserId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 查看單筆 todo 內容
router.get('/:id', (req, res) => {
  const { id:UserId } = req.user
  const id = req.params.id

  return Todo.findOne({ where: { id, UserId }})
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

// 修改單筆 todo
router.get('/:id/edit', (req, res) => {
  const { id:UserId } = req.user
  const id = req.params.id
 
  return Todo.findOne({ where: { id, UserId } })
      .then((todo) =>  res.render('edit', { todo: todo.get({ plain: true }) })) // 利用 get()轉換資料，將Sequelize處理過的多餘部分去除
      .catch(error => console.log(error))
})

// 更新修改的 todo 資訊
router.put('/:id', (req, res) => {
  const { id:UserId } = req.user
  const id = req.params.id
  const { name, isDone } = req.body // name 要用 req.body.name 從表單拿出來
  // return Todo.findById(id)
  return Todo.findOne({ where: { id, UserId } })
      .then(todo => { 
          todo.name = name
          todo.isDone = isDone === 'on' // 因為 isDone === 'on' 這是判斷句，一定是回傳 boolean 值
          // 若 checkbox 有被打勾，它的回傳值會被設定為 on，若沒被「打勾」，則它不會帶任何值。
          // 運算子優先序: JavaScript 裡邏輯運算子會比普通的 = 優先執行
          return todo.save()
      })
      .then(() => res.redirect(`/todos/${id}`))
      .catch(error => console.log(error))
})

// 刪除單筆 todo
router.delete('/:id', (req, res) => {
  const { id:UserId } = req.user
  const id = req.params.id 

  return Todo.findOne({ id, UserId })
      .then(todo => todo.destroy())
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
})


module.exports = router