var express = require('express')
var bodyParser = require('body-parser')
var os = require('os')
var interfaces = os.networkInterfaces()
var addrs = []

// Set config.host ip
for (k in interfaces) {
  for (k2 in interfaces[k]) {
    var address = interfaces[k][k2]
    if(address.family == 'IPv4' && !address.internal)
      addrs.push(address.address)
  }
}

module.exports = function (app, config) {

  config.host = addrs.pop()

  // API session store
  var MongoStore = require('connect-mongo')(express)
    , sessions   = new MongoStore({
      url: config.db,
      clear_interval: 3600, //clear expired sessions hourly
      auto_reconnect: true,
      keep_alive: true
    })

  // Set app vars
  app.set('port', config.port);
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.set('views', config.root + '/app/views');

process.env['USER_ID'] = "Infocranner";
process.env['USER_KEY'] = "Insight1";

  // Configure API environment
  app.configure(function () {
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    //app.use(bodyParser.json())
    app.use(express.compress())
    app.use(express.logger('dev'))
    app.use(express.json({ limit:'10mb' }))
    app.use(express.urlencoded({ limit:'10mb' }))
    app.use(express.cookieParser())
    app.use(express.methodOverride())
    app.use(express.static(config.root + '/media'))
    app.use(express.static(config.root + '/public'))
    //Con esto incluyo la carpeta de modulos como estatica para poder accederla
    app.use(express.static(config.root + '/node_modules'))
    //app.use(express.favicon(config.root + '/public/img/favicon.ico'))
    app.use(express.session({
      store:sessions,
      secret:'7]fo+>+yR-&}}|!Kh>kC6Vbl:Krb)TrG&Ibkcu~AcRV/t[$+H+:_xb#a4G20MK>a',
      cookie:{maxAge:7 * 24 * 60 * 60 * 1000} // one week
    }))
    app.use(app.router)
    app.use(function (req, res) {
      res.render('404')
    })
  })

  // CORS support
  app.all('*', function (req, res, next) {
    if (!req.get('Origin')) return next();
    // use "*" here to accept any origin
    res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:9090');
    res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.set('Access-Control-Allow-Credentials', 'true');
    // res.set('Access-Control-Allow-Max-Age', 3600);
    if ('OPTIONS' == req.method) return res.send(200);
    next();
  })
}
