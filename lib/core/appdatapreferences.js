goog.provide('appdatapreferences');

function AppDataPreferences() {
  this.opts = {};
};

AppDataPreferences.prototype.syncTimer = null;

AppDataPreferences.prototype.configure = function(opts) {
  this.opts = opts || {};
};

AppDataPreferences.prototype.sync = function (opt_callback) {

};

AppDataPreferences.prototype.start = function() {

};

AppDataPreferences.prototype.stop = function() {

};

var appdatapreferences = new AppDataPreferences();

goog.exportSymbol('appdatapreferences', appdatapreferences);
goog.exportSymbol('appdatapreferences.configure', appdatapreferences.configure);
goog.exportSymbol('appdatapreferences.sync', appdatapreferences.sync);
goog.exportSymbol('appdatapreferences.start', appdatapreferences.start);
goog.exportSymbol('appdatapreferences.stop', appdatapreferences.stop);
