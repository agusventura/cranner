var config   = require('./config')
  , express  = require('express')
  , mongoose = require('mongoose')
  , fs       = require('fs')
  , db       = {}

// connect mongoose
mongoose.connect(config.db, { server: { keepAlive: 1, auto_reconnect: true } })
var conn = mongoose.connection

// mongoose connection 'error'
conn.on('error', function () {
  console.log('\nFalló la conexión a la base:', config.db)
  mongoose.disconnect()
})

// mongoose connection 'open'
conn.on('open', function () {
  console.log('\nConectado a la base:', config.db)


  // config mongoose models
  var modelsPath = __dirname + '/app/models'
  fs.readdirSync(modelsPath).forEach(function (file) {
    if (file.indexOf('.js') >= 0)
      db[file.replace('.js', '')] = require(modelsPath + '/' + file)(mongoose, config)
  })

  // config Nomadic Fitness affiliate and admin
  //require('./config/admin')(config, db)

  // serve app
  http.listen(config.port, function () {
    console.log("Proyectos: http://" + config.host + ":" + config.port)
  })
})

// create app
var app   = express()
  , http  = require('http').createServer(app)

// config app
require('./config/express')(app, config)
require('./config/routes')(app, http, db)



/*app.get('/backend', function (req, res) {
  res.render('index')
})
*/
