goog.provide('appdatapreferences.Request');

goog.require('goog.net.XhrIo');

/**
 * Request constructor.
 * @constructor
 * @param {String} method     The HTTP method.
 * @param {String} path       The relative path of the request.
 * @param {String} opt_params Optional query parameters.
 */
appdatapreferences.Request = function(method, path, opt_params) {
  this.method = method;
  this.path = path;
  this.params = opt_params || {};
  this.contentType = 'application/json';
  this.headers = {};
}

/**
 * @const
 * @private
 * The base URL of the Google Drive's v2 API.
 * @type {String}
 */
appdatapreferences.Request.DRIVE_BASE_URL_ =
    'https://www.googleapis.com/drive/v2';

/**
 * Sets the access token.
 * @param  {String} token The access token.
 * @return {Request}      Returns itself.
 */
appdatapreferences.Request.prototype.setToken = function(token) {
  this.token = token;
  return this;
};

/**
 * Sets the content type.
 * @param  {String} type The content type.
 * @return {Request}     Returns itself.
 */
appdatapreferences.Request.prototype.setContentType = function(type) {
  this.contentType = type;
  return this;
};

/**
 * Sets the body.
 * @param  {String} body The body of the request.
 * @return {Request}     Returns itself.
 */
appdatapreferences.Request.prototype.setBody = function(body) {
  this.body = body;
  return this;
};

/**
 * Sets a header.
 * @param  {String} key   The key of the header to set.
 * @param  {String} value The value of the header.
 * @return {Request}      Returns itself.
 */
appdatapreferences.Request.prototype.setHeader = function(key, value) {
  this.headers[key] = value;
  return this;
};

/**
 * Runs the request.
 * @param  {Function=} opt_callback Optional callback fn.
 */
appdatapreferences.Request.prototype.run = function(opt_callback) {

  var queryParams = [];
  for (var key in this.params || {}) {
    queryParams.push(key + '=' + encodeURI(this.params[key]));
  }

  var url = appdatapreferences.Request.DRIVE_BASE_URL_ +
      this.path + '?' + queryParams.join('&');
  this.headers['Authorization'] = 'Bearer ' + this.token || '';
  this.headers['Content-Type'] = this.contentType;
  goog.net.XhrIo.send(url, function(e){
    var err = !e.target.isSuccess() || e.target.getLastErrorCode();
    opt_callback &&
        opt_callback(err, e.target.getResponseJson());
  }, this.method, this.body, this.headers);
};
