goog.provide('appdatapreferences');

goog.require('appdatapreferences.DriveService');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');

/**
 * AppdataPreferences constructor.
 */
function AppDataPreferences() {
  goog.events.EventTarget.call(this);
  this.onChangeCallback = null;
  this.syncInterval = null;
  this.opts = {};
};

/**
 * Inherits from EventTarget.
 * TODO: remove inheritance if no event is going to be emited.
 */
goog.inherits(AppDataPreferences, goog.events.EventTarget);

/**
 * Configure the 
 * @param  {[type]} opts [description]
 * @return {[type]}      [description]
 */
AppDataPreferences.prototype.configure = function(opts) {
  this.opts = opts || {};
};

/**
 * Syncs the localStorage entities with the remote preferences file.
 * @param  {Function=} opt_callback Optional callback fn.
 */
AppDataPreferences.prototype.sync = function (opt_callback) {
  var that = this;
  this.getDriveService_().get(function() {
    // TODO: if local is newer, replace 
  });
};

/**
 * Starts a periodic sync.
 */
AppDataPreferences.prototype.start = function() {
  var that = this;
  this.stop();
  // todo: settimeout
  this.syncInterval = setInterval(function() {
    that.sync(); // TODO: emit change events
  }, this.opts['interval'] || 15000);
};

/**
 * Stops the periodic sync tasks.
 */
AppDataPreferences.prototype.stop = function() {
  if (this.syncInterval) {
    clearInterval(this.syncInterval);
  }
};

/**
 * Registers the onChange callback function for change handling.
 * @param  {Function} callback Callback fn.
 */
AppDataPreferences.prototype.onChange = function(callback) {
  this.onChangeCallback = callback;
};

/**
 * Generates a new Google Drive service with the configured access token.
 * @return {appdatapreferences.DriveService} Generated Drive service object.
 */
AppDataPreferences.prototype.getDriveService_ = function() {
  return new DriveService(this.opts['token']);
};

var appdatapreferences = new AppDataPreferences();

/**
 * Export the symbols for the public interface.
 */
goog.exportSymbol('appdatapreferences', appdatapreferences);
goog.exportSymbol('appdatapreferences.configure', appdatapreferences.configure);
goog.exportSymbol('appdatapreferences.sync', appdatapreferences.sync);
goog.exportSymbol('appdatapreferences.start', appdatapreferences.start);
goog.exportSymbol('appdatapreferences.stop', appdatapreferences.stop);
goog.exportSymbol('appdatapreferences.onChange', appdatapreferences.onChange);
