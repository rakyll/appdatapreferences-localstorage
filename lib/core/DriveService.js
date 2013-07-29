goog.provide('appdatapreferences.DriveService');

goog.require('appdatapreferences.Request');

/**
 * DriveService constructor.
 * @constructor
 * @param {[type]} token [description]
 */
appdatapreferences.DriveService = function(token) {
  this.token = token;
}

appdatapreferences.DriveService.prototype.token = null;

appdatapreferences.DriveService.prototype.fileId = null;

/**
 * The name of the file where preferences will be saved at.
 * @private
 * @type {String}
 */
appdatapreferences.DriveService.FILE_NAME_ =
    'appdatapreferences-localstorage.json';

/**
 * Sets an access token.
 * @param  {[type]} token An access token.
 */
appdatapreferences.DriveService.prototype.setToken = function(token) {
  this.token = token;
};

/**
 * Gets the preferences file, creates if none exists.
 * @param  {Function=} opt_callback Optional callback fn.
 */
appdatapreferences.DriveService.prototype.get = function(current, callback) {
  var that = this;
  this.discover_(current, function(err, file) {
    that.fileId = file && file['id'];
    callback(err, file);
  });
};

/**
 * Saves the obj to the preferences file on Drive.
 * @param  {Object} obj Object to be deserilized and saved.
 * @param  {Function=} opt_callback Optional callback.
 */
appdatapreferences.DriveService.prototype.save = function(obj, opt_callback) {
  opt_callback && opt_callback(null, {}); 
};

/**
 * Gets the file with the given id.
 * @param  {String} fileId       The ID of the file.
 * @param  {Function=} opt_callback Optional callback function.
 */
appdatapreferences.DriveService.prototype.get_ =
    function(fileId, opt_callback) {
  // TODO: handle 404 cases
  new appdatapreferences.Request(
      'get', '/files/' + fileId).setToken(this.token).run(opt_callback);
};

/**
 * Creates a new file under appdata with the prefrences file name.
 * @param  {Function=} opt_callback Optional callback.
 */
appdatapreferences.DriveService.prototype.create_ =
    function(current, opt_callback) {
  // TODO: response with content
  this.upload(this.fileId, current, opt_callback);
};

/**
 * Discovers the preferences file on user's Google Drive, inserts one
 * if there is none.
 * @param  {Function} callback The callback fn.
 */
appdatapreferences.DriveService.prototype.discover_ =
    function(current, callback) {
  var that = this;
  if (this.fileId) {
    return this.get_(this.fileId, callback);
  }
  // TODO: fix query with "appdata" in parents
  var query = { 'q': 'title = "' + appdatapreferences.DriveService.FILE_NAME_  + '"' };
  new appdatapreferences.Request('get', '/files', query)
      .setToken(this.token).run(function(err, result) {
    // if existing file for the prefrences under appdata
    // then reuse it.
    if (err) {
      return callback(err, null);
    }
    var file = (result && result['items'] && result['items'][0]);
    if (file) {
      return callback(err, file);
    } else {
      return that.create_(current, callback);  
    }
  });
};

appdatapreferences.DriveService.prototype.upload =
    function(fileId, content, callback) {
  var tag = 'a_unique_boundary_tag';
  var metadata = {
    'title': appdatapreferences.DriveService.FILE_NAME_,
    'parents': [{ 'id': 'appdata' }]
  };
  var body =
      '--' + tag + '\n' +
      'Content-Type: application/json; charset=UTF-8\n\n' +
      JSON.stringify(metadata) + '\n\n' +
      '--' + tag + '\n' +
      'Content-Type: application/json\n\n' + 
      JSON.stringify(content) + '\n\n' +
      '--' + tag + '--';

  // if fileId, it's a put request
  var method = !fileId ? 'post' : 'put',
      path = !fileId ? '/files' : '/files/' + fileId;
  new appdatapreferences.Request(method, path, { 'uploadType': 'multipart' })
      .setContentType('multipart/related; boundary="' + tag + '"')
      .setForUpload(true).setBody(body).setToken(this.token).run(callback);  
};

/**
 * Downloads the content of the file.
 * @param  {String}   fileId   The ID of the file.
 * @param  {Function} callback The callback function.
 */
appdatapreferences.DriveService.prototype.download =
    function(file, callback) {
  new appdatapreferences.Request('get', file['downloadUrl'])
      .setToken(this.token).run(callback);
};
