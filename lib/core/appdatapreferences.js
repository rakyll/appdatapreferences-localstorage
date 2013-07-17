goog.provide('appdatapreferences');

goog.require('goog.net.XhrIo');

function AppDataPreferences() {};

AppDataPreferences.prototype.syncInterval = null;

AppDataPreferences.prototype.isSyncing = false;

AppDataPreferences.prototype.fileId_ = null;

AppDataPreferences.prototype.opts = {};

AppDataPreferences.prototype.events = {
  'CHANGE': 'change',
  'SYNCING': 'syncing',
  'SYNCED': 'synced',
  'AUTH': 'autherror'
};

AppDataPreferences.prototype.configure = function(opts) {
  this.opts = opts || {};
};

AppDataPreferences.prototype.sync = function (opt_callback) {
  var that = this;
  console.log('syncing');
  this.get_(function(err, file) {
    var fileId = file && file['id'];
    that.save_(fileId, {}, opt_callback);
  });
};

AppDataPreferences.prototype.start = function() {
  var that = this;
  this.stop();
  this.syncInterval = setInterval(function() {
    that.sync(); // TODO: emit change events
  }, this.opts['interval'] || 3000);
};

AppDataPreferences.prototype.stop = function() {
  if (this.syncInterval) {
    clearInterval(this.syncInterval);
  }
};

AppDataPreferences.prototype.get_ = function(opt_callback) {
  //TODO
  var that = this;
  var create = function(opt_callback) {
    that.request_('post', '/files', null, 'application/json', function(e) {
      
    });
  };

  if (this.fileId_) {
    // get with fileId
    this.request_('get', '/files/' + this.fileId_, null, null, function(err, body) {
      // if non exist, create a new file
      // TODO: auto set fileId
      create(opt_callback);
    });
  } else {
    //discover(opt_callback);
    this.request_('get', '/files?query=', null, null, function(err, body) {
      // if no existing file, then create a new one.
      // todo: auto set file id
      create(opt_callback);
    });
  }
};

AppDataPreferences.prototype.save_ = function(fileId, obj, opt_callback) {
  // TODO
  var content = JSON.stringify(obj);
  opt_callback && opt_callback(null, {});
};

AppDataPreferences.prototype.request_ =
    function(method, path, body, contentType, opt_callback) {
  console.log(method, ' -- ', path, contentType);
  opt_callback && opt_callback(null, {});
};

var appdatapreferences = new AppDataPreferences();

goog.exportSymbol('appdatapreferences', appdatapreferences);
goog.exportSymbol('appdatapreferences.events', appdatapreferences.events);
goog.exportSymbol('appdatapreferences.configure', appdatapreferences.configure);
goog.exportSymbol('appdatapreferences.sync', appdatapreferences.sync);
goog.exportSymbol('appdatapreferences.start', appdatapreferences.start);
goog.exportSymbol('appdatapreferences.stop', appdatapreferences.stop);
