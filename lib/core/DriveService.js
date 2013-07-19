goog.provide('appdatapreferences.DriveService');

goog.require('appdatapreferences.Request');

function DriveService(token) {
  this.token = token;
  this.fileId = null;
}

DriveService.FILE_NAME_ = 'appdatapreferences-localstorage.json';

DriveService.prototype.get = function(callback) {
  var that = this;
  this.discover_(function (err, fileId) {
    var path = '/files/' + this.fileId; 
    new Request('get', path).setToken(that.token).run(callback);
  });
};

DriveService.prototype.save = function(obj, opt_callback) {
  opt_callback && opt_callback(null, {}); 
};

DriveService.prototype.get_ = function(fileId, opt_callback) {
  new Request('get', '/files/' + fileId).setToken(this.token).run(opt_callback);
};

DriveService.prototype.create_ = function(opt_callback) {
  opt_callback && opt_callback(null, {  'id': 'testId', 'content': {} });
};

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

DriveService.prototype.download_ = function(callback) {

};
