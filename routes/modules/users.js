const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

const db = require('../../models')
const { User } = db

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {

  const { name, email, password, confirmPassword } = req.body
  // 錯誤提醒
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({
      message: 'Please complete all required fields.'
    })
  }
  if (password !== confirmPassword) {
    errors.push({
      message: 'Password and confirm password do not match.'
    })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  
  // 檢查使用者是否已註冊
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      errors.push({ message: 'This user already exists.' })
      console.log('User already exists')
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(()=> req.flash('success_msg', 'You have successfully registered. Please log in.'))
      .then(() => res.redirect('/users/login'))
      .catch(err => console.log(err))
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You have been successfully logged out.')
  res.redirect('/users/login')
})

module.exports = router