const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const { urlencoded } = require("body-parser")
const methodOverride = require('method-override')
const flash = require('connect-flash')

// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }

const routes = require('./routes')
const usePassport = require('./config/passport') // 載入 Passport 設定檔

const app = express()


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

app.use(urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)
app.use(flash()) 
app.use((req, res, next) => {
  // 設定本地變數 res.locals
  // 把 req.isAuthenticated() 回傳的布林值、以及user使用者資料，交接給 res 使用
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息
  next()
})

app.use(routes)

const PORT = 3000

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})