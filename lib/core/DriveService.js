goog.provide('appdatapreferences.DriveService');

goog.require('appdatapreferences.Request');

/**
 * DriveService constructor.
 * @constructor
 * @param {[type]} token [description]
 */
function DriveService(token) {
  this.token = token;
  this.fileId = null;
}

/**
 * The name of the file where preferences will be saved at.
 * @private
 * @type {String}
 */
DriveService.FILE_NAME_ = 'appdatapreferences-localstorage.json';

/**
 * Gets the preferences file, creates if none exists.
 * @param  {Function=} opt_callback Optional callback fn.
 */
DriveService.prototype.get = function(callback) {
  var that = this;
  this.discover_(function (err, fileId) {
    var path = '/files/' + this.fileId; 
    new Request('get', path).setToken(that.token).run(callback);
  });
};

/**
 * Saves the obj to the preferences file on Drive.
 * @param  {Object} obj Object to be deserilized and saved.
 * @param  {Function=} opt_callback Optional callback.
 */
DriveService.prototype.save = function(obj, opt_callback) {
  opt_callback && opt_callback(null, {}); 
};

/**
 * Gets the file with the given id.
 * @param  {String} fileId       The ID of the file.
 * @param  {Function=} opt_callback Optional callback function.
 */
DriveService.prototype.get_ = function(fileId, opt_callback) {
  new Request('get', '/files/' + fileId).setToken(this.token).run(opt_callback);
};

/**
 * Creates a new file under appdata with the prefrences file name.
 * @param  {Function=} opt_callback Optional callback.
 */
DriveService.prototype.create_ = function(opt_callback) {
  opt_callback && opt_callback(null, {  'id': 'testId', 'content': {} });
};

/**
 * Discovers the preferences file on user's Google Drive, inserts one
 * if there is none.
 * @param  {Function} callback The callback fn.
 */
DriveService.prototype.discover_ = function(callback) {
  var that = this;
  if (this.fileId) {
    return this.get_(this.fileId, callback);
  }

  var query = { 'q': '"appdata" in parents' };

  new Request('get', '/files', query)
      .setToken(this.token).run(function(err, items) {
    // if existing file for the prefrences under appdata
    // then reuse it.
    var file = (items && items['items'] && items['items'][0]);
    if (file) {
      that.fileId = file['id'];
    } else {
      return that.create_(callback);  
    }
  });
};

/**
 * Downloads the content of the file.
 * @param  {String}   fileId   The ID of the file.
 * @param  {Function} callback The callback function.
 */
DriveService.prototype.download_ = function(fileId, callback) {
  // TODO: implement it.
};
