goog.provide('appdatapreferences');

goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');

function AppDataPreferences() {
  goog.events.EventTarget.call(this);
};

goog.inherits(AppDataPreferences, goog.events.EventTarget);

AppDataPreferences.prototype.syncInterval = null;

AppDataPreferences.prototype.opts = {};

AppDataPreferences.prototype.fileId_ = null;

AppDataPreferences.prototype.events = {
    SYNC_STARTED: 'syncing',
    SYNC_ABORTED: 'sync_aborted',
    SYNC_COMPLETED: 'synced'
};

AppDataPreferences.prototype.configure = function(opts) {
  this.opts = opts || {};
};

AppDataPreferences.prototype.sync = function (opt_callback) {
  var that = this;
  this.get_(function(err, file) {
    var fileId = file && file['id'];
    that.save_(fileId, localStorage, opt_callback);
  });
};

AppDataPreferences.prototype.start = function() {
  var that = this;
  this.stop();
  this.sync();
  this.syncInterval = setInterval(function() {
    that.sync(); // TODO: emit change events
  }, this.opts['interval'] || 15000);
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
    that.request_('post', '/files', null, null, function(e) {
      
    });
  };

  if (this.fileId_) {
    // get with fileId
    this.request_('get', '/files/' + this.fileId_, null, null, function(err, body) {
      // if non exist, create a new file
      // TODO: auto set fileId
    });
  } else {
    var query = '"appdata" in parents and title contains "appdatapreferences-localhost.json"';
    this.request_('get', '/files?q=' + encodeURI(query), null, null, function(err, body) {
      // if no existing file, then create a new one.
      // todo: auto set file id
      if (body['items'] && body['items'][0]){
        that.fileId_ = body['items'][0]['id'];
      } else {
        create(opt_callback);
      }
    });
  }
};

AppDataPreferences.prototype.emit_ = function(eventName, data) {
  console.log(this);
  this.dispatchEvent({type: eventName, data: data });
};

AppDataPreferences.prototype.save_ = function(fileId, obj, opt_callback) {
  var content = JSON.stringify(obj);
  opt_callback && opt_callback(null, {});
};

AppDataPreferences.prototype.request_ =
    function(method, path, params, body, contentType, opt_callback) {
  var that = this;
  var url = 'https://www.googleapis.com/drive/v2' + path,
      headers = {
        'content-type': contentType || 'application/json',
        'authorization': 'Bearer ' + this.opts['token'] || ''
      };
  var handler = function(e) {
    var err = !e.target.isSuccess();
    var statusCode = e.target.getStatus(); // 404
    var body = e.target.getResponseJson();

    if (err) {
      // emit error
      that.emit_(that.events.SYNC_ABORTED, { 
          statusCode: statusCode, body: body 
      });
    } else {
      opt_callback && opt_callback(err, body, statusCode);
    }
  };
  goog.net.XhrIo.send(url, handler, method, body, headers);
};

var appdatapreferences = new AppDataPreferences();

goog.exportSymbol('appdatapreferences', appdatapreferences);
goog.exportSymbol('appdatapreferences.events', appdatapreferences.events);
goog.exportSymbol('appdatapreferences.configure', appdatapreferences.configure);
goog.exportSymbol('appdatapreferences.sync', appdatapreferences.sync);
goog.exportSymbol('appdatapreferences.start', appdatapreferences.start);
goog.exportSymbol('appdatapreferences.stop', appdatapreferences.stop);

/* export events */
goog.exportSymbol('appdatapreferences.events.SYNC_ABORTED', appdatapreferences.events.SYNC_ABORTED);
goog.exportSymbol('appdatapreferences.events.SYNC_STARTED', appdatapreferences.events.SYNC_STARTED);
goog.exportSymbol('appdatapreferences.events.SYNC_COMPLETED', appdatapreferences.events.SYNC_COMPLETED);
