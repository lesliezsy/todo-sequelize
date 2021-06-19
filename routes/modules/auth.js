const express = require('express')
const router = express.Router()

const passport = require('passport')

// 在 authenticate 後指出要使用facebook方式做驗證
router.get('/facebook', passport.authenticate('facebook', {
  // 帶入參數 scope: ['email', 'public_profile'] ，向 Facebook 要求資料
  scope: ['email', 'public_profile']
}))

// Facebook 把資料發回來
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

module.exports = router