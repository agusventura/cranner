var request = require('request')

function Test (host, port, secure) {
  this._rootAPI = secure? 'https://' : 'http://'
  this._rootAPI += host + ':' + (port || 80)
  this._headers = {
    'Content-Type': 'application/json'
  }
  console.log('Testing '+this._rootAPI)
  console.log()
}

Test.prototype._req = function (method, path, data, next) {
  if(typeof data == 'function') {
    next = data
    data = {}
  }
  console.info(method.toUpperCase(), path)
  console.info(JSON.stringify(data, null, 2))
  request({
    method: method,
    uri: this._rootAPI + path,
    json: data,
    headers: this._headers
  }, function (err, res, body) {
    if(err) console.error(err)
    console.log('RESPONSE:', '['+res.statusCode+']')
    console.log(JSON.stringify(body, null, 2) || null)
    console.log()
    next(res, body)
  })
}

Test.prototype.get = function (path, next) {
  this._req('GET', path, next)
}

Test.prototype.post = function (path, data, next) {
  this._req('POST', path, data, next)
}

Test.prototype.put = function (path, data, next) {
  this._req('PUT', path, data, next)
}

Test.prototype.del = function (path, data, next) {
  this._req('DELETE', path, data, next)
}

Test.prototype.cookie = function (name, res) {
  var headers = this._headers
  res.headers['set-cookie'].filter(function(cookie) {
    if (!!~cookie.indexOf(name))
      headers['Cookie'] = cookie
  })
}

module.exports = Test