const express = require('express')
const mustache = require('mustache-express')
const session = require('express-session')
const bodyParser = require('body-parser')
const parseurl = require('parseurl')
const app = express()
app.listen(3000, function(){
  console.log("GOOD TO GO!");
})

let sesh = ''
let errors = ''
let validUser = 0
let users = [{username: 'damien', password: 'maya'}]


app.engine('mustache', mustache())
app.set('view engine', 'mustache')
app.use(bodyParser.urlencoded({extended: false}
))
app.use(session({
  secret: 'boom',
  resave: false,
  saveUninitialized: true
}))
app.use(express.static('public'))





app.use(function(req, res, next){
  var views = req.session.views

  if(!views) {
    views = req.session.views = {}
  }

  var pathname = parseurl(req).pathname

  views[pathname] = (views[pathname] || 0) + 1

  next()
})

app.get('/', function(req, res, next){
  sesh = req.session

  for (var i = 0; i < users.length; i++) {
    if (users[i].username === sesh.username && users[i].password === sesh.password) {
      validUser = 1
    }
  }
  if (validUser === 1) {
      return res.render('index', {
        user: sesh.username,
        password: sesh.password,
        views: (sesh.views['/count'])
      })
  } else {
    return res.redirect('/login')
  }
})

  app.get('/login', function(req, res, next){
    res.render('login')
  })

  app.post('/login', function(req, res) {
    sesh = req.session
    sesh.username = req.body.username
    sesh.password = req.body.password
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === sesh.username && users[i].password === sesh.password) {
        return res.redirect('/')
    } else if (users[i].username === sesh.username && users[i].password !== sesh.password) {
        errors = 'Wrong Password'
        return res.redirect('/login')
    }
  }
  })

  app.get('/register', function(req, res, next) {
    res.render('register')
  })

  app.post('/register', function(req, res){
    sesh = req.session
    sesh.username = req.body.username
    sesh.password = req.body.password

    let newUser = {username: sesh.username, password: sesh.password}
    users.push(newUser)
    return res.redirect('/')
  })

  app.post('/logout', function (req, res) {
    userTrue = 0
    sesh = req.session
    sesh.views['/count'] = 0
    sesh.username = ''
    sesh.password = ''
    errors = ''
    return res.redirect('/')
})

app.post('/counter', function (req, res) {
  return res.redirect('/count')
})
app.get('/count', function (req, res, next) {
  return res.redirect('/')
})
