const bcrypt = require('bcryptjs')
const passport = require('passport') // 把 Passport 套件本身載入進來
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const db = require('../models')
const { User } = db

module.exports = app => {
  // passport 初始化
  app.use(passport.initialize())
  app.use(passport.session())

  // 使用 LocalStrategy 做登入驗證
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return done(null, false, { message: req.flash('warning_msg', 'This email is not registered!') })
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: req.flash('warning_msg', 'Email or password incorrect.') })
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))

  // 使用 facebook 做登入驗證
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName'] // 和 Facebook 要求開放、提供user的特定資料
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json

    User.findOne({ where: { email } })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8) // 由於data model屬性 password 有設定必填，因此幫user設定一串亂碼
        // toString: 運用進位轉換將 Math.random產生的亂碼 變成英數參雜的亂碼，這裡選用 36 進位（10個數字+26個英文字母)
        // 最後截取字串後八碼
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }))

  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then((user) => {
        user = user.toJSON()
        done(null, user)
      }).catch(err => done(err, null))
  })
}