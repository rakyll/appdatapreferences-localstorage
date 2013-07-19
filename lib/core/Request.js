goog.provide('appdatapreferences.Request');

goog.require('goog.net.XhrIo');

function Request(method, path, opt_params) {
  this.method = method;
  this.path = path;
  this.params = opt_params || {};
  this.contentType = 'application/json';
  this.headers = {};
}

Request.DRIVE_BASE_URL_ = 'https://www.googleapis.com/drive/v2';

Request.prototype.setToken = function(token) {
  this.token = token;
};

Request.prototype.setContentType = function(type) {
  this.contentType = type;
};

Request.prototype.setBody = function(body) {
  this.body = body;
};

Request.prototype.setHeader = function(key, value) {
  this.headers[key] = value;
};

Request.prototype.run = function(opt_callback) {
  var url = Request.DRIVE_BASE_URL_ + this.path;
  this.headers['Authorization'] = 'Bearer ' + this.token || '';
  this.headers['Content-Type'] = this.contentType;
  goog.net.XhrIo.send(url, opt_callback, this.method, this.body, this.headers);
};
