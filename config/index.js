var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , env = process.env.NODE_ENV || 'development'
  , port = 80
  , admin = {
    "role": "admin",
    "email": "thinkerton5@gmail.com",
    "password": "password1",
    "name": "John Barnack"
  }

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'express-mongoose-api-seed'
    },
    port: port,
    db: 'mongodb://localhost:27017/proyectos',
    admin: admin,
  },

  production: {
    root: rootPath,
    app: {
      name: 'express-mongoose-api-seed'
    },
    port: port,
    db: process.env.MONGOLAB_URI,
    admin: admin,
  }
};

module.exports = config[env];
